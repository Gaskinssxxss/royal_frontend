import Api from "@/services/api";

export default {
  getAll() {
    return Api.get("/tickets");
  },
  getById(id) {
    return Api.get(`/ticket/${id}`);
  },
  create(data) {
    return Api.post("/ticket", data);
  },
  update(id, data) {
    return Api.put(`/ticket/${id}`, data);
  },
  delete(id) {
    return Api.delete(`/ticket/${id}`);
  },
};
