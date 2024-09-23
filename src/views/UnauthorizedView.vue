<template>
    <div class="view-body bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
            <h1 class="text-2xl font-semibold text-center text-gray-800">Unauthorized</h1>
            <p class="text-center">You are not authorized to access this page.</p>
            <button @click="goBack" class="block text-center mt-4 text-blue-500">Go Back</button>
        </div>
    </div>
</template>

<script>
import api from '../services/api'
export default {
    name: "UnauthoriZed",
    methods: {
        async goBack() {
            const res = await api.post("/users/logout").catch((err) => {
                throw new Error(err);
            });
            console.log(res)
            this.$router.push('/login');
        }

    }
}

</script>
