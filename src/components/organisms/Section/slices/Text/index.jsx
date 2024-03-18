
import { HeroPicture } from "../Media";
import Tag from "../../../../atoms/Tag/index.";

import TextStyle from "./text.module.scss";

export const ProjectHero = ({
  images,
  alt,
  posterMobile,
  posterDesktop,
  widthDesktop,
  widthMobile,
  heightMobile,
  heightDesktop,
  lazy,
  url,
  crop,
  description,
  tags,
}) => {
  return (
    <>
      <HeroPicture
        url={url}
        crop={crop}
        images={images}
        alt={alt}
        posterMobile={posterMobile}
        posterDesktop={posterDesktop}
        widthDesktop={widthDesktop}
        heightDesktop={heightDesktop}
        widthMobile={widthMobile}
        heightMobile={heightMobile}
        lazy={lazy}
      />
      <section className={TextStyle.do_project_hero}>
        <p>{description}</p>
        <ul>
            {tags.map(element => {
              return <Tag>{element}</Tag>  
            })}
        </ul>
      </section>
    </>
  );
};

