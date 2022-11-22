/*
 * Copyright [Now] kobe-koto
 * Under AGPL 3.0
 */

const DomainMap = {
    "koto.eu.org": "koto.cc"
}

addEventListener("fetch", event => {
    event.respondWith(SiteMoved(event.request));
})


async function SiteMoved (request) {
    let url = new URL(request.url);

    let HTML = await GetHTML();

    return new Response(
        (function (){
            if (url.search.match(/debug/)) {
                UniHeader["Cache-Control"] = "max-age=0, no-cache, no-store, must-revalidate"
            }
            return HTML
                .replace(/%OldDomain/gi, url.hostname)
                .replace(/%NewRequestUrl/gi, 
                    request.url.replace((new RegExp("//"+url.hostname,"gi")), DomainMap[url.hostname])
                )
        })()

        , { headers: UniHeader, status:200 }
    );
}

const UniHeader = {
    "Content-Type": "text/html;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
};


async function GetHTML () {
    let HTML = await CacheSpace.get("HTMLCache");
    if (!HTML) {
        HTML =
            await fetch("https://raw.githubusercontent.com/kobe-koto/SiteMoved/main/pages/index.html")
                .then(res => res.text())
                .catch(()=>{})
        CacheSpace.put("HTMLCache", HTML);
    }

    return HTML;
}
