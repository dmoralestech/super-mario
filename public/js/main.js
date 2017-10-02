import Timer from './Timer.js';
import {loadLevel} from './loaders.js';
import {createMario} from './entities.js';

import Keyboard from './KeyboardState.js';


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    createMario(),
    loadLevel('1-1'),
])
.then(([mario, level]) => {

    const gravity = 2000;
    mario.pos.set(64, 64);
    mario.vel.set(50, 0);

    level.entities.add(mario);

    const SPACE = 32;
    const input = new Keyboard();
    input.addMapping(SPACE, keyState => {
        if (keyState) {
            mario.jump.start();
        } else {
            mario.jump.cancel();
        }
    });
    input.listenTo(window);

    canvas.addEventListener('mousemove', event => {
        if (event.buttons === 1) {
            mario.vel.set(0, 0);
            mario.pos.set(event.offsetX, event.offsetY);
        }
    });


    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        level.update(deltaTime);

        level.comp.draw(context);

        mario.vel.y += gravity * deltaTime;
    }

    timer.start();
});