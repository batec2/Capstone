import { desktopCapturer } from "electron";
const getSourceId = async () => {
  try {
    const sources = await desktopCapturer.getSources({ types: ["window"] });
    for (const source of sources) {
      if (
        source.name === "RuneLite" ||
        source.name === "RuneLite - YameteOnii"
      ) {
        return source.id;
      }
    }
    return null;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getSourceId;
