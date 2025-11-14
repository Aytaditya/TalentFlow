import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {Laptop,BriefcaseBusiness,Brain, Edit, Save, X, Trash2, Mail, Building} from 'lucide-react'

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
  const [editingIntern, setEditingIntern] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    mentor_id: '',
    status: 'active'
  })

  const fetchInterns = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/all-intern")
      if (!response.ok) throw new Error('Failed to fetch interns')
      const data = await response.json()
      setInterns(data)
      console.log(data)
    } catch (err) {
      setError('Error fetching interns: ' + err.message)
    }
  }

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

  useEffect(() => {
    fetchMentors()
    fetchInterns()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
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
      
      const internData = {
        name: formData.name,
        email: formData.email,
        mentor_id: parseInt(formData.mentor_id) 
      }

      const response = await axios.post("http://localhost:8082/api/add-intern", internData)
      console.log('API Response:', response)

      if (response.data) {
        fetchInterns()
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

  const startEditing = (intern) => {
    setEditingIntern(intern.id)
    setEditFormData({
      name: intern.name,
      email: intern.email,
      mentor_id: intern.mentor_id.toString(),
      status: intern.status || 'active'
    })
  }

  const cancelEditing = () => {
    setEditingIntern(null)
    setEditFormData({
      name: '',
      email: '',
      mentor_id: '',
      status: 'active'
    })
  }

  const updateIntern = async (internId) => {
    setError('')
    setSuccess('')

    if (!editFormData.name || !editFormData.email || !editFormData.mentor_id) {
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
        mentor_id: parseInt(editFormData.mentor_id),
        status: editFormData.status
      }

      const response = await axios.put(`http://localhost:8082/api/update-intern/${internId}`, updateData)
      console.log('Update API Response:', response)

      if (response.data) {
        fetchInterns()
        setSuccess('Intern updated successfully!')
        setEditingIntern(null)
        setEditFormData({
          name: '',
          email: '',
          mentor_id: '',
          status: 'active'
        })
      }
    } catch (err) {
      console.error('Error updating intern:', err)
      setError('Error updating intern: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = (internId, internName) => {
    setDeleteConfirm({ id: internId, name: internName })
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  const deleteIntern = async (internId) => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await axios.delete(`http://localhost:8082/api/delete-intern/${internId}`)
      console.log('Delete API Response:', response)

      if (response.data) {
        fetchInterns()
        setSuccess('Intern deleted successfully!')
        setDeleteConfirm(null)
      }
    } catch (err) {
      console.error('Error deleting intern:', err)
      setError('Error deleting intern: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const getMentorName = (mentorId) => {
    const mentor = mentors.find(m => m.id == mentorId)
    return mentor ? mentor.name : 'Unknown Mentor'
  }

  const stats = {
    total: interns.length,
    active: interns.filter(i => i.status === 'active').length,
    inactive: interns.filter(i => i.status === 'inactive').length,
    mentors: mentors.length
  }

  // Get selected mentor details for display
  const getSelectedMentor = () => {
    if (!formData.mentor_id) return null
    return mentors.find(mentor => mentor.id == formData.mentor_id)
  }

  const getEditSelectedMentor = () => {
    if (!editFormData.mentor_id) return null
    return mentors.find(mentor => mentor.id == editFormData.mentor_id)
  }

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
              <h3 className="text-xl font-bold text-white mb-2">Delete Intern</h3>
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
                  onClick={() => deleteIntern(deleteConfirm.id)}
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
                <span className='text-blue-400'><Laptop /></span>
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
                  className="w-full py-3 px-4 disabled:from-gray-900 disabled:to-gray-900 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed border border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2 ">
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
                <span><BriefcaseBusiness /></span>
                All Interns ({interns.length})
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
                {interns.map((intern) => (
                  <div key={intern.id} className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-200">
                    {editingIntern === intern.id ? (
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
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
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
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                              Mentor *
                            </label>
                            <select
                              name="mentor_id"
                              value={editFormData.mentor_id}
                              onChange={handleEditInputChange}
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                            >
                              <option value="">Select a mentor</option>
                              {mentors.map((mentor) => (
                                <option key={mentor.id} value={mentor.id}>
                                  {mentor.name} - {mentor.department}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                              Status *
                            </label>
                            <select
                              name="status"
                              value={editFormData.status}
                              onChange={handleEditInputChange}
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
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
                            onClick={() => updateIntern(intern.id)}
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
                          <p className="text-gray-400 text-sm">Mentor: {getMentorName(intern.mentor_id)}</p>
                          <p className="text-gray-500 text-xs">Mentor Email: {intern.mentor_email}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            intern.status === 'active' 
                              ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                              : 'bg-red-900/30 text-red-400 border border-red-800/50'
                          }`}>
                            {intern.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(intern)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
                            title="Edit Intern"
                          >
                            <Edit size={16} className="text-gray-300" />
                          </button>
                          <button
                            onClick={() => confirmDelete(intern.id, intern.name)}
                            className="p-2 bg-red-700 hover:bg-red-600 rounded-lg transition-all duration-200"
                            title="Delete Intern"
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

        {/* Right Side - Mentors List */}
        <div className="flex-1 max-w-md">
          {/* Mentors List */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className='text-purple-400'><Brain /></span>
              Available Mentors
            </h3>
            <div className="space-y-3">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="p-3 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{mentor.name}</p>
                      <div className='flex text-white text-sm gap-1'>
                        <span><Building className='w-3 h-5'/></span>
                      <p className="text-gray-400 text-sm">{mentor.department}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      ID: {mentor.id}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                      {interns.filter(i => i.mentor_id == mentor.id).length} interns
                    </span>
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