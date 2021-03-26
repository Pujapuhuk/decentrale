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
	const wijn = postData.wijn 
	const oesters = postData.oesters
	const char = postData.char
	const kaas = postData.kaas
	const dessert = postData.dessert
	const koffie = postData.koffie
	const friandises = postData.friandises
	const email = postData.email
	const phone = postData.phone
	const aantal = postData.aantal
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
		"Subject": `${date} | ${time} | ${aantal} personen | Roast bestelling bij De Centrale`,
		"TextBody": `
		Datum: ${date}
		Tijd: ${time}\n
		Aantal: ${aantal} personen
		Bijpassende wijn: ${wijn}x \n
		Extra:
		Oester: ${oesters}
		Charcuterie: ${char} x	
		Kaas: ${kaas} x
		Dessert: ${dessert} x
		Koffie: ${koffie} x
		Friandises: ${friandises}x \n
		Naam: ${name}
		Email: ${email}
		Telefoon: ${phone} \n
		Cadeaubon: ${cadeaubon} euro 
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
