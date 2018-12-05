
'use strict'


import World from "./classes/world.js";
import Star from "./classes/star.js"
import Player from "./classes/player.js"


let camera, scene, renderer;
let world
let player
const width =  window.innerWidth
const height = window.innerHeight
let stars = []
let locked = true



function init() {
    world = new World(100)

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0,4,10);
    scene = new THREE.Scene();

    player = new Player(0,0,0)



    player.draw().then((obj) => {
        scene.add(obj)
        obj.add(camera)
    })


    //controls = new THREE.PointerLockControls(player.mesh)


    let light = new THREE.AmbientLight(0xffffff, 100);
    scene.add(light);

    world.draw().then((mesh) => {
        scene.add(mesh);
    })

    createStars(5000, scene)

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    //scene.add(controls.getObject())



}

function generateRandomNumber(min , max) {
    return Math.random() * (max-min) + min ;
}

function animate() {

    requestAnimationFrame( animate );

    if (player.mesh) {
        player.update()

        for (let i of player.rockets) {
            i.move()
        }
    }


   // player.mesh.rotation.y += 0.01


    renderer.render( scene,camera );

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
    player.move(event)

    if (event.keyCode == 32) {
        player.shoot(scene)
    }
})

window.addEventListener('keyup', (event) => {
    console.log(event.keyCode)
    switch (event.keyCode) {
        case 87: // w
            player.stop()
            break;
        case 83: // s
          player.stop()
          break;
        case 65: // a
          player.stop()
          break;
        case 68: // d
          player.stop()
          break;
        case 32: // d
          player.stop()
          break;
        case 69: // d
          player.stop()
          break;
    }
})







window.blocker.addEventListener( 'click', function () {

    document.body.requestPointerLock()
    window.blocker.style.display = 'none'

    init();
    animate();

}, false );




