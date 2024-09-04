import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Ollama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { prompt1 } from "./prompt";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// // Ollamaモデルの初期化
// const llm = new Ollama({
// 	model: "llama2", // または適切なモデル名
// 	temperature: 0.7,
// });

const llm = new ChatGoogleGenerativeAI({
	modelName: "gemini-1.5-pro",
	maxOutputTokens: 2048,
	temperature: 0,
	apiKey: process.env.GOOGLE_API_KEY,
	streaming: true,
});

// OpenAIモデルの初期化
// const llm = new OpenAI({
// 	modelName: "gpt-3.5-turbo", // または "gpt-4" など、適切なモデル名
// 	temperature: 0.7,
// 	openAIApiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを読み込む
// });

// プロンプトテンプレートの定義
const promptTemplate = PromptTemplate.fromTemplate(prompt1);

app.post("/generate", async (req, res) => {
	const { theme, count } = req.body;

	try {
		// プロンプトの生成
		const prompt = await promptTemplate.format({ theme, count });

		// ストリーミング処理の準備
		res.writeHead(200, {
			"Content-Type": "text/plain",
			"Transfer-Encoding": "chunked",
		});

		let fullResponse = "";

		// ストリーミング処理
		const stream = await llm.stream(prompt);
		for await (const chunk of stream) {
			fullResponse += chunk;
			res.write(chunk);
		}

		// レスポンスの終了
		res.end();

		// 生成されたデータの処理（必要に応じて）
		try {
			const jsonData = JSON.parse(fullResponse);
			console.log("Generated valid JSON data:", jsonData);
		} catch (error) {
			console.error("Failed to parse generated data as JSON:", error);
		}
	} catch (error) {
		console.error("Error generating data:", error);
		res.status(500).json({
			error: "An error occurred while generating data",
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
