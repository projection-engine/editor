const TARGET_SIZE = 5555555

export default function splitData(data){

    const size =  (new TextEncoder().encode(data)).length

    let response = [data]

    if(size > 30000000) // 30mb
        response = data.match(new RegExp('.{1,' + (TARGET_SIZE) + '}', 'g'))
    console.trace(size, response.length)
    return response
}