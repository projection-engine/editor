import {useEffect, useState} from "react"
import PropTypes from "prop-types"
import KEYS from "../../engine/templates/KEYS"

const BUTTON_LEFT = 0
export default function useHotKeys(props, listeners = []) {
    const clicked = {}, target = document.getElementById(props.focusTarget)
    const [focused, setFocused] = useState(false)
    const handleKey = (e) => {
        const l = props.actions.length
        if (focused && document.activeElement === document.body) {
            if (e.type === 'keydown') {
                clicked[e.code] = true
                for (let i = 0; i < l; i++) {
                    const a = props.actions[i]
                    let trigger = true, c = 0
                    a.require.forEach(r => {
                        trigger = trigger && clicked[r]
                        c++
                    })
                    if (trigger && c === Object.keys(clicked).length && !document.pointerLockElement)
                        a.callback()
                }
            } else
                delete clicked[e.code]
        }
    }

    const handleMouseDown = (event) => {
        if (event.button === BUTTON_LEFT && event.path.find(e => e === target) !== undefined)
            setFocused(true)
        else
            setFocused(false)
    }

    useEffect(() => {
        if (!props.disabled) {
            document.addEventListener('mousedown', handleMouseDown)
            document.addEventListener('keydown', handleKey)
            document.addEventListener('keyup', handleKey)
        }
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('keyup', handleKey)
            document.removeEventListener('keydown', handleKey)
        }
    }, [props.actions, props.disabled, props.focusTarget, focused, listeners])
}
useHotKeys.propTypes = {
    focusTarget: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
        require: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(KEYS))),
        callback: PropTypes.func
    })),
    disabled: PropTypes.bool,
}