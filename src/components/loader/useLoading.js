import {useEffect, useReducer, useRef} from "react";
import ReactDOM from 'react-dom'
import Loader from "./Loader";


function reducer(state, action) {
    switch (action.type) {
        case 'ADD':
            return {...state, [action.payload]: true}
        case 'DELETE':
            const copy = {...state}
            delete copy[action.payload]

            return copy
    }
}


export default function useLoading(dark,accentColor) {
    const [events, dispatchEvents] = useReducer(reducer, {})
    const renderTarget = useRef()

    useEffect(() => {
        if (!renderTarget.current) {
            renderTarget.current = document.createElement('div')
            document.body.appendChild(renderTarget.current)
        }
        if (Object.keys(events).length > 0)
            ReactDOM.render(<Loader accentColor={accentColor} events={events} dark={dark}/>, renderTarget.current)
        else
            ReactDOM.unmountComponentAtNode(renderTarget.current)

    }, [events,dark])

    const pushEvent = (key) => {
        dispatchEvents({type: 'ADD', payload: key})
    }
    const getEvent = (key) => {
        return !events[key]
    }
    const finishEvent = (key) => {
        dispatchEvents({type: 'DELETE', payload: key})
    }

    return {
        dispatchEvents,

        events,
        pushEvent,
        getEvent,
        finishEvent
    }
}

