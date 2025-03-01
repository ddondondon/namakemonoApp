// namakemonoApp/back/app/routes/templates.js

const express = require('express');
const router = express.Router();

// .env の読み込み）
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// firebase.js と dbConnect.js の読み込み
const { verifyToken } = require('./firebase');
const pool = require('./dbConnect');

// GET /api/tasks/templates
router.get('/', verifyToken, async (req, res) => {
    try {
        const templates = await fetchTemplates(req.userid);
        res.json(templates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching templates' });
    }
});

// POST /api/tasks/templates
router.post('/', verifyToken, async (req, res) => {
    try {
        // リクエストボディからテンプレート情報を取得
        const { type, title, content } = req.body;
        const client = await pool.connect();
        const now = new Date();

        const checkUserQuery = `
          SELECT COUNT(*) AS cnt 
          FROM templateTbl
          WHERE userid = $1 AND type = $2
        `;
        const checkResult = await client.query(checkUserQuery, [req.userid, type]);
        
        if (checkResult.rows[0].cnt > 0) {
            // レコードが存在する場合 → 更新
            const updateQuery = `
              UPDATE templateTbl
              SET title = $1,
                  content = $2,
                  updateDate = $3
              WHERE userid = $4 AND type = $5
            `;
            await client.query(updateQuery, [title, content, now, req.userid, type]);
        } else {
            // レコードが存在しない場合 → 追加
            const insertQuery = `
              INSERT INTO templateTbl (userid, type, title, content, insertDate, updateDate)
              VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await client.query(insertQuery, [req.userid, type, title, content, now, now]);
        }

        client.release();
        res.status(201).json({ message: 'Template updated/inserted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating/updating templates' });
    }
});

module.exports = router;

async function fetchTemplates(userid) {
    let client;
    try {
        client = await pool.connect();
        const query = `
          SELECT type, title, content
          FROM templateTbl
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
