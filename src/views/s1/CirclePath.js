
import CirclePoint from './CirclePoint'
import * as THREE from 'three'
const RADIUS = 29
const PI = Math.PI
export default class CirclePath {
    constructor (scene, hexagons, pointArr, isNeedFlow = false) {
        this.scene = scene
        this.hexagons = hexagons // 六边形集合素质，computePointPosition会使用到
        const points = []
        pointArr.forEach(p => {
            points.push(new CirclePoint(p[0], p[1], p[2]))
        })
        this.points = points // 点集，依次，有序
        this.isNeedFlow = isNeedFlow // 是否需要flow效果
        this.computePointPosition()
        this.draw()
    }
    draw () {
        const that = this
        const geometry = new THREE.CircleGeometry(3, 32)
        const material = new THREE.MeshBasicMaterial({ color: 0x0817cc })
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0817cc })
        let circle = null
        const lineGeometry = new THREE.BufferGeometry()
        const linePositions = []
        that.points.forEach((point, index) => {
            circle = new THREE.Mesh(geometry, material)
            circle.position.x = point.x
            circle.position.y = point.y
            circle.position.z = point.z
            that.scene.add(circle)
            linePositions.push(point.x, point.y, point.z)
        })
        lineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
        const line = new THREE.Line(lineGeometry, lineMaterial)
        that.scene.add(line)
    }
    computePointPosition () { // 计算点集中各个点的x，y，z坐标
        const that = this
        let hexagonShape = null
        let centerX = 0
        let centerY = 0
        let opacity = 0
        let x = 0
        let y = 0
        that.points.forEach(point => {
            hexagonShape = that.hexagons[point.hexagonRowIndex][point.hexagonColIndex]
            centerX = hexagonShape.centerX
            centerY = hexagonShape.centerY
            opacity = hexagonShape.opacity
            x = centerX + RADIUS * Math.cos(point.edgeIndex * PI / 3)
            y = centerY + RADIUS * Math.sin(point.edgeIndex * PI / 3)
            point.setPosition(x, y, 0, opacity)
        })
    }
}
