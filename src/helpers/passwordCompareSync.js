import bcrypt from 'bcrypt';

const passwordCompareSync = (currentPassword, passwordHash) =>
    bcrypt.compareSync(currentPassword, passwordHash);

export default passwordCompareSync;