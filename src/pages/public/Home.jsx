import SEO from '../../components/ui/SEO'
import Hero from '../../components/home/Hero'
import SkillsMarquee from '../../components/home/SkillsMarquee'
import ExperienceSection from '../../components/home/ExperienceSection'
import HackathonsSection from '../../components/home/HackathonsSection'
import ExpertiseSection from '../../components/home/ExpertiseSection'
import ProcessSection from '../../components/home/ProcessSection'
import CTASection from '../../components/home/CTASection'
import { store } from '../../data/store'

// Read from store (localStorage overrides JS defaults)
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
                <Hero profile={profileData} />
                <SkillsMarquee skills={skillsData} />
                <ExperienceSection experience={experienceData} />
                <HackathonsSection events={eventsData} />
                <ExpertiseSection />
                <SkillsMarquee skills={skillsData} />
                <ProcessSection />
                <CTASection profile={profileData} />
            </main>
        </>
    )
}
