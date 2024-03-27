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

export const moveBot = async (filteredBoxes) => {
  try {
    const windowRef = await getActiveWindow();
    const region = await windowRef.region;
    const title = await windowRef.title;

    if (!title.includes("RuneLite")) {
      return;
    }

    // Turns camera if there are no detections
    // if (filteredBoxes.bounding.length === 0) {
    //   await keyboard.pressKey(Key.Left);
    //   setTimeout(30, async () => {
    //     keyboard.releaseKey(Key.Left);
    //   });
    //   return;
    // }

    const { bounding, widthHeight } = filteredBoxes;
    const point = new Point(
      region.left + bounding[0][1] + widthHeight[0][0] / 2,
      region.top + bounding[0][0] + widthHeight[0][1] / 2
    );
    mouse.config.mouseSpeed = 500;
    // Moves mouse towards detected box
    mouse.move(straightTo(point)).then(async () => {
      await mouse.leftClick();
    });
  } catch (e) {
    console.log(e);
  }
};
