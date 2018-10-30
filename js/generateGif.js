const generatePath = require('./generatePath')
const Canvas = require('canvas')
const GIFEncoder = require('gifencoder')
const fs = require('fs')
const { generateRandomColours } = require('./colours')

let isGradient = true
let whiteOnColour = true
let ctx
let canvas

const CANVAS_WIDTH = 460
const CANVAS_HEIGHT = 260

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomNumber(amount) {
  return Math.floor(Math.random()*255)
}

function arrayToRGB (arr) {
  const [r, g, b] = arr
  return `rgb(${r}, ${g}, ${b})`
}

function rgbColour(s, c1, c2) {
  const r = Math.floor(s * c1[0] + (1 - s) * c2[0])
  const g = Math.floor(s * c1[1] + (1 - s) * c2[1])
  const b = Math.floor(s * c1[2] + (1 - s) * c2[2])
  return arrayToRGB([r, g, b])
}

function drawPath(n, xmax, ymax, path, callback) {
  //Calculate scale factors to convert to image location.
  var pad = 1.0;
  var sw = canvas.width / (xmax + 2.0 * pad)
  var sh = (canvas.height / (ymax + 2.0 * pad))
  sh = Math.min(sw, sh);
  sw = sh

  var lineWidth = Math.ceil(0.85 * Math.min(sw, sh))
  ctx.lineWidth = lineWidth
  
  generateRandomColours().then((randomColours) => {
    let [ rgbLeft, rgbRight ] = randomColours
    
    if (isGradient) {
      rgbRight = rgbLeft
    }

    if (whiteOnColour) {
      rgbLeft = [255, 255, 255]
      rgbRight = [255, 255, 255]
    }

    const encoder = new GIFEncoder(CANVAS_WIDTH, CANVAS_HEIGHT)

    const quality = (xmax === 38) ? 5 : 10

    encoder.start()
    encoder.setRepeat(0)  // 0 for repeat, -1 for no-repeat
    encoder.setFrameRate(20)
    encoder.setQuality(quality) // image quality. 10 is default.

    const INTIAL_FRAMES_AMOUNT = 5
    const FINISHED_FRAMES_AMOUNT = 60

    for (let i = 0; i < INTIAL_FRAMES_AMOUNT; i++) {
      encoder.addFrame(ctx)
    }

    for (let i = 1; i < n; i++) {
      console.log('Frame ', i, ' of ', n);
      drawLine(path, i, pad, n, sw, sh, rgbLeft, rgbRight)
      encoder.addFrame(ctx)
    }

    for (let i = 0; i < FINISHED_FRAMES_AMOUNT; i++) {
      encoder.addFrame(ctx)
    }

    encoder.finish()

    const buf = encoder.out.getData()
    fs.writeFile('public/myanimated.gif', buf, err => {
      if (err) console.error(err)
      callback()
    })
  })
}

function drawLine(path, i, pad, n, sw, sh, rgbLeft, rgbRight) {
  ctx.beginPath();
  ctx.strokeStyle = rgbColour((n-1-i) / (n-1),rgbLeft,rgbRight)
  ctx.moveTo((pad + path[i-1][0]) * sw, (pad+path[i-1][1]) * sh)
  ctx.lineTo((pad + path[i][0]) * sw, (pad + path[i][1]) * sh)
  if (i < n - 1) {
    ctx.lineTo((pad+path[i+1][0])*sw, (pad+path[i+1][1])*sh)
  }
  ctx.stroke()
}

function createAndDrawPath (callback) {
  whiteOnColour = (getRandomInt(10) > 5)
  isGradient = (getRandomInt(10) > 5)

  canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx = canvas.getContext('2d')
  ctx.lineCap = 'square'
  
  ctx.fillStyle = 'white'
  generateRandomColours().then((randomColours) => {
    const [ colorOne, colorTwo ] = randomColours
    
    if (whiteOnColour) {
      if (isGradient) {
        const gradient = ctx.createLinearGradient(
          0, 0,
          canvas.width, canvas.height
        )

        gradient.addColorStop(0, arrayToRGB(colorOne))
        gradient.addColorStop(1, arrayToRGB(colorTwo))

        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = arrayToRGB(colorOne)
      }
    }
    ctx.fillRect(
      0, 0,
      canvas.width, canvas.height
    )

    const [n, xmax, ymax, path] = generatePath()
    drawPath(n, xmax, ymax, path, callback)
  })
}

module.exports = createAndDrawPath