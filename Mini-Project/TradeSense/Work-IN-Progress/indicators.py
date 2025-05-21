import pandas as pd

def calculate_sma(df: pd.DataFrame, short: int, long: int) -> pd.DataFrame:
    df["SMA_S"] = df["Close"].rolling(window=short).mean()
    df["SMA_L"] = df["Close"].rolling(window=long).mean()
    return df

def generate_signals(df: pd.DataFrame, short: int, long: int):
    signals = []
    for i in range(1, len(df)):
        prev, curr = df.iloc[i-1], df.iloc[i]
        if curr["SMA_S"] > curr["SMA_L"] and prev["SMA_S"] <= prev["SMA_L"]:
            signals.append(("BUY", curr.name, curr["Close"], f"SMA {short}/{long}"))
        elif curr["SMA_S"] < curr["SMA_L"] and prev["SMA_S"] >= prev["SMA_L"]:
            signals.append(("SELL", curr.name, curr["Close"], f"SMA {short}/{long}"))
    return signals