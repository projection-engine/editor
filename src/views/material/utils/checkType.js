export default function checkType(nodeType, accept = []) {
    return accept.includes(nodeType.trim())
}