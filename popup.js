let webUrl;
let webUrlHostname;
const dataContainer = document.getElementById("data-container");
const btn = document.getElementById("bypass");

// Function to clear data from storage
function clearDataFromStorage() {
  chrome.storage.local.remove("data", () => {
    console.log("Data cleared from storage");
  });
}

// Function to handle changes in storage
function handleStorageChange(changes, area) {
  if (area === "local" && "data" in changes) {
    if (!changes.data.newValue) {
      console.log("Data removed from storage");
    }
  }
}

// Add listener for storage changes
chrome.storage.onChanged.addListener(handleStorageChange);

// Function to load data from storage
function loadDataFromStorage() {
  chrome.storage.local.get("data", function (result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    var storedData = result.data;
    if (storedData) {
      if (Array.isArray(storedData)) {
        storedData.forEach(finalUrl => {
          const anchorTag = document.createElement("a");
          anchorTag.href = finalUrl.finalUrl;
          anchorTag.textContent = finalUrl.name;
          dataContainer.appendChild(anchorTag);
          anchorTag.addEventListener("click", function (event) {
            event.preventDefault();
            chrome.tabs.create({ url: this.href });
          });
        });
      } else {
        console.error("Stored data is not an array.");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", loadDataFromStorage);

document.getElementById("bypass").addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
    webUrl = tabs[0].url;
    webUrlHostname = new URL(tabs[0].url).hostname;
    let url = webUrl;
    if (webUrlHostname == "unilinks.lol") {
      dataContainer.innerHTML = "Loading...";
      const response = await fetch("https://vegabypass.onrender.com/bypass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      dataContainer.innerHTML = "";
      data.finalUrls.forEach(finalUrl => {
        const anchorTag = document.createElement("a");
        anchorTag.href = finalUrl.finalUrl;
        anchorTag.textContent = finalUrl.name;
        dataContainer.appendChild(anchorTag);

        anchorTag.addEventListener("click", function (event) {
          event.preventDefault();
          chrome.tabs.create({ url: this.href });
        });
      });
      chrome.storage.local.set({ data: data.finalUrls }, () => {
        console.log("Data stored:", data.finalUrls);
      });

      // Clear data from storage after 20 minutes
      setTimeout(clearDataFromStorage, 20 * 60 * 1000);
    } else {
      dataContainer.innerHTML = "You are not on unilinks url <br> Go to VegaMovies";
      const anchorTag = document.createElement("a");
      anchorTag.href = "https://vegamovies.ph/";
      anchorTag.textContent = "VegaMovies";
      dataContainer.appendChild(anchorTag);

      anchorTag.addEventListener("click", function (event) {
        event.preventDefault();
        chrome.tabs.create({ url: this.href });
      });

    }
  });
});
