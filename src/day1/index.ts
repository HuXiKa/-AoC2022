import * as _ from "lodash";
import { readFile } from "../utils"

export function f() {
    const data = readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
    console.log(" part1: ")
    part1(data)
    console.log(" part2: ")
    part2(data)
}

function part1(data: string[]) {        
    const res = data.map((o) => _.sum(o.split('\r\n').map(s => Number(s))))
    console.log(_.max(res))
}

function part2(data: string[]) {        
    const res = data.map((o) => _.sum(o.split('\r\n').map(s => Number(s))))    
    console.log(_.sum(res.sort((n1,n2) => n1 - n2).splice(-3)))
}