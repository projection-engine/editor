import FileClass from "../../templates/File";
import React from 'react'

import Folder from "../../templates/Folder";
import computeBoundingBox from "../computeBoundingBox";

import coreParser from "../../../../services/engine/utils/gltf/coreParser";
import loadObj from "../../../../services/engine/utils/obj/loadObj";
import FileBlob from "../../../../services/workers/FileBlob";

import ImageProcessor from "../../../../services/workers/ImageProcessor";


export default function handleImportFile(files, hook) {
    files.forEach(fi => processFile(fi, hook))
}

export function handleImportFolder(files, hook) {

    const includesGLTF = files.findIndex(f => f.name.includes('.gltf')) > -1
    const rootName = files.length > 0 ? files[0].name.split('/')[0] : undefined

    let usedNames = []
    if (!includesGLTF) {
        let folders = files
            .map(f => {
                const name = f.webkitRelativePath.replace(/\/(([a-zA-Z0-9_ ]|-)+)\.[a-zA-Z0-9]*$/, '')
                if (!usedNames.find(dir => dir.name === name)) {
                    const newFolder = new Folder(name)

                    usedNames.push({
                        name,
                        id: newFolder.id
                    })
                    return newFolder
                } else
                    return undefined
            }).filter(f => f !== undefined)


        folders.map(f => {
            const split = f.name.split('/')

            if (split.length > 1) {
                split.pop()
                const folderNewName = f.name.split('/')[f.name.split('/').length - 1]
                if (split.length > 0) {
                    const directParent = usedNames.find(p => p.name === split[split.length - 1])

                    if (directParent) {
                        f.parent = directParent.id
                        f.name = folderNewName
                    }
                }
            } else
                f.parent = hook.currentDirectory

            return f
        }).forEach(f => hook.pushFolder(f))
        const parsedFiles = files
            .map(f => {
                const folderName = f.webkitRelativePath.replace(/\/(([a-zA-Z0-9_ ]|-)+)\.[a-zA-Z0-9]*$/, '')
                const folderRef = usedNames.find(dir => dir.name === folderName)
                f.parent = folderRef ? folderRef.id : hook.currentDirectory
                return f
            })

        parsedFiles.forEach(fi => processFile(fi, hook, true))
    } else {
        const gltfFile = files.find(f => f.name.includes('.gltf'))
        if (gltfFile)
            processFile(gltfFile, hook, true, files, rootName)
    }


}

function processFile(file, hook, attributedParent, files, rootName) {
    let reader = new FileReader();
    const split = file.name.split(/\.([a-zA-Z].+)$/)

    switch (split[1]) {
        case 'png':
        case 'jpeg':
        case 'jpg': {
            // const worker = new WebWorker()
            FileBlob.loadAsString(file, false, true).then(res => {
                ImageProcessor.reduceImage(res, 256, 256)
                    .then(r => {
                        const nFile = new FileClass(split[0], 'image', file.size, undefined, attributedParent ? file.parent : hook.currentDirectory, undefined, r)
                        hook.pushFile(nFile, res)
                    })
            })

            break
        }
        case 'gltf': {
            const newFolder = new Folder(rootName ? rootName : split[0], hook.currentDirectory)
            hook.pushFolder(newFolder)
            coreParser(file, files).then(parsedData => {
                const size = files.map(f => f.size).reduce((partialSum, a) => partialSum + a, 0);
                if (parsedData) {
                    parsedData.nodes.forEach(m => {
                        const [min, max] = computeBoundingBox(parsedData.meshes[m.meshIndex]?.vertices)
                        console.log(file)
                        hook.pushFile(new FileClass(
                                m.name,
                                'mesh',
                                size,
                                undefined,
                                newFolder.id),
                            //
                            JSON.stringify({
                                ...m,
                                indices: parsedData.meshes[m.meshIndex].indices,
                                vertices: parsedData.meshes[m.meshIndex].vertices,
                                tangents: parsedData.meshes[m.meshIndex].tangents,
                                normals: parsedData.meshes[m.meshIndex].normals,
                                uvs: parsedData.meshes[m.meshIndex].uvs,

                                boundingBoxMax: max,
                                boundingBoxMin: min
                            })
                        )

                    })
                }
            })
            break
        }
        case'obj': {
            reader.addEventListener('load', event => {

                const mesh = loadObj(event.target.result)
                const [min, max] = computeBoundingBox(mesh.vertices)

                const parsedData = {
                    mesh,
                    rotation: [0, 0, 0],
                    translation: [0, 0, 0],
                    scaling: [1, 1, 1],
                    boundingBoxMax: max,
                    boundingBoxMin: min,
                }
                const encodedMesh = encodeURI(JSON.stringify(parsedData))
                hook.pushFile(new FileClass(split[0].name, 'mesh', encodedMesh.split(/%..|./).length - 1, undefined, hook.currentDirectory), encodedMesh)
            });

            reader.readAsText(file)
            break
        }
        default: {
            const nFile = new FileClass(split[0], split[1], file.size, undefined, attributedParent ? file.parent : hook.currentDirectory)
            reader.addEventListener('load', event => {
                hook.pushFile(nFile, event.target.result)
            });
            reader.readAsText(file)
            break
        }
    }
    return undefined
}