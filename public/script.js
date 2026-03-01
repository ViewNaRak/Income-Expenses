async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) return;

    appendMessage(message, 'user-message');
    input.value = '';

    const loadingId = 'loading-' + Date.now();
    appendMessage('⏳ กำลังประมวลผล...', 'bot-message', loadingId);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        removeMessage(loadingId);
 
        appendMessage(data.reply, 'bot-message');
    } catch (error) {
        removeMessage(loadingId);
        appendMessage('❌ เกิดข้อผิดพลาดในการเชื่อมต่อระบบ', 'bot-message');
    }
}

function appendMessage(text, className, id = null) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    if (id) msgDiv.id = id;

    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}