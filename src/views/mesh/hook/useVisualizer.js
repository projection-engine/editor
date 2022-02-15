import {useContext, useEffect, useLayoutEffect, useReducer, useRef, useState} from "react";

import entityReducer, {ENTITY_ACTIONS} from "../../../services/engine/utils/entityReducer";
import {enableBasics} from "../../../services/engine/utils/utils";
import Entity from "../../../services/engine/ecs/basic/Entity";

import planeMesh from '../../../static/meshes/plane.json'
import sphereMesh from '../../../static/meshes/sphere.json'

import Engine from "../../../services/engine/Engine";
import TransformSystem from "../../../services/engine/ecs/systems/TransformSystem";
import ShadowMapSystem from "../../../services/engine/ecs/systems/ShadowMapSystem";
import DeferredSystem from "../../../services/engine/ecs/systems/DeferredSystem";
import PostProcessingSystem from "../../../services/engine/ecs/systems/PostProcessingSystem";
import SkyboxComponent from "../../../services/engine/ecs/components/SkyboxComponent";
import DirectionalLightComponent from "../../../services/engine/ecs/components/DirectionalLightComponent";
import MaterialComponent from "../../../services/engine/ecs/components/MaterialComponent";
import MeshComponent from "../../../services/engine/ecs/components/MeshComponent";
import TransformComponent from "../../../services/engine/ecs/components/TransformComponent";
import Mesh from "../../../services/engine/renderer/elements/Mesh";

import skybox from '../../../static/default_skybox.jpg'
import {LoaderProvider} from "@f-ui/core";

import randomID from "../../../pages/project/utils/misc/randomID";
import {SHADING_MODELS} from "../../../pages/project/hook/useSettings";


export default function useVisualizer(initializePlane, initializeSphere) {
    const [id, setId] = useState()
    const [gpu, setGpu] = useState()
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])
    const [entities, dispatchEntities] = useReducer(entityReducer, [], () => [])
    const [initialized, setInitialized] = useState(false)
    const [canRender, setCanRender] = useState(true)

    const load = useContext(LoaderProvider)
    const renderer = useRef()
    let resizeObserver

    useLayoutEffect(() => {
        setId(randomID())
    }, [])


    useEffect(() => {
        if (id && !gpu) {
            const newGPU = document.getElementById(id + '-canvas').getContext('webgl2', {
                antialias: false,
                preserveDrawingBuffer: true
            })
            enableBasics(newGPU)
            setGpu(newGPU)
        } else if (gpu && !initialized && id) {

            initializeSkybox(dispatchEntities, gpu)
            initializeLight(dispatchEntities)

            if (initializePlane)
                initializeMesh(planeMesh, gpu, IDS.PLANE, 'Plane', dispatchEntities, setMeshes)
            if (initializeSphere)
                initializeMesh(sphereMesh, gpu, IDS.SPHERE, 'Sphere', dispatchEntities, setMeshes)

            renderer.current = new Engine(id, gpu)


            renderer.current.systems = [
                new TransformSystem(),
                new ShadowMapSystem(gpu),
                new DeferredSystem(gpu, 1),
                new PostProcessingSystem(gpu, 1)
            ]

            setInitialized(true)
            renderer.current.camera.radius = 2


            renderer.current?.prepareData({meshes, materials, shadingModel: SHADING_MODELS.DETAIL}, entities, materials, meshes)
        } else if (gpu && id) {

            resizeObserver = new ResizeObserver(() => {
                if (initialized)
                    renderer.current.camera.aspectRatio = gpu?.canvas.width / gpu?.canvas.height
            })
            resizeObserver.observe(document.getElementById(id + '-canvas'))

            renderer.current?.stop()
            renderer.current?.prepareData({meshes, materials, shadingModel: SHADING_MODELS.DETAIL}, entities, materials, meshes)

            if (!canRender)
                renderer.current?.stop()
            else
                renderer.current?.start(entities)
        }

        return () => {
            renderer.current?.stop()
        }
    }, [meshes, materials, entities, gpu, id, canRender])


    return {
        id, load,
        entities, dispatchEntities,
        meshes, setMeshes, gpu,
        materials, setMaterials,
        initialized,
        canRender, setCanRender
    }
}

function initializeSkybox(dispatch, gpu) {
    const newEntity = new Entity(undefined, 'sky')
    const sky = new SkyboxComponent(undefined, gpu)
    sky.hdrTexture = {blob: skybox, imageID: undefined, type: 'jpg'}
    dispatch({
        type: ENTITY_ACTIONS.ADD,
        payload: newEntity
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            entityID: newEntity.id,
            data: sky
        }
    })
}

function initializeLight(dispatch) {
    const newEntity = new Entity(undefined, 'light')
    const light = new DirectionalLightComponent()
    light.direction = [0, 100, 100]
    dispatch({
        type: ENTITY_ACTIONS.ADD,
        payload: newEntity
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            entityID: newEntity.id,
            data: light
        }
    })
}

export function initializeMesh(data, gpu, id, name, dispatch, setMeshes, noTranslation) {
    let mesh = new Mesh({
        ...data,
        id: randomID(),
        gpu: gpu,
        maxBoundingBox: data.boundingBoxMax,
        minBoundingBox: data.boundingBoxMin
    })
    setMeshes(prev => [...prev, mesh])

    const newEntity = new Entity(id, name)

    const transformation = new TransformComponent()
    transformation.scaling = data.scaling
    transformation.rotation = data.rotation
    if(!noTranslation)
        transformation.translation = data.translation

    dispatch({
        type: ENTITY_ACTIONS.ADD,
        payload: newEntity
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            data: new MeshComponent(undefined, mesh.id),
            entityID: newEntity.id
        }
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            data: new MaterialComponent(),
            entityID: newEntity.id
        }
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            data: transformation,
            entityID: newEntity.id
        }
    })


}

export const IDS = {
    SPHERE: 'SPHERE-0',
    PLANE: 'PLANE-0'
}