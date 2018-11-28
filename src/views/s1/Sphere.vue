<template>
    <div class="s1-sphere"></div>
</template>
<script>
    import * as THREE from 'three'
    import TWEEN from '@/lib/tween'
    import Hexagon from './Hexagon'
    import CirclePath from './CirclePath'

    let scene = null
    let camera = null
    let renderer = null
    let sphere = null
    let container = null
    let stars = null
    let light = null
    let CAMERA_CENTER_X = -20
    let SPHERE_CENTER_X = -400 // 球的位置
    let SPHERE_CENTER_INIT_X = -780
    let SPHERE_CENTER_Z = -400
    let SPHERE_CENTER_INIT_Z = -2000
    let SPHERE_SIZE = 200
    let SCENE_BG_COLOR = 0x212282 // 场景的背景色
    const hexagonShapes = [] // 六边形集
    const hexagonPaths = [] // 边集
    let isSpreadHexagonShapes = false
    let isUpdateHexagonPath = false

    // 定义tweens
    let sphereTween = null
    let lightTween = null
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
                    startX = (j % 2 === 0 ? 40 : -5)
                    opacity = 1 - Math.abs(4 - j) * 0.22
                    rowShapes = []
                    hexagonShapes.push(rowShapes)
                    for (let i = 0; i < 4; i++) {
                        hex = new Hexagon(SPHERE_CENTER_X - startX + i * 110, -200 + j * 50, (i === 0 || i === 3 ? 0.4 : 1) * opacity)
                        hex.draw(scene, SPHERE_CENTER_X + 155, 0)
                        rowShapes.push(hex)
                    }
                }
            },
            addPaths () {
                // hexagonPaths 每条边是点的集合
                const paths = []
                paths.push([[0, 0, 2], [0, 0, 3], [0, 0, 4], [0, 0, 5], [0, 0, 0], [0, 1, 3], [0, 1, 2], [0, 1, 1], [0, 1, 0], [0, 1, 5]])
                paths.push([[1, 1, 3], [1, 1, 2], [1, 1, 1], [1, 1, 0], [1, 1, 5], [0, 2, 4], [0, 2, 5], [0, 2, 0], [0, 2, 1], [0, 2, 2], [1, 2, 2], [1, 2, 1], [1, 2, 0], [1, 2, 5], [0, 3, 4], [0, 3, 5], [0, 3, 0], [0, 3, 1], [0, 3, 2], [1, 3, 2], [1, 3, 1], [1, 3, 0], [1, 3, 5]])
                paths.push([[2, 0, 0], [2, 0, 1], [2, 0, 2], [2, 0, 3], [2, 0, 4], [1, 0, 1], [1, 0, 0], [1, 0, 5], [1, 0, 4], [1, 0, 3]])
                paths.push([[4, 1, 4], [4, 1, 3], [4, 1, 2], [4, 1, 1], [4, 1, 0], [4, 1, 5], [3, 1, 1], [3, 1, 0], [3, 1, 5], [2, 1, 2], [2, 1, 3], [2, 1, 4], [2, 1, 5]])
                paths.push([[4, 0, 3], [4, 0, 2], [4, 0, 1], [4, 0, 0], [4, 0, 5], [3, 0, 2], [3, 0, 3], [3, 0, 4], [3, 0, 5], [3, 0, 0], [5, 0, 3], [5, 0, 2], [5, 0, 1], [5, 0, 0]])
                paths.push([[6, 0, 2], [6, 0, 3], [6, 0, 4], [6, 0, 5], [6, 0, 0], [6, 0, 1], [7, 0, 5], [7, 0, 0], [7, 0, 1], [7, 0, 2], [8, 0, 1], [8, 0, 2], [8, 0, 3], [8, 0, 4]])
                paths.push([[2, 2, 4], [2, 2, 3], [2, 2, 2], [2, 2, 1], [2, 2, 0], [2, 3, 3], [2, 3, 4], [2, 3, 5], [2, 3, 0], [2, 3, 1], [2, 3, 2], [3, 2, 4], [3, 2, 3], [3, 2, 2], [3, 2, 1], [3, 2, 0]])
                paths.push([[5, 3, 1], [5, 3, 0], [5, 3, 5], [5, 3, 4], [5, 3, 3], [5, 3, 2], [6, 3, 5], [6, 3, 0], [6, 3, 1], [6, 3, 2], [5, 2, 1], [5, 2, 2], [5, 2, 3], [5, 2, 4], [5, 2, 5]])
                paths.push([[7, 3, 1], [7, 3, 0], [7, 3, 5], [7, 3, 4], [7, 3, 3], [7, 3, 2], [8, 3, 5], [8, 3, 0], [8, 3, 1], [8, 3, 2], [8, 3, 3], [8, 2, 0], [8, 2, 5], [8, 2, 4], [8, 2, 3], [8, 2, 2]])
                paths.push([[8, 1, 4], [8, 1, 3], [8, 1, 2], [8, 1, 1], [7, 1, 2], [7, 1, 3], [7, 1, 4], [7, 1, 5], [7, 1, 0], [7, 2, 3], [7, 2, 2], [7, 2, 1], [7, 2, 0], [7, 2, 5]])
                paths.push([[3, 3, 4], [3, 3, 5], [3, 3, 0], [3, 3, 1], [4, 3, 5], [4, 3, 0], [4, 3, 1], [4, 3, 2], [4, 3, 3]])
                paths.push([[6, 1, 3], [6, 1, 2], [6, 1, 1], [6, 1, 0], [6, 1, 5], [5, 1, 2], [5, 1, 3], [5, 1, 4], [5, 1, 5], [5, 1, 0], [5, 1, 1], [6, 2, 2], [6, 2, 1], [6, 2, 0], [6, 2, 5], [4, 2, 3], [4, 2, 4], [4, 2, 5], [4, 2, 0], [4, 3, 3]])

                paths.forEach(path => {
                    hexagonPaths.push(new CirclePath(scene, hexagonShapes, path))
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
                light = new THREE.Sprite(material)
                light.scale.x = light.scale.y = light.scale.z = 0.01
                light.position.z = SPHERE_CENTER_Z
                light.position.x = SPHERE_CENTER_X
                light.position.y = 0
                scene.add(light)
                let tween = null
                lightTween = new TWEEN.Tween(light.scale).to({ x: 450, y: 450, z: 450 }, 1500).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                    hexagonShapes.forEach(rowArr => {
                        rowArr.forEach(h => h.shapes.forEach(s => {
                            new TWEEN.Tween(s.mesh.scale).to({ x: 45, y: 45 }, 300).easing(TWEEN.Easing.Linear.None).start().onComplete(() => {
                                if (!isSpreadHexagonShapes) {
                                    isSpreadHexagonShapes = true
                                    that.spreadHexagonShapes()
                                }
                            })
                        }))
                    })
                })
            },
            spreadHexagonShapes () {
                const that = this
                hexagonShapes.forEach(rowArr => {
                    rowArr.forEach(h => h.shapes.forEach(s => {
                        new TWEEN.Tween(s.mesh.position).to({ x: s.x, y: s.y }, 1200).easing(TWEEN.Easing.Cubic.InOut).start().onComplete(() => {
                            if (!isUpdateHexagonPath) {
                                isUpdateHexagonPath = true
                            }
                        })
                    }))
                })
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
                stars = new THREE.Object3D()
                for (let i = 0; i < starNum; i++) {
                    mesh = new THREE.Sprite(material)
                    mesh.scale.x = mesh.scale.y = starSize * 1.5
                    mesh.position.z = -400 + Math.random() * 700
                    mesh.position.x = -350 + Math.random() * 700
                    mesh.position.y = -300 + Math.random() * 600
                    stars.add(mesh)
                }
                scene.add(stars)
                stars.position.set(-180, 0, 0)
            },
            drawSphere () { // 球
                const geometry = new THREE.IcosahedronGeometry(SPHERE_SIZE, 3)
                const sphereBuffer = new THREE.BufferGeometry().fromGeometry(geometry)
                const material = new THREE.MeshLambertMaterial({ color: 0x192376, transparent: true, opacity: 0 })
                sphere = new THREE.Mesh(sphereBuffer, material)
                scene.add(sphere)

                const edgesGeometry = new THREE.EdgesGeometry(sphere.geometry)
                const edgesMaterial = new THREE.LineDashedMaterial({
                    color: 0x4C51A2,
                    dashSize: 0.5,
                    gapSize: 0.5
                })
                const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
                edges.computeLineDistances()
                sphere.add(edges)
                sphere.translateX(SPHERE_CENTER_INIT_X)
                sphere.translateZ(SPHERE_CENTER_INIT_Z)
                sphereTween = new TWEEN.Tween(sphere.position).to({ x: SPHERE_CENTER_X, z: SPHERE_CENTER_Z }, 1200).easing(TWEEN.Easing.Linear.None).start().chain(lightTween)
            },
            animate () {
                const that = this
                sphere.rotation.y += 0.002
                stars.rotation.y += 0.0003
                TWEEN.update()
                if (isUpdateHexagonPath) {
                    hexagonPaths.forEach(path => path.update())
                }
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
