require('dotenv').config()

const express = require('express')
const app = express()
const generateGif = require('./js/generateGif')
const tweetGif = require('./js/tweetGif')
const checkIfGeneratedWithinAnHour = require('./js/throttle')

app.use(express.static('public'))

app.get('/' + process.env.BOT_ENDPOINT, (req, res) => {
  res.status(200).send('hamilton path generating')

  checkIfGeneratedWithinAnHour(generatedWithinAnHour => {
    if (generatedWithinAnHour === true) {
      return console.info("didn't generate GIF, within an hour")
    }

    console.info('generating gif', new Date().toGMTString())
    generateGif(() => {
      console.info('gif generated', new Date().toGMTString())
      tweetGif()
    })
  })
})

app.get('/', (req, res) => {
  res.status(200).send('<img src="myanimated.gif" />')
})

app.listen(process.env.PORT, () => {
  console.log(`hamiltonian app listening on port ${process.env.PORT}`)
})
