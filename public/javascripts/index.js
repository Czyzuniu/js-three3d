
'use strict'


import World from "./classes/world.js";
import Star from "./classes/star.js"
import Player from "./classes/player.js"


let camera, scene, renderer, controls, socket, socketId
let world
let player
const width =  window.innerWidth
const height = window.innerHeight
let stars = []
let locked = true
let allPlayers = []



function init() {
    //world = new World(100)

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0,4,10);
    scene = new THREE.Scene();

    player = new Player(0,0,0, false, socketId)



    player.draw().then((obj) => {
        scene.add(obj)
        obj.add(camera)
    })


    //controls = new THREE.PointerLockControls(camera)


    let light = new THREE.AmbientLight(0xffffff, 100);
    scene.add(light);

    // world.draw().then((mesh) => {
    //     scene.add(mesh);
    // })

    createStars(1000, scene)

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

   // scene.add(controls.getObject())


}

function generateRandomNumber(min , max) {
    return Math.random() * (max-min) + min ;
}

function animate() {

    requestAnimationFrame( animate );

    if (player.mesh) {
        player.update()

      player.rockets.forEach((rocket, index) => {
        rocket.move()
        // if (!rocket.isAlive) {
        //   player.rocket.splice(index, 1);
        // }
      })
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

    //change later

    socket.emit('movement', {position: player.mesh.position, id:player.id})

    if (event.keyCode == 32) {
        player.shoot(scene)
    }
})






window.play.addEventListener( 'click', function () {

    socket = io();
    socket.on('connect', function() {
      socketId = socket.io.engine.id;

      document.body.requestPointerLock()
      window.blocker.style.display = 'none'

      init();
      animate();
    })

  window.addEventListener('keyup', (event) => {
    switch (event.keyCode) {
      case 87: // w
        player.moveForward = false
        break;
      case 83: // s
        player.moveBackward = false
        break;
      case 65: // a
        player.moveLeft = false
        break;
      case 68: // d
        player.moveRight = false
        break;
      case 69: // e
        player.moveUp = false
        break;
    }
  })

    //socket.emit("init", )



  socket.on('players', (players) => {
    players.map((player) => {
      if (socket.id != player.id) {
        let otherPlayer = new Player(player.x, player.y, player.z, true,player.id)
        otherPlayer.draw().then((obj) => {
          allPlayers.push(otherPlayer)
          scene.add(obj)
        })
      }
    })

  })

  socket.on("movement", (data) => {
      console.log('myid', player.id)
      for (let i of data) {
        if (player.id != i.id) {
          for (let y of allPlayers) {
            //console.log(y, 2)
            if (i.id == y.id) {
              console.log(y, 'this should move')
            }
          }
        }
      }
  })

}, false );


