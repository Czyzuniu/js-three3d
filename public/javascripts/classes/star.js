export default class Star {
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

    constructor(x,y,z) {
        this._radius = 1
        this._x = x
        this._y = y
        this._z = z

    }

    draw() {
        let material = new THREE.MeshBasicMaterial({color: 0xffffff});
        let geometry = new THREE.SphereGeometry(this.radius, 2, 2 );
        this.entity =  new THREE.Mesh( geometry, material );
        this.entity.position.set(this.x,this.y,this.z)

        return this.entity
    }

}