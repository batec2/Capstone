document.getElementById('send-frame').addEventListener('click',async ()=>{
    window.api.sendFrame();
})

document.getElementById('get-source').addEventListener('click',async ()=>{
    window.api.getSource();
})

const video = document.getElementById('video');
const predictionCanvas = document.getElementById('testCanvas2');

