import Folder from "../../templates/Folder";

export default function getFolderOptions(hook) {
    return [

        {
            requiredTrigger: 'data-folder',
            label: 'New sub-directory',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: (node) => {
                const newFolder = new Folder('New folder', node.getAttribute('data-folder'))
                hook.pushFolder(newFolder)
            }
        },

        {
            requiredTrigger: 'data-folder',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => {
                const target = hook.items.find(f => f.id === node.getAttribute('data-folder'))
                if (target)
                    hook.removeFolder(target)

            }
        },
    ]
}