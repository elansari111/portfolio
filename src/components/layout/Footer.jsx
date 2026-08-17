import { Github, Linkedin, Twitter, Instagram } from 'lucide-react'
import { profile } from '../../data/profile'

export default function Footer() {
    const socials = [
        { icon: Github, href: profile.socials.github, label: 'GitHub' },
        { icon: Linkedin, href: profile.socials.linkedin, label: 'LinkedIn' },
        { icon: Twitter, href: profile.socials.twitter, label: 'Twitter' },
        { icon: Instagram, href: profile.socials.instagram, label: 'Instagram' },
    ]

    return (
        <footer className="bg-black border-t border-white/10 py-8">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} {profile.name}. All rights reserved.
                </p>
                <div className="flex items-center gap-5">
                    {socials.map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            className="text-gray-500 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-300"
                        >
                            <s.icon size={20} />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
