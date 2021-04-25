const twitter = require("twitter")
const fetch = require("node-fetch")
const fs = require("fs")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

class PzprTweet {
    constructor() {}

    static async tweet(form, tokenKey, tokenSecret) {
        const client = new twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: tokenKey,
            access_token_secret: tokenSecret,
        })
        let imgId, imgData

        if (true || form.isAttachImg) {
            imgData = await PzprTweet.fetchImg(form.url)
            imgData = await PzprTweet.extendImg(imgData)
            imgId = await PzprTweet.uploadImg(client, imgData)
        }
        const tweetId = await PzprTweet.update(client, form.tweet_text, imgId)
        return tweetId
    }

    static async fetchImg(url) {
        url = url.replace(/https?:\/\/pzv\.jp\/p.html\?/, "https://puzz.link/pv?")
        url = url.replace(/https?:\/\/pzv\.jp\/p\?/, "https://puzz.link/pv?")

        url = url.replace(/https?:\/\/puzz.link\/p\?/, "https://puzz.link/pv?")

        const res = await fetch(url)
        if (!res.ok) throw new Error("画像が正常に取得できませんでした")
        const blob = await res.arrayBuffer()
        return Buffer.from(blob)
    }

    static async extendImg(imgBuffer) {
        const sharp = require("sharp")

        let baseSharp = sharp(imgBuffer)
        let { width: baseWidth, height: baseHeight } = await baseSharp.metadata()

        const newWidth = Math.ceil(((baseHeight + 20) * 16) / 9)

        if (baseWidth + 20 >= newWidth) {
            return await baseSharp
                .extend({
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                    background: "#FFFFFF",
                })
                .toBuffer()
        } else {
            return await baseSharp
                .extend({
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                    background: "#FFFFFF",
                })
                .resize(newWidth, baseHeight, {
                    fit: "contain",
                    background: "#FFFFFF",
                })
                .toBuffer()
        }
    }

    static async uploadImg(client, img) {
        const media = await client.post("media/upload", { media: img })
        return media.media_id_string
    }

    static async update(client, text, imgId) {
        let status = { status: text }
        if (imgId) status.media_ids = imgId

        let res = await client.post("statuses/update", status)
        return res.id_str
    }
}

module.exports = PzprTweet
