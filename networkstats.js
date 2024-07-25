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
let numberOfPacketsGreaterThan100MsOverAverage = 0
let numberOfPacketsGreaterThan150MsOverAverage = 0
let numberOfPacketsGreaterThan200MsOverAverage = 0
let numberOfPacketsGreaterThan300MsOverAverage = 0
let numberOfPacketsGreaterThan500MsOverAverage = 0
let numberOfPacketsGreaterThanHalfOverAverage = 0
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
        if (deltaT > averageTimeBetweenPackets + 100) {
            ++numberOfPacketsGreaterThan100MsOverAverage
        }
        if (deltaT > averageTimeBetweenPackets + 150) {
            ++numberOfPacketsGreaterThan150MsOverAverage
        }
        if (deltaT > averageTimeBetweenPackets + 200) {
            ++numberOfPacketsGreaterThan200MsOverAverage
        }
        if (deltaT > averageTimeBetweenPackets + 300) {
            ++numberOfPacketsGreaterThan300MsOverAverage
        }
        if (deltaT > averageTimeBetweenPackets + 500) {
            ++numberOfPacketsGreaterThan500MsOverAverage
        }
        if (deltaT > 1.5 * averageTimeBetweenPackets) {
            ++numberOfPacketsGreaterThanHalfOverAverage
        }
        if (deltaT > 2 * averageTimeBetweenPackets) {
            ++numberOfPacketsGreaterThanTwiceAverage
        }

        if (lastReportTimestamp === null) {
            report(now)
            setInterval(() => report(Date.now()),
                10_000)
        }
    }
    lastPacketTimestamp = now
}

function report(now) {
    lastReportTimestamp = now
    console.log(`\n\n`)
    console.clear()
    console.log('lastPacketTimestamp:', lastPacketTimestamp)
    console.log('numberOfPacketsReceived:', numberOfPacketsReceived)
    console.log('totalTimeBetweenPackets:', totalTimeBetweenPackets)
    console.log('minimumTimeBetweenPackets:', minimumTimeBetweenPackets)
    console.log('averageTimeBetweenPackets:', averageTimeBetweenPackets)
    console.log('maximumTimeBetweenPackets:', maximumTimeBetweenPackets)
    console.log('numberOfPacketsGreaterThan100MsOverAverage:', numberOfPacketsGreaterThan100MsOverAverage)
    console.log('numberOfPacketsGreaterThan150MsOverAverage:', numberOfPacketsGreaterThan150MsOverAverage)
    console.log('numberOfPacketsGreaterThan200MsOverAverage:', numberOfPacketsGreaterThan200MsOverAverage)
    console.log('numberOfPacketsGreaterThan300MsOverAverage:', numberOfPacketsGreaterThan300MsOverAverage)
    console.log('numberOfPacketsGreaterThan500MsOverAverage:', numberOfPacketsGreaterThan500MsOverAverage)
    console.log('numberOfPacketsGreaterThanHalfOverAverage:', numberOfPacketsGreaterThanHalfOverAverage)
    console.log('numberOfPacketsGreaterThanTwiceAverage:', numberOfPacketsGreaterThanTwiceAverage)
}
