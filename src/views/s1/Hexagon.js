import * as THREE from 'three'
const opacity = [1, 0.46, 0.16]
let canvas = null

export default class Hexagon { // 层叠的三个六边形
    constructor (centerX, centerY, opacity) {
        this.centerX = centerX
        this.centerY = centerY
        this.shapes = []
        this.opacity = opacity
        let shape = null
        // let points = null
        // const len = 21
        for (let i = 0; i < 3; i++) {
            shape = { x: centerX, y: centerY, z: -i * 60 }
            // points = []
            // for (let j = 0; j <= 6; j++) {
            //     points.push(centerX + len * Math.cos(j * Math.PI / 3), centerY + len * Math.sin(j * Math.PI / 3), shape.z)
            // }
            // shape.points = points
            this.shapes.push(shape)
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
    draw (scene, sphereX, sphereY) {
        let mesh = null
        let shape = null
        for (let i = 0; i < 3; i++) {
            shape = this.shapes[i]
            mesh = new THREE.Sprite(this.generateMaterial(opacity[i] * this.opacity))
            // mesh.scale.x = mesh.scale.y = 45
            mesh.position.z = shape.z
            mesh.position.x = sphereX // shape.x
            mesh.position.y = sphereY // shape.y
            mesh.scale.x = 0.1
            mesh.scale.y = 0.1
            scene.add(mesh)
            shape.mesh = mesh
            // 0x0B169D
            // const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0B169D, transparent: true, opacity: opacity[i] * this.opacity })
            // const lineGeometry = new THREE.BufferGeometry()
            // lineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(shape.points, 3))
            // const line = new THREE.Line(lineGeometry, lineMaterial)
            // scene.add(line)
        }
    }
}
