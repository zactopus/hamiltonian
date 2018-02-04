const generatePath = require('./generatePath')
const Canvas = require('canvas')
const GIFEncoder = require('gifencoder')
const fs = require('fs')

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const canvas = new Canvas(440, 220)

if (!canvas.getContext) {
  console.error("Couldn't get canvas context")
}

const ctx = canvas.getContext('2d')
ctx.lineCap = 'square'

function fillPage (color) {
  ctx.beginPath()
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = color
  ctx.fill()
}
fillPage('white')

function rgbColour(s, c1, c2) {
  const r = Math.floor(s * c1[0] + (1 - s) * c2[0])
  const g = Math.floor(s * c1[1] + (1 - s) * c2[1])
  const b = Math.floor(s * c1[2] + (1 - s) * c2[2])
  return `rgb(${r}, ${g}, ${b})`
}

function drawPath(n, xmax, ymax, path, callback) {
  //Calculate scale factors to convert to image location.
  var pad = 1.0;
  var sw = canvas.width / (xmax + 2.0 * pad);
  var sh = canvas.height / (ymax + 2.0 * pad);
  sh = Math.min(sw, sh);
  sw = sh

  var lineWidth = Math.ceil(0.3 + (getRandomInt(6)/10) * Math.min(sw, sh));
  ctx.lineWidth = lineWidth

  // Draw path
  const randomNumber = (amount) => {
    return Math.floor(Math.random()*255)
  }
  
  const randomColour = () => {
    return [randomNumber(), randomNumber(), randomNumber()]
  }
    
  const rgbLeft = randomColour()
  const rgbRight = randomColour()
  
  const encoder = new GIFEncoder(440, 220)

  encoder.createReadStream().pipe(fs.createWriteStream('public/myanimated.gif'));

  encoder.start();
  encoder.setRepeat(0)  // 0 for repeat, -1 for no-repeat
  encoder.setFrameRate(60) // frame delay in ms
  encoder.setQuality(10) // image quality. 10 is default.
  
  encoder.addFrame(ctx)
  
  for (let i = 1; i < n; i++) {
    drawLine(path, i, pad, n, sw, sh, rgbLeft, rgbRight)
    encoder.addFrame(ctx)
  }
  
  encoder.finish()
  
  const buf = encoder.out.getData()
  fs.writeFile('public/myanimated.gif', buf, err => {
    if (err) console.error(err)
    callback()
  })
}

function drawLine(path, i, pad, n, sw, sh, rgbLeft, rgbRight) {
  ctx.beginPath();
  ctx.strokeStyle = rgbColour((n-1-i) / (n-1),rgbLeft,rgbRight)
  ctx.moveTo((pad + path[i-1][0]) * sw, (pad+path[i-1][1]) * sh)
  ctx.lineTo((pad + path[i][0]) * sw, (pad + path[i][1]) * sh)
  if (i < n - 1) {
    ctx.lineTo((pad+path[i+1][0])*sw,(pad+path[i+1][1])*sh)
  }
  ctx.stroke()
}

function createAndDrawPath (callback) {
  const [n, xmax, ymax, path] = generatePath()
  drawPath(n, xmax, ymax, path, callback)
  return
}

module.exports = createAndDrawPath