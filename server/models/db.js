import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DB_URL
  });
  
  pool.connect(() => {
    console.log('connected to the db');
  });

export const query = (text, params) => {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      })
    })
  }
  
 
/**
 * Create Meals Table
 */
export const createMenuTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      menu(
        meal_id UUID PRIMARY KEY NOT NULL,
        meal_name VARCHAR(100) NOT NULL,
        meal_description VARCHAR(200) NOT NULL,
        meal_price VARCHAR(50) NOT NULL
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Create Orders Table
 */
export const createOrdersTable = () => {
    const queryText =
      `CREATE TABLE IF NOT EXISTS
        orders(
          order_id UUID PRIMARY KEY NOT NULL,
          meal_id UUID NOT NULL,
          location TEXT NOT NULL,
          quantity INT NOT NULL,
          status TEXT NOT NULL,
          user_id UUID NOT NULL,
          order_date TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
          FOREIGN KEY (meal_id) REFERENCES menu (meal_id) ON DELETE CASCADE
        )`;
  
    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }

  /**
 * Create Users Table
 */
export const createUsersTable = () => {
    const queryText =
      `CREATE TABLE IF NOT EXISTS
        users(
          user_id UUID PRIMARY KEY NOT NULL,
          user_name TEXT NOT NULL,
          user_email VARCHAR(128) UNIQUE NOT NULL,
          user_password VARCHAR(128) NOT NULL,
          admin BOOLEAN NOT NULL
        )`;
  
    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }

/**
 * Drop Menu Table
 */
export const dropMenuTable = () => {
  const queryText = 'DROP TABLE IF EXISTS menu returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop Orders Table
 */
export const dropOrdersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS orders returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop Users Table
 */
export const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Create All Tables
 */
export const createAllTables = () => {
  createUsersTable();
  createOrdersTable();
  createMenuTable();
}

/**
 * Drop All Tables
 */
export const dropAllTables = () => {
  dropUsersTable();
  dropOrdersTable();
  dropMenuTable();
}

// pool.connect(() => {
//   console.log('client removed');
//   process.exit(0);
// });

  module.exports = {
    createOrdersTable,
    createMenuTable,
    createUsersTable,
    createAllTables,
    dropUsersTable,
    dropOrdersTable,
    dropMenuTable,
    dropAllTables,
    query
  };

  require('make-runnable');