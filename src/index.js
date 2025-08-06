/*
 * LightningChartJS example that showcases a simulation of daily temperature variations.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Extract required parts from LightningChartJS.
const { lightningChart, AxisTickStrategies, SolidFill, SolidLine, ColorRGBA, ColorHEX, LinearGradientFill, Themes } =
    lcjs

// Create a XY Chart.
const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .ChartXY({
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle('Daily temperature range, April 2019')

const axisX = chart.getDefaultAxisX()
const axisY = chart.getDefaultAxisY().setTitle('Temperature').setUnits('°C').setScrollStrategy(undefined)

// Use DateTime TickStrategy and set the interval
axisX.setTickStrategy(AxisTickStrategies.DateTime).setInterval({
    start: new Date(2019, 0, 1).getTime(),
    end: new Date(2019, 0, 31).getTime(),
})

// Daily temperature records
const recordRange = chart.addAreaRangeSeries()
// Current month daily temperature variations
const currentRange = chart.addAreaRangeSeries()
// ----- Series stylings
// Temperature records fill style, gradient Red - Blue scale.
const recordRangeFillStyle = new LinearGradientFill({
    angle: 0,
    stops: [
        { color: ColorHEX('#0000FF9F'), offset: 0 },
        { color: ColorHEX('#FF00009F'), offset: 1 },
    ],
})
// Record range stroke fill style, high line
const recordRangeStrokeFillStyleHigh = new SolidLine().setFillStyle(new SolidFill({ color: ColorRGBA(250, 91, 70) }))
// Record range stroke fill style, low line
const recordRangeStrokeFillStyleLow = new SolidLine().setFillStyle(new SolidFill({ color: ColorRGBA(63, 138, 250) }))
// Current month temperature fill style
const currentRangeFillStyle = new SolidFill({ color: ColorRGBA(255, 174, 0, 200) })
// Current range stroke fill style
const currentRangeStrokeFillStyle = new SolidLine().setFillStyle(new SolidFill({ color: ColorRGBA(250, 226, 105) }))
// ----- Applying stylings
// Record range
recordRange
    .setName('Temperature records range')
    .setHighFillStyle(recordRangeFillStyle)
    // Same fill style for the highlighted series
    .setHighStrokeStyle(recordRangeStrokeFillStyleHigh)
    .setLowStrokeStyle(recordRangeStrokeFillStyleLow)
// Current range
currentRange
    .setName('2019 temperatures')
    .setHighFillStyle(currentRangeFillStyle)
    .setHighStrokeStyle(currentRangeStrokeFillStyle)
    .setLowStrokeStyle(currentRangeStrokeFillStyle)

// ----- Generating data
const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
const currentRangeData = []
const recordRangeData = []
// Current range
for (let i = 0; i < 31; i++) {
    const randomPoint = () => {
        const x = new Date(2019, 0, i + 1).getTime()
        let yMax
        if (i > 0) {
            const previousYMax = currentRangeData[i - 1].yMax
            yMax = randomInt(previousYMax - 5, previousYMax + 5)
        } else {
            yMax = randomInt(-5, 25)
        }
        const yMin = randomInt(yMax - 5, yMax) - 5
        return {
            x,
            yMax,
            yMin,
        }
    }
    currentRangeData.push(randomPoint())
}

let recordYMax = currentRangeData[0].yMax
let recordYMin = currentRangeData[0].yMin
for (let i = 1; i < currentRangeData.length; i++) {
    if (currentRangeData[i].yMin < recordYMin) recordYMin = currentRangeData[i].yMin
    if (currentRangeData[i].yMax > recordYMax) recordYMax = currentRangeData[i].yMax
}
// Set series interval
axisY.setInterval({ start: recordYMin - 5, end: recordYMax + 5, stopAxisAfter: false })
// ----- Generate record temperatures
for (let i = 0; i < 31; i++) {
    const randomPoint = () => {
        const x = new Date(2019, 0, i + 1).getTime()
        const yMax = randomInt(recordYMax - 2, recordYMax + 2)
        const yMin = randomInt(recordYMin - 1, recordYMin)
        return {
            x,
            yMax,
            yMin,
        }
    }
    recordRangeData.push(randomPoint())
}
// ----- Adding data points
recordRangeData.forEach((point, i) => {
    recordRange.add({ position: point.x, high: point.yMax, low: point.yMin })
})

currentRangeData.forEach((point, i) => {
    currentRange.add({ position: point.x, high: point.yMax, low: point.yMin })
})
