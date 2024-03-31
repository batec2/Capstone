import {
  mouse,
  straightTo,
  Point,
  getActiveWindow,
  windowWithTitle,
  screen,
  keyboard,
  Key,
  Button,
} from "@nut-tree/nut-js";

const PIXEL_HIGH = { R: 56, G: 127, B: 32, A: 255 };
const PIXEL_LOW = { R: 25, G: 101, B: 14, A: 255 };

export const moveBot = async (filteredBoxes) => {
  try {
    const windowRef = await getActiveWindow();
    const region = await windowRef.region;
    const title = await windowRef.title;

    if (!title.includes("RuneLite") || !filteredBoxes) {
      return;
    }

    // Turns camera if there are no detections
    if (filteredBoxes.bounding.length === 0) {
      await keyboard.pressKey(Key.Left);
      setTimeout(30, async () => {
        keyboard.releaseKey(Key.Left);
      });
      return;
    }

    /**
     * bounding[0][1]: x position of top left
     * widthHeight[0][1]: width
     * bounding[0][0]: y position
     * widthHeight[0][1]: height
     */
    const { bounding, widthHeight } = filteredBoxes;

    const point = await generatePoint(
      region.top,
      region.left,
      bounding[0][1],
      bounding[0][0],
      widthHeight[0][1],
      widthHeight[0][0]
    );

    console.log(point);
    mouse.config.mouseSpeed = 500;
    // Moves mouse towards detected box
    // mouse.move(straightTo(point));
    // .then(async () => {
    //   await mouse.leftClick();
    // });
  } catch (e) {
    console.log(e);
  }
};

/**
 * Generates a random point within the bounding box that has a valid colour
 * @param {*} top
 * @param {*} left
 * @param {*} x
 * @param {*} y
 * @param {*} width
 * @param {*} height
 * @returns
 */
const generatePoint = async (top, left, x, y, width, height) => {
  let point = new Point(
    left + x + getRandomInt(width),
    top + y + getRandomInt(height)
  );
  while (await checkPoint(point)) {
    point = new Point(
      left + x + getRandomInt(width),
      top + y + getRandomInt(height)
    );
  }
  return point;
};

/**
 * Checks if the colour values of the point are within range
 * @param {*} point
 * @returns
 */
const checkPoint = async (point) => {
  const pixel = await screen.colorAt(point);
  if (
    pixel.R < PIXEL_HIGH.R &&
    pixel.R > PIXEL_LOW.R &&
    pixel.G < PIXEL_HIGH.G &&
    pixel.G > PIXEL_LOW.G &&
    pixel.B < PIXEL_HIGH.B &&
    pixel.B > PIXEL_LOW.B
  ) {
    return true;
  }
  return false;
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
