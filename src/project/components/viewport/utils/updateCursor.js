import COMPONENTS from "../../../engine/data/COMPONENTS"
import Transformation from "../../../engine/utils/Transformation"

export default function updateCursor(coords) {
    const t = window.renderer.cursor.components[COMPONENTS.TRANSFORM]
    t.translation = coords
    t.transformationMatrix = Transformation.transform(t.translation, [0, 0, 0, 1], t.scaling)
}