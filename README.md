# Connect to MySQL with Node.js using `mysql2/promise`

This guide demonstrates how to connect a Node.js application to a MySQL database using the `mysql2` library. We will focus on the promise-based API, which enables the use of modern `async/await` syntax for cleaner and more readable asynchronous code.

## Table of Contents

- Prerequisites
- Installation
- Project Setup for ES Modules
- Creating a Database Connection Pool
- Executing Queries
- Using Prepared Statements (Preventing SQL Injection)
- Putting It All Together
- Closing the Connection Pool

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 14.x or later is recommended.
- **npm** or **yarn**: The package manager that comes with Node.js.
- **MySQL Server**: A running instance of a MySQL database.
- **Database Credentials**: A database name, a user, and a password for your MySQL server.

## Installation

First, you need to add the `mysql2` package to your project.

```bash
npm install mysql2
```

Or, if you use `yarn`:

```bash
yarn add mysql2
```

## Project Setup for ES Modules

To use `import`/`export` syntax (ES Modules) in Node.js, add the following line to your `package.json` file:

```json
{
  "name": "node-mysql-example",
  "version": "1.0.0",
  "type": "module",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "mysql2": "^3.0.0"
  }
}
```

## Creating a Database Connection Pool

For server applications, it's best practice to use a connection pool instead of single connections. A pool manages a set of connections that can be reused, which improves performance and scalability by avoiding the overhead of creating a new connection for every query.

Create a new file, `db.js`, to configure and export the connection pool.

> **Security Note**: It is highly recommended to use environment variables for your database credentials instead of hardcoding them in your source code.

```javascript
// db.js
import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_secret_password',
  database: process.env.DB_NAME || 'my_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
```

**Connection Options:**
- `host`: Your MySQL server address (e.g., `localhost`).
- `user`: Your MySQL username.
- `password`: Your MySQL password.
- `database`: The name of the database to connect to.
- `waitForConnections`: If `true`, new requests will wait for a connection to become available if all are in use.
- `connectionLimit`: The maximum number of connections in the pool.

## Alternative: Using a Single Connection

While a connection pool is recommended for web servers and long-running applications, you might want to use a single connection for simple scripts or tasks that run once and then exit.

The `mysql2/promise` library allows you to create a single connection using `mysql.createConnection()`.

### Common Pitfall

A common mistake when using `async/await` is to mix it with `.then()` and `.catch()` in a way that produces unexpected results.

Consider this code:

```javascript
// This code has a bug!
import mysql from "mysql2/promise"

const db = await mysql.createConnection({
    // ... credentials
}).then(() => {
    console.log("database connected successfully")
}).catch((err) => console.log(err))

export default db; // This will export `undefined`
```

The problem here is that `await` already unwraps the promise. The `db` variable is assigned the return value of the `.then()` or `.catch()` block. Since `console.log()` returns `undefined`, the `db` variable will always be `undefined`, and you won't be able to use it to run queries.

### Correct Approach for Single Connections

The correct way to handle a single connection is to use a `try...catch...finally` block. This ensures that you can handle errors and, most importantly, that the connection is always closed.

Unlike a connection pool, **you must manually close a single connection** using `connection.end()` when you are finished with it.

Here is a complete example of connecting, querying, and closing a single connection:

```javascript
// single-connection-example.js
import mysql from 'mysql2/promise';

async function runScript() {
  let connection;
  try {
    // 1. Create the connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'your_secret_password',
      database: process.env.DB_NAME || 'my_database',
    });

    console.log('Database connected successfully!');

    // 2. Execute a query
    const [rows] = await connection.execute('SELECT "Single connection test" AS message');
    console.log('Query result:', rows[0].message);

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // 3. Close the connection when finished
    if (connection) await connection.end();
    console.log('Connection closed.');
  }
}

runScript();
```

## Executing Queries

The promise-based API makes it easy to execute queries using `async/await`. The `pool.execute()` and `pool.query()` methods automatically handle getting a connection from the pool and releasing it back when the query is done.

Here’s how you can execute a simple query:

```javascript
// app.js
import pool from './db.js';

async function simpleQuery() {
  try {
    const [rows, fields] = await pool.execute('SELECT "Hello, World!" AS message');
    console.log(rows[0].message); // "Hello, World!"
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

simpleQuery();
```

## Using Prepared Statements (Preventing SQL Injection)

To prevent SQL injection vulnerabilities, you must **always** use prepared statements when including variables in your queries. The `mysql2` library uses `?` as placeholders for values you want to safely insert into your query.

### Example: SELECT with a `WHERE` clause

```javascript
async function getUserById(userId) {
  try {
    const sql = 'SELECT * FROM users WHERE id = ?';
    // The array `[userId]` contains the values to be substituted for the `?` placeholders.
    const [rows] = await pool.execute(sql, [userId]);

    if (rows.length > 0) {
      console.log('User found:', rows[0]);
      return rows[0];
    } else {
      console.log('No user found with that ID.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}
```

### Example: INSERTing Data

```javascript
async function addUser(name, email) {
  try {
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [name, email]);

    console.log(`User added with ID: ${result.insertId}`);
    return result.insertId;
  } catch (error) {
    console.error('Error adding user:', error);
  }
}
```

## Putting It All Together

Here is a complete example in an `app.js` file that connects to the database, inserts a new record, and then queries for it.

For this example, assume you have a `users` table with the following structure:
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);
```

```javascript
// app.js
import pool from './db.js';

async function main() {
  console.log('Running database operations...');

  try {
    // Add a new user
    const newUserName = 'Jane Doe';
    const newUserEmail = 'jane.doe@example.com';
    const insertSql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    const [result] = await pool.execute(insertSql, [newUserName, newUserEmail]);
    const newUserId = result.insertId;
    console.log(`Successfully inserted user with ID: ${newUserId}`);

    // Query for the user we just added
    const selectSql = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.execute(selectSql, [newUserId]);

    if (rows.length > 0) {
      console.log('Found user:', rows[0]);
    } else {
      console.log('Could not find the user we just added.');
    }

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the pool when the application is shutting down
    await pool.end();
    console.log('Database pool closed.');
  }
}

main();
```

## Closing the Connection Pool

The connection pool should remain active for the entire lifecycle of your application. You should only call `pool.end()` when your application is gracefully shutting down. This ensures all pending queries are completed and all connections are closed properly.

As mentioned, when using `pool.execute()` or `pool.query()`, you do not need to manually release the connection—the library handles it for you.
