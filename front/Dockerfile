# ベースイメージとしてnode 22を使用
FROM node:22

# 作業ディレクトリを設定
WORKDIR /app

# vueCLIをインストール
RUN yarn global add @vue/cli 
RUN yarn add pinia
RUN yarn add pinia axios
RUN yarn add firebase
RUN yarn add vuetify@next

# コピー
COPY . .

# 対話モード
CMD ["/bin/bash"]

