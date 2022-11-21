/*
 * Copyright [Now] kobe-koto
 * Under AGPL 3.0
 */

const DomainMap = {
    "koto.eu.org": "koto.cc"
}

addEventListener("fetch", event => {
    event.respondWith(CounterMain(event.request));
})


async function CounterMain (request) {
    let url = new URL(request.url);

    let HTML = await GetHTML();

    return new Response(
        (function (){
            if (url.search.match(/debug/)) {
                UniHeader["Cache-Control"] = "max-age=0, no-cache, no-store, must-revalidate"
            }
            UniHeader["Content-Type"] = "application/json;charset=UTF-8"
            return HTML
                .replace(/%OldDomain/gi, url.hostname)
                .replace(/%NewDomain/gi, DomainMap[url.hostname])
        })()

        , { headers: UniHeader, status:200 }
    );
}

const UniHeader = {
    "Content-Type": "text/html;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
};


async function GetHTML (theme) {
    let HTML = await CacheSpace.get("_theme_" + theme);
    if (HTML){
        HTML = JSON.parse(HTML);
    } else {
        HTML =
            await fetch("https://github.com/kobe-koto/S/" + theme + ".json")
                .then(res => res.json())
                .catch(()=>{})
        CacheSpace.put("HTMLCache", HTML);
    }

    return HTML;
}
