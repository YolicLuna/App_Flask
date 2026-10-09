import React, { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        const response = await fetch('http://127.0.0.1:500/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        })
        if (response.ok) {
            router.push('/')
        } else {
            const data = await response.json()
            setError(data.error || 'Error al iniciar la sesion')
        }
    }
}
