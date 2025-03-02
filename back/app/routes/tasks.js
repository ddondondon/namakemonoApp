// namakemonoApp/back/app/routes/tasks.js

const express = require('express');
const router = express.Router();

// .env の読み込み
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// firebase.js と dbConnect.js の読み込み
const { verifyToken } = require('./firebase'); 
const pool = require('./dbConnect');

// GET /api/tasks
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await fetchTasks(req.userid);  // verifyToken でセットされた req.userid を使用
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// 新規タスクを作成
// POST /api/tasks
router.post('/', verifyToken, async (req, res) => {
  try {
    // リクエストボディからタスク情報を取得
    const { number, title, type, date, content, isCompleted } = req.body;
    // DB接続
    const client = await pool.connect();
    const now = new Date();

    const insertQuery = `
      INSERT INTO taskTbl (userid, number, title, type, date, content, isCompleted, insertdate, updatedate)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING number, title, type, date, content, isCompleted, insertdate, updatedate
    `;
    // verifyToken でセットされた req.userid を使用
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

// 既存タスクを更新
// PUT /api/tasks/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { number, title, type, date, content, isCompleted } = req.body;
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

    // 該当するタスクがなければエラー
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

// タスクを削除
// DELETE /api/tasks/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const client = await pool.connect();

    const deleteQuery = `
      DELETE FROM taskTbl
      WHERE number = $1
        AND userid = $2
      RETURNING number
    `;
    const result = await client.query(deleteQuery, [taskId, req.userid]);
    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;

// fetchTasks 関数
async function fetchTasks(userid) {
  let client;
  try {
    client = await pool.connect(); // プールからクライアント取得
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
    if (client) {
      client.release();
    }
  }
}
