'use client'

import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Card from "./components/Card";

interface Article{
  id: number;
  title: string;
  content: string;
}

export default function Home() {

  const [articles, setArticles] = useState<Article[]>([])
  console.log(articles)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/articles')
    .then(response => response.json())
    .then(data => setArticles(data))
    .catch(error => console.log('Error al obtener los arctiulos: ', error))
  }, [])


  return (
   <>
      <Layout>
        <div className="container mx-auto py-10">
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">Lista de Proyectos</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              articles.map((article)=> (
              <Card
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
              />
              ))
            }
          </div>
        </div>
      </Layout>
   </>
  );
}
