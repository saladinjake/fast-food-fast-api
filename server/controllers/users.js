import uuidv4 from 'uuid/v4';
import db from '../models/db';
import Helper from './helpers';

const User = {
  /**
   * Sign-up A User
   * @param {object} req 
   * @param {object} res
   * @returns {object} User object 
   */
  async signup(req, res) {
    if (!req.body.user_email || !req.body.user_password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.user_email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const hashPassword = Helper.hashPassword(req.body.user_password);

    const createQuery = `INSERT INTO
      users(user_id, user_name, user_email, user_password, admin)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      uuidv4(),
      req.body.user_name,
      req.body.user_email,
      hashPassword,
      false
    ];
    
    try {
      const { rows } = await db.query(createQuery, values);
      const token = Helper.generateToken(rows[0].user_id);
      return res.status(201).send({ token, 'data': rows });
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
      }
      return res.status(400).send(error);
    }
  },

  /**
   * Login A User
   * @param {object} req 
   * @param {object} res
   * @returns {object} User object 
   */
  async login(req, res) {
    if (!req.body.user_email || !req.body.user_password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.user_email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const text = 'SELECT * FROM users WHERE user_email = $1';
    try {
      const { rows } = await db.query(text, [req.body.user_email]);
      if (!rows[0]) {
        return res.status(400).send({'message': 'The credentials you provided are incorrect'});
      }
      if(!Helper.comparePassword(rows[0].user_password, req.body.user_password)) {
        return res.status(400).send({ 'message': 'The credentials you provided are incorrect' });
      }
      const token = Helper.generateToken(rows[0].user_id);
      return res.status(200).send({ 'message': 'User logged in successfully', 'data': {'token': token} });
    } catch(error) {
      return res.status(400).send(error)
    }
  },

    /**
   * Get All Users
   * @param {object} req 
   * @param {object} res 
   * @returns {object} User object
   */
  async getAllUsers(req, res) {
    const getAllQuery = 'SELECT * FROM users';
    try {
      const { rows } = await db.query(getAllQuery);
      if(!rows[0]) {
        return res.status(404).send({'message': 'No Users found'});
      }
      return res.status(200).send({ 'message': 'users list', 'data': rows });
    } catch(error) {
      return res.status(400).send(error);
    }
  },


  /**
   * Delete A User
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return status code 204 
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE user_id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.body.user_id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(204).send({ 'message': 'user deleted sucessfully' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default User;