import * as fs from "node:fs";

fs.read(0, handleIncomingData)

let decoder = new TextDecoder()
console.log(decoder.encoding)

console.log("Waiting for data...")

function handleIncomingData(error, n, data) {
    if (error) {
        console.error(`Error while reading from stdin: ${error}`)
        process.exit(1)
    }
    if (n !== 0) {
        // console.log(n)
        // console.log(decoder.decode(data.slice(0, n)).trim())
        handleReceivedPacket()
        fs.read(0, handleIncomingData)
    } else {
        process.exit(0)
    }
}

let lastPacketTimestamp = null
let numberOfPacketsReceived = 0
let totalTimeBetweenPackets = 0
let minimumTimeBetweenPackets = null
let averageTimeBetweenPackets = null
let maximumTimeBetweenPackets = null
let numberOfPacketsGreaterThanTwiceAverage = 0

let lastReportTimestamp = null

function handleReceivedPacket() {
    let now = Date.now()
    ++numberOfPacketsReceived
    if (lastPacketTimestamp !== null) {
        let deltaT = now - lastPacketTimestamp
        totalTimeBetweenPackets += deltaT
        if (numberOfPacketsReceived === 2) {
            minimumTimeBetweenPackets = deltaT
            maximumTimeBetweenPackets = deltaT
            averageTimeBetweenPackets = deltaT
        } else {
            if (deltaT < minimumTimeBetweenPackets) {
                minimumTimeBetweenPackets = deltaT
            }
            averageTimeBetweenPackets = totalTimeBetweenPackets / (numberOfPacketsReceived - 1)
            if (deltaT > maximumTimeBetweenPackets) {
                maximumTimeBetweenPackets = deltaT
            }
        }
        if (deltaT > 2 * averageTimeBetweenPackets) {
            ++numberOfPacketsGreaterThanTwiceAverage
        }

        if (lastReportTimestamp === null) {
            report(now)
            setInterval(() => report(Date.now()),
                1_000)
        }
    }
    lastPacketTimestamp = now
}

function report(now) {
    lastReportTimestamp = now
    console.clear()
    console.log('lastPacketTimestamp:', lastPacketTimestamp)
    console.log('numberOfPacketsReceived:', numberOfPacketsReceived)
    console.log('totalTimeBetweenPackets:', totalTimeBetweenPackets)
    console.log('minimumTimeBetweenPackets:', minimumTimeBetweenPackets)
    console.log('averageTimeBetweenPackets:', averageTimeBetweenPackets)
    console.log('maximumTimeBetweenPackets:', maximumTimeBetweenPackets)
    console.log('numberOfPacketsGreaterThanTwiceAverage:', numberOfPacketsGreaterThanTwiceAverage)
}
