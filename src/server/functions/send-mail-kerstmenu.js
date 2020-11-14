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
	const menuStandaard7 = postData["menuStandaard7"]
	const menuVega7 = postData["menuVega7"]
	const oesters = postData.oesters
	const verwenplank = postData.verwenplank
	const brood = postData.brood
	const char = postData.char
	const koffie = postData.koffie
	const friandises = postData.friandises
	const cadeaubon = postData.cadeaubon
	const borden = postData.borden
	const glas_cava = postData.glas_cava
	const glas_rood = postData.glas_rood
	const glas_wit = postData.glas_wit
	const wijnWit = postData["wijn_wit"]
	const wijnCava = postData["wijn_cava"]
	const wijnRood = postData["wijn_rood"]
	const wijnCavaKlein = postData.wijn_cava_klein
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
		"Subject": `Kerstmenu De Centrale voor ${date} | ${methode} | ${time}`,
		"TextBody": `
		Wij willen graag: 
		4-gangen standaard: ${menuStandaard7} x
		4-gangen vega: ${menuVega7} x\n
		Extra:
		Oester: ${oesters}
		Brood: ${brood} x
		Charcuterie: ${char} x
		Verwenplank: ${verwenplank} personen
		Koffie: ${koffie} x
		Friandises: ${friandises} x \n
		Wijn:
		Bijpassend wit: ${wijnWit}
		Bijpassend rood: ${wijnRood}
		Bijpassend 2 persoonscava: ${wijnCavaKlein}
		Bijpassend cava: ${wijnCava}
		Bubbel: ${bubbel}
		Bijpassend pakket: ${wijnpakket} flessen \n
		Speciaal voor kerst:
		Op borden serveren: ${borden}
		Champagne wijnglazen: ${glas_cava} x
		Rode wijnglazen: ${glas_rood}x
		Witte wijnglazen: ${glas_wit}x
		Wanneer en hoe?
		${methode} op ${date}
		${time}\n
		Persoonlijke gegeven:
		Naam: ${name}
		E-mail: ${email}
		Telefoon: ${phone}
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
