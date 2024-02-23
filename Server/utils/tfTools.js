import * as tf from "@tensorflow/tfjs-node-gpu";
import * as fs from "node:fs";

/**
 *
 * @param {*} imageData
 * @param {*} rank
 * @returns
 */
export const getTensorFromImageData = (imageData, rank) => {
  return tf.browser.fromPixels(imageData, rank);
};

/**
 *
 * @param {*} location
 * @param {*} rank
 * @returns
 */
export const getTensorFromFile = (location, rank) => {
  const image = imageToTensor(location, rank);
  return resizeTensor(image);
};

/**
 *
 * @param {*} location
 * @param {*} rank
 * @returns
 */
export const imageToTensor = (location, rank) => {
  const image = fs.readFileSync(location);
  return tf.node.decodePng(image, rank);
};

/**
 * Saves a tensor to a png file
 * @param {*} tensor
 */
export const saveImage = (tensor) => {
  tf.node
    .encodePng(tensor)
    .then((image) => {
      fs.writeFileSync("redone.png", image);
    })
    .catch((err) => {
      console.log("Error at saveImage toPixel");
      console.log(err);
    });
};

/**
 * Resizes image tensor by padding tensor to the shape of 864x864
 * @param {*} image
 * @returns
 */
export const resizeTensor = (image) => {
  const height = image.shape[1];
  const width = image.shape[0];
  const padX = 864 - width;
  const padY = 864 - height;
  if (padX < 0 || padY < 0) {
    return null;
  }
  let img = image
    .pad([
      [0, padX],
      [0, padY],
      [0, 0],
    ]) //pads image to 864,864
    .div(255.0) //normalizing tensor to floats between 0-1
    .transpose([2, 0, 1]) //no idea, something about turning rows into columns?
    .expandDims(0); //it expands dimensions?

  return img; //[1,3,864,864] rank of 4 (4d array) to match model requirements
};

export const splitResult = (results) => {
  const detectedArrays = {
    bounding: [],
    widthHeight: [],
    scores: [],
    detectionClass: [],
  };
  results.forEach((result) => {
    detectedArrays.bounding.push(
      [
        result[1] - result[3] / 2, //y1
        result[0] - result[2] / 2, //x1
        result[1] + result[3] / 2, //y2
        result[0] + result[2] / 2,
      ] //x2
    );
    detectedArrays.widthHeight.push([result[3], result[2]]); //height,width
    detectedArrays.scores.push(result[4]); //scores
    detectedArrays.detectionClass.push(result[5]); //objectclass
  });
  return detectedArrays;
};

export const nonMaxSuppression = (results) => {
  const { bounding, scores } = splitResult(results);
  if (bounding.length > 0) {
    const box = tf.image.nonMaxSuppressionWithScore(
      bounding,
      scores,
      5,
      0.5,
      0.8,
      1 //0 normal NMS/1 softNMS
    );
    const selected = box.selectedIndices.dataSync();
    return selected;
  }
  // return tf.nonMaxSuppression(bounding, scores, 1, 0.5, 0.9);
};
