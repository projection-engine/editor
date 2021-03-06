import MeshInstance from "../../engine/instances/MeshInstance"
import Entity from "../../engine/basic/Entity"
import TransformComponent from "../../engine/components/TransformComponent"

import MeshComponent from "../../engine/components/MeshComponent"
import COMPONENTS from "../../engine/data/COMPONENTS"
import FileSystem from "../FileSystem"
import FALLBACK_MATERIAL from "../../static/misc/FALLBACK_MATERIAL"

export default async function importMesh(objLoaded, engine, id) {

    let mesh,
        entity,
        existsMesh = false,
        material

    try {
        mesh = window.renderer.meshes.get(objLoaded.id)
        if (!mesh) {
            mesh = new MeshInstance({
                ...objLoaded,
                id: id,
                wireframeBuffer: true
            })

            if (objLoaded.material && !engine.materials.find(m => m.id === objLoaded.material)) {
                const rs = await window.fileSystem.readRegistryFile(objLoaded.material)
                if (rs) {
                    const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" +FileSystem.sep +  rs.path, "json")
                    if (file && file.response)
                        material = {
                            ...file.response,
                            id: objLoaded.material
                        }
                }
            }
        }
        else
            existsMesh = true
        entity = initializeEntity(objLoaded, mesh.id)
    } catch (e) {
        alert.pushAlert("Error loading mesh", "error")
    }

    return {
        mesh,
        material,
        entity,
        existsMesh
    }
}

export function initializeEntity(data, meshID, parent){
    const entity = new Entity(undefined, data.name)
    entity.parent = parent
    parent.children.push(entity)
    const transformation = new TransformComponent()
    transformation.scaling = data.scaling
    transformation.rotationQuat = data.rotationQuat
    transformation.translation = data.translation
    transformation.baseTransformationMatrix = data.baseTransformationMatrix
    if(data.pivotPoint)
        transformation.pivotPoint = data.pivotPoint

    entity.components[COMPONENTS.MESH] = new MeshComponent()
    entity.components[COMPONENTS.MESH].materialID = FALLBACK_MATERIAL
    entity.components[COMPONENTS.MESH].meshID = meshID
    entity.components[COMPONENTS.TRANSFORM] = transformation

    return entity
}