import * as _ from "lodash"
import { readFile } from "../utils"


export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const sacks = data.map(s => [s.substring(0, (s.length / 2)), s.substring((s.length / 2))]).map(s => s.map(h => unique(h)))
    console.log(sacks)
    const match = sacks.map(s => matches(s[0], s[1]))
    console.log(match)
    const prio = _.sum(match.map(c => priority(c)))
    console.log(prio)

}

export function part2(data: string[]) {
    const groups = _.chunk(data, 3).map(s => s.map(h => unique(h))).map(s => matches2(s[0], s[1], s[2]))
    console.log(groups)
    const prio = _.sum(groups.map(c => priority(c)))
    console.log(prio)
}

function unique(s: string) {
    return [...s].reduce((acc, curr) => {
        return acc.includes(curr) ? acc : acc + curr
    }, "")
}

function matches(s: string, m: string) {
    var match = 's';
    [...s].forEach(c => {
        if (m.includes(c)) {
            match = c
        }
    })
    return match
}

function priority(c: string){
    return c == c.toLowerCase() ? c.charCodeAt(0) - 96 : c.charCodeAt(0) - 38
}

function matches2(s: string, m1: string, m2: string) {
    var match = 's';
    [...s].forEach(c => {
        if (m1.includes(c) && m2.includes(c)) {
            match = c
        }
    })
    return match
}