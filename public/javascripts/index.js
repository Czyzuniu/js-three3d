
'use strict'


import Planet from "./classes/planet.js";
import Star from "./classes/star.js"
import Player from "./classes/player.js"
import Rocket from "./classes/rocket.js";


let camera, scene, renderer, controls, socket, socketId
let world
let player
const width =  window.innerWidth
const height = window.innerHeight
let stars = []
let locked = true
let allPlayers = {}
let planets = ['WORLD', 'MOON', 'MARS']



function init() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 55000);
    camera.position.set(0,4,15);
    scene = new THREE.Scene();

    for (let i of planets) {
        let planet = new Planet(i)
        scene.planets = []
        planet.draw().then((mesh) => {
            scene.planets.push(planet)
            scene.add(mesh);
        })
    }
    player = new Player(0,0,0, false, socketId)

    player.draw().then((obj) => {
        scene.add(obj)
        obj.add(camera)
        obj.scale.set(0.5, 0.5, 0.5)
        //controls = new THREE.OrbitControls( camera, renderer.domElement );
        //cene.add(player.displayName)
    })
    let light = new THREE.AmbientLight(0xffffff, 100);
    scene.add(light);
    createStars(5000, scene)
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

}

function generateRandomNumber(min , max) {
    return Math.random() * (max-min) + min ;
}

function animate() {
    for (let p of scene.planets) {
        if (p.entity) {
            p.rotateAround(0.001)
        }
    }

    requestAnimationFrame( animate );
    if (player.mesh) {
        let rotation = {
            x:player.mesh.rotation.x,
            y:player.mesh.rotation.y,
            z:player.mesh.rotation.z
        }
        socket.emit('movement', {position: player.mesh.position, rotation:rotation,id:player.id})
        player.update()

        player.rockets.forEach((rocket, index) => {
            rocket.move()
            if (!rocket.isAlive) {
              player.rockets.splice(index, 1);
              scene.remove(scene.getObjectByName(rocket.id));
            } else {
                socket.emit('rocket', {position:rocket.entity.position, direction:rocket.direction, id:rocket.id, playerId:player.id})
            }
        })
    }

    renderer.render( scene,camera );
}

function createStars(amount, scene) {
    for (let i = 0; i < amount; i++) {
        let x = generateRandomNumber(-5000, 5000)
        let y = generateRandomNumber(-5000, 5000)
        let z = generateRandomNumber(-5000, 5000)
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


window.play.addEventListener( 'click', function () {
    socket = io();
    socket.on('connect', function() {
        socketId = socket.io.engine.id;
        document.body.requestPointerLock()
        window.blocker.style.display = 'none'
        init();
        animate();
    })

    socket.emit('init', {name:window.userName.value})


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
       player.moveUp = false;
        break;
       case 81: // q
       player.moveDown = false;
        break;
    }
    })


  socket.on('players', (data) => {
      Object.keys(data).forEach((key) => {
          if (socket.id != key) {
              let otherPlayer = new Player(data[key].x, data[key].y, data[key].z,true,data[key].id)
              otherPlayer.draw().then((obj) => {
                  allPlayers[otherPlayer.id] = otherPlayer
                  scene.add(obj)
              })
          }
      });
  })

  socket.on("movement", (data) => {
        let otherPlayer = allPlayers[data.id]
        if (otherPlayer) {
            otherPlayer.mesh.position.set(data.x, data.y, data.z)
            otherPlayer.mesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z)
        }
  })


  socket.on("rockets", (data) => {
      //let shootingPlayer = allPlayers[data.playerId]
      //let direction = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( shootingPlayer.mesh.quaternion );
      let rocketId = data.id
      let enemyRocket = new Rocket(data.position.x, data.position.y, data.position.z, data.direction, rocketId)
      if (scene.getObjectByName(enemyRocket.id)) {
            scene.getObjectByName(enemyRocket.id).position.set(data.position.x, data.position.y, data.position.z)
      } else {
          enemyRocket.draw(scene)
      }

     // player.rockets.push(enemyRocket)

  })

}, false );


