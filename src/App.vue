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
    import Swiper from 'swiper'
    import NavBar from '@/components/NavBar'
    import S1 from '@/views/s1/Main'

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
    .s2 {
      background: #3399ff;
    }
    .s3 {
      background: #6666cc;
    }
</style>
