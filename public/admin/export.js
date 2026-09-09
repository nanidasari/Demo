
(function () {
  const FILES = [
    "content/pages/home.yml",
    "content/pages/about.yml",
    "content/settings.yml",
    "content/portfolio/manifest.json",
    "content/services/manifest.json",
    "content/testimonials/manifest.json",
    "content/team/manifest.json"
  ];

  async function getText(path) {
    const res = await fetch("/" + path + "?v=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error(path + " (" + res.status + ")");
    return res.text();
  }

  async function exportSiteSnapshot() {
    const button = document.querySelector("#pixcel-export-btn");
    if (button) { button.disabled = true; button.textContent = "EXPORTING…"; }
    try {
      const zip = new JSZip();
      const files = await Promise.all(FILES.map(async (path) => [path, await getText(path)]));
      files.forEach(([path, text]) => zip.file(path, text));

      // Include all public content records and media that are visible from this deployed site.
      const manifestMap = {};
      files.filter(([path]) => path.endsWith("manifest.json")).forEach(([path, text]) => {
        try {
          manifestMap[path.split("/")[2]] = JSON.parse(text);
        } catch (_) {
          manifestMap[path.split("/")[2]] = [];
        }
      });

      for (const folder of ["portfolio", "services", "testimonials", "team"]) {
        const names = Array.isArray(manifestMap[folder]) ? manifestMap[folder] : [];
        for (const name of names) {
          const path = `content/${folder}/${name}`;
          try { zip.file(path, await getText(path)); } catch (_) {}
        }
      }

      zip.file("EXPORT-README.txt",
`Pixcel Studio CMS export
Generated: ${new Date().toISOString()}

This snapshot contains the CMS content files available from the deployed site.
To update the live site, edit the source repository through Decap CMS / Git Gateway.
Images uploaded through the CMS remain in the site's /uploads/ folder and are not embedded in this snapshot.
`);
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pixcel-studio-site-export-" + new Date().toISOString().slice(0,10) + ".zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      if (button) button.textContent = "✓ EXPORTED";
    } catch (err) {
      console.error(err);
      alert("Export failed. Please make sure the CMS is served from the deployed site and try again.");
      if (button) button.textContent = "EXPORT SITE";
    } finally {
      if (button) setTimeout(() => { button.disabled = false; button.textContent = "EXPORT SITE"; }, 1600);
    }
  }

  function mountExportButton() {
    if (document.querySelector("#pixcel-export-btn")) return;
    const button = document.createElement("button");
    button.id = "pixcel-export-btn";
    button.type = "button";
    button.textContent = "EXPORT SITE";
    Object.assign(button.style, {
      position:"fixed", right:"20px", bottom:"20px", zIndex:"99999",
      border:"1px solid rgba(255,255,255,.25)", borderRadius:"999px",
      padding:"12px 17px", background:"#11131a", color:"#fff",
      font:"700 11px/1 Inter,system-ui,sans-serif", letterSpacing:".12em",
      boxShadow:"0 12px 40px rgba(0,0,0,.28)", cursor:"pointer"
    });
    button.addEventListener("click", exportSiteSnapshot);
    document.body.appendChild(button);
  }

  function loadZipLibrary() {
    if (window.JSZip) return mountExportButton();
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = mountExportButton;
    s.onerror = () => console.warn("Could not load JSZip; export button unavailable.");
    document.head.appendChild(s);
  }

  window.addEventListener("load", () => setTimeout(loadZipLibrary, 1200));
})();
