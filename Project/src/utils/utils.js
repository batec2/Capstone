import {desktopCapturer} from 'electron';

function getSourceId(){
    return desktopCapturer.getSources({ types: ['window'] }).then((sources,reject) => {
        if(reject){
            console.log('---Error at getSources');
            console.log(reject);
            return;
        }
        for (const source of sources) {
            if (source.name === 'RuneLite') {
                return source.id;
            }
        }
    }) 
}

export{getSourceId};