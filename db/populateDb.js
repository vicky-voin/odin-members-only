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
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        isMember BOOLEAN
    )`,
    (err) => {
      if (err) throw err;

      client.query(
        `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            user_id INTEGER REFERENCES users(id),
            text TEXT,
            timePosted TIMESTAMPTZ
        )`,
        (err) => {
          if (err) throw err;

          const users = [
            {
              username: "alice.anderson@example.com",
              firstName: "Alice",
              lastName: "Anderson",
              isMember: true,
            },
            {
              username: "bob.brown@example.com",
              firstName: "Bob",
              lastName: "Brown",
              isMember: false,
            },
            {
              username: "carol.clark@example.com",
              firstName: "Carol",
              lastName: "Clark",
              isMember: true,
            },
            {
              username: "dave.davis@example.com",
              firstName: "Dave",
              lastName: "Davis",
              isMember: false,
            },
          ];
          const insertUser =
            "INSERT INTO users (username, firstName, lastName, isMember) VALUES ($1, $2, $3, $4) RETURNING id";
          const userIds = [];

          (async () => {
            for (const user of users) {
              const res = await client.query(insertUser, [
                user.username,
                user.firstName,
                user.lastName,
                user.isMember,
              ]);
              userIds.push(res.rows[0].id);
            }

            const messages = [
              {
                userIdx: 0,
                text: "Hello, this is Alice!",
                timePosted: new Date(),
              },
              {
                userIdx: 1,
                text: "Bob here, nice to meet you.",
                timePosted: new Date(),
              },
              {
                userIdx: 2,
                text: "Carol joined the chat.",
                timePosted: new Date(),
              },
              { userIdx: 3, text: "Dave says hi!", timePosted: new Date() },
              {
                userIdx: 0,
                text: "Alice again, welcome everyone!",
                timePosted: new Date(),
              },
            ];
            const insertMessage =
              "INSERT INTO messages (user_id, text, timePosted) VALUES ($1, $2, $3)";
            for (const msg of messages) {
              await client.query(insertMessage, [
                userIds[msg.userIdx],
                msg.text,
                msg.timePosted,
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
