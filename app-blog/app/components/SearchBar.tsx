import React, { useEffect, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Article } from "@/types/article";

interface SearchBarProps{
    articles: Article[];
    setFilteredArticles?: (articles: Article[]) => void
}

const SearchBar: React.FC<SearchBarProps> = ({articles, setFilteredArticles}) => {

    const [query, setQuery] = useState('')

    useEffect(() => {
        if (setFilteredArticles) {
            if (query === ''){
                setFilteredArticles(articles)
            } else {
                setFilteredArticles(
                    articles.filter((article: Article) =>
                     article.title.toLowerCase().includes(query.toLocaleLowerCase()) ||
                     article.content.toLowerCase().includes(query.toLocaleLowerCase())
                    )
                )
            }
        }
    
    },[query, articles, setFilteredArticles])

 return (
        <div className="flex-grow">
    <div className="relative max-w-md mx-auto">
    <div className="relative">
        <FontAwesomeIcon icon={faSearch} className="text-white absolute left-3 top-3 h-5 w-5 ml-3" />
            <input 
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Buscar articulos..."
            className="bg-gray-800 text-white placeholder-gray-500 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-devmoon-indigo"
            suppressHydrationWarning
            />
        </div>
        </div>
        </div>
    )
}

export default SearchBar