import axios from "axios";
import * as humanizeList from "humanize-list";
import { IBotResponse, IGroupMeMessage, IResponseTrigger } from "../types";

export default class WeatherResponseTrigger implements IResponseTrigger {
  public triggerWords = ["@weather"];

  public async respond(message: IGroupMeMessage): Promise<IBotResponse> {
    const city = message.text.split(" ").slice(1).join(" ");
    if (city === "") {
      return Promise.resolve({responseText: "No City Found"});
    }
    const weatherMessage = await this.createWeatherMessage(city);
    const response: IBotResponse = {
      responseText: weatherMessage,
    };
    return Promise.resolve(response);
  }

  private async createWeatherMessage(city: string) {
    const encodedCity = encodeURIComponent(city);
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&APPID=${process.env.WEATHER_API_KEY}`);
      console.log(response.data);
      return this.makeWeatherMessage(response.data);
    } catch (error) {
      console.log("Get Weather Data Error", error);
    }
  }

  private makeWeatherMessage(weather: any) {
    const tempInFahrenheit = Math.floor((weather.main.temp - 273.15) * 9 / 5 +
      32);
    const humidity = weather.main.humidity;
    const descriptions = humanizeList(
      weather.weather.map((code) => code.description), {oxfordComma: true});
    const city = weather.name;
    const country = weather.sys.country;

    return `It is ${tempInFahrenheit}°F in ${city}, ${country} with a humidity of ${humidity}% with ${descriptions}`;
  }
}
