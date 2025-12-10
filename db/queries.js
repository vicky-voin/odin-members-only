const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function getAllUsers() {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
}

async function getUserWithUsername(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows;
}

async function getUserWithId(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows;
}

async function registerNewUser(userData) {
  await pool.query(
    "INSERT INTO users(username, password, firstName, lastName, isMember) VALUES($1, $2, $3, $4, $5)",
    [
      userData.username,
      userData.password,
      userData.firstName,
      userData.lastName,
      false,
    ]
  );
}

module.exports = {
  getAllMessages,
  getAllUsers,
  getUserWithId,
  getUserWithUsername,
  registerNewUser,
};
