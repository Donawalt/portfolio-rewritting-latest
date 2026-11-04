// Create a sanity image url builder
// https://cdn.sanity.io/images/<project id>/production/<id>?rect=<rect>?w=<width>&h=<height>
// @param {id} id - the id of the image
// @param {width} width - the width of the image
// @param {height} height - the height of the image
// @param {rect} rect - the rect of the image

import { createImageUrlBuilder } from "@sanity/image-url";
import { getImageDimensions } from "@sanity/asset-utils";
// Get a pre-configured url-builder from your sanity client
const builder = createImageUrlBuilder({ dataset: 'production', projectId: '6mijc31d'});

const PROJECT_ID = '6mijc31d';
const DATASET = 'production';

export const urlFileBuilder = (id) => {
  if (!id) return null;
  if (typeof id === 'string' && (id.startsWith('http://') || id.startsWith('https://'))) {
    return id;
  }
  // Handle Sanity file asset reference like file-<id>-<ext>
  if (typeof id === 'string' && id.startsWith('file-')) {
    const parts = id.split('-');
    if (parts.length >= 3) {
      const ext = parts[parts.length - 1];
      const assetId = parts.slice(1, parts.length - 1).join('-');
      return `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${assetId}.${ext}`;
    }
  }
  // Handle Sanity image asset reference like image-<id>-<width>x<height>-<ext>
  // Used for video posters, which are stored as image references.
  if (typeof id === 'string' && id.startsWith('image-')) {
    const parts = id.split('-');
    if (parts.length >= 3) {
      const ext = parts[parts.length - 1];
      const assetId = parts.slice(1, parts.length - 1).join('-');
      return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${assetId}.${ext}?w=1280&q=75&auto=format`;
    }
  }
  // If it's already a full path or different format
  return id;
};

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
export const urlImageBuilder = (id, width, height, cropData, type) => {
  const percentToPx = (percent, dimension) => {
    return parseInt((percent / 100) * dimension);
  };

  const originalDimensions = getImageDimensions(id);
  const isWebp = type === 'webp';

  // Never ask the CDN for more pixels than the source has: upscaled images are
  // both blurry and several times larger. Scale width and height together so
  // the requested aspect ratio (and therefore the crop) stays identical.
  const clampToOriginal = (targetWidth, targetHeight) => {
    if (!targetWidth || !targetHeight) {
      return { width: targetWidth, height: targetHeight };
    }
    const scale = Math.min(
      1,
      originalDimensions.width / targetWidth,
      originalDimensions.height / targetHeight
    );
    return {
      width: Math.max(1, Math.round(targetWidth * scale)),
      height: Math.max(1, Math.round(targetHeight * scale)),
    };
  };

  const finalise = (image) => {
    const sized = image.quality(isWebp ? 75 : 78);
    return (isWebp ? sized.format('webp') : sized).url();
  };

  if (!cropData) {
    const size = clampToOriginal(width, height);
    let image = builder.image(id);
    if (size.width) image = image.width(size.width);
    if (size.height) image = image.height(size.height);
    return finalise(image);
  }

  const size = clampToOriginal(width, height);
  const cropDataInPx = {
    left: percentToPx(cropData?.left * 100, originalDimensions.width),
    right: percentToPx(cropData?.right * 100, originalDimensions.width),
    top: percentToPx(cropData?.top * 100, originalDimensions.height),
    bottom: percentToPx(cropData?.top * 100, originalDimensions.height),
  };

  let image = builder
    .image(id)
    .rect(
      // X
      cropData?.left ? cropDataInPx.left : 0,
      // Y
      cropData?.top ? cropDataInPx.top : 0,
      // Width
      originalDimensions.width - cropDataInPx.left - cropDataInPx.right,
      // Height
      originalDimensions.height - cropDataInPx.top - cropDataInPx.bottom
    );

  if (size.width) image = image.width(size.width);
  if (size.height) image = image.height(size.height);

  return finalise(image);
};


// export const urlImageBuilder = (id, width, height, cropData, type) => {
//   console.log("This is cropData", cropData)
//   const getPixelCropData = (cropData) => {

//     if(!cropData)
//       return null;

//     const width = cropData.width;
//     const height = cropData.height;
//     const left = percentToPx(cropData.left * 100, width);
//     const top = percentToPx(cropData.top * 100, height);
//     const right = percentToPx(cropData.right * 100, width);
//     const bottom = percentToPx(cropData.bottom * 100, height);



//     // if value is not number return null to prevent error
//     if (isNaN(top)) {
//         return null;
//     } else {
//         return `${parseInt(left)},${parseInt(top)},${
//             parseInt(width) - parseInt(left) - parseInt(right) - 1
//           },${parseInt(height) - parseInt(top) - parseInt(bottom) - 1}`;
//     }

//   };

//   const percentToPx = (percent, dimension) => {
//     return (percent / 100) * dimension;
//   };


//   const query = (getPixelCropData(cropData) ? `?rect=${getPixelCropData(cropData) +  (width ? "&w=" + width : "") +
//   (height ? "&h=" + height : "")}` :  (width ? "?w=" + width : "") +
//   (height ? "&h=" + height : "")) + (type === 'webp' ? "&auto=format" : "");

//   let params = id.split("-")

//   return `https://cdn.sanity.io/images/wb1evjha/rdo/${params[1]}-${params[2]}.${params[3]}${query}`;
// };