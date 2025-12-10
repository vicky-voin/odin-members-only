const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function getAllUsers() {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
}

module.exports = {
  getAllMessages,
  getAllUsers,
};
