const fs = require('fs')

const ONE_HOUR = 60 * 60 * 1000 // ms

const fileContent = new Date().toISOString()

function checkIfGeneratedWithinAnHour (callback) {
  const pathToThrottleFile = 'public/lastGenerated.txt'

  const lastGeneratedTime = fs.readFileSync(pathToThrottleFile).toString()

  const withinAnHour = ((new Date) - new Date(lastGeneratedTime) < ONE_HOUR)
  if (withinAnHour) {
    return callback(true)
  }

  fs.writeFile(pathToThrottleFile, fileContent, (err) => {
    if (err) {
      console.error(err)
      return callback(false)
    }

    return callback(false)
  })
}

module.exports = checkIfGeneratedWithinAnHour