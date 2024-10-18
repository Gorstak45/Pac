// If you're not using a proxy, set: pass = "DIRECT"
// If you are using a proxy, set: pass = "PROXY hostname:port"
var pass = "DIRECT";

// For use with BlackHole Proxy, set: blackhole = "PROXY 127.0.0.1:3421"
// For use with a local http server, set: blackhole = "PROXY 127.0.0.1:80"
// Otherwise use: blackhole = "PROXY 0.0.0.0"
var blackhole = "PROXY 127.0.0.1:3421";

// To autostart with the browser set to 1
var isEnabled = 1;

// Whitelist domains (these are allowed no matter what)
var whitelist = [];

// Regular expression patterns for popular ad domains and subdomains
var adRegex = new RegExp(
  [
    "^(.+[-_.])?(ad[sxv]?|teads?|doubleclick|adservice|adtrack(er|ing)?|advertising|adnxs|admeld|advert|adx(addy|pose|pr[io])?|adform|admulti|adbutler|adblade|adroll|adgr[ao]|adinterax|admarvel|admed(ia|ix)|adperium|adplugg|adserver|adsolut|adtegr(it|ity)|adtraxx|advertising|aff(iliat(es?|ion))|akamaihd|amazon-adsystem|appnexus|appsflyer|audience2media|bingads|bidswitch|brightcove|casalemedia|contextweb|criteo|doubleclick|emxdgt|e-planning|exelator|eyewonder|flashtalking|goog(le(syndication|tagservices))|gunggo|hurra(h|ynet)|imrworldwide|insightexpressai|kontera|lifestreetmedia|lkntracker|mediaplex|ooyala|openx|pixel(e|junky)|popcash|propellerads|pubmatic|quantserve|revcontent|revenuehits|sharethrough|skimresources|taboola|traktrafficx|twitter[.]com|undertone|yieldmo)",
  ].join("|"),
  "i"
);

// Define blocked URLs (exact matches)
var blockedURLs = [
    "discord.com/channels/889102180332732436",
    "discord.com/channels/452237221840551938",
    "discord.com/channels/1128414431085346897",
    "discord.com/channels/567592181905489920",
    "discord.com/channels/549448381613998103",
    "discord.com/channels/150662382874525696",
    "discord.com/channels/731641286389661727",
    "discord.com/channels/246414844851519490",
    "discord.com/channels/240880736851329024",
    "reddit.com/r/croatia",
    "reddit.com/r/hrvatska"
// Add more URLs as needed
];

// Define blocked sites (exact domain matches)
var blockedSites = [
    "instrumenttactics.com",
    "srce.unizg.hr",
    "rtl.hr",
    "hrt.hr",
    "dnevnik.hr",
    "novatv.dnevnik.hr",
    "novavideo.dnevnik.hr",
    "forum.hr",
    "forum.pcekspert.com"
// Add more sites as needed
];

function FindProxyForURL(url, host) {
  host = host.toLowerCase();
  url = url.toLowerCase();

  // Normal passthrough if AntiAd is disabled
  if (!isEnabled) {
    return pass;
  }

  // Allow domains and sites explicitly from the whitelist
  if (whitelist.length > 0 && whitelist.indexOf(host) !== -1) {
    return pass;
  }

  // Ensure that blockedURLs is populated before checking against it
  if (blockedURLs.length > 0) {
    // Block specific URLs
    for (var i = 0; i < blockedURLs.length; i++) {
      // Check if the host or the full URL contains the blocked URL
      if (host.indexOf(blockedURLs[i]) !== -1 || url.indexOf(blockedURLs[i]) !== -1) {
        return blackhole;
      }
    }
  }

  // Block specific URLs manually
  if (blockedSites.indexOf(host) !== -1) {
    return blackhole;
  }

  // Block ads using regular expressions
  if (adRegex.test(host)) {
    return blackhole;
  }

  // All else fails, just pass through
  return pass;
}
