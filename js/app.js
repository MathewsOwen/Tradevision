const Home = {
    init() {
        this.ticker();
        if(document.getElementById('ai-timer')) this.timer();
    },
    ticker() {
        const t = document.getElementById('tickerTrack');
        if(t) t.innerHTML = `<span>${"BTC $64.1k ▲ | IBOV 128k ▼ | ETH $3.4k ▲ | USD 5.02 ▼ | ".repeat(15)}</span>`;
    },
    timer() {
        let s = 600;
        setInterval(() => {
            s--; if(s<0) s=600;
            document.getElementById('ai-timer').innerText = `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
            if(s%30===0) this.updateGraph();
        }, 1000);
        this.updateGraph();
    },
    updateGraph() {
        const g = document.getElementById('projection-graph');
        if(g) g.innerHTML = Array(20).fill().map(() => `<div class="bar" style="height:${Math.random()*90+10}%"></div>`).join('');
    }
};
document.addEventListener('DOMContentLoaded', () => Home.init());
