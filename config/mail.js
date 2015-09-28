module.exports = {
	service: "Gmail",
	host: "smtp.gmail.com",
	port: 587,
	secureConnection: false,
	auth: {
		user: "myusername",
		pass: "mypassword"
	},
	ignoreTLS: false,
	debug: false,
	maxConnections: 5

}