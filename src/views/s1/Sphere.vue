<template>
    <div class="s1-sphere"></div>
</template>
<script>
    import * as THREE from 'three'
    let scene = null
    let camera = null
    let renderer = null
    let sphere = null
    let container = null
    let starts = null
    let light = null
    export default {
        data () {
            return {
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
                container = that.$el
                scene = new THREE.Scene()
                that.width = win.innerWidth
                that.height = win.innerHeight

                camera = new THREE.PerspectiveCamera(45, that.width / that.height, 0.1, 10000)
                camera.position.x = -180
                camera.position.y = 0
                camera.position.z = 500
                camera.lookAt(scene.position)

                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
                renderer.setClearColor(0x202276)
                renderer.setSize(that.width, that.height)
                renderer.shadowMap.enabled = true
                renderer.shadowMap.type = THREE.PCFSoftShadowMap
                container.appendChild(renderer.domElement)

                that.drawStar() // 背景星星
                that.drawLight() // 添加球中心的光晕
                that.drawSphere() // 添加旋转的球
            },
            drawLight () {
                const canvas = document.createElement('canvas')
                canvas.width = 30
                canvas.height = 30
                const color = '196,233,255'
                const context = canvas.getContext('2d')
                const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
                gradient.addColorStop(0, 'rgba(' + color + ',1)')
                gradient.addColorStop(0.2, 'rgba(' + color + ',.7)')
                gradient.addColorStop(0.4, 'rgba(' + color + ',.5)')
                gradient.addColorStop(1, 'rgba(0,0,0,0)')
                context.fillStyle = gradient
                context.fillRect(0, 0, canvas.width, canvas.height)

                const that = this
                const size = 180
                const material = new THREE.SpriteMaterial({
                    map: new THREE.CanvasTexture(canvas), blending: THREE.AdditiveBlending
                })
                const geometry = new THREE.CircleGeometry(size, 50)
                const mesh = new THREE.Sprite(material)
                mesh.scale.x = mesh.scale.y = size * 1.5
                mesh.position.z = 0
                mesh.position.x = -180
                mesh.position.y = 0
                scene.add(mesh)
            },
            generateSprite () {
                const canvas = document.createElement('canvas')
                canvas.width = 16
                canvas.height = 16
                const color = '196,233,255'
                const context = canvas.getContext('2d')
                const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
                gradient.addColorStop(0, 'rgba(' + color + ',1)')
                gradient.addColorStop(0.2, 'rgba(' + color + ',1)')
                gradient.addColorStop(0.4, 'rgba(' + color + ',.5)')
                gradient.addColorStop(1, 'rgba(0,0,0,0)')
                context.fillStyle = gradient
                context.fillRect(0, 0, canvas.width, canvas.height)
                return canvas
            },
            drawStar () { // 星星
                const that = this
                const starSize = 1.6
                const material = new THREE.SpriteMaterial({
                    map: new THREE.CanvasTexture(that.generateSprite()),
                    blending: THREE.AdditiveBlending
                })
                const geometry = new THREE.CircleGeometry(starSize, 50)
                const starNum = 500
                let mesh = null
                starts = new THREE.Object3D()
                for (let i = 0; i < starNum; i++) {
                    mesh = new THREE.Sprite(material)
                    mesh.scale.x = mesh.scale.y = starSize * 1.5
                    mesh.position.z = -400 + Math.random() * 700
                    mesh.position.x = -350 + Math.random() * 700
                    mesh.position.y = -300 + Math.random() * 600
                    starts.add(mesh)
                }
                scene.add(starts)
                starts.position.set(-180, 0, 0)
            },
            drawSphere () { // 球
                const geometry = new THREE.IcosahedronGeometry(100, 2)
                const sphereBuffer = new THREE.BufferGeometry().fromGeometry(geometry)
                const material = new THREE.MeshLambertMaterial({ color: 0x192376, transparent: true, opacity: 0.2 })
                sphere = new THREE.Mesh(sphereBuffer, material)
                scene.add(sphere)

                const edgesGeometry = new THREE.EdgesGeometry(sphere.geometry)
                const edgesMaterial = new THREE.LineDashedMaterial({
                    color: 0xe0e0e0,
                    dashSize: 0.5,
                    gapSize: 0.5
                })
                const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
                edges.computeLineDistances()
                sphere.add(edges)
                sphere.translateX(-180)
                sphere.castShadow = true
            },
            animate () {
                const that = this
                const time = Date.now() * 0.0005
                sphere.rotation.y += 0.002
                starts.rotation.y += 0.0001
                renderer.render(scene, camera)
                that.requestId = requestAnimationFrame(that.animate)
            }
        },
        beforeDestroy () {
            const that = this
            cancelAnimationFrame(that.requestId)
        }
    }
</script>
