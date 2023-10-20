async function service(messages) {
  const myHeaders = new Headers()
  const token = 'EAAEVlbDmLfIBO2DvZBlylZBO0vgZCcNeU8rmhZB4IaJ1WrNtZAS8ULPsJBJmUpQCBkr55pWTHDswB6ZCiMREhIXRn7IpxE8wr09WACyNumQGkTphR4BWj2UrZB8Oq6BvjCU7aZBK2ZAbILzR0xTuiHZCvM6AV2liobb05WA0pJcEpWDVuUOr915mspduP1HDDZBvFCyi4u2U14stsx0iDZBumaIZD'
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append('Authorization', 'Bearer ' + token)

  const raw = JSON.stringify({
    messaging_product: 'whatsapp',
    to: '541163218781',
    type: 'template',
    template: {
      name: messages,
      language: {
        code: 'en_US'
      }
    }
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  fetch('https://graph.facebook.com/V17.0/134465729754401/messages', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error))
}

export default service
