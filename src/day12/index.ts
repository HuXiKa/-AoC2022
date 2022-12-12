import * as _ from "lodash"
import { readFile, inspect } from "../utils"
import Graph = require("node-dijkstra")
import { sample } from "lodash"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

const neigbours = [[0, 1], [1, 0], [-1, 0], [0, -1]]

export function part1(data: string[]) {
    console.log(data)
    const route = new Graph()

    var start = [0, 0]
    var end = [0, 0]

    data.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            if (c == 'S') start = [ri, ci]
            if (c == 'E') end = [ri, ci]
        })
    })

    console.log(start)
    console.log(end)


    data.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            const dest = neigbours.reduce((acc, curr) => {
                const x = ri + curr[0]
                const y = ci + curr[1]
                if (x >= 0 && x < data.length && notSteep(c, data[x][ci])) acc[`${data[x][ci]}[${x}][${ci}]`] = 1
                if (y >= 0 && y < row.length && notSteep(c, data[ri][y])) acc[`${data[ri][y]}[${ri}][${y}]`] = 1
                return acc
            }, {})
            //console.log(`adding dest ${JSON.stringify(dest)}`)
            if (c == 'E') console.log(`E[${ri}][${ci}]`)
            if (c == 'S') console.log(`S[${ri}][${ci}]`)
            route.addNode(`${c}[${ri}][${ci}]`, dest)
        })
    })

    const path = route.path(`S[${start[0]}][${start[1]}]`, `E[${end[0]}][${end[1]}]`) as string[]
    console.log(path)
    console.log(path.slice(-10))
    console.log(path.length - 1)
}


export function part2(data: string[]) {
    const route = new Graph()

    var start = [0, 0]
    var end = [0, 0]
    var starts = [[0, 0]]

    data.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            if (c == 'S') start = [ri, ci]
            if (c == 'E') end = [ri, ci]
            if (c == 'a') starts = [...starts, [ri, ci]]
        })
    })

    console.log(start)
    console.log(end)

    // clear original start
    const tmp = data[start[0]].split('')
    tmp[start[1]] = 'a'
    data[start[0]] = tmp.join('')

    // just brute force the entire thing, we should probably just reverse the search direction, but oh well, we can wait ~45 seconds

    const paths = starts.map((s, si) => {
        console.log(`calculating start ${si} / ${starts.length}`)
        start = s

        //add temp start
        const tmp = data[s[0]].split('')
        tmp[s[1]] = 'S'
        data[s[0]] = tmp.join('')


        data.forEach((row, ri) => {
            Array.from(row).forEach((c, ci) => {
                const dest = neigbours.reduce((acc, curr) => {
                    const x = ri + curr[0]
                    const y = ci + curr[1]
                    if (x >= 0 && x < data.length && notSteep(c, data[x][ci])) acc[`${data[x][ci]}[${x}][${ci}]`] = 1
                    if (y >= 0 && y < row.length && notSteep(c, data[ri][y])) acc[`${data[ri][y]}[${ri}][${y}]`] = 1
                    return acc
                }, {})
                //console.log(`adding dest ${JSON.stringify(dest)}`)
                route.addNode(`${c}[${ri}][${ci}]`, dest)
            })
        })

        const path = route.path(`S[${start[0]}][${start[1]}]`, `E[${end[0]}][${end[1]}]`) as string[]
        return (path?.length - 1)
    })
    console.log(_.min(paths))
}

function notSteep(a: string, b: string) {
    if ((a == 'E' && ["z", "y"].includes(b)) || (b == 'E' && ["z", "y"].includes(a))) return true // end should be reachable from only y and above
    else if ((a == 'S' && ["a", "b"].includes(b)) || (b == 'S' && ["a", "b"].includes(a))) return true // start should only go to b at max
    else if (["E", "S"].includes(a) || ["E", "S"].includes(b)) return false
    else return b.charCodeAt(0) - a.charCodeAt(0) <= 1 // others can be calculated
}