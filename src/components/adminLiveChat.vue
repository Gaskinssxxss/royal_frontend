<template>
    <div class="flex text-black text-base h-screen">
        <div class="bg-gray-200 border border-black">
            <h1 class="text-center text-2xl">List Chat</h1>
            <div class="bg-black">
                <div class="bg-nasdem text-gray-200">
                    <div v-for="(chat, visitorID) in activeChats" :key="visitorID" @click="selectChat(visitorID)"
                        :class="{ 'bg-red-500 border-2 border-black': chat.unread, 'bg-nasdem border-2 border-black': !chat.unread }"
                        class="chat-item p-2 cursor-pointer">
                        {{ visitorID }}
                    </div>
                </div>
            </div>
        </div>

        <div class="chat-container w-full border-[1px] border-black font-Jet capitalize bg-gray-200">
            <h1 class="border-b-2 border-black font-Karantina text-2xl font-extrabold uppercase text-center">Live Chat
            </h1>
            <div class="messages overflow-y-auto mb-4 pl-4 pt-4">
                <div v-if="selectedChat">
                    <div>
                        <div v-for="(message, index) in selectedChat.messages" :key="index" class="message mb-2">
                            <div v-if="message.sender === 'Pengunjung'">
                                <span class="font-semibold text-blue-600">{{ message.sender }} :</span>
                                <span class="ml-2 text-gray-800">{{ message.text }}</span>
                            </div>
                            <div v-else>
                                <span class="font-semibold text-che">{{ message.sender }}:</span>
                                <span class="ml-2 text-gray-800">{{ message.text }}</span>
                            </div>
                            <div class="text-xs text-gray-500 mt-1">{{ message.timestamp }}</div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="px-4 pb-4 font-Jet text-base">
                <div class="input-container flex items-center">
                    <input v-model="adminMessage" @keyup.enter="sendAdminReply" placeholder="Ketik Pesan."
                        class="flex-grow p-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
                    <button @click="sendAdminReply"
                        class="ml-2 px-4 py-2 bg-nasdem text-gray-200 rounded-lg hover:bg-blue-800 focus:outline-none">
                        Send
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';
import api from '@/services/api';

export default {
    data() {
        return {
            socket: null,
            activeChats: {},
            selectedChatID: null,
            adminMessage: ''
        };
    },
    computed: {
        selectedChat() {
            return this.activeChats[this.selectedChatID];
        }
    },
    mounted() {
        this.socket = io('http://192.168.1.10:3000/');
        const savedChats = JSON.parse(localStorage.getItem('activeChats')) || {};
        api.get('chats/active')
            .then(res => res.data)
            .then(data => {
                this.activeChats = data.reduce((acc, chat) => {
                    if (chat.messages && chat.messages.length > 0) {
                        acc[chat.visitorID] = {
                            messages: chat.messages,
                            unread: savedChats[chat.visitorID]?.unread || false
                        };
                    }

                    return acc;
                }, {});
                this.saveChatsToLocalStorage();
            })
            .catch(error => {
                console.error('Error fetching active chats:', error.response ? error.response.data : error.message);
            });

        this.socket.on('adminMessage', (msg) => {
            const { visitorID, sender, text } = msg;
            if (!this.activeChats[visitorID]) {
                this.activeChats[visitorID] = { messages: [], unread: true };
            }
            this.activeChats[visitorID].messages.push({ sender, text });
            this.activeChats[visitorID].unread = true;
            this.saveChatsToLocalStorage();
        });
    },

    methods: {
        selectChat(visitorID) {
            this.selectedChatID = visitorID;
            this.activeChats[visitorID].unread = false;
            this.saveChatsToLocalStorage();
        },
        sendAdminReply() {
            const timestamp = new Date().toLocaleString();
            if (this.adminMessage.trim() !== '' && this.selectedChatID) {
                this.socket.emit('adminReply', {
                    visitorID: this.selectedChatID,
                    text: this.adminMessage,
                    timestamp: timestamp
                });
                this.adminMessage = '';
            }
        },
        saveChatsToLocalStorage() {
            localStorage.setItem('activeChats', JSON.stringify(this.activeChats));
        }
    }
};
</script>
