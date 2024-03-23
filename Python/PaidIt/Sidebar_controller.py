import customtkinter
from Variables import Variables


def build_sidebar(app):
    app.sidebar_frame = customtkinter.CTkFrame(app, corner_radius=0)
    app.sidebar_frame.grid(row=0, column=0, rowspan=4, sticky='nsew')
    app.sidebar_frame.grid_rowconfigure(2, weight=1)
    app.logo_label = customtkinter.CTkLabel(app.sidebar_frame, text='PaidIt',
                                            font=customtkinter.CTkFont(size=40, weight='bold'),
                                            text_color=Variables.xo_colour_text)
    app.logo_label.grid(row=0, column=0, padx=20, pady=10)
    app.sidebar_button_1 = customtkinter.CTkButton(app.sidebar_frame, text='Overview', command=sidebar_button_event)
    app.sidebar_button_1.grid(row=1, column=0, padx=20, pady=10)
    app.copyright = customtkinter.CTkLabel(app.sidebar_frame, text='ExoWeb © 2024',
                                           font=customtkinter.CTkFont(size=20, weight='bold'),
                                           text_color=Variables.xo_colour_text, anchor='w')
    app.copyright.grid(row=3, column=0, padx=20)


def sidebar_button_event():
    print("sidebar_button click")
