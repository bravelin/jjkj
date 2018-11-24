<template>
    <div class="s1-sphere"></div>
</template>
<script>
    import * as THREE from 'three'
    export default {
        data () {
            return {
                scene: null,
                camera: null,
                renderer: null,
                sphere: null,
                container: null,
                width: 0,
                height: 0,
                requestId: 0
            }
        },
        mounted () {
            const that = this
            that.$nextTick(() => {
                that.init()
                that.animate()
            })
        },
        methods: {
            init () {
                const that = this
                const win = window
                that.container = that.$el
                const scene = that.scene = new THREE.Scene()
                that.width = win.innerWidth
                that.height = win.innerHeight

                const camera = that.camera = new THREE.PerspectiveCamera(45, that.width / that.height, 0.1, 10000)
                camera.position.x = -180
                camera.position.y = 0
                camera.position.z = 500
                camera.lookAt(scene.position)

                const renderer = that.renderer = new THREE.WebGLRenderer({ antialias: true })
                renderer.setClearColor(0x202276)
                renderer.setSize(that.width, that.height)
                that.container.appendChild(renderer.domElement)

                const geometry = new THREE.IcosahedronGeometry(100, 4)
                const sphereBuffer = new THREE.BufferGeometry().fromGeometry(geometry)
                const material = new THREE.MeshNormalMaterial({
                    color: 0xffffff,
                    opacity: 0.5,
                    transparent: true
                })
                const sphere = that.sphere = new THREE.Mesh(sphereBuffer, material)
                scene.add(sphere)

                const edgesGeometry = new THREE.EdgesGeometry(sphere.geometry)
                const edgesMaterial = new THREE.LineDashedMaterial({
                    color: 0xffffff,
                    dashSize: 0.5,
                    gapSize: 0.5
                })
                const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
                edges.computeLineDistances()
                sphere.add(edges)
                sphere.translateX(-180)
            },
            animate () {
                const that = this
                that.sphere.rotation.y += 0.005
                that.renderer.render(that.scene, that.camera)
                that.requestId = requestAnimationFrame(that.animate)
            }
        },
        beforeDestroy () {
            const that = this
            cancelAnimationFrame(that.requestId)
        }
    }
</script>
