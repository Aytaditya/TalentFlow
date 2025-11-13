import React from 'react'
import { Baby, Users, FolderClosed } from "lucide-react"

const Data = () => {

    const statsData = {
        totalMentors: 24,
        totalInterns: 156,
        totalProjects: 89,
        activeInterns: 124,
        inactiveInterns: 32,
        completedProjects: 67,
        ongoingProjects: 22
      }

      const StatCard = ({ title, value, icon, color, delay }) => (
        <div 
          className={`bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl animate-slide-up hover:scale-105 transition-all duration-300 ${"hover:border-"+color}`}
          style={{ animationDelay: delay }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{title}</p>
              <p className="text-3xl font-bold text-white mt-2">{value}</p>
            </div>
            <div className={`text-2xl text-white`}>{icon}</div>
          </div>
        </div>
      )
    
      const ProgressBar = ({ percentage, color }) => (
        <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full ${color} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )

  return (
    <div className="p-6 space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Mentors"
        value={statsData.totalMentors}
        icon=<Baby/>
        color="cyan-500"
        delay="0s"
      />
      <StatCard
        title="Total Interns"
        value={statsData.totalInterns}
        icon=<Users/>
        color="blue-500"
        delay="0.1s"
      />
      <StatCard
        title="Total Projects"
        value={statsData.totalProjects}
        icon=<FolderClosed/>
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
              percentage={(statsData.activeInterns / statsData.totalInterns) * 100} 
              color="bg-green-500"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-red-400">Inactive Interns</span>
              <span className="text-white">{statsData.inactiveInterns}</span>
            </div>
            <ProgressBar 
              percentage={(statsData.inactiveInterns / statsData.totalInterns) * 100} 
              color="bg-red-500"
            />
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Active Rate</span>
            <span className="text-green-400">
              {((statsData.activeInterns / statsData.totalInterns) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Project Completion */}
      <div className="bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
        <h3 className="text-lg font-semibold text-white mb-4">Project Completion</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Completed</span>
              <span className="text-white">{statsData.completedProjects}</span>
            </div>
            <ProgressBar 
              percentage={(statsData.completedProjects / statsData.totalProjects) * 100} 
              color="bg-green-500"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-400">Ongoing</span>
              <span className="text-white">{statsData.ongoingProjects}</span>
            </div>
            <ProgressBar 
              percentage={(statsData.ongoingProjects / statsData.totalProjects) * 100} 
              color="bg-yellow-500"
            />
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Completion Rate</span>
            <span className="text-green-400">
              {((statsData.completedProjects / statsData.totalProjects) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {[
          { user: "Sarah Johnson", action: "completed project", project: "E-commerce App", time: "2 hours ago" },
          { user: "Mike Chen", action: "joined as intern", department: "Frontend", time: "4 hours ago" },
          { user: "Dr. Emily Davis", action: "assigned as mentor", interns: 5, time: "1 day ago" },
          { user: "Alex Rodriguez", action: "submitted project", project: "Dashboard UI", time: "1 day ago" }
        ].map((activity, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">
                <span className="font-medium">{activity.user}</span> {activity.action}
                {activity.project && <span className="text-cyan-400"> "{activity.project}"</span>}
                {activity.department && <span className="text-blue-400"> in {activity.department}</span>}
                {activity.interns && <span className="text-green-400"> for {activity.interns} interns</span>}
              </p>
              <p className="text-gray-400 text-xs">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default Data
