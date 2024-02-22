/**
 * Preload allows main and renderer threads to talk to each other, Electron
 * sandboxes renderers(the window that the user sees)
 */
const { contextBridge, ipcRenderer } = require("electron");

let globalStream;
let videoTrack;
let imageCapture;

contextBridge.exposeInMainWorld("api", {
  //Put things here to expose in renderer.js
  getImage: (image) => ipcRenderer.send("getImage", image),
  getSource: () => {
    ipcRenderer.send("start");
  },
  sendFrame: () => ipcRenderer.send("send-frames"),
});

ipcRenderer.on("SET_SOURCE", async (event, sourceId) => set_source(sourceId));

async function set_source(sourceId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId,
        },
      },
    });
    globalStream = stream;
    videoTrack = stream.getVideoTracks()[0];
    imageCapture = new ImageCapture(videoTrack);
    handleStream(stream);

    // setInterval(getImageData,100);
  } catch (err) {
    console.log(err);
  }
}

ipcRenderer.on("bounding box", (event, boundingArray) => {
  drawBoundingBox(boundingArray.bounding);
});

function handleStream(stream) {
  const video = document.getElementById("video-player");
  video.srcObject = stream;
  video.onloadedmetadata = (e) => {
    video.play();
    const canvas = document.getElementById("overlay-canvas");
    const dataCanvas = document.getElementById("data-canvas");
    canvas.height = video.clientHeight;
    canvas.width = video.clientWidth;
    dataCanvas.height = video.clientHeight;
    dataCanvas.width = video.clientWidth;
  };
}

/**
 * Takes a frame from a video track and sends it to the main thread
 * to be processed by model
 */
function getImageData() {
  // takes a frame from the video stream to send to the main thread
  imageCapture
    .grabFrame()
    .then((imageBitmap) => {
      // temporary canvas to draw image on
      const canvas = document.getElementById("data-canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      // draws image on canvas
      ctx.drawImage(imageBitmap, 0, 0);
      // takes the imageData from the canvas
      const imageData = ctx.getImageData(
        0,
        0,
        imageBitmap.width,
        imageBitmap.height
      );
      // sends data in Uint8ClampedArray form to the main thread
      ipcRenderer.send("getImage", {
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
      });
    })
    .catch((err) => {
      console.log("---Error at resetImage---");
      console.log(err);
    });
}

/**
 * Takes the array of bounding boxes given by the model and draws it to a
 * canvas overlayed on the video stream.
 * @param {{centerX,centerY,Width,height}[]} boundingArray
 */
function drawBoundingBox(boundingArray) {
  const canvas = document.getElementById("overlay-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#B033FF";
  ctx.lineWidth = 1;
  // Creates a rectangle for each prediction
  console.log(boundingArray);
  boundingArray.forEach((prediction) => {
    ctx.strokeRect(
      prediction[0], //x minus half of height to get top left
      prediction[1], //y
      prediction[2], //width
      prediction[3] //height
    );
  });
}

ipcRenderer.on("give-frame", () => {
  getImageData();
});

// ipcRenderer.on('Return Image',(event,image)=>{
// 	var idata = new ImageData(image,864,864);
// 	const canvas = document.getElementById('testCanvas2');
// 	const ctx = canvas.getContext("2d",{ willReadFrequently: true });
// 	ctx.putImageData(idata,0,0,);
// });
