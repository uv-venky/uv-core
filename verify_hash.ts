import { compare } from 'bcrypt-ts';

async function test() {
  const hash = '$2b$12$cYnlTYHNhZg.gnEKx1OsnuEuyg5RI.wkv9tIS06NlKhixEjlKhg..';
  const matchAdmin = await compare('admin', hash);
  console.log('compare("admin", hash):', matchAdmin);

  const matchChangeme = await compare('changeme', hash);
  console.log('compare("changeme", hash):', matchChangeme);
}

test().catch(console.error);
