<template>
    <div class="p-4">
        <div v-if="users.length > 0">
            <table class="min-w-full bg-white border-2 border-black text-lg">
                <thead>
                    <tr>
                        <th class="py-2 px-2 border-2 border-black font-normal">Username</th>
                        <th class="py-2 px-2 border-2 border-black font-normal">Email</th>
                        <th class="py-2 px-2 border-2 border-black font-normal">Role</th>
                        <th class="py-2 px-2 border-2 border-black font-normal">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user._id">
                        <td class="py-2 px-2 border-2 border-black text-center">{{ user.username }}</td>
                        <td class="py-2 px-2 border-2 border-black text-center">{{ user.email }}</td>
                        <td class="py-2 px-2 border-2 border-black text-center">{{ user.role }}</td>
                        <td class="py-2 px-2 border-2 border-black text-center w-20">
                            <div class="bg-black rounded">
                                <button @click="openEditModal(user)"
                                    class="bg-gray-200  w-full uppercase text-black border-2 border-black px-4 py-2 rounded mr-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                    Edit
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p>No users found.</p>
        </div>

        <!-- Modal -->
        <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>

                <div
                    class="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all sm:max-w-lg sm:w-full">
                    <div class="p-4">
                        <h3 class="text-lg font-medium text-gray-900">Edit User</h3>

                        <form @submit.prevent="submitEdit">
                            <div class="mb-4">
                                <label class="block text-gray-700">Username</label>
                                <input v-model="form.username" class="w-full px-4 py-2 border rounded" type="text"
                                    required />
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700">New Password</label>
                                <input v-model="form.password" class="w-full px-4 py-2 border rounded" type="password"
                                    required />
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700">Confirm New Password</label>
                                <input v-model="form.confirmPassword" class="w-full px-4 py-2 border rounded"
                                    type="password" required />
                            </div>

                            <div class="flex justify-end">
                                <button type="button" @click="closeModal"
                                    class="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                                    Cancel
                                </button>
                                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Api from "@/services/api";

export default {
    data() {
        return {
            users: [],
            isModalOpen: false,
            form: {
                id: null,
                username: "",
                password: "",
                confirmPassword: "",
            },
        };
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await Api.get("/users/marketing");
                this.users = response.data.data;
            } catch (error) {
                console.error("Error fetching users", error);
            }
        },
        openEditModal(user) {
            this.form.id = user._id;
            this.form.username = user.username;
            this.form.password = "";
            this.form.confirmPassword = "";
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
        async submitEdit() {
            if (this.form.password !== this.form.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            try {
                await Api.put(`/users/${this.form.id}`, {
                    username: this.form.username,
                    password: this.form.password,
                });
                alert("User updated successfully");
                this.closeModal();
                this.fetchUsers();
            } catch (error) {
                console.error("Error updating user", error);
            }
        },
    },
};
</script>

<style scoped></style>
