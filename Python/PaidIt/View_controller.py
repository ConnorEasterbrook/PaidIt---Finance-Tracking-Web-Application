import tkinter
import customtkinter
from tkcalendar import DateEntry
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from Accounts_graph import draw_graph
from Sidebar_controller import build_sidebar
from Variables import Variables


def build_view(data_path):
    # Configure window
    app = customtkinter.CTk()
    app.title("PaidIt - A finance tracking app")
    app._state_before_windows_set_titlebar_color = 'zoomed'
    app.minsize(800, 600)
    app.configure(fg_color=Variables.xo_colour_background)

    # Configure grid layout
    app.columnconfigure(1, weight=1)
    app.columnconfigure((2, 3), weight=0)
    app.grid_rowconfigure((1, 2), weight=1)

    # Sidebar
    build_sidebar(app)

    # Main content
    draw_graph(app, data_path)

    app.mainloop()


def build_error_view(error_code):
    # Our application frame
    app = customtkinter.CTk()
    app._state_before_windows_set_titlebar_color = 'zoomed'
    app.title('PaidIt - A finance tracking app')

    main_frame = customtkinter.CTkFrame(app)
    main_frame.grid(row=0, column=0, padx=10, pady=10)
    main_frame.pack(fill=tkinter.BOTH, expand=True)

    title = customtkinter.CTkLabel(main_frame, text='PaidIt', font=('Arial', 40))
    title.pack(pady=10)

    error_label = customtkinter.CTkLabel(main_frame, text=error_code)
    error_label.pack(pady=10)

    app.mainloop()
