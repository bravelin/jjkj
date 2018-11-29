<template>
    <div id="app">
        <NavBar></NavBar>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <S1 class="swiper-slide" data-hash="1">s1</S1>
                <div class="swiper-slide s2" data-hash="2">s2</div>
                <div class="swiper-slide s3" data-hash="3">s3</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { swiperAnimateCache, swiperAnimate } from '@/lib/swiper.animate1.0.3.min'
    import NavBar from '@/components/NavBar'
    import S1 from '@/views/s11/Main'
    export default {
        name: 'app',
        components: {
            NavBar, S1
        },
        data() {
            return {
                swiperInstance: null
            }
        },
        mounted() {
            const that = this
            that.$nextTick(() => {
                that.swiperInstance = new Swiper('.swiper-container', {
                    direction: 'vertical',
                    hashNavigation: true,
                    mousewheel: true,
                    keyboard: true,
                    on: {
                        init () {
                            // const slideName = `s${this.activeIndex + 1}`
                            // const anisParent = document.querySelector(`.${slideName}`)
                            // if (anisParent) {
                            //     const anis = anisParent.querySelectorAll('.ani')
                            //     for (let i = 0; i < anis.length; i++) {
                            //         anis[i].classList.add('active')
                            //     }
                            // }
                            // swiperAnimateCache(that.swiperInstance) // 隐藏动画元素
                            // swiperAnimate(that.swiperInstance) // 初始化完成开始动画
                        },
                        slideChangeTransitionEnd () {
                            // swiperAnimate(that.swiperInstance) // 每个slide切换结束时也运行当前slide动画
                        }
                    }
                })
            })
        }
    }
</script>

<style lang="scss">
    .s2 {
      background: #3399ff;
    }
    .s3 {
      background: #6666cc;
    }
</style>
