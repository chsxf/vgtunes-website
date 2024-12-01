const COOKIE_PREFIX = "vgtunes-";
const COOKIE_CONSENT_KEY = "cookies-consent";

function setCookieValue(key, value) {
  let expiryDate = new Date(Date.now());
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `${COOKIE_PREFIX}${key}=${value};expires=${expiryDate.toUTCString()};SameSite=Strict`;
}

function getCookieValue(key) {
  const parsedCookies = parseCookies();
  for (var cookieKV of parsedCookies) {
    if (cookieKV !== null && cookieKV[0] == key) {
      return cookieKV[1];
    }
  }
  return undefined;
}

function parseCookies() {
  let allCookies = document.cookie.split(";");
  allCookies = allCookies.map((entry) => {
    let newEntry = entry.trim().split("=");
    console.log(newEntry);
    if (newEntry[0].startsWith(COOKIE_PREFIX)) {
      newEntry[0] = newEntry[0].substring(COOKIE_PREFIX.length);
    } else {
      newEntry = null;
    }
    return newEntry;
  });
  console.log(allCookies);
  return allCookies;
}

function showCookieConsent() {
  document
    .getElementById(COOKIE_CONSENT_KEY)
    .style.setProperty("visibility", "visible");
}

function onAcceptCookieConsentClicked(e) {
  e.preventDefault();
  e.stopPropagation();
  setCookieValue(COOKIE_CONSENT_KEY, 1);
  document
    .getElementById(COOKIE_CONSENT_KEY)
    .style.setProperty("visibility", "hidden");
}

function onDeclineCookieConsentClicked(e) {
  e.preventDefault();
  e.stopPropagation();
  setCookieValue(COOKIE_CONSENT_KEY, 0);
  document
    .getElementById(COOKIE_CONSENT_KEY)
    .style.setProperty("visibility", "hidden");
}

function handleAnalyticsRequest() {}

function initializeAnalytics() {
  let acceptCookieConsentButton = document.getElementById(
    "accept-cookie-consent"
  );
  acceptCookieConsentButton.addEventListener(
    "click",
    onAcceptCookieConsentClicked
  );
  let declineCookieConsentButton = document.getElementById(
    "decline-cookie-consent"
  );
  declineCookieConsentButton.addEventListener(
    "click",
    onDeclineCookieConsentClicked
  );

  let cookieConsented = getCookieValue(COOKIE_CONSENT_KEY);
  if (cookieConsented === undefined) {
    showCookieConsent();
  } else if (cookieConsented == 1) {
    handleAnalyticsRequest();
  }
}

(function () {
  initializeAnalytics();
})();
