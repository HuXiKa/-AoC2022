import * as _ from "lodash"
import { multiply } from "lodash"
import { readFile, inspect } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {
    console.log(data)
    const indexes = data.reduce((acc, curr, ind) => {
        const [pa, pb] = curr.split("\r\n").map(i => JSON.parse(i))
        if (check(pa, pb)) acc.push(ind + 1)
        return acc
    }, [] as number[])
    console.log(indexes)
    console.log(_.sum(indexes))
}

export function part2(data: string[]) {
    const start = "[[2]]"
    const end = "[[6]]"
    const packets = [...data.flatMap(l => l.split('\r\n')), start, end].map(p => JSON.parse(p))
    packets.sort(compare)
    console.log(packets)
    const indexes = [start, end].map(i => JSON.parse(i)).map(i => 1 + packets.findIndex(p => _.isEqual(i, p)))
    console.log(indexes)
    console.log(indexes.reduce(multiply))
}

function compare(pa: any, pb: any) { // lazy to rewrite for part1    
    return check(pa, pb) ? -1 : 1
}

function check(pa: any, pb: any): boolean | undefined {
    console.log(`compare ${JSON.stringify(pa)} - ${JSON.stringify(pb)}`)
    if (pa === pb) return undefined
    if (pa === undefined) return true
    if (pb === undefined) return false
    if (!_.isArrayLikeObject(pa) && !_.isArrayLikeObject(pb)) return pa < pb
    else {
        if (!_.isArrayLikeObject(pa)) {
            pa = JSON.parse(`[${pa}]`)
        }
        if (!_.isArrayLikeObject(pb)) {
            pb = JSON.parse(`[${pb}]`)
        }

        console.log(`${JSON.stringify(pa)}, ${JSON.stringify(pb)}`)

        for (const [a, b] of _.zip(pa, pb)) {
            const val = check(a, b)

            if (val === undefined) {
                continue
            }

            return val
        }
    }
}
