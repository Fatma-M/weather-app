<template>
  <!-- loading spinner -->
  <div class="flex flex-1 items-center justify-center" v-if="loading">
    <img src="@/assets/spinner.svg" />
  </div>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard v-if="city" :city="city" @click="goToCityView(city)" />
  </div>
  <p v-if="savedCities.length == 0 && !loading">
    No locations added. To start tracking a location, search in the input above.
  </p>
</template>

<script>
import axios from "axios";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    CityCard: defineAsyncComponent(() => import("@/components/CityCard.vue")),
  },

  data() {
    return {
      savedCities: [],
      loading: true,
    };
  },

  mounted() {
    setTimeout(() => {
      this.loading = true;
      this.renderList();
      this.loading = false;
    }, 1000);
  },

  methods: {
    async renderList() {
      if (localStorage.getItem("savedCities")) {
        this.savedCities = JSON.parse(localStorage.getItem("savedCities"));

        const requests = [];

        this.savedCities.forEach((city) => {
          requests.push(
            axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=metric`
            )
          );
        });

        const weatherData = await Promise.all(requests);

        weatherData.forEach((val, idx) => {
          this.savedCities[idx].weather = val.data;
        });
      }
    },

    goToCityView(city) {
      this.$router.push({
        name: "city-view",
        params: {
          state: city.state,
          city: city.city,
        },
        query: {
          id: city.id,
          lat: city.coords.lat,
          lng: city.coords.lng,
        },
      });
    },
  },
};
</script>
