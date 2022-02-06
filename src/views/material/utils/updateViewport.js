export default function updateViewport(database, material) {
    const promises = []


    promises.push(
        new Promise((r, d) => {
            if (material.albedo)
                database
                    .getBlob(material.albedo?.id)
                    .then(res => r({data: res, type: 'albedo'}))
            else
                r({type: 'albedo'})
        })
    )
    promises.push(
        new Promise((r, d) => {
            if (material.metallic)
                database
                    .getBlob(material.metallic?.id)
                    .then(res => r({data: res, type: 'metallic'}))
            else
                r({type: 'metallic'})
        })
    )

    promises.push(
        new Promise((r, d) => {
            if (material.roughness)
                database
                    .getBlob(material.roughness?.id)
                    .then(res => r({data: res, type: 'roughness'}))
            else
                r({type: 'roughness'})
        })
    )

    promises.push(
        new Promise((r, d) => {
            if (material.normal)
                database
                    .getBlob(material.normal?.id)
                    .then(res => r({data: res, type: 'normal'}))
            else
                r({type: 'normal'})
        })
    )


    promises.push(
        new Promise((r, d) => {
            if (material.height)
                database
                    .getBlob(material.height?.id)
                    .then(res => r({data: res, type: 'height'}))
            else
                r({type: 'height'})
        })
    )

    promises.push(
        new Promise((r, d) => {
            if (material.ao)
                database
                    .getBlob(material.ao?.id)
                    .then(res => r({data: res, type: 'ao'}))
            else
                r({type: 'ao'})

        })
    )


    return Promise.all(promises)
}