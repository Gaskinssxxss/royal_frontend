<template>
    <div class="p-4">
        <div v-if="accounts.length > 0">
            <table class="min-w-full border-2 border-black bg-white text-lg">
                <thead>
                    <tr>
                        <th class="py-2 border-2 border-black text-center font-normal">Username</th>
                        <th class="py-2 border-2 border-black text-center font-normal">Email</th>
                        <th class="py-2 border-2 border-black text-center font-normal">Verified</th>
                        <th class="py-2 border-2 border-black text-center font-normal">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="account in accounts" :key="account._id">
                        <td class="px-4 py-2 border-2 border-black text-center">{{ account.username }}</td>
                        <td class="px-4 py-2 border-2 border-black text-center">{{ account.email }}</td>
                        <td class="px-4 py-2 border-2 border-black text-center">
                            <span v-if="account.verified" class="text-green-600">Yes</span>
                            <span v-else class="text-red-600">No</span>
                        </td>
                        <td class="border px-4 py-2">
                            <div class="bg-black rounded">
                                <button v-if="!account.verified" @click="openModal('verify', account._id)"
                                    class="bg-green-500 text-white px-4 py-2 uppercase rounded w-full transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2 border-2 border-black">Verify</button>
                                <button v-if="account.verified" @click="openModal('unverify', account._id)"
                                    class="bg-gray-200 text-black px-4 py-2 uppercase rounded w-full transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2 border-2 border-black">Unverify</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p>No marketing accounts found.</p>
        </div>
        <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>

                <div
                    class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div class="p-4">
                        <h3 class="text-lg font-medium text-gray-900">{{ modalActionText }}</h3>
                        <p class="text-sm text-gray-500">Are you sure you want to {{ modalActionText.toLowerCase() }}
                            this account?</p>
                    </div>

                    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                        <button @click="confirmAction"
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
            accounts: [],
            isModalOpen: false,
            modalAction: '',
            modalAccountId: null,
            modalActionText: ''
        };
    },
    created() {
        this.fetchMarketingAccounts();
    },
    methods: {
        async fetchMarketingAccounts() {
            try {
                const response = await Api.get("/users/marketing");
                this.accounts = response.data.data;
            } catch (error) {
                console.error("Error fetching marketing accounts", error);
            }
        },
        openModal(action, accountId) {
            this.isModalOpen = true;
            this.modalAction = action;
            this.modalAccountId = accountId;
            this.modalActionText = action === 'verify' ? 'Verify' : action === 'unverify' ? 'Unverify' : 'Delete';
        },
        closeModal() {
            this.isModalOpen = false;
            this.modalAction = '';
            this.modalAccountId = null;
        },
        async confirmAction() {
            if (this.modalAction === 'verify') {
                await this.verifyAccount(this.modalAccountId);
            } else if (this.modalAction === 'unverify') {
                await this.unverifyAccount(this.modalAccountId);
            }
            this.closeModal();
        },
        async verifyAccount(accountId) {
            try {
                await Api.put(`/users/verify/${accountId}`);
                this.fetchMarketingAccounts();
            } catch (error) {
                console.error("Error verifying account", error);
            }
        },
        async unverifyAccount(accountId) {
            try {
                await Api.put(`/users/unverify/${accountId}`);
                this.fetchMarketingAccounts();
            } catch (error) {
                console.error("Error unverifying account", error);
            }
        },
    }
};
</script>
