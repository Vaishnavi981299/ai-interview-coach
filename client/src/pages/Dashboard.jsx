import { useNavigate } from 'react-router-dom'
import {useState} from 'react'
import { startSession, startResumeSession } from '../services/api'

function Dashboard(){
        const navigate = useNavigate();
        const [showUpload, setShowUpload] = useState(false);
        const [file, setFile] = useState(null);
        const [uploading, setUploading] = useState(false);
        async function handleStart(type){
            try{
                const response = await startSession({type});
                localStorage.setItem('sessionId', response.data.session._id);
                navigate('/interview');
            }catch(error){
                console.error('Error starting session:', error);
            }
        }
        async function handleResumeStart(){
            if (!file) return;
            try{
                setUploading(true);
                const formData = new FormData();
                formData.append('resume', file);
                const response = await startResumeSession(formData);
                localStorage.setItem('sessionId', response.data.session._id);
                navigate('/interview');
            }catch(error){
                console.error('Error uploading resume:', error);
            }finally{
                setUploading(false);
            }
        }
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Interview Coach</h1>
                <p className="text-gray-500 text-lg">Choose your interview type to get started</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {[
                    { type: 'Technical', icon: '💻', desc: 'DSA, coding concepts & problem solving' },
                    { type: 'HR', icon: '🤝', desc: 'Behavioral & situational questions' },
                    { type: 'System Design', icon: '🏗️', desc: 'Architecture & scalability discussions' },
                ].map(({ type, icon, desc }) => (
                    <div
                        key={type}
                        onClick={() => handleStart(type)}
                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition border border-gray-100 hover:border-blue-200"
                    >
                        <div className="text-4xl mb-4">{icon}</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{type}</h2>
                        <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                ))}
                <div
                    onClick={() => setShowUpload(true)}
                    className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition text-white"
                >
                    <div className="text-4xl mb-4">📄</div>
                    <h2 className="text-xl font-bold mb-2">Resume Based</h2>
                    <p className="text-blue-100 text-sm">Upload your resume for personalized questions</p>
                </div>
            </div>
        </div>
        {showUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-2">Upload Your Resume</h2>
                    <p className="text-gray-500 text-sm mb-4">PDF format only, max 5MB</p>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full border p-2 rounded-lg mb-4"
                    />
                    <button
                        onClick={handleResumeStart}
                        disabled={!file || uploading}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-2 font-semibold"
                    >
                        {uploading ? 'Analyzing resume...' : 'Start Interview'}
                    </button>
                    <button
                        onClick={() => setShowUpload(false)}
                        className="w-full border p-3 rounded-lg hover:bg-gray-50 text-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )}
    </div>
)
}
export default Dashboard
