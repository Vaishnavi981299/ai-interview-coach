import { useNavigate } from 'react-router-dom'
import { startSession } from '../services/api'
function Dashboard(){
        const navigate = useNavigate();
        async function handleStart(type){
            try{
                const response = await startSession({type});
                localStorage.setItem('sessionId', response.data.session._id);
                navigate('/interview');
            }catch(error){
                console.error('Error starting session:', error);
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
        </div>
    )
}
export default Dashboard