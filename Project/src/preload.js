/**
 * Preload allows main and renderer threads to talk to each other, Electron
 * sandboxes renderers(the window that the user sees)
 */
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api', {
	//Put things here to expose in renderer.js
	getImage: (image) => ipcRenderer.send('getImage',image),
	getSource: ()=> {
		ipcRenderer.send('start');
	},
	resetImage: ()=> resetImage(),
})

let globalStream;
let videoTrack;
let imageCapture;

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => set_source(sourceId));

async function set_source(sourceId)
{
	console.log('working');
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			mandatory: {
			chromeMediaSource: 'desktop',
			chromeMediaSourceId: sourceId,
			minWidth: 864,
			maxWidth: 864,
			minHeight: 864,
			maxHeight: 864
			}
		}
		})
		globalStream = stream;
		videoTrack = stream.getVideoTracks()[0];
		imageCapture = new ImageCapture(videoTrack);
		handleStream(stream);
		setInterval(resetImage,100);
	} catch (e) {
		handleError(e);
	}
}

ipcRenderer.on('Return Image',async (event,image)=>{
	var idata = new ImageData(image,864,864);
	const canvas = document.getElementById('testCanvas2');
	const ctx = canvas.getContext("2d",{ willReadFrequently: true });
	ctx.putImageData(idata,0,0,);
});

ipcRenderer.on('Send Bounding Box',async (event,results)=>{
	const canvas = document.getElementById('testCanvas2');
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "#B033FF";
	ctx.lineWidth = 2;
	results.forEach((prediction)=>{
		ctx.strokeRect(
			prediction[0]-(prediction[2]/2),//x
			prediction[1]-(prediction[3]/2),//y
		 	prediction[2],//width
			prediction[3]);//height
	});
});

ipcRenderer.on('quit',()=>{
	const video = document.querySelector('video');
	video.pause();
	globalStream.getTracks().forEach((track)=>track.stop());
});

function handleStream (stream) {
	const video = document.querySelector('video');
	video.srcObject = stream;
	video.onloadedmetadata = (e) => video.play();
}

function handleError (e) {
	  console.log(e);
}

function resetImage () {
	imageCapture.grabFrame()
	.then((imageBitmap) => {
		const canvas = document.getElementById('testCanvas');
		const ctx = canvas.getContext("2d",{ willReadFrequently: true });
		ctx.drawImage(imageBitmap,0,0,);
		const imageData = ctx.getImageData(0,0,864,864);
		ipcRenderer.send('getImage',imageData.data);
	})
	.catch((err)=>{
		console.log('---Error at resetImage---');
		console.log(err);
	});
}