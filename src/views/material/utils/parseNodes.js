import Constant from "../workflows/basic/Constant";
import Material from "../workflows/material/Material";
import Vector2D from "../workflows/algebra/Vector2D";
import VectorScalar from "../workflows/algebra/VectorScalar";
import AddVector from "../workflows/algebra/AddVector";
import Vector4D from "../workflows/algebra/Vector4D";
import Vector3D from "../workflows/algebra/Vector3D";
import SubtractVector from "../workflows/algebra/SubtractVector";
import ObjectArray from "../templates/ObjectArray";
import CrossProduct from "../workflows/algebra/CrossProduct";
import Subtract from "../workflows/basic/Subtract";
import Add from "../workflows/basic/Add";
import Multiply from "../workflows/basic/Multiply";
import Divide from "../workflows/basic/Divide";
import DotProduct from "../workflows/algebra/DotProduct";

import Color from "../workflows/material/Color";
import Power from "../workflows/basic/Power";
import TextureSample from "../workflows/material/TextureSample";


export default function parseNodes(database, nodes, responseOBJ, workflow, callback, quickAccess) {

    const updatePlacement = (obj, node) => {

        node.x = obj.x
        node.y = obj.y

        node.id = obj.id
    }

    let parsedNodes = nodes === undefined || nodes === null || nodes.length === 0 ? [] : nodes.map(n => {

        switch (n.instanceOf) {
            case Constant.constructor.name: {
                const newClass = new Constant()
                newClass.value = n.values
                updatePlacement(n, newClass)
                return newClass
            }
            case Vector2D.constructor.name: {
                const newClass = new Vector2D()
// TODO
                updatePlacement(n, newClass)
                return newClass
            }
            case VectorScalar.constructor.name: {
                const newClass = new VectorScalar()
// TODO
                updatePlacement(n, newClass)
                return newClass
            }
            case AddVector.constructor.name: {
                const newClass = new AddVector()
// TODO

                updatePlacement(n, newClass)
                return newClass
            }
            case Vector4D.constructor.name: {
                const newClass = new Vector4D()
// TODO
                updatePlacement(n, newClass)
                return newClass
            }
            case Vector3D.constructor.name: {
                const newClass = new Vector3D()
                updatePlacement(n, newClass)
// TODO
                return newClass
            }
            case SubtractVector.constructor.name: {
                const newClass = new SubtractVector()
// TODO
                updatePlacement(n, newClass)
                return newClass
            }
            case ObjectArray.constructor.name: {
                const newClass = new ObjectArray()
// TODO
                updatePlacement(n, newClass)
                return newClass
            }
            case CrossProduct.constructor.name: {
                const newClass = new CrossProduct()
// TODO
                updatePlacement(n, newClass)
                return newClass
            }
            case Subtract.constructor.name: {
                const newClass = new Subtract()
                newClass.response = n.response
                newClass.constA = n.constA
                newClass.constB = n.constB
                updatePlacement(n, newClass)
                return newClass
            }
            case Add.constructor.name: {
                const newClass = new Add()
                newClass.response = n.response
                newClass.constA = n.constA
                newClass.constB = n.constB
                updatePlacement(n, newClass)
                return newClass
            }
            case Multiply.constructor.name: {
                const newClass = new Multiply()
                newClass.response = n.response
                newClass.constA = n.constA
                newClass.constB = n.constB
                updatePlacement(n, newClass)
                return newClass
            }
            case Divide.constructor.name: {
                const newClass = new Divide()
                newClass.response = n.response
                newClass.constA = n.constA
                newClass.constB = n.constB
                updatePlacement(n, newClass)
                return newClass
            }
            case DotProduct.constructor.name: {
                const newClass = new DotProduct()
// TODO
                updatePlacement(n, newClass)
                return newClass
            }

            case Color.constructor.name: {
                const newClass = new Color()
                newClass.rgb = n.rgb
                updatePlacement(n, newClass)
                return newClass
            }
            case Power.constructor.name: {
                const newClass = new Power()
                newClass.response = n.response
                newClass.constA = n.constA
                newClass.constB = n.constB
                updatePlacement(n, newClass)
                return newClass

            }

            case TextureSample.prototype.constructor.name: {

                const newClass = new TextureSample()
                console.log(n)
                newClass.sample = quickAccess.images.find(e => e.id === n.sample)
                newClass.name = n.name

                updatePlacement(n, newClass)
                return newClass
            }
            default:

                return n
        }
    })
    if(responseOBJ) {
        const newPBR = new Material()
        newPBR.id = responseOBJ.id
        newPBR.name = responseOBJ.name
        newPBR.x = responseOBJ.x
        newPBR.y = responseOBJ.y
        parsedNodes.push(newPBR)
    }
    callback(parsedNodes)
}
