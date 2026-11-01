import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';
import { runMigrations } from './migrate.js';

const categories = [
  ['cat-maternite', 'Maternité & Femmes Enceintes', 'maternite-femmes-enceintes', 'Vêtements de grossesse, allaitement & valises de maternité.', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80', 1],
  ['cat-layette', 'Layette & Nouveau-Nés', 'layette-nouveau-nes', 'Trousseaux de naissance, bodies & coffrets bébés.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80', 2],
  ['cat-enfants', 'Habits Enfants', 'habits-enfants', 'Ensembles, robes et habits pour filles & garçons.', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80', 3],
  ['cat-chaussures', 'Chaussures Enfants', 'chaussures-enfants', 'Chaussons, baskets & sandales confortables.', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80', 4],
  ['cat-beaute', 'Produits de Beauté Authentiques', 'produits-beaute-authentiques', 'Soins et cosmétiques authentiques pour toute la famille.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', 5],
];

const products = [
  {
    id: 'prod-1', name: 'Trousseau Complet de Maternité & Valise de Naissance', slug: 'trousseau-complet-maternite-valise-naissance', reference: 'MWL-MAT-01', price: '$45', categoryId: 'cat-maternite',
    description: 'Ensemble complet comprenant sac à langer multipoches, robes d’allaitement et trousseau nouveau-né.',
    images: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?w=900&auto=format&fit=crop&q=80'],
    characteristics: { material: 'Coton peigné & sac imperméable', sizes: ['M', 'L', 'XL'], availability: 'En stock' }, tags: ['Maternité', 'Valise'], featured: true,
  },
  {
    id: 'prod-2', name: 'Coffret Layette Royal Nouveau-Né 18 Pièces', slug: 'coffret-layette-royal-nouveau-ne-18-pieces', reference: 'MWL-LAY-01', price: '$35', categoryId: 'cat-layette',
    description: 'Coffret en pur coton pour bébé : bodies, pyjamas, bonnets, moufles et couverture.',
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&auto=format&fit=crop&q=80'],
    characteristics: { material: '100% Coton', sizes: ['0-3 mois', '3-6 mois'], availability: 'En stock' }, tags: ['Layette', 'Nouveau-né'], featured: true,
  },
  {
    id: 'prod-3', name: 'Ensemble Cérémonie & Fête Enfant', slug: 'ensemble-ceremonie-fete-enfant', reference: 'MWL-ENF-01', price: '$28', categoryId: 'cat-enfants',
    description: 'Tenue habillée et confortable pour fêtes et grandes occasions, filles et garçons.',
    images: ['https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=900&auto=format&fit=crop&q=80'],
    characteristics: { material: 'Coton supérieur & lin léger', availability: 'En stock' }, tags: ['Enfants', 'Cérémonie'], featured: true,
  },
  {
    id: 'prod-5', name: 'Baskets & Souliers Confort Enfants', slug: 'baskets-souliers-confort-enfants', reference: 'MWL-CHAU-01', price: '$22', categoryId: 'cat-chaussures',
    description: 'Chaussures ergonomiques souples avec semelle antidérapante.',
    images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=900&auto=format&fit=crop&q=80'],
    characteristics: { sizes: ['Pointures 18 à 37'], availability: 'En stock' }, tags: ['Chaussures', 'Baskets'], featured: true,
  },
  {
    id: 'prod-6', name: 'Gamme Soins Visage & Corps Authentiques', slug: 'gamme-soins-corps-visage-beaute-authentiques', reference: 'MWL-BEAU-01', price: '$18', categoryId: 'cat-beaute',
    description: 'Laits hydratants, huiles de soin et cosmétiques authentiques pour mamans et enfants.',
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80'],
    characteristics: { origin: 'Produits authentiques', availability: 'En stock' }, tags: ['Beauté', 'Soins'], featured: true,
  },
];

async function seedUser(name: string, email: string | undefined, password: string | undefined, role: 'ADMIN' | 'RESPONSABLE') {
  if (!email || !password) {
    console.info(`Compte ${role} ignoré : email ou mot de passe initial absent.`);
    return;
  }
  // Initial credentials are supplied by the store owner and must remain
  // compatible with the documented bootstrap accounts. Require a reasonable
  // floor here; the password can be rotated after the first sign-in.
  if (password.length < 8) throw new Error(`${role}_INITIAL_PASSWORD doit contenir au moins 8 caractères.`);
  const hash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, lower($2), $3, $4)
     ON CONFLICT (email) DO NOTHING`,
    [name, email, hash, role],
  );
}

export async function seed(): Promise<void> {
  await runMigrations();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const category of categories) {
      await client.query(
        `INSERT INTO categories (id, name, slug, description, image, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        category,
      );
    }

    for (const product of products) {
      await client.query(
        `INSERT INTO products
          (id, name, slug, reference, price, description, category_id, images, is_featured, characteristics, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10::jsonb,$11::jsonb)
         ON CONFLICT (id) DO NOTHING`,
        [product.id, product.name, product.slug, product.reference, product.price, product.description, product.categoryId, JSON.stringify(product.images), product.featured, JSON.stringify(product.characteristics), JSON.stringify(product.tags)],
      );
    }

    const banners = [
      ['banner-1', 'Maternité, Layette & Mode Enfants', 'Tout pour les femmes enceintes, les nouveau-nés et vos enfants à Goma.', 'MWALI BABY SHOP • GOMA', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1600&auto=format&fit=crop&q=80', '/categorie/layette-nouveau-nes', 1],
      ['banner-2', 'Habits & Chaussures pour Enfants', 'Des collections choisies avec soin pour chaque âge.', 'COLLECTION ENFANTS', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1600&auto=format&fit=crop&q=80', '/categorie/habits-enfants', 2],
      ['banner-3', 'Produits de Beauté Authentiques', 'Soins et cosmétiques pour mamans et toute la famille.', 'BEAUTÉ & SOINS', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop&q=80', '/categorie/produits-beaute-authentiques', 3],
    ];
    for (const banner of banners) {
      await client.query(
        `INSERT INTO banners (id, title, subtitle, badge, image, link, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
        banner,
      );
    }

    await client.query(
      `INSERT INTO site_settings
        (id, company_name, tagline, address, city, country, whatsapp_number, whatsapp_display, email, phone, opening_hours, facebook, instagram, tiktok, about_text, hero_headline, hero_subheadline, why_choose_us_title)
       VALUES ('default',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       ON CONFLICT (id) DO NOTHING`,
      [
        'MWALI Baby Shop', 'Grandir avec le style',
        'Route pavée, derrière la Mairie de Goma, 4ème entrée à droite, avant Hôtel La Versailles',
        'Goma', 'République Démocratique du Congo', '243971171975', '+243 971 171 975',
        'contact@mwalibabyshop.com', '+243 971 171 975', 'Lundi – Samedi : 08h30 à 19h00',
        'https://facebook.com/mwalibabyshop', 'https://instagram.com/mwalibabyshop', 'https://tiktok.com/@mwalibabyshop',
        'MWALI Baby Shop accompagne les mamans et les familles avec une sélection chaleureuse et rigoureuse à Goma.',
        'Bienvenue chez MWALI Baby Shop',
        'Maternité, layette, mode enfants, chaussures et produits de beauté authentiques à Goma.',
        'Pourquoi choisir MWALI Baby Shop ?',
      ],
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  await seedUser('Administration MWALI', process.env.ADMIN_EMAIL, process.env.ADMIN_INITIAL_PASSWORD, 'ADMIN');
  await seedUser('Responsable MWALI', process.env.RESPONSABLE_EMAIL, process.env.RESPONSABLE_INITIAL_PASSWORD, 'RESPONSABLE');
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  seed()
    .then(() => {
      console.info('Données initiales vérifiées.');
      return pool.end();
    })
    .catch(error => {
      console.error('Échec du seed :', error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
