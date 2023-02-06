const router = require("express").Router({ mergeParams: true })
const messageController = require("../controllers/messageController")

router.route("/").post(messageController.sendMessage)

module.exports = router

// const host = "moneytime.signalwire.com"
// const project = "87261193-3635-4b74-9844-7d6a75698a4b"
// const token = "PT553b9c9e371af8e5dd10300d807d177002a6b7caa5780f4d"
// const { RelayClient, RestClient } = require("@signalwire/node")

// exports.sendMessage = async (req, res, next) => {
// 	const from = req.body.senderId || "+12363613597"
// 	const to = req.body.contacts[0]
// 	if (!req.body.contacts || !req.body.message) {
// 		return res.status(400).json({
// 			status: "fail",
// 			message: "Please provide contacts and message",
// 		})
// 	}
// 	const message = req.body.message

// 	const client = new RestClient(project, token, { signalwireSpaceUrl: host })

// 	try {
// 		client.messages
// 			.create({ from, body: message, to })
// 			.then(message => {
// 				res.status(200).json({
// 					message: "Message sent successfully",
// 					status: "success",
// 					message,
// 				})
// 			})
// 			.done()
// 	} catch (error) {
// 		res.status(400).json({
// 			message: "Message sent successfully",
// 			status: "false",
// 		})
// 	}
// }
