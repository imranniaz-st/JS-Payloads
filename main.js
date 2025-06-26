javascript:(function () {
    var scripts = document.getElementsByTagName("script");
    var regex = /(?<=(\"|\%27|\'))\/[a-zA-Z0-9_?&=\/\.-]+/g;
    const results = new Set();

    for (var i = 0; i < scripts.length; i++) {
        var t = scripts[i].src || "";
        if (t)
            fetch(t)
                .then(t => t.text())
                .then(function (t) {
                    var e = t.matchAll(regex);
                    for (let r of e) results.add(r[0]);
                })
                .catch(function (t) {
                    console.log("An error occurred: ", t);
                });
    }

    var pageContent = document.documentElement.outerHTML;
    var matches = pageContent.matchAll(regex);
    for (const match of matches) results.add(match[0]);

    function writeResults() {
        results.forEach(function (t) {
            document.write(t + "<br>");
        });
    }

    setTimeout(writeResults, 3000);
})();
