import * as _ from "lodash";
import { readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {        
    const res = data.map((o) => _.sum(o.split('\r\n').map(s => Number(s))))
    console.log(_.max(res))
}

export function part2(data: string[]) {        
    const res = data.map((o) => _.sum(o.split('\r\n').map(s => Number(s))))    
    console.log(_.sum(res.sort((n1,n2) => n1 - n2).splice(-3)))
}