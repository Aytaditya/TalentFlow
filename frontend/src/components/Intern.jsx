import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Intern = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mentor_id: ''
  })
  const [mentors, setMentors] = useState([])
  const [interns, setInterns] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('add')

  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/all-mentor')
        if (!response.ok) throw new Error('Failed to fetch mentors')
        const data = await response.json()
        setMentors(data)
        console.log(data)
      } catch (err) {
        setError('Error fetching mentors: ' + err.message)
      }
    }

    // Mock interns data - replace with actual API call
    const fetchInterns = async () => {
      // Simulate API call
      setTimeout(() => {
        setInterns([
          { id: 1, name: 'John Doe', email: 'john@example.com', mentor_id: 1, mentorName: 'aditya aryan', status: 'Active' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', mentor_id: 2, mentorName: 'ds priyam', status: 'Active' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', mentor_id: 1, mentorName: 'aditya aryan', status: 'Inactive' },
        ])
      }, 500)
    }

    fetchMentors()
    fetchInterns()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addIntern = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.email || !formData.mentor_id) {
      setError('Please fill in all fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setIsLoading(true)
      
      // Prepare data for API - using mentor_id instead of mentor
      const internData = {
        name: formData.name,
        email: formData.email,
        mentor_id: parseInt(formData.mentor_id) // Ensure it's a number
      }

      console.log('Sending data to API:', internData)

      // Make API call
      const response = await axios.post("http://localhost:8082/api/add-intern", internData)
      console.log('API Response:', response)

      if (response.data) {
        // Find selected mentor details for display
        const selectedMentor = mentors.find(m => m.id == formData.mentor_id)
        
        // Add new intern to the local state for immediate UI update
        const newIntern = {
          id: interns.length + 1,
          name: formData.name,
          email: formData.email,
          mentor_id: selectedMentor.id,
          mentorName: selectedMentor.name,
          status: 'Active'
        }
        
        setInterns(prev => [newIntern, ...prev])
        setSuccess('Intern added successfully!')
        setFormData({ name: '', email: '', mentor_id: '' })
      }
    } catch (err) {
      console.error('Error adding intern:', err)
      setError('Error adding intern: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    total: interns.length,
    active: interns.filter(i => i.status === 'Active').length,
    inactive: interns.filter(i => i.status === 'Inactive').length,
    mentors: mentors.length
  }

  // Get selected mentor details for display
  const getSelectedMentor = () => {
    if (!formData.mentor_id) return null
    return mentors.find(mentor => mentor.id == formData.mentor_id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="flex gap-6 h-full">
        {/* Left Side - Form and Quick Stats */}
        <div className="flex-1 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Intern Management</h1>
              <p className="text-gray-400">Manage and track all interns in the program</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveTab('add')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'add' 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Add Intern
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'list' 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                View All
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Total Interns</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Inactive</p>
              <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Mentors</p>
              <p className="text-2xl font-bold text-blue-400">{stats.mentors}</p>
            </div>
          </div>

          {/* Add Intern Form */}
          {activeTab === 'add' && (
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>👨‍💻</span>
                Add New Intern
              </h2>
              
              <form onSubmit={addIntern} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Assign Mentor *
                  </label>
                  {mentors.length === 0 ? (
                    <div className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-400">
                      Loading mentors...
                    </div>
                  ) : (
                    <select
                      name="mentor_id"
                      value={formData.mentor_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="">Select a mentor</option>
                      {mentors.map((mentor) => (
                        <option key={mentor.id} value={mentor.id} className="bg-gray-800 text-white">
                          {mentor.name} - {mentor.department}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {/* Selected Mentor Preview */}
                  {formData.mentor_id && (
                    <div className="mt-3 p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <p className="text-white text-sm font-medium">Selected Mentor:</p>
                      <p className="text-gray-300">
                        {getSelectedMentor()?.name} - {getSelectedMentor()?.department}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Mentor ID: {formData.mentor_id}
                      </p>
                    </div>
                  )}
                </div>

                {/* Messages */}
                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 disabled:from-gray-900 disabled:to-gray-900 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed border border-gray-700"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Adding Intern...
                    </span>
                  ) : (
                    'Add Intern'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Interns List */}
          {activeTab === 'list' && (
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📋</span>
                All Interns ({interns.length})
              </h2>
              <div className="space-y-3">
                {interns.map((intern) => (
                  <div key={intern.id} className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-white">👤</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{intern.name}</p>
                        <p className="text-gray-400 text-sm">{intern.email}</p>
                        <p className="text-gray-500 text-xs">ID: {intern.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Mentor: {intern.mentorName}</p>
                      <p className="text-gray-500 text-xs">Mentor ID: {intern.mentor_id}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                        intern.status === 'Active' 
                          ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                          : 'bg-red-900/30 text-red-400 border border-red-800/50'
                      }`}>
                        {intern.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Mentors List and Recent Activity */}
        <div className="flex-1 max-w-md">
          {/* Mentors List */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>👨‍🏫</span>
              Available Mentors
            </h3>
            <div className="space-y-3">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="p-3 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{mentor.name}</p>
                      <p className="text-gray-400 text-sm">{mentor.department}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      ID: {mentor.id}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                      {interns.filter(i => i.mentor_id === mentor.id).length} interns
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📈</span>
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { action: 'New intern registered', user: 'John Doe', time: '2 min ago' },
                { action: 'Mentor assigned', user: 'aditya aryan', time: '1 hour ago' },
                { action: 'Profile updated', user: 'Jane Smith', time: '3 hours ago' },
                { action: 'Status changed', user: 'Mike Johnson', time: '1 day ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-900/30 rounded-lg transition-all duration-200">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-sm">🔔</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Intern