<template>
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Blok Management</h1>
        <form @submit.prevent="onSubmit" class="mb-8 space-y-4">
            <div>
                <input v-model="blokname" type="text" placeholder="Enter blok name"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
                <button type="submit"
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                    {{ isEdit ? 'Update' : 'Create' }}
                </button>
                <button type="button" v-if="isEdit" @click="resetForm"
                    class="ml-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300">
                    Cancel
                </button>
            </div>
        </form>
        <ul class="grid grid-cols-3 gap-4">
            <li v-for="blok in bloks" :key="blok._id"
                class="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow">
                <span class="text-lg font-semibold">{{ blok.blokname }}</span>
                <div class="space-x-2">
                    <button @click="editBlok(blok)"
                        class="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition duration-300">
                        Edit
                    </button>
                    <button @click="deleteBlok(blok._id)"
                        class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">
                        Delete
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import blokApi from "@/services/blokApi";

export default {
    data() {
        return {
            bloks: [],
            blokname: "",
            isEdit: false,
            currentBlokId: null,
        };
    },
    methods: {
        fetchBloks() {
            blokApi
                .getAll()
                .then((response) => {
                    this.bloks = response.data.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        onSubmit() {
            if (this.isEdit) {
                blokApi
                    .update(this.currentBlokId, { blokname: this.blokname })
                    .then(() => {
                        this.resetForm();
                        this.fetchBloks();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                blokApi
                    .create({ blokname: this.blokname })
                    .then(() => {
                        this.resetForm();
                        this.fetchBloks();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        },
        editBlok(blok) {
            this.blokname = blok.blokname;
            this.isEdit = true;
            this.currentBlokId = blok._id;
        },
        deleteBlok(id) {
            if (confirm("Are you sure you want to delete this blok?")) {
                blokApi
                    .delete(id)
                    .then(() => {
                        this.fetchBloks();
                    })
                    .catch((error) => {
                        console.error(error);
                        console.log(blokApi.delete)
                    });
            }
        },
        resetForm() {
            this.blokname = "";
            this.isEdit = false;
            this.currentBlokId = null;
        },
    },
    mounted() {
        this.fetchBloks();
    },
};
</script>
