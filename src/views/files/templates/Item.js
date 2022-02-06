import React from 'react'
import randomID from "../../editor/utils/misc/randomID";


export default class Item {
    name = ''
    parent = null
    id
    creationDate

    constructor(name, parent, id, creationDate) {
        this.id = id !== undefined ? id : randomID()
        this.name = name
        this.parent = parent
        this.creationDate = creationDate !== undefined ? creationDate : new Date()
    }

}
