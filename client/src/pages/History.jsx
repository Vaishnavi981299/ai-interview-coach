import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessions } from '../services/api'

function History() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSessions() {
            try {
                const response = await getSessions();
                setSessions(response.data.sessions);
            } catch(error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSessions();
    }, []);

    function getScoreColor(difficulty) {
        if (difficulty >= 4) return 'text-green-500';
        if (difficulty >= 3) return 'text-yellow-500';
        return 'text-red-500';
    }

    if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Interview History</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        New Interview
                    </button>
                </div>
                {sessions.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow p-12 text-center">
                        <p className="text-gray-500 text-lg">No interviews yet!</p>
                        <p className="text-gray-400 mt-2">Start your first interview to see your history here.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Start Interview
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div
                                key={session._id}
                                onClick={() => {
                                    localStorage.setItem('sessionId', session._id);
                                    navigate('/results');
                                }}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition p-6 flex justify-between items-center"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-lg font-bold text-gray-800">{session.type} Interview</h2>
                                        {session.company && (
                                            <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-semibold">
                                                {session.company}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(session.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-2xl font-bold ${getScoreColor(session.difficulty)}`}>
                                        {session.difficulty}/5
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">difficulty reached</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default History
