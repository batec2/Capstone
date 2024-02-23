import setVideo from "./video/setVideo";
document.getElementById("get-source").addEventListener("click", async () => {
  const video = document.getElementById("video");
  const id = await window.api.getSourceId();
  setVideo(id, video);
});
