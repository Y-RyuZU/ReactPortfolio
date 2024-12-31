FROM node:22-alpine AS builder

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係をインストール
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# アプリケーションをビルド（SSG 対応）
COPY . .
RUN yarn build

# 実行用イメージを準備
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html

# ポート 80 の公開（Nginx サーバー）
EXPOSE 80