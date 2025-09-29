import api from "./api";

export const getAllEquipments = () => api.get("/equipments");
export const getAdminEquipments = () => api.get("/equipments");
export const addEquipment = (payload) => api.post("/admin/equipments", payload);
export const deleteEquipment = (id) => api.delete(`/admin/equipments/${id}`);
export const getStudentEquipments = () => api.get("/equipments");