document.addEventListener("DOMContentLoaded", async () => {

const newsFeed = document.getElementById("newsFeed")

if (!newsFeed) return

try {

const url = "https://newsapi.org/v2/everything?q=bolsa OR bitcoin OR mercado financeiro&language=pt&sortBy=publishedAt&pageSize=12&apiKey=36f6190c46284b89876d032af65ecbf8"

const response = await fetch(url)

const data = await response.json()

const articles = data.articles

newsFeed.innerHTML = articles.map(news => `

<article class="news-item news-item-advanced">

<span class="news-meta">MERCADO</span>

<h3>${news.title}</h3>

<p>${news.description ?? ""}</p>

<a href="${news.url}" target="_blank">Ler notícia</a>

</article>

`).join("")

} catch (error) {

newsFeed.innerHTML = "<p>Não foi possível carregar as notícias agora.</p>"

}

})
