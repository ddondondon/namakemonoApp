# ベースイメージとしてnode 22を使用
FROM node:22

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとyarn.lock
COPY app/vue-project/package*.json app/vue-project/yarn.lock ./

# 依存関係をインストール
RUN yarn global add @vue/cli@5.0.8
RUN yarn install

# ソースコード（vue-project配下すべて）をコピー
COPY app/vue-project/ ./

# ビルド
#RUN yarn build

# serve コマンドを実行
CMD ["yarn", "serve"]
