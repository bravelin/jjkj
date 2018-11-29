export default class CirclePoint {
    constructor (hexagonRowIndex, hexagonColIndex, edgeIndex) {
        this.hexagonColIndex = hexagonColIndex
        this.hexagonRowIndex = hexagonRowIndex
        this.edgeIndex = edgeIndex
        this.x = 0
        this.y = 0
        this.z = 0
        this.color = 0
        this.shadowBlur = 1
    }
    setPosition (x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
}
