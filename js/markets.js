const markets = [
    {n: "S&P 500", t: "SPX", p: "5,120", c: 0.4},
    {n: "Nasdaq", t: "IXIC", p: "16,200", c: 0.9},
    {n: "Dólar", t: "USDBRL", p: "5.02", c: -0.2}
];
const mGrid = document.getElementById("marketGrid");
if(mGrid) mGrid.innerHTML = markets.map(m => `
    <div class="row-item">
        <div><b>${m.n}</b><br><small>${m.t}</small></div>
        <div style="text-align:right">${m.p}<br><span class="${m.c>=0?'up':'down'}">${m.c}%</span></div>
    </div>`).join('');
