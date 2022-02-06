import PropTypes from "prop-types";
import styles from '../../styles/ListItem.module.css'
import React, {useMemo} from "react";
import getIcon from "../../utils/visuals/getIcon";
import Folder from "../../templates/Folder";
import useItem from "../../hooks/useItem";
import ItemTooltip from "../ItemTooltip";

export default function ListItem(props) {

    const icon = useMemo(() => {
        return getIcon(props.data.type ? props.data.type : props.type, props.data, styles.icon, styles.imageWrapper)
    }, [props.data])

    const {
        ref,
        currentlyOnRename,
        currentLabel,
        setCurrentLabel
    } = useItem(props)

    return (
        <div
            ref={ref}
            onDragStart={e => e.dataTransfer.setData('text', props.data.id)}
            draggable={!currentlyOnRename}
            data-focused={`${props.focusedElement === props.data.id}`}
            className={styles.wrapper}
        >
            {icon}
            {currentlyOnRename ?
                <input
                    className={styles.input}
                    onKeyPress={key => {
                        if (key.code === 'Enter')
                            props.submitRename(currentLabel)
                    }}
                    onBlur={() => {
                        props.submitRename(currentLabel)
                    }}
                    onChange={e => setCurrentLabel(e.target.value)}
                    value={currentLabel}
                />
                :
                <div className={styles.labels}>
                    <div className={styles.label}>
                        {props.data.name}
                    </div>
                    <div className={styles.label}>
                        {props.type === 'Folder' ? 'Folder' : props.data.type}
                    </div>
                    <div className={styles.label}>
                        {props.data.size}
                    </div>
                    <div className={styles.label}>
                        {new Date(props.data.creationDate).toLocaleDateString()}
                    </div>
                </div>
            }
            <ItemTooltip data={props.data} currentLabel={currentLabel} type={props.type}/>
        </div>
    )
}

ListItem.propTypes = {

    setFocusedElement: PropTypes.func,
    focusedElement: PropTypes.string,
    type: PropTypes.oneOf(['File', 'Folder']),
    data: PropTypes.object,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object,
    onRename: PropTypes.string,
    submitRename: PropTypes.func
}
