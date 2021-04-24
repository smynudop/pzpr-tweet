var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")

var oauth = require("./routes/oauth")
var indexRouter = require("./routes/index")
var submitRouter = require("./routes/submit")

var passport = require("passport")
var TwitterStrategy = require("passport-twitter").Strategy

//Twitter Appsにて取得したConsumer Key (API Key)とConsumer Secret (API Secret)を記述

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.TWITTER_CALLBACK_URL,
        },
        function (token, tokenSecret, profile, done) {
            profile.twitter_token = token
            profile.twitter_toke_secret = tokenSecret
            return done(null, profile)
            process.nextTick(function () {
                return done(null, profile)
            })
        }
    )
)

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (obj, done) {
    done(null, obj)
})

var app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(
    require("express-session")({
        secret: "bruteforce",
        resave: false,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxage: 1000 * 60 * 60 * 24 * 7,
        },
    })
)
app.use(passport.initialize())
app.use(passport.session())

app.use("/", indexRouter)
app.use("/submit", submitRouter)

app.use("/oauth", oauth)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error")
})

module.exports = app
