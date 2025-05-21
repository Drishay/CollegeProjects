import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import config
from data_fetcher import fetch_data
from indicators import calculate_sma, generate_signals
from logger import log_signals

class TradeSenseGUI:
    def __init__(self, root):
        self.root = root
        root.title("TradeSense Phase 1")
        root.geometry("900x600")
        self.setup_vars()
        self.build_sidebar()
        self.build_plot_area()

    def setup_vars(self):
        self.ticker    = tk.StringVar(value=config.TICKER_LIST[0])
        self.sma_short = tk.IntVar(value=config.DEFAULT_SMA_SHORT)
        self.sma_long  = tk.IntVar(value=config.DEFAULT_SMA_LONG)
        self.status    = tk.StringVar(value="Idle")

    def build_sidebar(self):
        frame = ttk.Frame(self.root, padding=10)
        frame.pack(side=tk.LEFT, fill=tk.Y)
        ttk.Label(frame, text="Select Ticker:").pack(pady=2)
        ttk.Combobox(frame, textvariable=self.ticker, values=config.TICKER_LIST).pack(pady=2)
        ttk.Label(frame, text="SMA Short:").pack(pady=2)
        ttk.Entry(frame, textvariable=self.sma_short).pack(pady=2)
        ttk.Label(frame, text="SMA Long:").pack(pady=2)
        ttk.Entry(frame, textvariable=self.sma_long).pack(pady=2)
        ttk.Button(frame, text="Analyze", command=self.on_analyze).pack(pady=10)
        ttk.Label(frame, textvariable=self.status, wraplength=180).pack(pady=5)

    def build_plot_area(self):
        plot_frame = ttk.Frame(self.root)
        plot_frame.pack(fill=tk.BOTH, expand=True)
        self.fig, self.ax = plt.subplots(figsize=(6,4))
        self.canvas = FigureCanvasTkAgg(self.fig, master=plot_frame)
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

    def on_analyze(self):
        ticker = self.ticker.get()
        df = fetch_data(ticker)
        if df is None: return
        df = calculate_sma(df, self.sma_short.get(), self.sma_long.get())
        signals = generate_signals(df, self.sma_short.get(), self.sma_long.get())
        log_signals(signals, ticker)
        self.update_plot(df, ticker)
        self.update_status(signals)

    def update_plot(self, df, ticker):
        self.ax.clear()
        self.ax.plot(df.index, df["Close"], label="Close")
        self.ax.plot(df.index, df["SMA_S"], label=f"SMA {self.sma_short.get()}")
        self.ax.plot(df.index, df["SMA_L"], label=f"SMA {self.sma_long.get()}")
        self.ax.set_title(ticker)
        self.ax.legend()
        self.canvas.draw()

    def update_status(self, signals):
        if signals:
            typ, ts, price, _ = signals[-1]
            self.status.set(f"{typ} @ ₹{price:.2f} on {ts.date()}")
        else:
            self.status.set("No signals")