import { mouse, straightTo, Point, screen, Button } from "@nut-tree/nut-js";
import { focusWindow } from "./windows";
import { io } from "socket.io-client";

const PIXEL_HIGH = { R: 56, G: 127, B: 32, A: 255 };
const PIXEL_LOW = { R: 25, G: 101, B: 14, A: 255 };
const PIXEL = { R: 255, G: 0, B: 0, A: 255 };

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
  if (pixel.R === PIXEL.R && pixel.G === PIXEL.G && pixel.B === PIXEL.B) {
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
  let point;
  let check = false;
  do {
    point = new Point(
      left + x + getRandomInt(width),
      top + y + getRandomInt(height)
    );
    check = await checkPoint(point);
  } while (check === false);
  return point;
};

/**
 *
 * @param {*} top
 * @param {*} left
 * @param {*} x
 * @param {*} y
 * @param {*} width
 * @param {*} height
 * @returns
 */
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
    await mouse.move(straightTo(leftPoint));
    mouse.config.mouseSpeed = 1600;
    await mouse.pressButton(Button.MIDDLE);
    await mouse.move(straightTo(rightPoint));
    await mouse.releaseButton(Button.MIDDLE);
  } catch (e) {
    console.log(e);
  }
};

const moveMouse = async (points) => {
  for (let i = 0; i < points.length; i++) {
    try {
      let point = new Point(points[i][0], points[i][1]);
      await mouse.move(straightTo(point));
      point = null;
    } catch (e) {
      console.log(e);
    }
  }
  console.log("done Moving");
  return;
};

/**
 *
 * @param {bounding,widthHeight} box
 * @param {*} region
 */
const moveMouseToBox = async (
  { bounding, widthHeight },
  region,
  mouseSocket
) => {
  let point;
  try {
    point = await generatePoint(
      region.top,
      region.left,
      bounding[0][1],
      bounding[0][0],
      widthHeight[0][1],
      widthHeight[0][0]
    );
  } catch (e) {
    console.log;
  }
  if (!point) {
    return;
  }
  const currentPos = await mouse.getPosition();
  // mouseSocket.emit(
  //   "points",
  //   { start: [currentPos.x, currentPos.y], end: [point.x, point.y] },
  //   async (points) => {
  //     try {
  //       await moveMouse(points);
  //       await mouse.leftClick();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // );
  // Moves mouse towards detected box
  await mouse.move(straightTo(point));
  await mouse.leftClick();
};

export class Bot {
  mouseLoop = null;
  cameraLoop = null;
  window = null;
  region = null;
  currentDetection = null;
  mouseInterval = 1200;
  cameraInterval = 1500;
  mouseSocket = null;

  constructor(window) {
    this.window = window;
    this.mouseSocket = io.connect("http://localhost:8000");
  }

  get window() {
    return this.window;
  }

  async setRegion() {
    try {
      this.region = await this.window.region;
      // console.log(this.region);
    } catch (e) {
      console.log(e);
    }
  }

  async focusWindow() {
    try {
      // console.log(this.window);
      await focusWindow(this.window);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   *
   * @param {*} currentDetection
   * @param {*} clientData
   */
  runBot(currentDetection, clientData) {
    this.currentDetection = currentDetection;
    const { camera, player, moving, animation } = clientData;
    // if()
    if (!clientData || moving || !(animation === -1)) {
      this.clearAllLoops();
      return;
    }
    if (currentDetection.bounding.length === 0) {
      if (this.cameraLoop) {
        return;
      }
      this.startCameraLoop();
    } else if (currentDetection.bounding.length > 0) {
      if (this.mouseLoop) {
        return;
      }
      this.startMouseLoop();
    }
  }

  /**
   * Sets a Interval to the camera
   * @returns
   */
  startCameraLoop() {
    this.clearMouseLoop();
    this.cameraLoop = setTimeout(async () => {
      console.log("moving camera");
      await moveCameraWithScroll(
        this.region.top,
        this.region.left,
        this.region.width,
        this.region.height
      );
      this.startCameraLoop();
    }, this.cameraInterval);
  }

  /**
   * sets an interval to move the mouse
   * @returns
   */
  startMouseLoop() {
    this.clearCameraLoop();
    this.mouseLoop = setTimeout(async () => {
      console.log("Moving mouse");
      moveMouseToBox(this.currentDetection, this.region, this.mouseSocket);
      this.startMouseLoop();
    }, this.mouseInterval);
  }

  clearMouseLoop() {
    clearTimeout(this.mouseLoop);
    this.mouseLoop = null;
  }

  clearCameraLoop() {
    clearTimeout(this.cameraLoop);
    this.cameraLoop = null;
  }

  clearAllLoops() {
    this.clearCameraLoop();
    this.clearMouseLoop();
  }
}
