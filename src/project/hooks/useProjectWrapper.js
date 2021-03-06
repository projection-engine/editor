import useEngine from "../engine-extension/useEngine"
import {useEffect, useRef} from "react"
import EVENTS from "../static/misc/EVENTS"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"
import MeshInstance from "../engine/instances/MeshInstance"
import {v4} from "uuid"
import CHANNELS from "../../../public/static/CHANNELS"
import parseMaterialObject from "../utils/parseMaterialObject"
import parseEntityObject from "../utils/parseEntityObject"

const {ipcRenderer} = window.require("electron")
export default function useProjectWrapper(id, settings, pushSettingsBlock, load) {

    const engine = useEngine(settings)
    const initialized = useRef(false)


    async function loadMetadata(event, response) {
        if (response.settings && response.settings.data)
            pushSettingsBlock({...response.settings.data, INITIALIZED: true})
        try {
            const entitiesToParse = response.entities, entities = []
            for(let i =0; i< entitiesToParse.length; i++){
                if(!entitiesToParse[i]?.data)
                    continue
                entities.push(await parseEntityObject(entitiesToParse[i].data))
            }
            engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: entities})
        } catch (err) {
            console.error(err)
        }
        load.finishEvent(EVENTS.PROJECT_DATA)
    }

    useEffect(() => {
        load.pushEvent(EVENTS.PROJECT_DATA)
        if (engine.viewportInitialized && !initialized.current) {
            initialized.current = true
            const listenID = v4()
            ipcRenderer.once(CHANNELS.META_DATA + "-" + listenID, loadMetadata)
            ipcRenderer.on(
                CHANNELS.MESH + "-" + listenID,
                (_, response) => engine.dispatchMeshes([new MeshInstance(response)])
            )
            ipcRenderer.on(CHANNELS.MATERIAL + "-" + listenID, (event, response) => {
                parseMaterialObject(response.result, response.id)
                    .then(mat => engine.setMaterials(prev => {
                        return [...prev, mat]
                    }))
            })
            ipcRenderer.on(CHANNELS.CLEAN_UP + "-" + listenID, () => window.fileSystem.refresh())
            ipcRenderer.send(CHANNELS.SEND, {projectPath: window.fileSystem.path, projectID: id, listenID})
        }
    }, [engine.viewportInitialized])


    return engine
}