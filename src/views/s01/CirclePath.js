import CirclePoint from './CirclePoint'
import * as THREE from 'three'
const RADIUS = 60
const PI = Math.PI
let canvas = null
let ctx = null
const centerPoints = []
let centerX = 0
let centerY = 0
let pointRadius = 0
export default class CirclePath {
    constructor (scene, hexagons, pointArr) {
        this.scene = scene
        this.hexagons = hexagons
        const points = []
        pointArr.forEach(p => {
            points.push(new CirclePoint(p[0], p[1], p[2]))
        })
        this.points = points // 点集，依次，有序
        this.finished = false
        if (!canvas) {
            canvas = document.querySelector('#circle-paths')
            ctx = canvas.getContext('2d')
            ctx.strokeStyle = 'rgb(255,255,255)'
            ctx.fillStyle = 'rgb(255, 255, 255)'
            ctx.shadowBlur = 10
            ctx.shadowColor = 'rgb(255, 255, 255)'
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.lineWidth = 2

            // 计算出centerPoints
            let arr = []
            let offset = 0
            for (let i = 8; i >= 0; i--) {
                arr = []
                centerPoints.push(arr)
                offset = (i % 2 === 0 ? 73 : 193)
                for (let j = 0; j < 4; j++) {
                    arr.push({ x: j * 235 + offset, y: 910 + (i - 8) * 105 + (i < 5 ? -5 : 0) })
                }
            }
            centerPoints.reverse()
            centerY = Math.abs(centerPoints[8][0].y - centerPoints[0][0].y) / 2 + 55
            centerX = Math.abs(centerPoints[0][3].x - centerPoints[0][0].x) / 2 + 100
            let dy = Math.abs(centerPoints[0][0].x - centerX)
            let dx = Math.abs(centerPoints[0][0].y - centerY)
            pointRadius = Math.sqrt(dx * dx + dy * dy)
        }
        this.computePointPosition()
        this.currPointIndex = 0
        this.nextPointIndex = 0
        this.dX = 0
        this.dY = 0
        this.currSegment = 0
        this.drawPoints = []
        this.segment = 10
    }
    computePointAttribute (point) { // 计算点的alpha hsl shadowBlur
        const dx = Math.abs(centerX - point.x)
        const dy = Math.abs(centerY - point.y)
        const ratio = Math.sqrt(dx * dx + dy * dy) / pointRadius
        if (ratio > 0.6) {
            point.color = 'rgba(35,39,165,0.3)'
            point.shadowBlur = 0
        } else if (ratio > 0.45) {
            point.color = 'rgba(18,131,250,0.35)'
            point.shadowBlur = 0
        } else if (ratio > 0.4) {
            point.color = 'rgba(46,206,254,0.3)'
            point.shadowBlur = 2
        } else if (ratio > 0.3) {
            point.color = 'rgba(125,235,245,0.6)'
            point.shadowBlur = 6
        } else if (ratio > 0.25) {
            point.color = 'rgba(255,255,255,0.7)'
            point.shadowBlur = 6
        } else {
            point.color = 'rgba(255,255,255,1)'
            point.shadowBlur = 20
        }
    }
    computePointPosition () { // 计算点集中各个点的x，y，z坐标
        const that = this
        let hexagonShape = null
        let centerX = 0
        let centerY = 0
        let x = 0
        let y = 0
        let centerPoint = null
        that.points.forEach(point => {
            hexagonShape = that.hexagons[point.hexagonRowIndex][point.hexagonColIndex]
            centerPoint = centerPoints[point.hexagonRowIndex][point.hexagonColIndex]
            centerX = centerPoint.x
            centerY = centerPoint.y
            x = centerX + RADIUS * Math.cos(point.edgeIndex * PI / 3)
            y = centerY + RADIUS * Math.sin(point.edgeIndex * PI / 3)
            point.setPosition(x, y, 0)
            that.computePointAttribute(point)
        })
    }
    update () { // 更新绘制
        const that = this
        if (that.nextPointIndex < that.points.length) {
            that.drawPoints = [] // 更新drawPoints
            for (let i = 0; i <= that.currPointIndex; i++) {
                that.drawPoints.push(that.points[i])
            }
            if (that.currPointIndex !== that.nextPointIndex) {
                const currPoint = that.points[that.currPointIndex]
                const nextPoint = that.points[that.nextPointIndex]
                const middlePoint = { opacity: currPoint.opacity, z: currPoint.z }
                if (this.currSegment === 1) {
                    let dy = nextPoint.y - currPoint.y
                    let dx = nextPoint.x - currPoint.x
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    this.segment = Math.ceil(distance / 2)
                    this.dx = (nextPoint.x - currPoint.x) / this.segment
                    this.dy = (nextPoint.y - currPoint.y) / this.segment
                }
                middlePoint.x = currPoint.x + this.dx * this.currSegment
                middlePoint.y = currPoint.y + this.dy * this.currSegment
                that.computePointAttribute(middlePoint)
                that.drawPoints.push(middlePoint)
                that.draw() // 绘制
                that.currSegment++
                if (that.currSegment > this.segment) {
                    that.currPointIndex++
                    that.currSegment = 0
                }
            } else {
                that.draw() // 绘制
                that.nextPointIndex++
                this.currSegment = 1
            }
        } else {
            that.finished = true
            that.drawPoints = []
            that.points.forEach(p => {
                that.drawPoints.push(p)
            })
            that.nextPointIndex = that.currPointIndex = that.points.length - 1
            that.draw()
        }
    }
    draw () {
        const that = this
        let point
        let prePoint
        let shadowBlur = 0
        let gradient = null
        for (let i = 0; i < that.drawPoints.length; i++) {
            point = that.drawPoints[i]
            if ((i !== that.drawPoints.length - 1) || (that.currPointIndex === that.nextPointIndex)) {
                ctx.fillStyle = point.color
                ctx.shadowBlur = point.shadowBlur
                ctx.beginPath()
                ctx.moveTo(point.x, point.y)
                ctx.arc(point.x, point.y, 5, 0, 2 * PI)
                ctx.fill()
            }
            if (i !== 0) { // 画线
                prePoint = that.drawPoints[i - 1]
                ctx.beginPath()
                shadowBlur = Math.abs(prePoint.shadowBlur + point.shadowBlur) / 2
                gradient = ctx.createLinearGradient(prePoint.x, prePoint.y, point.x, point.y)
                gradient.addColorStop(0, prePoint.color)
                gradient.addColorStop(1, point.color)
                ctx.strokeStyle = gradient
                ctx.shadowBlur = shadowBlur
                ctx.moveTo(prePoint.x, prePoint.y)
                ctx.lineTo(point.x, point.y)
                ctx.stroke()
            }
        }
    }
}
