# Small js Payload 
### thsi will help you to find all  payloads  find api  endpoints  for testign 
### Usage
open the console in your browser and paste the code below, then press enter.

```javascript
javascript:(function () {
    const scripts = document.getElementsByTagName("script");
    const regex = /(?<=["'`])\/[a-zA-Z0-9_\-\/.?&=%]+(?=["'`])/g;
    const results = new Set();

    // Extract from inline HTML
    const html = document.documentElement.outerHTML;
    const inlineMatches = html.matchAll(regex);
    for (const match of inlineMatches) results.add(match[0]);

    // Extract from external JS
    for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src || "";
        if (src) {
            fetch(src)
                .then(res => res.text())
                .then(code => {
                    const matches = code.matchAll(regex);
                    for (let match of matches) results.add(match[0]);
                })
                .catch(err => console.warn("Script fetch error:", err));
        }
    }

    function createTable(title, id, color) {
        return `
            <h3 style='color:${color};font-family:sans-serif;'>${title}</h3>
            <table border='1' cellpadding='8' cellspacing='0' style='font-family:sans-serif;border-collapse:collapse;width:100%;margin-bottom:30px;'>
                <thead style='background:#f0f0f0;'>
                    <tr>
                        <th>Status</th>
                        <th>Endpoint</th>
                        <th>Full URL</th>
                    </tr>
                </thead>
                <tbody id='${id}'></tbody>
            </table>
        `;
    }

    function renderResults() {
        document.body.innerHTML = `
            <h2 style='font-family:sans-serif;'>🔍 Endpoint Scanner Results</h2>
            ${createTable("✅ 200 OK Endpoints", "table_200", "green")}
            ${createTable("❌ Other Error Statuses", "table_other", "orange")}
            ${createTable("❌ Fetch or Network Errors", "table_fail", "red")}
        `;

        const table200 = document.getElementById("table_200");
        const tableOther = document.getElementById("table_other");
        const tableFail = document.getElementById("table_fail");

        results.forEach(path => {
            if (path.includes('{') || path.includes('#') || path.includes('<')) return;
            const fullUrl = window.location.origin + path;

            fetch(fullUrl)
                .then(res => {
                    const row = document.createElement("tr");
                    const status = res.status;
                    const statusText = res.status === 200 ? "✅ 200" : `❌ ${status}`;
                    const color = res.status === 200 ? "green" : "orange";

                    row.innerHTML = `
                        <td style='color:${color};text-align:center;'>${statusText}</td>
                        <td><code>${path}</code></td>
                        <td>${res.status === 200 ? `<a href="${fullUrl}" target="_blank">${fullUrl}</a>` : `<code>${fullUrl}</code>`}</td>
                    `;

                    if (status === 200) {
                        table200.appendChild(row);
                    } else {
                        tableOther.appendChild(row);
                    }
                })
                .catch(() => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td style='color:red;text-align:center;'>❌ ERR</td>
                        <td><code>${path}</code></td>
                        <td><code>${window.location.origin + path}</code></td>
                    `;
                    tableFail.appendChild(row);
                });
        });
    }

    setTimeout(renderResults, 3000); // Wait for JS fetching
})();
```

### Note
- This script will scan the current page for all JavaScript files and inline scripts, extracting potential API endpoints.
- It will then attempt to fetch each endpoint and display the results in a table format.
- The results will show the status of each endpoint, categorized into 200 OK, other error statuses, and fetch/network errors.
- Ensure you have permission to test the endpoints on the page, as this script will make network requests.
- This script is intended for educational and testing purposes only. Use responsibly and ethically.
```
### Disclaimer
This script is provided for educational purposes only. Use it responsibly and ensure you have permission to test the endpoints on the page. Unauthorized testing may violate terms of service or legal regulations.
