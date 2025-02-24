export interface Author {
    name: string;
    picture: string;
}

export interface Article {
    category: string;
    title: string;
    description: string;
    date: string;
    readingTime: number;
    author: Author;
}

export type Category = "Development" | "Design" | "Photography" | "Thoughts";

export interface BlogData {
    categories: Category[];
    articles: Article[];
}