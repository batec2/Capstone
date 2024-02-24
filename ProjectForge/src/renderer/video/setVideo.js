/**
 *
 * @param {*} stream
 * @param {*} video
 */
const handleStream = (stream, video) => {
  video.srcObject = stream;
  video.onloadedmetadata = (e) => {
    video.play();
    // const canvas = document.getElementById("overlay-canvas");
    // const dataCanvas = document.getElementById("data-canvas");
    // canvas.height = video.clientHeight;
    // canvas.width = video.clientWidth;
    // dataCanvas.height = video.clientHeight;
    // dataCanvas.width = video.clientWidth;
  };
};

/**
 * Set the video source to given sourceId
 * @param {*} sourceId
 * @param {*} video video HTML object
 */
const setVideo = async (sourceId, video) => {
  console.log(sourceId, video);
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
    // videoTrack = stream.getVideoTracks()[0];
    // imageCapture = new ImageCapture(videoTrack);
    handleStream(stream, video);

    // setInterval(getImageData,100);
  } catch (err) {
    console.log(err);
  }
};

export default setVideo;
