
async function getBypassedUrl(url) {
    console.log("Bypassing ", url)
    const webUrlHostname = new URL(url).hostname;
    if (webUrlHostname == "unilinks.lol") {
        const response = await fetch('https://vegabypass.onrender.com/bypass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        const data = await response.json();
        console.log("data ", data)
        return data;
    }
    return null;
}

async function update(anchorTags) {
    const popup = document.createElement('div');
    popup.id = 'topRightPopup';
    popup.innerHTML = 'Bypassing Urls!! Just Wait!!';
    document.body.appendChild(popup);
    let count = 0
    alert("Bypassing Url, Just Wait!!");

    for (const tag of anchorTags) {
        const href = tag.getAttribute('href');
        const bypassedUrl = await getBypassedUrl(href);
        if (bypassedUrl.finalUrls.length > 0) {
            let parent = tag.parentNode;
            for (const finalUrl of bypassedUrl.finalUrls) {
                if (parent) {
                    const btn = tag.querySelector('button');
                    const newAnchorTag = document.createElement('a');
                    newAnchorTag.setAttribute('href', finalUrl.finalUrl);
                    newAnchorTag.setAttribute('rel', 'nofollow noopener noreferrer');
                    const button = document.createElement('button');
                    button.classList.add('directDownload');

                    const originalStyle = btn.getAttribute('style');
                    if (originalStyle) {
                        button.setAttribute('style', originalStyle);
                    }

                    button.innerHTML = finalUrl.name;
                    newAnchorTag.appendChild(button);
                    parent.appendChild(newAnchorTag);
                } else {
                    console.error("Parent node is null for tag:", tag);
                    const btn = tag.querySelector('button');
                    const newAnchorTag = document.createElement('a');
                    newAnchorTag.setAttribute('href', finalUrl.finalUrl);
                    newAnchorTag.setAttribute('rel', 'nofollow noopener noreferrer');
                    const button = document.createElement('button');
                    button.classList.add('directDownload');

                    const originalStyle = btn.getAttribute('style');
                    if (originalStyle) {
                        button.setAttribute('style', originalStyle);
                    }

                    button.innerHTML = finalUrl.name;
                    newAnchorTag.appendChild(button);
                    tag.parentNode.replaceChild(newAnchorTag, tag);
                }
                count += 1;
                popup.innerHTML = `Bypassed Url No. - ${count}`;
            }
        }
    }

    popup.innerHTML = `All Urls Bypassed <br> Total- ${count}`;
    alert("Bypassed all the possible links");
    setTimeout(() => {
        popup.style.display = 'none';
    }, 5000);
}


document.addEventListener('DOMContentLoaded', function () {
    const anchorTags = document.querySelectorAll('a');
    const webUrlHostname = new URL(window.location.href).hostname;
    if (webUrlHostname.includes("unilinks")) return;
    let tags = []
    for (const tag of anchorTags) {
        const href = tag.getAttribute('href');
        if (href && href.includes("unilinks")) {
            tag.removeAttribute('target')
            tags.push(tag)
            console.log("Target removed")
        }
    }
    if (tags.length) {
        update(tags)
    }
});
