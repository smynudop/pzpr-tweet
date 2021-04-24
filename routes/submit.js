var express = require("express")
var router = express.Router()
const twitter = require("twitter")
const PzprTweet = require("../pzprTweet")

// /oauthにアクセスした時
router.post("/", function (req, res, next) {
    ;(async () => {
        const tweetid = await PzprTweet.tweet(
            req.body,
            req.user.twitter_token,
            req.user.twitter_toke_secret
        )
        res.redirect("/?status=success&tweetid=" + tweetid)
    })().catch(function (e, next) {
        console.log(e)
        res.redirect("/?status=failed")
    })
})

module.exports = router
