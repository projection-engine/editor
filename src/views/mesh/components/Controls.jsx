import PropTypes from "prop-types";
import styles from '../styles/Mesh.module.css'
import {Accordion, AccordionSummary, AlertProvider} from "@f-ui/core";

import {useContext, useMemo} from "react";

import QuickAccessProvider from "../../../services/hooks/QuickAccessProvider";
import MaterialComponent from "../../scene/forms/MaterialComponent";
import importMaterial from "../../../services/utils/importMaterial";
import {IDS} from "../../../services/hooks/useVisualizer";
import MeshComponent from "../../scene/forms/MeshComponent";
import {ENTITY_ACTIONS} from "../../../services/engine/utils/entityReducer";
import TransformComponent from "../../scene/forms/TransformComponent";
import Transformation from "../../../services/engine/utils/Transformation";

export default function Controls(props) {
    const quickAccess = useContext(QuickAccessProvider)
    const alert = useContext(AlertProvider)
    const selected = useMemo(() => {
        return props.engine.entities.find(e => e.id === IDS.TARGET)
    }, [props.engine.entities])

    if (props.engine.initialized && selected)
        return (
            <div className={styles.controlsWrapper}>
                <MeshComponent
                    quickAccess={quickAccess}
                    load={props.load} setAlert={({message, type}) => alert.pushAlert(message, type)}
                    submit={(mesh) => {
                        selected.components.MeshComponent.meshID = mesh
                        props.engine.dispatchEntities({
                            type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                entityID:  selected.id,
                                data: selected.components.MeshComponent,
                                key: 'MeshComponent'
                            }
                        })
                    }}
                    engine={props.engine}
                    selected={selected.components.MeshComponent.meshID}
                />

                <MaterialComponent
                    quickAccess={quickAccess}
                    meshes={props.engine.meshes}
                    meshID={selected.components.MeshComponent.meshID}
                    submit={(mat) => {
                        importMaterial(mat, props.engine, props.load,selected.components.MeshComponent.meshID)
                    }}
                    setAlert={({message, type}) => alert.pushAlert(message, type)}
                />
                <TransformComponent
                    selected={selected.components.TransformComponent}
                    submitRotation={(axis, data) => Transformation.updateTransform(axis, data, 'rotation',  props.engine, IDS.TARGET)}
                    submitScaling={(axis, data) => Transformation.updateTransform(axis, data, 'scaling',  props.engine, IDS.TARGET)}
                    submitTranslation={(axis, data) => Transformation.updateTransform(axis, data, 'translation',  props.engine, IDS.TARGET)}
                />
                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        Collision
                    </AccordionSummary>
                </Accordion>
                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        Physics body
                    </AccordionSummary>
                </Accordion>


                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        LOD
                    </AccordionSummary>
                </Accordion>
                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        LOD 0
                    </AccordionSummary>
                </Accordion>
                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        LOD 1
                    </AccordionSummary>
                </Accordion>

                <Accordion>
                    <AccordionSummary className={styles.summary}>
                        LOD 2
                    </AccordionSummary>
                </Accordion>
            </div>
        )
    else
        return (
            <div className={styles.controlsWrapper}/>
        )
}

Controls.propTypes = {
    engine: PropTypes.object.isRequired,
    load: PropTypes.object.isRequired
}