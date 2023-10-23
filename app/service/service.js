import axios from 'axios'

export function sendMessage(data) {
  const config = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data
  }

  return axios(config)
}

export function getTextMessageInput(recipient, text) {
  return JSON.stringify({
    messaging_product: 'whatsapp',
    preview_url: false,
    recipient_type: 'individual',
    to: recipient,
    type: 'text',
    text: {
      body: text
    }
  })
}
