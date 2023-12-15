const { mouse, left, right, up, down } = require("@nut-tree/nut-js");

(async () => {
    await mouse.move(left(500));
    await mouse.move(up(500));
    await mouse.move(right(500));
    await mouse.move(down(500))
})();

/*
const { mouse, straightTo, Point } = require("@nut-tree/nut-js");

(async () => {
    const target = new Point(500, 350);
    
    await mouse.move(straightTo(target));
})();

const { mouse, straightTo, Point } = require("@nut-tree/nut-js");

(async () => {
    mouse.config.mouseSpeed = 2000;
    const fast = new Point(500, 350);
    await mouse.move(straightTo(fast));
    mouse.config.mouseSpeed = 100;
    const slow = new Point(100, 150);
    await mouse.move(straightTo(slow));
})();

const { mouse, Point } = require("@nut-tree/nut-js");

(async () => {
    const target = new Point(500, 350);
    await mouse.setPosition(target);
})();
*/