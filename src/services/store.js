import { createStore } from "vuex";
import Api from "@/services/api";

const store = createStore({
  state: {
    user: null,
    userLoggedIn: false,
    userRole: null,
    isStoreUpdated: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      localStorage.setItem("user", JSON.stringify(payload));
    },
    setUserIsLoggedIn(state, payload) {
      state.userLoggedIn = payload;
      localStorage.setItem("userLoggedIn", payload);
    },
    setUserRole(state, role) {
      state.userRole = role;
      localStorage.setItem("userRole", role);
    },
    setIsStoreUpdated(state, payload) {
      state.isStoreUpdated = payload;
    },
  },
  actions: {
    async login(context, { email, password }) {
      const res = await Api.post("/users/login", { email, password }).catch(
        (err) => {
          throw new Error(err);
        }
      );
      if (res && res.data) {
        const userData = res.data.data;
        context.commit("setUser", userData);
        context.commit("setUserIsLoggedIn", true);
        context.commit("setUserRole", userData.role);
      } else {
        context.commit("setUser", null);
        context.commit("setUserIsLoggedIn", false);
        context.commit("setUserRole", null);
        throw new Error("unknown error");
      }
    },
    async updateStore(context) {
      const user = localStorage.getItem("user");
      const userLoggedIn = localStorage.getItem("userLoggedIn");
      const userRole = localStorage.getItem("userRole");

      if (user && userLoggedIn && userRole) {
        context.commit("setUser", JSON.parse(user));
        context.commit("setUserIsLoggedIn", JSON.parse(userLoggedIn));
        context.commit("setUserRole", userRole);
      } else {
        try {
          const res = await Api.get("/users");
          const userData = res.data.data;
          context.commit("setUser", userData);
          context.commit("setUserIsLoggedIn", true);
          context.commit("setUserRole", userData.role);
        } catch (e) {
          context.commit("setUser", null);
          context.commit("setUserIsLoggedIn", false);
          context.commit("setUserRole", null);
        }
      }
      context.commit("setIsStoreUpdated", true);
    },
    async logout(context) {
      const res = await Api.post("/users/logout").catch((err) => {
        throw new Error(err);
      });
      if (res) {
        context.commit("setUser", null);
        context.commit("setUserIsLoggedIn", false);
        context.commit("setUserRole", null);
        localStorage.removeItem("user");
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("userRole");
      }
    },
  },
});

export default store;

// import { createStore } from "vuex";
// import Api from "@/services/api";

// const store = createStore({
//   state: {
//     user: null,
//     userLoggedIn: false,
//     isStoreUpdated: false,
//   },
//   mutations: {
//     setUser(state, payload) {
//       state.user = payload;
//     },
//     setUserIsLoggedIn(state, payload) {
//       state.userLoggedIn = payload;
//     },
//     setIsStoreUpdated(state, payload) {
//       state.isStoreUpdated = payload;
//     },
//   },
//   actions: {
//     async login(context, { email, password }) {
//       const res = await Api.post("/users/login", { email, password }).catch(
//         (err) => {
//           throw new Error(err);
//         }
//       );
//       if (res && res.data) {
//         context.commit("setUser", res.data.data);
//         context.commit("setUserIsLoggedIn", true);
//       } else {
//         context.commit("setUser", null);
//         context.commit("setUserIsLoggedIn", false);
//         throw new Error("unknown error");
//       }
//     },
//     async updateStore(context) {
//       try {
//         const res = await Api.get("/users");
//         context.commit("setUser", res.data.data);
//         context.commit("setUserIsLoggedIn", true);
//       } catch (e) {
//         context.commit("setUser", null);
//         context.commit("setUserIsLoggedIn", false);
//       } finally {
//         context.commit("setIsStoreUpdated", true);
//       }
//     },
//     async logout(context) {
//       const res = await Api.post("/users/logout").catch((err) => {
//         throw new Error(err);
//       });
//       if (res) {
//         context.commit("setUser", null);
//         context.commit("setUserIsLoggedIn", false);
//       }
//     },
//   },
// });

// export default store;
