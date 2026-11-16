'use client';
import { AuthContextType } from "@/types/auth";
import React, {createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext<AuthContextType | undefined >(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('http://localhost:5000/check-auth', { credentials: 'include'})
                const data = await response.json()
                if (data.authenticated) {
                    setIsAuthenticated(data.authenticated)
                    setUsername(data.username)
                    setUserId(data.userId)
                } else {
                    setIsAuthenticated(false)
                    setUsername('')
                    setUserId(null)
                }
            } catch (error){
                console.error('Error al verificar la autenticacion', error)
                setIsAuthenticated(false)
                setUsername('')
            }
            finally {
                setLoading(false)
        }}
        checkAuthStatus();
    }, [])

    const register = async (username: string, email: string, password:string): Promise<{success: boolean, message: string}> => {
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, email, password})
            })
            if(response.ok) {
                const data = await response.json()
                setIsAuthenticated(true)
                setUsername(data.username)
                return {success: true, message:'Registro exitoso'}
            } else {
                return {success: false, message:'Error en el registro de ususario.'
                }
            }
        } catch (error) {
            console.error('Error al registrar usuario', error)
            return {success: false, message:'Error de conexion.'}
        }
    } 

    const login = (name: string, id: number) => {
        setIsAuthenticated(true)
        setUsername(name)
        setUserId(id)
    }

    const logout = () => {
        setIsAuthenticated(false)
        setUsername('')
        setUserId(null)
    }
    return(
        <AuthContext.Provider value={{isAuthenticated, loading, login,logout, username, register, userId}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (! context) {
        throw new Error('UseAuth debe usarse dentro de un AuthProvider')
    }
    return context;
}
