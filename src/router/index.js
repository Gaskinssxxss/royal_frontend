/* eslint-disable */

import { createRouter, createWebHistory } from "vue-router";
import adminDashboard from "@/views/adminDashboard.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import UnauthorizedView from "@/views/UnauthorizedView.vue";
import store from "@/services/store";
import LiveChat from "@/views/LiveChat.vue";
import KeunganDashboard from "@/views/KeunganDashboard.vue";
import marketingDashboard from "@/views/marketingDashboard.vue";

const routes = [
  {
    path: "/",
    redirect: { name: "Login" },
  },
  {
    path: "/marketing",
    name: "marketingDashboard",
    component: marketingDashboard,
    meta: {
      title: "Marketing Dashboard",
      authRequired: true,
      role: "marketing",
    },
  },
  {
    path: "/keuangan",
    name: "KeuanganDashboard",
    component: KeunganDashboard,
    meta: {
      title: "Keuangan Dashboard",
      authRequired: true,
      role: "keuangan",
    },
  },
  {
    path: "/Live-chat",
    name: "Live Chat",
    component: LiveChat,
    meta: {
      title: "Live Chat",
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

  if (isAuthenticated && (to.name === "Login" || to.name === "Register")) {
    if (userRole === "admin") {
      next({ name: "Admin Dashboard" });
    } else if (userRole === "marketing") {
      next({ name: "Marketing" });
    } else if (userRole === "keuangan") {
      next({ name: "KeuanganDashboard" });
    } else {
      next({ name: "Unauthorized" });
    }
  } else if (to.meta.authRequired && !isAuthenticated) {
    next({ name: "Login" });
  } else if (
    to.meta.authRequired &&
    to.meta.role &&
    to.meta.role !== userRole
  ) {
  } else {
    next();
  }
});

// router.beforeEach(async (to, from, next) => {
//   if (!store.state.isStoreUpdated) {
//     await store.dispatch("updateStore");
//   }

//   const isAuthenticated = store.state.userLoggedIn;
//   const userRole = store.state.userRole;
//   if (to.meta.authRequired && !isAuthenticated) {
//     next({ name: "Login" });
//   } else if (
//     to.meta.authRequired &&
//     to.meta.role &&
//     to.meta.role !== userRole
//   ) {
//     next({ name: "Unauthorized" });
//   } else {
//     next();
//   }
// });

router.afterEach((to) => {
  document.title = to.meta.title;
});
export default router;
