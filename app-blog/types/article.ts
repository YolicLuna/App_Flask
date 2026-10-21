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
  toggleFavorite: (id: number) => void;
  loading: boolean;
}

export interface CardProps {
  id: number;
}