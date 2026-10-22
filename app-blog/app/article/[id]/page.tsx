'use client';
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import { useArticles } from "@/context/ArticleProvider";
import { Article } from "@/types/article";

const ArticlePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const { fetchArticleById } = useArticles()

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const resolvedParams = await params;
        const articleData = await fetchArticleById(parseInt(resolvedParams.id))
        setArticle(articleData)
      } catch (error) {
        console.error('Error al obtener el articulo.', error)
      }
    }
    loadArticle()
  }, [params, fetchArticleById])

  

  if (!article) {
    return (
      <Layout>
          <p className="text-center text-gray-300 mt-8">Cargando artículo...</p>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        {
          article.image_url && (
            <div className="mb-6">
              <img src={article.image_url} alt={article.title} className="w-fill h-64 object-cover ounded-lg shadow-md"/>
            </div>
          )
        }
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">{article.title}</h1>
        <div className="flex items-center text-devmoon-indigo/70 mb-6 text-ms">
        <p>Publicado: {article.created_at }</p>
        <span className="mx-2"> | </span>
        <p>Autor: {article.author}</p>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed">{article.content}</p>
      </div>
    </Layout>
  );
};

export default ArticlePage;