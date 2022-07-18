import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import * as DOM from "react-dom/client"
import SHORTCUTS_ID from "../static/misc/SHORTCUTS_ID"
import React from "react"
import {Icon} from "@f-ui/core"
import LABELED_KEYS from "../static/misc/LABELED_KEYS"
import compiler from "../components/blueprints/libs/compiler"
import BOARD_SIZE from "../components/blueprints/data/BOARD_SIZE"
import ENVIRONMENT from "../engine/data/ENVIRONMENT"


export default function WindowInitializer(fileSystem, pushEvent) {
    // ALERT / FS
    alert.pushEvent = pushEvent
    window.fileSystem = fileSystem

    // MATH
    Math.mat4 = mat4
    Math.mat3 = mat3
    Math.vec4 = vec4
    Math.vec3 = vec3
    Math.quat = quat

    // BLUEPRINTS
    window.blueprints = {
        scale: 1,
        grid: 1,
        async compile(nodes, links) {
            const parsedNodes = nodes.map(n => {
                const docNode = document.getElementById(n.id).parentNode
                const transformation = docNode
                    .getAttribute("transform")
                    .replace("translate(", "")
                    .replace(")", "")
                    .split(" ")

                const bBox = docNode.getBoundingClientRect()
                return {
                    ...n,
                    x: parseFloat(transformation[0]) - BOARD_SIZE / 2,
                    y: parseFloat(transformation[1]) - BOARD_SIZE / 2,
                    width: bBox.width,
                    height: bBox.height,
                    instance: n.constructor.name,
                    texture: n.texture && typeof n.texture === "object" ? {registryID: n.texture.registryID} : undefined
                }
            })
            const compiled = await compiler(nodes.filter(n => !n.isComment), links)
            const preview = window.renderer.generatePreview(true)

            return {
                compiled, preview, parsedNodes
            }
        },
        async save(hook) {
            const {
                compiled, preview, parsedNodes
            } = await this.compile(hook.nodes, hook.links)
            window.fileSystem
                .updateAsset(
                    hook.openFile.registryID,
                    JSON.stringify({
                        nodes: parsedNodes,
                        links: hook.links,
                        response: compiled,
                        type: compiled.variant
                    }),
                    preview
                )
                .then(() => alert.pushAlert("Saved", "success",))
                .catch(() => alert.pushAlert("Some error occurred", "error",))
            hook.setChanged(false)
            hook.setImpactingChange(false)
        }
    }

    // CONTEXT MENU
    window.contextMenu = {targets: {}, focused: undefined}

    // ENTITY WORKER
    const listeners = {}
    window.entityWorker = new Worker(new URL("./EntityWorker.js", import.meta.url))
    window.addEntityWorkerListener = (callback, id) => {
        listeners[id] = callback
    }
    window.entityWorker.onmessage = ({data: {actionID, payload}}) => {
        if (listeners[actionID])
            listeners[actionID](payload)
    }

    // SHORTCUTS
    const shortcutsRoot = DOM.createRoot(document.getElementById(SHORTCUTS_ID))
    window.shortcuts = {all: [], active: {}}
    window.shortcuts.updateShortcuts = () => {
        const clickedLen = Object.keys(window.shortcuts.active).length
        const actions = window.shortcuts.all.filter(a => (a.require.length === 1 && clickedLen === 0) || a.require.find(e => window.shortcuts.active[e] === true) !== undefined)
        shortcutsRoot.render(
            <>
                {window.shortcuts.window ?
                    <div data-item={"-"} data-action={"-"}>
                        <Icon styles={{fontSize: "1rem"}}>{window.shortcuts.window.icon}</Icon>
                        <label>{window.shortcuts.window.label}</label>
                    </div>
                    :
                    <div data-item={"-"}>
						Nothing focused
                    </div>}

                {actions.map((a, i) => (
                    <div
                        data-action={"-"}
                        key={"short-cut-" + a.label + "-" + i}
                        style={{display: a.disabled ? "none" : undefined}}
                    >
                        <div data-item={"-"}>
                            {a.require.map((e, i) => LABELED_KEYS[e] + (i < a.require.length - 1 ? " + " : ""))}
                        </div>
                        <div>
                            {a.label}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    // CONSOLE
    const oldLog = console.log
    console.targerts = []
    console.pushTarget = (ref) => {
        console.targerts.push(ref)
        ref.line = 0
    }
    console.removeTarget = (ref) => {
        console.targerts = console.targerts.filter(r => r !== ref)
    }
    console.log = (...comps) => {
        console.dir(comps)
        const message = comps.join(",\n")
        if(window.renderer && window.renderer.environment === ENVIRONMENT.PROD)
            for(let i = 0; i < console.targerts.length; i++){
                const logger = console.targerts[i]
                const lastContent = logger.lastContent
                const emptyLine = ">> "

                if(lastContent === message){
                    logger.looped += 1
                    const newLine =  emptyLine + "(" + (logger.looped) + ") " + message + "\n"
                    logger.textContent = logger.textContent.replace( logger.lastLine,  newLine)
                    logger.lastLine = newLine
                }else {
                    logger.looped = 0
                    logger.line++
                    let newLine
                    if (typeof message == "object")
                        newLine = emptyLine + (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + "\n"
                    else
                        newLine = emptyLine + message + "\n"
                    logger.textContent += newLine
                    logger.lastLine = newLine
                }
                logger.lastContent = message
                logger.scrollTop = logger.scrollHeight
            }
        oldLog(...comps)
    }
}