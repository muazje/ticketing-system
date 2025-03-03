"use client"

import { useContext } from "react"
import { Link, Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import * as Icons from "lucide-react"

const HomePage = () => {
  const { isAuthenticated, user } = useContext(AuthContext)

  if (isAuthenticated) {
    return user.role === "ADMIN" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-secondary-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-secondary-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <section className="px-4 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
                <h1 className="animate-slide-up text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  Support Hub
                  <span className="block text-primary-600 dark:text-primary-400">Streamline Your Support</span>
                </h1>
                <p className="animate-slide-up mt-6 text-lg text-gray-600 dark:text-gray-400 [animation-delay:200ms]">
                  Manage support tickets efficiently with our modern ticketing system. Streamline communication, track
                  issues, and provide better customer support.
                </p>
                <div className="animate-slide-up mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start [animation-delay:400ms]">
                  <Link
                    to="/register"
                    className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-3 text-center text-base font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-auto"
                  >
                    Get Started for Free
                  </Link>
                  <Link
                    to="/login"
                    className="w-full rounded-xl bg-white px-8 py-3 text-center text-base font-medium text-gray-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:text-gray-300 sm:w-auto"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
              <div className="animate-fade-in mt-16 sm:mt-24 lg:col-span-6 lg:mt-0 [animation-delay:600ms]">
                <div className="relative mx-auto w-full max-w-lg lg:max-w-md">
                  <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary-500/30 to-secondary-500/30 blur-2xl"></div>
                    <div className="relative space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
                        >
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-32 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything you need to manage support
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                Powerful features to help you manage support tickets efficiently and provide better customer service.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = Icons[feature.icon]
                return (
                  <div
                    key={feature.name}
                    className="card card-hover animate-fade-in p-6 [animation-delay:600ms]"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{feature.name}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-32 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="glass rounded-2xl">
              <div className="grid gap-8 p-8 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.name}
                    className="animate-fade-in text-center [animation-delay:800ms]"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</div>
                    <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32 px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-16 sm:px-12 sm:py-24">
              <div className="relative">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to get started?</h2>
                  <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
                    Join thousands of companies that use Support Hub to manage their customer support efficiently.
                  </p>
                </div>
                <div className="mt-8 flex justify-center gap-4">
                  <Link
                    to="/register"
                    className="rounded-xl bg-white px-8 py-3 text-base font-medium text-primary-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-xl bg-primary-700 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-primary-800 hover:shadow-xl"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

const features = [
  {
    name: "Real-time Updates",
    description: "Get instant notifications and updates on ticket status changes and new responses.",
    icon: "Zap",
  },
  {
    name: "Role-based Access",
    description: "Manage permissions and access levels for different team members efficiently.",
    icon: "Shield",
  },
  {
    name: "Team Collaboration",
    description: "Work together seamlessly with built-in collaboration tools and features.",
    icon: "Users",
  },
  {
    name: "Analytics & Reports",
    description: "Track performance metrics and generate detailed reports for better insights.",
    icon: "BarChart3",
  },
  {
    name: "Global Support",
    description: "Provide support to customers from anywhere in the world, 24/7.",
    icon: "Globe2",
  },
  {
    name: "Smart Automation",
    description: "Automate routine tasks and improve response times with AI-powered features.",
    icon: "Sparkles",
  },
  {
    name: "Quick Response",
    description: "Respond to tickets quickly with templated responses and shortcuts.",
    icon: "MessageSquare",
  },
  {
    name: "SLA Management",
    description: "Track and maintain service level agreements with built-in tools.",
    icon: "Clock",
  },
  {
    name: "Issue Tracking",
    description: "Track and resolve issues efficiently with our powerful ticketing system.",
    icon: "CheckCircle",
  },
]

const stats = [
  {
    name: "Active Users",
    value: "10K+",
  },
  {
    name: "Tickets Resolved",
    value: "1M+",
  },
  {
    name: "Response Rate",
    value: "99.9%",
  },
  {
    name: "Customer Satisfaction",
    value: "4.9/5",
  },
]

export default HomePage

