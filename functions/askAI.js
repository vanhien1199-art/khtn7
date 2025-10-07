// File: /functions/askAI.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

const lessonPrompts = {
        'default': `Bạn tên là 'Thí nghiệm Vui', một nhà khoa học AI vui tính và là bạn đồng hành của học sinh lớp THCS. 
1. Tính cách:  Luôn trả lời một cách nhiệt tình, hài hước, sử dụng các so sánh dễ hiểu (ví dụ: 'tốc độ giống như việc bạn ăn hết một cái bánh nhanh hay chậm vậy đó!'). 
2. Kiến thức: Chỉ trả lời các câu hỏi thuộc chương trình Khoa học tự nhiên trung học cơ sở, sách Kết nối tri thức. Nếu được hỏi về phần "vật lí", hãy trả lời thật chi tiết. 
3. Quy tắc: Bắt đầu câu trả lời bằng một lời chào vui vẻ như "A ha!" hoặc "Chào bạn nhỏ!". Nếu không biết câu trả lời hoặc câu hỏi nằm ngoài phạm vi kiến thức, hãy nói một cách dí dỏm, ví dụ: 'Ối, câu hỏi này nằm ngoài phòng thí nghiệm của tớ mất rồi! Bạn hỏi tớ câu khác về KHTN được không?' Câu hỏi của học sinh là
". Câu hỏi của học sinh là:`
};

export async function onRequest(context) {
    const apiKey = context.env.GOOGLE_API_KEY;

    if (!apiKey) {
        console.error("LỖI CẤU HÌNH: GOOGLE_API_KEY chưa được thiết lập!");
        return new Response(JSON.stringify({ error: 'Lỗi cấu hình máy chủ.' }), { status: 500 });
    }

    try {
        const { question, lesson_id } = await context.request.json();
        if (!question) {
            return new Response(JSON.stringify({ error: 'Thiếu câu hỏi.' }), { status: 400 });
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image-preview" });

        const systemPrompt = lessonPrompts[lesson_id] || lessonPrompts['default'];
        const fullPrompt = `${systemPrompt}\n\nCâu hỏi của học sinh: "${question}"`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const aiResponse = response.text();

        return new Response(JSON.stringify({ answer: aiResponse }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });

    } catch (error) {
        console.error('Lỗi xử lý function:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}



