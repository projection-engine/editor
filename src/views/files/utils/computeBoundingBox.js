import {groupInto} from "../../../services/engine/utils/obj/loadObj";


export default function computeBoundingBox(vertices) {

    if(vertices && vertices.length > 0) {
        const toVector = groupInto(3, vertices)
        let min = [], max = []
        for (let i = 0; i < toVector.length; i++) {
            const current = toVector[i]
            if (!min[0] || current[0] < min[0])
                min[0] = current[0]

            if (!min[1] || current[1] < min[1])
                min[1] = current[1]

            if (!min[2] || current[2] < min[2])
                min[2] = current[2]

            if (!max[0] || current[0] > max[0])
                max[0] = current[0]

            if (!max[1] || current[1] > max[1])
                max[1] = current[1]

            if (!max[2] || current[2] > max[2])
                max[2] = current[2]
        }

        return [min, max]

    }
    else
        return [ 0, 0]
}