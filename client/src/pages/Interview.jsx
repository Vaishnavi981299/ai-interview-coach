import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, answerQuestion } from '../services/api'
function Interview(){
    const [messages, setMessages] = useState([]);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
const [recognition, setRecognition] = useState(null);
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
    function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Speech recognition is not supported in your browser. Please use Chrome.');
        return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    
    rec.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        setAnswer(transcript);
    };
    
    rec.onend = () => setIsListening(false);
    rec.start();
    setRecognition(rec);
    setIsListening(true);
}

function stopListening() {
    if (recognition) {
        recognition.stop();
    }
    setIsListening(false);
}
    function parseAIMessage(content){
    const feedbackMatch = content.match(/FEEDBACK:\s*(.+?)(?=MODEL_ANSWER:|QUESTION:|$)/s);
    const modelAnswerMatch = content.match(/MODEL_ANSWER:\s*(.+?)(?=MISSING_CONCEPTS:|QUESTION:|$)/s);
    const missingMatch = content.match(/MISSING_CONCEPTS:\s*(.+?)(?=QUESTION:|$)/s);
    const questionMatch = content.match(/QUESTION:\s*(.+?)(?=DIFFICULTY:|$)/s);
    
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : '';
    const modelAnswer = modelAnswerMatch ? modelAnswerMatch[1].trim() : '';
    const missingConcepts = missingMatch ? missingMatch[1].trim() : '';
    const question = questionMatch ? questionMatch[1].trim() : content;
    
    return { feedback, modelAnswer, missingConcepts, question };
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
        const { feedback, modelAnswer, missingConcepts, question } = parseAIMessage(msg.content);
        return (
            <>
                {feedback && <p className="text-sm text-gray-500 mb-2 italic">{feedback}</p>}
                <p>{question}</p>
                {modelAnswer && (
                    <details className="mt-3 border-t pt-3">
                        <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-semibold">
                            View Model Answer
                        </summary>
                        <div className="mt-2">
                            <p className="text-sm text-gray-700 mb-2">{modelAnswer}</p>
                            {missingConcepts && (
                                <div className="mt-2">
                                    <p className="text-xs font-semibold text-red-500 mb-1">Missing Concepts:</p>
                                    <p className="text-xs text-red-400">{missingConcepts}</p>
                                </div>
                            )}
                        </div>
                    </details>
                )}
            </>
        );
    })()
) : msg.content}
                        </div>
                    </div>
                ))}
        </div>
        <div className="bg-white p-4 flex gap-4 items-end">
    <textarea
        className="flex-1 border rounded p-2 resize-none"
        rows="3"
        placeholder="Type your answer or use the mic..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
    />
    <button
    onClick={isListening ? stopListening : startListening}
    className=className={`p-3 rounded-lg transition ${isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
</button>
    <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 py-3"
    >
        {loading ? 'Thinking...' : 'Send'}
    </button>
</div>
</div>
    )
}
export default Interview
