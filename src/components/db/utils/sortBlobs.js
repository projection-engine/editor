export default function sortBlobs( a, b ) {
    if ( a.partIndex < b.partIndex ){
        return -1;
    }
    if ( a.partIndex > b.partIndex ){
        return 1;
    }
    return 0;
}