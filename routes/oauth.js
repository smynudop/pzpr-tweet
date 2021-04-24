var express = require("express")
var router = express.Router()
var passport = require("passport")

// /oauthにアクセスした時
router.get("/", passport.authenticate("twitter"))

// /oauth/callbackにアクセスした時（Twitterログイン後）
router.get(
    "/callback",
    passport.authenticate("twitter", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/") //indexへリダイレクトさせる
    }
)

module.exports = router
