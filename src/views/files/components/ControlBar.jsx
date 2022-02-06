import PropTypes from "prop-types";
import styles from '../styles/Control.module.css'
import {Button} from "@f-ui/core";
import React, {useContext, useRef} from "react";
import handleImportFile, {handleImportFolder} from "../utils/import/handleImportFile";
import EVENTS from "../../editor/utils/misc/EVENTS";
import LoadProvider from "../../editor/hook/LoadProvider";
import Search from "../../../components/search/Search";


export default function ControlBar(props) {
    const fileRef = useRef()
    const folderRef = useRef()
    const load = useContext(LoadProvider)

    return (
        <>
            <input
                type={'file'}
                ref={fileRef}
                accept={['.obj', '.png', '.jpeg', '.jpg', '.hdr', '.gltf', '.glt', '.bin', '.material']}
                multiple={true}
                onChange={e => {
                    load.pushEvent(EVENTS.IMPORT_FILE)
                    handleImportFile(Array.from(e.target.files), props.hook)
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />
            <input
                type={'file'}
                ref={folderRef}
                accept={['.obj', '.png', '.jpeg', '.jpg', '.hdr', '.gltf', '.glt', '.bin', '.material']}

                directory=""
                webkitdirectory=""
                multiple={true}
                onChange={e => {
                    load.pushEvent(EVENTS.IMPORT_FILE)
                    handleImportFolder(Array.from(e.target.files), props.hook)
                    e.target.value = "";
                }}
                style={{display: 'none'}}
            />


            <div style={{display: 'flex', alignItems: 'center', gap: '4px', width: '100%'}}>
                <Button className={styles.settingsButton} onClick={() => props.setVisualizationType(0)} highlight={props.visualizationType === 0}>
                    <span className={'material-icons-round'}>grid_view</span>
                </Button>
                <Button className={styles.settingsButton} onClick={() => props.setVisualizationType(1)} highlight={props.visualizationType === 1}>

                    <span className={'material-icons-round'}>view_comfy</span>
                </Button>
                <Button className={styles.settingsButton} onClick={() => props.setVisualizationType(2)} highlight={props.visualizationType === 2}>
                    <span className={'material-icons-round'}>view_list</span>
                </Button>
                <Search searchString={props.searchString} setSearchString={props.setSearchString}/>
                {props.path.map((p, i) => (
                    <React.Fragment key={p.id}>
                        <Button className={styles.button}
                                styles={{fontWeight: props.hook.currentDirectory === p.id ? 600 : undefined}}
                                highlight={props.hook.currentDirectory === p.id}
                                onClick={() => props.hook.setCurrentDirectory(p.id)}>
                            {p.name}
                        </Button>
                        {i < props.path.length - 1 ?
                            <span className={'material-icons-round'}>chevron_right</span> : null}
                    </React.Fragment>
                ))}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                <Button onClick={() => fileRef.current.click()} className={styles.button}
                        variant={'minimal-horizontal'}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>description</span>
                    Import file
                </Button>
                <Button onClick={() => folderRef.current.click()} className={styles.button}
                        variant={'minimal-horizontal'}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>folder</span>
                    Import folder
                </Button>
            </div>
        </>
    )
}

ControlBar.propTypes = {
    visualizationType: PropTypes.number,
    setVisualizationType: PropTypes.func,


    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    path: PropTypes.arrayOf(PropTypes.object),

    hook: PropTypes.object.isRequired,
    accept: PropTypes.array,
    label: PropTypes.string,
    setHidden: PropTypes.func,
    hidden: PropTypes.bool
}
