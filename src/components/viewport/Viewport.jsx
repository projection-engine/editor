import PropTypes from "prop-types";

import styles from './styles/Viewport.module.css'
import useDimensions from "./hooks/useDimensions";
import {useRef} from "react";

export default function Viewport(props) {
    const ref = useRef()
    useDimensions(
        props.id,
        props.engine)


    return (
        <div
            ref={ref}
            className={styles.viewport}
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
            }}>
            <canvas
                onContextMenu={e => e.preventDefault()}
                id={props.id + '-canvas'}
            />

        </div>
    )
}

Viewport.propTypes = {
    allowDrop: PropTypes.bool.isRequired,
    handleDrop: PropTypes.func,
    engine: PropTypes.object,
    id: PropTypes.string
}