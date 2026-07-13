import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
function Register(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    async function handleSubmit(){
        try{
            const response = await register({name, email, password});
            navigate('/login');
        }catch(error){
            setError(error.response.data.message);
        }
    }
    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6">AI Interview Coach</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <input 
                    type="text"
                    placeholder="Name"
                    className="w-full border p-2 rounded mb-4"
                    value={name}
                    onChange = {(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Register
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
    Already have an account?{' '}
    <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer hover:underline">
        Login
    </span>
</p>
            </div>
        </div>
    )
}
export default Register