import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, FolderOpen, BarChart3, Edit, Save, X, Trash2, Calendar, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

const Project = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  })
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('add')
  const [editingProject, setEditingProject] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'ongoing'
  })

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/all-project')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      setError('Error fetching projects: ' + err.message)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const addProject = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.description || !formData.start_date || !formData.end_date) {
      setError('Please fill in all fields')
      return
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError('End date must be after start date')
      return
    }

    try {
      setIsLoading(true)
      
      const projectData = {
        name: formData.name,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date
      }

      const response = await axios.post("http://localhost:8082/api/add-project", projectData)
      console.log('API Response:', response)

      if (response.data) {
        fetchProjects()
        setSuccess(`Project created successfully! Project ID: ${response.data.id || 'N/A'}`)
        setFormData({ 
          name: '', 
          description: '', 
          start_date: '', 
          end_date: '' 
        })
      }
    } catch (err) {
      console.error('Error adding project:', err)
      setError('Error adding project: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (project) => {
    setEditingProject(project.id)
    setEditFormData({
      name: project.name,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date,
      status: project.status || 'ongoing'
    })
  }

  const cancelEditing = () => {
    setEditingProject(null)
    setEditFormData({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      status: 'ongoing'
    })
  }

  const updateProject = async (projectId) => {
    setError('')
    setSuccess('')

    if (!editFormData.name || !editFormData.description || !editFormData.start_date || !editFormData.end_date) {
      setError('Please fill in all fields')
      return
    }

    if (new Date(editFormData.start_date) >= new Date(editFormData.end_date)) {
      setError('End date must be after start date')
      return
    }

    try {
      setIsLoading(true)
      
      const updateData = {
        name: editFormData.name,
        description: editFormData.description,
        start_date: editFormData.start_date,
        end_date: editFormData.end_date,
        status: editFormData.status
      }

      const response = await axios.put(`http://localhost:8082/api/update-project/${projectId}`, updateData)
      console.log('Update API Response:', response)

      if (response.data) {
        fetchProjects()
        setSuccess('Project updated successfully!')
        setEditingProject(null)
        setEditFormData({
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          status: 'ongoing'
        })
      }
    } catch (err) {
      console.error('Error updating project:', err)
      setError('Error updating project: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = (projectId, projectName) => {
    setDeleteConfirm({ id: projectId, name: projectName })
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  const deleteProject = async (projectId) => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await axios.delete(`http://localhost:8082/api/delete-project/${projectId}`)
      console.log('Delete API Response:', response)

      if (response.data) {
        fetchProjects()
        setSuccess('Project deleted successfully!')
        setDeleteConfirm(null)
      }
    } catch (err) {
      console.error('Error deleting project:', err)
      setError('Error deleting project: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate project statistics
  const getStatusStats = () => {
    const stats = {
      total: projects.length,
      ongoing: projects.filter(p => p.status === 'ongoing').length,
      overdue: projects.filter(p => p.status === 'overdue').length,
      completed: projects.filter(p => p.status === 'completed').length
    }
    return stats
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ongoing':
        return <Clock className="text-blue-400" size={16} />
      case 'overdue':
        return <AlertTriangle className="text-red-400" size={16} />
      case 'completed':
        return <CheckCircle className="text-green-400" size={16} />
      default:
        return <Clock className="text-gray-400" size={16} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-900/30 text-blue-400 border-blue-800/50'
      case 'overdue':
        return 'bg-red-900/30 text-red-400 border-red-800/50'
      case 'completed':
        return 'bg-green-900/30 text-green-400 border-green-800/50'
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-800/50'
    }
  }

  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    
    if (today >= end) return 100
    if (today <= start) return 0
    
    const totalDuration = end - start
    const elapsed = today - start
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const stats = getStatusStats()

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
              <h3 className="text-xl font-bold text-white mb-2">Delete Project</h3>
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
                  onClick={() => deleteProject(deleteConfirm.id)}
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
        {/* Left Side - Form and Project List */}
        <div className="flex-1 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Project Management</h1>
              <p className="text-gray-400">Manage and track all projects in the program</p>
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
                <Plus size={18} />
                Add Project
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'list' 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <FolderOpen size={18} />
                View All
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Ongoing</p>
              <p className="text-2xl font-bold text-blue-400">{stats.ongoing}</p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
            </div>
          </div>

          {/* Add Project Form */}
          {activeTab === 'add' && (
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="text-purple-400" />
                Create New Project
              </h2>
              
              <form onSubmit={addProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Project Name *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter project name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      End Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
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
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-900 disabled:to-gray-900 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed border border-purple-600 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Project
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Projects List */}
          {activeTab === 'list' && (
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FolderOpen className="text-orange-400" />
                All Projects ({projects.length})
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

              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-200">
                    {editingProject === project.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Project Name *
                          </label>
                          <input
                            name="name"
                            type="text"
                            value={editFormData.name}
                            onChange={handleEditInputChange}
                            className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Description *
                          </label>
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditInputChange}
                            rows="3"
                            className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                              Start Date *
                            </label>
                            <input
                              name="start_date"
                              type="date"
                              value={editFormData.start_date}
                              onChange={handleEditInputChange}
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                              End Date *
                            </label>
                            <input
                              name="end_date"
                              type="date"
                              value={editFormData.end_date}
                              onChange={handleEditInputChange}
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Status *
                          </label>
                          <select
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditInputChange}
                            className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          >
                            <option value="ongoing">Ongoing</option>
                            <option value="overdue">Overdue</option>
                            <option value="completed">Completed</option>
                          </select>
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
                            onClick={() => updateProject(project.id)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Save size={16} />
                            {isLoading ? 'Updating...' : 'Update'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getStatusColor(project.status)}`}>
                                {getStatusIcon(project.status)}
                                {project.status}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>Start: {formatDate(project.start_date)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>End: {formatDate(project.end_date)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(project)}
                              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
                              title="Edit Project"
                            >
                              <Edit size={16} className="text-gray-300" />
                            </button>
                            <button
                              onClick={() => confirmDelete(project.id, project.name)}
                              className="p-2 bg-red-700 hover:bg-red-600 rounded-lg transition-all duration-200"
                              title="Delete Project"
                            >
                              <Trash2 size={16} className="text-red-300" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Progress</span>
                            <span>{Math.round(calculateProgress(project.start_date, project.end_date))}%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                              style={{ width: `${calculateProgress(project.start_date, project.end_date)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">Project ID: {project.id}</p>
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
          {/* Project Status Chart */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-blue-400" />
              Project Status Overview
            </h3>
            
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="text-gray-400 mx-auto mb-2" size={32} />
                <p className="text-gray-400">No projects available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Bars */}
                <div className="space-y-3">
                  {[
                    { status: 'ongoing', label: 'Ongoing', color: 'bg-blue-500', count: stats.ongoing },
                    { status: 'overdue', label: 'Overdue', color: 'bg-red-500', count: stats.overdue },
                    { status: 'completed', label: 'Completed', color: 'bg-green-500', count: stats.completed }
                  ].map((item) => (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          {item.label}
                        </span>
                        <span className="text-gray-400">
                          {item.count} ({stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Distribution */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Status Distribution</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { status: 'ongoing', color: 'bg-blue-500', count: stats.ongoing },
                      { status: 'overdue', color: 'bg-red-500', count: stats.overdue },
                      { status: 'completed', color: 'bg-green-500', count: stats.completed }
                    ].map((item) => (
                      <div key={item.status} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-white text-sm capitalize">{item.status}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{item.count} projects</span>
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
              Project Timeline
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-400">{stats.ongoing}</p>
                  <p className="text-gray-400 text-xs">Active</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                  <p className="text-gray-400 text-xs">Completed</p>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Recent Projects</h4>
                <div className="space-y-2">
                  {projects
                    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                    .slice(0, 3)
                    .map((project) => (
                      <div key={project.id} className="flex justify-between items-center p-2 bg-gray-900/30 rounded">
                        <span className="text-white text-sm truncate flex-1 mr-2">{project.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
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

export default Project