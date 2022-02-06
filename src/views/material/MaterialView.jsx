import Board from "./components/Board";
import usePrototype from "./hooks/usePrototype";
import NodeEditor from "./components/NodeEditor";
import Available from "./components/Available";
import styles from './styles/Board.module.css'

import {useContext, useEffect, useMemo, useRef} from "react";
import PropTypes from "prop-types";

import makePackage from "./utils/makePackage";
import ControlProvider from "../../components/tabs/components/ControlProvider";
import ResizableBar from "../../components/resizable/ResizableBar";
import MaterialClass from './workflows/material/Material'
import useVisualizer from "../mesh/hook/useVisualizer";

export default function MaterialView(props) {
    const hook = usePrototype(props.file)
    const ref = useRef()
    const fallbackSelected = useMemo(() => {
        return hook.nodes.find(n => n.constructor.name === MaterialClass.constructor.name)
    }, [hook.nodes])
    const engine = useVisualizer(true, true, true)

    const toolBarContext = useContext(ControlProvider)
    useEffect(() => {
        toolBarContext.setOptions([
            {
                label: 'Save',
                disabled: hook.disabled,
                icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save</span>,
                onClick: () => {
                    const m = hook.nodes.find(n => n instanceof MaterialClass)

                    props.submitPackage(m.albedo?.previewImage, makePackage(hook), false)
                }
            },
            {
                label: 'Save & close',
                disabled: hook.disabled,
                icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save_alt</span>,

                onClick: () => {
                    const m = hook.nodes.find(n => n instanceof MaterialClass)

                    props.submitPackage(m.albedo?.previewImage, makePackage(hook), true)
                }
            }
        ])
    }, [hook.nodes, hook.links])

    return (
        <div className={styles.prototypeWrapper} ref={ref}>
            <NodeEditor hook={hook}
                        engine={engine}
                        selected={!hook.selected && fallbackSelected ? fallbackSelected.id : hook.selected}/>
            <ResizableBar type={"width"}/>
            <div className={styles.prototypeWrapperBoard}>
                <Board
                    setAlert={props.setAlert}
                    parentRef={ref}
                    hook={hook}
                    selected={hook.selected}
                    setSelected={hook.setSelected}/>
            </div>
            <Available/>
        </div>
    )
}

MaterialView.propTypes = {
    setAlert: PropTypes.func.isRequired,
    file: PropTypes.object,
    submitPackage: PropTypes.func.isRequired,

}