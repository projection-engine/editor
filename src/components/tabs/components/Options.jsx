import React, {useMemo} from "react";
import PropTypes from "prop-types";
import styles from "../styles/Options.module.css";
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import groupBy from "../../../views/editor/utils/misc/groupBy";


export default function Options(props) {
    const groups = useMemo(() => {

        if (props.options.length === 0) {
            return groupBy(props.fallbackOptions, 'group')
        } else
            return groupBy(props.options, 'group')
    }, [props.options])

    return (
        <div className={styles.options}>
            {Object.keys(groups).map((g, i) => (
                <React.Fragment key={i + '-group'}>
                    {i > 0 ? <div className={styles.divider}/> : null}
                    <div className={styles.group}>
                        {groups[g].map((option, index) => {
                            if (option.type === 'dropdown') {
                                return (
                                    <React.Fragment key={i + '-option-' + index}>
                                        <Dropdown
                                            align={'bottom'}
                                            justify={"start"}
                                            className={styles.option}
                                        >
                                            {option.icon}
                                            {option.label}
                                            <DropdownOptions>
                                                {option.options.map((o, index) => (
                                                    <React.Fragment key={index + '-option-'+o.label}>
                                                        <DropdownOption option={o} />
                                                    </React.Fragment>
                                                ))}
                                            </DropdownOptions>
                                        </Dropdown>
                                    </React.Fragment>
                                )
                            } else
                                return (
                                    <React.Fragment key={i + '-option-' + index}>
                                        <Button onClick={option.onClick} className={styles.option}>
                                            {option.icon}
                                            {option.label}
                                        </Button>
                                    </React.Fragment>
                                )
                        })}
                    </div>
                </React.Fragment>
            ))}
        </div>
    )
}
Options.propTypes = {
    options: PropTypes.array,
    fallbackOptions: PropTypes.array,

}