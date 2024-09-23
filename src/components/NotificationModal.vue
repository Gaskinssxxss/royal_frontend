<template>
    <div class="notification-container">
        <transition-group name="fade" tag="div">
            <div v-for="(notification, index) in notifications" :key="index" class="notification">
                {{ notification.message }}
            </div>
        </transition-group>
    </div>
</template>

<script>
export default {
    data() {
        return {
            notifications: []
        };
    },
    methods: {
        notify(message) {
            this.notifications.push({ message });
            setTimeout(() => {
                this.notifications.shift();
            }, 5000);
        }
    }
};
</script>

<style scoped>
.notification-container {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
}

.notification {
    background: #333;
    color: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: opacity 0.5s ease;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>