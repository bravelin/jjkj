<template>
    <div class="s1-sphere"></div>
</template>
<script>
    import * as THREE from 'three'
    import Hexagon from './Hexagon'
    import CirclePath from './CirclePath'

    let scene = null
    let camera = null
    let renderer = null
    let sphere = null
    let container = null
    let starts = null
    let light = null
    let CAMERA_CENTER_X = -20
    let SPHERE_CENTER_X = -280 // 球的位置
    let SPHERE_CENTER_Z = -100
    let SCENE_BG_COLOR = 0x202276 // 场景的背景色
    const hexagonShaps = [] // 六边形集
    const hexagonPaths = [] // 边集

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
                camera.position.x = CAMERA_CENTER_X
                camera.position.y = 0
                camera.position.z = 550
                camera.lookAt(CAMERA_CENTER_X, 0, 0)
                camera.up.x = 0
                camera.up.y = 0
                camera.up.z = 1

                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
                renderer.setClearColor(SCENE_BG_COLOR)
                renderer.setSize(that.width, that.height)
                renderer.shadowMap.enabled = true
                renderer.shadowMap.type = THREE.PCFSoftShadowMap
                container.appendChild(renderer.domElement)
                that.drawStar() // 背景星星
                that.drawLight() // 添加球中心的光晕
                that.drawSphere() // 添加旋转的球
                that.addShapes() // 增加六边形
                that.addPaths() // 增加线条
            },
            addShapes () {
                const that = this
                let hex = null
                let startX = 0
                let opacity = 1
                let rowShapes = null
                for (let j = 0; j < 9; j++) {
                    startX = (j % 2 === 0 ? 145 : 99)
                    opacity = 1 - Math.abs(4 - j) * 0.2
                    rowShapes = []
                    hexagonShaps.push(rowShapes)
                    for (let i = 0; i < 4; i++) {
                        hex = new Hexagon(SPHERE_CENTER_X - startX + i * 100, -200 + j * 50, opacity)
                        hex.draw(scene)
                        rowShapes.push(hex)
                    }
                }
            },
            addPaths () {
                // hexagonPaths 每条边是点的集合
                const paths = []
                paths.push([[0, 0, 2], [0, 0, 3], [0, 0, 4], [0, 0, 5], [0, 0, 0], [0, 1, 3], [0, 1, 2], [0, 1, 1], [0, 1, 0], [0, 1, 5]])
                paths.push([[1, 1, 3], [1, 1, 2], [1, 1, 1], [1, 1, 0], [1, 1, 5], [0, 2, 4], [0, 2, 5], [0, 2, 0], [0, 2, 1], [1, 2, 3], [1, 2, 2], [1, 2, 1], [1, 2, 0], [1, 2, 5], [0, 3, 4], [0, 3, 5], [0, 3, 0], [0, 3, 1], [1, 3, 3], [1, 3, 2], [1, 3, 1], [1, 3, 0], [1, 3, 5]])
                paths.push([[2, 0, 0], [2, 0, 1], [2, 0, 2], [2, 0, 3], [2, 0, 4], [1, 0, 1], [1, 0, 0], [1, 0, 5], [1, 0, 4], [1, 0, 3]])
                paths.push([[4, 1, 4], [4, 1, 3], [4, 1, 2], [4, 1, 1], [3, 1, 2], [3, 1, 1], [3, 1, 0], [3, 1, 5], [2, 1, 2], [2, 1, 3], [2, 1, 4], [2, 1, 5]])
                paths.push([[4, 0, 3], [4, 0, 2], [4, 0, 1], [4, 0, 0], [4, 0, 5], [3, 0, 3], [3, 0, 4], [3, 0, 5], [3, 0, 0], [5, 0, 3], [5, 0, 2], [5, 0, 1], [5, 0, 0]])
                paths.push([[6, 0, 2], [6, 0, 3], [6, 0, 4], [6, 0, 5], [6, 0, 0], [7, 0, 4], [7, 0, 5], [7, 0, 0], [7, 0, 1], [7, 0, 2], [8, 0, 1], [8, 0, 2], [8, 0, 3], [8, 0, 4]])
                paths.forEach(path => {
                    hexagonPaths.push(new CirclePath(scene, hexagonShaps, path))
                })
            },
            drawLight () {
                const canvas = document.createElement('canvas')
                canvas.width = 32
                canvas.height = 32
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
                const mesh = new THREE.Sprite(material)
                mesh.scale.x = mesh.scale.y = size * 1.5
                mesh.position.z = SPHERE_CENTER_Z
                mesh.position.x = SPHERE_CENTER_X
                mesh.position.y = 0
                scene.add(mesh)
            },
            drawStar () { // 星星
                const that = this
                const starSize = 1.6

                // 在canvas上绘制
                const canvas = document.createElement('canvas')
                canvas.width = 16
                canvas.height = 16
                const color = '196,233,255'
                const context = canvas.getContext('2d')
                const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
                gradient.addColorStop(0, `rgba(${color},1)`)
                gradient.addColorStop(0.2, `rgba(${color},1)`)
                gradient.addColorStop(0.4, `rgba(${color},.5)`)
                gradient.addColorStop(1, 'rgba(0,0,0,0)')
                context.fillStyle = gradient
                context.fillRect(0, 0, canvas.width, canvas.height)

                // 用canvas生成material
                const material = new THREE.SpriteMaterial({
                    map: new THREE.CanvasTexture(canvas),
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
                const geometry = new THREE.IcosahedronGeometry(120, 2)
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
                sphere.translateX(SPHERE_CENTER_X)
                sphere.translateZ(SPHERE_CENTER_Z)
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
