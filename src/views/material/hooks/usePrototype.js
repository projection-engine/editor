import {useContext, useEffect, useLayoutEffect, useState} from "react";
import parseNodes from "../utils/parseNodes";

import Material from "../workflows/material/Material";
import QuickAccessProvider from "../../../components/db/QuickAccessProvider";
import DatabaseProvider from "../../../components/db/DatabaseProvider";
import cloneClass from "../../editor/utils/misc/cloneClass";


export default function usePrototype(file = {}) {
    const [nodes, setNodes] = useState([])
    const [links, setLinks] = useState([])
    const [selected, setSelected] = useState()

    const quickAccess = useContext(QuickAccessProvider)
    const database = useContext(DatabaseProvider)

    useLayoutEffect(() => {

        parseNodes(database, file.nodes, file.response, file.workflow, (parsed) => {
            let n = [...parsed]
            if (parsed.length === 0)
                n.push(new Material())

            setNodes(n)
            if (file.links !== undefined)
                setLinks(file.links)

        }, quickAccess)
    }, [file])

    const updateLinks = () => {
        links.forEach(l => {
            const parsed = {
                target: nodes.findIndex(n => n.id === l.target.id),
                targetKey: l.target.attribute.key,
                source: nodes.findIndex(n => n.id === l.source.id),
                sourceKey: l.source.attribute.key
            }

            setNodes(prev => {
                let c = [...prev]
                let targetClone = cloneClass(nodes[parsed.target])
                targetClone[parsed.targetKey] = nodes[parsed.source][parsed.sourceKey]
                c[parsed.target] = targetClone
                return c
            })
            nodes[parsed.target][parsed.targetKey] = nodes[parsed.source][parsed.sourceKey]
        })
    }

    useEffect(() => {
        updateLinks()
    }, [links, selected])

    const compile = () => {
        updateLinks()
        const newNodes = nodes.map(
            c => {
                const docNode = document.getElementById(c.id).parentNode
                const transformation = docNode
                    .getAttribute('transform')
                    .replace('translate(', '')
                    .replace(')', '')
                    .split(' ')

                c.x = parseFloat(transformation[0])
                c.y = parseFloat(transformation[1])

                return c
            })
        setNodes(newNodes)

        return newNodes
    }

    return {
        compile,
        selected,
        setSelected,
        setNodes,
        nodes,
        links,
        setLinks,
        name: file.name,
        quickAccess
    }
}