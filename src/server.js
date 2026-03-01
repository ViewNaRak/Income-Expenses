// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// เสิร์ฟไฟล์ Static จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, '../public')));

// API รับข้อความจากหน้าเว็บ แล้วส่งให้ n8n
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // ส่งข้อมูลไปที่ n8n Webhook
        const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await n8nResponse.json();
        
        // ส่งคำตอบจาก n8n กลับไปที่หน้าเว็บ
        res.json({ reply: data.reply || "บันทึกข้อมูลเรียบร้อยครับ!" });

    } catch (error) {
        console.error('Error connecting to n8n:', error);
        res.status(500).json({ reply: "ขออภัยครับ ไม่สามารถเชื่อมต่อกับระบบ AI ได้ในขณะนี้" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});