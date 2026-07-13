import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {getSession} from '../services/api'
function Results(){
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchSession(){
            const sessionId = localStorage.getItem('sessionId');
            const response = await getSession(sessionId);
            setSession(response.data.session);
        }
        fetchSession();
    }, []);
    if(!session) return <div className="p-8 text-center">Loading...</div>;
    const aiMessages = session.messages.filter(m => m.role === 'ai');
    const scores = aiMessages
        .map(m => {
            const match = m.content.match(/EVALUATION:\s*(\d)/);
            return match ? parseInt(match[1]) : 0;
        })
        .filter(score => score > 0);
    const average = scores.length > 0
        ? (scores.reduce((sum, s) => sum + s,0)/scores.length).toFixed(1)
        : 'N/A';
    return (
    <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Interview Complete!</h1>
            <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Overall Score</h2>
                <p className="text-5xl font-bold text-blue-600">{average}<span className="text-2xl text-gray-400">/5</span></p>
                <p className="text-gray-500 mt-2">{session.type} Interview</p>
            </div>
            <div className="space-y-4 mb-6">
                {scores.map((score, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                        <span className="text-gray-700">Question {index + 1}</span>
                        <span className={`font-bold text-lg ${score >= 4 ? 'text-green-500' : score >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {score}/5 {'⭐'.repeat(score)}
                        </span>
                    </div>
                ))}
            </div>
            <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
                Start New Interview
            </button>
        </div>
    </div>
);
}
export default Results