import * as THREE from 'three'
const opacity = [1, 0.58, 0.16]
let canvas = null

export default class Hexagon { // 层叠的三个六边形
    constructor (centerX, centerY, opacity) {
        this.centerX = centerX
        this.centerY = centerY
        this.shapes = []
        this.opacity = opacity
        for (let i = 0; i < 3; i++) {
            this.shapes.push({
                x: centerX, y: centerY, z: -i * 60
            })
        }
        if (!canvas) {
            canvas = document.createElement('canvas')
            canvas.width = 128
            canvas.height = 128
            const context = canvas.getContext('2d')
            const len = 60
            const centerX = 64
            const centerY = 64
            context.strokeStyle = 'rgb(11,22,157)'
            context.lineCap = 'round'
            context.lineJoin = 'round'
            context.lineWidth = 2
            context.moveTo(centerX + len * Math.cos(0), centerY + len * Math.sin(0))
            for (let j = 0; j <= 6; j++) {
                context.lineTo(centerX + len * Math.cos(j * Math.PI / 3), centerY + len * Math.sin(j * Math.PI / 3))
            }
            context.stroke()
        }
    }
    generateMaterial (opacity) {
        return new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), blending: THREE.AdditiveBlending, transparent: true, opacity: opacity })
    }
    draw (scene) {
        let mesh = null
        let shape = null
        for (let i = 0; i < 3; i++) {
            shape = this.shapes[i]
            mesh = new THREE.Sprite(this.generateMaterial(opacity[i] * this.opacity))
            mesh.scale.x = mesh.scale.y = 45
            mesh.position.z = shape.z
            mesh.position.x = shape.x
            mesh.position.y = shape.y
            scene.add(mesh)
        }
    }
}
