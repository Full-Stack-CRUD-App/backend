const pool = require('../utils/pool');

module.exports = class Item {
  id;
  description;
  qty;
  user_id;
  bought;

  constructor(row) {
    this.id = row.id;
    this.description = row.description;
    this.qty = row.qty;
    this.user_id = row.user_id;
    this.bought = row.bought;
  }

  static async insert({ description, qty, user_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO full_stack_items (description, qty, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [description, qty, user_id]
    );

    return new Item(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `SELECT * FROM full_stack_items
      WHERE user_id = $1`,
      [user_id]
    );

    return rows.map((row) => new Item(row));
  }
};
