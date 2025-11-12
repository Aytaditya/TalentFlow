import { useState } from "react"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";


export default function LoginForm() {
  const [email, setEmail] = useState("aditya531@gmail.com")
  const [password, setPassword] = useState("adi123")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate=useNavigate()

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response=await axios.post("http://localhost:8082/api/login",{email,password})
      console.log(response.data);
      const token = response.data.token;
      login(token)
    } catch (error) {
      console.log(error)
    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-down">
          
          <h1 className="text-4xl font-bold text-white mb-2 transform hover:scale-105 transition-transform duration-300">
            Welcome Back Admin
          </h1>
          <p className="text-gray-400 text-sm animate-pulse">Sign in to access your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
              />
            </div>

            {/* Password Input */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
                  Password
                </label>
                <a href="#" className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-300 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="animate-shake p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 disabled:from-gray-900 disabled:to-gray-900 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 border border-gray-700 hover:border-gray-600 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>→</span>
                  Sign In
                </span>
              )}
            </button>
          </form>
         
        </div>
      </div>

      {/* Add custom animations to global CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </main>
  )
}