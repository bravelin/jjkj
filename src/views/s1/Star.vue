<template>
    <canvas class="s1-star" width="1920" height="1080"></canvas>
</template>
<script>
    import StarPoint from './StarPoint'
    const win = window
    export default {
        data () {
            return {
                stars: [],
                ctx: null,
                hue: 239,
                w: 0,
                h: 0
                // requestId: null
            }
        },
        mounted () {
            const that = this
            that.$nextTick(() => {
                that.ctx = that.$el.getContext('2d')
                that.draw()
            })
            // win.addEventListener('resize', that.doResize)
        },
        methods: {
            // doResize () {
            //     const that = this
            //     if (that.requestId) {
            //         win.cancelAnimationFrame(that.requestId)
            //     }
            //     that.ctx.clearRect(0, 0, that.w, that.h)
            //     that.draw()
            // },
            draw () {
                const that = this
                const el = that.$el
                const ctx = that.ctx
                let w = that.w = el.width = window.innerWidth
                let h = that.h = el.height = window.innerHeight
                let hue = that.hue
                let maxStars = 80
                let canvas2 = document.createElement('canvas')
                let ctx2 = canvas2.getContext('2d')
                canvas2.width = 150
                canvas2.height = 150
                let half = canvas2.width / 2
                let gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
                gradient2.addColorStop(0.025, 'rgba(255,255,255,0.3)')
                gradient2.addColorStop(0.05, 'hsl(' + hue + ', 61%, 33%)')
                gradient2.addColorStop(0.25, 'hsl(' + hue + ', 54%, 12%)')
                gradient2.addColorStop(0.45, 'hsl(' + hue + ', 64%, 6%)')
                gradient2.addColorStop(1, 'transparent')

                ctx2.fillStyle = gradient2
                ctx2.beginPath()
                ctx2.arc(half, half, half, 0, Math.PI * 2)
                ctx2.fill()
                that.stars = []
                for (let i = 0; i < maxStars; i++) {
                    that.stars.push(new StarPoint(w, h, ctx, ctx2, canvas2))
                }
                ctx.fillStyle = `hsla(${that.hue}, 58.4%, 19.8%, 1)`
                ctx.fillRect(0, 0, that.w, that.h)
                ctx.globalCompositeOperation = 'lighter'
                for (let i = 1, l = that.stars.length; i < l; i++) {
                    that.stars[i].draw()
                }
                // that.animation()
            }
            // animation () {
            //     const that = this
            //     const ctx = that.ctx
            //     ctx.globalCompositeOperation = 'source-over'
            //     ctx.globalAlpha = 0.8
            //     ctx.fillStyle = `hsla(${that.hue}, 58.4%, 19.8%, 1)`
            //     ctx.fillRect(0, 0, that.w, that.h)
            //     ctx.globalCompositeOperation = 'lighter'
            //     for (let i = 1, l = that.stars.length; i < l; i++) {
            //         that.stars[i].draw()
            //     }
            //     that.requestId = win.requestAnimationFrame(that.animation)
            // }
        }
        // beforeDestroy () {
        //     const that = this
        //     if (that.requestId) {
        //         win.cancelAnimationFrame(that.requestId)
        //     }
        //     win.removeEventListener('onresize', that.doResize)
        // }
    }
</script>
