import Api from "@/services/api";

export default {
  getAll() {
    return Api.get("/house");
  },
  getById(id) {
    return Api.get(`/house/${id}`);
  },
  create(data) {
    return Api.post("/house", data);
  },
  update(id, data) {
    return Api.put(`/house/edit/${id}`, data);
  },
  delete(id) {
    return Api.delete(`/house/delete/${id}`);
  },
  getBlokandHouse() {
    return Api.get("/blocks-and-houses");
  },
};
