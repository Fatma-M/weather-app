import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView";
import CityView from "@/views/CityView";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/weather/:state/:city",
    name: "city-view",
    props: true,
    component: CityView,
    meta: {
      title: "Weather",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${
    to.params.state ? `${to.params.city}, ${to.params.state}` : to.meta.title
  } | The Local Weather`;

  next();
});

export default router;
