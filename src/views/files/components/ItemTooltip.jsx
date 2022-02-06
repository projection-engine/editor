import {ToolTip} from "@f-ui/core";
import styles from "../styles/ItemCard.module.css";
import React from "react";
import PropTypes from "prop-types";

export default function ItemTooltip(props){
    return (
        <ToolTip align={"middle"} justify={'end'}>
            <div className={styles.toolTip}>
                <div className={styles.infoRow}>
                    Name:
                    <div className={styles.infoRowContent}>
                        {props.currentLabel}
                    </div>
                </div>
                <div className={styles.infoRow}>
                    Creation date:
                    <div className={styles.infoRowContent}>
                        {props.data.creationDate?.toLocaleDateString()}
                    </div>
                </div>
                {props.type === 'File' ?
                    <>
                        <div className={styles.infoRow}>
                            Type:
                            <div className={styles.infoRowContent}>
                                {props.data.type}
                            </div>
                        </div>
                        <div className={styles.infoRow}>
                            Size:
                            <div className={styles.infoRowContent}>
                                {props.data.size ? (props.data.size < 100000 ? (props.data.size / 1000).toFixed(2) + 'KB' : (props.data.size / (10 ** 6)).toFixed(2) + ' MB') : 'NaN'}
                            </div>
                        </div>
                        <div className={styles.infoRow}>
                            ID:
                            <div className={styles.infoRowContent}>
                                {props.data.id}
                            </div>
                        </div>
                    </>
                    :
                    null
                }
            </div>
        </ToolTip>
    )
}
ItemTooltip.propTypes={
    type: PropTypes.string,
    data: PropTypes.object,
    currentLabel: PropTypes.string
}