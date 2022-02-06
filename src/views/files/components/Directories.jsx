import PropTypes from "prop-types";
import styles from '../styles/Directories.module.css'
import ContextMenu from "../../../components/context/ContextMenu";
import React, {useMemo} from "react";
import Folder from "../templates/Folder";
import TreeView from "../../../components/tree/TreeView";
import mapToView from "../utils/parsers/mapToView";
import getFolderOptions from "../utils/visuals/getFolderOptions";


export default function Directories(props) {
    const directoriesToRender = useMemo(() => {
        const toFilter = props.hook.items.filter(item => item instanceof Folder && !item.parent)

        return toFilter.map(f => {
            return mapToView(f, props.hook)
        })
    }, [props.hook.items])

    return (
        <div data-directories-wrapper={'true'} className={styles.wrapper}>
            <ContextMenu
                options={[
                    ...getFolderOptions(props.hook),
                    {
                        requiredTrigger: 'data-folder',
                        label: 'Rename',
                        icon: <span className={'material-icons-round'}>edit</span>,
                        onClick: (node) => {
                            const target = document.getElementById(node.getAttribute('data-folder') + '-node')
                            if (target) {
                                const event = new MouseEvent('dblclick', {
                                    'view': window,
                                    'bubbles': true,
                                    'cancelable': true
                                });
                                target.dispatchEvent(event);
                            }
                        }
                    },
                    {
                        requiredTrigger: 'data-directories-wrapper',
                        label: 'New directory',
                        icon: <span className={'material-icons-round'}>create_new_folder</span>,
                        onClick: () => {
                            const newFolder = new Folder('New folder', undefined)
                            props.hook.pushFolder(newFolder)
                        }
                    }
                ]}
                triggers={[
                    'data-directories-wrapper',
                    'data-folder'
                ]}>
                <TreeView
                    draggable={true}
                    onDrop={(event, target) => {
                        event.currentTarget.parentNode.classList.remove(styles.hovered)
                        const item = props.hook.items.find(f => f.id === target)
                        const dropTarget = props.hook.items.find(f => f.id === event.dataTransfer.getData('text'))
                        if (item && item.id !== event.dataTransfer.getData('text') && dropTarget && item.parent !== event.dataTransfer.getData('text') && item instanceof Folder){
                            if(dropTarget instanceof Folder)
                                props.hook.moveFolder(dropTarget.id, item.id)
                            else
                                props.hook.moveFile(dropTarget.id, item.id)
                        }
                    }}
                    onDragLeave={(event, target) => {
                        event.preventDefault()
                        event.currentTarget.classList.remove(styles.hovered)
                    }}
                    onDragOver={(event, target) => {
                        event.preventDefault()
                        event.currentTarget.classList.add(styles.hovered)
                    }}


                    selected={props.hook.currentDirectory}
                    nodes={directoriesToRender}
                    handleRename={(folder, newName) => {
                        const folderObj = props.hook.items.find(f => f.id === folder.id)
                        if (folderObj)
                            props.hook.renameFolder(folderObj, newName)
                    }}
                />
            </ContextMenu>
        </div>
    )
}

Directories.propTypes = {
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
