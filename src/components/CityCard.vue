<template>
  <div
    class="flex py-6 px-3 bg-weather-secondary rounded-md cursor-pointer"
    v-if="city">
    <div class="flex flex-col flex-1">
      <h2 class="text-3xl">{{ city.city }}</h2>
      <h3>{{ city.state }}</h3>
    </div>

    <div class="flex flex-col gap-2" v-if="city.weather">
      <p class="text-3xl self-end">
        {{ Math.round(city.weather.main.temp) }}&deg;
      </p>
      <div class="flex gap-2 text-xs">
        <span> Max: {{ Math.round(city.weather.main.temp_min) }}&deg; </span>
        |
        <span> Min: {{ Math.round(city.weather.main.temp_max) }}&deg; </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["city"],
};
</script>
