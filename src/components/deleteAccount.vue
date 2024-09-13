<template>
    <div class="p-4">
        <div v-if="users.length > 0">
            <table class="min-w-full bg-white border-2 border-black text-lg">
                <thead>
                    <tr>
                        <th class="py-2 px-4 border-2 border-black text-center font-normal">Username</th>
                        <th class="py-2 px-4 border-2 border-black text-center font-normal">Email</th>
                        <th class="py-2 px-4 border-2 border-black text-center font-normal">Role</th>
                        <th class="py-2 px-4 border-2 border-black text-center font-normal">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user._id">
                        <td class="py-2 px-4 border-2 border-black text-center">{{ user.username }}</td>
                        <td class="py-2 px-4 border-2 border-black text-center">{{ user.email }}</td>
                        <td class="py-2 px-4 border-2 border-black text-center">{{ user.role }}</td>
                        <td class="pl-2 pt-3 pb-2 flex justify-center">
                            <div>
                                <button @click="deleteUser(user._id)" class="bg-black text-black rounded">
                                    <h1
                                        class="bg-gray-200 border-2 px-4 py-2 border-black uppercase rounded transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        Hapus
                                    </h1>
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
        async deleteUser(userId) {
            if (confirm("Are you sure you want to delete this user?")) {
                try {
                    await Api.delete(`/users/${userId}`);
                    this.fetchUsers();
                } catch (error) {
                    console.error("Error deleting user", error);
                }
            }
        },
    },
};
</script>
