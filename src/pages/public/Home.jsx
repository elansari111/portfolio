import SEO from '../../components/ui/SEO'
import Hero from '../../components/home/Hero'
import SkillsMarquee from '../../components/home/SkillsMarquee'
import ExperienceSection from '../../components/home/ExperienceSection'
import HackathonsSection from '../../components/home/HackathonsSection'
import ExpertiseSection from '../../components/home/ExpertiseSection'
import CTASection from '../../components/home/CTASection'
import { store } from '../../data/store'

const profileData  = store.getProfile()
const experienceData = store.getExperience()
const skillsData   = store.getSkills()
const eventsData   = store.getEvents()

export default function Home() {
    return (
        <>
            <SEO
                title={null}
                description={`Portfolio of ${profileData.name} — ${(profileData.roles || []).join(' & ')}. ${profileData.shortBio}`}
                url="/"
            />
            <main>
                <div className="pt-32 pb-8 max-w-7xl mx-auto px-4 sm:px-6">
                    <Hero profile={profileData} />
                </div>
                <SkillsMarquee skills={skillsData} />
                <ExpertiseSection />
                <ExperienceSection experience={experienceData} />
                <HackathonsSection events={eventsData} />
                <CTASection profile={profileData} />
            </main>
        </>
    )
}
