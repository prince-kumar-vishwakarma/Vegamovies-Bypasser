chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "fetch_data") {
        const url = message.url;
        try {
            const response = await fetch('https://vegabypass.onrender.com/bypass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            // chrome.runtime.sendMessage(sender.id ,{action: "display_data", data: data });
            chrome.tabs.sendMessage(sender.tab.id, { action: "data_from_backend", data });
            // sendResponse({ action: "done" });
        } catch (error) {
            console.error('Error fetching data from backend:', error);
            chrome.tabs.sendMessage(sender.tab.id, { action: "error_from_backend", error: 'Failed to fetch data from backend' });
            sendResponse({ error: 'Failed to fetch data from backend' });
        }
    }
    return true;
});
