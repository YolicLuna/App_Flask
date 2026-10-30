'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const {login} = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({email, password})
        })
        if (response.ok) {
            login()
            router.push('/')
        } else {
            const data = await response.json()
            setError(data.error || 'Error al iniciar la sesion')
        }
    }

    return(
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">
                Iniciar Sesion
            </h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg border border-devmoon-indigo/30">
                <div className="mb-4">
                    <label className="block text-gray-300 mb-1">Email</label>
                    <input 
                    type="email"
                    className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-devmoon-indigo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300">Password</label>
                    <input 
                    type="password"
                    className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-devmoon-indigo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                <button
                type="submit"
                className="w-full bg-devmoon-indigo text-white py-2 rounded hover:bg-devmoon-purple transition-colors"
                >
                    Iniciar Sesion
                </button>
            </form>
        </div>
    )
}

export default Login;
