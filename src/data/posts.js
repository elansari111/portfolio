export const posts = [
    {
        slug: "mastering-react-animations",
        title: "Mastering React Animations with Framer Motion & GSAP",
        excerpt: "Learn how to combine the best of both worlds to create stunning, performant UI effects that feel premium and alive.",
        date: "Aug 15, 2026",
        category: "RESEARCH",
        coverImage: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1200&auto=format&fit=crop",
        authorName: "Yassine El Ansari",
        authorAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=80&auto=format&fit=crop",
        content: `
# Mastering React Animations

Animations are essential for creating a premium feel in modern web applications.

## Framer Motion

Framer Motion is incredible for state-driven animations, page transitions, and layout animations. It integrates perfectly with React's component lifecycle.

\`\`\`jsx
import { motion } from 'framer-motion'

function Card() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Hello world!
    </motion.div>
  )
}
\`\`\`

## GSAP (GreenSock)

For scroll-linked animations and complex timelines, GSAP remains the king. Using ScrollTrigger, you can pin elements, scrub animations, and orchestrate massive sequences.

\`\`\`js
gsap.from('.card', {
  y: 60,
  opacity: 0,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%'
  }
})
\`\`\`

## Combining Both

**Combining both** allows you to leverage Framer Motion for UI micro-interactions and GSAP for heavy scroll experiences. Use Framer Motion for hover states, page transitions, and component-level animations. Reserve GSAP for timeline orchestration and scroll-driven effects.
        `
    },
    {
        slug: "winning-the-global-hackathon",
        title: "How We Won The 2025 Global Hackathon",
        excerpt: "A deep dive into our architecture decisions, the 48-hour sprint, and what we learned building under extreme time pressure.",
        date: "Dec 10, 2025",
        category: "HACKATHON",
        coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
        authorName: "Yassine El Ansari",
        authorAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=80&auto=format&fit=crop",
        content: `
# The 48-Hour Sprint

Participating in a global hackathon is always a challenge. This post outlines our technical decisions and how we managed our time to deliver a winning product.

## The Challenge

We were tasked with building a **sustainable AI solution** that could help reduce carbon emissions in logistics operations. We had 48 hours, a team of 4, and nothing but ambition.

## The Stack

We chose **Vite + React** for the frontend to ensure fast build times, and **Supabase** for the backend to rapidly set up authentication and a database without writing boilerplate API code.

\`\`\`bash
# Our setup in under 5 minutes:
npm create vite@latest . -- --template react
npm install @supabase/supabase-js framer-motion
\`\`\`

## Key Takeaway

Speed matters, but so does architecture. The decisions you make in the first 2 hours set the trajectory for the rest of the sprint. Choose boring, reliable tech that you know deeply.
        `
    },
    {
        slug: "building-micro-frontends",
        title: "Building Scalable Micro-Frontend Architecture",
        excerpt: "How to split large React applications into independently deployable modules without losing the developer experience.",
        date: "Oct 5, 2025",
        category: "ARCHITECTURE",
        coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
        authorName: "Yassine El Ansari",
        authorAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=80&auto=format&fit=crop",
        content: `
# Micro-Frontend Architecture

As applications grow, monolithic frontends become a bottleneck. Micro-frontends solve this by allowing teams to own and deploy independent pieces of the UI.

## Module Federation

Webpack 5's Module Federation allows you to share code across independently built applications at runtime.

\`\`\`js
// webpack.config.js (host app)
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    shop: 'shop@http://localhost:3001/remoteEntry.js',
  },
})
\`\`\`

## When To Use It

Use micro-frontends when you have **multiple teams** working on the same product, or when deployment of one feature should not block another. It's an organizational pattern as much as a technical one.
        `
    },
    {
        slug: "open-source-achievement",
        title: "My First Open Source Package Hit 10k Downloads",
        excerpt: "The story of how a simple utility I wrote for myself ended up being used by developers worldwide.",
        date: "Jul 22, 2025",
        category: "ACHIEVEMENT",
        coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
        authorName: "Yassine El Ansari",
        authorAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=80&auto=format&fit=crop",
        content: `
# 10,000 Downloads 🎉

I never expected a small hook I wrote on a Sunday afternoon to be installed 10,000 times. Here's the story.

## The Problem

I was tired of writing the same \`useLocalStorage\` hook in every project. So I extracted it into a package.

## Publishing on npm

\`\`\`bash
npm publish --access public
\`\`\`

It took under 10 minutes. A month later, I got an email from npm saying my package exceeded the download threshold.

## What I Learned

Ship things, even if they feel small. Someone out there has the same problem you just solved.
        `
    }
];
