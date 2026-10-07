'use client';
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";

interface Article {
  id: number;
  title: string;
  content: string;
}

const ArticlePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/article/${id}`)
      .then((response) => response.json())
      .then((data) => setArticle(data))
      .catch((error) => console.error('Error al obtener el artículo', error));
  }, [id]);

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <p className="text-center text-gray-300">Cargando artículo...</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">{article.title}</h1>
        <p className="text-gray-200">{article.content}</p>
      </div>
    </Layout>
  );
};

export default ArticlePage;