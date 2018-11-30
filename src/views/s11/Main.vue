<template>
    <div class="s1">
        <div class="text-zone">
            <Arrow class="ani" swiper-animate-effect="fadeInUp" swiper-animate-duration="1.2s" swiper-animate-delay="0.3s"></Arrow>
            <div class="text">
                <div class="ani" swiper-animate-effect="fadeInLeft" swiper-animate-duration="1s" swiper-animate-delay="1.1s">BLOCK CHACHAINPAYMENT</div>
                <div class="ani" swiper-animate-effect="fadeInDown" swiper-animate-duration="1.2s" swiper-animate-delay="0.3s">区块链</div>
                <div>
                    安全 可靠 跨平台
                    <div class="self-ani"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Arrow from './Arrow'

    export default {
        components: {
            Arrow
        }
    }
</script>
