import {useEffect, useMemo, useRef, useState} from "react";
import getBezierCurve from "../utils/bezierCurve";


export default function useBoard(hook, setAlert, parentRef) {
    const [width, setWidth] = useState(500)
    const [height, setHeight] = useState(500)
    const [scale, setScale] = useState(1)

    const ref = useRef()
    let resizeObs
    const handleWheel = (e) => {
        e.preventDefault()
        if (e.wheelDelta > 0 && scale < 3)
            setScale(scale + scale * .1)
        else if (e.wheelDelta < 0 && scale >= .25)
            setScale(scale - scale * .1)
    }

    useEffect(() => {
        ref.current?.parentNode.addEventListener('wheel', handleWheel, {passive: false})
        return () => {
            ref.current?.parentNode.removeEventListener('wheel', handleWheel, {passive: false})
        }
    }, [scale])
    const callback = () => {
        const p = parentRef.current
        if (p !== null) {
            setWidth(p.offsetWidth - p.lastChild.offsetWidth)
            setHeight(ref.current?.parentNode.offsetHeight - 35)
        }
    }
    useEffect(() => {
        if (!resizeObs)
            resizeObs = new ResizeObserver(callback)
        resizeObs.observe(ref.current?.parentNode)
        callback()
    }, [])


    const handleLink = (src, target) => {
        hook.setLinks(prev => {
            const c = [...prev]
            const targetInstance = hook.nodes.find(n => n.id === target.id)
            const existing = c.findIndex(c => c.target.id === target.id && c.target.attribute.key === target.attribute.key)
            let valid = true
            if (existing > -1) {
                let acceptsArray = targetInstance.inputs.find(f => f.key === target.attribute.key).accept.find(f => f === 'Array')
                valid = valid && acceptsArray !== undefined
            }

            if (valid && !c.find(i => i.source.id === src.id && i.target.id === target.id && i.source.attribute.key === src.attribute.key && i.target.attribute.key === target.attribute.key))
                c.push({
                    source: src,
                    target: target
                })
            else if (valid)
                setAlert({
                    type: 'info',
                    message: 'Already linked'
                })
            else
                setAlert({
                    type: 'info',
                    message: 'Input doesn\'t support multiple values.'
                })
            return c
        })
    }
    const links = useMemo(() => {
        return hook.links.map(l => {
            return {
                target: l.target.id + l.target.attribute.key,
                source: l.source.id + l.source.attribute.key,
                targetKey: l.target.attribute.key,
                sourceKey: l.source.attribute.key
            }
        })
    }, [hook])

    let currentFrame = 0

    const updateLinks = () => {
        try {
            let parentBBox = ref.current?.getBoundingClientRect()
            const bounding = {
                x: ref.current?.scrollLeft - parentBBox.left,
                y: ref.current?.scrollTop - parentBBox.top
            }

            links.forEach(l => {
                const target = document.getElementById(l.target)?.getBoundingClientRect()
                const source = document.getElementById(l.source)?.getBoundingClientRect()
                const linkPath = document.getElementById(l.target + '-' + l.source)
                const supplementary = linkPath.nextSibling
                if (target && source && linkPath) {
                    const curve = getBezierCurve(
                        {
                            x: (source.x + bounding.x + 7.5) / scale,
                            y: (source.y + bounding.y + 7.5) / scale
                        },
                        {
                            x1: (target.x + bounding.x + 7.5) / scale,
                            y1: (target.y + bounding.y + 7.5) / scale
                        })
                    supplementary.setAttribute('d', curve)
                    linkPath.setAttribute('d', curve)
                }
            })
        } catch (error) {
        }
        currentFrame = requestAnimationFrame(updateLinks)
    }

    useEffect(() => {
        currentFrame = requestAnimationFrame(updateLinks)
        return () => {
            cancelAnimationFrame(currentFrame)
        }
    }, [links, scale])
    return {
        width,
        height,
        scale,
        links,
        ref,
        handleLink
    }
}