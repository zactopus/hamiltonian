
const fetch = require('node-fetch')
const hexRgb = require('hex-rgb')
  
function randomNumberBetween (min, max) {
  return Math.floor(Math.random() * (max - min + 1 ) + min)
}

function generateRandomColours () {
  const statsUrl = 'https://randoma11y.com/stats'
  return fetch(statsUrl)
    .then(response => response.json())
    .then(stats => {
      const url = `https://randoma11y.com/combos?page=${randomNumberBetween(1, stats.combos)}&per_page=1`
      return fetch(url)
        .then(response => response.json())
        .then(results => results[0])
        .then(data => {
          const { color_one, color_two } = data

          return [
            hexRgb(color_one, { format: 'array' }),
            hexRgb(color_two, { format: 'array' })
          ]
        })
    })
}

module.exports = {
  generateRandomColours
}