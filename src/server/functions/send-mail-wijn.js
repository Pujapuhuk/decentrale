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
	const name = postData.name
	const email = postData.email
	const methode = postData.methode
	const phone = postData.phone
	const message = postData.message
	const adres = postData.adres
	const postcode = postData.postcode
	const verpakken = postData.verpakken
	const cadeaubon = postData.cadeaubon
	const nieuwsbrief = postData.nieuwsbrief

	const emailBody = getEmailBody(postData)
	const honeyPotValue = postData.petsName

	if (honeyPotValue) {
		return callback(null, {
			statusCode: 403,
			body: 'Sorry, er is iets misgegaan. Mail alstublieft naar hallo@decentraledelft.nl en wij nemen contact met u op. Hartelijk dank!'
		})
	}

	const options = {
		"From": `${name} <${EMAIL_FROM}>`,
		"To": EMAIL_TO,
		"ReplyTo": email,
		"Subject": `Wijnbestelling bij de Centrale | ${date}`,
		"TextBody": `
		Bestelling: ${message} \n
		Verpakken als cadeau: ${verpakken}\n
		Wanneer en hoe?
		${methode} op ${date}
		${time}\n
		Naam: ${name}
		Email: ${email}
		Telefoon: ${phone}\n
		Adres: ${adres}
		Postcode: ${postcode} \n
		Cadeaubon: ${cadeaubon} euro \n
		Nieuwsbrief: ${nieuwsbrief}`
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
