<template>
    <div class="view-body bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
            <h1 class="text-2xl font-semibold text-center text-gray-800">Login</h1>
            <form @submit.prevent="login()" class="space-y-4">
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
                    class="form-button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-che hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoginView",
    data() {
        return {
            email: "",
            password: ""
        }
    },
    computed: {
        isUserLoggedIn() {
            return this.$store.state.userLoggedIn;
        }
    },
    methods: {
        async login() {
            try {
                await this.$store.dispatch("login", { email: this.email, password: this.password });
                if (this.isUserLoggedIn) {
                    this.$toast.success("Authentication succeeded.", { position: "bottom-left", duration: 1000 });
                    await this.$router.push("/");
                }
            } catch (err) {
                console.log(err);
                this.$toast.error(`Authentication failed! Error: ${err}`, { position: "bottom-left", duration: 1000 });
            }
        }
    }
}
</script>