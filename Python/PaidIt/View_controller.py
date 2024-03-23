import tkinter
import customtkinter
from tkcalendar import DateEntry
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from Accounts_graph import build_graph


def build_view(data_path):
    # Variables
    xo_colour_text = '#ffffff'
    xo_colour_muted_text = '#dddddd'
    xo_colour_background = '#1e1d1e'

    # Configure window
    app = customtkinter.CTk()
    app.title("PaidIt - A finance tracking app")
    app._state_before_windows_set_titlebar_color = 'zoomed'
    app.minsize(800, 600)
    app.configure(fg_color=xo_colour_background)

    # Configure grid layout
    app.columnconfigure(1, weight=1)
    app.columnconfigure((2, 3), weight=0)
    app.rowconfigure(0, weight=0, )
    app.grid_rowconfigure((1, 2), weight=1)

    # Sidebar
    app.sidebar_frame = customtkinter.CTkFrame(app, corner_radius=0)
    app.sidebar_frame.grid(row=0, column=0, sticky='nsew')
    app.logo_label = customtkinter.CTkLabel(app.sidebar_frame, text="PaidIt",
                                            font=customtkinter.CTkFont(size=40, weight='bold'),
                                            text_color=xo_colour_text)
    app.logo_label.grid(row=0, column=0, padx=20, pady=10)

    # Main content
    app.overview_graph_title = customtkinter.CTkLabel(app, text="Overview graph", font=("Arial", 20))
    app.overview_graph_title.grid(row=0, column=1, sticky='nsew')
    app.overview_graph = FigureCanvasTkAgg(build_graph(data_path), master=app)
    app.overview_graph.get_tk_widget().grid(row=1, column=1, sticky='nsew')

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
