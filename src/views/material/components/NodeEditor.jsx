import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import styles from '../styles/NodeEditor.module.css'
import PropTypes from "prop-types";
import Material from "../workflows/material/Material";
import ResizableBar from "../../../components/resizable/ResizableBar";

import {Accordion, AccordionSummary, Button, TextField, ToolTip} from "@f-ui/core";
import Range from "../../../components/range/Range";
import Selector from "../../../components/selector/Selector";
import Viewport from "../../../components/viewport/Viewport";
import {IDS} from "../../mesh/hook/useVisualizer";
import cloneClass from "../../editor/utils/misc/cloneClass";
import ColorPicker from "../../../components/color/ColorPicker";
import updateViewport from "../utils/updateViewport";
import LoadProvider from "../../editor/hook/LoadProvider";
import EVENTS from "../../editor/utils/misc/EVENTS";
import DatabaseProvider from "../../../components/db/DatabaseProvider";
import MaterialInstance from "../../../services/engine/renderer/elements/MaterialInstance";

import Texture from "../../../services/engine/renderer/elements/Texture";
import {ENTITY_ACTIONS} from "../../../services/engine/ecs/utils/entityReducer";
import MaterialComponent from "../../../services/engine/ecs/components/MaterialComponent";

const MAT_ID = 'MAT-0'
export default function NodeEditor(props) {
    const [referenceMaterial, setReferenceMaterial] = useState(undefined)
    const selected = useMemo(() => {
        const index = props.hook.nodes.findIndex(n => (props.selected ? n.id === props.selected : n instanceof Material))
        if (index > -1)
            return props.hook.nodes[index]
        else
            return undefined
    }, [props.selected, props.hook.nodes])


    const attributes = useMemo(() => {
        let res = []
        if (selected) {

            res = [...selected.output.filter(o => !o.notEditable)]


            res = [{
                key: 'name',
                value: selected.name,
                type: 'String',
                label: 'Node name'
            }].concat(res)
        }
        return res
    }, [selected])


    const getInput = (label, type, value, submit) => {
        switch (type) {
            case 'Constant':
                return (
                    <Range value={value} handleChange={submit} label={label}/>
                )
            case 'Color':
                return <ColorPicker submit={submit} value={value} label={'Color'}/>
            case 'Image':
                return <Selector
                    type={'image'}
                    handleChange={ev => {

                        submit({
                            name: ev.name,
                            id: ev.id,
                            previewImage: ev.previewImage
                        })
                    }}
                    selected={props.hook.quickAccess.images.find(e => e.id === value?.id)}/>
            case 'String':
                return <TextField
                    value={value} width={'100%'} size={'small'}
                    handleChange={ev => submit(ev.target.value)} label={label} placeholder={label}/>

            default:
                return
        }

    }
    const load = useContext(LoadProvider)
    const database = useContext(DatabaseProvider)
    const [initiated, setInitiated] = useState(false)
    const updateTexture = () => {
        const sphere = props.engine.entities.find(e => e.id === IDS.SPHERE)
        if (sphere) {
            load.pushEvent(EVENTS.LOADING_MATERIAL)
            updateViewport(database, props.hook.nodes.find(e => e instanceof Material))
                .then(res => {
                    let mat = props.engine.materials.find(m => m.id === MAT_ID)
                    const gpu = props.engine.gpu
                    if (!mat) {
                        mat = new MaterialInstance(
                            gpu,
                            MAT_ID,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined
                        )
                        props.engine.setMaterials([mat])
                    }

                    res.forEach(r => {
                        console.log(referenceMaterial)
                        if (r.data) {
                            if (r.type === 'albedo')
                                mat[r.type] = new Texture(r.data, false, gpu)
                            else
                                mat[r.type] = new Texture(r.data, false, gpu, gpu.RGB, gpu.RGB)
                        } else if (referenceMaterial[r.type]) {
                            mat[r.type] = referenceMaterial[r.type]
                        }
                    })

                    sphere.components.MaterialComponent.materialID = mat.id
                    props.engine.dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                        payload: {
                            entityID: sphere.id,
                            key: MaterialComponent.prototype.constructor.name,
                            data: sphere.components.MaterialComponent
                        }
                    })
                    setInitiated(true)
                    load.finishEvent(EVENTS.LOADING_MATERIAL)
                })
        }
    }

    useEffect(() => {
        if (props.engine.gpu && !initiated && referenceMaterial) {
            updateTexture()
        }
        if (!referenceMaterial && props.engine.gpu){
            console.trace(referenceMaterial)
            setReferenceMaterial(new MaterialInstance(
                props.engine.gpu,
            ))
        }
    }, [props.engine.gpu, props.engine.entities, referenceMaterial])

    const viewportRef = useRef()
    return (
        <div className={styles.wrapper}>
            <div ref={viewportRef}
                 style={{width: '100%', height: '200px', overflow: 'hidden', position: 'relative'}}>
                <Viewport allowDrop={false} id={props.engine.id} engine={props.engine}/>
                <Button
                    className={styles.refresh}
                    styles={{bottom: 'unset', top: '4px', right: 'unset', left: '4px'}}
                    onClick={() => {
                        viewportRef.current.requestFullscreen()

                    }}
                >
                    <ToolTip content={'Fullscreen'}/>
                    <span
                        className={'material-icons-round'}
                        style={{fontSize: '1.1rem'}}
                    >fullscreen</span>
                </Button>
                <Button
                    className={styles.refresh}
                    onClick={() => {
                        updateTexture()
                    }}
                >
                    <ToolTip content={'Refresh viewport'}/>
                    <span
                        className={'material-icons-round'}
                        style={{fontSize: '1.1rem'}}
                    >refresh</span>
                </Button>
            </div>
            <ResizableBar type={'height'}/>
            <div className={styles.form}>
                {attributes.map((attr, i) => (
                    <React.Fragment key={attr.label + '-attribute-' + i}>
                        <Accordion>
                            <AccordionSummary>
                                {attr.label}
                            </AccordionSummary>
                            <div className={styles.content}>
                                {getInput(
                                    attr.label,
                                    attr.type,
                                    selected[attr.key],
                                    (event) => props.hook.setNodes(prev => {
                                        const n = [...prev]
                                        const classLocation = n.findIndex(e => e.id === selected.id)
                                        const clone = cloneClass(prev[classLocation])
                                        clone[attr.key] = event

                                        n[classLocation] = clone
                                        return n
                                    }))}
                            </div>
                        </Accordion>

                    </React.Fragment>
                ))}
            </div>
            <ResizableBar type={'width'}/>
        </div>
    )
}

NodeEditor.propTypes = {
    engine: PropTypes.object.isRequired,
    workflow: PropTypes.oneOf(['material']),
    selected: PropTypes.string,
    hook: PropTypes.object
}