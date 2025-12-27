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

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
export const urlImageBuilder = (id, width, height, cropData, hotspot, type) => {
  const percentToPx = (percent, dimension) => {
    return parseInt((percent / 100) * dimension);
  };

  const originalDimensions = getImageDimensions(id);

  if (!cropData) {
    return builder.image(id).width(width).height(height).url();
  }

  const cropDataInPx = {
    left: percentToPx(cropData?.left * 100, originalDimensions.width),
    right: percentToPx(cropData?.right * 100, originalDimensions.width),
    top: percentToPx(cropData?.top * 100, originalDimensions.height),
    bottom: percentToPx(cropData?.top * 100, originalDimensions.height),
  };

  return builder
    .image(id)
    .width(width)
    .height(height)
    .rect(
      // X
      cropData?.left ? cropDataInPx.left : 0,
      // Y
      cropData?.top ? cropDataInPx.top : 0,
      // Width
      originalDimensions.width - cropDataInPx.left - cropDataInPx.right,
      // Height
      originalDimensions.height - cropDataInPx.top - cropDataInPx.bottom
    )
    .url();
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


export const urlFileBuilder = (id) => {
  let params = id.split("-");

  return `https://cdn.sanity.io/files/wb1evjha/rdo/${params[1]}.${params[2]}`;
};