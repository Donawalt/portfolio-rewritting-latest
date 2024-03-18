import Picture from "../../../../atoms/Picture";
import Video from "../../../../atoms/Video/index.";

import MediaStyle from './media.module.scss';

export const HeroPicture = ({
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
}) => {
  return (
    <section className={MediaStyle.hero_picture}>
      <Picture
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
    </section>
  );
};

export const BasicPicture = ({
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
}) => {
  return (
    <section className={MediaStyle.basic_picture}>
      <Picture
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
    </section>
  );
};

export const FullPicture = ({
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
}) => {
  return (
    <section className={MediaStyle.full_picture}>
      <Picture
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
    </section>
  );
};

export const GridPicture = ({ pictures }) => {
  return (
    <section className={MediaStyle.grid_picture}>
      {pictures.map((image) => (
        <Picture
          url={image?.url}
          crop={image?.crop}
          images={image?.images}
          alt={image?.alt}
          posterMobile={image?.posterMobile}
          posterDesktop={image?.posterDesktop}
          widthDesktop={image?.widthDesktop}
          heightDesktop={image?.heightDesktop}
          widthMobile={image?.widthMobile}
          heightMobile={image?.heightMobile}
          lazy={image?.lazy}
        />
      ))}
    </section>
  );
};

export const DoublePicture = ({ pictureLeft, pictureRight, up}) => {
  return (
    <section className={MediaStyle.do_double_picture + " " + MediaStyle[up]}>
      <Picture
        url={pictureLeft?.url}
        crop={pictureLeft?.crop}
        images={pictureLeft?.images}
        alt={pictureLeft?.alt}
        posterMobile={pictureLeft?.posterMobile}
        posterDesktop={pictureLeft?.posterDesktop}
        widthDesktop={pictureLeft?.widthDesktop}
        heightDesktop={pictureLeft?.heightDesktop}
        widthMobile={pictureLeft?.widthMobile}
        heightMobile={pictureLeft?.heightMobile}
        lazy={pictureLeft?.lazy}
      />
      <Picture
        url={pictureRight?.url}
        crop={pictureRight?.crop}
        images={pictureRight?.images}
        alt={pictureRight?.alt}
        posterMobile={pictureRight?.posterMobile}
        posterDesktop={pictureRight?.posterDesktop}
        widthDesktop={pictureRight?.widthDesktop}
        heightDesktop={pictureRight?.heightDesktop}
        widthMobile={pictureRight?.widthMobile}
        heightMobile={pictureRight?.heightMobile}
        lazy={pictureRight?.lazy}
      />
    </section>
  );
};

// Video
export const BasicVideo = ({ url, poster, width, height, lazy }) => {
  return (
    <section>
      <Video
        url={url}
        poster={poster}
        width={width}
        height={height}
        lazy={lazy}
      />
    </section>
  );
};

// HTML Integration
export const BasicSnippet = () => {
  return <section></section>;
};
