import * as _ from "lodash"
import { indexOfAll, readFile } from "../utils"


export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {    
    const stacks = parseStacks(data[0])
    console.log(stacks)
    const steps = parseSteps(data[1])
    console.log(steps)
    const res = steps.reduce((acc, curr) => {
        _.times(curr[0], (_i) => {                       
            const c = _.first(acc[curr[1]]) ?? ""
            acc[curr[1]] = acc[curr[1]].substring(1)
            acc[curr[2]] = c.concat(acc[curr[2]])
        })
        return acc
    }, stacks)
    console.log(res.map(r => r[0]).join(""))
}

export function part2(data: string[]) {
    const stacks = parseStacks(data[0])
    console.log(stacks)
    const steps = parseSteps(data[1])
    console.log(steps)
    const res = steps.reduce((acc, curr) => {
        const c = acc[curr[1]].slice(0, curr[0])        
        acc[curr[1]] = acc[curr[1]].substring(curr[0])
        acc[curr[2]] = c.concat(acc[curr[2]])
        return acc
    }, stacks)
    console.log(res.map(r => r[0]).join(""))
}

function parseStacks(arg0: string) {
    const lines = arg0.split("\r\n")
    const stackCount = Number(_.last(_.last(lines)?.split("   ")))
    const last = _.last(lines) ?? ""    
    const indexes = indexOfAll(Array.from(last), (c) => /^\d$/.test(c))    
    const items = _.drop(lines, -1).reduce((acc, curr) => {
        return ["", ...indexes.map(i => {
            const ind = Number(last[i])
            return acc[ind] = acc[ind].concat(curr[i])
        })]
    }, [...Array(stackCount + 1)].map((_i) => "")).map(i => i.trim())
    return items;

}
function parseSteps(arg0: string) {
    const lines = arg0.split("\r\n")
    const steps = lines.map(l => l.match(/\d+/g)?.map(n => Number(n)) ?? [])
    return steps;
}

