import api from "./api";


export const createStudentRequest = (payload) => api.post("/api/requests/student", payload);

/**
 * Fetches all requests made by the logged-in student.
 */
export const getStudentRequests = () => api.get("/api/requests/student");


// ----------------- ADMIN -----------------

/**
 * Fetches all student requests for the admin.
 */
export const getAllRequestsAdmin = () => api.get("/api/admin/requests");

/**
 * Approves a specific request.
 * @param {string} id - The ID of the request to approve.
 */
export const approveRequest = (id) => api.put(`/api/admin/requests/${id}/approve`);

/**
 * Rejects a specific request.
 * @param {string} id - The ID of the request to reject.
 */
export const rejectRequest = (id) => api.put(`/api/admin/requests/${id}/reject`);