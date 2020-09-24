import uuidv4 from 'uuid/v4';
import db from '../models/db';

const Menu = {
  /**
   * Create A Meal
   * @param {object} req 
   * @param {object} res
   * @returns {object} meal object 
   */
  async create(req, res) {
    const createQuery = `INSERT INTO
      menu(meal_id, meal_name, meal_description, meal_price)
      VALUES($1, $2, $3, $4)
      returning *`;
    const values = [
      uuidv4(),
      req.body.meal_name,
      req.body.meal_description,
      req.body.meal_price,
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Get All Meals
   * @param {object} req 
   * @param {object} res 
   * @returns {object} Meals array
   */
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM menu';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({ "Menu": rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Get A Single Meal
   * @param {object} req 
   * @param {object} res
   * @returns {object} meal object
   */
  async getOne(req, res) {
    const text = 'SELECT * FROM menu WHERE meal_id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'Meal not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },

  /**
   * Delete A Meal
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return status code 204 
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM menu WHERE meal_id=$1';
    try {
      const { rows } = await db.query(deleteQuery);
      if(!rows[0]) {
        return res.status(404).send({'message': 'meal not found'});
      }
      return res.status(204).send({ 'message': 'meal deleted succefully' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default Menu;