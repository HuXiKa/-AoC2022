import * as _ from "lodash"
import { readFile } from "../utils"


export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    var found = 0
    Array.from(data[0].substring(4)).reduce((acc, curr, index) => {
        if(_.uniq(acc).length != 4) {
            return acc.substring(1) + curr
        } else {
            if(found == 0) found = index + 4
            return acc
        }
    }, data[0].slice(0, 4))    
    console.log(found)
}

export function part2(data: string[]) {
    const shift = 14
    var found = 0
    Array.from(data[0].substring(shift)).reduce((acc, curr, index) => {
        if(_.uniq(acc).length != shift) {
            return acc.substring(1) + curr
        } else {
            if(found == 0) found = index + shift
            return acc
        }
    }, data[0].slice(0, shift))    
    console.log(found)
}