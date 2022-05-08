import {vec4} from "gl-matrix";
import Entity from "../../engine/basic/Entity";
import TransformComponent from "../../engine/components/TransformComponent";
import MeshInstance from "../../engine/instances/MeshInstance";
import Transformation from "../../engine/instances/Transformation";
import PickComponent from "../../engine/components/PickComponent";
import COMPONENTS from "../../engine/templates/COMPONENTS";
import arrow from '../assets/Arrow.json'
import ROTATION_TYPES from "./ROTATION_TYPES";
import TranslateScaleGizmo from "./TranslateScaleGizmo";

export default class TranslationGizmo extends TranslateScaleGizmo {
    target = []
    clickedAxis = -1
    tracking = false
    rotationTarget = [0, 0, 0, 1]
    currentCoord = undefined
    firstPick = true
    gridSize = .01
    distanceX = 0
    distanceY = 0
    distanceZ = 0

    constructor(gpu, gizmoShader, renderTarget) {
        super(gpu, gizmoShader, renderTarget);
        this.xGizmo = this._mapEntity(2, 'x')
        this.yGizmo = this._mapEntity(3, 'y')
        this.zGizmo = this._mapEntity(4, 'z')
        this.xyz = new MeshInstance({
            gpu,
            vertices: arrow.vertices,
            indices: arrow.indices,
            normals: arrow.normals,
            uvs: [],
            tangents: []
        })
    }

    _mapEntity(i, axis) {
        const e = new Entity(undefined)
        e.components[COMPONENTS.PICK] = new PickComponent(undefined, i - 3)
        e.components[COMPONENTS.TRANSFORM] = new TransformComponent()

        let s, t = [0, 0, 0], r
        switch (axis) {
            case 'x':
                s = [.75, 0.05, 0.05]
                r = [0, 0, 0]
                break
            case 'y':
                s = [.75, 0.05, 0.05]
                r = [0, 0, 1.57]
                break
            case 'z':
                s = [.75, 0.05, 0.05]
                r = [3.141592653589793, -1.57, 3.141592653589793]
                break
            case 'c':
                s = [.1, .1, .1]
                r = [0, 0, 0]
                break
            default:
                break
        }
        e.components[COMPONENTS.TRANSFORM].translation = t
        e.components[COMPONENTS.TRANSFORM].rotation = r
        e.components[COMPONENTS.TRANSFORM].scaling = s
        e.components[COMPONENTS.TRANSFORM].transformationMatrix = Transformation.transform(t, e.components[COMPONENTS.TRANSFORM].rotationQuat, s)
        return e
    }

    onMouseMove(event) {
        if (!this.started) {
            this.started = true
            if (this.onGizmoStart)
                this.onGizmoStart()
            this.renderTarget.start()
        }
        const vector = [event.movementX, event.movementX, event.movementX]

        switch (this.clickedAxis) {
            case 1: // x
                this.distanceX += Math.abs(vector[0] * 0.1)
                if (Math.abs(this.distanceX) >= this.gridSize) {
                    this.transformElement([Math.sign(vector[0]) * this.distanceX, 0, 0])
                    this.distanceX = 0
                }
                break
            case 2: // y
                this.distanceY += Math.abs(vector[1] * 0.1)
                if (Math.abs(this.distanceY) >= this.gridSize) {
                    this.transformElement([0, Math.sign(vector[1]) * this.distanceY, 0])
                    this.distanceY = 0
                }
                break
            case 3: // z
                this.distanceZ += Math.abs(vector[2] * 0.1)
                if (Math.abs(this.distanceZ) >= this.gridSize) {
                    this.transformElement([0, 0, Math.sign(vector[2]) * this.distanceZ])
                    this.distanceZ = 0
                }
                break
        }

        if (this.target.length === 1) {
            let t = this.target[0].components[COMPONENTS.TRANSFORM]?.translation
            if (!t)
                t = this.target[0].components[COMPONENTS.SKYLIGHT]?.direction
            if (!t)
                t = this.target[0].components[COMPONENTS.DIRECTIONAL_LIGHT]?.direction
            this.renderTarget.render(t)
        }
    }

    execute(meshes, meshSources, selected, camera, pickSystem, lockCamera, entities, transformationType, onGizmoStart, onGizmoEnd, gridSize) {
        super.execute(meshes, meshSources, selected, camera, pickSystem, lockCamera, entities, transformationType, onGizmoStart, onGizmoEnd, gridSize, this.xyz);
    }

    transformElement(vec) {
        super.transformElement()
        let toApply
        if (this.typeRot === ROTATION_TYPES.GLOBAL || !this.target[0].components[COMPONENTS.TRANSFORM] || this.target.length > 1)
            toApply = vec
        else
            toApply = vec4.transformQuat([], vec, this.target[0].components[COMPONENTS.TRANSFORM].rotationQuat)

        for (let i = 0; i < this.target.length; i++) {
            const target = this.target[i]
            if (!target.components[COMPONENTS.TRANSFORM]) {
                const key = target.components[COMPONENTS.SKYLIGHT] ? COMPONENTS.SKYLIGHT : COMPONENTS.DIRECTIONAL_LIGHT
                target.components[key].direction = [
                    target.components[key].direction[0] - toApply[0],
                    target.components[key].direction[1] - toApply[1],
                    target.components[key].direction[2] - toApply[2]
                ]
            } else
                target.components[COMPONENTS.TRANSFORM].translation = [
                    target.components[COMPONENTS.TRANSFORM].translation[0] - toApply[0],
                    target.components[COMPONENTS.TRANSFORM].translation[1] - toApply[1],
                    target.components[COMPONENTS.TRANSFORM].translation[2] - toApply[2]
                ]
        }
    }

}
