import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Helper = {
  /**
   * Hash Password Method
   * @param {string} user_password
   * @returns {string} returns hashed password
   */
  hashPassword(user_password) {
    return bcrypt.hashSync(user_password, bcrypt.genSaltSync(8))
  },
  /**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} user_password 
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, user_password) {
    return bcrypt.compareSync(user_password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} user_email
   * @returns {Boolean} True or False
   */
  isValidEmail(user_email) {
    return /\S+@\S+\.\S+/.test(user_email);
  },
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(user_id) {
    const token = jwt.sign({
      userId: user_id
    },
      process.env.SECRET, { expiresIn: '7d' }
    );
    return token;
  }
}

export default Helper;