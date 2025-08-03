import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import RestaurantDetail from "@/pages/RestaurantDetail.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/restaurant/:id",
    name: "RestaurantDetail",
    component: RestaurantDetail,
  },
  {
    path: "/category/:slug",
    component: () => import("@/pages/CategoryPage.vue"),
  },
  {
    path: "/restaurant/:id",
    component: () => import("@/pages/RestaurantDetail.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
