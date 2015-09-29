module.exports = {
	service: "Gmail",
	host: "smtp.gmail.com",
	port: 587,
	secureConnection: false,
	auth: {
		user: "ahsanbagwan@gmail.com",
		pass: "mypassword"
	},
	ignoreTLS: false,
	debug: false,
	maxConnections: 5
}