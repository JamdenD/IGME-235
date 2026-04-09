"use strict";

const app = new PIXI.Application();

const circles = [];
let screenHeight, screenWidth;

setup();

async function setup() {
    await app.init({width:640, height:360, background: "#222"});
    document.body.appendChild(app.canvas);

    const circle = new PIXI.Graphics();
    circle.circle(0,0,20);
    circle.fill(0x00ff88);
    circle.x = 200;
    circle.y = 100;
    app.stage.addChild(circle);

    const texture = await PIXI.Assets.load("images/button-130.png");
    const button = new PIXI.Sprite(texture);
    button.anchor.set(0.5);
    button.x = 320;
    button.y = 200;

    button.interactive = true;
    button.cursor = "pointer";
    button.on("pointerup", () => {
        circle.x += 10;
    });
    button.on("pointerover", (e) => {
        e.target.tint = 0xbbbbbb; 
    });
    button.on("pointerout", (e) => {
        e.target.tint = 0xffffff; 
    });

    app.stage.addChild(button);

    let screenWidth = app.renderer.width;
    let screenHeight = app.renderer.height;

    for(let i=0; i<15; i++){
        let randRadius = 10 + Math.random() * 15;
        let ranColor = Math.random() * 0xffffff;
        const c = new Circle(randRadius, ranColor);

        c.x = Math.random() * (screenWidth - 100) + 50;
        c.y = Math.random() * (screenHeight - 100) + 50;

        circles.push(c);
        app.stage.addChild(c);
    }
}

//helper functions can go here