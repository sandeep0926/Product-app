import fs from "fs";


const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

export const TranscribeFun = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No audio file uploaded" });
        }

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey || apiKey.includes("your_") || apiKey.includes("PASTE")) {
            fs.unlinkSync(req.file.path);
            return res.status(500).json({
                message:
                    "GROQ_API_KEY is not set in .env file. Get one free at https://console.groq.com/keys",
            });
        }


        const audioBuffer = fs.readFileSync(req.file.path);


        const formData = new FormData();
        formData.append(
            "file",
            new Blob([audioBuffer]),
            req.file.originalname || "audio.mp3"
        );
        formData.append("model", "whisper-large-v3-turbo");
        formData.append("language", "en");

        console.log("Sending audio to Groq Whisper API...");

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            body: formData,
        });


        fs.unlinkSync(req.file.path);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Groq API Error:", response.status, errorData);
            return res.status(response.status).json({
                message: errorData.error?.message || `Transcription failed (${response.status})`,
            });
        }

        const result = await response.json();
        console.log(`✅ Transcription success: "${(result.text || "").substring(0, 80)}..."`);

        res.status(200).json({
            text: result.text || "",
        });
    } catch (error) {
        console.error("Transcription error:", error.message);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            message: "Failed to transcribe audio: " + error.message,
        });
    }
};
