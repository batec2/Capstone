const drawImage = (context, imageBitmap) => {
  // draws image on canvas
  ctx.drawImage(imageBitmap, 0, 0);
  // takes the imageData from the canvas
  const imageData = ctx.getImageData(
    0,
    0,
    imageBitmap.width,
    imageBitmap.height
  );
};
