import Style from "./style.module.scss";

export type BlogItemProps = {
    category: string, 
    title: string, 
    description: string,
    date: string,
    readingTime: number,
    author: {
        name: string,
        picture: string, 
    }
}


const BlogItem = ({category, title, description, date, readingTime, author}: BlogItemProps) => {
    return (
      <article className={`${Style.root}`}>
        <h2>{title}</h2>
        <p>{category}</p>
        <p>{description}</p>
        <div className={Style.info}>
            <img src={author.picture} alt="author" /><br/>
            <p>Author: {author.name}</p>
            <p><span>{new Date(date).toDateString()}</span><span>•</span><span>{Math.ceil(readingTime/60)} min read</span></p>
        </div>
      </article>
    )
}

export default BlogItem;