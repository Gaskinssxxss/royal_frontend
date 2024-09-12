import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HouseMap.vue";
import adminDashboard from "@/views/adminDashboard.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import UnauthorizedView from "@/views/UnauthorizedView.vue";
import store from "@/services/store";
import LiveChat from "@/views/LiveChat.vue";

const routes = [
  {
    path: "/",
    redirect: { name: "Login" },
  },
  {
    path: "/Live-chat",
    name: "Live Chat",
    component: LiveChat,
    meta: {
      title: "Live Chat",
      authRequired: false,
      // role: "marketing",
    },
  },
  {
    path: "/Marketing",
    name: "Marketing",
    component: HomeView,
    meta: {
      title: "Marketing",
      authRequired: true,
      role: "marketing",
    },
  },
  {
    path: "/admin",
    name: "Admin Dashboard",
    component: adminDashboard,
    meta: {
      title: "Admin",
      authRequired: true,
      role: "admin",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "Login",
      authRequired: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: {
      title: "Register",
      authRequired: false,
    },
  },
  {
    path: "/unauthorized",
    name: "Unauthorized",
    component: UnauthorizedView,
    meta: {
      title: "Unauthorized",
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
  const userRole = store.state.userRole;
  if (to.meta.authRequired && !isAuthenticated) {
    next({ name: "Login" });
  } else if (
    to.meta.authRequired &&
    to.meta.role &&
    to.meta.role !== userRole
  ) {
    next({ name: "Unauthorized" });
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router;
