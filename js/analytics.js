const COOKIE_PREFIX = "vgtunes-";
const COOKIE_CONSENT_KEY = "cookies-consent";
const NAVIGATION_KEY = "navigation";
const MAX_NAVIGATION_ENTRIES = 50;

function setCookieValue(key, value, path = undefined) {
  let expiryDate = new Date(Date.now());
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  let cookieEntry = `${COOKIE_PREFIX}${key}=${value};expires=${expiryDate.toUTCString()};SameSite=Strict`;
  if (path !== undefined) {
    cookieEntry += `;path=${path}`;
  }
  document.cookie = cookieEntry;
}

function getCookieValue(key, defaultValue = undefined) {
  const parsedCookies = parseCookies();
  for (var cookieKV of parsedCookies) {
    if (cookieKV !== null && cookieKV[0] == key) {
      return cookieKV[1];
    }
  }
  return defaultValue;
}

function parseCookies() {
  let allCookies = document.cookie.split(";");
  allCookies = allCookies.map((entry) => {
    let newEntry = entry.trim().split("=");
    if (newEntry[0].startsWith(COOKIE_PREFIX)) {
      newEntry[0] = newEntry[0].substring(COOKIE_PREFIX.length);
    } else {
      newEntry = null;
    }
    return newEntry;
  });
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
  setConsentCheckboxIfAvailable(true);
  document
    .getElementById(COOKIE_CONSENT_KEY)
    .style.setProperty("visibility", "hidden");
}

function onDeclineCookieConsentClicked(e) {
  e.preventDefault();
  e.stopPropagation();
  setCookieValue(COOKIE_CONSENT_KEY, 0);
  setConsentCheckboxIfAvailable(false);
  document
    .getElementById(COOKIE_CONSENT_KEY)
    .style.setProperty("visibility", "hidden");
}

function handleAnalyticsRequest() {
  let navigationCookie = getCookieValue(NAVIGATION_KEY, "");
  let isNew = true;
  let entries = [];

  if (navigationCookie.length > 0) {
    entries = JSON.parse(navigationCookie);

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry[0] == document.location.pathname) {
        const parsedTimestamp = entry[1];
        if (parsedTimestamp > Date.now() - 86400000) {
          isNew = false;
        } else {
          entries.splice(i, 1);
        }
        break;
      }
    }

    while (entries.length >= MAX_NAVIGATION_ENTRIES) {
      entries.splice(0, 1);
    }
  }

  if (isNew) {
    entries.push([document.location.pathname, Date.now()]);
    setCookieValue(NAVIGATION_KEY, JSON.stringify(entries), "/");

    // BEGIN REPLACE ANALYTICS_HOST const analyticsHost = "{ANALYTICS_HOST}";
    const analyticsHost = "http://analytics.chsxf.local:8080";
    // END REPLACE ANALYTICS_HOST

    let analyticsURL = `${analyticsHost}/Stats.add/?domain=${encodeURI(
      document.location.hostname
    )}&path=${encodeURI(document.location.pathname)}`;
    if (document.referrer) {
      let documentReferrerURL = new URL(document.referrer);
      if (documentReferrerURL.hostname != document.location.hostname) {
        analyticsURL += `&referrer=${encodeURI(document.referrer)}`;
      }
    }

    let analyticsXMLHTTPRequest = new XMLHttpRequest();
    analyticsXMLHTTPRequest.open("get", analyticsURL);
    analyticsXMLHTTPRequest.send();
  }
}

function setConsentCheckboxIfAvailable(consented) {
  let checkboxElement = document.getElementById("cookie-consent-checkbox");
  if (checkboxElement !== null) {
    checkboxElement.checked = consented;
  }
}

function onConsentCheckboxChanged(e) {
  e.preventDefault();
  e.stopPropagation();
  let consented = this.checked;
  setCookieValue(COOKIE_CONSENT_KEY, consented ? 1 : 0);
}

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

  let checkboxElement = document.getElementById("cookie-consent-checkbox");
  if (checkboxElement !== null) {
    checkboxElement.addEventListener("change", onConsentCheckboxChanged);
  }

  let cookieConsented = getCookieValue(COOKIE_CONSENT_KEY);
  if (cookieConsented === undefined) {
    showCookieConsent();
  } else {
    let consented = cookieConsented == 1;
    setConsentCheckboxIfAvailable(consented);
    if (consented) {
      handleAnalyticsRequest();
    }
  }
}

(function () {
  initializeAnalytics();
})();
