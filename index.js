// import dependencies
//
import express from 'express' ;
import cors from 'cors' ; 
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

import 'dotenv/config';

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

// inisialisasi middleware
// 
app.use(cors());
app.use(express.json());
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
                systemInstruction: 'Harus dibalas dalam bahasa jepang.'
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

//server harus di serve dlu
app.listen(3000, () => {
    console.log('I Love You 3000');
});