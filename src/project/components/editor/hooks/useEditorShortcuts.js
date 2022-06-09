import useHotKeys from "../../../hooks/hot-keys/useHotKeys"
import GIZMOS from "../../../../static/misc/GIZMOS"
import {HISTORY_ACTIONS} from "../../../hooks/historyReducer"
import {ENTITY_ACTIONS} from "../../../engine/useEngineEssentials"
import cloneClass from "../../../engine/utils/cloneClass"
import {v4 as uuidv4} from "uuid"
import {useMemo, useState} from "react"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import TransformComponent from "../../../engine/components/TransformComponent"
import KEYS from "../../../engine/templates/KEYS"
import RENDER_TARGET from "../../../../static/misc/RENDER_TARGET"

export default function useEditorShortcuts({engine, setAlert, settings, id, executingAnimation, serializer, setExecutingAnimation}) {
    const [toCopy, setToCopy] = useState([])

    function copy(single) {
        setToCopy(single ? [engine.selected[0]] : engine.selected)
        setAlert({
            type: "info",
            message: `Entities copied (${engine.selected.length}).`
        })
    }
    function deleteSelected(){
        const s = [...engine.selected]
        engine.setSelected([])
        engine.setLockedEntity(undefined)
        engine.dispatchChanges({
            type: HISTORY_ACTIONS.DELETING_ENTITIES,
            payload: {entitiesToDelete: s, entities: engine.entities}
        })
        engine.dispatchEntities({
            type: ENTITY_ACTIONS.REMOVE_BLOCK,
            payload: s
        })
    }

    function invertSelection(){
        const newArr = []
        const notValid = {}
        for(let i in engine.selected){
            notValid[engine.selected[i]] = true
        }
        for(let i in engine.entities){
            const id =engine.entities[i].id
            if(!notValid[id])
                newArr.push(id)
        }
        engine.setSelected(newArr)
    }
    function paste() {
        let block = []
        toCopy.forEach((t) => {
            const found = engine.entities.find(e => e.id === t)
            if (found) {
                let clone = cloneClass(found)
                clone.id = uuidv4()
                clone.name = "_" + clone.name
                let newComponents = {}
                Object.keys(clone.components).forEach(c => {
                    if (c === COMPONENTS.TRANSFORM) {
                        newComponents[COMPONENTS.TRANSFORM] = new TransformComponent()
                        newComponents[COMPONENTS.TRANSFORM].rotation = [...clone.components[c].rotation]
                        newComponents[COMPONENTS.TRANSFORM].rotationQuat = [...clone.components[c].rotationQuat]
                        newComponents[COMPONENTS.TRANSFORM].translation = [...clone.components[c].translation]
                        newComponents[COMPONENTS.TRANSFORM].scaling = [...clone.components[c].scaling]
                        newComponents[COMPONENTS.TRANSFORM]._transformationMatrix = [...clone.components[c]._transformationMatrix]
                        newComponents[COMPONENTS.TRANSFORM].baseTransformationMatrix = clone.components[c].baseTransformationMatrix
                        newComponents[COMPONENTS.TRANSFORM].lockedRotation = clone.components[c].lockedRotation
                        newComponents[COMPONENTS.TRANSFORM].lockedScaling = clone.components[c].lockedScaling
                        newComponents[COMPONENTS.TRANSFORM].updateQuatOnEulerChange = clone.components.updateQuatOnEulerChange
                    } else {
                        const cClone = cloneClass(clone.components[c])
                        cClone.id = uuidv4()
                        newComponents[c] = cClone
                    }
                })
                delete clone.components
                clone.components = newComponents
                block.push(clone)
            }
        })


        engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: block})
        engine.setSelected(block.map(b => b.id))
        setAlert({
            type: "info",
            message: `Pasted ${toCopy.length} entities.`
        })
    }
    function group() {
        setToCopy(engine.selected)
        if (engine.selected.length > 1)
            engine.dispatchEntities({
                type: ENTITY_ACTIONS.LINK_MULTIPLE,
                payload: engine.selected
            })
    }

    const actions = useMemo(() => {
        return [
            {
                label: "Invert selection",
                require: [KEYS.ControlLeft, KEYS.KeyI],
                callback: invertSelection
            },
            {
                label: "Select all",
                require: [KEYS.KeyA],
                callback: () => engine.setSelected(engine.entities.filter(e => !e.isFolder).map(e => e.id))
            },
            {
                label: "Select",
                require: [KEYS.Mouse0]
            },
            {
                label: "Select Multiple",
                require: [KEYS.ControlLeft, KEYS.Mouse0]
            },
            {label: "Save", require: [KEYS.ControlLeft, KEYS.KeyS], callback: () => serializer.save()},
            {label: "Translate", require: [KEYS.KeyG], callback: () => settings.gizmo = GIZMOS.TRANSLATION},
            {label: "Scale", require: [KEYS.KeyS], callback: () => settings.gizmo = GIZMOS.SCALE},
            {label: "Rotate", require: [KEYS.KeyR], callback: () => settings.gizmo = GIZMOS.ROTATION},
            {
                disabled: engine.changes.length === 0,
                label: "Undo",
                require: [KEYS.ControlLeft, KEYS.KeyZ],
                callback: () => engine.returnChanges()
            },
            {
                disabled: engine.changes.length === 0,
                label: "Redo",
                require: [KEYS.ControlLeft, KEYS.KeyY],
                callback: () => engine.forwardChanges()
            },
            {
                label: "Group",
                disabled: engine.selected.length === 0,
                require: [KEYS.ControlLeft, KEYS.KeyP],
                callback: group
            },
            {label: "Fixate active",
                require: [KEYS.ControlLeft, KEYS.KeyF],
                callback: () => {
                    if(engine.selected[0])
                        engine.setLockedEntity(engine.selected[0])
                }
            },

            {label: "Copy",
                disabled: engine.selected.length === 0,
                require: [KEYS.ControlLeft, KEYS.KeyC],
                callback: copy
            },
            {label: "Fullscreen",
                require: [KEYS.ControlLeft, KEYS.ShiftLeft, KEYS.KeyF],
                callback: () => {
                    const el = document.getElementById("fullscreen-element-" + id)
                    if (el) {
                        if (!document.fullscreenElement)
                            el.requestFullscreen().catch(() => document.exitFullscreen())
                        else
                            document.exitFullscreen().catch()
                    }
                }
            },
            {
                label: "Toggle metrics",
                require: [KEYS.ControlLeft, KEYS.ShiftLeft, KEYS.KeyH],
                callback: () => settings.performanceMetrics = !settings.performanceMetrics
            },
            {
                label: "Delete",
                disabled: engine.selected.length === 0,
                require: [KEYS.Delete],
                callback:  deleteSelected
            },
            {
                label: "Paste",
                disabled: toCopy.length === 0,
                require: [KEYS.ControlLeft, KEYS.KeyV],
                callback: paste
            },
            {
                label: "Rotate camera",
                require: [KEYS.Mouse1]
            }
        ]
    }, [
        toCopy,
        engine.selected,
        engine.entities,
        settings.performanceMetrics,
        engine.changes
    ])


    useHotKeys({
        focusTargetLabel: "Viewport",
        focusTargetIcon: "window",
        focusTarget: RENDER_TARGET,
        disabled: executingAnimation === true,
        actions
    })

    return {
        toCopy,
        group,
        copy,
        paste,
        invertSelection,
        deleteSelected
    }
}