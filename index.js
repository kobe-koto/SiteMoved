/*
 * Copyright [Now] kobe-koto
 * Under AGPL 3.0
 */

const Redirect = true; /* 重新导向到目标 */
const DomainMap = {
    "koto.eu.org": "koto.cc",
    "yallage.koto.eu.org": "yallage.koto.cc",
    "blog.koto.eu.org": "blog.koto.cc",
    "file.koto.eu.org": "file.koto.cc",
    "wwww.koto.eu.org": "koto.cc",
    "www.koto.eu.org": "koto.cc",
    "ww.koto.eu.org": "koto.cc",
    "wwww.koto.cc": "koto.cc",
    "www.koto.cc": "koto.cc",
    "ww.koto.cc": "koto.cc"
}

addEventListener("fetch", event => {
    event.respondWith(SiteMoved(event.request));
})


async function SiteMoved (request) {
    let url = new URL(request.url);

    if (DomainMap[url.hostname] && Redirect) {
        const { pathname, search } = url;
    
        return Response.redirect("https://" + DomainMap[url.hostname] + pathname + search, 302)
    }

    let HTML = await GetHTML(!!url.search.match(/debug/i));

    return new Response(
        (function (){
            if (url.search.match(/debug/i)) {
                UniHeader["Cache-Control"] = "max-age=0, no-cache, no-store, must-revalidate"
            }
            return HTML
                .replace(/%OldDomain/gi, url.hostname)
                .replace(/%NewDomain/gi, DomainMap[url.hostname])
                .replace(/%NewRequestUrl/gi, 
                    request.url.replace((new RegExp("//"+url.hostname,"gi")), "//"+DomainMap[url.hostname])
                )
        })()

        , { headers: UniHeader, status:200 }
    );
}

const UniHeader = {
    "Content-Type": "text/html;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
};


async function GetHTML (isUpdateHTML) {
    let HTML = await CacheSpace.get("HTMLCache");
    if (!HTML || isUpdateHTML) {
        HTML =
            await fetch("https://raw.githubusercontent.com/kobe-koto/SiteMoved/main/pages/index.html")
                .then(res => res.text())
                .catch(()=>{})
        CacheSpace.put("HTMLCache", HTML);
    }

    return HTML;
}
