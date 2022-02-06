import Node from "../../templates/Node";

export default class Vector2D extends Node {
    constructor() {
        super(
            [
                {label: 'x', key: 'x'},
                {label: 'y', key: 'y'}
            ],
            [{label: 'vector', key: 'vector'}])

        this.x = 0
        this.y = 0
        this.vector = [this.x, this.y]

        this.name = 'Vector 2D'
    }
}