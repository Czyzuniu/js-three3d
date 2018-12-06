import Rocket from "./rocket.js";

export default class Player {
  get z() {
    return this._z;
  }

  set z(value) {
    this._z = value;
  }
  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
  }
  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    this._radius = value;
  }

  constructor(x,y,z, isOtherPlayer, socketId) {
    this._x = x
    this._y = y
    this._z = z
    this.rockets = []
    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();
    this.mesh = null
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false
    this.moveDown = false
    this.moveSpeed = 1500
    this.id = socketId

    this.isOtherPlayer = isOtherPlayer

  }


  update() {

    let time = performance.now();
    // Create a delta value based on current time
    let delta = ( time - this.prevTime ) / 1000;

    let rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

    // Set the velocity.x and velocity.z using the calculated time delta
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    // As velocity.y is our "gravity," calculate delta
    //this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    if ( this.moveForward ) {
      this.velocity.z -= this.moveSpeed * delta;
    }

    if (this.moveBackward) {
      this.velocity.z += this.moveSpeed * delta;
    }

    if (this.moveLeft ) {
      // this.velocity.x -= 4000.0 * delta;
        //console.log(this.mesh.position)
      this.mesh.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    }

    if (this.moveRight ) {
      this.mesh.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
    }

    // if (this.moveUp ) {
    //   this.velocity.y += this.moveSpeed  * delta;
    // }

    // if (this.moveDown ) {
    //   this.velocity.y -= this.moveSpeed  * delta;
    // }


    this.mesh.translateZ(this.velocity.z * delta )
    this.mesh.translateX(this.velocity.x * delta )
    this.mesh.translateY(this.velocity.y * delta )


    this.prevTime = time;


  }


  move(event) {
    if (!this.isOtherPlayer) {
      switch (event.keyCode) {
        case 87: // w
          this.moveForward = true;
          break;
        case 83: // s
          this.moveBackward = true;
          break;
        case 65: // a
          this.moveLeft = true;
          break;
        case 68: // d
          this.moveRight = true;
          break;
        case 69: // e
          this.moveDown = true;
          break;
      }
    }
  }

  shoot(scene) {
      let direction = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( this.mesh.quaternion );
      let rocket = new Rocket(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z, direction)

      this.rockets.push(rocket)
      rocket.draw(scene)
  }

  draw() {
      // return new Promise((resolve) => {
      //     const mtlLoader = new THREE.MTLLoader();
      //     mtlLoader.setPath( '/images/models/h2f/' );
      //     const url = "f.mtl";
      //     mtlLoader.load( url, ( materials ) => {
      //         materials.preload();
      //         const objLoader = new THREE.OBJLoader();
      //         objLoader.setMaterials( materials );
      //         objLoader.setPath( '/images/models/h2f/' );
      //         objLoader.load( 'f.obj', ( object ) =>{
      //             this.mesh = object
      //             console.log('loaded')
      //             resolve(object)
      //         }, function ( xhr ) {
      //             console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      //         }, function ( error ) {
      //             console.log( 'An error happened', error);
      //         } );
      //     })
      // });


      return new Promise((resolve) => {
          const loader = new THREE.OBJLoader();
          let textureLoader = new THREE.TextureLoader();
          textureLoader.load( '/images/textures/space_ship.jpg', (texture) => {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.repeat.set( 4, 4 );
              let material = new THREE.MeshBasicMaterial({map: texture});
              loader.load(
                  '/images/models/h2f/model.obj',
                   (object) => {
                       this.mesh = object
                       this.mesh.position.set(this.x, this.y, this.z)
                       this.mesh.traverse( function ( node ) {
                           if ( node.isMesh ) {
                               node.material = material;
                           }
                       } );
                      resolve(this.mesh)
                  },
                  function ( xhr ) {
                      //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                  },
                  function ( error ) {
                      //console.log( 'An error happened' );
                  }
              );
          })
      })

  }


}