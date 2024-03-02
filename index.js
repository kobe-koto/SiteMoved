/*
 * Copyright [Now] kobe-koto
 * Under AGPL 3.0
 */

const Redirect = false; /* Directly redirect to the target domain rather than showing a migrate page if set to true. */
const DomainMap = {
    "old.example.org": "new.example.org",
    "127.0.0.1": "localhost"
}

addEventListener("fetch", event => {
    event.respondWith(SiteMoved(event.request));
})


async function SiteMoved (request) {
    let url = new URL(request.url);

    if (!DomainMap[url.hostname]) { // handle misconfigured thing
        return new Response(
            (await GetHTML("misconfig")).replace(/%ReqDomain/g, url.hostname),
            { headers: UniHeader, status: 200 }
        );
    }
    

    const NewDomain = DomainMap[url.hostname],
          OldDomain = url.hostname;
    url.hostname = DomainMap[url.hostname];
    if (Redirect) { // redirect
        return Response.redirect(url, 302)
    } else {
        return new Response(
            (await GetHTML("index"))
                .replace(/%OldDomain/g, OldDomain)
                .replace(/%NewDomain/g, NewDomain)
                .replace(/%NewRequestUrl/g, url.toString()), 
            { headers: UniHeader, status: 200 }
        );
    }
}

const UniHeader = {
    "Content-Type": "text/html;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
};


async function GetHTML (slug) {
    return await fetch(`https://raw.githubusercontent.com/kobe-koto/SiteMoved/main/pages/${slug}.html`)
        .then(res => res.text())
}
