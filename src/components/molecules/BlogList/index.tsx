
import Style from './style.module.scss';
import BlogItem, { type BlogItemProps } from "../BlogItem"
import Tag from '@/components/atoms/Tag/index.';

type BlogListProps = {
    categories: string[], 
    articles: BlogItemProps[]
}

const BlogList =  ({
    categories,
    articles
}: BlogListProps) => {
    return (
        <section className={`${Style.root}`}>
            <ul className={`${Style.categories}`}>
                <li>
                    <Tag>All</Tag>
                </li>
                {
                    categories.map((el, index)=> {
                        return <li key={el+index}> <Tag>{el}</Tag></li>
                    })
                }
            </ul>
            <div>
            <ul className={`${Style.articles}`}>
                {
                    articles.map((el, index)=> {
                        return <li key={el.title+index}>
                            <BlogItem {...el} />
                        </li>
                    })
                }
            </ul>

            </div>

        </section>
    )
}

export default BlogList;