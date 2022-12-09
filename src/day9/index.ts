import * as _ from "lodash"
import { readFile, inspect } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const res = walk(data)
    const visited = _.uniqWith(res.covered, _.isEqual)
    console.log(visited)
    console.log(visited.length)
}

export function part2(data: string[]) {
    const res = walk2(data)
    const visited = _.uniqWith(res.covered, _.isEqual)
    console.log(visited)
    console.log(visited.length)
}

const dirMap = new Map([["R", [0, 1]], ["L", [0, -1]], ["U", [1, 0]], ["D", [-1, 0]]])

function walk(steps: string[]) {
    return steps.reduce((acc, curr) => {
        const [direction, amount] = curr.split(" ")
        const dir = dirMap.get(direction) ?? [0, 0]
        _.times(Number(amount), () => {
            const newHead = [acc.head[0] + dir[0], acc.head[1] + dir[1]]
            const newTail = moveTail(acc.tail, newHead)
            //console.log(`moving tail from ${acc.tail} to follow ${newHead} which moved ${direction}, newTail: ${newTail}`)
            acc = { head: newHead, tail: newTail, covered: [...acc.covered, newTail] }
            //printBoard(acc.head, [acc.tail])
        })
        return acc
    }, { head: [0, 0], tail: [0, 0], covered: [] as number[][] })
}

function walk2(steps: string[]) {
    return steps.reduce((acc, curr) => {
        const [direction, amount] = curr.split(" ")
        const dir = dirMap.get(direction) ?? [0, 0]
        _.times(Number(amount), () => {
            const newHead = [acc.head[0] + dir[0], acc.head[1] + dir[1]]
            acc.tail.forEach((t, i) => {
                const toFollow = i == 0 ? newHead : acc.tail[i - 1]
                const newTail = moveTail(t, toFollow)
                //console.log(`moving tail[${i + 1}] from ${t} to follow ${toFollow} which moved ${direction}, newTail: ${newTail}`)
                const nt = acc.tail
                nt[i] = newTail
                //console.log(` TAIL[${i}] MOVED TO ${newTail}`)
                acc = { head: newHead, tail: nt, covered: i == acc.tail.length - 1 ? [...acc.covered, newTail] : acc.covered }
                //printBoard(acc.head, acc.tail)
            })
        })
        //printBoard(acc.head, acc.tail)
        return acc
    }, { head: [0, 0], tail: _.range(0, 9).map(c => [0, 0]), covered: [] as number[][] })
}

function distance(arg0: number[], arg1: number[]) {
    return Math.abs(arg0[0] - arg1[0]) + Math.abs(arg0[1] - arg1[1])
}

function moveTail(currentTail: number[], toHead: number[]) {
    const dist = distance(currentTail, toHead)
    if (dist == 0) // cover, don't move
        return currentTail
    else if (dist >= 3) // diagonal move
        return [currentTail[0] + Math.sign(toHead[0] - currentTail[0]), currentTail[1] + Math.sign(toHead[1] - currentTail[1])]
    else if (dist == 1 || (dist == 2 && (Math.abs(currentTail[0] - toHead[0]) == 1 && Math.abs(currentTail[1] - toHead[1]) == 1))) // adjecent, don't move
        return currentTail
    else // repeat move        
        return [currentTail[0] + Math.sign(toHead[0] - currentTail[0]), currentTail[1] + Math.sign(toHead[1] - currentTail[1])]
}

function printBoard(head: number[], tail: number[][]) {
    const size = 15
    var l = _.range(size * 3).map(l => "")
    _.range(0, size * 3).map(r => {
        _.range(0, size * 3).map(c => {
            l[r] = l[r].concat(".")
        })
    })
    var t = l[size].split('')
    t[size] = "s"
    l[size] = t.join("")
    Array.from(tail).reverse().reduce((acc, curr, index) => {
        t = acc[curr[0] + size].split('')
        t[curr[1] + size] = `${9 - index}`
        acc[curr[0] + size] = t.join("")
        return acc
    }, l)
    t = l[head[0] + size].split('')
    t[head[1] + size] = "H"
    l[head[0] + size] = t.join("")
    console.log(l.reverse().join("\r\n"))
    console.log("************")
}
