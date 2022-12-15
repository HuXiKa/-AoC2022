import * as _ from "lodash"
import { identity } from "lodash"
import { readFile, inspect } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

enum items {
    air = ".",
    wall = "#",
    sand = "o",
    source = "+"
}

export function part1(data: string[]) {
    const points = data.flatMap(line => line.split(" -> ").map(l => l.trim()))
    const top = _.minBy(points.map(p => p.split(",")), p => Number(p[0])) ?? [""]
    const bottom = _.maxBy(points.map(p => p.split(",")), p => Number(p[1])) ?? [""]
    const right = _.maxBy(points.map(p => p.split(",")), p => Number(p[0])) ?? [""]
    const shifted = data.map(line => line.split(" -> ").map(l => l.trim())).map(l => l.map(p => [Number(p.split(",")[0]) - Number(top[0]), Number(p.split(",")[1])]))

    console.log(points)
    console.log(shifted)
    console.log(top, bottom, right)

    const map = new Array(Number(bottom[1]) + 2)
    for (let index = 0; index < map.length; index++) {
        map[index] = new Array(Number(right[0]) - Number(top[0]) + 3).fill(items.air)
    }

    const source = [0, 500 - Number(top[0]) + 1]

    map[source[0]][source[1]] = items.source

    shifted.forEach(lines => {
        const pairs = _.zip(lines, lines.slice(1)).slice(0, -1) as [number[], number[]][]
        pairs.forEach(p => {
            const ax = Math.min(p[0][0], p[1][0]) + 1
            const ay = Math.min(p[0][1], p[1][1])
            const bx = Math.max(p[0][0], p[1][0]) + 1
            const by = Math.max(p[0][1], p[1][1])
            if (ax != bx) {
                _.range(ax, bx + 1).forEach(x => map[ay][x] = items.wall)
            } else {
                _.range(ay, by + 1).forEach(y => map[y][ax] = items.wall)
            }
        })
    })
    pretty(map)
    var counter = 0

    while (addSand(source, map)) {
        pretty(map)
        counter++
    }
    console.log(counter)
}

export function part2(data: string[]) {
    const points = data.flatMap(line => line.split(" -> ").map(l => l.trim()))
    const top = _.minBy(points.map(p => p.split(",")), p => Number(p[0])) ?? [""]
    const bottom = _.maxBy(points.map(p => p.split(",")), p => Number(p[1])) ?? [""]
    const right = _.maxBy(points.map(p => p.split(",")), p => Number(p[0])) ?? [""]
    const shifted = data.map(line => line.split(" -> ").map(l => l.trim())).map(l => l.map(p => [Number(p.split(",")[0]) - Number(top[0]), Number(p.split(",")[1])]))

    console.log(points)
    console.log(shifted)
    console.log(top, bottom, right)
    const width = 500

    const map = new Array(Number(bottom[1]) + 2)
    for (let index = 0; index < map.length; index++) {
        map[index] = new Array(width).fill(items.air)
    }

    map[map.length] = new Array(width).fill(items.wall)

    const source = [0, 500 - Number(top[0]) + width / 2]

    map[source[0]][source[1]] = items.source

    shifted.forEach(lines => {
        const pairs = _.zip(lines, lines.slice(1)).slice(0, -1) as [number[], number[]][]
        pairs.forEach(p => {
            const ax = Math.min(p[0][0], p[1][0]) + width / 2
            const ay = Math.min(p[0][1], p[1][1])
            const bx = Math.max(p[0][0], p[1][0]) + width / 2
            const by = Math.max(p[0][1], p[1][1])
            if (ax != bx) {
                _.range(ax, bx + 1).forEach(x => map[ay][x] = items.wall)
            } else {
                _.range(ay, by + 1).forEach(y => map[y][ax] = items.wall)
            }
        })
    })
    pretty(map)
    var counter = 0

    while (!full(source, map)) {
        addSand2(source, map)        
        counter++
    }
    pretty(map)
    console.log(counter)
}
function pretty(map: any[]) {
    console.log(map.map(l => l.join("")).join("\r\n"))
}

function addSand(source: number[], map: any[]) {
    var currentSand = [source[0], source[1]]

    while (canMove(currentSand, map) != -1) {
        if (!inbound(currentSand, map)) return false
        else {
            const moveInd = canMove(currentSand, map)
            const move = moves[moveInd]
            currentSand = [currentSand[0] + move[0], currentSand[1] + move[1]]
        }
    }
    console.log(`current sand ${currentSand}`)
    map[currentSand[0]][currentSand[1]] = items.sand
    return true
}

function addSand2(source: number[], map: any[]) {
    var currentSand = [source[0], source[1]]

    while (canMove(currentSand, map) != -1) {
        const moveInd = canMove(currentSand, map)
        const move = moves[moveInd]
        currentSand = [currentSand[0] + move[0], currentSand[1] + move[1]]
    }
    console.log(`current sand ${currentSand}`)
    map[currentSand[0]][currentSand[1]] = items.sand
    return true
}

const moves = [[1, 0], [1, -1], [1, 1]] // down, left, right

function canMove(currentSand: number[], map: any[]) {
    return moves.map(([v, h]) => [currentSand[0] + v, currentSand[1] + h]).map(([x, y]) => map[x][y] == items.air).indexOf(true)
}

function inbound(currentSand: number[], map: any[]) {
    return currentSand[0] < map.length && currentSand[1] < map[0].length && currentSand[1] > 0
}

function full(source: number[], map: any[]) {
    return map[source[0]][source[1]] == items.sand
}

