const bcrypt = require('bcrypt');

const users = [
  { name: 'Vicente Placencia', pass: 'Placencia.749' },
  { name: 'Jorge Barria', pass: 'Jorge.123' },
  { name: 'Matias Espinoza', pass: 'Matias.123' }
];

users.forEach(u => {
  const hash = bcrypt.hashSync(u.pass, 10);
  console.log(`${u.name}: ${hash}`);
});
