export function random (min, max) {
    if (arguments.length < 2) {
        max = min
        min = 0
    }
    if (min > max) {
        [min, max] = [max, min]
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
}
