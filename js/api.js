const PronuxAPI = {
    async getCripto() {
        try {
            const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true");
            return r.ok ? await r.json() : null;
        } catch(e) { return null; }
    }
};
