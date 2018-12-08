export default class Rocket {
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


    constructor(x,y,z,d,id) {
        this._x = x
        this._y = y
        this._z = z
        this.distanceTravelled = 0
        this.direction = d
        this.velocity = 5
        this.isAlive = true

        this.id = id
    }

    move(){

        // let time = performance.now();
        // // Create a delta value based on current time
        // let delta = ( time - this.prevTime ) / 1000;

        this.entity.position.y += this.direction.y * this.velocity
        this.entity.position.x += this.direction.x * this.velocity
        this.entity.position.z += this.direction.z * this.velocity

        this.distanceTravelled++

        let maximumDistance = 50 * 5


        if (this.distanceTravelled >= maximumDistance) {
          this.isAlive = false
        }

        // if (Math.abs(this.entity.position.z) > maximumRange + Math.abs(this.player.mesh.position.z)) {
        //   this.isAlive  = false
        // } else if (Math.abs(this.entity.position.x) > maximumRange + Math.abs(this.player.mesh.position.x)) {
        //   this.isAlive  = false
        // }

        // if (this.entity.position.z < -maximumRange + this.player.mesh.position.z) {
        //   this.isAlive = false
        // }
        //
        // if (this.entity.position.z - )
    }

    draw(scene) {
        let material = new THREE.MeshBasicMaterial({color: 0x008000});
        let geometry = new THREE.SphereGeometry(1, 2, 2);
        this.entity = new THREE.Mesh(geometry, material);
        this.entity.name = this.id
        this.entity.position.set(this.x,this.y,this.z)

        //this.initialPlayerShotPosition = new THREE.Vector3((this.x,this.y,this.z)

        scene.add(this.entity)
        return this
    }

}

