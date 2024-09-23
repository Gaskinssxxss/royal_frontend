<template>
    <div>
        <div class="flex justify-center h-screen items-center bg-image font-anton">
            <div
                class="max-w-sm w-full border-2 px-8 py-16 shadow-lg shadow-gray-600 rounded-lg bg-white bg-opacity-90">
                <h1 class="text-2xl font-semibold text-center text-black">Login</h1>
                <form @submit.prevent="login()" class="space-y-4">
                    <div class="form-part">
                        <label for="email" class="block text-sm font-medium text-black">Email</label>
                        <input type="email" v-model="email" id="email" placeholder="Enter your email" required
                            class="mt-1 block w-full px-3 font-Jet py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-che focus:border-che sm:text-sm">
                    </div>

                    <div class="form-part">
                        <label for="password" class="block text-sm font-medium text-black">Password</label>
                        <input type="password" v-model="password" id="password" placeholder="Enter your password"
                            required
                            class="mt-1 block w-full px-3 font-Jet py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-che focus:border-che sm:text-sm">
                    </div>

                    <button
                        class="form-button w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-che hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
                </form>
            </div>
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
        },
        userRole() {
            return this.$store.state.userRole;
        }
    },
    methods: {
        async login() {
            try {
                await this.$store.dispatch("login", { email: this.email, password: this.password });
                if (this.isUserLoggedIn) {
                    this.$toast.success("Authentication succeeded.", { position: "bottom-left", duration: 1000 });
                    if (this.userRole === "admin") {
                        await this.$router.push("/admin");
                    } else if (this.userRole === "marketing") {
                        await this.$router.push("/marketing");
                    } else if (this.userRole === "keuangan") {
                        await this.$router.push("/keuangan");
                    } else if (this.userRole === "direktur") {
                        await this.$router.push("/direktur");
                    } else {
                        await this.$router.push("/login");
                    }
                }
            } catch (err) {
                console.log(err);
                this.$toast.error(`Authentication failed! Error: ${err}`, { position: "bottom-left", duration: 1000 });
            }
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
