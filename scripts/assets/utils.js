export function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
}

export function circleIntersectWithRectangle(circle, rect) {
    // temporarry variables to set edges for testing
    let testX = circle.center.x;
    let testY = circle.center.y;
    let axis = null;

    // which edge is closest?
    if (circle.center.x < rect.left) {
        testX = rect.left;
        axis = 'x'
    } else if (circle.center.x > rect.right) {
        testX = rect.right;
        axis = 'x'
    }
    
    if (circle.center.y < rect.top) {
        testY = rect.top;
        axis = 'y'
    } else if (circle.center.y > rect.bottom) {
        testY = rect.bottom;
        axis = 'y'
    }

    if (axis === null) {
        const dx = circle.center.x - rect.center.x;
        const dy = circle.center.y - rect.center.y;

        axis = dx <= dy ? 'y' : 'x'
    }

    // get distance from closest edges
    const distX = circle.center.x - testX;
    const distY = circle.center.y - testY;

    const distance = Math.sqrt((distX * distX) + (distY * distY));

    // if the distance is less than the radius, collision!
    return [distance <= circle.radius, axis];
}

export function distance(c1, c2) {
    return Math.hypot(c1.x - c2.x, c1.y - c2.y);
}