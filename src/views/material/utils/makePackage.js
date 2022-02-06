import Response from "../templates/Response";
import TextureSample from "../workflows/material/TextureSample";
import Material from "../workflows/material/Material";
import {instanceOf} from "prop-types";

export default function makePackage(hook) {
    const nodes = hook.compile()
    const responseNode = nodes.find(n => {
        return (n instanceof Response)
    })

    if (responseNode) {

        return {
            nodes: nodes.filter(n => !(n instanceof Response)).map(n => {
                if(n instanceof TextureSample)
                    return {...n, instanceOf: n.constructor.name, sample: n.sample?.id}
                return {...n, instanceOf: n.constructor.name}
            }),
            links: hook.links,
            response: responseNode instanceof Material ?
                {
                    albedo: {
                        ref: (typeof responseNode.albedo === "object") ? responseNode.albedo?.id : responseNode.albedo,
                        type: typeof responseNode.albedo
                    },
                    ao: {
                        ref: (typeof responseNode.ao === "object") ? responseNode.ao?.id : responseNode.ao,
                        type: typeof responseNode.ao
                    },
                    height: {
                        ref: (typeof responseNode.height === "object") ? responseNode.height?.id : responseNode.height,
                        type: typeof responseNode.height
                    },
                    roughness: {
                        ref: (typeof responseNode.roughness === "object") ? responseNode.roughness?.id : responseNode.roughness,
                        type: typeof responseNode.roughness
                    },
                    metallic: {
                        ref: (typeof responseNode.metallic === "object") ? responseNode.metallic?.id : responseNode.metallic,
                        type: typeof responseNode.metallic
                    },
                    normal: {
                        ref: (typeof responseNode.normal === "object") ? responseNode.normal?.id : responseNode.normal,
                        type: typeof responseNode.normal
                    },
                    id: responseNode.id,
                    name: responseNode.name,
                    x: responseNode.x,
                    y: responseNode.y
                }
                : {...responseNode}
            ,
            name: hook.name,
            workflow: responseNode.constructor.name
        }
    } else
        return null
}