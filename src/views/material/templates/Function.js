import Node from './Node'

export default class Function extends Node {
    constructor(inputs, outputs={label: 'Result', key: 'response'}) {
        super(inputs, outputs)
    }
}