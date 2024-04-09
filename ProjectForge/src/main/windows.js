import { getWindows, getFocusedWindow } from "@nut-tree/nut-js";

export const findWindow = async () => {
  const windows = await getWindows();
  for (let window of windows) {
    const title = await window.title;
    if (title.includes("RuneLite")) {
      console.log("WINDOW:" + title);
      return window;
    }
  }
  return null;
};

export const focusWindow = async (window) => {
  if (!window) {
    return null;
  }
  try {
    await window.focus();
  } catch (e) {
    throw e;
  }
};
