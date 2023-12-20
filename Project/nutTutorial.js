 const { mouse, left, right, up, down, straightTo, Point  } = require("@nut-tree/nut-js");

async function moveFirst(){
    (async () => {
        await mouse.move(left(500));
        await mouse.move(up(500));
        await mouse.move(right(500));
        await mouse.move(down(500))
    })();
}


async function moveSecond(){
    (async () => {
        const target = new Point(500, 350);
        
        await mouse.move(straightTo(target));
    })();
}

function moveThird(){
    (async () => {
        mouse.config.mouseSpeed = 2000;
        const fast = new Point(500, 350);
        await mouse.move(straightTo(fast));
        mouse.config.mouseSpeed = 100;
        const slow = new Point(100, 150);
        await mouse.move(straightTo(slow));
    })();
}
       
function moveFourth(){
    (async () => {
        const target = new Point(500, 350);
        await mouse.setPosition(target);
    })();
}

moveThird();

// Use `tfjs-node-gpu`. Note that `tfjs` is imported indirectly by `tfjs-node-gpu`.
const tf = require('@tensorflow/tfjs-node');
console.log(tf.getBackend());

/*
// Define a simple model.
const model = tf.sequential();
model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
model.add(tf.layers.dense({units: 1, activation: 'linear'}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

const xs = tf.randomNormal([100, 10]);
const ys = tf.randomNormal([100, 1]);

// Train the model.
model.fit(xs, ys, {
  epochs: 100,
  callbacks: {
    onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
  }
});
*/