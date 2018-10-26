import dotenv from 'dotenv'
import postmark from 'postmark'

dotenv.config()

const POSTMARK_SERVER_TOKEN = process.env.POSTMARK_SERVER_TOKEN
const EMAIL_FROM = process.env.EMAIL_FROM
const EMAIL_TO = process.env.EMAIL_TO
const client = new postmark.Client(POSTMARK_SERVER_TOKEN)

exports.handler = function (event, context, calback) {
	if (event.httpMethod !== 'POST' || !event.body) {
		callback(null, {
			statusCode: 405,
			body: ''
		});
		return
	}

	client.sendEmail({
		"From": EMAIL_FROM,
		"To": EMAIL_TO,
		"Subject": "Test",
		"TextBody": "Hello from Postmark!"
	})
}