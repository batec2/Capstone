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
import { focusWindow } from "./windows";

const PIXEL_HIGH = { R: 56, G: 127, B: 32, A: 255 };
const PIXEL_LOW = { R: 25, G: 101, B: 14, A: 255 };

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
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

/**
 * Generates a random point within the bounding box that has a valid colour
 * @param {*} left - left of window on screen
 * @param {*} top - top of window on screen
 * @param {*} x - left of bounding box
 * @param {*} y - top of bounding box
 * @param {*} width - width of bounding box
 * @param {*} height - height of bounding box
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

export const moveBot = async (filteredBoxes) => {
  try {
    const windowRef = await getActiveWindow();
    const region = await windowRef.region;
    const title = await windowRef.title;

    if (!title.includes("RuneLite") || !filteredBoxes) {
      // moveCameraWithScroll(region.width, region.height);
      return;
    }

    // Turns camera if there are no detections
    if (filteredBoxes.bounding.length === 0) {
      console.log("Moving Camera");
      moveCameraWithScroll(
        region.top,
        region.left,
        region.width,
        region.height
      );
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

    // console.log(point);
    console.log(region.top, region.left);
    // Moves mouse towards detected box
    // mouse.move(straightTo(point));
    // .then(async () => {
    //   await mouse.leftClick();
    // });
  } catch (e) {
    console.log(e);
  }
};

const generatePointNoValidation = async (top, left, x, y, width, height) => {
  console.log(
    `top: ${top} left: ${left} x: ${x} y: ${y} width: ${width} height: ${height}`
  );
  return new Point(
    left + x + getRandomInt(width),
    top + y + getRandomInt(height)
  );
};

/**
 *
 * @param {*} top - top of window on screen
 * @param {*} left - left of window on screen
 * @param {*} width
 * @param {*} height
 */
export const moveCameraWithScroll = async (top, left, width, height) => {
  const x = width / 6;
  const y = height / 3;
  const x_r = (width / 6) * 4;

  const leftPoint = generatePointNoValidation(
    top,
    left,
    x,
    y + height / 3 / 2,
    width / 6,
    height / 3 / 2
  );

  const rightPoint = generatePointNoValidation(
    top,
    left,
    x_r,
    y,
    width / 6,
    height / 3 / 2
  );

  try {
    mouse.config.mouseSpeed = 1300;
    mouse.move(straightTo(leftPoint)).then(async () => {
      mouse.config.mouseSpeed = 1600;
      await mouse.pressButton(Button.MIDDLE);
      mouse.move(straightTo(rightPoint)).then(async () => {
        await mouse.releaseButton(Button.MIDDLE);
      });
    });
  } catch (e) {
    console.log(e);
  }
};

export class Bot {
  mouseLoop = null;
  cameraLoop = null;
  window = null;

  constructor(window) {
    this.window = window;
  }

  get window() {
    return this.window;
  }

  focusWindow() {
    focusWindow(this.window);
  }

  /**
   *
   * @param {*} currentDetection
   * @param {*} clientData
   */
  runBot(currentDetection, clientData) {
    const { camera, player, moving, animation } = clientData;
    // if()
    if (!clientData || moving || !(animation === -1)) {
      this.clearAllLoops();
      return;
    }
    if (currentDetection.bounding.length === 0) {
      this.startCameraLoop();
    } else if (currentDetection.bounding.length > 0) {
      this.startMouseLoop();
    }
  }

  /**
   * Sets a Interval to the camera
   * @returns
   */
  startCameraLoop() {
    if (this.cameraLoop) {
      return;
    }
    this.cameraLoop = setInterval(() => {
      console.log("moving mouse");
    }, 1000);
  }

  /**
   * sets an interval to move the mouse
   * @returns
   */
  startMouseLoop() {
    if (this.mouseLoop) {
      return;
    }
    this.mouseLoop = setInterval(() => {
      console.log("moving camera");
    }, 1000);
  }

  clearMouseLoop() {
    clearInterval(this.mouseLoop);
    this.mouseLoop = null;
  }

  clearCameraLoop() {
    clearInterval(this.cameraLoop);
    this.cameraLoop = null;
  }

  clearAllLoops() {
    this.clearCameraLoop();
    this.clearMouseLoop();
  }
}
