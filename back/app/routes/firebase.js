// namakemonoApp/back/app/routes/firebase.js

// Firebase Admin SDK の import
const admin = require('firebase-admin');

// 環境変数読み込み
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Firebase Admin SDK の初期化
admin.initializeApp({
  credential: admin.credential.cert("./vue-project-ee823-firebase-adminsdk-lhbyv-d0398de819.json"),
});

// DBプールを使うために dbConnect をインポート
const pool = require('./dbConnect');

/**
 * JWT を検証するミドルウェア
 * さらにユーザ情報(userTbl)の存在確認・作成/更新 も同時に実施し、
 * userTbl の主キー(userid)を req.userid にセット
 */
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).send("Unauthorized");
  }
  try {
    // トークン検証
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Firebase UID をいったん req.uid にセット
    req.uid = decodedToken.uid;

    // userTbl 登録・更新のための処理
    const client = await pool.connect();
    try {
      const now = new Date();
      const checkUserQuery = `SELECT COUNT(*) AS cnt FROM userTbl WHERE firebaseUser = $1`;
      const result = await client.query(checkUserQuery, [req.uid]);

      if (result.rows[0].cnt > 0) {
        // 既に存在する場合 → lastLoginDate を更新
        const updateQuery = `
          UPDATE userTbl
          SET lastLoginDate = $1
          WHERE firebaseUser = $2
        `;
        await client.query(updateQuery, [now, req.uid]);
        const selectRowQuery = `SELECT userid FROM userTbl WHERE firebaseUser = $1`;
        const resultUserId = await client.query(selectRowQuery, [req.uid]);
        req.userid = resultUserId.rows[0].userid;
      } else {
        // 存在しない場合 → 新規レコードを挿入
        const insertQuery = `
          INSERT INTO userTbl (firebaseUser, firstLoginDate, lastLoginDate)
          VALUES ($1, $2, $3)
          RETURNING userid 
        `;
        const insertResult = await client.query(insertQuery, [req.uid, now, now]);
        req.userid = insertResult.rows[0].userid;
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).send("Database error");
    } finally {
      client.release();
    }

    next();
  } catch (error) {
    console.error("トークン検証エラー:", error);
    return res.status(401).send("Unauthorized");
  }
}

// admin と verifyToken をexport
module.exports = {
  admin,
  verifyToken,
};
