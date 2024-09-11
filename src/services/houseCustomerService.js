import Api from "@/services/api";
export default {
  async getAllHousesAndCustomers() {
    const [housesResponse, customersResponse] = await Promise.all([
      Api.get("/house"),
      Api.get("/customer"),
    ]);
    return {
      houses: housesResponse.data.data,
      customers: customersResponse.data.data,
    };
  },
};
