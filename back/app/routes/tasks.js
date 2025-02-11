// back/app/routes/tasks.js
const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

//dotenv.config();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');
const useSSL = (process.env.DB_SSL === 'true');

// Firebase Admin SDK初期化
admin.initializeApp({
  credential: admin.credential.cert("./vue-project-ee823-firebase-adminsdk-lhbyv-d0398de819.json"),
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // DB_SSL が 'true' の場合のみ SSL オプションを付与
  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
});
console.log(process.env.DB_HOST);

// GET /api/tasks
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await fetchTasks(req.userid);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

module.exports = router;

// [追加] POST /api/tasks
// 新規タスクを作成
router.post('/', verifyToken, async (req, res) => {
  try {
    // リクエストボディからタスク情報を取得
    const { number,title, type, date, content, isCompleted } = req.body;
    // DB接続
    const client = await pool.connect();
    const now = new Date();
    const insertQuery = `
      INSERT INTO taskTbl (userid, number, title, type, date, content, isCompleted, insertdate, updatedate)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING number, title, type, date, content, isCompleted, insertdate, updatedate
    `;
    const values = [req.userid, number, title, type, date, content, isCompleted, now, now];
    const result = await client.query(insertQuery, values);
    client.release();
      // 作成したタスク情報を返す
      res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating task' });
  }
});
// [追加] PUT /api/tasks/:id
// 既存タスクを更新
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // リクエストボディから更新内容を取得
    const { number,title, type, date, content, isCompleted } = req.body;
    const client = await pool.connect();
    const now = new Date();
    const updateQuery = `
      UPDATE taskTbl
      SET title = $1,
          type = $2,
          date = $3,
          content = $4,
          isCompleted = $5,
          updatedate = $6 
      WHERE number = $7
        AND userid = $8
      RETURNING number, title, type, date, content, isCompleted, insertdate, updatedate
    `;
    const values = [title, type, date, content, isCompleted, now, number, req.userid];
    const result = await client.query(updateQuery, values);
    client.release(); 
    // 該当するタスクがなければエラーを返す
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    } 
      // 更新後のタスク情報を返す
      res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating task' });
  }
});
// [追加] DELETE /api/tasks/:id
// タスクを削除
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const  taskId  = req.params.id;
    const client = await pool.connect();
    const deleteQuery = `
      DELETE FROM taskTbl
      WHERE number = $1
        AND userid = $2
      RETURNING number
    `;
    const result = await client.query(deleteQuery, [taskId, req.userid]);
    client.release(); 
    // 該当するタスクがなければエラーを返す
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// JWTを検証するミドルウェア
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid; // デコードされた`uid`をリクエストに追加
    // 取得したユーザが既にuserTblに存在する場合はupdate,存在しない場合はinsert
    // userTbl登録処理 start
    const client = await pool.connect();
    try {
      const now = new Date();
      const checkUserQuery = `SELECT COUNT(*) AS cnt FROM userTbl WHERE firebaseUser = $1`;
      const result = await client.query(checkUserQuery, [req.uid]);

      //      if (parseInt(result.rows[0].count, 10) > 0) {
	console.log("result.rows=",result.rows,"result.rows[0].cnt=",result.rows[0].cnt);
      if (result.rows[0].cnt > 0) {
        // ユーザが存在する場合、lastLoginDateを更新
        const updateQuery = `
          UPDATE userTbl
          SET lastLoginDate = $1
          WHERE firebaseUser = $2
        `;
        await client.query(updateQuery, [now, req.uid]);
        const selectRowrQuery = `SELECT userid FROM userTbl WHERE firebaseUser = $1`;
        const resultUserId = await client.query(selectRowrQuery, [req.uid]);
	      console.log("updateQuery=",updateQuery,"req.uid=",req.uid);
        req.userid = resultUserId.rows[0].userid;
      } else {
        // ユーザが存在しない場合、レコードを挿入
        const insertQuery = `
          INSERT INTO userTbl (firebaseUser, firstLoginDate, lastLoginDate)
          VALUES ($1, $2, $3)
          RETURNING userid 
        `;
	console.log("insertQuery=",insertQuery,"req.uid=",req.uid); 
	const insertResult = await client.query(insertQuery, [req.uid, now, now]);
        req.userid = insertResult.rows[0].userid; // 挿入後の userid をリクエストに追加
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).send("Database error");
    } finally {
      client.release();
    }
    // userTbl登録処理 end
    next();
  } catch (error) {
    console.error("トークン検証エラー:", error);
    res.status(401).send("Unauthorized");
  }
}

async function fetchTasks(userid) {
  let client;
  try {
    client = await pool.connect();       // プールからクライアントを取得
    const query = `
      SELECT
        number,
        title,
        type,
        date,
        content,
        iscompleted AS "isCompleted"
      FROM taskTbl
      WHERE userid = $1
      `;
    const result = await client.query(query, [userid]);
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  } finally {
    // プール自体は閉じず、使用したclientだけ返却
    if (client) {
      client.release();
    }
  }
}
