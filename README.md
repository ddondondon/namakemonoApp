# namakemonoApp
#### - ナマケモノのためのスケジュール＆タスク管理アプリ - 
スケジュール・タスク管理が面倒なナマケモノさんのために、少ないアクションで最低限のタスクの締切、打合せ予定を管理するアプリ。
登録できるタスク区分は"休日"、"予定"、"締切"の３種類のみ、まずは休日を登録して休みの日を確保した上で最低限のタスクの締切、打合せ予定を登録しましょう。

## アプリ紹介
### https://namakemonoapp.com
①カレンダー画面
<img src="./front/app/vue-project/src/assets/HC_Calender.png" width="1000px"><br>
②リスト画面
<img src="./front/app/vue-project/src/assets/HC_List.png" width="1000px"><br>
③タスク登録画面
<img src="./front/app/vue-project/src/assets/HC_taskDetail.png" width="1000px"><br>


## システム構成図
<img src="./front/app/vue-project/src/assets/system.png" width="1000px">

## 技術要素

#### フロントエンド
| 名称 | 説明 |
| ---- | ---- |
| Vue 3 | フロントエンドフレームワーク |
| Vue-router | SPA（シングルページアプリケーション）構築 |
| Vuetify | UIコンポーネント |
| Pinia | 状態管理（複数コンポーネントにわたるリアクティブなデータを管理） |
| Axios | バックエンドへのHTTP通信を行う |
| Firebase Authentication | JWTを用いたログイン・ログアウト |

#### バックエンド
| 名称 | 説明 |
| ---- | ---- |
| Node.js | APIサーバーとして利用 |
| Axios | フロントエンドからのHTTPリクエストにJSON形式のレスポンスを返却する |
| PostgreSQL | データベース |

#### プロキシ
| 名称 | 説明 |
| ---- | ---- |
| Apache | HTTPサーバ |
| Let’s Encrypt | SSL証明書 |

- プロキシコンテナを経由することで常時SSL通信化。外部→プロキシ間はHTTPS通信、プロキシ→フロントエンド／バックエンド間はHTTP通信。
- 本番環境はAWSのXXなどを使ってフロントエンドの資源を配布することが一般的ですが、今回はXXのためEC2にdocker-composeでコンテナを構築


#### インフラ
| 名称 | 説明 |
| ---- | ---- |
| EC2 | 本番用サーバ（Amazon Linux2） |
| RDS | 本番用DB（PostgreSQL） |
| CodePipeline | CI/CD構築 |
| Terraform | 本番用インフラ構築 |
| Docker, Docker-compose | コンテナ構築 |
| Github, GitHub Actions  | バージョン管理・自動テスト |

- ローカル開発環境からデプロイまで一貫してDockerを使用。

- AWSの環境構築はTerraformで自動化。

- CodePipelineは、『Sourceステージ => Deployステージ』の順で実行され、SourceステージにてGitHubから引き上げた資源をDeployステージにてdocker-composeを使ってEC2にデプロイします。


#### 自動テスト
| 名称 | 説明 |
| ---- | ---- |
| Selenium | headlessモードでブラウザのGUIの起動なしでWebアプリの自動テストを実施 |

- GitHub ActionsでmainブランチにPullRequest時に自動テストを実施。

