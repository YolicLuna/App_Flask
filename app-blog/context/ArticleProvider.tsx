'use client';
import { Article, ArticleContextType } from "@/types/article";
import React, {createContext, useContext, useState, useEffect} from "react";

const ArticleContext = createContext<ArticleContextType | undefined >(undefined);


export const ArticleProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [articles, setArticles] = useState<Article[]>([])
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticle = async () => {
            try{
                const response = await fetch('http://localhost:5000/articles');
                const data = await response.json();
                setArticles(data)
                setFilteredArticles(data)
            } catch (error) {
                console.log('Error al obtener los articulos', error)
            } finally {
                setLoading(false)
            }
        }
        fetchArticle()        
    }, [])

    const fetchArticleById = async (id: number): Promise <Article | null> => {
        const existingArticle = articles.find(article => article.id === id);
        if (existingArticle) return existingArticle;

        try {
            const response = await fetch(`http://localhost:5000/article/${id}`);
            if (!response.ok) throw new Error('Articulo no encontrado.')
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error al obtener el articulo id', error)
            return null
        }
    }

    const toggleFavorite = (id: number) => {
        setArticles(
          prevArticles => prevArticles.map( article =>
            article.id === id
            ? {
              ...article,
              isFavorite: !article.isFavorite
            }
            : article
          )
        )
        const updateArticle = articles.find(article => article.id === id)

        fetch(`http://localhost/favorites/${id}`,{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({isFavorite: updateArticle ? ! updateArticle.isFavorite: false})
        })
        .catch(error=> console.error('Error al actualizar el favorito.', error))
      }
      return (
        <ArticleContext.Provider value={{articles, filteredArticles, setFilteredArticles, toggleFavorite, loading, fetchArticleById}}>
            {children}
        </ArticleContext.Provider>
      )
}

export const useArticles = () => {
    const context = useContext(ArticleContext)
    if (!context) {
        throw new Error('useArticles debe usarse dentro de un Articleprovider')
    }
    return context;
}
