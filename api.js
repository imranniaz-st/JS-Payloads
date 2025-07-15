(async function() {
    const baseUrl = "https://hpanel.site.com/api/domains/api/direct/";
    const resultBox = document.createElement('div');
    resultBox.style = `
        position: fixed; top: 20px; right: 20px; width: 450px; height: 600px; overflow: auto;
        background: #111; color: #0f0; font-size: 12px; padding: 10px; z-index: 999999; border-radius: 8px;
        border: 2px solid #0f0;
    `;
    resultBox.innerHTML = "<h3>🚀 Endpoint Tester Running...</h3>";
    document.body.appendChild(resultBox);

    const log = (text, color = 'lime') => {
        resultBox.innerHTML += `<p style="color:${color};margin:2px 0;">${text}</p>`;
    };

    log("🔎 Collecting words from page...");

    // Get words from visible page text (buttons, spans, links, divs)
    let pageWords = Array.from(document.querySelectorAll('a, button, span, div, p'))
        .map(e => e.textContent.trim())
        .filter(Boolean)
        .filter(w => w.length < 40 && /^[a-zA-Z0-9_\-]+$/.test(w));

    // Get JS file URLs from <script> tags
    log("🔎 Collecting JS file URLs...");
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);

    let jsWords = [];
    log(`Found ${scripts.length} JS files.`);

    for (let js of scripts) {
        try {
            log(`📥 Fetching JS: ${js.substring(0, 80)}...`, 'yellow');
            const res = await fetch(js);
            const text = await res.text();
            const matches = text.match(/[a-zA-Z0-9_\-]{4,40}/g) || [];
            const filtered = matches.filter(w => w.length < 40);
            jsWords.push(...filtered);
            log(`✅ ${filtered.length} words extracted from JS`, 'lightblue');
        } catch (e) {
            log(`❌ Failed to fetch ${js}`, 'red');
        }
    }

    let allWords = [...new Set([...pageWords, ...jsWords])];
    log(`🟢 Total unique words collected: ${allWords.length}`);

    for (const word of allWords) {
        const fullUrl = baseUrl + encodeURIComponent(word);
        try {
            const res = await fetch(fullUrl);
            if (res.status === 200) {
                log(`✅ ${word} - 200 OK`, 'lightgreen');
            } else {
                log(`⚠️ ${word} - ${res.status}`, 'orange');
            }
        } catch (e) {
            log(`❌ ${word} - ERROR`, 'red');
        }
    }

    log("🎉 Testing Completed!");
})();
