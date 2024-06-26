import {
  BasicPicture,
  HeroPicture,
  FullPicture,
  GridPicture,
  DoublePicture,
  BasicVideo,
} from "./slices/Media";
import { ProjectHero } from "./slices/Text";
import Experiences from "./slices/Experiences";
import WorkingTogether from "./slices/Forms/WorkingTogether";
import Commitments from "./slices/Commitments";

const Section = (props: {
  type,
  images?,
  alt?,
  posterMobile?,
  posterDesktop?,
  widthDesktop?,
  widthMobile?,
  heightMobile?,
  heightDesktop?,
  lazy?,
  url?,
  crop?,
  pictures?,
  poster?,
  width?,
  height?,
  pictureLeft?,
  pictureRight?,
  description?,
  tags?,
  experiences?,
  title?,
  deliverables?, 
  localSize?
}) => {

  const { type,
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
    pictures,
    poster,
    width,
    height,
    pictureLeft,
    pictureRight,
    description,
    tags,
    experiences,
    title,
    deliverables, localSize} = props;
  switch (type) {
    case "commitments": 
      return <Commitments title={title} description={description} deliverables={deliverables} />
    case "experiences":
      return <Experiences title={title} description={description} experiences={experiences} />
    case "media-h-picture":
      return (
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
          localSize={localSize}
        />
      );
    case "media-b-picture":
      return (
        <BasicPicture
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
      );
    case "media-f-picture":
      return (
        <FullPicture
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
      );
    case "media-g-picture":
      return <GridPicture pictures={pictures} />;
    case "media-d-picture":
      return (
        <DoublePicture pictureLeft={pictureLeft} pictureRight={pictureRight} up={null}/>
      );
    case "media-b-video":
      return (
        <BasicVideo
          url={url}
          poster={poster}
          width={width}
          height={height}
          lazy={lazy}
        />
      );
    case "text-project-hero":
      return (
        <ProjectHero
          description={description}
          tags={tags}
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
      );
      case 'working-together':
        return (
          <WorkingTogether />
        )
    default:
      break;
  }
};

export default Section;
