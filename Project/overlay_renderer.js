const mouseBox = document.getElementById('mouseBox');

const func = async () => {
    while(true){
        const response = await window.mouseInfo.mouseLocation();
        moveMouseBox(response.x-10,response.y-10);
        console.log(response);
    }
}

function moveMouseBox(x_pos, y_pos) {
    mouseBox.style.left = x_pos+'px';
    mouseBox.style.top = y_pos+'px';
}

func();