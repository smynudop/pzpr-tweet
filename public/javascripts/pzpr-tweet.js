function validate() {
    let result = true

    let url = document.getElementById("url").value
    let pzprTester = new RegExp("http://pzv.jp/p")
    let puzzlinkTester = new RegExp("https://puzz.link/p")
    if (!pzprTester.test(url) && !puzzlinkTester.test(url)) {
        document.getElementById("urlAlert").classList.add("show")
        result = false
    } else {
        document.getElementById("urlAlert").classList.remove("show")
    }

    let txt = document.getElementById("txt").value
    if (txt.trim() == "") {
        document.getElementById("txtAlert").classList.add("show")
        result = false
    } else {
        document.getElementById("txtAlert").classList.remove("show")
    }

    return result
}

function onSubmit() {
    if (!validate()) {
        return false
    }

    let url = document.getElementById("url").value
    let txt = document.getElementById("txt").value
    if (/\[url\]/.test(txt)) {
        txt = txt.replace("[url]", url)
    } else {
        txt = txt + "\n" + url
    }
    document.getElementById("tweet_text").value = txt
    console.log(txt)

    return true
}

window.onload = function () {
    document.getElementById("form").addEventListener("submit", function (e) {
        if (!onSubmit()) {
            e.stopPropagation()
            e.preventDefault()
        }
    })
    document.getElementById("url").addEventListener("change", function (e) {
        validate()
    })
    document.getElementById("txt").addEventListener("change", function (e) {
        validate()
    })
}
