import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    return (
        <nav className="bg-indigo-600 text-white p-4">
            <div className="container mx-auto flex justify-beteewn items-center">
                <div className="flex items-center space-x-4">
                    <a href="/" className="text-xl font-bold text-white">DevMoon</a>
                    <div className="relative">
                    <FontAwesomeIcon icon={faSearch} className="text-white absolute
                    top-3 h-5 w-5 ml-3" />
                        <input 
                        type="text"
                        placeholder="Buscar articulos..."
                        className="bg-gray-400 text-black rounded-full pl-10 pr-4 py-2 
                        focus:outline-none"
                        
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar