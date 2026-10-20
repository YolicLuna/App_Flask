import React, { useEffect, useState } from "react";
import Image from "next/image";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Article } from "@/types/article";

interface NavbarProps {
    articles: Article[];
    setFilteredArticles?: (articles: Article[]) => void
}

const Navbar: React.FC<NavbarProps> = ({articles, setFilteredArticles}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    console.log(isAuthenticated)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/check-auth', {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await response.json()
                setIsAuthenticated(data.authenticated)
            } catch (error) {
                console.log('Error al verificar la autenticacion.', error)
            }
        }

        checkAuth()
    }, []
        
    )

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/logout', {
                method: 'POST',
                credentials: 'include'
            })
            setIsAuthenticated(false)
        } catch (error) {
            console.log('Error al cerrar sesión', error)
        }
    }

    return (
        <nav className="bg-devmoon-dark text-white p-4 border-b border-devmoon-indigo/30">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className="flex items-center space-x-2">
                    <Image src="/image.png" alt="DevMoon" width={36} height={36} className="w-9 h-9" />
                    <span className="text-xl font-bold bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">
                        DevMoon
                    </span>
                </a>
                <SearchBar
                    articles = {articles}
                    setFilteredArticles={setFilteredArticles}
                    />
                <ul className="flex space-x-6 items-center">
                    {isAuthenticated && (
                        <li>
                            <Link href="/create" className="flex items-center hover:text-devmoon-accent transition-colors">
                                <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-6 w-6" />
                                Crear Articulo
                            </Link>
                        </li>
                    )}
                    {!isAuthenticated ? (
                        <li>
                            <Link href="/login" className="flex items-center hover:text-gray-300">
                                <FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-6 w-6" />
                                Inicio de Sesion
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <button onClick={handleLogout} className="flex items-center hover:text-gray-300">
                                <FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-6 w-6" />
                                Cerrar Sesion
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar