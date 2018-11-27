export default class CirclePoint {
    constructor (hexagonRowIndex, hexagonColIndex, edgeIndex) {
        this.hexagonColIndex = hexagonColIndex
        this.hexagonRowIndex = hexagonRowIndex
        this.edgeIndex = edgeIndex
        this.x = 0
        this.y = 0
        this.z = 0
        this.opacity = 0
    }
    setPosition (x, y, z, opacity) {
        this.x = x
        this.y = y
        this.z = z
        this.opacity = opacity
    }
}
