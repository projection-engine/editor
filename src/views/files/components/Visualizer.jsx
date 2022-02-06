import PropTypes from "prop-types";
import {Modal} from "@f-ui/core";
import {useEffect, useState} from "react";
import styles from '../styles/Visualizer.module.css'

export default function Visualizer(props) {
    const [file, setFile] = useState()
    const getContent = () => {
        switch (file.type) {
            case 'jpeg':
            case 'png':
                return <img src={file.blob} className={styles.image} alt={file.name}/>

            default:
                return(
                    <div style={{fontSize: '.7rem'}}>
                        {file.blob}
                    </div>
                )
        }
    }
    useEffect(() => {
        if (props.selected)
            props.hook.getFile(props.selected).then(res => {
                setFile(res)

            })
    }, [props.selected])
    return (
        <Modal
            open={props.selected !== undefined}
            handleClose={() => {
                props.setSelected(undefined)
                setFile(undefined)
            }} className={styles.wrapper}>
            {file ?
                <div className={styles.content}>
                    <div className={styles.titleWrapper} >
                        <h1 className={styles.title}>
                            {file.name}
                        </h1>
                        <h2 className={styles.typeTitle}>
                            {file.type} | {file.creationDate}
                        </h2>
                    </div>
                    <div className={styles.contentWrapper}>
                        {getContent()}
                    </div>
                </div>
                :
                null
            }
        </Modal>
    )
}
Visualizer.propTypes = {

    selected: PropTypes.string,
    setSelected: PropTypes.func,
    hook: PropTypes.object
}