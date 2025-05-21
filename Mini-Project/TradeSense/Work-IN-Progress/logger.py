import pandas as pd
from openpyxl import Workbook
import config

def log_signals(signals: list, ticker: str):
    if not signals:
        return
    wb = Workbook()
    ws = wb.active
    ws.title = "Signals"
    ws.append(["Date","Time","Symbol","Signal","Price","Reason"])
    for typ, ts, price, reason in signals:
        ws.append([
            ts.date().isoformat(),
            ts.time().isoformat(),
            ticker,
            typ,
            round(price,2),
            reason
        ])
    wb.save(config.LOG_FILENAME)