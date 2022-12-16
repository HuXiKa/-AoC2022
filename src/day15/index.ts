import * as _ from "lodash"
import { readFile, inspect } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const lines = data.map((line) => line.match(/(-?\d+)/g)?.map(Number)) as number[][]

    console.log(lines)

    const target = 2000000

    const intervals = lines.reduce((acc, curr) => {
        const dist = distance([curr[0], curr[1]], [curr[2], curr[3]]);
        const rowDistance = Math.abs(curr[1] - target);
        if (rowDistance > dist) {
            return acc;
        }
        acc.push([curr[0] - (dist - rowDistance), curr[0] + (dist - rowDistance)])

        return acc
    }, [] as number[][])

    intervals.sort((a, b) => { return a[0] - b[0] || a[1] - b[1] });

    console.log(intervals)

    const merged = merge(intervals)

    console.log(merged)

    const s = _.sum(merged.map(i => i[1] - i[0] + 1))

    console.log(s)

    const bc = new Set(lines.filter(i => i[3] == target).map(i => `${i[2]},${i[3]}`))
    console.log(s - bc.size)
}

function distance(s: number[], b: number[]) {
    return Math.abs(s[0] - b[0]) + Math.abs(s[1] - b[1])
}

//https://stackoverflow.com/questions/26390938/merge-arrays-with-overlapping-values
function merge(ranges: number[][]) {
    let result: number[][] = []
    let last: number[]

    ranges.forEach(r => {
        if (!last || r[0] > last[1] + 1) {
            result.push(last = r);
        }
        else if (r[1] > last[1]) {
            last[1] = r[1];
        }
    });

    return result;
}

export function part2(data: string[]) {
    const liness = data.map((line) => line.match(/(-?\d+)/g)?.map(Number)) as number[][]

    console.log(liness)

    function intervals(target: number) {
        const int = liness.reduce((acc, curr) => {
            const dist = distance([curr[0], curr[1]], [curr[2], curr[3]]);
            const rowDistance = Math.abs(curr[1] - target);
            if (rowDistance > dist) {
                return acc;
            }
            acc.push([curr[0] - (dist - rowDistance), curr[0] + (dist - rowDistance)])

            return acc
        }, [] as number[][])
        int.sort((a, b) => { return a[0] - b[0] || a[1] - b[1] });

        const merged = merge(int)

        //console.log(merged)

        return merged
    }

    const target = 4000000

    let x = 0, y = 0;
    for (let i = 0; i < target; i++) {
        if((i % 10000) == 0) {
            console.log(`${i} / ${target} (${(i / target) * 100} %)`)
        }
        const disjointIntervals = intervals(i);
        if (disjointIntervals.length > 1) {
            y = i;
            x = disjointIntervals[0][1] + 1;
        }
    }
    console.log(x, y)

    console.log(x * 4000000 + y);
}