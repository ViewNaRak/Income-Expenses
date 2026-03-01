require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await n8nResponse.json();
        
        res.json({ reply: data.reply || "บันทึกข้อมูลเรียบร้อยครับ!" });

    } catch (error) {
        console.error('Error connecting to n8n:', error);
        res.status(500).json({ reply: "ขออภัยครับ ไม่สามารถเชื่อมต่อกับระบบ AI ได้ในขณะนี้" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;