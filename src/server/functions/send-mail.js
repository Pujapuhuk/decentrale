const postmark = require('postmark')
const POSTMARK_SERVER_TOKEN = "ff280493-677d-486a-a10a-7bf5246710d0"
const EMAIL_FROM = "reserveer@decentraledelft.nl"
const EMAIL_TO = "hallo@decentraledelft.nl"
const client = new postmark.Client(POSTMARK_SERVER_TOKEN)

console.log('in send-mail.js')

exports.handler = function (event, context, calback) {
	const options = {
		"From": EMAIL_FROM,
		"To": EMAIL_TO,
		"Subject": "Test",
		"TextBody": "Hello from Postmark!"
	}

	client.sendEmail(options)
		.then(result => console.log('result', result))
		.catch(error => console.error('error', error))
}