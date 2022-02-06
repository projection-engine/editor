import styles from './styles/GlobalOptions.module.css'
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import PropTypes from "prop-types";
import {useContext} from "react";
import SettingsProvider from "../../views/editor/hook/SettingsProvider";


export default function GlobalOptions(props) {
    const settingsContext = useContext(SettingsProvider)
    return (
        <div className={styles.wrapper}>
            <Button
                onClick={() => {
                    props.save().then(() => {
                        props.redirect()
                    })
                }}
                className={styles.logoWrapper}>
                {/*<span className={'material-icons-round'}>home</span>*/}
                Projection
            </Button>
            <Dropdown className={styles.dropdownLabel} align={'bottom'} justify={'start'}>
                File
                <DropdownOptions>
                    <DropdownOption option={{
                        label: 'Save',
                        icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>save</span>,
                        shortcut: 'Ctrl + S',
                        onClick: () => props.save()
                    }}/>

                    <DropdownOption option={{
                        label: 'Export project',
                        icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>save_alt</span>,
                        onClick: () => props.downloadProject()
                    }}/>

                    <DropdownOption option={{

                        label: 'Preferences',
                        icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>settings</span>,
                        shortcut: 'Ctrl + alt + S',
                        onClick: () => settingsContext.preferencesVisibility = true
                    }}/>
                </DropdownOptions>
            </Dropdown>
            <Dropdown className={styles.dropdownLabel} align={'bottom'} justify={'start'}>
                Editor
                <DropdownOptions>
                    <DropdownOption option={{
                        label: 'Show scene options',
                        icon: settingsContext.sceneVisibility ? <span className={'material-icons-round'} style={{fontSize: '1rem'}}>check</span> : undefined,
                        keepAlive: true,
                        onClick: () => settingsContext.sceneVisibility = ! settingsContext.sceneVisibility
                    }}/>

                    <DropdownOption option={{
                        label: 'Show files',
                        keepAlive: true,
                        icon: settingsContext.filesVisibility ? <span className={'material-icons-round'} style={{fontSize: '1rem'}}>check</span> : undefined,
                        onClick: () => settingsContext.filesVisibility = ! settingsContext.filesVisibility
                    }}/>

                    <DropdownOption option={{
                        label: 'Show viewport options',
                        keepAlive: true,
                        icon: settingsContext.viewportOptionsVisibility ? <span className={'material-icons-round'} style={{fontSize: '1rem'}}>check</span> : undefined,
                        onClick: () => settingsContext.viewportOptionsVisibility = ! settingsContext.viewportOptionsVisibility
                    }}/>
                </DropdownOptions>
            </Dropdown>
            <Dropdown disabled={true} className={styles.dropdownLabel}>
                Help
            </Dropdown>
        </div>
    )
}
GlobalOptions.propTypes = {
    downloadProject: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired
}