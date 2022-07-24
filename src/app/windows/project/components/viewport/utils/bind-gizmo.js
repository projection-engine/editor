import GIZMOS from "../../../static/misc/GIZMOS";

export default  function bindGizmo(selected) {
    const gizmoSystem = window.renderer.editorSystem.gizmoSystem
    const entities = window.renderer.entitiesMap
    gizmoSystem.selectedEntities = selected
        .map(s => entities.get(s))
        .filter(c => (settings.gizmo === GIZMOS.TRANSLATION || c.components[COMPONENTS.TRANSFORM] && (settings.gizmo === GIZMOS.ROTATION && !c.components[COMPONENTS.TRANSFORM].lockedRotation || settings.gizmo === GIZMOS.SCALE && !c.components[COMPONENTS.TRANSFORM]?.lockedScaling)))

    if (gizmoSystem.selectedEntities.length > 0) {
        switch (settings.gizmo) {
            case GIZMOS.TRANSLATION:
                gizmoSystem.targetGizmo = gizmoSystem.translationGizmo
                break
            case GIZMOS.ROTATION:
                gizmoSystem.targetGizmo = gizmoSystem.rotationGizmo
                break
            case GIZMOS.SCALE:
                gizmoSystem.targetGizmo = gizmoSystem.scaleGizmo
                break
        }
    }else if(gizmoSystem.targetGizmo){

        gizmoSystem.targetGizmo.exit()
        gizmoSystem.targetGizmo = undefined
    }
}