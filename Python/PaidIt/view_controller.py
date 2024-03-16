import tkinter
import customtkinter
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from accounts_graph import build_graph


def build_view(data_path):
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
    canvas = FigureCanvasTkAgg(build_graph(data_path), master=main_frame)
    canvas.get_tk_widget().pack()

    app.mainloop()


def build_error_view(error_code):
    # Our application frame
    app = customtkinter.CTk()
    app._state_before_windows_set_titlebar_color = 'zoomed'
    app.title("PaidIt - A finance tracking app")

    main_frame = customtkinter.CTkFrame(app)
    main_frame.grid(row=0, column=0, padx=10, pady=10)
    main_frame.pack(fill=tkinter.BOTH, expand=True)

    title = customtkinter.CTkLabel(main_frame, text="PaidIt", font=("Arial", 40))
    title.pack(pady=10)

    error_label = customtkinter.CTkLabel(main_frame, text=error_code)
    error_label.pack(pady=10)

    app.mainloop()
