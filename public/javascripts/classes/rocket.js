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


    constructor(x, y, z) {
        this._x = x
        this._y = y
        this._z = z
    }

    move(){
        console.log(this.entity.position.z)
        this.entity.position.z -= 1
    }

    draw(scene) {
        let material = new THREE.MeshBasicMaterial({color: 0x008000});
        let geometry = new THREE.SphereGeometry(1, 2, 2);
        this.entity = new THREE.Mesh(geometry, material);
        this.entity.position.set(this.x,this.y,this.z)
        scene.add(this.entity)
        return this
    }

}

