import React, { useState, useEffect } from 'react'
import { Baby, Users, FolderClosed, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import axios from 'axios'

const Data = () => {
  const [statsData, setStatsData] = useState({
    totalMentors: 0,
    totalInterns: 0,
    totalProjects: 0,
    activeInterns: 0,
    inactiveInterns: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    overdueProjects: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch all data from APIs
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Fetch all data in parallel
      const [mentorsRes, internsRes, projectsRes, assignmentsRes] = await Promise.all([
        axios.get('http://localhost:8082/api/all-mentor'),
        axios.get('http://localhost:8082/api/all-intern'),
        axios.get('http://localhost:8082/api/all-project'),
        axios.get('http://localhost:8082/api/all-assignment')
      ])

      const mentors = mentorsRes.data
      const interns = internsRes.data
      const projects = projectsRes.data
      const assignments = assignmentsRes.data

      // Calculate statistics
      const activeInterns = interns.filter(intern => intern.status === 'active').length
      const inactiveInterns = interns.filter(intern => intern.status === 'inactive').length
      const completedProjects = projects.filter(project => project.status === 'completed').length
      const ongoingProjects = projects.filter(project => project.status === 'ongoing').length
      const overdueProjects = projects.filter(project => project.status === 'overdue').length

      // Update stats data
      setStatsData({
        totalMentors: mentors.length,
        totalInterns: interns.length,
        totalProjects: projects.length,
        activeInterns,
        inactiveInterns,
        completedProjects,
        ongoingProjects,
        overdueProjects
      })

      // Generate recent activity from assignments and recent changes
      generateRecentActivity(assignments, interns, projects, mentors)

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateRecentActivity = (assignments, interns, projects, mentors) => {
    const activities = []

    // Add recent assignment activities
    assignments.slice(0, 5).forEach(assignment => {
      const intern = interns.find(i => i.id === assignment.intern_id)
      const project = projects.find(p => p.id === assignment.project_id)
      
      if (intern && project) {
        activities.push({
          user: intern.name,
          action: assignment.progress === 1 ? 'completed assignment' : 'started working on',
          project: project.name,
          time: 'recently',
          type: 'assignment'
        })
      }
    })

    // Add recent project completions
    projects.filter(p => p.status === 'completed').slice(0, 3).forEach(project => {
      activities.push({
        user: 'System',
        action: 'project completed',
        project: project.name,
        time: 'recently',
        type: 'project'
      })
    })

    // Add new intern registrations
    interns.slice(0, 2).forEach(intern => {
      activities.push({
        user: intern.name,
        action: 'joined as intern',
        department: 'New Registration',
        time: 'recently',
        type: 'intern'
      })
    })

    // Sort by recent (simulated - in real app you'd have timestamps)
    setRecentActivity(activities.slice(0, 6))
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const StatCard = ({ title, value, icon, color, delay }) => (
    <div 
      className={`bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl animate-slide-up hover:scale-105 transition-all duration-300 hover:border-${color}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{isLoading ? '...' : value}</p>
        </div>
        <div className={`text-2xl ${getColorClass(color)}`}>{icon}</div>
      </div>
    </div>
  )

  const getColorClass = (color) => {
    const colorMap = {
      'cyan-500': 'text-cyan-500',
      'blue-500': 'text-blue-500',
      'purple-500': 'text-purple-500',
      'green-500': 'text-green-500',
      'red-500': 'text-red-500',
      'yellow-500': 'text-yellow-500'
    }
    return colorMap[color] || 'text-white'
  }

  const ProgressBar = ({ percentage, color }) => (
    <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
      <div 
        className={`h-2 rounded-full ${color} transition-all duration-1000 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <CheckCircle className="text-green-400" size={16} />
      case 'project':
        return <FolderClosed className="text-blue-400" size={16} />
      case 'intern':
        return <Users className="text-purple-400" size={16} />
      default:
        return <Clock className="text-gray-400" size={16} />
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-800/50 rounded-2xl p-8 text-center">
          <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-black/60 border border-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Mentors"
              value={statsData.totalMentors}
              icon={<Baby />}
              color="cyan-500"
              delay="0s"
            />
            <StatCard
              title="Total Interns"
              value={statsData.totalInterns}
              icon={<Users />}
              color="blue-500"
              delay="0.1s"
            />
            <StatCard
              title="Total Projects"
              value={statsData.totalProjects}
              icon={<FolderClosed />}
              color="purple-500"
              delay="0.2s"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active vs Inactive Interns */}
            <div className="bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
              <h3 className="text-lg font-semibold text-white mb-4">Intern Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Active Interns</span>
                    <span className="text-white">{statsData.activeInterns}</span>
                  </div>
                  <ProgressBar 
                    percentage={statsData.totalInterns > 0 ? (statsData.activeInterns / statsData.totalInterns) * 100 : 0} 
                    color="bg-green-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Inactive Interns</span>
                    <span className="text-white">{statsData.inactiveInterns}</span>
                  </div>
                  <ProgressBar 
                    percentage={statsData.totalInterns > 0 ? (statsData.inactiveInterns / statsData.totalInterns) * 100 : 0} 
                    color="bg-red-500"
                  />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Active Rate</span>
                  <span className="text-green-400">
                    {statsData.totalInterns > 0 ? ((statsData.activeInterns / statsData.totalInterns) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Project Completion */}
            <div className="bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
              <h3 className="text-lg font-semibold text-white mb-4">Project Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Completed</span>
                    <span className="text-white">{statsData.completedProjects}</span>
                  </div>
                  <ProgressBar 
                    percentage={statsData.totalProjects > 0 ? (statsData.completedProjects / statsData.totalProjects) * 100 : 0} 
                    color="bg-green-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-400">Ongoing</span>
                    <span className="text-white">{statsData.ongoingProjects}</span>
                  </div>
                  <ProgressBar 
                    percentage={statsData.totalProjects > 0 ? (statsData.ongoingProjects / statsData.totalProjects) * 100 : 0} 
                    color="bg-yellow-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Overdue</span>
                    <span className="text-white">{statsData.overdueProjects}</span>
                  </div>
                  <ProgressBar 
                    percentage={statsData.totalProjects > 0 ? (statsData.overdueProjects / statsData.totalProjects) * 100 : 0} 
                    color="bg-red-500"
                  />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Completion Rate</span>
                  <span className="text-green-400">
                    {statsData.totalProjects > 0 ? ((statsData.completedProjects / statsData.totalProjects) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-all duration-200"
              >
                Refresh
              </button>
            </div>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                        {activity.project && <span className="text-cyan-400"> "{activity.project}"</span>}
                        {activity.department && <span className="text-blue-400"> in {activity.department}</span>}
                      </p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="text-gray-400 mx-auto mb-2" size={32} />
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <Users className="text-blue-400 mx-auto mb-2" size={24} />
                <p className="text-white font-semibold">{statsData.activeInterns}</p>
                <p className="text-gray-400 text-sm">Active Interns</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <FolderClosed className="text-green-400 mx-auto mb-2" size={24} />
                <p className="text-white font-semibold">{statsData.completedProjects}</p>
                <p className="text-gray-400 text-sm">Done Projects</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <Baby className="text-cyan-400 mx-auto mb-2" size={24} />
                <p className="text-white font-semibold">{statsData.totalMentors}</p>
                <p className="text-gray-400 text-sm">Mentors</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <CheckCircle className="text-purple-400 mx-auto mb-2" size={24} />
                <p className="text-white font-semibold">
                  {statsData.totalProjects > 0 ? ((statsData.completedProjects / statsData.totalProjects) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Data