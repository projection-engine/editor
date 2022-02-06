import Node from '../../templates/Node'

export default class Color extends Node {
    rgb = 'rgb(0,0,0)'

    constructor() {
        super(undefined, [
            {label: 'rgb', key: 'rgb', type: 'Color'}
        ]);
        this.name = 'Color'
    }
    showcase() {
        return (
            <div style={{
                border: 'var(--fabric-border-primary) 2px solid',
                backgroundColor: this.rgb,
                height: '175px',
                width: '175px',
                borderRadius: '5px'
            }}/>
        )
    }
}