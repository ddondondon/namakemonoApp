# ベースイメージとしてnode 22を使用(2025年1月時点LTS最新)
FROM node:22

# 作業ディレクトリを設定
WORKDIR /app

# vueCLIをインストール
RUN yarn global add @vue/cli 
# RUN vue add vuetify 対話モードでインストールのため、コンテナ起動後に手動で実施
RUN yarn add pinia
RUN yarn add pinia axios
RUN yarn add firebase

# コピー
COPY . .

# 対話モード
CMD ["/bin/bash"]

# imagec&container作成コマンド
# 事前に作成済のDockerfile,appをまるっとfront配下にコピーしておく(作成済プロジェクトの移植の場合)　dockerignore描き忘れてた...
# cd /Users/ddon/Sites/namakemonoApp/front
# docker image build -t namakemono_front:latest .
# docker container run -it --name namakemono_front -v ${PWD}/app:/app -p 8080:8080 namakemono_front:latest 
# コンテナ起動後にfront/appのsrc,publicフォルダを丸ごとコピー、vuetifyをインストール、

# vuetifyをインストール
# cd vue-project
# vue add vuetify        ※"Vuetify 3 - Vue CLI (preview)"を選択

# プロジェクト起動
# cd vue-project
# yarn serve             ※なぜかエラーになるので/srcと/publicを再コピーしてから起動
# localhost:8080


# dotenvのインストール →フロントエンドではこれは非推奨のため使わない！！！
# yarn add dotenv