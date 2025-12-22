const db = require("../db/queries");

const loadAllMessages = async (user) => {
  const messages = await db.getAllMessages();
  if (user && user.is_member) {
    await Promise.all(
      messages.map(async (message) => {
        const result = await db.getUserWithId(message.user_id);
        message.username = result[0].first_name + " " + result[0].last_name;
        console.log(message.username);
      })
    );
  } else {
    messages.map((message) => {
      message.time_posted = null;
    });
  }
  return messages;
};

module.exports = loadAllMessages;
