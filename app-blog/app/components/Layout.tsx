import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useArticles } from "@/context/ArticleProvider";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const { articles, setFilteredArticles} = useArticles()
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar articles={articles} setFilteredArticles={setFilteredArticles}/>
            <main className="flex-grow">
                {children}
            </main>
            <Footer/>
        </div>
    )
}

export default Layout;