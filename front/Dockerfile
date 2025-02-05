# ベースイメージとしてnode 22を使用
FROM node:22

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとyarn.lock
COPY app/vue-project/package*.json app/vue-project/yarn.lock ./

# 依存関係をインストール
RUN yarn install

# ソースコード（vue-project配下すべて）をコピー
COPY app/vue-project/ ./

# serve コマンドを実行
CMD ["yarn", "serve"]