export interface Article{
  id: number;
  title: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
  isFavorite: boolean;
}

export interface ArticleContextType {
  articles: Article[];
  filteredArticles: Article[];
  setFilteredArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  fetchArticleById: (id: number) => Promise<Article | null>;
  toggleFavorite: (id: number) => Promise<void>;
  loading: boolean;
  createdArticle: (newArticle: Partial<Article>) => Promise<{success: boolean, message: string}>
  deleteArticle: (id: number) => Promise<void>
  fetchFavorites: () => Promise<void>;
  showAllArticles: () => void;
  displayArticles: Article[];
  isShowingFavorites: boolean;
}

export interface CardProps {
  id: number;
  deleteArticle: (id: number) => Promise<void>
}