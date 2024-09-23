<template>
    <div>
        <div class="flex justify-center h-screen items-center bg-image font-anton">
            <div
                class="max-w-sm w-full border-2 px-8 py-16 shadow-lg shadow-gray-600 rounded-lg bg-white bg-opacity-90">
                <h1 class="text-2xl font-semibold text-center text-black">Register</h1>
                <form @submit.prevent="register" class="space-y-4">
                    <div class="form-part">
                        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" v-model="username" id="username" placeholder="Enter your username" required
                            class="mt-1 block w-full px-3 font-Jet py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-che focus:border-che sm:text-sm">
                    </div>

                    <div class="form-part">
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" v-model="email" id="email" placeholder="Enter your email" required
                            class="mt-1 block w-full px-3 font-Jet py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-che focus:border-che sm:text-sm">
                    </div>

                    <div class="form-part">
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" v-model="password" id="password" placeholder="Enter your password"
                            required
                            class="mt-1 block w-full px-3 font-Jet py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-che focus:border-che sm:text-sm">
                    </div>

                    <button
                        class="form-button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-che hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Register
                    </button>
                </form>
            </div>
        </div>
    </div>
    <!-- <div class="view-body bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
            <h1 class="text-2xl font-semibold text-center text-gray-800">Register</h1>
            <form @submit.prevent="register" class="space-y-4">
                <div class="form-part">
                    <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                    <input type="text" v-model="username" id="username" placeholder="Enter your username" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-che focus:border-che sm:text-sm">
                </div>

                <div class="form-part">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" v-model="email" id="email" placeholder="Enter your email" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-che focus:border-che sm:text-sm">
                </div>

                <div class="form-part">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" v-model="password" id="password" placeholder="Enter your password" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-che focus:border-che sm:text-sm">
                </div>

                <button
                    class="form-button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-che hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Register
                </button>
            </form>
        </div>
    </div> -->
</template>

<script>
import Api from "@/services/api";

export default {
    name: "RegisterView",
    data() {
        return {
            username: "",
            email: "",
            password: ""
        }
    },
    methods: {
        register() {
            Api.post("/users/register", {
                username: this.username,
                email: this.email,
                password: this.password
            })
                .then(() => {
                    this.$toast.success("Registration succeeded!", { position: "bottom-left", duration: 1000 });
                    this.$router.push("/login");
                })
                .catch((err) => {
                    console.log(err);
                    this.$toast.error("Registration failed!", { position: "bottom-left", duration: 1000 });
                })
        }
    }
}
</script>

<style scoped>
.bg-image {
    background-image: url('../assets/house.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.bg-white {
    background-color: white;
    background-opacity: 90%;
}
</style>
