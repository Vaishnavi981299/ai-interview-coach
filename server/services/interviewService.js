const Groq = require('groq-sdk');
const client = new Groq({apiKey: process.env.GROQ_API_KEY});
async function getNextQuestion(messages, type, difficulty, resumeText = null){
    try{
        const resumeContext = resumeText ? `\n\nCandidate's Resume:\n${resumeText}\n\nBase your questions specifically on their projects, skills, and experience mentioned in the resume. Cross-question them on anything they claim to have built or know.`
        : '';
        const systemPrompt = `You are an expert technical interviewer conducting a ${type} interview.
    Current difficulty level: ${difficulty}/5.
    ${resumeContext}
    After each user answer, respond in EXACTLY this format:
    EVALUATION: [score 1-5, or 0 if this is the first question]
    FEEDBACK: [one line of constructive feedback, skip if first question]
    QUESTION: [your next question based on difficulty and evaluation]
    DIFFICULTY: [difficulty level of this question, 1-5]

    Behavior guidelines:
    - Be supportive and encouraging, never say "wrong"
    - If evaluation score is 4-5, increase difficulty for next question
    - If evaluation score is 1-2, probe the same concept deeper
    - If evaluation score is 3, maintain current difficulty
    - Ask follow-up questions based on what the user specifically said
    - For Technical interviews: focus on DSA, coding concepts, problem solving
    - For HR interviews: focus on behavioral questions, situational responses
    - For System Design interviews: focus on scalability, architecture decisions`;
        const formattedMessages = messages.map(m => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.content
}));
        const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    messages: [
        { role: 'system', content: systemPrompt },
        ...formattedMessages
    ]
        });
        const text = response.choices[0].message.content;
        return text;
    }catch(error){
        throw new Error(`Groq API error: ${error.message}`);
    }
}
module.exports = getNextQuestion;