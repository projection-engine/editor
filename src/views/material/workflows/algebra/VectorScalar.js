import Function from "../../templates/Function";
import {vec2, vec3, vec4} from "gl-matrix";


export default class VectorScalar extends Function {
    response

    constructor(vecA, scalar) {
        super([
            {label: 'Vector A', key: 'vecA', accept: ['Vector2D', 'Vector3D', 'Vector4D']},
            {label: 'Scalar', key: 'scalar', accept: ['Constant']}
        ]);
        this.vecA = vecA
        this.scalar = scalar
        this.name = 'Vector times scalar'
    }

    execute() {
        switch (this.vecA.length) {
            case 2:
                vec2.scale(this.response, this.vecA, this.scalar)
                break
            case 3:
                vec3.scale(this.response, this.vecA, this.scalar)
                break
            case 4:
                vec4.scale(this.response, this.vecA, this.scalar)
                break
            default:
                break
        }
    }
}