# フロントエンド（Vite + React + TypeScript + TailwindCSS）のセットアップ
New-Item -ItemType Directory -Path "langchain-app"
Set-Location "langchain-app"
New-Item -ItemType Directory -Path "frontend"
Set-Location "frontend"

# Vite を使用して React + TypeScript プロジェクトを作成
npm create vite@latest . -- --template react-ts

# 依存関係のインストール
npm install

# TailwindCSS のインストールと初期設定
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# tailwind.config.js の内容を更新
@"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"@ | Out-File -FilePath "tailwind.config.js" -Encoding utf8

# src/index.css に Tailwind のディレクティブを追加
@"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@ | Out-File -FilePath "src/index.css" -Encoding utf8

# Langchain.js のインストール
npm install langchain @langchain/openai

# バックエンド（Node.js + Express + TypeScript）のセットアップ
Set-Location ..
New-Item -ItemType Directory -Path "backend"
Set-Location "backend"

# package.json の初期化
npm init -y

# TypeScript と必要な依存関係のインストール
npm install express cors dotenv
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon

# TypeScript の設定ファイル (tsconfig.json) を作成
npx tsc --init

# tsconfig.json の内容を更新
@"
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
"@ | Out-File -FilePath "tsconfig.json" -Encoding utf8

# ソースコードディレクトリとエントリーポイントファイルを作成
New-Item -ItemType Directory -Path "src"
New-Item -ItemType File -Path "src/server.ts"

# server.ts の基本的な内容を追加
@"
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
"@ | Out-File -FilePath "src/server.ts" -Encoding utf8

# .env ファイルを作成（OpenAI API キーなどの環境変数用）
New-Item -ItemType File -Path ".env"
@"
OPENAI_API_KEY=your_openai_api_key_here
"@ | Out-File -FilePath ".env" -Encoding utf8

# package.json にスクリプトを追加
$packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
$packageJson.scripts = @{
    "start": "node dist/server.js"
    "dev": "nodemon src/server.ts"
    "build": "tsc"
}
$packageJson | ConvertTo-Json -Depth 4 | Set-Content -Path "package.json"

# プロジェクトルートに戻る
Set-Location ..

Write-Host "Frontend and Backend setup completed successfully!"