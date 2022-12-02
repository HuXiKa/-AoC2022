import * as _ from "lodash";
import { readFile } from "../utils"

enum opponent {
    rock = "A",
    paper = "B",
    scrissor = "C"
}

enum us {
    rock = "X",
    paper = "Y",
    scrissor = "Z"
}

enum result {
    lose = "X",
    draw = "Y",
    win = "Z"
}

enum playedScore {
    X = 1, // rock
    Y = 2, // paper
    Z = 3, // scrissor
}

enum outcomeScore {
    Lost = 0,
    Draw = 3,
    Win = 6
}

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const roundScores = data.map(g => {
        const p = g.split(' ')
        return roundScore(_.first(g) as opponent, _.last(g) as us)
    })
    console.log(_.sum(roundScores))

}

export function part2(data: string[]) {
    const roundScores = data.map(g => {
        return roundScore2(_.first(g) as opponent, _.last(g) as result)
    })
    console.log(_.sum(roundScores))
}

function roundScore(o: opponent, u: us): any {
    const win = (o == opponent.paper && u == us.scrissor) || (o == opponent.scrissor && u == us.rock) || (o == opponent.rock && u == us.paper)
    const draw = (o == opponent.paper && u == us.paper) || (o == opponent.scrissor && u == us.scrissor) || (o == opponent.rock && u == us.rock)
    const points = (win ? outcomeScore.Win : draw ? outcomeScore.Draw : outcomeScore.Lost) + playedScore[u]
    console.log(`${o} vs ${u}: ${points}`)
    return points
}

function roundScore2(o: opponent, r: result): any {
    const u = r == result.draw ? drawAgainst(o) : r == result.win ? winAgainst(o) : loseAgainst(o)    
    const points = (r == result.win ? outcomeScore.Win : r == result.draw ? outcomeScore.Draw : outcomeScore.Lost) + playedScore[u]
    console.log(`${o} needs to ${r}, play ${u}, gets score ${points}`)
    return points
}
function winAgainst(o: opponent) {
    switch (o) {
        case opponent.paper:
            return us.scrissor
        case opponent.scrissor:
            return us.rock
        case opponent.rock:
            return us.paper
    }
}

function drawAgainst(o: opponent) {    
    return Object.values(us)[Object.values(opponent).indexOf(o)]
}

function loseAgainst(o: opponent) {
    switch (o) {
        case opponent.paper:
            return us.rock
        case opponent.scrissor:
            return us.paper
        case opponent.rock:
            return us.scrissor
    }
}

