import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, answerQuestion } from '../services/api'
function Interview(){
    const [messages, setMessages] = useState([]);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchSession(){
            const sessionId = localStorage.getItem('sessionId');
            const response = await getSession(sessionId);
            setMessages(response.data.session.messages);
        }
        fetchSession();
    }, []);
    async function handleSubmit(){
            setLoading(true);
            try{
                const sessionId = localStorage.getItem('sessionId');
                const response = await answerQuestion({sessionId, answer});
                setMessages(response.data.session.messages);
                setAnswer('');
            } catch (error) {
                console.error('Error submitting answer:', error);
            } finally {
                setLoading(false);
            }
    }
    async function handleEndInterview(){
        navigate('/results');
    }
    function parseAIMessage(content){
        const feedbackMatch = content.match(/FEEDBACK: \s*(.+?)(?=QUESTION:|$)/s);
        const questionMatch = content.match(/QUESTION:\s*(.+?)(?=DIFFICULTY:|$)/s);
        const feedback = feedbackMatch ? feedbackMatch[1].trim() : '';
        const question = questionMatch ? questionMatch[1].trim() : content;
    return { feedback, question };
    }
    return(
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold">AI Interview Coach</h1>
                <button
                    onClick={handleEndInterview}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    End Interview
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`max-w-2xl p-4 rounded-lg ${
                                msg.role === 'ai' ? 'bg-white shadow text-gray-800' : 'bg-blue-600 text-white'
                               }`}
                        >
                            {msg.role === 'ai' ? (
                                (() => {
                                    const { feedback, question } = parseAIMessage(msg.content);
                                    return (
                                        <>
                                            {feedback && <p className = "text-sm text-gray-500 mb-2 italic">{feedback}</p>}
                                            <p>{question}</p>
                                            </>
                                    );
                                })()
                            ) : msg.content}
                        </div>
                    </div>
                ))}
        </div>
        <div className="bg-white p-4 flex gap-4">
        <textarea
            className="flex-1 border rounded p-2 resize-none"
            rows="3"
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
        />
        <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 rounded hover:bg-blue-700 disabled:opacity-50"
        >
            {loading ? 'Thinking...' : 'Send'}
        </button>
    </div>
</div>
    )
}
export default Interview