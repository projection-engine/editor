import PropTypes from "prop-types";
import React, {useMemo, useState} from "react";
import styles from './styles/Tabs.module.css'
import {Button} from "@f-ui/core";
import ControlProvider from "./components/ControlProvider";
import Options from "./components/Options";

export default function Tabs(props) {
    const [options, setOptions] = useState([])

    const tabs = useMemo(() => {
        if (props.tab === 0)
            setOptions([])
        return props.tabs.filter(t => t.open)
    }, [props.tabs])


    return (
        <ControlProvider.Provider value={{
            setOptions: (e) => {
                setOptions(e)
            }
        }}>
            <div className={styles.wrapper}>
                <div className={styles.contentWrapper}>
                    <div className={styles.tabs}>
                        {tabs.map((tab, i) => (
                            <div key={'tab-' + i}
                                 className={[styles.tabButtonWrapper, props.tab === i ? styles.currentTabButton : ''].join(' ')}>
                                <Button
                                    variant={'minimal-horizontal'}
                                    className={styles.button}
                                    highlight={props.tab === i}
                                    onClick={() => {
                                        if (props.tab !== i) {
                                            if (props.onBeforeSwitch)
                                                props.onBeforeSwitch(i)
                                            props.setTab(i)
                                        }
                                    }}
                                >
                                    {tab.icon}
                                 <div className={styles.overflow}>
                                     {tab.label}
                                 </div>
                                </Button>
                                {tab.canClose ?
                                    <Button
                                        color={"secondary"}
                                        className={styles.closeButton}
                                        onClick={() => {

                                            if (props.tab === i) {
                                                props.setTab(i - 1)
                                                if (i - 1 === 0 && props.onBeforeSwitch)
                                                    props.onBeforeSwitch(0)
                                            }
                                            tab.handleClose()

                                        }}
                                    >
                                        <span className={'material-icons-round'}>close</span>
                                    </Button>
                                    :
                                    null
                                }
                            </div>
                        ))}
                    </div>
                    <Options fallbackOptions={props.fallbackOptions} options={options}/>
                </div>
                {tabs.map((tab, i) => (
                    <div key={'tab-child-' + i} className={styles.content}
                         style={{display: props.tab !== i ? 'none' : undefined}}>
                        {tab.children}
                    </div>
                ))}
            </div>
        </ControlProvider.Provider>
    )
}
Tabs.propTypes = {
    fallbackOptions: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func,
        icon: PropTypes.node,
        label: PropTypes.string,
        group: PropTypes.string,
        type: PropTypes.oneOf(['dropdown', 'default']),
        options: PropTypes.arrayOf(PropTypes.object),
        shortcut: PropTypes.string,
        keepAlive: PropTypes.bool
    })),

    tabs: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.node,
        label: PropTypes.string,
        children: PropTypes.node,
        open: PropTypes.bool,
        canClose: PropTypes.bool,
        handleClose: PropTypes.func,
        shortcut: PropTypes.string,
        keepAlive: PropTypes.bool
    })).isRequired,
    tab: PropTypes.number,
    setTab: PropTypes.func,
    onBeforeSwitch: PropTypes.func
}