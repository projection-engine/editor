import Node from './Node'

export default class ObjectArray extends Node {
    constructor(values = [], inputs, outputs) {
        super(inputs, outputs);
        this.values = values
    }
}