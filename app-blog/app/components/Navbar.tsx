import React from "react";
import Image from "next/image";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faSearch, faPlusCircle, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    return (
        <nav className="bg-devmoon-dark text-white p-4 border-b border-devmoon-indigo/30">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className="flex items-center space-x-2">
                    <Image src="/image.png" alt="DevMoon" width={36} height={36} />
                    <span className="text-xl font-bold bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">
                        DevMoon
                    </span>
                </a>
                <div className="flex-grow">
                <div className="relative max-w-md mx-auto">
                    <div className="relative">
                    <FontAwesomeIcon icon={faSearch} className="text-white absolute left-3 top-3 h-5 w-5 ml-3" />
                        <input 
                        type="text"
                        placeholder="Buscar articulos..."
                        className="bg-gray-800 text-white placeholder-gray-500 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-devmoon-indigo"
                        
                        />
                    </div>
                </div>
                </div>
                <ul className="flex space-x-6 items-center">
                    <li>
                        <a href="/create" className="flex items-center hover:text-devmoon-accent transition-colors">
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-6 w-6"/>
                        Crear Articulo
                        </a>
                    </li>
                    <li>
                        <a href="/create" className="flex items-center hover:text-gray-300">
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-6 w-6"/>
                        Inicio de Sesion
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar