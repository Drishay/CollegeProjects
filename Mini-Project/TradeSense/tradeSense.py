# TradeSense Phase 1 - Monolithic Script
import tkinter as tk
from tkinter import messagebox, filedialog
from tkinter import ttk
import pandas as pd
import yfinance as yf
import datetime
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import threading

# ---- Utility Functions ---- #
def fetch_data(ticker, period='7d', interval='15m'):
    try:
        df = yf.download(ticker, period=period, interval=interval)
        df.dropna(inplace=True)
        return df
    except Exception as e:
        messagebox.showerror("Data Fetch Error", str(e))
        return None

def calculate_signals(df):
    # Add simple moving average
    df['SMA20'] = df['Close'].rolling(window=20).mean()
    df['SMA50'] = df['Close'].rolling(window=50).mean()

    # Simple signal logic
    df['Signal'] = None
    for i in range(1, len(df)):
        if df['SMA20'].iloc[i] > df['SMA50'].iloc[i] and df['SMA20'].iloc[i-1] <= df['SMA50'].iloc[i-1]:
            df.at[df.index[i], 'Signal'] = 'Buy'
        elif df['SMA20'].iloc[i] < df['SMA50'].iloc[i] and df['SMA20'].iloc[i-1] >= df['SMA50'].iloc[i-1]:
            df.at[df.index[i], 'Signal'] = 'Sell'
    return df

def export_signals(df, ticker):
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{ticker}_signals_{timestamp}.csv"
    df[df['Signal'].notna()][['Close', 'SMA20', 'SMA50', 'Signal']].to_csv(filename)
    messagebox.showinfo("Export Success", f"Signals exported to {filename}")

# ---- GUI Setup ---- #
class TradeSenseApp:
    def __init__(self, root):
        self.root = root
        self.root.title("TradeSense - Phase 1 Bot")
        self.root.geometry("900x600")

        self.ticker_var = tk.StringVar()
        self.data = None

        self.setup_widgets()

    def setup_widgets(self):
        frame = ttk.Frame(self.root)
        frame.pack(pady=10)

        ttk.Label(frame, text="Enter Stock/Crypto Ticker (e.g. INFY.NS, BTC-USD):").pack()
        ttk.Entry(frame, textvariable=self.ticker_var, width=30).pack(pady=5)

        ttk.Button(frame, text="Fetch & Analyze", command=self.analyze_thread).pack(pady=5)
        ttk.Button(frame, text="Export Signals", command=self.export_signals).pack(pady=5)

        self.signal_label = ttk.Label(frame, text="")
        self.signal_label.pack(pady=5)

        self.canvas_frame = ttk.Frame(self.root)
        self.canvas_frame.pack(fill=tk.BOTH, expand=True)

    def analyze_thread(self):
        threading.Thread(target=self.fetch_and_plot).start()

    def fetch_and_plot(self):
        ticker = self.ticker_var.get()
        if not ticker:
            messagebox.showwarning("Input Required", "Please enter a ticker symbol.")
            return

        self.signal_label.config(text="Fetching and analyzing...")
        df = fetch_data(ticker)
        if df is not None:
            df = calculate_signals(df)
            self.data = df
            self.plot_signals(df, ticker)
            recent = df[df['Signal'].notna()].tail(1)
            if not recent.empty:
                self.signal_label.config(text=f"Last Signal: {recent['Signal'].values[0]} @ {recent['Close'].values[0]:.2f}")
            else:
                self.signal_label.config(text="No recent signals.")

    def plot_signals(self, df, ticker):
        for widget in self.canvas_frame.winfo_children():
            widget.destroy()

        fig, ax = plt.subplots(figsize=(9, 4))
        ax.plot(df.index, df['Close'], label='Close Price', alpha=0.5)
        ax.plot(df.index, df['SMA20'], label='SMA20', color='green')
        ax.plot(df.index, df['SMA50'], label='SMA50', color='red')

        buys = df[df['Signal'] == 'Buy']
        sells = df[df['Signal'] == 'Sell']
        ax.scatter(buys.index, buys['Close'], label='Buy', marker='^', color='blue')
        ax.scatter(sells.index, sells['Close'], label='Sell', marker='v', color='orange')

        ax.set_title(f"TradeSense Signals - {ticker}")
        ax.legend()

        canvas = FigureCanvasTkAgg(fig, master=self.canvas_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

    def export_signals(self):
        if self.data is not None:
            export_signals(self.data, self.ticker_var.get())
        else:
            messagebox.showwarning("No Data", "Run analysis before exporting.")


if __name__ == '__main__':
    root = tk.Tk()
    app = TradeSenseApp(root)
    root.mainloop()
