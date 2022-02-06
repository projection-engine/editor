import React, {useEffect, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import styles from './styles/Context.module.css'
import {Button} from "@f-ui/core";

export default function ContextMenu(props) {
    const ref = useRef()
    const contextRef = useRef()
    const [selected, setSelected] = useState()

    let targets
    const handleContext = (event) => {
        targets = document.elementsFromPoint(event.clientX, event.clientY)
        targets = targets.filter(t => {
            let hasAttribute = false
            Array.from(t.attributes).forEach(attr => {
                const has = props.triggers.find(f => attr.nodeName === f)
                if (has)
                    hasAttribute = hasAttribute || has
            })

            if (hasAttribute)
                return t
        })
        event.preventDefault()

        if (targets.length > 0) {

            const currentTarget = targets[0]

            setSelected(currentTarget)
            if (props.onContext !== undefined)
                props.onContext(currentTarget)
        } else
            setSelected(undefined)


        contextRef.current.style.zIndex = '999'
        const bBox = contextRef.current?.getBoundingClientRect()
        if (event.clientX + bBox.width > document.body.offsetWidth)
            contextRef.current.style.left = (event.clientX - bBox.width) + 'px'
        else
            contextRef.current.style.left = event.clientX + 'px'

        if ((event.clientY + bBox.height ) > document.body.offsetHeight)
            contextRef.current.style.top = (event.clientY) + 'px'
        else
            contextRef.current.style.top = (event.clientY + bBox.height) + 'px'
    }
    const handleMouseDown = (event) => {
        if (!document.elementsFromPoint(event.clientX, event.clientY).includes(contextRef.current)) {
            if (props.onContextOut !== undefined)
                props.onContextOut(selected)
            setSelected(undefined)
            contextRef.current.style.zIndex = '-1'
        }
    }

    useEffect(() => {
        if (props.options.length > 0) {
            document.addEventListener('mousedown', handleMouseDown)
            ref.current?.parentNode.addEventListener('contextmenu', handleContext)
        }
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            ref.current?.parentNode.removeEventListener('contextmenu', handleContext)
        }
    }, [selected, props.options])


    const options = useMemo(() => {
        return props.options.filter(o => Array.from(selected ? selected.attributes : []).find(attr => attr.nodeName === o.requiredTrigger))
    }, [selected])
    return (
        <>
            <div className={styles.wrapper} ref={contextRef}>
                {options.map((el, i) => (
                    <React.Fragment key={'options-' + i}>
                        <Button
                            className={styles.basicButton}
                            color={'secondary'}
                            onClick={() => {
                                el.onClick(selected)
                                contextRef.current.style.zIndex = '-1'
                                if (selected)
                                    selected.style.outline = 'transparent 2px solid'
                                setSelected(undefined)
                            }}>
                            <div className={styles.basicIconWrapper}>
                                {el.icon}
                            </div>
                            {el.label}
                        </Button>
                    </React.Fragment>
                ))}
            </div>
            <div className={props.className} data-self={'true'} style={props.styles} ref={ref}>
                {props.children}
            </div>
        </>
    )
}

ContextMenu.propTypes = {
    onContext: PropTypes.func,
    onContextOut: PropTypes.func,

    triggers: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func,
        label: PropTypes.string,
        shortcut: PropTypes.any,
        icon: PropTypes.node,
        requiredTrigger: PropTypes.string
    })),


    children: PropTypes.node,
    styles: PropTypes.object,
    className: PropTypes.string
}
