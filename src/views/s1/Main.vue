<template>
    <div class="s1">
        <Star></Star>
        <!-- <div class="earth"></div> -->
        <Hexagon></Hexagon>
        <div class="text-zone">
            <Arrow></Arrow>
            <div class="text">
                <div>BLOCK CHACHAINPAYMENT</div>
                <div>区块链</div>
                <div>安全 可靠 跨平台</div>
            </div>
        </div>
    </div>
</template>
<script>
    import Arrow from './Arrow'
    import Star from './Star'
    import Hexagon from './Hexagon'
    export default {
        components: {
            Arrow, Star, Hexagon
        }
    }
</script>
