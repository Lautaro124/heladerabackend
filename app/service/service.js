import axios from 'axios'

export function sendMessage (templateName) {
  const config = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: {
      messaging_product: 'whatsapp',
      to: '541163218781',
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'es_AR' }
      }
    }
  }

  return axios(config)
}
