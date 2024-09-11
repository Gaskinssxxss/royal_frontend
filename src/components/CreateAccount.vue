<template>
    <div class="p-4">
        <form @submit.prevent="openModal">
            <div class="mb-4">
                <label class="block text-black">Username</label>
                <input v-model="form.username" class="w-full px-4 py-2 border border-black rounded" type="text"
                    required />
            </div>

            <div class="mb-4">
                <label class="block text-black">Email</label>
                <input v-model="form.email" class="w-full px-4 py-2 border border-black rounded" type="email"
                    required />
            </div>

            <div class="mb-4">
                <label class="block text-black">Password</label>
                <input v-model="form.password" class="w-full px-4 py-2 border border-black rounded" type="password"
                    required />
            </div>

            <div class="mb-4">
                <label class="block text-black">Role</label>
                <select v-model="form.role" class="w-full px-4 py-2 border border-black rounded">
                    <option value="marketing">Marketing</option>
                </select>
            </div>
            <div class="flex justify-end">
                <div class="bg-black rounded">
                    <button type="submit"
                        class="bg-gray-200 uppercase border-black border-2 text-black px-4 py-2 rounded transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">Buat
                        Akun</button>
                </div>
            </div>
        </form>

        <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>

                <div
                    class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div class="p-4">
                        <h3 class="text-lg font-medium text-gray-900">Konfirmasi Pembuatan Akun</h3>
                        <p class="text-sm text-gray-500">
                            Apakah Anda yakin ingin membuat akun dengan detail ini?
                        </p>
                        <ul class="mt-3 text-sm text-gray-700">
                            <li><strong>Username:</strong> {{ form.username }}</li>
                            <li><strong>Email:</strong> {{ form.email }}</li>
                            <li><strong>Role:</strong> {{ form.role }}</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                        <button @click="createAccount"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm">
                            Confirm
                        </button>
                        <button @click="closeModal"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/services/api';

export default {
    data() {
        return {
            form: {
                username: '',
                email: '',
                password: '',
                role: 'marketing', // Default role
            },
            isModalOpen: false, // State for modal
        };
    },
    methods: {
        openModal() {
            // Open confirmation modal before submitting the form
            this.isModalOpen = true;
        },
        closeModal() {
            // Close the confirmation modal
            this.isModalOpen = false;
        },
        async createAccount() {
            try {
                await Api.post('/users/register', this.form);
                this.$toast.success("Akun Berhasil Di Buat", {
                    position: "bottom-left",
                    duration: 1000
                });
                this.form = {
                    username: '',
                    email: '',
                    password: '',
                    role: 'marketing',
                };
                this.closeModal(); // Close modal after success
            } catch (error) {
                console.error("Error creating account", error);
            }
        },
    },
};
</script>
