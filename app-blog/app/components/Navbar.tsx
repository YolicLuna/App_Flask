import React from "react";

const Navbar = () => {
    return (
        <nav className="bg-indigo-600 text-whit p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="test-xl font-bold">Mi blog</h1>
                 <ul className="flex space-x-4">
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/">Crear</a>
                    </li>
                 </ul>
            </div>
        </nav>
    )
}

export default Navbar