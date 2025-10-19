// import dependencies
//
import express from 'express' ;
import cors from 'cors' ; 
import multer from 'multer';
// --- PERUBAHAN 1: Menggunakan library dan class yang benar ---
import { GoogleGenerativeAI } from '@google/generative-ai';
// Session 5 - import path/url package 
import path from"node:path";
import { fileURLToPath } from "node:url";

// 
import 'dotenv/config';
import { compileFunction } from 'node:vm';
import { on } from 'node:events';

// inisialisasi aplikasi
//
// deklarasi variable di javascript
// [const|let] [namaVariable] = [value]
// [var] --> ngga bisa dipakai lagi (fungsinya sudah digantikan oleh const/let di ES2015)
// [var] --> global declaration (var namaOrang)
//
// [const] --> 1x declare, gabisa diubah ubah lagi
// [let] --> 1x declare, tabi bisa diubah-ubah (re-assigment)
//
// tipe data: number, string, boolean (true/fase), undefine
// special: null (tipenya objek, tapi nilainya falsy)


const app = express();
const upload = multer(); // akan digunakan di dalam recording 

// --- PERUBAHAN 2: Inisialisasi AI dengan API Key dari .env ---
// Pastikan kamu punya file .env dengan isi: API_KEY=kunci_api_kamu
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

// Session 5 - enambhaan Path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// inisialisasi middleware
// 
app.use(cors());
app.use(express.json());

// SESSION 5 - Inisialiasai static directory
app.use(
    //exspress.static(rootdirectory)
    express.static(
        path.join(__dirname, 'static')
    ),
);


// inisialasi routing
app.post('/generate-text', async (req, res,) => {
    const { prompt } = req.body;
//guard clause
    if (!prompt || typeof prompt !== 'string') { 
        res.status(400).json({
            success: false,
            message: 'promt harus berupa string!',
            data: null
        });
        return;
    }
    //
    try {
        // --- PERUBAHAN 3: Cara baru memanggil model dan mendapatkan respons ---
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Menggunakan nama model terbaru
            systemInstruction: "Balas dengan bahasa indonesia yang baik dan benar, perkenalkan dirikamu sebagai AURA (sebagai teman curhat), tidak terlalu panjang tetapi layaknya seorang teman dekat yang siap mendengarkan curhatan.",
        });

        const result = await model.generateContent(prompt);
        const response = result.response;

        res.status(200).json({
            success: true,
            message: 'Berhasil dijawab sama Gemini nih!',
            data: response.text() // Mendapatkan teks dari respons
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            sucess: false,
            message: 'Gagal bro, servernya sedang down!',
            data: null
        });
    }
});

// fitur chat
// endpoint: POST/API
app.post("/api/chat", async (req, res) => {
    const { conversation } = req.body;

    try {
        // --- VALIDASI SEMENTARA SAYA SEDERHANAKAN ---
        if(!Array.isArray(conversation) || conversation.length === 0) {
            throw new Error("Conversation harus berupa array dan tidak boleh kosong!");
        }
        // --- KODE LAMA YANG BIKIN ERROR SUDAH DIHAPUS ---

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "Balas dengan Bahasa indonesia yang baik dan benar, perkenalkan dirikamu sebagai AURA (sebagai teman curhat),, tidak terlalu panjang tetapi seperti layaknya seorang teman dekat yang siap mndengarkan curhatan.",
        });

        // Memisahkan riwayat chat dengan pesan terakhir dari user
        const history = conversation.slice(0, -1).map(({ role, text }) => ({
            role,
            parts: [{ text }],
        }));
        
        const lastMessage = conversation[conversation.length - 1];

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage.text);
        const response = result.response;

        res.status(200).json({
            success: true,
            message: "Berhasil dibalas oleh google Gemini!",
            data: response.text() // Mendapatkan teks dari respons
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message, // Mengambil pesan error yang lebih spesifik
            data: null,
        })
    }
});

//server harus di serve dlu
app.listen(3000, () => {
    console.log('I Love You 3000');
});


