import api from "./api";

export const getEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};

export const getEventBySlug = async (slug) => {
  const response = await api.get(`/events/${slug}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post("/events", eventData);
  return response.data;
};