// import dependencies
//
import express from 'express' ;
import cors from 'cors' ; 
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
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

const ai = new GoogleGenAI({ }); // instantation objek menjadi intance (oop)

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
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { text: prompt }
            ],
            //config Ai untuk lebih jauh
            config: {
                systemInstruction: 'Harus dibalas dalam bahasa indonesia.'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Berhasil dijawab sama Gemini nih!',
            data: aiResponse.text
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
app.post("/appi/chat", async (req, res) => {
    const { conversation } = req.body;

    try {
        // satpam #1: Cek conversation apakah berupa array atau tidak 
        //            dengan Array.isArray().
        if(!Array.isArray(conversation)) {
            throw new Error("Converstaion harus berupa array!");
        }

        // Satpam kedua: Cek setiap pesan dalam coversatio, apakah vaid atau tidak
        let messageIsValid = true;

        if(conversation.length === 0) {
            throw new Error("Conversation tidak boleh kosong!");
        }

        for (let i = 0; i < message.length; i++) {
            const message = conversation[i]
        }

        conversation.forEach(message => {
            // Kondisi #1 -- message harus berupa object dan bukan null

            // bisa tambah 1 kondisi lagi untuk cek variable messageIsValid
            // disini

            if (!message || typeof message !== 'object') {
               messageIsValid = false;
               return; 
            }

            const keys = Object.keys(message);
            const objectHasValidKeys = keys.every(key => ['text', 'role'].includes(key));

            // looping kondisi di dalam array
            // 
            //

            // Kondisi kedua -- message harus punya stuktur yang valid
            if (keys,length !==2 || objectHasValidKeys) {
                messageIsValid = false;
                return;
            }


            const { text, role } = message;

            // Kondisi 3A -- role harus valid 
            if (!['model', 'user'].includes(role )) {
                messageIsValid = false;
                return; 
            }
            
            // Kondisi 3B -- teks harus valid
            if (!text || typeof text !== 'string') {
                messageIsValid = false;
                return;
            }
        });

        if (!messageIsValid) {
            throw new Error("Message Harus Valid!");
        }

        // Prosess dagingnya
        const contents = conversation.map(({ role, text }) => ({
            role, 
            parts: [{ text }] 
        }));

        const aiResponse = await ai.models.generateContent({
            model: 'gemini-flash',
            contents,
            config: {
                systemInstruction: "Harus Membalas dengan Bahasa sunda."
            }
        })

        res.status(200).json({
            success: true,
            message: "Berhasil dibalas oleh google Gemini!",
            data: aiResponse.text
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
            data: null,
        })
    }
});

//server harus di serve dlu
app.listen(3000, () => {
    console.log('I Love You 3000');
});