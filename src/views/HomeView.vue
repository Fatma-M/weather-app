<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
        v-model="searchQuery"
        @keyup.enter="getSearchResult" />

      <ul
        v-if="searchResults"
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
        <p v-if="searchError || searchResults.length == 0" class="text-red-500">
          Sorry, something went wrong, please try again & make sure you write
          the right city name
        </p>
        <li
          v-for="result in searchResults"
          :key="result.id"
          class="py-2 cursor-pointer"
          @click="previewCity(result)">
          {{ result.place_name }}
        </li>
      </ul>
    </div>

    <div class="flex flex-col gap-4">
      <!-- <CityList /> -->
      <Suspense>
        <CityList />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import CityList from "@/components/CityList";

export default {
  components: { CityList },

  data() {
    return {
      searchQuery: "",
      searchResults: null,
      searchError: null,
      mapboxAPIKey:
        "pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q",
    };
  },

  methods: {
    getSearchResult() {
      setTimeout(() => {
        if (this.searchQuery != "") {
          try {
            axios
              .get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.searchQuery}.json?access_token=${this.mapboxAPIKey}&types=place`
              )
              .then((response) => {
                this.searchResults = response.data.features;
              });
          } catch {
            this.searchError = true;
          }
        }
      }, 300);
    },

    previewCity(result) {
      const [city, state] = result.place_name.split(",");

      this.$router.push({
        name: "city-view",
        params: {
          state: state,
          city: city,
        },
        query: {
          lat: result.geometry.coordinates[1],
          lng: result.geometry.coordinates[0],
          preview: true,
        },
      });
    },
  },
};
</script>
