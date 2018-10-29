const postmark = require('postmark')
const POSTMARK_SERVER_TOKEN = "ff280493-677d-486a-a10a-7bf5246710d0"
const EMAIL_FROM = "reserveer@decentraledelft.nl"
const EMAIL_TO = "hallo@decentraledelft.nl"
const client = new postmark.Client(POSTMARK_SERVER_TOKEN)

exports.handler = function (event, context, callback) {
	const options = {
		"From": EMAIL_FROM,
		"To": EMAIL_TO,
		"Subject": "Test",
		"TextBody": "Hello from Postmark!"
	}
	const callbackHandler = {
		statusCode: 302,
		headers: {
			"Location": '/bedankt/'
		},
		body: ''
	}

	client.sendEmail(options)
		.then(result => {
			console.log('result', result)
			callback(null, callbackHandler)
		})
		.catch(error => console.error('error', error))
}