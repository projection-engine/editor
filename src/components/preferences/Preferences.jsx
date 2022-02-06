import PropTypes from "prop-types";
import styles from './styles/Preferences.module.css'
import {Button, Modal, Tab, VerticalTabs} from "@f-ui/core";
import {useContext, useState} from "react";
import ThemeProvider from "../../views/editor/hook/ThemeProvider";
import SettingsProvider from "../../views/editor/hook/SettingsProvider";


export default function Preferences(props) {
    const [openTab, setOpenTab] = useState(0)
    const theme = useContext(ThemeProvider)
    const settingsContext = useContext(SettingsProvider)
    const [changed, setChanged] = useState(false)

    return (
        <Modal blurIntensity={'5px'} open={settingsContext.preferencesVisibility} handleClose={() => settingsContext.preferencesVisibility=false}
               className={styles.wrapper}>

            <VerticalTabs open={openTab} setOpen={setOpenTab} className={styles.tabs}>
                <Tab label={'Theme'} className={styles.tab}>
                    <Button
                        onClick={() => {
                            setChanged(true)
                            theme.setDark(!theme.dark)
                        }}
                        className={styles.button}
                        variant={"outlined"}
                    >
                        <span className={'material-icons-round'}>{theme.dark ? 'dark_mode' : 'light_mode'}</span>
                        {theme.dark ? 'Dark theme' : 'Light theme'}
                    </Button>
                </Tab>
            </VerticalTabs>
            <div className={styles.submitWrapper}>


                <Button
                    className={styles.submitButton}
                    variant={"filled"}
                    onClick={() => {
                        settingsContext.preferencesVisibility = false
                    }}
                >
                    Ok
                </Button>
            </div>

        </Modal>
    )
}
Preferences.propTypes = {

    serializer: PropTypes.object,

}