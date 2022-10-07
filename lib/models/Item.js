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

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT * from full_stack_items
      WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return new Item(rows[0]);
  }

  static async updateById(id, newAttributes) {
    const item = await Item.getById(id);
    if (!item) return null;
    const updatedData = { ...item, ...newAttributes };
    const { rows } = await pool.query(
      `UPDATE full_stack_items
      SET description = $2, qty = $3, bought = $4
      WHERE id = $1
      RETURNING *`,
      [id, updatedData.description, updatedData.qty, updatedData.bought]
    );
    return new Item(rows[0]);
  }
};
