import Item from "./Item";
import React from 'react'

export default class Folder extends Item{
    constructor(name, parent, id, creationDate) {
        super(name, parent, id, creationDate)
    }
}
