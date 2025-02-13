# tests/Dockerfile
FROM node:22

# 作業ディレクトリ設定
WORKDIR /app

# package.json と yarn.lock をコピー
COPY package*.json ./

# 依存関係のインストール
RUN yarn install

# テストコードをコンテナにコピー
COPY . .

# テストを実行するコマンドをデフォルトコマンドとして設定
CMD ["yarn", "test"]
