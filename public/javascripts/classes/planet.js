export default class Planet {

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
    }

    constructor(type) {


        this.planets = {
            WORLD: {
                radius:10,
                texture:'/images/textures/world.jpg',
                position:{
                    x:0,
                    y:0,
                    z:-4000
                }
            },
            MARS: {
                radius:5,
                texture: '/images/textures/mars.jpg',
                position:{
                    x:2500,
                    y:0,
                    z:2000
                }
            },
            MOON: {
                radius:3,
                texture:'/images/textures/moon.jpg',
                position:{
                    x:-3000,
                    y:0,
                    z:-2000
                }
            },
        };

        this.planet = this.planets[type]

    }

    draw() {
        return new Promise((resolve) => {
            let loader = new THREE.TextureLoader();
            loader.load(this.planet.texture, (texture) => {
                let material = new THREE.MeshBasicMaterial({map: texture});
                let geometry = new THREE.SphereGeometry(this.planet.radius, 32, 32 );
                this.entity =  new THREE.Mesh( geometry, material );
                this.entity.scale.set(13,13,13)
                this.entity.position.set(this.planet.position.x,this.planet.position.y, this.planet.position.z)
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