import {useEffect, useState} from "react";
import EVENTS from "../../views/editor/utils/misc/EVENTS";
import {FILE_TYPES} from "../../views/files/hooks/useDB";


export default function useQuickAccess(projectID, load, database) {
    const [images, setImages] = useState([])
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])

    const refresh = () => {
        let promises = []
        load.pushEvent(EVENTS.REFRESHING)
        promises.push(
            new Promise((r) => {
                database
                    .listFiles({project: projectID, type: 'mesh', instanceOf: FILE_TYPES.FILE})
                    .then(res => r(res))
            })
        )
        promises.push(
            new Promise((r) => {
                database
                    .listFiles({project: projectID, type: 'image', instanceOf: FILE_TYPES.FILE})
                    .then(res => r(res))
            })
        )

        promises.push(
            new Promise((r) => {
                database
                    .listFiles({project: projectID, type: 'material', instanceOf: FILE_TYPES.FILE})
                    .then(res => r(res))
            })
        )


        Promise.all(promises.flat()).then(r => {
            setImages(r.flat().filter(f => f.type !== 'mesh' && f.type !== 'material'))
            setMaterials(r.flat().filter(f => f.type === 'material'))
            setMeshes(r.flat().filter(f => f.type === 'mesh'))

            load.finishEvent(EVENTS.REFRESHING)
        })
    }

    useEffect(() => {
        if (projectID)
            refresh()
    }, [projectID])

    return {
        images,
        meshes,
        materials,
        refresh
    }
}