const postmark = require('postmark')
const dotenv = require('dotenv')
const queryString = require('query-string')

dotenv.config()

const POSTMARK_SERVER_TOKEN = process.env.POSTMARK_SERVER_TOKEN
const EMAIL_FROM = process.env.EMAIL_FROM
const EMAIL_TO = process.env.EMAIL_TO
const client = new postmark.Client(POSTMARK_SERVER_TOKEN)

function getEmailBody(data) {
	return Object.keys(data).reduce((order, next) => {
		order += `${next}\n ${data[next]}\n\n`
		return order
	}, '')
}

exports.handler = function (event, context, callback) {
	if (event.httpMethod !== 'POST' || !event.body) {
		callback(null, {
			statusCode: 405,
			body: ''
		});
		return
	}

	const postData = queryString.parse(event.body)
	const date = postData.date
	const time = postData.time
	const email = postData.email
	const emailBody = getEmailBody(postData)
	const options = {
		"From": EMAIL_FROM,
		"To": EMAIL_TO,
		"ReplyTo": email,
		"Subject": `${date} - ${time} Reservering`,
		"TextBody": emailBody
	}
	const optionsDirect = {
		"From": EMAIL_FROM,
		"To": email,
		"Subject": `Bedankt voor je reservering op ${date} - ${time} `,
		"TextBody": 'Nog een tekst'
	}
	const callbackHandler = {
		statusCode: 302,
		headers: {
			"Location": '/bedankt/'
		},
		body: ''
	}

	client.sendEmail(options)
       .then(() => client.sendMail(optionsDirect))
       .then(result => {
            callback(null, callbackHandler)
        })
        .catch(error => console.error('error', error))
}