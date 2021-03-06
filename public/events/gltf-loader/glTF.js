import Buffer from "./instances/Buffer"
import Accessor from "./instances/Accessor"
import Scene from "./instances/Scene"


const fs = require("fs")
const path = require("path")
export function createDirectory(p){
    try {
        fs.mkdirSync(path.resolve(p))
    } catch (e) {
        console.error(e)
    }
}
export default async function glTF(root, fileSRC, projectPath, file, options, filePath) {
    createDirectory(root)
    const idsToLoad = [], fileSourcePath = filePath.replace(fileSRC, "")
    try {
        let parsed = JSON.parse(file)
        const buffers = parsed.buffers.map(b => new Buffer(b, fileSourcePath))
        await Promise.all(buffers.map(b => b.initialize()))
        parsed.buffers = null
        const accessors = parsed.accessors.map(a => new Accessor(a, buffers, parsed.bufferViews))
        const scenes = parsed.scenes.map(s => new Scene(parsed.nodes, s))
        await Promise.all(scenes.map(s => s.load(projectPath, root, parsed.meshes, accessors, options, idsToLoad, fileSourcePath, parsed.materials, parsed.textures, parsed.images)))
    } catch (error) {
        console.error(error)
    }

    return idsToLoad
}