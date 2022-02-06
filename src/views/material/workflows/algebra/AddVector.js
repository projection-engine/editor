import Function from "../../templates/Function";
import {vec2, vec3, vec4} from "gl-matrix";


export default class AddVector extends Function {
    response

    constructor() {
        super([
            {label: 'Vector A', key: 'vecA', accept: ['Vector2D', 'Vector3D', 'Vector4D']},
            {label: 'Vector B', key: 'vecB', accept: ['Vector2D', 'Vector3D', 'Vector4D']}
        ]);
        this.vecA = []
        this.vecB = []
        this.name = 'Sum vectors'
    }

    execute() {
        switch (this.vecA.length) {
            case 2:
                vec2.add(this.response, this.vecA, this.vecB)
                break
            case 3:
                vec3.add(this.response, this.vecA, this.vecB)
                break
            case 4:
                vec4.add(this.response, this.vecA, this.vecB)
                break
            default:
                break
        }
    }
}