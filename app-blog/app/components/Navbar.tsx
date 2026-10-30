import React from "react";
import Image from "next/image";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSignInAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Article } from "@/types/article";
import { useArticles } from "@/context/ArticleProvider";
import { useAuth } from "@/context/AuthProvider";

interface NavbarProps {
    articles: Article[];
    setFilteredArticles?: (articles: Article[]) => void
    onOpenCreateModal?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({articles, setFilteredArticles, onOpenCreateModal}) => {

    const {fetchFavorites, showAllArticles, isShowingFavorites} = useArticles()
    const {isAuthenticated, logout} = useAuth()

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error(`No se pudo cerrar la sesion (${response.status}).`)
            }
            showAllArticles()
            logout()
        } catch (error) {
            console.error('Error al cerrar sesión', error)
        }
    }

    return (
        <nav className="bg-devmoon-dark text-white p-4 border-b border-devmoon-indigo/30">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <Image src="/image.png" alt="DevMoon" width={36} height={36} className="w-9 h-9" />
                    <span className="text-xl font-bold bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">
                        DevMoon
                    </span>
                </Link>
                <SearchBar
                    articles = {articles}
                    setFilteredArticles={setFilteredArticles}
                    />
                <ul className="flex space-x-6 items-center">
                    {
                    isAuthenticated && (
                    <>
                        <li>
                            <button
                                onClick={isShowingFavorites ? showAllArticles : fetchFavorites}
                                className="flex items-center hover:text-devmoon-accent transition-colors"
                            >
                                <FontAwesomeIcon icon={faStar} className="mr-2 h-5 w-6"/>
                                {isShowingFavorites ? 'Todos los articulos' : 'Favoritos'}
                            </button>
                        </li>
                        {onOpenCreateModal && (
                            <li>
                                <button onClick={onOpenCreateModal} className="flex items-center hover:text-devmoon-accent transition-colors">
                                    <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-6 w-6" />
                                    Crear Articulo
                                </button>
                            </li>
                        )}
                    </>
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