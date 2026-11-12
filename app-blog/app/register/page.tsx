'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";


const Register = () => {
    const {register} = useAuth();
    const [username, setUsername] = useState('');   
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await register(username, email, password)
            if (result.success) {
                router.push('/')
            } else {
                setError(result.message)
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }else {
                setError('Error al registrarse')
            }
        }
    }
  return (
    <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">
            Crear Cuanta</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg  border border-devmoon-indigo/30">
            <div className="mb-4">
                <label className="block text-gray-300 mb-1">Nombre de Usuario</label>
                <input 
                type="text"
                className="w-full p-2 bg-gray-800 text-white border vorder-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-devmoon-indigo"
                value = {username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-300 mb-1">Email</label>
                <input 
                type="email"
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-devmoon-indigo"
                value = {email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-300 mb-1">Password</label>
                <input 
                type="password"
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-devmoon-indigo"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>
            <button 
                type="submit"
                className="w-full bg-devmoon-indigo text-white py-2 rounded hover:bg-devmoon-purple transition-colors">
                Registrarse
            </button>
        </form>
    </div>
  )
}

export default Register
