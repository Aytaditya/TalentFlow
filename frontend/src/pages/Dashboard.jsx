import { useState } from "react"
import { useAuth } from "../context/AuthContext";
import { Activity, ChartBar, Baby, Users, FolderClosed, LogOut,User } from "lucide-react"
import Data from "../components/Data";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const { logout } = useAuth();

  const handleLogout = () => {
    logout()
    console.log("Logging out...")
    setShowLogoutModal(false)
  }


  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-black/90 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/20 border border-red-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-300"><LogOut /></span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Logout Confirmation</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black/80 backdrop-blur-md border-r border-gray-800 transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold"><Activity /></span>
            </div>
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-white animate-fade-in">Talent Flow</h1>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: <ChartBar /> },
            { id: "addIntern", label: "Manage Intern", icon: <Baby /> },
            { id: "addMentor", label: "Add Mentor", icon: <Users /> },
            { id: "addProject", label: "Add Project", icon: <FolderClosed /> },
            // { id: "interns", label: "Interns", icon: "👥" },
            // { id: "mentors", label: "Mentors", icon: "🎯" },
            // { id: "projects", label: "Projects", icon: "📋" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                  ? 'bg-gray-800 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-medium animate-fade-in">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-red-900/20 transition-all duration-200 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200"><LogOut /></span>
            {sidebarOpen && (
              <span className="font-medium animate-fade-in">Logout</span>
            )}
          </button>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="flex items-center gap-3 p-3 mt-2 bg-gray-800/30 rounded-lg animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">Admin User</p>
                <p className="text-gray-400 text-xs truncate">aditya531@gmail.com</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-black/40 backdrop-blur-md border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <span className="text-white">☰</span>
              </button>
              <h1 className="text-2xl font-bold text-white capitalize">
                {activeTab.replace(/([A-Z])/g, ' $1')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white"><User /></span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <Data />
        )}


        {activeTab === "addProject" && (
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Description
            </label>
            <textarea
              placeholder="Enter project description"
              rows="4"
              className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        )}

        {/* Add Forms */}
        {activeTab === "addIntern" && (
          <div className="p-6 text-white">
            this is intern page
          </div>
        
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-scale-in { animation: scale-in 0.4s ease-out; }
      `}</style>
    </div>
  )
}