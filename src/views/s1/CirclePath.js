
import CirclePoint from './CirclePoint'
import * as THREE from 'three'
const RADIUS = 29
const PI = Math.PI
const SEGMENT = 10
export default class CirclePath {
    constructor (scene, hexagons, pointArr, isNeedFlow = false) {
        this.scene = scene
        this.hexagons = hexagons // 六边形集合数组，computePointPosition会使用到
        const points = []
        pointArr.forEach(p => {
            points.push(new CirclePoint(p[0], p[1], p[2]))
        })
        this.points = points // 点集，依次，有序
        this.isNeedFlow = isNeedFlow // 是否需要flow效果
        this.group = new THREE.Object3D()
        scene.add(this.group)
        this.computePointPosition()

        this.currPointIndex = 0
        this.nextPointIndex = 0
        this.dX = 0
        this.dY = 0
        this.currSegment = 0

        this.drawPoints = []
        // this.draw()
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
    update () { // 更新绘制
        const that = this
        if (that.nextPointIndex < that.points.length) {
            that.group.remove(...that.group.children) // 移除所有对象，重新绘制
            // 更新drawPoints
            that.drawPoints = []
            for (let i = 0; i <= that.currPointIndex; i++) {
                that.drawPoints.push(that.points[i])
            }
            if (that.currPointIndex !== that.nextPointIndex) {
                const currPoint = that.points[that.currPointIndex]
                const nextPoint = that.points[that.nextPointIndex]
                const middlePoint = { opacity: currPoint.opacity, z: currPoint.z }
                this.dx = (nextPoint.x - currPoint.x) / SEGMENT
                this.dy = (nextPoint.y - currPoint.y) / SEGMENT
                middlePoint.x = currPoint.x + this.dx * this.currSegment
                middlePoint.y = currPoint.y + this.dy * this.currSegment
                that.drawPoints.push(middlePoint)
                that.currSegment++
                if (that.currSegment > SEGMENT) {
                    that.currPointIndex++
                    that.currSegment = 0
                }
            } else {
                that.nextPointIndex++
                this.currSegment = 1
            }
            // 绘制
            that.draw()
        }
    }
    draw () {
        const that = this
        const geometry = new THREE.CircleGeometry(3, 32) // 0x0817cc
        const material = new THREE.MeshBasicMaterial({ color: 0x262DD1, transparent: true, opacity: 1 })
        let circle = null
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x262DD1, transparent: true, opacity: 1 })
        const lineGeometry = new THREE.BufferGeometry()
        const linePositions = []
        that.drawPoints.forEach((point, index) => {
            if ((index !== that.drawPoints.length - 1) || (that.currPointIndex === that.nextPointIndex)) {
                material.opacity = point.opacity
                circle = new THREE.Mesh(geometry, material)
                circle.position.x = point.x
                circle.position.y = point.y
                circle.position.z = point.z
                that.group.add(circle)
            }
            linePositions.push(point.x, point.y, point.z)
        })
        if (that.drawPoints.length > 1) {
            lineMaterial.opacity = that.points[0].opacity
            lineGeometry.addAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
            const line = new THREE.Line(lineGeometry, lineMaterial)
            that.group.add(line)
        }
    }
}
