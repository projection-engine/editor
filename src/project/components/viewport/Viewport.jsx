import PropTypes from "prop-types"
import styles from "./styles/Viewport.module.css"
import React, {useContext, useEffect, useRef} from "react"
import GPUContextProvider from "./hooks/GPUContextProvider"
import useContextTarget from "../../../components/context/hooks/useContextTarget"
import RENDER_TARGET from "../../../static/misc/RENDER_TARGET"
import ViewportOptions from "./ViewportOptions"
import SideBar from "./components/SideBar"
import SYSTEMS from "../../engine/templates/SYSTEMS"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import PickSystem from "../../engine/systems/PickSystem"
import SelectBox from "../../../components/select-box/SelectBox"
import Conversion from "../../engine/utils/Conversion"

const TRIGGERS = ["data-viewport"]
const MAX_TIMESTAMP = 350, MAX_DELTA = 50
const WORKER = new Worker(new URL("./hooks/findEntities.js", import.meta.url))
export default function Viewport(props) {
    const ref = useRef()
    const {bindGPU, gpu} = useContext(GPUContextProvider)
    useEffect(() => bindGPU(ref.current), [])
    function pickIcon (entities, cameraMesh, pickSystem, camera, coords){
        return pickSystem.pickElement((shader, proj) => {
            for (let m = 0; m < entities.length; m++) {
                const currentInstance = entities[m]
                if (entities[m].active) {
                    let t = currentInstance.components[COMPONENTS.TRANSFORM]?.transformationMatrix
                    if(!t)
                        t = currentInstance.components[COMPONENTS.DIRECTIONAL_LIGHT]?.transformationMatrix
                    if (t && !currentInstance.components[COMPONENTS.MESH])
                        PickSystem.drawMesh(currentInstance.components[COMPONENTS.CAMERA] ? cameraMesh : pickSystem.mesh, currentInstance, camera.viewMatrix, proj, t, shader, props.engine.gpu)
                }
            }
        }, {x: coords[0], y: coords[1]}, camera)
    }
    function handler(event) {
        const deltaX = Math.abs(event.currentTarget.startedCoords.x - event.clientX)
        const deltaY = Math.abs(event.currentTarget.startedCoords.y - event.clientY)
        const elapsed = (performance.now() - event.currentTarget.started)

        if(gpu.canvas === event.target && elapsed <= MAX_TIMESTAMP && deltaX < MAX_DELTA && deltaY < MAX_DELTA) {
            const camera = props.engine.renderer.camera
            const entities = props.engine.entities
            const p = props.engine.renderer.systems[SYSTEMS.PICK]
            const cameraMesh = props.engine.renderer.editorSystem.billboardSystem.cameraMesh
            const meshSources = props.engine.renderer.data.meshSources
            const target = event.currentTarget.getBoundingClientRect()
            const coords = [event.clientX - target.left, event.clientY - target.top]

            let picked = pickIcon(entities, cameraMesh, p, camera, coords)
            if(!picked){
                picked = p.pickElement((shader, proj) => {
                    for (let m = 0; m < entities.length; m++) {
                        const currentInstance = entities[m]
                        if (entities[m].active) {
                            const t = currentInstance.components[COMPONENTS.TRANSFORM]?.transformationMatrix
                            if (t && currentInstance.components[COMPONENTS.MESH]) {
                                const mesh = meshSources[currentInstance.components[COMPONENTS.MESH]?.meshID]
                                if (mesh !== undefined) PickSystem.drawMesh(mesh, currentInstance, camera.viewMatrix, proj, t, shader, props.engine.gpu)
                            }
                        }
                    }
                }, {x: coords[0], y: coords[1]}, camera)
            }
            if (picked > 0) {
                const entity = entities.find(e => e.components[COMPONENTS.PICK]?.pickIndex === picked)

                if (entity) props.engine.setSelected(prev => {
                    const i = prev.findIndex(e => e === entity.id)
                    if (i > -1) {
                        prev.splice(i, 1)
                        return prev
                    }
                    if (event.ctrlKey) return [...prev, entity.id]
                    else return [entity.id]
                })
            } else
                props.engine.setSelected([])
     
        }
    }

    useContextTarget({id: "viewport-wrapper", label: "Viewport", icon: "window"}, props.options, TRIGGERS)
    return (
        <div className={styles.wrapper}>
            <ViewportOptions
                engine={props.engine}
                executingAnimation={props.executingAnimation}
                id={props.id}
            />
            <div
                onMouseDown={e => {
                    e.currentTarget.started = performance.now()
                    e.currentTarget.startedCoords = {x: e.clientX, y: e.clientY}
                }}
                onClick={handler}
                onDragOver={e => {
                    if (props.allowDrop) {
                        e.preventDefault()
                        ref.current?.classList.add(styles.hovered)
                    }
                }}
                onDragLeave={e => {
                    e.preventDefault()
                    ref.current?.classList.remove(styles.hovered)
                }}
                onDrop={e => {
                    if (props.allowDrop) {
                        e.preventDefault()
                        ref.current?.classList.remove(styles.hovered)
                        props.handleDrop(e)
                    }
                }}
   
                data-viewport={RENDER_TARGET}
                id={"viewport-wrapper"}
                className={styles.viewport}
            >
                <SelectBox
                    setSelected={(_, startCoords, endCoords) => {
                        if(startCoords && endCoords) {
                            const pickSystem = props.engine.renderer.systems[SYSTEMS.PICK]
                            const depthSystem = props.engine.renderer.systems[SYSTEMS.DEPTH_PRE_PASS]

                            const size = {
                                w: depthSystem.frameBuffer.width,
                                h: depthSystem.frameBuffer.height
                            }
                            const nStart = Conversion.toQuadCoord(startCoords, size, gpu.canvas)
                            const nEnd = Conversion.toQuadCoord(endCoords, size, gpu.canvas)

                            try{
                                const data = pickSystem.readBlock(depthSystem.frameBuffer, nStart, nEnd)
                                WORKER.postMessage({entities: props.engine.entities.map(e => e.pickerInfo()), data})
                                WORKER.onmessage = ({data: selected}) => props.engine.setSelected(selected)
                            }catch (err){
                                console.error(err, startCoords, nStart)
                            }
                        }
                    }}
                    target={RENDER_TARGET}
                    selected={[]}
                    nodes={[]}
                />
                <span style={{display: "none"}} ref={ref}/>
                <SideBar engine={props.engine}/>
            </div>
        </div>
    )
}

Viewport.propTypes = {
    options: PropTypes.array,
    allowDrop: PropTypes.bool.isRequired,
    handleDrop: PropTypes.func,
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object,
    id: PropTypes.string,
    resolutionMultiplier: PropTypes.number
}