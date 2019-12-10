document.addEventListener("DOMContentLoaded", function(event) {
  var saveUTM = function() {
    try {
      var APPPAGE_URL = window.location.href
        , APPPAGE_QUERY = ''
        , APPPAGE_UTM = '';
      if (APPPAGE_URL.toLowerCase().indexOf('utm_') !== -1) {
        APPPAGE_URL = APPPAGE_URL.toLowerCase();
        APPPAGE_QUERY = (APPPAGE_URL.split("?")[1] || "").split("#")[0];
        if (typeof (APPPAGE_QUERY) == 'string') {
          var arPair, i, arParams = APPPAGE_QUERY.split('&');
          for (i in arParams) {
            arPair = arParams[i].split('=');
            if (arPair[0].substring(0, 4) == 'utm_') {
              APPPAGE_UTM = APPPAGE_UTM + arParams[i] + '|||'
            }
          }
          if (APPPAGE_UTM.length > 0) {
            var date = new Date()
            date.setDate(date.getDate() + 30);
            var parentDomain = (/:\/\/([^/]+?)\.([^/]+\.[^/]+)/.exec(window.location.href) || [])[2]
            if (parentDomain) {
              document.cookie = "APPUTM=" + encodeURIComponent(APPPAGE_UTM) + "; path=/; domain=" + encodeURIComponent("." + parentDomain) + "; expires=" + date.toUTCString()
            } else {
              document.cookie = "APPUTM=" + encodeURIComponent(APPPAGE_UTM) + "; path=/; expires=" + date.toUTCString()
            }
          }
        }
      }
    } catch (err) {}
  }
  saveUTM()
})
