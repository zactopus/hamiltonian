const Twitter = require('twitter')
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const tweetGif = () => {
  console.info('tweeting the gif', new Date().toGMTString())
  
  const pathToMovie = 'public/myanimated.gif'
  const mediaData = require('fs').readFileSync(pathToMovie)
  const mediaSize = require('fs').statSync(pathToMovie).size

  initUpload(mediaSize, mediaData) // Declare that you wish to upload some media
    .then(appendUpload) // Send the data for the media
    .then(finalizeUpload) // Declare that you are done uploading chunks
    .then(mediaId => {
      client.post('statuses/update', { status: '', media_ids: mediaId },  (error, tweet, response) => {
        if (error) {
          return console.log(error)
        }
        
        console.log('tweet sent', new Date().toGMTString())
      })

    })
    .catch(console.error)
  
  function initUpload () {
    return makePost('media/upload', {
      command: 'INIT',
      total_bytes: mediaSize,
      media_type: 'image/gif',
    }).then(data => data.media_id_string)
  }
  
  function appendUpload (mediaId) {
    return makePost('media/upload', {
      command      : 'APPEND',
      media_id     : mediaId,
      media        : mediaData,
      segment_index: 0
    }).then(data => mediaId)
  }
  
  function finalizeUpload (mediaId) {
    return makePost('media/upload', {
      command : 'FINALIZE',
      media_id: mediaId
    }).then(data => mediaId)
  }
  
  function makePost (endpoint, params) {
    return new Promise((resolve, reject) => {
      client.post(endpoint, params, (error, data, response) => {
        if (error) {
          return reject(error)
        }
        
        resolve(data)
      })
    })
  }
}

module.exports = tweetGif