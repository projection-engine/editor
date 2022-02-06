import Vector2D from "../workflows/algebra/Vector2D";
import Vector3D from "../workflows/algebra/Vector3D";
import Vector4D from "../workflows/algebra/Vector4D";
import AddVector from "../workflows/algebra/AddVector";
import SubtractVector from "../workflows/algebra/SubtractVector";
import VectorScalar from "../workflows/algebra/VectorScalar";
import CrossProduct from "../workflows/algebra/CrossProduct";
import DotProduct from "../workflows/algebra/DotProduct";

export const algebraAvailable=[
    {
        label: 'Vector 2D',
        dataTransfer: 'vec2',
        tooltip: 'Node for a 2D vector (x, y).',
        getNewInstance: () => new Vector2D()
    },
    {
        label: 'Vector 3D',
        dataTransfer: 'vec3',
        tooltip: 'Node for a 3D vector (x, y, z).',
        getNewInstance: () => new Vector3D()
    },
    {
        label: 'Vector 4D',
        dataTransfer: 'vec4',
        tooltip: 'Node for a 4D vector (x, y, z, w).',
        getNewInstance: () => new Vector4D()
    },
    {
        label: 'Vector addition',
        dataTransfer: 'add-vec',
        tooltip: 'Node for a 2D vector (x, y).',
        getNewInstance: () => new AddVector()
    },
    {
        label: 'Vector subtraction',
        dataTransfer: 'sub-vec',
        tooltip: 'Node for a 2D vector (x, y).',
        getNewInstance: () => new SubtractVector()
    },
    {
        label: 'Vector scalar multiplication',
        dataTransfer: 'scalar',
        tooltip: 'Node for a 2D vector (x, y).',
        getNewInstance: () => new VectorScalar()
    },
    {
        label: 'Vector cross product',
        dataTransfer: 'cross',
        tooltip: 'Node for a 2D vector (x, y).',
        getNewInstance: () => new CrossProduct()
    },
    {
        label: 'Vector dot product',
        dataTransfer: 'dot',
        tooltip: 'Node for a 2D vector (x, y).',
        getNewInstance: () => new DotProduct()
    },

]