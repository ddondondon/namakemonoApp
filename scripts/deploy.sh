#!/bin/bash

# デプロイするディレクトリへ移動
cd /home/app/namakemonoApp

# 現在動いているコンテナを落とす
docker-compose down proxy back front

# イメージをビルドし直す
docker-compose build proxy back front

# バックグラウンドで起動する
docker-compose up -d proxy back front