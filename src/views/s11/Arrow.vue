<template>
    <canvas class="s1-arrow" width="900" height="440"></canvas>
</template>
<script>
    export default {
        mounted () {
            const that = this
            that.$nextTick(() => {
                that.draw()
            })
        },
        methods: {
            draw () {
                const that = this
                const ctx = that.$el.getContext('2d')
                const allW = 900
                const allH = 440
                const gap = 10
                const left = gap
                const right = allW - gap
                const top = gap
                const bottom = allH - gap
                const middle = allW / 2
                const startX = 158 + gap
                const endX = allW - startX
                ctx.strokeStyle = 'rgb(21, 125, 163)'
                ctx.clearRect(0, 0, allW, allH)

                ctx.shadowColor = 'rgba(0,0,0,0.4)'
                ctx.shadowOffsetX = 8
                ctx.shadowOffsetY = 8
                ctx.shadowBlur = 20
                // 绘制外侧的三角形
                ctx.lineWidth = 2
                ctx.moveTo(startX, top)
                ctx.lineTo(left, top)
                ctx.lineTo(middle, bottom)
                ctx.lineTo(right, top)
                ctx.lineTo(endX, top)
                ctx.stroke()

                // 绘制内侧的三角形
                const interval = 12
                ctx.lineWidth = 6
                ctx.beginPath()
                ctx.moveTo(startX, top + interval)
                ctx.lineTo(left + interval + 16, top + interval)
                ctx.lineTo(middle, bottom - interval - 5)
                ctx.lineTo(right - interval - 16, top + interval)
                ctx.lineTo(endX, top + interval)
                ctx.stroke()
            }
        }
    }
</script>
