# ベースイメージとして最新のNode.jsを使用
FROM node:23-slim

RUN apt update && apt install -y git

# 作業ディレクトリを設定
WORKDIR /app

# Corepackを有効化してYarnを使用可能にする
RUN corepack enable

# 依存関係をインストールするためにpackage.jsonとyarn.lockをコピー
COPY package.json yarn.lock ./

# 依存関係をインストール
RUN yarn install

# アプリケーションのソースコードを全てコピー
COPY . .

# Viteのデフォルトポートを開放
EXPOSE 5173

# 開発サーバーを起動（外部からのアクセスを許可）
CMD ["yarn", "dev", "--host", "0.0.0.0"]
