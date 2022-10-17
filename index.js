const express = require('express')
const mongoose = require('mongoose')

const app = express();

mongoose.connect(
    "mongodb://thiernos:mypassword@mongo:27017/?authSource=admin"
).then(() => console.log('succesfully connected to DB'))
    .catch((e) => {
        console.log(e)
        console.log('retry connecting every 5 seconds...')
    })

// const connectWithRetry = () => {
//     mongoose
//         .connect(mongoURL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         })
//         .then(() => console.log('succesfully connected to DB'))
//         .catch((e) => {
//             console.log(e)
//             console.log('retry connecting every 5 seconds...')
//             setTimeout(connectWithRetry, 5000)
//         })
// }

// connectWithRetry()

app.get("/", (req, res) => {
    res.send("<h2>hi there!!</h2>")
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))