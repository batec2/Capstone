document.getElementById('send-frame').addEventListener('click',async ()=>{
    window.api.resetImage();
})

document.getElementById('get-source').addEventListener('click',async ()=>{
    window.api.getSource();
})