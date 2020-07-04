const express = require('express')
const generator = require('./generator')

const app = express()
const port = 5005

const devices = ["Living room",
    "Kitchen",
    "Garage",
    "Bedroom",
    "Attic"
].map(name => {
    return generator(name)
})

const deviceMap = devices.reduce((map, device) => {
    map[device.roomName] = device
    return map
}, {})

var zones = devices.map(device => {
    return {
        "uuid": device.uuid,
        "coordinator": device,
        "members": [device]
    }
})

app.get('/zones', (req, res) => {
    res.json(zones)
})

/* Scenarios:
- [X] room is not a zone
- [X] room is member of the "otherRoomName" zone
- [X] room is member of another zone
- [X] room is coordinator of the "otherRoomName" zone
- [X] room is coordinator of another zone
*/
app.get('/:roomName/join/:otherRoomName', (req, res) => {
    let device = deviceMap[req.params.roomName]
    let otherDevice = deviceMap[req.params.otherRoomName]
    if (!device || !otherDevice || (device.roomName === otherDevice.roomName)) {
        return res.json({
            "status": "error"
        })
    }

    let currentZone = zones.find(z =>
        z.members.find(m =>
            m.roomName == device.roomName) !== undefined)

    let otherZone = zones.find(z =>
        z.members.find(m =>
            m.roomName == otherDevice.roomName) !== undefined)

    console.log("current", currentZone);
    console.log("new", otherZone);

    // room is not in a zone
    if (currentZone.members.length === 1) {
        otherZone.members.push(device)
        zones.splice(zones.indexOf(currentZone), 1)
    } else if (currentZone.coordinator.uuid == device.uuid) {
        // the device is a coordinator of it's current zone

        // it's illegal to have the coordinator join one of it's members
        if (otherZone.coordinator.uuid == device.uuid) {
            return res.json({
                "status": "error"
            })
        }

        // 1. remove from members of currentZone
        currentZone.members.splice(currentZone.members.indexOf(device), 1)
        // 2. set first member of currentZone as coordinator
        currentZone.coordinator = currentZone.members[0]
        currentZone.uuid = currentZone.coordinator.uuid
        // 3. add as member of otherZone
        otherZone.members.push(device)
    } else {
        // 1. remove from members of currentZone
        currentZone.members.splice(currentZone.members.indexOf(device), 1)
        // 2. add as member of otherZone
        otherZone.members.push(device)
    }
    res.json({
        "status": "success"
    })
})

/* Scenarios:
- [X] room is not a member of any zone // TODO: error?
- [X] room is member (child) of a zone
- [X] room is coordinator of a zone
*/
app.get('/:roomName/leave', (req, res) => {
    let device = deviceMap[req.params.roomName]
    if (!device) {
        return res.json({
            "status": "error"
        })
    }

    let currentZone = zones.find(z =>
        z.members.find(m =>
            m.roomName == device.roomName) !== undefined)

    // If we're not in a combined group, we don't have to do anything
    if (currentZone.members.length > 1) {

        // 1. remove from members of currentZone
        currentZone.members.splice(currentZone.members.indexOf(device), 1)

        // If device is the coordinator, than promote another device!
        if (currentZone.coordinator.uuid == device.uuid) {
            // 2. set first member of currentZone as coordinator
            currentZone.coordinator = currentZone.members[0]
            currentZone.uuid = currentZone.coordinator.uuid
        }

        // 3. add the device to a singular zone
        zones.push({
            "uuid": device.uuid,
            "coordinator": device,
            "members": [device]
        })
    }

    res.json({
        "status": "success"
    })
})

app.get('/:roomName/volume/:volume', (req, res) => {
    let {
        roomName,
        volume
    } = req.params

    volume = parseInt(volume)
    let device = deviceMap[roomName]
    if (!device || isNaN(volume)) {
        return res.json({
            "status": "error"
        })
    }

    device.state.volume = parseInt(volume)
    res.json({
        "status": "success"
    })
})

app.listen(port, () =>
    console.log(`🔉 Running mock-sonos-http-api on port ${port} 🔉`)
)
