import Entity from "../engine/ecs/basic/Entity";
import Component from "../engine/ecs/basic/Component";
import PickComponent from "../engine/ecs/components/PickComponent";
import generateNextID from "./generateNextID";
import cloneClass from "./misc/cloneClass";


export const ENTITY_ACTIONS = {
    ADD: '0-A',
    ADD_COMPONENT: '0-B',


    UPDATE: '1-A',
    UPDATE_COMPONENT: '1-B',

    REMOVE: '2-A',
    REMOVE_COMPONENT: '2-B',


    DISPATCH_BLOCK: 4,
    PUSH_BLOCK: 6,
    REMOVE_BLOCK: 7,
    CLEAR: 5
}

function deleteEntity(entity, entities) {
    let copy = [...entities].filter(e => e.id !== entity.id)
    for (let i = 0; i < copy.length; i++) {
        if (copy[i].linkedTo === entity.id)
            copy = deleteEntity(copy[i], copy)
    }
    return copy
}

export default function entityReducer(state, action) {
    let stateCopy = [...state]
    const entityIndex = state.findIndex(e => e.id === action.payload?.entityID)

    if (entityIndex > -1) {
        const entity = cloneClass(stateCopy[entityIndex])
        switch (action.type) {

            // ENTITY
            case ENTITY_ACTIONS.UPDATE: {
                const {
                    key,
                    data,
                } = action.payload
                if (key === 'name')
                    entity.name = data
                else if (key === 'active')
                    entity.active = data
                else if (key === 'linkedTo')
                    entity.linkedTo = data

                stateCopy[entityIndex] = entity
                return stateCopy
            }
            case ENTITY_ACTIONS.REMOVE: {

                return deleteEntity(stateCopy[entityIndex], stateCopy)
            }

            // COMPONENT
            case ENTITY_ACTIONS.ADD_COMPONENT: {

                if (action.payload.data instanceof Component) {
                    if (action.payload instanceof PickComponent) {
                        const existing = state.filter(s => s.components.MeshComponent !== undefined)
                        action.payload.data.pickID = generateNextID(existing.length)
                    }


                    entity.addComponent(action.payload.data)
                }

                stateCopy[entityIndex] = entity
                return stateCopy
            }
            case ENTITY_ACTIONS.UPDATE_COMPONENT: {
                const {
                    key,
                    data,
                } = action.payload
                entity.components[key] = data

                stateCopy[entityIndex] = entity
                return stateCopy
            }
            case ENTITY_ACTIONS.REMOVE_COMPONENT: {
                entity.removeComponent(action.payload.constructor.name)
                stateCopy[entityIndex] = entity
                return stateCopy
            }
            default:
                return stateCopy
        }
    } else
        switch (action.type) {
            case ENTITY_ACTIONS.CLEAR:
                return []
            case ENTITY_ACTIONS.ADD: {
                if (action.payload instanceof Entity)
                    stateCopy.push(action.payload)

                return stateCopy
            }
            case ENTITY_ACTIONS.DISPATCH_BLOCK: {
                const block = action.payload
                if (Array.isArray(block))
                    return block
                else
                    return stateCopy
            }
            case ENTITY_ACTIONS.REMOVE_BLOCK: {
                const block = action.payload
                if (Array.isArray(block)) {
                    block.forEach(e => {
                        stateCopy.splice(stateCopy.findIndex(entity => entity.id === e), 1)
                    })
                    return stateCopy
                }
                else
                    return stateCopy
            }
            case ENTITY_ACTIONS.PUSH_BLOCK: {
                const block = action.payload
                if (Array.isArray(block))
                    return [...stateCopy, ...block]
                else
                    return stateCopy
            }
            default:
                return stateCopy
        }

}
