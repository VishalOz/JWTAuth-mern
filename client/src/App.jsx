import React from 'react'
import {useState} from 'react'
import axios from 'axios'

const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
      try {
        const res = await axios.post('http://localhost:5000/login', {email, password});
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setMessage('Login Successfull')
      }catch (err) {
        setMessage('Login Failed')
      }
    };

    const getDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data.message + " for " + res.data.user.email);
      } catch (err) {
        setMessage("Access denied ❌");
      }
   };

  return (
    <div className={`flex justify-center items-center h-screen bg-gray-100`}>
        <div className={`p-20 w-100 h-auto bg-white shadow-lg rounded-xl`}>
            <h2 className={`mb-10 font-bold text-xl`}>JWT Auth Example</h2>
            {!token ? (<>
              <label>Email: </label>
                <input 
                className={`p-3 mb-2 bg-gray-200 w-full rounded-md`}
                type='email'
                value={email}
                placeholder='Enter your email...'
                onChange={e => setEmail(e.target.value)}
                />

                <label>Password: </label>
                <input 
                className={`p-3 mb-5 bg-gray-200 w-full rounded-md`}
                type='password'
                value={password}
                placeholder='Enter your password...'
                onChange={e => setPassword(e.target.value)}
                />

                <button 
                onClick={handleLogin}
                className={`p-3 mb-2 bg-blue-500 w-full text-white rounded-md shadow-lg
                    cursor-pointer hover:bg-blue-400 active:bg-blue-300`}>Login</button>
                    <p className={`text-red-300`}>{message}</p>
            </>) : (
              <>
                <button onClick={getDashboard} className={``}>Go to Dashboard</button>
                <button  onClick={() => {
                  localStorage.removeItem("token");
                  setToken("");
                }}>Log out</button>
                <p className={`text-red-300`}>{message}</p>
              </>
            ) }
        </div>
    </div>
  )
}

export default App