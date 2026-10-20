export interface Article{
  id: number;
  title: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
  isFavorite: boolean;
}

export interface CardProps {
  id: number;
  title: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
  isFavorite: boolean;
  toggleFavorite: (id: number) => void;
}