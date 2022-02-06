import Node from "../../templates/Node";

export default class Vector3D extends Node {
    constructor() {
        super(
            [
                {label: 'x', key: 'x'},
                {label: 'y', key: 'y'},
                {label: 'z', key: 'z'}
            ],
            [{label: 'vector', key: 'vector'}])

        this.x = 0
        this.y = 0
        this.z = 0
        this.vector = [this.x, this.y, this.z]
        this.name = 'Vector 3D'
    }
}