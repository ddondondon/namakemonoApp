// back/app/app.js
const express = require('express');
const tasksRouter = require('./routes/tasks');
const app = express();
const cors = require('cors');

// JSONで受け取れるようにする
app.use(express.json());

// 全リクエストに対してCORS許可
app.use(cors());

// ルーティングの設定
// /api/tasks へのリクエストを tasksRouter に委譲
app.use('/api/tasks', tasksRouter);

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

