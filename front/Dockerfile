FROM node:22

WORKDIR /app

# package.json や yarn.lock を先にコピー
COPY package*.json yarn.lock ./

# vue-cli-serviceを含む依存関係をインストール
# ※ package.json の devDependencies に "@vue/cli-service" を追加しておく
#    pinia, axios, firebase, vuetify も package.json に追加して一括インストール
RUN yarn install

# ソースコードをコピー
COPY . .

CMD ["yarn", "serve"]
