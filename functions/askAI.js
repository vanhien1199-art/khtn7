// File: /functions/askAI.js (Phiên bản cho Cloudflare Pages)

// Kho tri thức (giữ nguyên)
const lessonPrompts = {
    // ... (toàn bộ danh sách lessonPrompts của thầy/cô) ...
    'do-toc-do': `Bạn là một trợ giảng AI chuyên sâu về bài học "Đo tốc độ"...`,
    'quang-hop': `Bạn là một nhà thực vật học AI, chuyên gia về bài học "Quang hợp"...`,
    // ... và các bài học khác
    'default': `Bạn là một trợ giảng chung cho môn Khoa học Tự nhiên.`
};

// Hàm xử lý chính của Cloudflare Pages Function
export async function onRequest(context) {
    // Lấy API Key từ biến môi trường của Cloudflare
    const apiKey = context.env.GOOGLE_API_KEY;

    if (!apiKey) {
        console.error("LỖI CẤU HÌNH: Biến môi trường GOOGLE_API_KEY chưa được thiết lập!");
        return new Response(JSON.stringify({ error: 'Lỗi cấu hình phía máy chủ.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { question, lesson_id } = await context.request.json();
        if (!question) {
            return new Response(JSON.stringify({ error: 'Thiếu câu hỏi.' }), { status: 400 });
        }

        const systemPrompt = lessonPrompts[lesson_id] || lessonPrompts['default'];
        const fullPrompt = `${systemPrompt}\n\nCâu hỏi của học sinh: "${question}"`;
        
        // URL API của Google
        const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // Gọi API của Google bằng fetch
        const googleResponse = await fetch(GOOGLE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }]
            })
        });

        if (!googleResponse.ok) {
            const errorData = await googleResponse.json();
            console.error('Lỗi từ Google API:', errorData);
            throw new Error('Lỗi từ dịch vụ AI của Google.');
        }

        const data = await googleResponse.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Trả về kết quả thành công
        return new Response(JSON.stringify({ answer: aiResponse }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Thêm header CORS
            },
        });

    } catch (error) {
        console.error('Lỗi xử lý function:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}