chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showNotification") {
    const latestEntryHTML = request.data;
    console.log(latestEntryHTML);
    // Display the latest entry HTML in the popup
    const latestEntryDiv = document.getElementById("latestEntry");
    latestEntryDiv.innerHTML = latestEntryHTML;

    // Show a notification with the latest entry details
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(latestEntryHTML, "text/xml");
    const title = xmlDoc.querySelector("title").textContent;
    const description = xmlDoc.querySelector("description").textContent;
    console.log(description);
    const notification = new Notification("Latest Upwork Entry", {
      body: title,
    });
    console.log(notification);
  }
});

// Function to check for new entries and open a popup
function checkForNewEntryAndOpenPopup() {
  // Retrieve the latest entry from localStorage
  const latestEntry = localStorage.getItem("latestEntry");

  // Check if there is a new entry
  if (latestEntry) {
    // Open a new popup window
    const newWindow = window.open("", "NewWindow", "width=500,height=500");

    // Write the latest entry content to the popup window
    newWindow.document.write(`<h1>${latestEntry}</h1>`);

    // Clear the latest entry in localStorage
    localStorage.removeItem("latestEntry");
  }
}

// Check for new entry when popup is opened
//checkForNewEntryAndOpenPopup();

// Optionally, you can set an interval to check periodically
setInterval(checkForNewEntryAndOpenPopup, 5000); // Check every 5 seconds, for instance
