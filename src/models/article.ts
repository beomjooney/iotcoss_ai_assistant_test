export interface ArticleResponse {
  [key: string]: any;
  data: {
    data: ArticleData[];
  };
}

export interface ArticleData {
  id: number;
  issuingDetails: boolean;
  date: string;
  title: string;
  thumbnail_url: string;
  image_url: string;
  good: boolean;
  author: string;
  read: string;
  category: string;
}
