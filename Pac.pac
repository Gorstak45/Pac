var pass = "DIRECT";
var blackhole = "PROXY 1.1.1.1:3421";

// Regular expression patterns for popular ad domains and subdomains
var adRegex = new RegExp(
  [
    "^(.+[-_.])?(ad[sxv]?|teads?|doubleclick|adservice|adtrack(er|ing)?|advertising|adnxs|admeld|advert|adx(addy|pose|pr[io])?|adform|admulti|adbutler|adblade|adroll|adgr[ao]|adinterax|admarvel|admed(ia|ix)|adperium|adplugg|adserver|adsolut|adtegr(it|ity)|adtraxx|advertising|aff(iliat(es?|ion))|akamaihd|amazon-adsystem|appnexus|appsflyer|audience2media|bingads|bidswitch|brightcove|casalemedia|contextweb|criteo|doubleclick|emxdgt|e-planning|exelator|eyewonder|flashtalking|goog(le(syndication|tagservices))|gunggo|hurra(h|ynet)|imrworldwide|insightexpressai|kontera|lifestreetmedia|lkntracker|mediaplex|ooyala|openx|pixel(e|junky)|popcash|propellerads|pubmatic|quantserve|revcontent|revenuehits|sharethrough|skimresources|taboola|traktrafficx|twitter[.]com|undertone|yieldmo)"
  ].join("|"),
  "i"
);

// Define blocked domains (for entire domains)
var blockedDomains = [
    "forum.hr",
    "instrumenttactics.com",
    "srce.unizg.hr",
    "rtl.hr",
    "hrt.hr",
    "dnevnik.hr",
    "novatv.dnevnik.hr",
    "novavideo.dnevnik.hr",
    "forum.hr",
    "forum.pcekspert.com"
];

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

function FindProxyForURL(url) {
  url = url.toLowerCase();

  // Check if the requested URL matches any blocked URLs for specific Discord channels
  if (blockedUrls.some(blockedUrl => url === blockedUrl)) {
    return blackhole; // Redirect to a local proxy or simply block
  }

  // Check if the requested URL is for any blocked domain or its subpages
  var domainBlocked = blockedDomains.some(blockedDomain => url.includes(blockedDomain));
  if (domainBlocked) {
    return blackhole; // Block the entire domain and its subpages
  }

  // Block ads using regular expressions
  var host = new URL(url).host; // Ensure host is derived from the URL
  if (adRegex.test(host)) {
    return blackhole;
  }

  // All else fails, just pass through
  return pass;
}

