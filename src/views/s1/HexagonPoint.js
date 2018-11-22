import { random } from '@/lib/util'
export default class HexagonPoint {
    constructor (ctx, centerX, centerY, len = 40) {
        this.ctx = ctx
        this.centerX = centerX
        this.centerY = centerY
        this.len = len
    }
    draw () { // 层叠状，往右侧
        const that = this
        let centerX = 0
        let centerY = that.centerY
        let len = 0
        const ctx = that.ctx
        ctx.lineWidth = 2
        ctx.lineJoin = 'round'
        let opacity = 1
        let light = 38.4
        for (let i = 2; i >= 0; i--) {
            centerX = that.centerX + 25 * Math.cos(Math.PI / 4) * i
            centerY = that.centerY - 15 * Math.sin(Math.PI / 4) * i
            len = that.len * Math.pow(0.9, i)
            opacity = 0.6 * Math.pow(0.8, i)
            light = 38.4 - 5 * i
            ctx.strokeStyle = `hsla(234, 88.8%, ${light}%, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(centerX + len * Math.cos(0), centerY + len * Math.sin(0))
            for (let j = 0; j < 6; j++) {
                ctx.lineTo(centerX + len * Math.cos(j * Math.PI / 3), centerY + len * Math.sin(j * Math.PI / 3))
            }
            ctx.closePath()
            ctx.stroke()
        }
    }
}
