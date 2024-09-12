<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Ticket List</h1>
    <div v-if="tickets.length === 0">
      <p>No tickets available</p>
    </div>
    <div v-else>
      <ul class="space-y-2">
        <li v-for="ticket in tickets" :key="ticket._id" class="border p-4 hover:bg-gray-100">
          <div class="flex justify-between">
            <div>
              <h2 class="text-lg font-semibold">Message: {{ ticket.ticket_contain }}</h2>
              <p class="text-sm text-gray-600" v-if="ticket.ticket_header[0] && ticket.ticket_header[0].id_user">
                From Marketing : {{ ticket.ticket_header[0].id_user.username }}
              </p>
              <p class="text-sm text-gray-600" v-if="ticket.ticket_header[0] && ticket.ticket_header[0].id_customer">
                Customer Name: {{ ticket.ticket_header[0].id_customer.data_pribadi[0].namaLengkap }}
              </p>
            </div>
            <button @click="selectTicket(ticket)" class="bg-blue-500 text-white px-3 py-1 rounded">Reply</button>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="selectedTicket" class="mt-8 border p-4">
      <h2 class="text-xl font-semibold mb-4">Reply to Ticket</h2>
      <p class="mb-4">Ticket Message: {{ selectedTicket.ticket_contain }}</p>
      <textarea v-model="response" placeholder="Enter your response" class="w-full p-2 border mb-4"></textarea>
      <button @click="replyToTicket" class="bg-green-500 text-white px-4 py-2 rounded">Send Response</button>
      <button @click="closeReplyticket" class="bg-red-600 text-white px-4 py-2 rounded">Close</button>
    </div>
  </div>
</template>

<script>
import ticketApi from "@/services/ticketApi";
export default {
  data() {
    return {
      tickets: [],
      selectedTicket: null,
      response: "",
    };
  },
  methods: {
    closeReplyticket() {
      this.selectedTicket = null;
    },
    async fetchTickets() {
      try {
        const res = await ticketApi.getAll();
        this.tickets = res.data.data;
        console.log(this.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    },
    selectTicket(ticket) {
      this.selectedTicket = ticket;
    },
    async replyToTicket() {
      if (!this.response.trim()) {
        alert("Please enter a response");
        return;
      }

      const updatedTicket = {
        ticket_contain: this.response,
        ticket_status: true, // Mark as responded
      };

      try {
        await ticketApi.update(this.selectedTicket._id, updatedTicket);
        alert("Response sent!");
        this.response = "";
        this.selectedTicket = null;
        this.fetchTickets(); // Refresh the ticket list
      } catch (error) {
        console.error("Error replying to ticket:", error);
      }
    },
  },
  mounted() {
    this.fetchTickets();
  },
};
</script>

<style scoped>
.ticket-list {
  max-width: 600px;
  margin: 0 auto;
}
</style>