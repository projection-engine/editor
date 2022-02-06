import getFolderOptions from "../visuals/getFolderOptions";
import FileObj from "../../templates/File";
import Folder from "../../templates/Folder";
import React from "react";

export default function getFileOptions(props, setCurrentItem){
    return [
        ...getFolderOptions(props.hook),
        {
            requiredTrigger: 'data-folder',
            label: 'Rename',
            icon: <span className={'material-icons-round'}>edit</span>,
            onClick: (node) => {
                setCurrentItem(node.getAttribute('data-folder'))
            }
        },
        {
            requiredTrigger: 'data-file',
            label: 'Rename',
            icon: <span className={'material-icons-round'}>edit</span>,
            onClick: (node) => {
                setCurrentItem(node.getAttribute('data-file'))
            }
        },
        {
            requiredTrigger: 'data-file',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => props.hook.removeFile(props.hook.items.find(e => e.id === node.getAttribute('data-file')))
        },
        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New material',
            icon: <span className={'material-icons-round'}>public</span>,
            onClick: () => {
                const newFile = new FileObj('New material', 'material', 0, undefined, props.hook.currentDirectory)
                props.hook.pushFile(newFile, JSON.stringify({name: 'New MaterialView'}))
            }
        },

        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New directory',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: () => {
                const newFolder = new Folder('New directory', props.hook.currentDirectory)
                props.hook.pushFolder(newFolder)
            }
        },
    ]
}