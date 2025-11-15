import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, ListTodo, BarChart3, Edit, Save, X, Trash2, User, FolderOpen, MessageSquare } from 'lucide-react'

const Assignment = () => {
  const [formData, setFormData] = useState({
    intern_id: '',
    project_id: '',
    remarks: ''
  })
  const [assignments, setAssignments] = useState([])
  const [projects, setProjects] = useState([])
  const [interns, setInterns] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('add')
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editFormData, setEditFormData] = useState({
    intern_id: '',
    project_id: '',
    progress: 0,
    remarks: ''
  })

  // Fetch data from APIs
  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/all-assignment')
      if (!response.ok) throw new Error('Failed to fetch assignments')
      const data = await response.json()
      setAssignments(data)
    } catch (err) {
      setError('Error fetching assignments: ' + err.message)
    }
  }

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

  const fetchInterns = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/all-intern')
      if (!response.ok) throw new Error('Failed to fetch interns')
      const data = await response.json()
      setInterns(data)
    } catch (err) {
      setError('Error fetching interns: ' + err.message)
    }
  }

  useEffect(() => {
    fetchAssignments()
    fetchProjects()
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

  const addAssignment = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.intern_id || !formData.project_id || !formData.remarks) {
      setError('Please fill in all fields')
      return
    }

    try {
      setIsLoading(true)
      
      const assignmentData = {
        intern_id: parseInt(formData.intern_id),
        project_id: parseInt(formData.project_id),
        remarks: formData.remarks
      }

      const response = await axios.post("http://localhost:8082/api/add-assignment", assignmentData)
      console.log('API Response:', response)

      if (response.data) {
        fetchAssignments()
        setSuccess('Assignment created successfully!')
        setFormData({ 
          intern_id: '', 
          project_id: '', 
          remarks: '' 
        })
      }
    } catch (err) {
      console.error('Error adding assignment:', err)
      setError('Error adding assignment: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (assignment) => {
    setEditingAssignment(assignment.id)
    setEditFormData({
      intern_id: assignment.intern_id.toString(),
      project_id: assignment.project_id.toString(),
      progress: assignment.progress,
      remarks: assignment.remarks
    })
  }

  const cancelEditing = () => {
    setEditingAssignment(null)
    setEditFormData({
      intern_id: '',
      project_id: '',
      progress: 0,
      remarks: ''
    })
  }

  const updateAssignment = async (assignmentId) => {
    setError('')
    setSuccess('')

    if (!editFormData.intern_id || !editFormData.project_id || !editFormData.remarks) {
      setError('Please fill in all fields')
      return
    }

    try {
      setIsLoading(true)
      
      const updateData = {
        intern_id: parseInt(editFormData.intern_id),
        project_id: parseInt(editFormData.project_id),
        progress: parseInt(editFormData.progress),
        remarks: editFormData.remarks
      }

      const response = await axios.put(`http://localhost:8082/api/update-assignment/${assignmentId}`, updateData)
      console.log('Update API Response:', response)

      if (response.data) {
        fetchAssignments()
        setSuccess('Assignment updated successfully!')
        setEditingAssignment(null)
        setEditFormData({
          intern_id: '',
          project_id: '',
          progress: 0,
          remarks: ''
        })
      }
    } catch (err) {
      console.error('Error updating assignment:', err)
      setError('Error updating assignment: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = (assignmentId, internName, projectName) => {
    setDeleteConfirm({ id: assignmentId, name: `${internName} - ${projectName}` })
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  const deleteAssignment = async (assignmentId) => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await axios.delete(`http://localhost:8082/api/delete-assignment/${assignmentId}`)
      console.log('Delete API Response:', response)

      if (response.data) {
        fetchAssignments()
        setSuccess('Assignment deleted successfully!')
        setDeleteConfirm(null)
      }
    } catch (err) {
      console.error('Error deleting assignment:', err)
      setError('Error deleting assignment: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate assignment statistics
  const getStats = () => {
    const stats = {
      total: assignments.length,
      completed: assignments.filter(a => a.progress === 1).length,
      pending: assignments.filter(a => a.progress === 0).length
    }
    return stats
  }

  const getProgressIcon = (progress) => {
    return progress === 1 
      ? <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      : <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
  }

  const getProgressText = (progress) => {
    return progress === 1 ? 'Completed' : 'Pending'
  }

  const getProgressColor = (progress) => {
    return progress === 1 
      ? 'bg-green-900/30 text-green-400 border-green-800/50'
      : 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50'
  }

  const stats = getStats()

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
              <h3 className="text-xl font-bold text-white mb-2">Delete Assignment</h3>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete assignment for <span className="text-white font-semibold">{deleteConfirm.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteAssignment(deleteConfirm.id)}
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
        {/* Left Side - Form and Assignment List */}
        <div className="flex-1 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Assignment Management</h1>
              <p className="text-gray-400">Assign projects to interns and track their progress</p>
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
                Assign Project
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'list' 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <ListTodo size={18} />
                View Assignments
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Total Assignments</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-200">
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
          </div>

          {/* Add Assignment Form */}
          {activeTab === 'add' && (
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="text-indigo-400" />
                Assign Project to Intern
              </h2>
              
              <form onSubmit={addAssignment} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Select Intern *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      {interns.length === 0 ? (
                        <div className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-400">
                          Loading interns...
                        </div>
                      ) : (
                        <select
                          name="intern_id"
                          value={formData.intern_id}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option value="">Choose an intern</option>
                          {interns.map((intern) => (
                            <option key={intern.id} value={intern.id} className="bg-gray-800 text-white">
                              {intern.name} - {intern.email}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Select Project *
                    </label>
                    <div className="relative">
                      <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      {projects.length === 0 ? (
                        <div className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-400">
                          Loading projects...
                        </div>
                      ) : (
                        <select
                          name="project_id"
                          value={formData.project_id}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option value="">Choose a project</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id} className="bg-gray-800 text-white">
                              {project.name} - {project.description}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Remarks / Instructions *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      placeholder="Enter assignment instructions and remarks..."
                      rows="4"
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                {/* Selected Intern & Project Preview */}
                {(formData.intern_id || formData.project_id) && (
                  <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                    <p className="text-white text-sm font-medium mb-2">Assignment Preview:</p>
                    {formData.intern_id && (
                      <p className="text-gray-300 text-sm">
                        Intern: {interns.find(i => i.id == formData.intern_id)?.name}
                      </p>
                    )}
                    {formData.project_id && (
                      <p className="text-gray-300 text-sm">
                        Project: {projects.find(p => p.id == formData.project_id)?.name}
                      </p>
                    )}
                  </div>
                )}

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
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-900 disabled:to-gray-900 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed border border-indigo-600 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Creating Assignment...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Assign Project
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Assignments List */}
          {activeTab === 'list' && (
            <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ListTodo className="text-orange-400" />
                All Assignments ({assignments.length})
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
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-200">
                    {editingAssignment === assignment.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                              Intern *
                            </label>
                            <select
                              name="intern_id"
                              value={editFormData.intern_id}
                              onChange={handleEditInputChange}
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                            >
                              <option value="">Select intern</option>
                              {interns.map((intern) => (
                                <option key={intern.id} value={intern.id}>
                                  {intern.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                              Project *
                            </label>
                            <select
                              name="project_id"
                              value={editFormData.project_id}
                              onChange={handleEditInputChange}
                              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                            >
                              <option value="">Select project</option>
                              {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                  {project.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Progress Status *
                          </label>
                          <select
                            name="progress"
                            value={editFormData.progress}
                            onChange={handleEditInputChange}
                            className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          >
                            <option value={0}>Pending (Not Completed)</option>
                            <option value={1}>Completed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Remarks *
                          </label>
                          <textarea
                            name="remarks"
                            value={editFormData.remarks}
                            onChange={handleEditInputChange}
                            rows="3"
                            className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
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
                            onClick={() => updateAssignment(assignment.id)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
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
                              <h3 className="text-lg font-semibold text-white">{assignment.intern_name}</h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getProgressColor(assignment.progress)}`}>
                                {getProgressIcon(assignment.progress)}
                                {getProgressText(assignment.progress)}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <User size={14} />
                                <span>Intern: {assignment.intern_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <FolderOpen size={14} />
                                <span>Project: {assignment.project_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <MessageSquare size={14} />
                                <span>Remarks: {assignment.remarks}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(assignment)}
                              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
                              title="Edit Assignment"
                            >
                              <Edit size={16} className="text-gray-300" />
                            </button>
                            <button
                              onClick={() => confirmDelete(assignment.id, assignment.intern_name, assignment.project_name)}
                              className="p-2 bg-red-700 hover:bg-red-600 rounded-lg transition-all duration-200"
                              title="Delete Assignment"
                            >
                              <Trash2 size={16} className="text-red-300" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">Assignment ID: {assignment.id}</p>
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
          {/* Assignment Progress Chart */}
          <div className="bg-black/40 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-green-400" />
              Assignment Progress
            </h3>
            
            {assignments.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="text-gray-400 mx-auto mb-2" size={32} />
                <p className="text-gray-400">No assignments available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Progress Bars */}
                <div className="space-y-3">
                  {[
                    { progress: 1, label: 'Completed', color: 'bg-green-500', count: stats.completed },
                    { progress: 0, label: 'Pending', color: 'bg-yellow-500', count: stats.pending }
                  ].map((item) => (
                    <div key={item.progress} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 flex items-center gap-2">
                          {getProgressIcon(item.progress)}
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

                {/* Progress Distribution */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Progress Overview</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { progress: 1, label: 'Completed', color: 'bg-green-500', count: stats.completed },
                      { progress: 0, label: 'Pending', color: 'bg-yellow-500', count: stats.pending }
                    ].map((item) => (
                      <div key={item.progress} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-white text-sm">{item.label}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{item.count} assignments</span>
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
              <BarChart3 className="text-blue-400" />
              Assignment Stats
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-indigo-400">{stats.total}</p>
                  <p className="text-gray-400 text-xs">Total</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                  <p className="text-gray-400 text-xs">Completed</p>
                </div>
              </div>

              {/* Recent Assignments */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Recent Assignments</h4>
                <div className="space-y-2">
                  {assignments
                    .slice(0, 3)
                    .map((assignment) => (
                      <div key={assignment.id} className="flex justify-between items-center p-2 bg-gray-900/30 rounded">
                        <div className="flex-1">
                          <p className="text-white text-sm truncate">{assignment.intern_name}</p>
                          <p className="text-gray-400 text-xs truncate">{assignment.project_name}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${getProgressColor(assignment.progress)}`}>
                          {getProgressText(assignment.progress)}
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

export default Assignment