import * as _ from "lodash"
import { multiply } from "lodash"
import { readFile, inspect } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

class Monkey {
    private items: number[]
    private operator: string
    private divBy: number
    private targets: number[]
    public inspectionCount = 0

    constructor(data: string) {
        const lines = data.split("\r\n")
        this.items = lines[1].split(": ")[1].split(", ").map(n => Number(n.trim()))
        this.operator = _.tail(lines[2].split("=")[1].split(" ")).map(s => s.trim()).join(" ")
        this.divBy = Number(_.last(lines[3].split(" ")))
        this.targets = [Number(_.last(lines[4].split(" "))), Number(_.last(lines[5].split(" ")))]
    }

    hasItem() {
        return this.items.length != 0
    }

    test() {
        const res = this.items.map(item => {
            this.inspectionCount++
            const n = Math.floor(eval(this.operator.replace(/old/gi, "" + item)))
            const wl = Math.floor(n / 3)
            if ((wl % this.divBy) === 0) {
                console.log(`passing ${wl} from ${this} to ${this.targets[0]}`)
                return [wl, this.targets[0]]
            } else {
                console.log(`passing ${wl} from ${this} to ${this.targets[1]}`)
                return [wl, this.targets[1]]
            }
        })
        this.items = []
        return res
    }

    catch(item: number) {
        this.items.push(item)
    }

}

export function part1(data: string[]) {
    const monkeys = data.map(l => new Monkey(l))
    console.log(data)
    console.log(monkeys)
    const res = _.range(0, 20).reduce((acc, curr) => {
        return acc.reduce((acc, curr) => {
            curr.test().forEach(([item, target]) => acc[target].catch(item))
            return acc
        }, monkeys)
    }, monkeys)
    inspect(res)
    console.log(res.map(m => m.inspectionCount).sort((a, b) => a - b))
    console.log(res.map(m => m.inspectionCount).sort((a, b) => a - b).slice(-2).reduce(multiply))
}

class BigMonkey {
    private items: number[]
    private operator: string
    public divBy: number
    private targets: number[]
    public inspectionCount = 0

    constructor(data: string) {
        const lines = data.split("\r\n")
        this.items = lines[1].split(": ")[1].split(", ").map(n => Number(n.trim()))
        this.operator = _.tail(lines[2].split("=")[1].split(" ")).map(s => s.trim()).join(" ")
        this.divBy = Number(_.last(lines[3].split(" ")))
        this.targets = [Number(_.last(lines[4].split(" "))), Number(_.last(lines[5].split(" ")))]
    }

    hasItem() {
        return this.items.length != 0
    }

    test(lcm: number) {
        const res = this.items.map(item => {
            this.inspectionCount++
            const wl = Math.floor(eval(this.operator.replace(/old/gi, "" + item)))
            if ((wl % this.divBy) === 0) {
                //console.log(`passing ${wl} from ${this} to ${this.targets[0]}`)
                return [wl % lcm, this.targets[0]]
            } else {
                //console.log(`passing ${wl} from ${this} to ${this.targets[1]}`)
                return [wl % lcm, this.targets[1]]
            }
        })
        this.items = []
        return res
    }

    catch(item: number) {
        this.items.push(item)
    }
}

export function part2(data: string[]) {
    const monkeys = data.map(l => new BigMonkey(l))
    console.log(data)
    console.log(monkeys)
    const lcm = monkeys.map(m => m.divBy).reduce(multiply)
    console.log(lcm)
    const res = _.range(0, 10000).reduce((acc, curr, ind) => {
        //console.log(`round ${ind}`)
        return acc.reduce((acc, curr, mind) => {
            //console.log(` monkey ${mind}`)
            if (curr.hasItem()) {
                curr.test(lcm).forEach(([item, target]) => acc[target].catch(item))
            }
            return acc
        }, monkeys)
    }, monkeys)
    inspect(res)
    console.log(res.map(m => m.inspectionCount).sort((a, b) => a - b))
    console.log(res.map(m => m.inspectionCount).sort((a, b) => a - b).slice(-2).reduce(multiply))
}
