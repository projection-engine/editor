import {useRef, useState} from "react";
import styles from '../styles/Available.module.css'
import {Accordion, AccordionSummary, Button, ToolTip} from "@f-ui/core";
import {materialAvailable} from "../templates/MaterialAvailable";
import {basicAvailable} from "../templates/BasicAvailable";
import {algebraAvailable} from "../templates/AlgebraAvailable";

export default function Available() {
    const [hidden, setHidden] = useState(false)
    const ref = useRef()
    const workflowData = [
        {
            data: materialAvailable,
            label: 'MaterialInstance workflow',
            icon: <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>public</span>
        },
        {
            data: basicAvailable,
            label: 'Basic workflow',
            icon: <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>calculate</span>
        },
        {
            data: algebraAvailable,
            label: 'Algebra workflow',
            icon: <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>functions</span>
        }
    ]
    return (
        <div ref={ref} className={styles.wrapper} style={{width: hidden ? '35px' : undefined}}>
            <Button onClick={() => {
                ref.current.previousSibling.style.width = '100%'
                setHidden(!hidden)
            }} className={styles.button}
                    styles={{justifyContent: hidden ? 'center' : 'flex-start'}}>
                <div className={'material-icons-round'}
                     style={{transform: hidden ? 'rotate(180deg)' : undefined}}>chevron_right
                </div>
                {hidden ? null : 'Available nodes'}
            </Button>

            <div className={styles.content}>
                {hidden ? null : workflowData.map(data => (
                    <Accordion>
                        <AccordionSummary
                            className={styles.summary}
                            styles={{fontSize: '.9rem'}}>
                            {data.icon}
                            {data.label}
                        </AccordionSummary>
                        {data.data.map((d) => (
                            <div
                                className={styles.option}
                                draggable={true}
                                onDragStart={e => e.dataTransfer.setData('text', d.dataTransfer)}>
                                <div className={'material-icons-round'}
                                     style={{fontSize: '1.1rem'}}>drag_indicator
                                </div>
                                {d.label}
                                <ToolTip content={d.tooltip} align={'middle'} justify={'start'}/>
                            </div>
                        ))}
                    </Accordion>
                ))}
            </div>
        </div>
    )
}
