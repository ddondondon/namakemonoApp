// namakemonoApp/back/app/routes/dbConnect.js

const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// SSL利用フラグ（.env の DB_SSL が 'true' ならSSLを有効にする）
const useSSL = (process.env.DB_SSL === 'true');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
});

// 接続確認用のログ
console.log("DB_HOST=", process.env.DB_HOST);

// プールオブジェクトをエクスポート
module.exports = pool;
