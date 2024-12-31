# ビルドステージ
FROM node:22-alpine AS builder

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係をインストール
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# アプリケーションのビルド
COPY . .
RUN yarn build

# 実行ステージ
FROM node:22-alpine

# 作業ディレクトリの設定
WORKDIR /app

# ビルド成果物をコピー
COPY --from=builder /app ./

# 必要なポートを公開
EXPOSE 3000

# Next.jsのビルトインサーバーを起動
CMD ["yarn", "start"]