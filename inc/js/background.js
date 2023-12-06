let latestEntry = null;

function fetchAndUpdateLatestEntry() {
  const rssURL =
    "https://www.upwork.com/ab/feed/topics/rss?securityToken=7ef2a4f1001abebcf4d37460e432a8f38587b1779ce724e0c55cc9d033cfb74a66ab0ecb11c5b1b4f1d0f18d4804cdf2166b7beff5177c255f2f2e1cf637188e&userUid=651708445704474624&orgUid=651708445708668929&topic=7077741";

  fetch(rssURL)
    .then((response) => response.text())
    .then((xmlData) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "text/xml");
      console.log(xmlDoc);
      const entries = xmlDoc.querySelectorAll("item");
      console.log(entries.length);

      if (entries.length > 0) {
        const newLatestEntry = entries[0]; // Assuming the first entry is the latest
        if (
          !latestEntry ||
          newLatestEntry.querySelector("pubDate").textContent >
            latestEntry.querySelector("pubDate").textContent
        ) {
          latestEntry = newLatestEntry;
          console.log(latestEntry);
          localStorage.setItem("latestEntry", latestEntry);
          // Fetch active tabs and send message to popup
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              return;
            }

            if (tabs && tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "showNotification",
                data: latestEntry.outerHTML,
              });
            } else {
              console.error("No active tab found");
            }
          });
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching Upwork RSS", error);
    });
}
// Fetch RSS feed data every 5 minutes
setInterval(fetchAndUpdateLatestEntry, 3 * 60 * 1000);

// Initial fetch when extension starts
fetchAndUpdateLatestEntry();
