import PropTypes from "prop-types";
import React, {useEffect, useRef, useState} from "react";
import styles from './styles/Tree.module.css'
import TreeNode from "./TreeNode";
import ContextMenu from "../context/ContextMenu";

export default function TreeView(props) {
    const [focusedNode, setFocusedNode] = useState()
    const ref = useRef()
    const handleMouseDown = (ev) => {
        if (focusedNode && !document.elementsFromPoint(ev.clientX, ev.clientY).includes(ref.current)) {
            setFocusedNode(undefined)
        }
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown)
        return () => document.removeEventListener('mousedown', handleMouseDown)
    }, [focusedNode])
    const content = (
        props.nodes.map((child, index) => (
                <React.Fragment key={'tree-' + index}>
                    <TreeNode
                        onDragOver={(e) => {
                            if(props.draggable) {
                                e.preventDefault()
                                e.currentTarget.classList.add(styles.hoveredNode)
                            }
                            if (props.onDragOver)
                                props.onDragOver(e, e.currentTarget.id)
                        }}
                        onDragLeave={(e) => {
                            if(props.draggable) {
                                e.preventDefault()
                                e.currentTarget.classList.remove(styles.hoveredNode)
                            }
                            if (props.onDragLeave)
                                props.onDragLeave(e, e.currentTarget.id)
                        }}
                        onDrop={(e) => {
                            if(props.draggable) {
                                e.preventDefault()
                                e.currentTarget.classList.remove(styles.hoveredNode)
                            }
                            if (props.onDrop)
                                props.onDrop(e, e.currentTarget.id)
                        }}
                        onDragStart={(e) => {
                            e.dataTransfer.setData('text', e.currentTarget.id)
                        }}
                        draggable={props.draggable}

                        handleRename={props.handleRename}
                        node={child} index={0}
                        selected={props.selected}
                        focusedNode={focusedNode}
                        setFocusedNode={setFocusedNode}

                    />
                </React.Fragment>
            ))
    )
    return (
        <div className={styles.wrapper}>
            {props.options && props.options.length > 0 ?
                <ContextMenu
                    options={props.options}
                    triggers={[
                        'data-node'
                    ]}>
                    {content}
                </ContextMenu>
                :
                content
            }
        </div>
    )
}

TreeView.propTypes = {
    selected: PropTypes.string,
    nodes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any.isRequired,
        label: PropTypes.string,
        onClick: PropTypes.func,
        children: PropTypes.array,
        icon: PropTypes.node,
        type: PropTypes.string,
        attributes: PropTypes.object,
        phantomNode: PropTypes.bool
    })).isRequired,
    handleRename: PropTypes.func.isRequired,

    draggable: PropTypes.bool,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,

    options: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func,
        label: PropTypes.string,
        shortcut: PropTypes.any,
        icon: PropTypes.node,
        requiredTrigger: PropTypes.string
    })),
}