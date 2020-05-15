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
	const menuStandaardDrie = postData["menuStandaardDrie"]
	const menuVegaDrie = postData["menuVegaDrie"]
	const menuStandaardVier = postData["menuStandaardVier"]
	const menuVegaVier = postData["menuVegaVier"]
	const oesters = postData.oesters
	const kaas = postData.kaas
	const wijnWit = postData["wijn_wit"]
	const wijnRose = postData["wijn_rose"]
	const wijnRood = postData["wijn_rood"]
	const bubbel = postData.bubbel
	const wijnPakket = postData["wijn_pakket"]
	const methode = postData.methode
	const date = postData.date
	const time = postData.time
	const name = postData.name
	const email = postData.email
	const phone = postData.phone
	const adres = postData.adres
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
		"Subject": `Eten bestellen bij De Centrale voor ${date} | ${methode} | ${time}`,
		"TextBody": `
		Wij willen graag: 
		3-gangen standaard: ${menuStandaardDrie} x
		3-gangen vega: ${menuVegaDrie} x
		4-gangen standaard: ${menuStandaardVier} x
		4-gangen vega: ${menuVegaVier} x\n
		Extra:
		Oester: ${oesters}
		Kaas: ${kaas} x\n
		Wijn:
		Bijpassend wit: ${wijnWit}
		Bijpassend rose: ${wijnRose}
		Bijpassen rood: ${wijnRood}
		Bubbel: ${bubbel}
		Bijpassend pakket: ${wijnPakket}\n
		Wanneer en hoe?
		${methode} op ${date}
		${time}\n
		Persoonlijke gegeven:
		Naam: ${name}
		E-mail: ${email}
		Telefoon: ${phone}
		Adres: ${adres}
		Reserveren: ${emailBody}`
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
