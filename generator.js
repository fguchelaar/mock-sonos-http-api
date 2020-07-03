module.exports = function (name) {
    let uuid = "RINCON_xxxxxxxxxxxxxxxxx".replace(/[x]/g, (c) => {
        return ((Math.random() * 16) | 0).toString(16).toUpperCase()
    })

    return {
        "uuid": `${uuid}`,
        "state": {
            "volume": Math.round(Math.random() * 25),
            "mute": false,
            "equalizer": {
                "bass": 0,
                "treble": 0,
                "loudness": true
            },
            "currentTrack": {
                "artist": "",
                "title": "",
                "album": "",
                "albumArtUri": "",
                "duration": 0,
                "uri": "",
                "trackUri": "",
                "type": "track",
                "stationName": ""
            },
            "nextTrack": {
                "artist": "",
                "title": "",
                "album": "",
                "albumArtUri": "",
                "duration": 0,
                "uri": ""
            },
            "trackNo": 0,
            "elapsedTime": 0,
            "elapsedTimeFormatted": "00:00:00",
            "playbackState": "STOPPED",
            "playMode": {
                "repeat": "none",
                "shuffle": false,
                "crossfade": false
            }
        },
        "roomName": `${name}`,
        "coordinator": `${uuid}`,
        "groupState": {
            "volume": 5,
            "mute": false
        }
    }
}
