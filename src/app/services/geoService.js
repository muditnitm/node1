import bluebird from 'bluebird'
import geoLib from 'geolib'
const gMapObject = bluebird.promisifyAll(require('@google/maps'))

var gMap;
process.nextTick(() => {
    gMap = gMapObject.createClient({
        key: process.env.GOOGLE_MAPS_API_KEY,
        Promise: Promise
    })
})

export function orderCoordinates(referencePoint, drivers, maxPoints, maxDistance) {
    let distances = geoLib.orderByDistance(
        referencePoint,
        drivers.map(getDriverLocation)
    );
    let result = [];
    for (let i = 0; i < distances.length; i++) {
        if (i == maxPoints)
            break;
        if (distances[i].distance > maxDistance)
            break;
        result.push({
            id: drivers[distances[i].key].id,
            location: drivers[distances[i].key].location,
            distance: distances[i].distance
        });
    }
    if (result.length < 1)
        throw new Error(303);
    return result;
}
export async function calculateDistance(referencePoint, coordinate) {
    return await gMap.distanceMatrix({
        'origins': [[referencePoint.lng, referencePoint.lat]],
        'destinations': [[coordinate.lng, coordinate.lat]]
    }).asPromise();
}
export async function calculateDistances(referencePoint, coordinates) {
    let points = [];
    for (let coordinate of coordinates) {
        let geo = gMap.distanceMatrix({
            'origins': [[referencePoint.latitude, referencePoint.longitude]],
            'destinations': [[coordinate.location.latitude, coordinate.location.longitude]]
        }).asPromise();
        points.push(geo);
    }
    return points;
}
export function geoParser(geo) {
    if (geo.json.rows[0].elements[0].status == "ZERO_RESULTS")
        return {
            distance: {
                text: 0,
                value: 0
            },
            duration: {
                text: 0,
                value: 0
            }
        };
    else
        return geo.json.rows[0].elements[0];
}
export function getDriverLocation(driver) {
    return driver.location;
}
export function latLngToPoint(lat, lng) {
    return { latitude: lat, longitude: lng };
}