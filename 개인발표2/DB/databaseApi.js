async function request(path, options) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "요청에 실패했습니다.");
  return data;
}

export const databaseApi = {
  signup: (account) =>
    request("/api/accounts", { method: "POST", body: JSON.stringify(account) }),
  login: (credentials) =>
    request("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  findId: (name) =>
    request(`/api/accounts/find-id?name=${encodeURIComponent(name)}`),
  resetPassword: (values) =>
    request("/api/accounts/password", {
      method: "PATCH",
      body: JSON.stringify(values),
    }),
  getAccount: (id) => request(`/api/accounts/${encodeURIComponent(id)}`),
  updateProfile: (id, values) =>
    request(`/api/accounts/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    }),
  deleteAccount: (id) =>
    request(`/api/accounts/${encodeURIComponent(id)}`, { method: "DELETE" }),
  getBookings: () => request("/api/bookings"),
  createBooking: (booking) =>
    request("/api/bookings", { method: "POST", body: JSON.stringify(booking) }),
  deleteBooking: (number) =>
    request(`/api/bookings/${encodeURIComponent(number)}`, {
      method: "DELETE",
    }),
  getQuestions: () => request("/api/questions"),
  createQuestion: (question) =>
    request("/api/questions", {
      method: "POST",
      body: JSON.stringify(question),
    }),
  deleteQuestion: (id) => request(`/api/questions/${id}`, { method: "DELETE" }),
};
