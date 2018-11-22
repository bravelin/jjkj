import { random } from '@/lib/util'
const maxStars = 1000
export default class StarPoint {
    constructor (w, h, ctx, ctx2, canvas2) {
        this.ctx = ctx
        this.ctx2 = ctx2
        this.canvas2 = canvas2
        this.orbitRadius = random(maxOrbit(w * 0.55, h * 0.3))
        this.radius = random(160, this.orbitRadius) / 8
        this.orbitX = w * 0.2
        this.orbitY = h * 0.75
        this.timePassed = random(0, maxStars)
        this.speed = random(this.orbitRadius) / 600000
        // this.alpha = random(2, 10) / 10
    }
    draw () {
        let x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX
        let y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY
        // let twinkle = random(10)
        // if (twinkle === 1 && this.alpha > 0) {
        //     this.alpha -= 0.05
        // } else if (twinkle === 2 && this.alpha < 1) {
        //     this.alpha += 0.05
        // }
        // this.ctx.globalAlpha = this.alpha
        this.ctx.drawImage(this.canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius)
        this.timePassed += this.speed
    }
}

function maxOrbit (x, y) {
    let max = Math.max(x, y)
    let diameter = Math.round(Math.sqrt(max * max + max * max))
    return diameter / 2
}
