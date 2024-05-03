let latestEntry = null;

function fetchAndUpdateLatestEntry() {
  const rssURL = "Enter Your Rssfeed link";

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
          newLatestEntry.querySelector("guid").textContent !==
            latestEntry.querySelector("guid").textContent
        ) {
          latestEntry = newLatestEntry;
          console.log(latestEntry);
          let newJobLink = latestEntry.querySelector("guid").textContent;
          console.log(newJobLink);
          refineLink = newJobLink.replace(/\?source=rss$/, "");
          window.open(refineLink, "_blank");
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
setInterval(fetchAndUpdateLatestEntry, 10 * 60 * 1000);

// Initial fetch when extension starts
fetchAndUpdateLatestEntry();
