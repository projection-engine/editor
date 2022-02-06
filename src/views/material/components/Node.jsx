import PropTypes from "prop-types";
import styles from '../styles/Node.module.css'
import {ToolTip} from "@f-ui/core";
import checkType from "../utils/checkType";
import useNode from "../hooks/useNode";

export default function Node(props) {
    const  {
        selected,
        ref,
        handleDragStart,
        handleLinkDrag,
        height,
        pathRef,
        outputLinks,
        inputLinks
    } = useNode(props)

    return (
        <g>
            <g
                ref={ref}
                transform={`translate(${props.node.x} ${props.node.y})`}
            >
                <foreignObject
                    data-node={props.node.id}
                    id={props.node.id}

                    className={styles.wrapper}
                    onClick={() => {
                        props.setSelected(props.node.id)
                    }}
                    style={{
                        width: '250px',
                        height: height + 'px',
                        outline: selected ? 'var(--fabric-accent-color) 2px solid' : undefined
                    }}>
                    <div className={styles.label}
                         onMouseDown={ev => handleDragStart(ev, props.node, props.handleChange)}>
                        <div className={'material-icons-round'}
                             style={{fontSize: '1.2rem'}}>drag_indicator
                        </div>
                        {props.node.name}
                    </div>
                    <div className={styles.content}>
                        <div className={styles.column}>
                            {props.node.inputs.map(a => (
                                <div className={styles.attribute} key={a.key}>
                                    <ToolTip content={'Input: ' + a.label} align={'middle'} justify={'end'}/>
                                    <div
                                        id={props.node.id + a.key}
                                        className={styles.connection}
                                        draggable={true}
                                        onDragOver={e => {
                                            e.preventDefault()
                                            e.currentTarget.style.background = 'var(--fabric-accent-color)'
                                        }}
                                        style={{background: inputLinks.includes(a.key) ? 'var(--fabric-accent-color' : undefined}}
                                        onDrop={e => {
                                            e.preventDefault()
                                            const data = JSON.parse(e.dataTransfer.getData('text'))
                                            e.currentTarget.style.background = 'var(--background-1)'
                                            const isValidType = checkType(data.instanceOf, a.accept)
                                            if (data.type === 'output' && isValidType)
                                                props.handleLink(data, {
                                                    attribute: a,
                                                    id: props.node.id
                                                })
                                            else if (data.type !== 'output')
                                                props.setAlert({
                                                    type: 'error',
                                                    message: 'Can\'t link input with input.'
                                                })
                                            else
                                                props.setAlert({
                                                    type: 'error',
                                                    message: 'Invalid type'
                                                })
                                        }}
                                        onDragEnd={() => {
                                            pathRef.current.setAttribute('d', undefined)
                                        }}
                                        onDragLeave={e => {
                                            e.preventDefault()
                                            e.currentTarget.style.background = 'var(--background-1)'
                                        }}
                                        onDrag={handleLinkDrag}
                                        onDragStart={e => e.dataTransfer.setData('text', JSON.stringify({
                                            id: props.node.id,
                                            type: 'input',
                                            attribute: a
                                        }))}/>
                                    <div className={styles.overflow} style={{fontWeight: 'normal'}}>
                                        {a.label}
                                    </div>
                                </div>
                            ))}
                            {props.node.showcase !== undefined ? props.node.showcase() : null}
                        </div>
                        <div className={styles.column} style={{justifyContent: 'flex-end'}}>
                            {props.node.output.map(a => (
                                <div className={styles.attribute} style={{justifyContent: 'flex-end'}} key={a.key}>
                                    <ToolTip
                                        content={JSON.stringify(props.node.constructor.name === 'Constant' ? props.node.value : props.node.response)}
                                        align={'middle'} justify={'start'}/>
                                    <div className={styles.overflow}>
                                        {a.label}
                                    </div>
                                    <div
                                        id={props.node.id + a.key}
                                        style={{background: outputLinks.includes(a.key) ? 'var(--fabric-accent-color' : undefined}}
                                        className={styles.connection}
                                        draggable={true}
                                        onDrop={() => {
                                            props.setAlert({
                                                type: 'error',
                                                message: 'Can\'t link with output.'
                                            })
                                        }}
                                        onDragLeave={e => {
                                            e.preventDefault()
                                            e.currentTarget.style.background = 'var(--background-1)'
                                        }}
                                        onDragEnd={() => {
                                            pathRef.current.setAttribute('d', undefined)
                                        }}
                                        onDrag={handleLinkDrag}
                                        onDragStart={e => e.dataTransfer.setData('text', JSON.stringify({
                                            id: props.node.id,
                                            type: 'output',
                                            attribute: a,
                                            instanceOf: props.node.constructor.name
                                        }))}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </foreignObject>
            </g>
            <path
                ref={pathRef}
                fill={'none'}
                stroke={'var(--fabric-accent-color)'}
                strokeWidth={'2'}
                strokeDasharray={'3,3'}/>
        </g>
    )
}
Node.propTypes = {
    links: PropTypes.array,
    setAlert: PropTypes.func,
    node: PropTypes.object.isRequired,
    scale: PropTypes.number,
    handleLink: PropTypes.func,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
}