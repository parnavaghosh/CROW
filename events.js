// ====== DOM Elements ======
const eventsContainer = document.getElementById('events-content');
const defaultMessage = document.getElementById('default-message');

// ====== Repo Config ======
const repoOwner = "parnavaghosh";
const repoName = "CROW-DATA";
const branch = "main";
const jsonPath = "events.json";
const imageFormats = ["jpg", "png", "gif", "mp4"];
const imageBasePath = ""; // Change if images are in a subfolder

// ====== Check if file exists in repo (GitHub API) ======
async function fileExists(path) {
  const apiURL = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}?ref=${branch}`;
  const res = await fetch(apiURL, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
  return res.ok;
}

// ====== Load Event Data ======
async function loadEventData() {
  let hasContent = false;

  // 1. Render media first (image/video)
  for (let ext of imageFormats) {
    const filePath = `${imageBasePath}events.${ext}`;
    if (await fileExists(filePath)) {
      const fileURL = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${filePath}?t=${Date.now()}`;
      let mediaEl;
      if (ext === "mp4") {
        mediaEl = document.createElement('video');
        mediaEl.controls = true;
        mediaEl.src = fileURL;
      } else {
        mediaEl = document.createElement('img');
        mediaEl.src = fileURL;
        mediaEl.alt = "Event Media";
      }
      mediaEl.style.maxWidth = "100%";

      const mediaCard = document.createElement('div');
      mediaCard.className = 'event-card';
      mediaCard.style.display = 'block';
      mediaCard.appendChild(mediaEl);
      eventsContainer.appendChild(mediaCard);

      hasContent = true;
      break; // stop after first media found
    }
  }

  // 2. Render JSON events below media
  if (await fileExists(jsonPath)) {
    try {
      const jsonURL = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${jsonPath}?t=${Date.now()}`;
      const res = await fetch(jsonURL);
      if (res.ok) {
        const eventArray = await res.json();
        if (Array.isArray(eventArray) && eventArray.length > 0) {
          eventArray.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.style.display = 'block';
            card.innerHTML = `
              <h3>${event.title || ""}</h3>
              <p><em>${event.date || ""}</em></p>
              <p>${event.description || ""}</p>`;
            eventsContainer.appendChild(card);
            hasContent = true;
          });
        }
      }
    } catch (err) {
      console.error("Error fetching JSON:", err);
    }
  }

  // 3. Show default message if nothing found
  defaultMessage.style.display = hasContent ? 'none' : 'block';
}

// ====== Run ======
loadEventData();
