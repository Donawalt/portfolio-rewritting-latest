export type SanityImageRef = {
    asset?: { _ref?: string };
};

export interface Author {
    name: string;
    picture: string | SanityImageRef;
}

export interface Article {
    category: string;
    title: string;
    description: string;
    date: string;
    readingTime: number;
    author: Author;
    slug: string;
    seoSlug?: { current?: string };
    seoDescription?: string;
    _createdAt?: string;
}

export type Category = "Development" | "Design" | "Photography" | "Thoughts";

export interface BlogData {
    categories: Category[];
    articles: Article[];
}