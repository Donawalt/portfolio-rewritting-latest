
import Style from './style.module.scss';
import BlogItem from "../BlogItem"
import Tag from '@/components/atoms/Tag/index.';
import type { Article } from '@/types/blog';
import { useState } from 'react';
import Button from '@/components/atoms/Button';

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
                {
                    filteredArticles.length === 0 && <p style={{
                        textAlign: "center",
                    }}>No articles found 😢, you can still visit my <br/> <br/><span style={{
                        width: "fit-content", 
                        display: "inline-block"
                    }}><Button type="link" href="/projects">Projects</Button></span></p>
                }
                <ul className={`${Style.articles}`}>
                    {
                        filteredArticles.map((el, index) => {
                            return <li key={el.title + index}>
                                <a href={`/blog/${el.slug || el?.seoSlug?.current}/`}>
                                    <BlogItem  {...el} date={el?._createdAt} description={el?.seoDescription}/>
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