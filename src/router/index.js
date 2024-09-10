import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HouseMap.vue";
import adminDashboard from "@/views/adminDashboard.vue";
import store from "@/services/store";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Home",
      authRequired: true,
      authForbidden: false,
    },
  },
  {
    path: "/admin",
    name: "Admin Dashboard",
    component: adminDashboard,
    meta: {
      title: "Admin",
      authRequired: true,
      authForbidden: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "Login",
      authRequired: false,
      authForbidden: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: {
      title: "Register",
      authRequired: false,
      authForbidden: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!store.state.isStoreUpdated) {
    await store.dispatch("updateStore");
  }

  const isAuthenticated = store.state.userLoggedIn;
  if (!isAuthenticated && to.meta.authRequired) {
    next({ name: "login" });
  } else if (isAuthenticated && to.meta.authForbidden) {
    next({ name: "user" });
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router;

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes,
// });
