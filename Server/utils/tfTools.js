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

const nonMaxSuppression = (results) => {};

export const splitResult = (results) => {
  //gets top left xy, and bottom right xy
  const bounding = results.map((result) => [
    result[0] - result[2] / 2,
    result[1] - result[3] / 2,
    result[2],
    result[3],
  ]);
  const scores = results.map((result) => result[4]);
  const dectectionClass = results.map((result) => result[5]);

  return {
    bounding: bounding,
    scores: scores,
    detectionClass: dectectionClass,
  };
};
