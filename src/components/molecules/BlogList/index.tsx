
import Style from './style.module.scss';
import BlogItem from "../BlogItem"
import Tag from '@/components/atoms/Tag/index.';
import type { Article } from '@/types/blog';
import { useState } from 'react';

type BlogListProps = {
    categories: string[],
    articles: Article[]
}

const BlogList = ({
    categories,
    articles
}: BlogListProps) => {
    const [currentFilter, setCurrentFilter] = useState<string>('All');

    const filteredArticles = articles.filter((el) => {
        if (currentFilter === 'All') {
            return true;
        } else {
            return el.category === currentFilter;
        }
    });

    return (
        <section className={`${Style.root}`}>
            <ul className={`${Style.categories}`}>
                <li onClick={() => {
                    setCurrentFilter('All');
                }} data-active={currentFilter === "All"}>
                    <Tag>All</Tag>
                </li>
                {
                    categories.map((el, index) => {
                        return <li key={el + index} onClick={() => {
                            setCurrentFilter(el);
                        }} data-active={currentFilter === el}> <Tag>{el}</Tag></li>
                    })
                }
            </ul>
            <div>
                <ul className={`${Style.articles}`}>
                    {
                        filteredArticles.map((el, index) => {
                            return <li key={el.title + index}>
                                <a href={`/blog/${el.slug}/`}>
                                    <BlogItem {...el} />
                                </a>
                            </li>
                        })
                    }
                </ul>

            </div>

        </section>
    )
}

export default BlogList;