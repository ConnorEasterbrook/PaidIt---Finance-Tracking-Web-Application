import tkinter
import customtkinter
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import (FigureCanvasTkAgg, NavigationToolbar2Tk)

# Variables
xo_colour_text = '#ffffff'
xo_colour_muted_text = '#dddddd'
xo_colour_background = '#1e1d1e'

# Our application frame
app = customtkinter.CTk()
app._state_before_windows_set_titlebar_color = 'zoomed'
app.title("PaidIt - A finance tracking app")

# UI Elements
main_frame = customtkinter.CTkFrame(app, fg_color=xo_colour_background)
main_frame.grid(row=0, column=0, padx=10, pady=10)
main_frame.pack(fill=tkinter.BOTH, expand=True)

## Title
title = customtkinter.CTkLabel(main_frame, text="PaidIt", font=("Arial", 40), text_color=xo_colour_text)
title.pack(pady=10)

## Graph
fig = Figure(figsize=(5, 4), dpi=100)
y = [1, 4, 6, 8, 4, 2, 1, 7]
x = range(1, y.__len__() + 1)
ax = fig.add_subplot()

### Style Graph
fig.set_facecolor(xo_colour_background)
ax.fill_between(x, y, color='skyblue', alpha=0.4)
ax.plot(x, y, color='SkyBlue', alpha=0.6)
ax.patch.set_alpha(0)
ax.margins(x=0, y=0)
ax.tick_params(axis='x', colors=xo_colour_text)
ax.tick_params(axis='y', colors=xo_colour_text)
ax.spines['bottom'].set_color(xo_colour_text)
ax.spines['left'].set_color(xo_colour_text)
ax.spines['top'].set_color(xo_colour_background)
ax.spines['right'].set_color(xo_colour_background)

canvas = FigureCanvasTkAgg(fig, master=main_frame)
canvas.draw()
canvas.get_tk_widget().pack()

canvas.get_tk_widget().pack()

# Run application
app.mainloop()
