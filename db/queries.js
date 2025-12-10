const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function getAllUsers() {
  const { rows } = await pool.query("SELECT * FROM users");
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
      true,
    ]
  );
}

module.exports = {
  getAllMessages,
  getAllUsers,
  registerNewUser,
};
