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
	const date = postData["8-date"]
	const time = postData.time
	const name = postData.name
	const email = postData.email
	const emailBody = getEmailBody(postData)
	const honeyPotValue = postData.petsName

	if (honeyPotValue) {
		return callback(null, {
			statusCode: 403,
			body: 'FORBIDDEN'
		})
	}

	const options = {
		"From": `${name} <${EMAIL_FROM}>`,
		"To": EMAIL_TO,
		"ReplyTo": email,
		"Subject": `${date} Eten bestellen bij De Centrale`,
		"TextBody": `Ik wil graag ${2-menu-type-3-vega} x 3 gangen vega, ${1-menu-type-3-standaard} x 3 gangen standaar \n
		Extr's ${5-oesters}`
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
			callback(null, callbackHandler)
		})
		.catch(error => console.error('error', error))
}
