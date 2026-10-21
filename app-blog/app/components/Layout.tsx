import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Article } from "@/types/article";

interface LayoutProps {
    children: React.ReactNode;
    articles: Article[];
    setFilteredArticles?: (articles: Article[]) => void;
}

const Layout: React.FC<LayoutProps> = ({children, articles, setFilteredArticles }) => {
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