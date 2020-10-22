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
	const menuStandaardVier = postData["menuStandaardVier"]
	const menuVegaVier = postData["menuVegaVier"]
	const oesters = postData.oesters
	const kaas = postData.kaas
	const koffie = postData.koffie
	const friandises = postData.friandises
	const cadeaubon = postData.cadeaubon
	const wijnWit = postData["wijn_wit"]
	const wijnCava = postData["wijn_cava"]
	const wijnRood = postData["wijn_rood"]
	const bubbel = postData.bubbel
	const wijnpakket = postData["wijnpakket"]
	const methode = postData.methode
	const date = postData.date
	const time = postData.time
	const name = postData.name
	const email = postData.email
	const phone = postData.phone
	const adres = postData.adres
	const postcode = postData.postcode
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
		"Subject": `Menu bestellen bij De Centrale voor ${date} | ${methode} | ${time}`,
		"TextBody": `
		Wij willen graag: 
		4-gangen standaard: ${menuStandaardVier} x
		4-gangen vega: ${menuVegaVier} x\n
		Extra:
		Oester: ${oesters}
		Kaas: ${kaas} x
		Koffie: ${koffie} x
		Friandises: ${friandises}x
		Cadeaubon: ${cadeaubon} euro \n
		Wijn:
		Bijpassend wit: ${wijnWit}
		Bijpassen rood: ${wijnRood}
		Bijpassend cava: ${wijnCava}
		Bubbel: ${bubbel}
		Bijpassend pakket: ${wijnpakket} flessen \n
		Wanneer en hoe?
		${methode} op ${date}
		${time}\n
		Persoonlijke gegeven:
		Naam: ${name}
		E-mail: ${email}
		Telefoon: ${phone}
		Adres: ${adres}
		Postcode: ${postcode} \n
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
