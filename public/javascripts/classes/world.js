export default class World {

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
    }

    constructor(radius) {
        this._radius = radius
    }

    draw() {
        return new Promise((resolve) => {
            let loader = new THREE.TextureLoader();
            loader.load( '/images/textures/world.jpg', (texture) => {
                let material = new THREE.MeshBasicMaterial({map: texture});
                let geometry = new THREE.SphereGeometry(this.radius, 32, 32 );
                this.entity =  new THREE.Mesh( geometry, material );
                resolve(this.entity)
            })
        })
    }

    rotateAround(speed) {
        if (this.entity) {
            this.entity.rotation.y += speed
        }
    }
}