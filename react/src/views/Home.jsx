import Header from '../components/Header'
import Hero from '../components/Hero'
import Skills from '../components/Skills'
import HomeBlog from '../components/HomeBlog'
import Projects from '../components/Projects'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Skills />
        <HomeBlog />
        <Projects />
      </main>
      <Footer />
    </>
  )
}
