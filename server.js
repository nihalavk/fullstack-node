const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const weatherSchema = new mongoose.Schema({
  city: String,
  data: Object,
  date: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', weatherSchema);

app.use(express.json());

app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;

    const newWeather = new Weather({ city, data: weatherData });
    await newWeather.save();

    res.json(weatherData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
