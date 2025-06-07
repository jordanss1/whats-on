import mysql from 'mysql2/promise';
import keys from '../config/keys';

const db = mysql.createPool({
  host: keys.host,
  user: keys.dbUser,
  password: keys.dbPass,
  database: keys.dbName,
  waitForConnections: true,
  connectionLimit: 10,
});

export default db;
