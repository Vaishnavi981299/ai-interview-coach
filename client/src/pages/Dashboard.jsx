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
    return(
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Choose Interview Type</h1>
            <div className="flex justify-center gap-6">
                {['Technical', 'HR', 'System Design'].map((type) => (
                    <div
                        key={type}
                        onClick={() => handleStart(type)}
                        className="bg-white p-8 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition w-48 text-center"
                    >
                        <h2 className="text-xl font-semibold">{type}</h2>
                        <p className="text-gray-500 mt-2">Start {type} Interview</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-6">
                    <div
                        onClick={() => setShowUpload(true)}
                        className="bg-blue-600 text-white p-8 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition w-48 text-center mt-6 mx-auto"
                    >
                        <h2 className="text-xl font-semibold">Resume Based</h2>
                        <p className="text-gray-500 mt-2">Upload resume & start interview</p>
                    </div>
            </div>
            {showUpload && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Upload Your Resume</h2>
            <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border p-2 rounded mb-4"
            />
            <button
                onClick={handleResumeStart}
                disabled={!file || uploading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-2"
            >
                {uploading ? 'Uploading...' : 'Start Interview'}
            </button>
            <button
                onClick={() => setShowUpload(false)}
                className="w-full border p-2 rounded hover:bg-gray-100"
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