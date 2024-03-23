import pandas as pd
from matplotlib.figure import Figure
from Data_controller import get_data_from_json


def build_graph(data_path, currency_sign="£"):
    xo_colour_text = '#ffffff'
    xo_colour_muted_text = '#dddddd'
    xo_colour_background = '#1e1d1e'

    data = get_data_from_json(data_path)

    # Preprocessing the data
    accumulated_data = {}
    for account_name, account in data.items():
        for inputs in account["Inputs"]:
            # get year and month from date
            date = pd.to_datetime(inputs["Date"]).strftime("%Y-%m")
            if date not in accumulated_data:
                accumulated_data[date] = {}

            accumulated_data[date][account_name] = inputs["Amount"]

    # Convert accumulated_data to DataFrame
    dataframe = pd.DataFrame(accumulated_data).T
    # Sort DataFrame by index (date) to ensure chronological order
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
                 colors=[data[account]["Colour"] for account in dataframe.columns], alpha=0.5)
    ax.legend(loc='upper left')

    fig.set_facecolor(xo_colour_background)
    # Add currency sign to y-axis
    ax.yaxis.set_major_formatter('' + currency_sign + '{x:,.0f}')
    ax.patch.set_alpha(0)
    ax.margins(x=0, y=0)
    ax.tick_params(axis='x', colors=xo_colour_text)
    ax.tick_params(axis='y', colors=xo_colour_text)
    ax.spines['bottom'].set_color(xo_colour_text)
    ax.spines['left'].set_color(xo_colour_text)
    ax.spines['top'].set_color(xo_colour_background)
    ax.spines['right'].set_color(xo_colour_background)
    ax.set_xlabel("Date", color=xo_colour_muted_text)
    ax.set_ylabel("Amount", color=xo_colour_muted_text)

    return fig
