const express = require('express')
const app = express()
const generateGif = require('./js/generateGif')
const tootImage = require('./js/mastodon')
const checkIfGeneratedWithinAnHour = require('./js/throttle')

app.use(express.static('public'))

app.get('/'  + process.env.BOT_ENDPOINT, (req, res) => {
  res.status(200).send('hamilton path generating')
  
  checkIfGeneratedWithinAnHour(generatedWithinAnHour => {
    if (generatedWithinAnHour === true) {
      return console.info("didn't generate GIF, within an hour")
    }

    console.info('generating gif', new Date().toGMTString())
    generateGif(() => {
      console.info('gif generated', new Date().toGMTString())
      tootImage('A GIF of hamiltonian path spiralling round')
    })
  })
})

app.get('/', (req, res) => {
  res.status(200).send('<a href="https://botsin.space/@hamiltonian">hamiltonian bot</a><img style="border: 1px solid black;" src="myanimated.gif" />')
})

app.listen(3000, () => {
  console.log('hamiltonian app listening on port 3000')
})