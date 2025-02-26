import { urlImageBuilder } from "@/assets/scripts/utils/api/urlBuilder";
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
    const ImageUrl = urlImageBuilder(author?.picture?.asset?._ref, 48, 48, undefined);

    console.log("Image Url", ImageUrl);

    return (
      <article className={`${Style.root}`}>
        <h2>{title}</h2>
        <p>{category}</p>
        <p>{description.slice(0, 200)}{description.length > 200 && '...'}</p>
        <div className={Style.info}>
            <img src={ImageUrl} alt="author" /><br/>
            <p>Author: {author.name}</p>
            <p><span>{new Date(date).toDateString()}</span><span>•</span><span>{Math.ceil(readingTime/60)} min read</span></p>
        </div>
      </article>
    )
}

export default BlogItem;