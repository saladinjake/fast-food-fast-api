import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../models/db';

const Order = {
  /**
   * Create An Order
   * @param {object} req 
   * @param {object} res
   * @returns {object} order object 
   */
  async create(req, res) {
    const createQuery = `INSERT INTO
      orders(user_id, meal_id, order_id, location, quantity, order_date, status, )
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
    const values = [
      req.user_id,
      req.body.meal_id,
      uuidv4(),
      req.body.location,
      req.body.quantity,
      moment(new Date()),
      req.body.status,
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Get All Orders
   * @param {object} req 
   * @param {object} res 
   * @returns {object} orders array
   */
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM orders';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Get An Order
   * @param {object} req 
   * @param {object} res
   * @returns {object} order object
   */
  async getOne(req, res) {
    const text = 'SELECT * FROM orders WHERE id = $1 AND user_id = $2';
    try {
      const { rows } = await db.query(text, [req.params.id, req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'order not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  /**
   * Update An Order
   * @param {object} req 
   * @param {object} res 
   * @returns {object} updated order
   */
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM order WHERE id=$1 AND user_id = $2';
    const updateOneQuery =`UPDATE orders
      SET location=$1,quantity=$2,status=$3
      WHERE id=$4 AND user_id = $5 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id, req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'order not found'});
      }
      const values = [
        req.body.location || rows[0].location,
        req.body.quantity || rows[0].quantity,
        req.body.status || rows[0].status,
        moment(new Date()),
        req.params.id,
        req.user.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },
  /**
   * Delete An Order
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return status code 204 
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM orders WHERE id=$1 AND user_id = $2 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id, req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'order not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default Order;