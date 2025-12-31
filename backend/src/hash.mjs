import bcrypt from 'bcrypt';

const getHash = async () => {
  const password = 'Test1234!';
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

const hash = await getHash();
console.log(hash);
