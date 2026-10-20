'use client'

import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Card from "./components/Card";
import { Article } from "@/types/article";

export default function Home() {

  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState <Article[]>([])


  useEffect(() => {
    fetch('http://127.0.0.1:5000/articles')
    .then(response => response.json())
    .then(data => {
      setArticles(data)
      setFilteredArticles(data);
    })
    .catch(error => console.log('Error al obtener los arctiulos: ', error))
  }, [])

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
  }

  return (
   <>
      <Layout articles={articles} setFilteredArticles={setFilteredArticles}>
        <div className="container mx-auto py-10">
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">Lista de Proyectos</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              filteredArticles.map((article)=> (
              <Card
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
              image_url={article.image_url}
              author={article.author}
              created_at={article.created_at}
              isFavorite={article.isFavorite}
              toggleFavorite={toggleFavorite}
              />
              ))
            }
          </div>
        </div>
      </Layout>
   </>
  );
}
