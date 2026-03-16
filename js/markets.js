.market-row-premium {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    margin-bottom: 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: 0.3s ease;
}

.market-row-premium:hover {
    background: rgba(255, 195, 0, 0.05);
    border-color: rgba(255, 195, 0, 0.2);
}

.coin-name { font-weight: 700; display: block; }
.coin-symbol { font-size: 11px; color: var(--text-dim); text-transform: uppercase; }
.coin-price { font-family: 'Orbitron', sans-serif; font-weight: 600; color: #fff; }

.coin-status.up { color: #00f5d4; }
.coin-status.down { color: #ff5d8f; }
