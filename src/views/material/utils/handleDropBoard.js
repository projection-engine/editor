import {materialAvailable} from "../templates/MaterialAvailable";
import {basicAvailable} from "../templates/BasicAvailable";
import {algebraAvailable} from "../templates/AlgebraAvailable";

export default function handleDropBoard(data) {
    let newNode

    const find = (current) => {
        let n = current.find(el => el.dataTransfer === data)
        if (n)
            n = n.getNewInstance()

        return n
    }
    const basic = basicAvailable,
        algebra = algebraAvailable

    newNode = find(materialAvailable)
    if (!newNode)
        newNode = find(basic)
    if (!newNode)
        newNode = find(algebra)


    return newNode
}