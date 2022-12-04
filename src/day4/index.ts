import * as _ from "lodash"
import { readFile } from "../utils"


export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {    
    console.log(data)
    const r = data.map(l => ranges(l))
    console.log(r)
    const fullOverlaps = r.map(l => overlaps(l))
    console.log(_.countBy(fullOverlaps))
}

export function part2(data: string[]) {
    const r = data.map(l => ranges(l))
    console.log(r)
    const partialOverlaps = r.map(l => overlaps2(l))
    console.log(_.countBy(partialOverlaps))
}

function ranges(l: string) {
    const lines = l.split(',').map(s => s.split("-").map(n => Number(n)))
    return [lines[0], lines[1]]
}

function overlaps(r: number[][]) {
    const a = r[0]
    const b = r[1]

    return (a[0] >= b[0] && a[1] <= b[1]) || (a[0] <= b[0] && a[1] >= b[1])
}

function overlaps2(r: number[][]) {
    const a = _.range(r[0][0], r[0][1] + 1)
    const b = _.range(r[1][0], r[1][1] + 1)

    return _.isEmpty(_.intersectionWith(a, b))
}

