# ベースイメージとしてnode 22を使用(2025年1月時点LTS最新)
FROM node:22

# 作業ディレクトリを設定
WORKDIR /app

# Install PostgreSQL client tools
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Expose the application port
EXPOSE 3000

# Set environment variables for PostgreSQL
ENV POSTGRES_HOST=postgres
ENV POSTGRES_PORT=5432
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=mydatabase

# コピー
COPY . .

# 対話モード
CMD ["/bin/bash"]

# imagec&container作成コマンド
# docker image build -t namakemono_back:latest .
# docker container run -it --name namakemono_back -v ${PWD}/app:/app -p 3000:3000 --link postgres-container:postgres namakemono_back:latest 

# pg ライブラリのインストール（ Pool クラスを使用した接続管理のため）
# yarn add pg

# expressのインストール
# yarn add express

# CORS (Cross-Origin Resource Sharing) のインストール
# yarn add cors

# firebase-adminのインストール
# yarn add firebase-admin

# Node.js (Express) のサーバ起動
# cd /app
# node app.js

# dotenvのインストール
# yarn add dotenv

# PostgreSQLをホストするコンテナを起動（AWSの場合はRDS）
# docker run -d \
#   --name postgres-container \
#   -e POSTGRES_USER=postgres \
#   -e POSTGRES_PASSWORD=password \
#   -e POSTGRES_DB=mydatabase \
#   -p 5432:5432 \
#   postgres
# Postgreコンテナ起動確認(database system is ready to accept connections と表示されていればOK)
# docker logs postgres-container
# PostgreSQLクライアントを使った接続確認(パスワード聞かれるので入力)
# psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB
# クエリ確認
# SELECT current_date;
#
