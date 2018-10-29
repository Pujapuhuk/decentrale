const postmark = require('postmark')
const POSTMARK_SERVER_TOKEN = process.env.POSTMARK_SERVER_TOKEN
const EMAIL_FROM = process.env.EMAIL_FROM
const EMAIL_TO = process.env.EMAIL_TO
const client = new postmark.Client(POSTMARK_SERVER_TOKEN)

console.log('in send-mail.js')

exports.handler = function (event, context, calback) {
	client.sendEmail({
		"From": EMAIL_FROM,
		"To": EMAIL_TO,
		"Subject": "Test",
		"TextBody": "Hello from Postmark!"
	})
}