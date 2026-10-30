'use client';
import { Article, ArticleContextType } from "@/types/article";
import { useAuth } from "@/context/AuthProvider";
import React, {createContext, useContext, useState, useEffect} from "react";

const ArticleContext = createContext<ArticleContextType | undefined >(undefined);


export const ArticleProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const {isAuthenticated, loading: authLoading} = useAuth()
    const [articles, setArticles] = useState<Article[]>([])
    const [favorites, setFavorites] = useState<Article[]>([])
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
    const [isShowingFavorites, setIsShowingFavorites] = useState(false)
    const [loading, setLoading] = useState(true)
    const displayArticles = isShowingFavorites ? favorites : articles

    useEffect(() => {
        if (authLoading) return

        const fetchArticle = async () => {
            setLoading(true)
            try{
                const response = await fetch('http://localhost:5000/articles', {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error(`No se pudieron cargar los articulos (${response.status}).`)
                const data = await response.json();
                setArticles(data)
                setFavorites(data.filter((article: Article) => article.isFavorite))
                setFilteredArticles(data)
                setIsShowingFavorites(false)
            } catch (error) {
                console.error('Error al obtener los articulos', error)
            } finally {
                setLoading(false)
            }
        }
        fetchArticle()        
    }, [isAuthenticated, authLoading])

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

    const fetchFavorites = async() => {
        try {
            const response = await fetch('http://localhost:5000/favorites', {
                method: 'GET',
                 headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            })
            if(!response.ok) throw new Error('Fallo la conexion a favoritos')
            const favoriteArticles: Article[] = await response.json()
            const favoriteIds = new Set(favoriteArticles.map(article => article.id))
            setFavorites(favoriteArticles)
            setArticles(previous => previous.map(article => ({
                ...article,
                isFavorite: favoriteIds.has(article.id)
            })))
            setFilteredArticles(favoriteArticles)
            setIsShowingFavorites(true)
        } catch (error) {
            console.error('Error al hacer fetching de favorites', error)
        }
    }

    const showAllArticles = () => {
        setIsShowingFavorites(false)
        setFilteredArticles(articles)
    }

    const deleteArticle = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/articles/${id}`,{
                method: 'DELETE',
                headers: {'Content-type': 'application/json'},
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error('Huebo un error al eliminar un articulo.')
            }
            setArticles(prev => prev.filter(article => article.id !== id))
            setFavorites(prev => prev.filter(article => article.id !== id))
            setFilteredArticles(prev => prev.filter(article => article.id !== id))
        } catch (error) {
            console.log('Error al eliminar el articulo', error)
        }
    }

    const createdArticle = async (newArticle: Partial<Article>): Promise<{success:boolean, message:string}> => {
        try {
            const response = await fetch ('http://localhost:5000/create-article', {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newArticle)
            })
            if (response.ok) {
                const createdArticle = await response.json()
                setArticles(prev => [...prev, createdArticle])
                return{
                    success: true,
                    message: 'Articulo creado con exito.'
                }}else{
                    return {success: false, message: 'Error al crear el articulo.'
                }
            }
        } catch (error) {
            console.error('Error en la solicitud', error)
            return {success: false, message: 'Error en la solicitud.'}
        }
    }

    const toggleFavorite = async (id: number) => {
        const article = articles.find(item => item.id === id)
        if (!article) {
            console.error(`No se encontro el articulo ${id} para actualizar su favorito.`)
            return
        }

        const isFavorite = !article.isFavorite
        try {
            const response = await fetch(`http://localhost:5000/favorites/${id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({isFavorite})
            })
            if (!response.ok) {
                throw new Error(`No se pudo actualizar el favorito (${response.status}).`)
            }

            const updatedArticle = {...article, isFavorite}
            setArticles(previous => previous.map(item =>
                item.id === id ? updatedArticle : item
            ))
            setFavorites(previous => isFavorite
                ? [...previous.filter(item => item.id !== id), updatedArticle]
                : previous.filter(item => item.id !== id)
            )
        } catch (error) {
            console.error('Error al actualizar el favorito.', error)
        }
      }
      return (
        <ArticleContext.Provider value={{articles, filteredArticles, setFilteredArticles, displayArticles, isShowingFavorites, showAllArticles, toggleFavorite, loading, fetchFavorites, fetchArticleById, createdArticle, deleteArticle}}>
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
