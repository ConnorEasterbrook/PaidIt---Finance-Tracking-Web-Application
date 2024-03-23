import customtkinter
import pandas as pd
import CTkTable
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
from Data_controller import get_data_from_json
from Variables import Variables


def draw_graph(app, data_path):
    app.overview_graph_title = customtkinter.CTkLabel(app, text='Overview graph', font=('Arial', 20))
    app.overview_graph_title.grid(row=0, column=1, pady=20, sticky='nsew')

    app.overview_graph = FigureCanvasTkAgg(build_graph(app, data_path), master=app)
    app.overview_graph.get_tk_widget().grid(row=1, column=1, sticky='nsew')


def build_graph(app, data_path, currency_sign='£'):
    data = get_data_from_json(data_path)

    # Preprocessing the data
    accumulated_data = {}
    for account_name, account in data.items():
        for inputs in account['Inputs']:
            # get year and month from date
            date = pd.to_datetime(inputs['Date']).strftime('%Y-%m')
            if date not in accumulated_data:
                accumulated_data[date] = {}

            accumulated_data[date][account_name] = inputs['Amount']

    # Convert accumulated_data to DataFrame
    dataframe = pd.DataFrame(accumulated_data).T
    dataframe.index = pd.to_datetime(dataframe.index)
    dataframe.sort_index(inplace=True)
    for account in dataframe.columns:
        dataframe[account] = dataframe[account].ffill()

    dates = dataframe.index
    values = dataframe.values.T

    # Plotting
    fig = Figure(figsize=(10, 4))
    ax = fig.add_subplot(111)

    # Stacked area chart
    ax.stackplot(dates, values, labels=dataframe.columns,
                 colors=[data[account]['Colour'] for account in dataframe.columns], alpha=0.5)
    ax.legend(loc='upper left')

    fig.set_facecolor(Variables.xo_colour_background)
    # Add currency sign to y-axis
    ax.yaxis.set_major_formatter('' + currency_sign + '{x:,.0f}')
    ax.patch.set_alpha(0)
    ax.margins(x=0, y=0)
    ax.tick_params(axis='x', colors=Variables.xo_colour_text)
    ax.tick_params(axis='y', colors=Variables.xo_colour_text)
    ax.spines['bottom'].set_color(Variables.xo_colour_text)
    ax.spines['left'].set_color(Variables.xo_colour_text)
    ax.spines['top'].set_color(Variables.xo_colour_background)
    ax.spines['right'].set_color(Variables.xo_colour_background)
    ax.set_xlabel('Date', color=Variables.xo_colour_muted_text)
    ax.set_ylabel('Amount', color=Variables.xo_colour_muted_text)

    if len(dates) > 2:
        table_values = []
        maximum_table_rows = 12

        for date, row in dataframe.tail(maximum_table_rows).iterrows():
            table_values.append([date.strftime('%Y-%m')] + [currency_sign + str(row.sum())])

        overview_table = CTkTable.CTkTable(master=app, column=2,
                                           row=maximum_table_rows if len(dates) > maximum_table_rows else len(dates),
                                           values=table_values)

        app.overview_graph_title = customtkinter.CTkLabel(app, text='Last ' + str(maximum_table_rows) + ' months',
                                                          font=('Arial', 20))
        app.overview_graph_title.grid(row=0, column=2, pady=20, sticky='nsew')

        overview_table.grid(row=1, column=2, padx=20, sticky='nsew')

    return fig
