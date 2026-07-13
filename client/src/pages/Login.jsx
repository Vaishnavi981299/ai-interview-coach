import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(){
        try{
            const response = await login({email, password});
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
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
                    Login
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')} className="text-blue-600 cursor-pointer hover:underline">
                        Register
                    </span>
                </p>
            </div>
        </div>
    )
}
export default Login