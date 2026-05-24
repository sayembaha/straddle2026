import pandas as pd, re
from typing import List
from bs4 import BeautifulSoup
from .common.sec import ticker_to_cik, recent_filings_cik, primary_doc_html
from .common.utils import Http

def extract_debt_tables(html_text: str) -> List[pd.DataFrame]:
    soup = BeautifulSoup(html_text, "lxml")
    dfs = []
    for tbl in soup.find_all("table"):
        head = " ".join((th.get_text(" ") for th in tbl.find_all("th")))[:500].lower()
        if "maturit" in head or "debt" in head:
            try:
                df = pd.read_html(str(tbl))[0]
                if df.shape[1] >= 3:
                    dfs.append(df)
            except Exception:
                continue
    return dfs

def load_latest_filing_html(ticker: str, filing_type: str="10-K") -> str:
    cik = ticker_to_cik(ticker)
    if not cik: raise RuntimeError(f"Could not map ticker {ticker} to CIK")
    filings = recent_filings_cik(cik, filing_type=filing_type, count=1)
    if not filings: raise RuntimeError(f"No recent {filing_type} for {ticker}")
    acc = filings[0]["accessionNumber"]
    url = primary_doc_html(cik, acc)
    http = Http()
    return http.get(url).text

def summarize_heatmap_frames(dfs: List[pd.DataFrame]) -> pd.DataFrame:
    out = []
    for df in dfs:
        df = df.copy()
        df.columns = [str(c).strip() for c in df.columns]
        year_cols = [c for c in df.columns if re.search(r"20\d{2}", c)]
        if not year_cols:
            continue
        for yc in year_cols:
            try:
                val = pd.to_numeric(df[yc].astype(str).str.replace("[^0-9.]", "", regex=True), errors="coerce").fillna(0).sum()
                out.append({"bucket": yc, "total": float(val)})
            except Exception:
                continue
    if not out: return pd.DataFrame(columns=["bucket","total"])
    res = pd.DataFrame(out).groupby("bucket", as_index=False)["total"].sum()
    return res.sort_values("bucket")
