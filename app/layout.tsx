"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHandPaper, FaHandRock } from "react-icons/fa";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const demos = [
    {
      name: "Experiment 1",
      path: "/experiment-1",
      description: "Hand Tracking and debug",
      icon: FaHandPaper
    },
    {
      name: "Experiment 2",
      path: "/experiment-2",
      description: "Hand Tracking and debug",
      icon: FaHandRock
    },
  ];

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg shadow-lg transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full bg-gray-900 bg-opacity-95 backdrop-blur-sm border-r border-gray-700 transition-transform duration-300 z-40 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } w-80`}
          >
            <div className="p-8 pt-20">
              <h1 className="text-2xl font-bold mb-2">Camera Navigation</h1>
              <p className="text-gray-400 text-sm mb-8">Hand Tracking Demos</p>

              <nav className="space-y-3">
                {demos.map((demo) => {
                  const IconComponent = demo.icon;
                  return (
                    <Link
                      key={demo.path}
                      href={demo.path}
                      className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-all hover:scale-105 hover:shadow-lg border border-gray-700 hover:border-purple-500"
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="text-3xl text-purple-400" />
                        <div>
                          <h3 className="font-semibold text-lg">{demo.name}</h3>
                          <p className="text-gray-400 text-sm">{demo.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main
            className={`transition-all duration-300 ${
              sidebarOpen ? "ml-80" : "ml-0"
            }`}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
