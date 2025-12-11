require("dotenv").config();
const { Client } = require("pg");

const client = new Client(
  process.argv.includes("DEV")
    ? {
        user: process.env.DB_USER,
        host: "localhost",
        database: "odin_members_only",
        password: process.env.DB_PW,
        port: 5432,
      }
    : {
        connectionString: process.env.DB_URL,
      }
);

client.connect();

client.query("BEGIN", (err) => {
  if (err) throw err;

  client.query(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(255),
        password VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        is_member BOOLEAN
    )`,
    (err) => {
      if (err) throw err;

      client.query(
        `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            user_id INTEGER REFERENCES users(id),
            text TEXT,
            time_posted TIMESTAMPTZ
        )`,
        (err) => {
          if (err) throw err;

          const users = [
            {
              username: "alice.anderson@example.com",
              first_name: "Alice",
              last_name: "Anderson",
              is_member: true,
            },
            {
              username: "bob.brown@example.com",
              first_name: "Bob",
              last_name: "Brown",
              is_member: false,
            },
            {
              username: "carol.clark@example.com",
              first_name: "Carol",
              last_name: "Clark",
              is_member: true,
            },
            {
              username: "dave.davis@example.com",
              first_name: "Dave",
              last_name: "Davis",
              is_member: false,
            },
          ];
          const insertUser =
            "INSERT INTO users (username, first_name, last_name, is_member) VALUES ($1, $2, $3, $4) RETURNING id";
          const userIds = [];

          (async () => {
            for (const user of users) {
              const res = await client.query(insertUser, [
                user.username,
                user.first_name,
                user.last_name,
                user.is_member,
              ]);
              userIds.push(res.rows[0].id);
            }

            const messages = [
              {
                user_id: 0,
                text: "Hello, this is Alice!",
                time_posted: new Date(),
              },
              {
                user_id: 1,
                text: "Bob here, nice to meet you.",
                time_posted: new Date(),
              },
              {
                user_id: 2,
                text: "Carol joined the chat.",
                time_posted: new Date(),
              },
              { user_id: 3, text: "Dave says hi!", time_posted: new Date() },
              {
                user_id: 0,
                text: "Alice again, welcome everyone!",
                time_posted: new Date(),
              },
            ];
            const insertMessage =
              "INSERT INTO messages (user_id, text, time_posted) VALUES ($1, $2, $3)";
            for (const msg of messages) {
              await client.query(insertMessage, [
                userIds[msg.user_id],
                msg.text,
                msg.time_posted,
              ]);
            }

            client.query("COMMIT", (err) => {
              if (err) throw err;
              client.end();
            });
          })();
        }
      );
    }
  );
});
