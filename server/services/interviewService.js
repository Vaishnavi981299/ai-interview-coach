const Groq = require('groq-sdk');
const client = new Groq({apiKey: process.env.GROQ_API_KEY});
const companyProfiles = {
    'Google': {
        style: 'Focus heavily on algorithmic efficiency and optimal solutions. Ask follow-up questions like "can you do better?" and "what is the time and space complexity?". Expect candidates to think out loud and explain their approach before coding.',
        values: 'Innovation, scalability, and technical excellence.',
        difficulty: 'Very high — expect LeetCode hard level for technical rounds.'
    },
    'Amazon': {
        style: 'Every answer should follow the STAR format (Situation, Task, Action, Result). Map behavioral questions to Amazon Leadership Principles like Customer Obsession, Ownership, Invent and Simplify, Bias for Action.',
        values: '16 Leadership Principles — especially Customer Obsession and Ownership.',
        difficulty: 'High — mix of behavioral and technical, leadership principles are heavily tested.'
    },
    'Microsoft': {
        style: 'Focus on problem solving approach and growth mindset. Ask about how candidates handle failure and learn from it. Technical questions are important but culture fit matters equally.',
        values: 'Growth mindset, collaboration, and customer empathy.',
        difficulty: 'High — balanced between technical depth and behavioral assessment.'
    },
    'TCS': {
        style: 'Focus on basic technical concepts, HR questions, and communication skills. Questions are straightforward — no tricks. Assess attitude and willingness to learn.',
        values: 'Team player, adaptability, and communication.',
        difficulty: 'Moderate — fundamentals of CS, basic coding, HR questions.'
    },
    'Infosys': {
        style: 'Similar to TCS — focus on basics, problem solving attitude, and communication. Ask about projects and internships. Assess cultural fit for a service-based company.',
        values: 'Learning agility, integrity, and client focus.',
        difficulty: 'Moderate — similar to TCS but slightly more technical depth.'
    },
    'Deloitte': {
        style: 'Focus on analytical thinking, case study approach, and communication. Ask situational questions. Assess business acumen alongside technical skills.',
        values: 'Integrity, quality, and client impact.',
        difficulty: 'Moderate-High — mix of technical, behavioral, and case-based questions.'
    }
};
async function getNextQuestion(messages, type, difficulty, resumeText = null, company = null){
    try{
        const resumeContext = resumeText ? `\n\nCandidate's Resume:\n${resumeText}\n\nBase your questions specifically on their projects, skills, and experience mentioned in the resume. Cross-question them on anything they claim to have built or know.`
        : '';
        const companyContext = company && companyProfiles[company]
    ? `\n\nCompany: ${company}
Interview Style: ${companyProfiles[company].style}
Values: ${companyProfiles[company].values}
Difficulty Level: ${companyProfiles[company].difficulty}
Tailor ALL your questions to match ${company}'s specific interview style and culture.`
    : '';
        const systemPrompt = `You are an expert technical interviewer conducting a ${type} interview.
    Current difficulty level: ${difficulty}/5.
    ${resumeContext}
    ${companyContext}
    After each user answer, respond in EXACTLY this format:
EVALUATION: [score 1-5, or 0 if this is the first question]
FEEDBACK: [one line of constructive feedback, skip if first question]
MODEL_ANSWER: [ideal complete answer to the previous question, skip if first question]
MISSING_CONCEPTS: [comma separated concepts the user missed, skip if first question]
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
