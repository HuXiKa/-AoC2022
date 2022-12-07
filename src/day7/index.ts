import * as _ from "lodash"
import { readFile, inspect } from "../utils"

class FS {
    private root: FSNode
    private cwd: Directory

    constructor() {
        this.root = { path: "." }
        this.cwd = { path: "." }
    }

    public exec(line: string[]) {
        const cmd = line.shift() ?? ""
        if (cmd === "ls") {
            const items = line.map(i => i.split(" "))
            items.forEach(i => this.addToCwd(i))
        } else if (cmd.startsWith("cd")) {
            const p = cmd.split(" ")[1]
            if (p == "..") {
                this.cwd = {
                    path: this.cwd.path.substring(0, this.cwd.path.lastIndexOf('/'))
                }
            } else if (p == "/") {
                this.cwd = {
                    path: "."
                }
            } else {
                this.cwd = {
                    path: this.cwd.path.concat(`/${p}`)
                }
            }
        } else {
            console.error(`invalid command '${line}'`)
        }
    }

    public folderSizes(): { path: string, size: number }[] {

        function f(item: FSNode): { path: string, size: number }[] {
            const [files, dirs] = _.partition(item.children, (i => (i as File).name != undefined))
            const fileSize = _.sum(files.map(f => (f as File).size))
            const dirSize = dirs.flatMap(d => f((d as Directory)))
            return [...dirSize, {
                path: (item as Directory).path, size: fileSize + _.sum(dirs.map(d => {
                    const cd = (d as Directory)
                    return dirSize.find(f => f.path === cd.path)?.size ?? 0
                }))
            }
            ]
        }

        return f(this.root)
    }

    private addToCwd(i: string[]): void {
        if (i[0] === "dir") {
            const dir: Directory = { path: `${this.cwd.path}/${i[1]}` }
            this.update(this.root, this.cwd, dir)
        } else {
            const file: File = { name: i[1], size: Number(i[0]) }
            this.update(this.root, this.cwd, file)
        }
    }
    private update(current: FSNode, cwd: Directory, item: FSItem, currentPath: string = ".") {
        if (currentPath == cwd.path) {
            current.children = [...current.children ?? [], item]
        } else {
            current.children?.forEach(c => {
                if ((c as Directory).path != undefined) return this.update(c, cwd, item, `${(c as Directory).path}`)
            })
        }
    }
}

type File = {
    name: string
    size: number
}

type Directory = {
    path: string
}
type FSItem = Directory | File
type FSNode = Tree<FSItem>

type Tree<T> = T & {
    children?: Tree<T>[];
}

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n$')
}

export function part1(data: string[]) {
    const tree = parseTree(data)
    inspect(tree)
    const folderSizes = tree.folderSizes()
    console.log(folderSizes)
    const res = _.sumBy(folderSizes.filter(f => f.size <= 100000), i => i.size)
    console.log(res)
}

export function part2(data: string[]) {
    const tree = parseTree(data)
    inspect(tree)
    const folderSizes = tree.folderSizes()
    console.log(folderSizes)
    console.log(_.last(folderSizes))
    const totalSize = _.last(folderSizes)?.size ?? 0
    const unused = 70000000 - totalSize
    const target = 30000000 - unused
    console.log(`totalSize ${totalSize} unused ${unused} target ${target}`)
    const diffs = folderSizes.map(d => { return { ...d, diff: target - d.size } })
    const res = _.sortBy(diffs ?? [], i => i.diff).reverse().find(d => d.diff <= 0)
    console.log(res)
}

function parseTree(data: string[]) {
    data.shift()
    const fs = new FS()
    const lines = data.map(c => c.split('\r\n').map(c => c.trim()))
    lines.forEach(c => fs.exec(c))
    return fs
}

