import {useEffect, useMemo, useRef, useState} from "react";
import styles from "../styles/ItemCard.module.css";
import Folder from "../templates/Folder";

export default function useItem(props) {
    const ref = useRef()
    useEffect(() => {
        if (props.type === 'Folder')
            ref.current.setAttribute('data-folder', props.data.id)
        else
            ref.current.setAttribute('data-file', props.data.id)
    }, [props.type])

    const currentlyOnRename = useMemo(() => {
        return props.onRename === props.data.id
    }, [props.onRename])
    const [currentLabel, setCurrentLabel] = useState(props.data.name)
    useEffect(() => {
        setCurrentLabel(props.data.name)
    }, [props.data.name])


    const onDoubleClick = () => {
        if (props.type === 'File') {
            if (props.data.type === 'mesh' || props.data.type === 'material' || props.data.type === 'image')
                props.openEngineFile(props.data.id, currentLabel, props.data.type)
            else
                props.setSelected(props.data.id)
        } else if (props.type === 'Folder')
            props.hook.setCurrentDirectory(props.data.id)
    }

    const onDragOver = e => {
        if (props.type === 'Folder') {
            e.preventDefault()
            ref.current?.classList.add(styles.hovered)
        }
    }
    const onClick = () => props.setFocusedElement(props.data.id)
    const onDragLeave = e => {
        if (props.type === 'Folder') {
            e.preventDefault()
            ref.current?.classList.remove(styles.hovered)
        }
    }
    const onDrop = e => {
        e.preventDefault()
        e.currentTarget.parentNode.classList.remove(styles.hovered)
        const current = e.dataTransfer.getData('text')
        const foundCurrent = props.hook.items.find(f => f.id === current)

        if (props.type === 'Folder' && props.data.id !== e.dataTransfer.getData('text') && foundCurrent && props.data.parent !== e.dataTransfer.getData('text')) {
            if (foundCurrent instanceof Folder)
                props.hook.moveFolder(current, props.data.id)
            else
                props.hook.moveFile(current, props.data.id)
        }

        if (e.dataTransfer.getData('text') !== props.data.id && e.dataTransfer.getData('text') !== props.data.parent) {
            if (props.type === 'Folder')
                props.hook.moveFolder(e.dataTransfer.getData('text'), props.data.id)
            else
                props.hook.moveFile(e.dataTransfer.getData('text'), props.data.id)
        }
    }

    useEffect(() => {
        ref.current?.addEventListener('drop', onDrop)
        ref.current?.addEventListener('click', onClick)
        ref.current?.addEventListener('dragleave', onDragLeave)
        ref.current?.addEventListener('dragover', onDragOver)
        ref.current?.addEventListener('dblclick', onDoubleClick)

        return () => {
            ref.current?.removeEventListener('drop', onDrop)
            ref.current?.removeEventListener('click', onClick)
            ref.current?.removeEventListener('dragleave', onDragLeave)
            ref.current?.removeEventListener('dragover', onDragOver)
            ref.current?.removeEventListener('dblclick', onDoubleClick)
        }
    }, [props.data, ref])

    return {
        ref,
        currentlyOnRename,
        currentLabel, setCurrentLabel,

    }
}