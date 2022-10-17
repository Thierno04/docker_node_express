const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session')
const redis = require('redis')
let RedisStore = require("connect-redis")(session)

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})


const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

const app = express();

// "mongodb://thiernos:mypassword@127.0.0.2:27017/?authSource=admin"
// "mongodb://thiernos:mypassword@mongo:27017/?authSource=admin"

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('succesfully connected to DB'))
        .catch((e) => {
            console.log(e)
            console.log('retry connecting every 5 seconds...')
            setTimeout(connectWithRetry, 5000)
        })
}

connectWithRetry();

app.enable("trust proxy") //this line tells express is behind a proxy.
// app.use(cors({}))
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge:  30000, 
    }
}))


app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h2>hi there!!!!</h2>")
});

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))