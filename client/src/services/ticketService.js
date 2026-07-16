import api from "./api";

export const getTicketsForEvent = async (eventId) => {
  const response = await api.get(`/events/${eventId}/tickets`);
  return response.data;
};

export const createTicket = async (eventId, ticketData) => {
  const response = await api.post(`/events/${eventId}/tickets`, ticketData);
  return response.data;
};