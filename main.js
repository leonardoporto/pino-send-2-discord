'use strict'
const { Writable } = require('stream')
const { WebhookClient } = require('discord.js')

module.exports = function pinoDiscord({ url, level, onlyLevel }) {
  const webhookClient = new WebhookClient({ url })
  return new Writable({
    write(chunk, _enc, cb) {
      // apply a transform and send to stdout
      const log = JSON.parse(chunk.toString())
      if (onlyLevel && log.level == onlyLevel) {
        console.log(log)
        webhookClient.send(
          '```json\n' +
          JSON.stringify(log, null, 2) +
          '```'
        )
      }
      if (!onlyLevel && log.level <= (level || 10)) {
        webhookClient.send(
          'Ocorreu um erro: ```json \n' +
          JSON.stringify(log, null, 2) +
          '```'
        )
      }
      cb()
    }
  })
}