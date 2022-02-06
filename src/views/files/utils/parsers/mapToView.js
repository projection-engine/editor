import Folder from "../../templates/Folder";

export default function mapToView(folder, hook) {
    return {
        id: folder.id,
        label: folder.name,
        onClick: () => hook.setCurrentDirectory(folder.id),
        children: hook.items.filter(f => f.parent === folder.id && f instanceof Folder).map(f => mapToView(f, hook)),
        icon: <span style={{fontSize: '1rem'}} className={'material-icons-round'}>folder</span>,
        attributes: {'data-folder': folder.id}
    }

}