import PropTypes from "prop-types";
import styles from '../../styles/Cards.module.css'
import React from "react";
import ListItem from "./ListItem";
import useItems from "../../hooks/useItems";
import ContextMenu from "../../../../components/context/ContextMenu";

export default function ListItems(props) {
    const {
        currentItem, setCurrentItem,
        focusedElement, setFocusedElement,
        filesToRender, ref,
        options
    } = useItems(props)


    return (
        <div
            ref={ref}
            className={styles.content}
            style={{display: props.hidden ? 'none' : undefined}}
            data-folder-wrapper={props.hook.currentDirectory}
        >
            <div className={styles.types}>
                <div className={styles.type}>
                    Name
                </div>
                <div className={styles.type}>
                    Type
                </div>
                <div className={styles.type}>
                    Size
                </div>
                <div className={styles.type}>
                    Creation date
                </div>
            </div>
            <ContextMenu
                options={options}
                onContext={(node) => {
                    if (node !== undefined && node !== null && (node.getAttribute('data-file') || node.getAttribute('data-folder'))) {
                        const attr = node.getAttribute('data-file') ? node.getAttribute('data-file') : node.getAttribute('data-folder')
                        setFocusedElement(attr)
                    }
                }}
                className={styles.filesWrapperList}

                triggers={[
                    'data-folder-wrapper',
                    'data-file',
                    'data-folder'
                ]}
            >
                {filesToRender.length > 0 ?
                    filesToRender.map(child => (
                        <React.Fragment key={child.id}>
                            <ListItem
                                setFocusedElement={setFocusedElement}
                                focusedElement={focusedElement}
                                type={child.constructor.name}
                                data={child}
                                selected={props.selected}
                                setSelected={props.setSelected}
                                openEngineFile={props.openEngineFile}
                                hook={props.hook}
                                onRename={currentItem}
                                visualizationType={props.visualizationType}
                                submitRename={newName => {
                                    if (newName !== child.name) {
                                        if (child.constructor.name === 'File')
                                            props.hook.renameFile(child, newName)
                                        else
                                            props.hook.renameFolder(child, newName)
                                    }
                                    setCurrentItem(undefined)
                                }}
                            />
                        </React.Fragment>
                    ))

                    :
                    <div className={styles.empty}>
                        <span className={'material-icons-round'} style={{fontSize: '100px'}}>folder</span>
                        <div style={{fontSize: '.8rem'}}>
                            Empty folder
                        </div>
                    </div>}

            </ContextMenu>
        </div>
    )
}

ListItems.propTypes = {
    visualizationType: PropTypes.number,


    searchString: PropTypes.string,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    accept: PropTypes.array,
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
