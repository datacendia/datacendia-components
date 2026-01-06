# TRADING DESK RISK ASSESSMENT

## Daily Risk Report - Fixed Income & Derivatives

**Report Date**: January 4, 2026
**Trading Desk**: Global Markets - Fixed Income
**Risk Officer**: [Redacted]
**Report ID**: TRR-2026-0104

---

## DISCLAIMER

**THIS DOCUMENT IS FOR DEMONSTRATION PURPOSES ONLY**

This simulated trading risk report demonstrates CendiaFinancial™ risk management capabilities. It does not represent actual trading positions or market data.

---

## 1. EXECUTIVE RISK SUMMARY

| Metric | Limit | Current | Utilization | Status |
|--------|-------|---------|-------------|--------|
| Total VaR (99%, 1-day) | $50M | $38.7M | 77% | ✅ Within Limit |
| Stressed VaR | $150M | $112.4M | 75% | ✅ Within Limit |
| Interest Rate DV01 | $2.5M | $1.87M | 75% | ✅ Within Limit |
| Credit Spread DV01 | $1.5M | $1.24M | 83% | ⚠️ Approaching |
| Gross Notional | $50B | $42.8B | 86% | ⚠️ Approaching |
| Net Greeks (Delta) | $25M | $18.4M | 74% | ✅ Within Limit |

**Risk Status**: ELEVATED - Credit spread exposure approaching limits

---

## 2. VALUE AT RISK (VaR) ANALYSIS

### 2.1 VaR by Risk Factor

| Risk Factor | VaR ($M) | % of Total | Change vs. Prior |
|-------------|----------|------------|------------------|
| Interest Rates | $18.4 | 47.5% | +$2.1M |
| Credit Spreads | $12.7 | 32.8% | +$4.3M |
| FX Rates | $4.2 | 10.9% | -$0.8M |
| Equity/Volatility | $2.1 | 5.4% | +$0.3M |
| Commodity | $1.3 | 3.4% | -$0.2M |
| **Total (Diversified)** | **$38.7** | **100%** | **+$5.7M** |

### 2.2 VaR Trend (Last 30 Days)

| Date | VaR ($M) | Limit | P&L ($M) | Breach |
|------|----------|-------|----------|--------|
| Dec 5 | $31.2 | $50M | +$2.4 | No |
| Dec 12 | $33.8 | $50M | -$1.8 | No |
| Dec 19 | $35.4 | $50M | +$4.2 | No |
| Dec 26 | $32.1 | $50M | +$0.8 | No |
| Jan 2 | $33.0 | $50M | -$2.1 | No |
| **Jan 4** | **$38.7** | **$50M** | **-$3.4** | **No** |

### 2.3 VaR Backtesting

| Period | Trading Days | Exceptions | Expected (99%) | Status |
|--------|--------------|------------|----------------|--------|
| Last 250 days | 250 | 3 | 2-3 | ✅ Green Zone |
| Last 60 days | 60 | 1 | 0-1 | ✅ Green Zone |
| YTD 2026 | 3 | 0 | 0 | ✅ Green Zone |

---

## 3. POSITION SUMMARY

### 3.1 Fixed Income Positions

| Product | Notional ($M) | DV01 ($K) | Spread DV01 ($K) | VaR ($M) |
|---------|---------------|-----------|------------------|----------|
| US Treasuries | $8,500 | $425 | $0 | $4.2 |
| Agency MBS | $6,200 | $372 | $124 | $5.8 |
| Investment Grade Corp | $4,800 | $288 | $384 | $6.4 |
| High Yield Corp | $1,200 | $84 | $312 | $4.8 |
| Emerging Markets | $850 | $51 | $170 | $3.2 |
| **Total Fixed Income** | **$21,550** | **$1,220** | **$990** | **$24.4** |

### 3.2 Derivatives Positions

| Product | Notional ($M) | Delta ($M) | Gamma ($M) | Vega ($M) | VaR ($M) |
|---------|---------------|------------|------------|-----------|----------|
| Interest Rate Swaps | $12,400 | $0.0 | N/A | N/A | $6.2 |
| Credit Default Swaps | $3,200 | N/A | N/A | N/A | $4.8 |
| FX Forwards | $2,800 | $2.1 | N/A | N/A | $2.1 |
| Equity Options | $1,850 | $12.4 | $0.8 | $2.4 | $3.4 |
| Swaptions | $1,000 | $3.9 | $0.2 | $1.8 | $2.8 |
| **Total Derivatives** | **$21,250** | **$18.4** | **$1.0** | **$4.2** | **$19.3** |

### 3.3 Top 10 Positions by Risk Contribution

| Rank | Position | Notional ($M) | VaR ($M) | % of Total |
|------|----------|---------------|----------|------------|
| 1 | UST 10Y Short | ($2,500) | $4.8 | 12.4% |
| 2 | CDX.IG Long Protection | $1,200 | $3.2 | 8.3% |
| 3 | FNMA 30Y MBS | $1,800 | $2.9 | 7.5% |
| 4 | EUR/USD Forward | $1,400 | $2.4 | 6.2% |
| 5 | HYG CDS Short Protection | $800 | $2.2 | 5.7% |
| 6 | 5Y Receiver Swaption | $500 | $1.9 | 4.9% |
| 7 | EM Sovereign (Brazil) | $450 | $1.8 | 4.7% |
| 8 | SPX Put Spread | $600 | $1.6 | 4.1% |
| 9 | Corp Bond (AAPL) | $400 | $1.4 | 3.6% |
| 10 | UST 2Y Long | $1,200 | $1.2 | 3.1% |

---

## 4. STRESS TESTING

### 4.1 Historical Scenarios

| Scenario | Date | P&L Impact ($M) | Worst Position |
|----------|------|-----------------|----------------|
| COVID Crash | Mar 2020 | ($84.2) | Credit Spreads |
| Taper Tantrum | May 2013 | ($42.8) | EM Bonds |
| Flash Crash | Aug 2015 | ($28.4) | Equity Options |
| Brexit | Jun 2016 | ($31.2) | FX Forwards |
| Fed Hike Surprise | Dec 2018 | ($38.7) | Duration |

### 4.2 Hypothetical Scenarios

| Scenario | Description | P&L Impact ($M) |
|----------|-------------|-----------------|
| Rates +100bps | Parallel shift up | ($18.7) |
| Rates -100bps | Parallel shift down | $16.2 |
| Spreads +50bps | Credit widening | ($12.4) |
| Spreads -25bps | Credit tightening | $6.2 |
| Equity -20% | Market crash | ($8.4) |
| Vol +50% | Volatility spike | $4.8 |
| USD +10% | Dollar strength | ($4.2) |
| Combined Adverse | All adverse moves | ($52.8) |

### 4.3 Reverse Stress Test

**Question**: What market move would cause a $100M loss?

| Factor | Required Move | Historical Precedent |
|--------|---------------|---------------------|
| Interest Rates | +265bps (1 day) | Never occurred |
| Credit Spreads | +125bps (1 day) | Mar 2020 (COVID) |
| Combined | Rates +150bps, Spreads +75bps | Unlikely |

---

## 5. GREEKS ANALYSIS

### 5.1 Interest Rate Sensitivity

| Tenor | DV01 ($K) | Limit ($K) | Utilization |
|-------|-----------|------------|-------------|
| 0-2Y | $312 | $500 | 62% |
| 2-5Y | $487 | $600 | 81% |
| 5-10Y | $624 | $800 | 78% |
| 10-30Y | $447 | $600 | 75% |
| **Total** | **$1,870** | **$2,500** | **75%** |

### 5.2 Options Greeks

| Greek | Current | Limit | Utilization | Status |
|-------|---------|-------|-------------|--------|
| Delta | $18.4M | $25M | 74% | ✅ |
| Gamma | $1.0M | $2M | 50% | ✅ |
| Vega | $4.2M | $8M | 53% | ✅ |
| Theta | ($124K)/day | N/A | N/A | Monitor |

---

## 6. COUNTERPARTY EXPOSURE

### 6.1 Top Counterparty Exposures

| Counterparty | Gross ($M) | Net ($M) | Collateral ($M) | Net Exposure ($M) |
|--------------|------------|----------|-----------------|-------------------|
| Goldman Sachs | $2,847 | $487 | $425 | $62 |
| JP Morgan | $2,412 | $312 | $300 | $12 |
| Morgan Stanley | $1,987 | $245 | $220 | $25 |
| Citi | $1,654 | $198 | $180 | $18 |
| Bank of America | $1,423 | $167 | $150 | $17 |
| **Total Top 5** | **$10,323** | **$1,409** | **$1,275** | **$134** |

### 6.2 Collateral Summary

| Type | Posted ($M) | Received ($M) | Net ($M) |
|------|-------------|---------------|----------|
| Cash | $847 | $1,124 | $277 |
| Government Securities | $312 | $425 | $113 |
| **Total** | **$1,159** | **$1,549** | **$390** |

---

## 7. LIMIT BREACHES & EXCEPTIONS

### 7.1 Current Breaches

| Limit | Threshold | Current | Breach | Action Required |
|-------|-----------|---------|--------|-----------------|
| None | - | - | - | - |

### 7.2 Near-Breach Warnings (>80% Utilization)

| Limit | Threshold | Current | Utilization | Trend |
|-------|-----------|---------|-------------|-------|
| Credit Spread DV01 | $1.5M | $1.24M | 83% | ↑ Rising |
| Gross Notional | $50B | $42.8B | 86% | → Stable |
| 2-5Y DV01 | $600K | $487K | 81% | ↑ Rising |

### 7.3 Recommended Actions

1. **Credit Spread Exposure**: Consider reducing HY CDS short protection position
2. **Gross Notional**: Monitor for further increases; no immediate action required
3. **2-5Y Duration**: Review UST 5Y position sizing

---

## 8. P&L ATTRIBUTION

### 8.1 Daily P&L Breakdown

| Source | P&L ($M) | % of Total |
|--------|----------|------------|
| Interest Rate Moves | ($2.1) | 62% |
| Credit Spread Moves | ($1.8) | 53% |
| FX Moves | $0.4 | (12%) |
| Carry/Roll | $0.2 | (6%) |
| Trading Activity | ($0.1) | 3% |
| **Total P&L** | **($3.4)** | **100%** |

### 8.2 MTD/YTD Performance

| Period | P&L ($M) | VaR Utilization (Avg) | Sharpe Ratio |
|--------|----------|----------------------|--------------|
| MTD | ($3.4) | 75% | N/A |
| YTD | ($3.4) | 75% | N/A |
| Prior Month | $8.2 | 68% | 1.4 |
| Prior Quarter | $24.7 | 65% | 1.8 |

---

## 9. MARKET COMMENTARY

### Key Market Moves (January 4, 2026)

| Market | Close | Change | Impact |
|--------|-------|--------|--------|
| UST 10Y Yield | 4.52% | +8bps | Negative |
| UST 2Y Yield | 4.28% | +5bps | Negative |
| CDX.IG | 58bps | +3bps | Negative |
| CDX.HY | 342bps | +12bps | Negative |
| EUR/USD | 1.0842 | +0.3% | Positive |
| S&P 500 | 4,847 | -0.8% | Neutral |
| VIX | 18.4 | +1.2 | Positive |

### Risk Outlook

- **Interest Rates**: Fed meeting next week; expect continued volatility
- **Credit**: Spreads widening on growth concerns; maintain defensive positioning
- **FX**: EUR strength may continue; monitor ECB commentary

---

## 10. SIGN-OFF

| Role | Name | Time |
|------|------|------|
| Desk Head | [Redacted] | 17:30 |
| Risk Manager | [Redacted] | 17:45 |
| Chief Risk Officer | [Redacted] | 18:00 |

---

*For CendiaFinancial™ Demo Purposes*
