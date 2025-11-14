import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { UserPlus, Users, BarChart3, Edit, Save, X, Trash2, Mail, Building } from 'lucide-react'

const Mentor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
  })
  const [mentors, setMentors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('add')
  const [editingMentor, setEditingMentor] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    department: ''
  })

  // Fetch mentors from API
  const fetchMentors = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/all-mentor')
      if (!response.ok) throw new Error('Failed to fetch mentors')
      const data = await response.json()
      setMentors(data)
    } catch (err) {
      setError('Error fetching mentors: ' + err.message)
    }
  }

  useEffect(() => {
    fetchMentors()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const addMentor = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.email || !formData.department) {
      setError('Please fill in all fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setIsLoading(true)
      
      const mentorData = {
        name: formData.name,
        email: formData.email,
        department: formData.department
      }

      const response = await axios.post("http://localhost:8082/api/add-mentor", mentorData)
      console.log('API Response:', response)

      if (response.data) {
        fetchMentors()
        setSuccess('Mentor added successfully!')
        setFormData({ name: '', email: '', department: '' })
      }
    } catch (err) {
      console.error('Error adding mentor:', err)
      setError('Error adding mentor: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (mentor) => {
    setEditingMentor(mentor.id)
    setEditFormData({
      name: mentor.name,
      email: mentor.email,
      department: mentor.department
    })
  }

  const cancelEditing = () => {
    setEditingMentor(null)
    setEditFormData({
      name: '',
      email: '',
      department: ''
    })
  }

  const updateMentor = async (mentorId) => {
    setError('')
    setSuccess('')

    if (!editFormData.name || !editFormData.email || !editFormData.department) {
      setError('Please fill in all fields')
      return
    }

    if (!editFormData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setIsLoading(true)
      
      const updateData = {
        name: editFormData.name,
        email: editFormData.email,
        department: editFormData.department
      }

      const response = await axios.put(`http://localhost:8082/api/update-mentor/${mentorId}`, updateData)
      console.log('Update API Response:', response)

      if (response.data) {
        fetchMentors()
        setSuccess('Mentor updated successfully!')
        setEditingMentor(null)
        setEditFormData({
          name: '',
          email: '',
          department: ''
        })
      }
    } catch (err) {
      console.error('Error updating mentor:', err)
      setError('Error updating mentor: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = (mentorId, mentorName) => {
    setDeleteConfirm({ id: mentorId, name: mentorName })
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  const deleteMentor = async (mentorId) => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await axios.delete(`http://localhost:8082/api/delete-mentor/${mentorId}`)
      console.log('Delete API Response:', response)

      if (response.data) {
        fetchMentors()
        setSuccess('Mentor deleted successfully!')
        setDeleteConfirm(null)
      }
    } catch (err) {
      console.error('Error deleting mentor:', err)
      setError('Error deleting mentor: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate department statistics
  const departmentStats = mentors.reduce((acc, mentor) => {
    const dept = mentor.department || 'Unknown'
    if (!acc[dept]) {
      acc[dept] = { count: 0, mentors: [] }
    }
    acc[dept].count++
    acc[dept].mentors.push(mentor.name)
    return acc
  }, {})

  const departmentData = Object.entries(departmentStats).map(([dept, data]) => ({
    department: dept,
    count: data.count,
    percentage: ((data.count / mentors.length) * 100).toFixed(1)
  }))

  const stats = {
    total: mentors.length,
    departments: Object.keys(departmentStats).length
  }

  // Color palette for charts
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 
    'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-black/90 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/20 border border-red-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Mentor</h3>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMentor(deleteConfirm.id)}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6 h-full">
        {/* Left Side - Form and Quick Stats */}
        <div className="flex-1 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Mentor Management</h1>
              <p className="text-gray-400">Manage and track all mentors in the program</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveTab('add')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'add' 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <UserPlus size={18} />
                Add Mentor
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'list' 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Users size={18} />
                View All
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Total Mentors</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Departments</p>
              <p className="text-2xl font-bold text-blue-400">{stats.departments}</p>
            </div>
          </div>

          {/* Add Mentor Form */}
          {activeTab === 'add' && (
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <UserPlus className="text-blue-400" />
                Add New Mentor
              </h2>
              
              <form onSubmit={addMentor} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter mentor's full name"
                    className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Department *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      name="department"
                      type="text"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Enter department name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
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
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-900 disabled:to-gray-900 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed border border-blue-600 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Adding Mentor...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Add Mentor
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Mentors List */}
          {activeTab === 'list' && (
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="text-green-400" />
                All Mentors ({mentors.length})
              </h2>
              
              {/* Messages */}
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg mb-4">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              <div className="space-y-3">
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-200">
                    {editingMentor === mentor.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                              Full Name *
                            </label>
                            <input
                              name="name"
                              type="text"
                              value={editFormData.name}
                              onChange={handleEditInputChange}
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                              Email Address *
                            </label>
                            <input
                              name="email"
                              type="email"
                              value={editFormData.email}
                              onChange={handleEditInputChange}
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Department *
                          </label>
                          <input
                            name="department"
                            type="text"
                            value={editFormData.department}
                            onChange={handleEditInputChange}
                            className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={cancelEditing}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                          >
                            <X size={16} />
                            Cancel
                          </button>
                          <button
                            onClick={() => updateMentor(mentor.id)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Save size={16} />
                            {isLoading ? 'Updating...' : 'Update'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {mentor.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">{mentor.name}</p>
                            <p className="text-gray-400 text-sm flex items-center gap-1">
                              <Mail size={14} />
                              {mentor.email}
                            </p>
                            <p className="text-blue-400 text-sm flex items-center gap-1">
                              <Building size={14} />
                              {mentor.department}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">ID: {mentor.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(mentor)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
                            title="Edit Mentor"
                          >
                            <Edit size={16} className="text-gray-300" />
                          </button>
                          <button
                            onClick={() => confirmDelete(mentor.id, mentor.name)}
                            className="p-2 bg-red-700 hover:bg-red-600 rounded-lg transition-all duration-200"
                            title="Delete Mentor"
                          >
                            <Trash2 size={16} className="text-red-300" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Charts and Statistics */}
        <div className="flex-1 max-w-md">
          {/* Department Distribution Chart */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-purple-400" />
              Department Distribution
            </h3>
            
            {mentors.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="text-gray-400 mx-auto mb-2" size={32} />
                <p className="text-gray-400">No data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bar Chart */}
                <div className="space-y-3">
                  {departmentData.map((dept, index) => (
                    <div key={dept.department} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{dept.department}</span>
                        <span className="text-gray-400">{dept.count} ({dept.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${colors[index % colors.length]} transition-all duration-1000 ease-out`}
                          style={{ width: `${dept.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pie Chart Visualization */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Department Split</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {departmentData.map((dept, index) => (
                      <div key={dept.department} className="flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                        <span className="text-white text-sm flex-1">{dept.department}</span>
                        <span className="text-gray-400 text-xs">{dept.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Statistics */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-green-400" />
              Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-gray-400 text-xs">Total Mentors</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-400">{stats.departments}</p>
                  <p className="text-gray-400 text-xs">Departments</p>
                </div>
              </div>

              {/* Top Departments */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Top Departments</h4>
                <div className="space-y-2">
                  {departmentData
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3)
                    .map((dept, index) => (
                      <div key={dept.department} className="flex justify-between items-center p-2 bg-gray-900/30 rounded">
                        <span className="text-white text-sm">{dept.department}</span>
                        <span className="text-blue-400 text-sm font-semibold">{dept.count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mentor