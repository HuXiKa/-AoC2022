import * as _ from "lodash"
import { readFile, inspect } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

type Command = {
    target: string
    tick: number
    value: number
}

export function part1(data: string[]) {
    const res = data.reduce((acc, curr) => {
        acc = tick(acc)
        //console.log(`tick ${acc.tick} - ${curr} | ${JSON.stringify(acc)}`)
        if (curr.startsWith("addx")) {
            acc.pc.push({ target: "x", tick: 2, value: Number(curr.split(" ")[1]) })
        }
        while (acc.pc.length > 0) {
            const c = acc.pc.pop()
            if (c) {
                _.range(0, c.tick - 1).map(i => {
                    acc = tick(acc)
                })
                acc = { ...acc, pc: acc.pc, x: acc.x + c.value }
            }
        }
        return acc
    }, { x: 1, tick: 1, pc: [] as Command[], strength: 0 })
    console.log(res)
}

export function part2(data: string[]) {
    const screen = _.range(7).map(i => "")
    const res = data.reduce((acc, curr) => {
        acc = tick2(acc)
        //console.log(`tick ${acc.tick} - ${curr} | ${JSON.stringify(acc)}`)
        if (curr.startsWith("addx")) {
            acc.pc.push({ target: "x", tick: 2, value: Number(curr.split(" ")[1]) })
        }
        while (acc.pc.length > 0) {
            const c = acc.pc.pop()
            if (c) {
                _.range(0, c.tick - 1).map(i => {
                    acc = tick2(acc)
                })
                acc = { ...acc, pc: acc.pc, x: acc.x + c.value }
            }
        }
        return acc
    }, { x: 1, tick: 1, pc: [] as Command[], screen: screen })
    console.log(res)
}

function tick(acc: { x: number; tick: number; pc: Command[], strength: number }) {
    console.log(`tick ${JSON.stringify(acc)}`)
    if ([20, 60, 100, 140, 180, 220].includes(acc.tick)) {
        return { ...acc, tick: acc.tick + 1, strength: acc.strength + (acc.tick * acc.x) }
    }

    return { ...acc, tick: acc.tick + 1 }
}

function tick2(acc: { x: number; tick: number; pc: Command[], screen: string[] }) {
    console.log(`tick ${JSON.stringify(acc)}`)
    const r = acc.screen[Math.floor((acc.tick - 1) / 40)].split('')
    r[acc.tick - 1] = Math.abs(acc.x - ((acc.tick - 1) % 40)) <= 1 ? "#" : "."
    acc.screen[Math.floor((acc.tick - 1) / 40)] = r.join('')

    return { ...acc, tick: acc.tick + 1 }
}
