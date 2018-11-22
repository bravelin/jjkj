<template>
    <canvas class="s1-hexagon" width="800" height="800"></canvas>
</template>
<script>
    import HexagonPoint from './HexagonPoint'
    export default {
        data () {
            return {
                ctx: null
            }
        },
        mounted () {
            const that = this
            that.$nextTick(() => {
                that.draw()
            })
        },
        methods: {
            draw () {
                const that = this
                that.ctx = that.$el.getContext('2d')
                that.drawHexagons()
            },
            // 绘制一个六边形
            drawHexagons () {
                const that = this
                const allW = 800
                const allH = 800
                let startX = 80
                let startY = allH - 80
                let gapY = 150
                let lineX = 100
                let lineY = 100
                const points = []
                let point = null
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 13; j++) {
                        point = new HexagonPoint(that.ctx, startX + j * lineX, startY + j * lineY)
                        point.draw()
                        points.push(point)
                    }
                    startY = startY - gapY
                }
            }
        }
    }
</script>
