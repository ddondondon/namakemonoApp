# ベースイメージとしてnode 22を使用
FROM node:22

# 作業ディレクトリを設定
WORKDIR /app

# Install PostgreSQL client tools
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# pg ライブラリのインストール（ Pool クラスを使用した接続管理のため）
RUN yarn add pg

# expressのインストール
RUN yarn add express

# CORS (Cross-Origin Resource Sharing) のインストール
RUN yarn add cors

# firebase-adminのインストール
RUN yarn add firebase-admin

# dotenvのインストール
RUN yarn add dotenv

# Expose the application port
EXPOSE 3000

# コピー
COPY . .

# 対話モード
CMD ["/bin/bash"]


