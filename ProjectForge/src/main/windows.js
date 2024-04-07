import { getWindows, getFocusedWindow } from "@nut-tree/nut-js";

export const findWindow = async () => {
  const windows = await getWindows();
  for (let window of windows) {
    const title = await window.title;
    if (title.includes("RuneLite")) {
      return window;
    }
  }
  return null;
};

export const focusWindow = (window) => {
  if (!window) {
    return null;
  }
  try {
    window.focus();
  } catch (e) {
    console.log("FAILED:" + e);
    return null;
  }
};
