"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import CrowdForm from "./Form"

// Content Components
function CreateContent() {
  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-8 px-6 md:px-12">
      <div 
        className="relative bg-cover bg-center bg-no-repeat rounded-3xl p-8 md:p-12 min-h-[calc(100vh-6rem)]"
        style={{
          backgroundImage: 'url(/bg.jpg)',
         }}
      >
        <div className="absolute inset-0 bg-black/30 rounded-3xl" />
        <div className="relative z-10 flex items-center justify-center min-h-full">
          <CrowdForm />
        </div>
      </div>
    </div>
  )
}

function OwnedContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Owned</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600 mb-4">Manage and view all your owned content and projects.</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">Project Alpha</span>
            <span className="text-sm text-gray-500">Last modified 2 days ago</span>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">Project Beta</span>
            <span className="text-sm text-gray-500">Last modified 1 week ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExploreContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600 mb-4">Discover new content and explore what others have created.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Trending</h3>
            <p className="text-sm text-gray-500">Most popular content this week</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Recent</h3>
            <p className="text-sm text-gray-500">Latest additions to explore</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Featured</h3>
            <p className="text-sm text-gray-500">Hand-picked recommendations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConnectContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Connect</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600 mb-4">Connect with others and build your network.</p>
        <div className="space-y-4">
          <div className="p-4 bg-black text-white rounded-lg">
            <h3 className="font-semibold mb-2">Join Community</h3>
            <p className="text-sm opacity-90">Connect with like-minded creators and collaborators</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Find Collaborators</h3>
              <p className="text-sm text-gray-500">Connect with other creators</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Share Your Work</h3>
              <p className="text-sm text-gray-500">Showcase your projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('create')

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateContent />
      case 'owned':
        return <OwnedContent />
      case 'explore':
        return <ExploreContent />
      case 'connect':
        return <ConnectContent />
      default:
        return <CreateContent />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-20 items-center justify-between px-8 md:px-12 py-4">
          {/* Main Navigation - Left Side */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <Button 
              variant="ghost" 
              size="default"
              onClick={() => setActiveTab('create')} 
              className={`hover:bg-gray-100 hover:text-black px-6 py-3 ${activeTab === 'create' ? 'bg-gray-100 text-black' : ''}`}
            >
              Create
            </Button>
            <Button 
              variant="ghost"
              size="default"
              onClick={() => setActiveTab('owned')} 
              className={`hover:bg-gray-100 hover:text-black px-6 py-3 ${activeTab === 'owned' ? 'bg-gray-100 text-black' : ''}`}
            >
              Owned
            </Button>
            <Button 
              variant="ghost"
              size="default"
              onClick={() => setActiveTab('explore')} 
              className={`hover:bg-gray-100 hover:text-black px-6 py-3 ${activeTab === 'explore' ? 'bg-gray-100 text-black' : ''}`}
            >
              Explore
            </Button>
          </div>
            
          {/* Connect Button - Right Side */}
          <Button 
            effect="expandIcon"
            size="default"
            icon={ArrowRight}
            iconPlacement="right"
            onClick={() => setActiveTab('connect')} 
            className={`shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 ${
              activeTab === 'connect' 
                ? 'bg-gray-800 text-white' 
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            Connect
          </Button>
        </div>
      </nav>
      
      {/* Content Area */}
      <main>
        {renderContent()}
      </main>
    </div>
  )
}
