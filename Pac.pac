/*
    AntiAd PAC v0.8.2 (beta)
    Updated to include additional domains, URLs, and regex patterns.
*/

// If you're not using a proxy, set: pass = "DIRECT"
pass = "DIRECT";

// For use with BlackHole Proxy, set: blackhole = "PROXY 127.0.0.1:3421"
blackhole = "PROXY 127.0.0.1:3421";

// To autostart with browser set to 1
isEnabled = 1;

// *** WHITELIST ***
whitelist = new Array("");

// *** BLACKLIST ***
// Existing blacklisted domains
adDomain.Xa = new Array("atdmt.com", "adultadworld.com", "adtech", "admonitor.net", "adlink", /* ... other existing domains ... */);
adDomain.Xb = new Array("bannercommunity.de", "bpath.com", "bonzi.com", /* ... other existing domains ... */);

// Add new blocked domains
adDomain.Xz = new Array("forum.hr", "instrumenttactics.com", "srce.unizg.hr", "rtl.hr", "hrt.hr", "dnevnik.hr", "novatv.dnevnik.hr", "novavideo.dnevnik.hr", "forum.pcekspert.com");

// *** SMARTLIST ***
adHostSub = new Object;

// Existing regex patterns for ad-related subdomains
adHostSub.Xa = /^(ad\-?(banner|boost|butler|center|click|codes|ima?ge?|manager|media|serv(ant|ice|ing)|se?rve?r?|v|vert)?s?[0-9]{0,3}\.)/;

// New ad-related regular expression pattern from your addition
adHostSub.Xb = new RegExp(
  [
    "^(.+[-_.])?(ad[sxv]?|teads?|doubleclick|adservice|adtrack(er|ing)?|advertising|adnxs|admeld|advert|adx(addy|pose|pr[io])?|adform|admulti|adbutler|adblade|adroll|adgr[ao]|adinterax|admarvel|admed(ia|ix)|adperium|adplugg|adserver|adsolut|adtegr(it|ity)|adtraxx|advertising|aff(iliat(es?|ion))|akamaihd|amazon-adsystem|appnexus|appsflyer|audience2media|bingads|bidswitch|brightcove|casalemedia|contextweb|criteo|doubleclick|emxdgt|e-planning|exelator|eyewonder|flashtalking|goog(le(syndication|tagservices))|gunggo|hurra(h|ynet)|imrworldwide|insightexpressai|kontera|lifestreetmedia|lkntracker|mediaplex|ooyala|openx|pixel(e|junky)|popcash|propellerads|pubmatic|quantserve|revcontent|revenuehits|sharethrough|skimresources|taboola|traktrafficx|twitter[.]com|undertone|yieldmo)"
  ].join("|"),
  "i"
);

// *** SMARTLIST for folders ***
adHostFolder = /\/(ads?|affils|banners?|bnrs?|promotions)\//;

// Define blocked URLs (exact matches)
var blockedUrls = [
    "discord.com/channels/889102180332732436",
    "discord.com/channels/452237221840551938",
    "discord.com/channels/1128414431085346897",
    "discord.com/channels/567592181905489920",
    "discord.com/channels/549448381613998103",
    "discord.com/channels/150662382874525696",
    "discord.com/channels/731641286389661727",
    "discord.com/channels/246414844851519490",
    "discord.com/channels/240880736851329024",
    // Add more URLs as needed
];

// DEBUG
debug = 0;

function FindProxyForURL(url, host) {
    host = host.toLowerCase();
    url = url.toLowerCase();

    if (debug) { alert("Checking: " + host); } //DEBUG

    // *** AntiAd Control ***
    if (host == "antiad.on") {
        isEnabled = 1;
        return blackhole;
    } else if (host == "antiad.off") {
        isEnabled = 0;
        return blackhole;
    }

    // Normal passthrough if AntiAd is disabled
    if (!isEnabled) { return pass; }

    // Check blocked URLs
    for (i = 0; i < blockedUrls.length; i++) {
        if (url == blockedUrls[i]) {
            if (debug) { alert("Blocked URL: " + url); } //DEBUG
            return blackhole;
        }
    }

    // *** WHITELIST ***
    for (i = 0; i <= whitelist.length; i++) {
        if (host == whitelist[i]) {
            return pass;
        }
    }

    // *** SMARTLIST ***
    if (((host.charAt(0) >= "a") && (host.charAt(0) <= "z")) || ((host.charAt(0) >= "0") && (host.charAt(0) <= "9"))) {
        index = "X" + host.charAt(0);
    } else {
        index = 0;
    }

    // subdomains
    if (index != 0 && adHostSub[index] && adHostSub[index].test(host)) {
        if (debug) { alert("RegExp-Domain-Blocked: " + host); } //DEBUG
        return blackhole;
    }

    // folders
    if (adHostFolder.test(url)) {
        if (debug) { alert("RegExp-Folder-Blocked: " + url); } //DEBUG
        return blackhole;
    }

    // *** BLACKLIST ***
    var trunk = host;
    while (trunk.indexOf(".") > 0) {
        if (((trunk.charAt(0) >= "a") && (trunk.charAt(0) <= "z")) || ((trunk.charAt(0) >= "0") && (trunk.charAt(0) <= "9"))) {
            index = "X" + trunk.charAt(0);
        } else {
            index = 0;
        }

        if ((index != 0) && adDomain(trunk, adDomain[index])) {
            if (debug) { alert("Black List-Blocked: " + host); } //DEBUG
            return blackhole;
        }

        trunk = trunk.substring(trunk.indexOf(".") + 1, trunk.length);
    }

    // Default passthrough
    return pass;
}

// Custom domain matching function
function adDomain(host, adRay) {
    for (i = 0; i <= adRay.length; i++) {
        if (host == adRay[i] || shExpMatch("." + host, "*." + adRay[i] + ".*")) {
            return 1;
        }
    }
    return 0;
}

if (debug) { alert("AntiAd loaded!!!"); } //DEBUG

// EOF
