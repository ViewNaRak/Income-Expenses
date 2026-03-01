async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) return;

    // แสดงข้อความฝั่ง User
    appendMessage(message, 'user-message');
    input.value = '';

    try {
        // ส่งข้อความไปที่ Backend ของเรา
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        
        // แสดงข้อความตอบกลับจาก Bot (n8n)
        appendMessage(data.reply, 'bot-message');
    } catch (error) {
        appendMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'bot-message');
    }
}

function appendMessage(text, className) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // เลื่อนลงมาล่างสุดเสมอ
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}