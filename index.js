const express = require('express')
const generator = require('./generator')

const app = express()
const port = 5005

var devices = ["Living room",
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

const zones = devices.map(device => {
    return {
        "uuid": device.uuid,
        "coordinator": device,
        "members": [device]
    }
})

app.get('/zones', (req, res) => {
    res.json(zones)
})

app.get('/:roomName/join/:otherRoomName', (req, res) => {
    let device = deviceMap[req.params.roomName]
    let otherDevice = deviceMap[req.params.otherRoomName]
    if (!device || !otherDevice) {
        return res.json({
            "status": "error"
        })
    }

    /* Scenarios:
    - [ ] room is not a zone
    - [ ] room is member of the "otherRoomName" zone
    - [ ] room is member of another zone
    - [ ] room and OtherRoom are coordinator/member of the same zone
    - [ ] room is coordinator of another zone
    */

    res.json({
        "status": "success"
    })
})

app.get('/:roomName/leave', (req, res) => {
    let device = deviceMap[req.params.roomName]
    if (!device) {
        return res.json({
            "status": "error"
        })
    }

    /* Scenarios:
    - [ ] room is not a member of any zone
    - [ ] room is member (child) of a zone
    - [ ] room is coordinator of a zone
    */

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
