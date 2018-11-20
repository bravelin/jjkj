<template>
    <div id="app">
        <NavBar></NavBar>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide s1" data-hash="s1">s1</div>
                <div class="swiper-slide s2" data-hash="s2">s2</div>
                <div class="swiper-slide s3" data-hash="s3">s3</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Swiper from 'swiper'
    import NavBar from '@/components/NavBar'

    export default {
        name: 'app',
        components: {
            NavBar
        },
        data() {
            return {
                swiperInstance: null
            }
        },
        mounted() {
            const that = this
            that.swiperInstance = new Swiper('.swiper-container', {
                direction: 'vertical',
                hashNavigation: true,
                mousewheel: true,
                keyboard: true,
                on: {
                    init () {
                        console.log('init....')
                    },
                    slideChangeTransitionEnd () {
                        console.log(this.activeIndex)
                    }
                }
            })
        }
    }
</script>

<style lang="scss">
    .s1 {
      background: #00ccff;
    }
    .s2 {
      background: #3399ff;
    }
    .s3 {
      background: #6666cc;
    }
</style>
