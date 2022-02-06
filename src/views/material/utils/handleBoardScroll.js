export default function handleBoardScroll(ref, event) {
    let scrolling = true
    let pos = {top: 0, left: 0, x: 0, y: 0};

    pos = {
        left: ref.scrollLeft,
        top: ref.scrollTop,
        x: event.clientX,
        y: event.clientY,
    };
    ref.style.cursor = 'grabbing'
    const handleMouseMove = (event) => {
        if (scrolling) {
            const dx = event.clientX - pos.x;
            const dy = event.clientY - pos.y;
            ref.scrollTop = pos.top - dy;
            ref.scrollLeft = pos.left - dx;
        }
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', () => {
        ref.style.cursor = 'default'
        document.removeEventListener('mousemove', handleMouseMove)
        scrolling = false
    }, {once: true})
}
