<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- loading spinner -->
    <img src="@/assets/spinner.svg" v-if="loading" />

    <!--  banner -->
    <div
      v-if="this.$route.query.preview && !loading"
      class="text-white p-4 bg-weather-secondary w-full text-center">
      <p>
        You are currently previewing this city, click the "+" icon to start
        tracking this city.
      </p>
    </div>

    <!-- weather overview -->
    <div class="flex flex-col items-center text-white py-12" v-if="weatherData">
      <h1 class="text-4xl mb-2">{{ city }}</h1>
      <p class="text-sm mb-12">
        {{ localDateString }}
        {{ localTimeString }}
      </p>
      <p class="text-8xl mb-8">{{ currentTemp }}&deg;</p>

      <p>
        Feels Like
        {{ feelsLike }} &deg;
      </p>
      <p class="capitalize">
        {{ description }}
      </p>
      <img :src="imgSrc" class="w-[150px] h-auto" />
    </div>

    <hr class="border-white border-opacity-10 border w-full" v-if="!loading" />

    <!-- Hourly weather -->
    <div class="max-w-screen-md w-full py-12" v-if="hourlyWeather">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Hourly Weather</h2>
        <div class="flex gap-10 overflow-x-scroll scrollbar pb-8">
          <div
            v-for="hourData in hourlyWeather"
            :key="hourData.dt"
            class="flex flex-col gap-4 items-center">
            <p class="whitespace-nowrap text-md">
              {{
                new Date(hourData.currentTime).toLocaleTimeString("en-us", {
                  hour: "numeric",
                })
              }}
            </p>
            <img
              :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
              class="w-auto h-[50px] object-cover" />
            <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-white border-opacity-10 border w-full" v-if="!loading" />

    <!-- Weekly Weather -->

    <div class="max-w-screen-md w-full py-12" v-if="dailyWeather">
      <div class="mx-8 text-white">
        <h2 class="mb-4">7 Days Forecast</h2>
        <div
          v-for="day in dailyWeather"
          :key="day.dt"
          class="flex items-center">
          <p class="flex-1">
            {{
              new Date(day.dt * 1000).toLocaleDateString("en-us", {
                weekday: "long",
              })
            }}
          </p>
          <img
            :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
            class="w-[50px] h-[50px] object-cover" />
          <div class="flex gap-2 flex-1 justify-end">
            <p>Max: {{ Math.round(day.temp.max) }}</p>
            |
            <p>Min: {{ Math.round(day.temp.min) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
      v-if="!loading && !this.$route.query.preview">
      <i class="fa-solid fa-trash"></i>
      <p>Remove City</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loading: true,
      weatherData: null,
      hourlyWeather: null,
      dailyWeather: null,
    };
  },

  async mounted() {
    this.loading = true;
    const lat = this.$route.query.lat;
    const lon = this.$route.query.lng;

    try {
      const weatherData = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=metric`
      );

      // cal current date & time
      const localOffset = new Date().getTimezoneOffset() * 60000;
      const utc = weatherData.data.current.dt * 1000 + localOffset;
      weatherData.data.currentTime =
        utc + 1000 * weatherData.data.timezone_offset;
      // cal hourly weather offset
      weatherData.data.hourly.forEach((hour) => {
        const utc = hour.dt * 1000 + localOffset;
        hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
      });

      this.weatherData = weatherData.data;
      this.hourlyWeather = weatherData.data.hourly;
      this.dailyWeather = weatherData.data.daily;
      this.loading = false;
      return weatherData.data;
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    removeCity() {
      if (confirm("Are You Sure?")) {
        localStorage.setItem("savedCities", JSON.stringify(this.updatedCities));
        this.$router.push("/");
      }
    },
  },

  computed: {
    cities() {
      return JSON.parse(localStorage.getItem("savedCities"));
    },

    updatedCities() {
      return this.cities.filter((city) => city.id != this.$route.query.id);
    },

    city() {
      return this.$route.params.city;
    },

    localDateString() {
      const date = new Date(this.weatherData.currentTime).toLocaleDateString(
        "en-us",
        {
          weekday: "short",
          day: "2-digit",
          month: "long",
        }
      );
      return date;
    },

    localTimeString() {
      const time = new Date(this.weatherData.currentTime).toLocaleTimeString(
        "en-us",
        {
          timeStyle: "short",
        }
      );
      return time;
    },

    currentTemp() {
      return Math.round(this.weatherData.current.temp);
    },

    feelsLike() {
      return Math.round(this.weatherData.current.feels_like);
    },

    description() {
      return this.weatherData.current.weather[0].description;
    },

    imgSrc() {
      return `http://openweathermap.org/img/wn/${this.weatherData.current.weather[0].icon}@2x.png`;
    },
  },
};
</script>
