// Messagebird

// const API_KEY = process.env.API_KEY || "4B4tnYJ7ehsJXGdMI71ffxvWr";
// const messagebird = require("messagebird")(API_KEY);

// exports.sendMessage = async (req, res, next) => {
//   const body = req.body.message;
//   const numbers = [...req.body.contacts];
//   const senderId = req.body.senderId;
//   const senderIdSplit = senderId.split(",");
//   const bodySplit = body.split("+");
//   const errs = [];

//   // const sIdx = Math.floor(Math.random() * senderIdSplit.length);
//   // const mIdx = Math.floor(Math.random() * bodySplit.length);
//   // const rSender = senderIdSplit[sIdx].trim();
//   // const rMessage = bodySplit[mIdx].trim();

//   numbers.forEach((num, i) => {
//     messagebird.messages.create(
//       {
//         originator:
//           senderIdSplit[Math.floor(Math.random() * senderIdSplit.length)],
//         recipients: [num],
//         body: bodySplit[Math.floor(Math.random() * bodySplit.length)],
//       },
//       function (err, response) {
//         console.log(response);

//         if (i + 1 === numbers.length) {
//           if (err) {
//             console.log(err);
//             errs.push(`Could not send message to ${num}`);
//           }

//           res.status(200).json({
//             // message: `[Status] Successfully sent
//             // =======================
//             // ${errs.length ? "Not sent" : ""}
//             //  ${errs.join(" ")}`,
//             message: "message sent",
//             status: "success",
//           });
//         }
//       }
//     );
//   });

// };

// const TWILIO_ACCOUNT_SID =
//   process.env.TWILIO_ACCOUNT_SID || "AC2ae2147dc4a405332c6d08b5bd74b35b";
// const TWILIO_AUTH_TOKEN =
//   process.env.TWILIO_AUTH_TOKEN || "8ca78d41149b7dfac27c19c150783abb";
// const TWILIO_MESSAGING_SID =
//   process.env.TWILIO_MESSAGING_SID || "MGe2c204492809bc3ca79588df37ff0886";
// const TWILIO_NUMBER = process.env.TWILIO_NUMBER || "+17577991311";

// const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// exports.sendMessage = async (req, res, next) => {
//   const body = req.body.message;
//   const numbers = [...req.body.contacts];

//   console.log(body, numbers);

//   Promise.all(
//     numbers.map((number) => {
//       return twilio.messages.create({
//         to: number,
//         from: TWILIO_NUMBER,
//         body: body,
//       });
//     })
//   )
//     .then((message) => {
//       console.log("Messages sent!");
//       console.log(message);
//       res.status(200).json({
//         status: "success",
//         message: "Message sent successfully!",
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.status(400).json({
//         status: "fail",
//       });
//     });
// };

// ROUTEE
// const request = require("request");
// const appId = "63d81bc515e9a4000138b1f9";
// const appSecret = "d4CXsM5Yat";

// const encodedData = Buffer.from(appId + ":" + appSecret).toString("base64");
// const senderId = "ROUTEE";

// exports.sendMessage = async (req, res, next) => {
//   const body = req.body.message;
//   const groups = [...req.body.contacts];
//   const g = "";
//   console.log(groups);
//   const from = req.body.senderId || senderId;

//   const data = JSON.stringify({
//     body,
//     to: groups,
//     from,
//   });

//   request.post(
//     {
//       headers: {
//         "content-type": "application/x-www-form-urlencoded",
//         authorization: `Basic ${encodedData}`,
//       },
//       url: "https://auth.routee.net/oauth/token",
//       body: "grant_type=client_credentials",
//     },
//     function (error, response, body) {
//       const parsedBody = JSON.parse(body);
//       const { access_token } = parsedBody;
//       // console.log(access_token)
//       if (!access_token) {
//         return res.status(401).json({
//           status: "fail",
//           message: "Unauthorized",
//         });
//       }

//       request.post(
//         {
//           headers: {
//             "content-type": "application/json",
//             authorization: `Bearer ${access_token}`,
//           },
//           url: "https://connect.routee.net/sms/campaign",
//           body: data,
//         },
//         function (error, response, body) {
//           const parsedBody = JSON.parse(body);
//           const { code, developerMessage } = parsedBody;
//           console.log(parsedBody);
//           res.status(201).json({
//             status: "success",
//             message: developerMessage
//               ? developerMessage
//               : "Your campaign has been sent successfully",
//           });
//         }
//       );
//     }
//   );
// };

// Nexmo;
const apiSecret = process.env.API_SECRET || "OAqkGDNBi3EpxmCq";
const apiKey = process.env.API_KEY || "c0b81754";
const limit = Number(process.env.LIMIT) || 20;
const Nexmo = require("nexmo");

// Nexmo Init
const nexmo = new Nexmo({ apiKey, apiSecret });

// Send Message
exports.sendMessage = async (req, res, next) => {
  const { message, senderId, contacts } = req.body;

  if (contacts.length > limit)
    return res.status(400).json({
      message: `Upload is more than maximum allowed of ${limit}`,
    });

  const sendBulkSms = (senderName, message, phoneNumbers) => {
    //Loop through each number and send sms message to
    for (let i = 0; i < phoneNumbers.length; i++) {
      let number = phoneNumbers[i];

      nexmo.message.sendSms(senderName, number, message, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            status: "fail",
            message: "Error sending your campaign",
          });
        }

        console.log(result);

        // after the message has been successfully sent to the last number, send a server response
        if (i === phoneNumbers.length - 1) {
          console.log("message sent");
          // You can now return server response.

          res.status(201).json({
            status: "success",
            message: "Your campaign has been sent successfully",
          });
        }
      });
    }
  };

  sendBulkSms(senderId, message, [...contacts]);
};

// // Direct Route
// const limit = Number(process.env.LIMIT) ? Number(process.env.LIMIT) : 20
// const apiToken = "154|bk3FIHEodKrSDBmGNQYktemOwah4ER7gpEXO2P9f"
// const axios = require("axios")

// // Send Message
// exports.sendMessage = async(req, res, next) => {
//     const { message, senderId, contacts } = req.body

//     // Limit contacts
//     if (contacts.length > limit) return res.status(400).json({
//         message: `Upload is more than maximum allowed of ${limit}`
//     })

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiToken}`,
//         'Accept': 'application/json'
//     }

//     const endpoint = 'https://directroutesms.com/api/v3/sms/send'

//     const data = {
//         recipient: contacts[0],
//         sender_id: senderId,
//         message
//     }

//     axios.post(endpoint, data, {
//             headers: headers
//         })
//         .then((response) => {
//             console.log(response.data)
//             res.status(201).json({
//                 message: "Campaign sent successfully",
//                 status: 'success'
//             })
//         })
//         .catch((error) => {
//             console.log(error)
//             return res.status(201).json({
//                 message: "Error sending your campaign",
//                 status: 'fail'
//             })
//         })
// }
