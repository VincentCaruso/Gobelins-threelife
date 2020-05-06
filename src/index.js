import { World } from "./World";

window.addEventListener('DOMContentLoaded', (e) => {

    const WORLD_WIDTH = 50;
    const WORLD_HEIGHT = 50;
    const IS_DEBUG = true;

    let world = new World(WORLD_WIDTH, WORLD_HEIGHT, IS_DEBUG);

    //RESET
    let btnReset = document.body.querySelector(".reset");
    btnReset.addEventListener('click', (e) => {
        console.log("RESET");
        world.reset();
    });

    //SPEED
    let slider = document.body.querySelector(".range");
    slider.addEventListener('input', (e) => {
        console.log(e.target.value);
        world.changeSpeed(e.target.value);
    });

    //RESIZE
    window.addEventListener('resize', (e) => {
        console.log("resize");

        world.onWindowResize(e);
    });

});