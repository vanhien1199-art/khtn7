// File: /shared/chatbot.js

document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    const AI_SERVICE_URL = '/askAI'; // Đường dẫn cho Cloudflare
    const LESSON_ID = window.lessonId || 'default';

    if(sendButton){
        sendButton.addEventListener('click', askAI);
        userInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') askAI(); });
    }

    // ... (phần còn lại của file giữ nguyên) ...
    function addMessageToChat(text, className) { /* ... */ }
    async function askAI() { /* ... */ }
});
