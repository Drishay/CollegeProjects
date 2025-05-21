import yfinance as yf
from tkinter import messagebox
import config

def fetch_data(ticker: str):
    try:
        df = yf.download(
            ticker,
            period=config.DATA_PERIOD,
            interval=config.DATA_INTERVAL,
            auto_adjust=False,
            progress=False
        )
        if df.empty:
            raise ValueError(f"No data for {ticker}")
        return df
    except Exception as e:
        messagebox.showerror("Data Fetch Error", str(e))
        return None
