import Node from "../../templates/Node";

export default class Vector4D extends Node {
    constructor() {
        super(
            [
                {label: 'x', key: 'x', accept: ['Constant']},
                {label: 'y', key: 'y'},
                {label: 'z', key: 'z'},
                {label: 'w', key: 'w'},
            ],
            [{label: 'vector', key: 'vector'}])

        this.x = 0
        this.y = 0
        this.z = 0
        this.w = 0
        this.vector = [this.x, this.y, this.z, this.w]
        this.name = 'Vector 4D'
    }
}