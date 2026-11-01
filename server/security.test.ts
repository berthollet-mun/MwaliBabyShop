import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

test('bcrypt ne stocke pas le mot de passe en clair', async () => {
  const password = 'a-development-password';
  const hash = await bcrypt.hash(password, 10);
  assert.notEqual(hash, password);
  assert.equal(await bcrypt.compare(password, hash), true);
  assert.equal(await bcrypt.compare('incorrect-password', hash), false);
});

test('un JWT signé avec un autre secret est rejeté', () => {
  const token = jwt.sign(
    { id: 'user-1', role: 'ADMIN' },
    'first-secret-with-more-than-32-chars',
    { algorithm: 'HS256', issuer: 'mwali-baby-shop', audience: 'mwali-admin' },
  );
  assert.throws(() => jwt.verify(token, 'another-secret-with-more-than-32-chars', {
    algorithms: ['HS256'],
    issuer: 'mwali-baby-shop',
    audience: 'mwali-admin',
  }));
});

test('les secrets réels ne sont pas présents dans le fichier d’exemple', async () => {
  const example = await import('node:fs/promises').then(fs => fs.readFile('.env.example', 'utf8'));
  assert.match(example, /ADMIN_INITIAL_PASSWORD=change-me/);
  assert.match(example, /RESPONSABLE_INITIAL_PASSWORD=change-me/);
});
