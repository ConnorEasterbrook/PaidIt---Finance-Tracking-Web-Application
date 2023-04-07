using SQLite;
namespace PaidIt.Data;

public class WeatherForecastService
{
    string _dbPath;
    public string StatusMessage { get; set; }
    private SQLiteAsyncConnection SQLConnection;
    public WeatherForecastService(string dbPath)
    {
        _dbPath = dbPath;
    }
    private async Task InitAsync()
    {
        // Don't Create database if it exists
        if (SQLConnection != null)
            return;
        // Create database and WeatherForecast Table
        SQLConnection = new SQLiteAsyncConnection(_dbPath);
        await SQLConnection.CreateTableAsync<WeatherForecast>();
    }
    public async Task<List<WeatherForecast>> GetForecastAsync()
    {
        await InitAsync();
        return await SQLConnection.Table<WeatherForecast>().ToListAsync();
    }
    public async Task<WeatherForecast> CreateForecastAsync(
        WeatherForecast paramWeatherForecast)
    {
        // Insert
        await SQLConnection.InsertAsync(paramWeatherForecast);
        // return the object with the
        // auto incremented Id populated
        return paramWeatherForecast;
    }
    public async Task<WeatherForecast> UpdateForecastAsync(
        WeatherForecast paramWeatherForecast)
    {
        // Update
        await SQLConnection.UpdateAsync(paramWeatherForecast);
        // Return the updated object
        return paramWeatherForecast;
    }
    public async Task<WeatherForecast> DeleteForecastAsync(
        WeatherForecast paramWeatherForecast)
    {
        // Delete
        await SQLConnection.DeleteAsync(paramWeatherForecast);
        return paramWeatherForecast;
    }
}

