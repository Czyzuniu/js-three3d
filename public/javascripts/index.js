
'use strict'


import World from "./classes/world.js";
import Star from "./classes/star.js"

let camera, scene, renderer;
let world
let controls
let orbitControl
const width =  window.innerWidth
const height = window.innerHeight
let stars = []
let prevTime = performance.now();

let velocity = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let locked = true



function init() {
    world = new World(25)
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 130
    scene = new THREE.Scene();

    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    world.draw().then((mesh) => {
        scene.add(mesh);

        createStars(5000, scene)
    })

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.PointerLockControls(camera);

    scene.add( controls.getObject() );
}

function generateRandomNumber(min , max) {
    return Math.random() * (max-min) + min ;
}

function animate() {

    requestAnimationFrame( animate );


    var time = performance.now();
    // Create a delta value based on current time
    var delta = ( time - prevTime ) / 1000;

    // Set the velocity.x and velocity.z using the calculated time delta
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    // As velocity.y is our "gravity," calculate delta
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    if ( moveForward ) {
        velocity.z -= 15000.0 * delta;
        let direction = camera.getWorldDirection();
        camera.position.add( direction )
    }

    if (moveBackward) {
        velocity.z += 400.0 * delta;
    }

    if ( moveLeft ) {
        velocity.x -= 400.0 * delta;
    }

    if ( moveRight ) {
        velocity.x += 400.0 * delta;
    }

    // // Update the position using the changed delta
    // controls.getObject().translateX( velocity.x * delta );
    // controls.getObject().translateY( velocity.y * delta );
    controls.getObject().translateZ( velocity.z * delta );

    // Save the time for future delta calculations
    prevTime = time;





    world.rotateAround(0.001)
    renderer.render( scene, camera );

}

function createStars(amount, scene) {
    for (let i = 0; i < amount; i++) {
        let x = generateRandomNumber(-500, 500)
        let y = generateRandomNumber(-500, 500)
        let z = generateRandomNumber(5000,-5000)
        let star = new Star(x,y,z)
        scene.add(star.draw())
    }
}


window.addEventListener('keydown', (event) => {
    console.log(event.keyCode)
    switch (event.keyCode) {
        case 87: // w
            moveForward = true;
            break;
        case 83: // s
            moveBackward = true;
            break;
        case 65: // a
            moveLeft = true;
            break;
        case 68: // d
            moveRight = true;
            break;

    }
})

window.addEventListener('keyup', (event) => {
    console.log(event.keyCode)
    switch (event.keyCode) {
        case 87: // w
            moveForward = false;
            break;
        case 83: // s
            moveBackward = false;
            break;
        case 65: // a
            moveLeft = false;
            break;
        case 68: // d
            moveRight = false;
            break;
    }
})







window.blocker.addEventListener( 'click', function () {

    document.body.requestPointerLock()
    window.blocker.style.display = 'none'

    init();
    animate();

}, false );




