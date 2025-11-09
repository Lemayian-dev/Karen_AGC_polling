import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:3001/api'

export const api = {
  // Create a new poll
  createPoll: async (pollData) => {
    const response = await axios.post(`${API_URL}/polls`, pollData)
    return response.data
  },

  // Get poll by code
  getPollByCode: async (code) => {
    const response = await axios.get(`${API_URL}/polls/code/${code}`)
    return response.data
  },

  // Get poll by ID
  getPollById: async (id) => {
    const response = await axios.get(`${API_URL}/polls/${id}`)
    return response.data
  },

  // Get all polls
  getAllPolls: async () => {
    const response = await axios.get(`${API_URL}/polls`)
    return response.data
  },

  // Submit a vote
  submitVote: async (pollId, voteData) => {
    const response = await axios.post(`${API_URL}/polls/${pollId}/vote`, voteData)
    return response.data
  },

  // Close a poll
  closePoll: async (pollId) => {
    const response = await axios.post(`${API_URL}/polls/${pollId}/close`)
    return response.data
  },

  // Join waiting room
  joinWaitingRoom: async (pollId, userData) => {
    const response = await axios.post(`${API_URL}/polls/${pollId}/join`, userData)
    return response.data
  },

  // Get waiting room participants
  getParticipants: async (pollId) => {
    const response = await axios.get(`${API_URL}/polls/${pollId}/participants`)
    return response.data
  },

  // Start poll (Admin)
  startPoll: async (pollId) => {
    const response = await axios.post(`${API_URL}/polls/${pollId}/start`)
    return response.data
  }
}
