import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { z, ZodError } from 'zod';
import { clearSession, createCsrf, issueSession, requireAuth, requireCsrf, requireRole, type SessionUser } from './auth.js';
import { config, cookieOptions } from './config.js';
import { pool } from './db/pool.js';

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || config.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origine non autorisée par CORS.'));
  },
}));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

const apiLimiter = rateLimit({ windowMs: 60_000, limit: 180, standardHeaders: 'draft-7', legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });
const metricLimiter = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false });
app.use('/api', apiLimiter);

const asyncRoute = (handler: (request: Request, response: Response, next: NextFunction) => Promise<unknown>) =>
  (request: Request, response: Response, next: NextFunction) => void handler(request, response, next).catch(next);

const csrfProtection = (request: Request, response: Response, next: NextFunction) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return next();
  return requireCsrf(request, response, next);
};

const slug = z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const shortText = z.string().trim().min(2).max(180);
const optionalText = z.string().trim().max(2_000_000).optional().nullable();
const roleSchema = z.enum(['ADMIN', 'RESPONSABLE']);

const productSchema = z.object({
  name: shortText,
  slug,
  reference: z.string().trim().min(2).max(80),
  price: z.string().trim().max(80).optional().nullable(),
  description: z.string().trim().max(10_000).default(''),
  categoryId: z.string().min(1).max(100),
  images: z.array(z.string().max(2_000_000)).max(12).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  characteristics: z.record(z.string(), z.unknown()).default({}),
  tags: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
}).strict();

const categorySchema = z.object({
  name: shortText,
  slug,
  description: z.string().trim().max(5000).default(''),
  image: z.string().max(2_000_000).default(''),
  order: z.number().int().min(0).max(10_000).default(0),
  isActive: z.boolean().default(true),
}).strict();

const bannerSchema = z.object({
  title: shortText,
  subtitle: optionalText,
  badge: optionalText,
  image: z.string().min(1).max(2_000_000),
  link: z.string().trim().max(500).optional().nullable(),
  order: z.number().int().min(0).max(10_000).default(0),
  isActive: z.boolean().default(true),
}).strict();

const userCreateSchema = z.object({
  name: shortText,
  email: z.email().max(254).transform(value => value.trim().toLowerCase()),
  role: roleSchema,
  avatar: optionalText,
  password: z.string().min(12).max(128),
}).strict();

const userUpdateSchema = z.object({
  name: shortText.optional(),
  email: z.email().max(254).transform(value => value.trim().toLowerCase()).optional(),
  role: roleSchema.optional(),
  avatar: optionalText,
  password: z.string().min(12).max(128).optional(),
}).strict();

const settingsSchema = z.object({
  companyName: z.string().trim().min(2).max(160).optional(),
  tagline: z.string().trim().max(500).optional(),
  address: z.string().trim().max(1000).optional(),
  city: z.string().trim().max(120).optional(),
  country: z.string().trim().max(120).optional(),
  whatsappNumber: z.string().trim().regex(/^\d{8,20}$/).optional(),
  whatsappDisplay: z.string().trim().max(50).optional(),
  email: z.email().max(254).optional(),
  phone: z.string().trim().max(50).optional(),
  openingHours: z.string().trim().max(500).optional(),
  facebook: z.string().trim().max(500).optional(),
  instagram: z.string().trim().max(500).optional(),
  tiktok: z.string().trim().max(500).optional(),
  aboutText: z.string().trim().max(20_000).optional(),
  heroHeadline: z.string().trim().max(500).optional(),
  heroSubheadline: z.string().trim().max(2000).optional(),
  whyChooseUsTitle: z.string().trim().max(500).optional(),
}).strict();

const productSelect = `
  id, name, slug, reference, price, description, category_id AS "categoryId", images,
  is_featured AS "isFeatured", is_active AS "isActive", characteristics, tags, views,
  whatsapp_clicks AS "whatsappClicks", created_at AS "createdAt", updated_at AS "updatedAt"`;
const categorySelect = `id, name, slug, description, image, sort_order AS "order", is_active AS "isActive", created_at AS "createdAt"`;
const bannerSelect = `id, title, subtitle, badge, image, link, sort_order AS "order", is_active AS "isActive"`;
const userSelect = `id, name, email, role, avatar, created_at AS "createdAt", last_login AS "lastLogin", must_change_password AS "mustChangePassword"`;
const settingsSelect = `
  id, company_name AS "companyName", tagline, address, city, country,
  whatsapp_number AS "whatsappNumber", whatsapp_display AS "whatsappDisplay", email, phone,
  opening_hours AS "openingHours", facebook, instagram, tiktok, about_text AS "aboutText",
  hero_headline AS "heroHeadline", hero_subheadline AS "heroSubheadline", why_choose_us_title AS "whyChooseUsTitle"`;

async function logActivity(user: SessionUser | undefined, action: string, entityType: string, details: string) {
  await pool.query(
    `INSERT INTO activity_logs (user_id, user_name, action, entity_type, details) VALUES ($1,$2,$3,$4,$5)`,
    [user?.id || null, user?.name || 'Visiteur', action, entityType, details],
  );
}

function updateStatement(table: string, id: string, data: Record<string, unknown>, columns: Record<string, string>, jsonFields: string[] = []) {
  const entries = Object.entries(data).filter(([key, value]) => columns[key] && value !== undefined);
  if (!entries.length) return null;
  const values = entries.map(([key, value]) => jsonFields.includes(key) ? JSON.stringify(value) : value);
  const sets = entries.map(([key], index) => `${columns[key]} = $${index + 1}`);
  values.push(id);
  return { text: `UPDATE ${table} SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`, values };
}

app.get('/api/health', asyncRoute(async (_request, response) => {
  await pool.query('SELECT 1');
  response.json({ status: 'ok' });
}));

app.get('/api/auth/csrf', (_request, response) => {
  response.json({ csrfToken: createCsrf(response) });
});
app.use('/api/auth', csrfProtection);

app.post('/api/auth/login', authLimiter, asyncRoute(async (request, response) => {
  const input = z.object({ email: z.email(), password: z.string().min(1).max(128) }).strict().parse(request.body);
  const result = await pool.query(
    `SELECT id, name, email, role, password_hash, must_change_password AS "mustChangePassword" FROM users WHERE email = lower($1)`,
    [input.email],
  );
  const user = result.rows[0];
  const valid = user ? await bcrypt.compare(input.password, user.password_hash) : false;
  if (!valid) {
    response.status(401).json({ error: 'Identifiants invalides.' });
    return;
  }
  const sessionUser: SessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
  await logActivity(sessionUser, 'Connexion réussie', 'auth', `Connexion de ${user.name}`);
  issueSession(response, sessionUser);
  response.json({ user: { ...sessionUser, mustChangePassword: user.mustChangePassword } });
}));

app.get('/api/auth/me', requireAuth, (request, response) => response.json({ user: request.user }));
app.post('/api/auth/logout', requireAuth, asyncRoute(async (request, response) => {
  await logActivity(request.user, 'Déconnexion', 'auth', `Déconnexion de ${request.user?.name}`);
  clearSession(response);
  response.clearCookie('mwali_csrf', { ...cookieOptions, httpOnly: false });
  response.json({ success: true });
}));

app.get('/api/storefront', asyncRoute(async (_request, response) => {
  const [categories, products, banners, settings] = await Promise.all([
    pool.query(`SELECT ${categorySelect} FROM categories WHERE is_active = TRUE ORDER BY sort_order, name`),
    pool.query(`SELECT ${productSelect} FROM products WHERE is_active = TRUE ORDER BY is_featured DESC, created_at DESC`),
    pool.query(`SELECT ${bannerSelect} FROM banners WHERE is_active = TRUE ORDER BY sort_order, created_at`),
    pool.query(`SELECT ${settingsSelect} FROM site_settings WHERE id = 'default'`),
  ]);
  response.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  response.json({ categories: categories.rows, products: products.rows, banners: banners.rows, settings: settings.rows[0] });
}));

app.post('/api/metrics/visit', metricLimiter, asyncRoute(async (_request, response) => {
  await pool.query(`INSERT INTO site_metrics (key, value) VALUES ('visits', 1) ON CONFLICT (key) DO UPDATE SET value = site_metrics.value + 1`);
  response.status(202).json({ success: true });
}));

app.post('/api/metrics/product-view/:id', metricLimiter, asyncRoute(async (request, response) => {
  await pool.query('UPDATE products SET views = views + 1 WHERE id = $1', [request.params.id]);
  response.status(202).json({ success: true });
}));

app.post('/api/metrics/whatsapp', metricLimiter, asyncRoute(async (request, response) => {
  const input = z.object({
    source: z.enum(['product_detail', 'quick_card', 'floating_button', 'contact_page', 'header', 'discuss_price']),
    productId: z.string().max(100).optional(),
    productName: z.string().max(180).optional(),
  }).strict().parse(request.body);
  await pool.query(
    `INSERT INTO whatsapp_click_events (product_id, product_name, source) VALUES ($1,$2,$3)`,
    [input.productId || null, input.productName || null, input.source],
  );
  if (input.productId) await pool.query('UPDATE products SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = $1', [input.productId]);
  response.status(202).json({ success: true });
}));

app.use('/api/admin', requireAuth, csrfProtection);

app.get('/api/admin/bootstrap', asyncRoute(async (request, response) => {
  const [categories, products, banners, settings, metrics, clicks, users, logs] = await Promise.all([
    pool.query(`SELECT ${categorySelect} FROM categories ORDER BY sort_order, name`),
    pool.query(`SELECT ${productSelect} FROM products ORDER BY created_at DESC`),
    pool.query(`SELECT ${bannerSelect} FROM banners ORDER BY sort_order, created_at`),
    pool.query(`SELECT ${settingsSelect} FROM site_settings WHERE id = 'default'`),
    pool.query(`SELECT value FROM site_metrics WHERE key = 'visits'`),
    pool.query(`SELECT id, created_at AS timestamp, product_id AS "productId", product_name AS "productName", source FROM whatsapp_click_events ORDER BY created_at DESC LIMIT 100`),
    request.user?.role === 'ADMIN' ? pool.query(`SELECT ${userSelect} FROM users ORDER BY created_at`) : Promise.resolve({ rows: [] }),
    request.user?.role === 'ADMIN' ? pool.query(`SELECT id, created_at AS timestamp, user_id AS "userId", user_name AS "userName", action, entity_type AS "entityType", details FROM activity_logs ORDER BY created_at DESC LIMIT 100`) : Promise.resolve({ rows: [] }),
  ]);
  response.json({
    categories: categories.rows, products: products.rows, banners: banners.rows, settings: settings.rows[0],
    totalVisits: Number(metrics.rows[0]?.value || 0), clickEvents: clicks.rows, users: users.rows, logs: logs.rows,
  });
}));

app.post('/api/admin/products', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const input = productSchema.parse(request.body);
  const result = await pool.query(
    `INSERT INTO products (name,slug,reference,price,description,category_id,images,is_featured,is_active,characteristics,tags)
     VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10::jsonb,$11::jsonb) RETURNING ${productSelect}`,
    [input.name,input.slug,input.reference,input.price,input.description,input.categoryId,JSON.stringify(input.images),input.isFeatured,input.isActive,JSON.stringify(input.characteristics),JSON.stringify(input.tags)],
  );
  await logActivity(request.user, 'Création produit', 'product', input.name);
  response.status(201).json({ product: result.rows[0] });
}));

app.patch('/api/admin/products/:id', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const input = productSchema.partial().parse(request.body);
  const statement = updateStatement('products', request.params.id, input, {
    name:'name', slug:'slug', reference:'reference', price:'price', description:'description', categoryId:'category_id', images:'images', isFeatured:'is_featured', isActive:'is_active', characteristics:'characteristics', tags:'tags',
  }, ['images', 'characteristics', 'tags']);
  if (!statement) return response.status(400).json({ error: 'Aucune modification fournie.' });
  const updated = await pool.query(statement.text, statement.values);
  if (!updated.rowCount) return response.status(404).json({ error: 'Produit introuvable.' });
  const result = await pool.query(`SELECT ${productSelect} FROM products WHERE id = $1`, [request.params.id]);
  await logActivity(request.user, 'Mise à jour produit', 'product', result.rows[0].name);
  response.json({ product: result.rows[0] });
}));

app.delete('/api/admin/products/:id', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING name', [request.params.id]);
  if (!result.rowCount) return response.status(404).json({ error: 'Produit introuvable.' });
  await logActivity(request.user, 'Suppression produit', 'product', result.rows[0].name);
  response.json({ success: true });
}));

app.post('/api/admin/categories', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const input = categorySchema.parse(request.body);
  const result = await pool.query(
    `INSERT INTO categories (name,slug,description,image,sort_order,is_active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${categorySelect}`,
    [input.name,input.slug,input.description,input.image,input.order,input.isActive],
  );
  await logActivity(request.user, 'Création catégorie', 'category', input.name);
  response.status(201).json({ category: result.rows[0] });
}));

app.patch('/api/admin/categories/:id', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const input = categorySchema.partial().parse(request.body);
  const statement = updateStatement('categories', request.params.id, input, { name:'name',slug:'slug',description:'description',image:'image',order:'sort_order',isActive:'is_active' });
  if (!statement) return response.status(400).json({ error: 'Aucune modification fournie.' });
  const updated = await pool.query(statement.text, statement.values);
  if (!updated.rowCount) return response.status(404).json({ error: 'Catégorie introuvable.' });
  const result = await pool.query(`SELECT ${categorySelect} FROM categories WHERE id = $1`, [request.params.id]);
  await logActivity(request.user, 'Mise à jour catégorie', 'category', result.rows[0].name);
  response.json({ category: result.rows[0] });
}));

app.delete('/api/admin/categories/:id', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING name', [request.params.id]);
  if (!result.rowCount) return response.status(404).json({ error: 'Catégorie introuvable.' });
  await logActivity(request.user, 'Suppression catégorie', 'category', result.rows[0].name);
  response.json({ success: true });
}));

app.post('/api/admin/banners', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const input = bannerSchema.parse(request.body);
  const result = await pool.query(
    `INSERT INTO banners (title,subtitle,badge,image,link,sort_order,is_active) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ${bannerSelect}`,
    [input.title,input.subtitle,input.badge,input.image,input.link,input.order,input.isActive],
  );
  await logActivity(request.user, 'Création bannière', 'banner', input.title);
  response.status(201).json({ banner: result.rows[0] });
}));

app.patch('/api/admin/banners/:id', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const input = bannerSchema.partial().parse(request.body);
  const statement = updateStatement('banners', request.params.id, input, { title:'title',subtitle:'subtitle',badge:'badge',image:'image',link:'link',order:'sort_order',isActive:'is_active' });
  if (!statement) return response.status(400).json({ error: 'Aucune modification fournie.' });
  const updated = await pool.query(statement.text, statement.values);
  if (!updated.rowCount) return response.status(404).json({ error: 'Bannière introuvable.' });
  const result = await pool.query(`SELECT ${bannerSelect} FROM banners WHERE id = $1`, [request.params.id]);
  await logActivity(request.user, 'Mise à jour bannière', 'banner', result.rows[0].title);
  response.json({ banner: result.rows[0] });
}));

app.delete('/api/admin/banners/:id', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const result = await pool.query('DELETE FROM banners WHERE id = $1 RETURNING title', [request.params.id]);
  if (!result.rowCount) return response.status(404).json({ error: 'Bannière introuvable.' });
  await logActivity(request.user, 'Suppression bannière', 'banner', result.rows[0].title);
  response.json({ success: true });
}));

app.patch('/api/admin/settings', requireRole('ADMIN', 'RESPONSABLE'), asyncRoute(async (request, response) => {
  const input = settingsSchema.parse(request.body);
  const statement = updateStatement('site_settings', 'default', input, {
    companyName:'company_name',tagline:'tagline',address:'address',city:'city',country:'country',whatsappNumber:'whatsapp_number',whatsappDisplay:'whatsapp_display',email:'email',phone:'phone',openingHours:'opening_hours',facebook:'facebook',instagram:'instagram',tiktok:'tiktok',aboutText:'about_text',heroHeadline:'hero_headline',heroSubheadline:'hero_subheadline',whyChooseUsTitle:'why_choose_us_title',
  });
  if (!statement) return response.status(400).json({ error: 'Aucune modification fournie.' });
  await pool.query(statement.text, statement.values);
  const result = await pool.query(`SELECT ${settingsSelect} FROM site_settings WHERE id = 'default'`);
  await logActivity(request.user, 'Mise à jour paramètres', 'setting', 'Paramètres de la boutique mis à jour');
  response.json({ settings: result.rows[0] });
}));

app.post('/api/admin/users', requireRole('ADMIN'), asyncRoute(async (request, response) => {
  const input = userCreateSchema.parse(request.body);
  const hash = await bcrypt.hash(input.password, 12);
  const result = await pool.query(
    `INSERT INTO users (name,email,password_hash,role,avatar) VALUES ($1,lower($2),$3,$4,$5) RETURNING ${userSelect}`,
    [input.name,input.email,hash,input.role,input.avatar],
  );
  await logActivity(request.user, 'Création utilisateur', 'user', input.email);
  response.status(201).json({ user: result.rows[0] });
}));

app.patch('/api/admin/users/:id', requireRole('ADMIN'), asyncRoute(async (request, response) => {
  const input = userUpdateSchema.parse(request.body);
  const data: Record<string, unknown> = { ...input };
  if (input.password) {
    data.passwordHash = await bcrypt.hash(input.password, 12);
    data.mustChangePassword = true;
    delete data.password;
  }
  const statement = updateStatement('users', request.params.id, data, { name:'name',email:'email',role:'role',avatar:'avatar',passwordHash:'password_hash',mustChangePassword:'must_change_password' });
  if (!statement) return response.status(400).json({ error: 'Aucune modification fournie.' });
  const updated = await pool.query(statement.text, statement.values);
  if (!updated.rowCount) return response.status(404).json({ error: 'Utilisateur introuvable.' });
  const result = await pool.query(`SELECT ${userSelect} FROM users WHERE id = $1`, [request.params.id]);
  await logActivity(request.user, 'Mise à jour utilisateur', 'user', result.rows[0].email);
  response.json({ user: result.rows[0] });
}));

app.delete('/api/admin/users/:id', requireRole('ADMIN'), asyncRoute(async (request, response) => {
  if (request.params.id === request.user?.id) return response.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' });
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING email', [request.params.id]);
  if (!result.rowCount) return response.status(404).json({ error: 'Utilisateur introuvable.' });
  await logActivity(request.user, 'Suppression utilisateur', 'user', result.rows[0].email);
  response.json({ success: true });
}));

app.use((_request, response) => response.status(404).json({ error: 'Route introuvable.' }));

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    response.status(400).json({ error: 'Données invalides.', fields: z.flattenError(error).fieldErrors });
    return;
  }
  const databaseError = error as { code?: string };
  if (databaseError.code === '23505') return response.status(409).json({ error: 'Une valeur unique existe déjà (email, slug ou référence).' });
  if (databaseError.code === '23503') return response.status(409).json({ error: 'Cette donnée est encore utilisée et ne peut pas être supprimée.' });
  console.error('Erreur API :', error instanceof Error ? error.message : error);
  response.status(500).json({ error: 'Erreur interne du serveur.' });
});

app.listen(config.port, () => {
  console.info(`API MWALI prête sur le port ${config.port}.`);
});
