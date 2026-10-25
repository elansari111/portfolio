import { useState } from 'react'
import Folder from '../../components/ui/Folder'
import { Sparkles, Briefcase, GraduationCap, FolderOpen, Calendar, MapPin } from 'lucide-react'

const WORK_EXPERIENCE_ITEMS = [
  {
    title: 'Senior Frontend Dev',
    description: 'Tech Solutions Inc. • 2022 - Present. Leading React architecture, design systems, and frontend team.'
  },
  {
    title: 'Full Stack Developer',
    description: 'Creative Agency • 2020 - 2022. MERN stack web apps, animations, and microservices for global clients.'
  },
  {
    title: 'Frontend Intern',
    description: 'Tech Agency • 2019 - 2020. Developed responsive interfaces, UI component libraries and optimized speed.'
  }
]

const EDUCATION_ITEMS = [
  {
    title: 'B.S. Computer Science',
    description: 'University of Technology • 2016 - 2020. Software Engineering, Data Structures & Algorithms, Distributed Systems.'
  },
  {
    title: 'Full-Stack Bootcamp',
    description: 'Advanced Web Dev Certification • 2020. Modern React, Node.js, Cloud Architectures & DevOps.'
  },
  {
    title: 'AWS Certified Developer',
    description: 'Amazon Web Services • 2022. Cloud deployment, serverless computing, S3, Lambda & DynamoDB.'
  }
]

const KEY_ACHIEVEMENTS_ITEMS = [
  {
    title: '1st Place Hackathon',
    description: 'National Dev Challenge 2023. Built an AI-driven collaborative real-time document workspace in 48h.'
  },
  {
    title: 'Open Source Contributor',
    description: 'Maintained and contributed to prominent React & Vite community plugins with 50k+ monthly downloads.'
  },
  {
    title: '99.9% Uptime Migration',
    description: 'Orchestrated zero-downtime microservices migration serving over 200,000 active monthly users.'
  }
]

export default function Experience() {
  const [activeItem, setActiveItem] = useState(null)

  return (
    <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles size={14} />
          Interactive Portfolio
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
          Experience & <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Milestones</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Click any folder to interact, open its documents, and drag or inspect items in real-time 3D space.
        </p>
      </div>

      {/* 3D Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 w-full justify-items-center mb-16">
        {/* Folder 1: Work Experience */}
        <div className="flex flex-col items-center bg-gray-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md w-full max-w-sm hover:border-blue-500/30 transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-6 text-blue-400 font-semibold text-lg">
            <Briefcase size={20} />
            <span>Work Experience</span>
          </div>
          <div className="py-6 flex items-center justify-center">
            <Folder
              label="Career"
              items={WORK_EXPERIENCE_ITEMS}
              mode="flap"
              variant="solid"
              layout="spread"
              color="#3d8bff"
              paperColor="#ffffff"
              tabPosition="right"
              openOn="click"
              size={1.15}
              frost={0.25}
              tilt={0.5}
              speed={1}
              bounce={0.4}
              peek
              intro
              draggable
              zoomOnClick
              theme="dark"
              onItemClick={(item) => setActiveItem(item)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
            <FolderOpen size={14} /> Click folder or drag items
          </p>
        </div>

        {/* Folder 2: Education & Certifications */}
        <div className="flex flex-col items-center bg-gray-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md w-full max-w-sm hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-6 text-purple-400 font-semibold text-lg">
            <GraduationCap size={20} />
            <span>Education & Degrees</span>
          </div>
          <div className="py-6 flex items-center justify-center">
            <Folder
              label="Studies"
              items={EDUCATION_ITEMS}
              mode="book"
              variant="glass"
              layout="spread"
              color="#8b5cf6"
              paperColor="#ffffff"
              tabPosition="center"
              openOn="click"
              size={1.15}
              frost={0.25}
              tilt={0.5}
              speed={1}
              bounce={0.4}
              peek
              intro
              draggable
              zoomOnClick
              theme="dark"
              onItemClick={(item) => setActiveItem(item)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
            <FolderOpen size={14} /> Book mode with glass front
          </p>
        </div>

        {/* Folder 3: Milestones & Achievements */}
        <div className="flex flex-col items-center bg-gray-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md w-full max-w-sm hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-6 text-emerald-400 font-semibold text-lg">
            <Sparkles size={20} />
            <span>Achievements</span>
          </div>
          <div className="py-6 flex items-center justify-center">
            <Folder
              label="Awards"
              items={KEY_ACHIEVEMENTS_ITEMS}
              mode="flap"
              variant="solid"
              layout="spread"
              color="#10b981"
              paperColor="#ffffff"
              tabPosition="left"
              openOn="click"
              size={1.15}
              frost={0.25}
              tilt={0.5}
              speed={1}
              bounce={0.4}
              peek
              intro
              draggable
              zoomOnClick
              theme="dark"
              onItemClick={(item) => setActiveItem(item)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
            <FolderOpen size={14} /> Interactive milestones deck
          </p>
        </div>
      </div>

      {/* Selected Item Detail Modal / Banner */}
      {activeItem && (
        <div className="w-full max-w-2xl bg-gradient-to-r from-blue-950/60 via-purple-950/60 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">Selected Item</span>
            <h3 className="text-xl font-bold text-white mt-1">{activeItem.title}</h3>
            <p className="text-gray-300 text-sm mt-1">{activeItem.description}</p>
          </div>
          <button
            onClick={() => setActiveItem(null)}
            className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Summary Timeline */}
      <div className="w-full max-w-4xl mt-16 bg-gray-950/40 border border-gray-800/80 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Briefcase className="text-primary" size={24} />
          Detailed Career Timeline
        </h3>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800/60 pb-5 gap-2">
            <div>
              <h4 className="text-lg font-bold text-white">Senior Frontend Developer</h4>
              <p className="text-gray-400 text-sm">Tech Solutions Inc. • Led frontend engineering and architectural migration</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full w-fit">
              <Calendar size={13} /> 2022 - Present
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800/60 pb-5 gap-2">
            <div>
              <h4 className="text-lg font-bold text-white">Full Stack Developer</h4>
              <p className="text-gray-400 text-sm">Creative Agency • Built scalable web applications with MERN stack & Framer Motion</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full w-fit">
              <Calendar size={13} /> 2020 - 2022
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h4 className="text-lg font-bold text-white">Bachelor of Science in Computer Science</h4>
              <p className="text-gray-400 text-sm">University of Technology • Focus on Software Engineering & Distributed Systems</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
              <Calendar size={13} /> 2016 - 2020
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
