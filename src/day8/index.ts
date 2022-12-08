import * as _ from "lodash"
import { identity } from "lodash"
import { readFile, inspect } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const width = data[0].length
    const height = data.length
    const perimeter = (width * 2) + (height * 2) - 4
    console.log(data)
    const matrix = data.map(r => Array.from(r).map(n => Number(n)))
    const all = matrix.map((row, rowIndex) => {
        return row.map((item, columnIndex) => {
            return checkUp(matrix, rowIndex, columnIndex)
                || checkDown(matrix, rowIndex, columnIndex)
                || checkLeft(matrix, rowIndex, columnIndex)
                || checkRight(matrix, rowIndex, columnIndex)
        })
    })
    console.log(all)
    all.shift()
    all.pop()
    const res = all.map(l => {
        l.shift()
        l.pop()
        return l
    })
    console.log(_.countBy(res.flat(), identity).true + perimeter)
}

export function part2(data: string[]) {
    console.log(data)
    const matrix = data.map(r => Array.from(r).map(n => Number(n)))
    const all = matrix.map((row, rowIndex) => {
        return row.map((item, columnIndex) => {
            return countUp(matrix, rowIndex, columnIndex)
                * countDown(matrix, rowIndex, columnIndex)
                * countLeft(matrix, rowIndex, columnIndex)
                * countRight(matrix, rowIndex, columnIndex)
        })
    })
    console.log(_.max(all.flat()))
}

function checkUp(data: number[][], rowIndex: number, columnIndex: number) {
    const r = _.range(Math.max(rowIndex - 1, 0), -1, -1).map(i => data[i][columnIndex] < data[rowIndex][columnIndex])
    return r.filter(identity)
}

function checkDown(data: number[][], rowIndex: number, columnIndex: number) {
    const r = _.range(Math.min(rowIndex + 1, data.length - 1), data.length, 1).map(i => data[i][columnIndex] < data[rowIndex][columnIndex])
    return r.every(identity)
}

function checkLeft(data: number[][], rowIndex: number, columnIndex: number) {
    const r = _.range(Math.max(columnIndex - 1, 0), -1, -1).map(i => data[rowIndex][i] < data[rowIndex][columnIndex])
    return r.every(identity)
}

function checkRight(data: number[][], rowIndex: number, columnIndex: number) {
    const r = _.range(Math.min(columnIndex + 1, data[0].length - 1), data[0].length, 1).map(i => data[rowIndex][i] < data[rowIndex][columnIndex])
    return r.every(identity)
}

function countUp(data: number[][], rowIndex: number, columnIndex: number) {
    const d = _.unzip(data)[columnIndex].slice().reverse()
    const r = d.reduce((acc, curr, i) => {
        if(i < d.length - rowIndex || acc[0] == -1) return acc
        else if(curr < acc[0]) return [acc[0], acc[1] + 1]
        else if(curr >= acc[0]) return [-1, acc[1] + 1]
        return acc
    }, [data[rowIndex][columnIndex], 0])    
    return r[1]

}

function countDown(data: number[][], rowIndex: number, columnIndex: number) {
    const d = _.unzip(data)[columnIndex]
    const r = d.reduce((acc, curr, i) => {
        if(i <= rowIndex || acc[0] == -1) return acc
        else if(curr < acc[0]) return [acc[0], acc[1] + 1]
        else if(curr >= acc[0]) return [-1, acc[1] + 1]
        return acc
    }, [data[rowIndex][columnIndex], 0])    
    return r[1]
}

function countLeft(data: number[][], rowIndex: number, columnIndex: number) {    
    const d = data[rowIndex].slice().reverse()
    const r = d.reduce((acc, curr, i) => {
        if(i < d.length - columnIndex || acc[0] == -1) return acc
        else if(curr < acc[0]) return [acc[0], acc[1] + 1]
        else if(curr >= acc[0]) return [-1, acc[1] + 1]
        return acc
    }, [data[rowIndex][columnIndex], 0])    
    return r[1]
}

function countRight(data: number[][], rowIndex: number, columnIndex: number) {    
    const r = data[rowIndex].reduce((acc, curr, i) => {
        if(i <= columnIndex || acc[0] == -1) return acc
        else if(curr < acc[0]) return [acc[0], acc[1] + 1]
        else if(curr >= acc[0]) return [-1, acc[1] + 1]
        else return acc
    }, [data[rowIndex][columnIndex], 0])    
    return r[1]
}

