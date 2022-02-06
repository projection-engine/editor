import styles from './styles/Color.module.css'
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Button, Modal, ToolTip} from "@f-ui/core";
import {RgbColorPicker} from "react-colorful";


export default function ColorPicker(props) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState({r: 0, g: 0, b: 0})
    useEffect(() => {
        if (typeof props.value === 'string') {
            const split = props.value.match(/[\d.]+/g)
            const [r, g, b, a] = split.map(v => parseFloat(v))
            setValue({r: r, g: g, b: b, a: a})
        }
    }, [props.value])
    return (
        <div className={styles.wrapper}>
            <Modal blurIntensity={0} variant={'fit'} open={open} handleClose={() => null}
                   className={styles.modal}>
                <RgbColorPicker color={value} onChange={e => setValue(e)}/>
                <div className={styles.buttons}>
                    <Button className={styles.button} variant={'filled'}
                            onClick={() => {
                                setOpen(false)
                                props.submit(`rgb(${value.r},${value.g},${value.b})`)
                            }}>
                        Ok
                    </Button>
                    <Button className={styles.button} onClick={() => {
                        setOpen(false)
                        setValue({r: 0, g: 0, b: 0})
                    }}>
                        Cancel
                    </Button>
                </div>
            </Modal>
            <div className={styles.label}>{props.label}</div>
            <Button className={styles.placeholder} styles={{background: `rgb(${value.r},${value.g},${value.b})`}}
                    onClick={() => setOpen(true)}>
                <ToolTip content={`rgb(${value.r},${value.g},${value.b})`}/>
            </Button>
        </div>
    )
}

ColorPicker.propTypes = {
    label: PropTypes.string,
    submit: PropTypes.func.isRequired,
    value: PropTypes.string
}