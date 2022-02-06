import Node from '../../templates/Node'
import {TextField} from "@f-ui/core";

export default class Constant extends Node {
    constructor(value = 0.0) {
        super([], {label: 'Value', key: 'value'});
        this.value = value
        this.name = 'Constant'
    }

    form(handleChange) {
        return (

            <TextField
                handleChange={e => {
                    handleChange({key: 'value', value: parseFloat(e.target.value)})
                }}
                value={this.value} type={'number'}
            />
     
        )
    }
}