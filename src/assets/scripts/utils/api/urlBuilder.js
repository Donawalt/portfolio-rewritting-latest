// Create a sanity image url builder
// https://cdn.sanity.io/images/<project id>/production/<id>?rect=<rect>?w=<width>&h=<height>
// @param {id} id - the id of the image
// @param {width} width - the width of the image
// @param {height} height - the height of the image

export const urlImageBuilder = (id, width, height, cropData={bottom: 0,left: 0,right: 0,top: 0}, type) => {
  const getPixelCropData = (cropData) => {

    const width = cropData.width;
    const height = cropData.height;
    const left = percentToPx(cropData.left * 100, width);
    const top = percentToPx(cropData.top * 100, height);
    const right = percentToPx(cropData.right * 100, width);
    const bottom = percentToPx(cropData.bottom * 100, height);



    // if value is not number return null to prevent error
    if (isNaN(top)) {
        return null;
    } else {
        return `${parseInt(left)},${parseInt(top)},${
            parseInt(width) - parseInt(left) - parseInt(right) - 1
          },${parseInt(height) - parseInt(top) - parseInt(bottom) - 1}`;
    }

  };

  const percentToPx = (percent, dimension) => {
    return (percent / 100) * dimension;
  };
  const query = (getPixelCropData(cropData) ? `?rect=${getPixelCropData(cropData) +  (width ? "&w=" + width : "") +
  (height ? "&h=" + height : "")}` :  (width ? "?w=" + width : "") +
  (height ? "&h=" + height : "")) + (type === 'webp' ? "&auto=format" : "");

  let test = id.split("-")

  return `https://cdn.sanity.io/images/do9hw7sx/production/${test[1]}-${test[2]}.${test[3]}${query}`;
};

export const urlFileBuilder = (id) => {

  let test = id.split("-")

  return `https://cdn.sanity.io/files/do9hw7sx/production/${test[1]}.${test[2]}`;
};