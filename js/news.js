async function loadNews() {
  const data = await fetchAPI("news");

  const container = document.getElementById("newsContainer");

  container.innerHTML = data.map(n => `
    <p style="margin-bottom:10px;">
      🔹 ${n.title}
    </p>
  `).join("");
}

loadNews();
setInterval(loadNews, 300000);
