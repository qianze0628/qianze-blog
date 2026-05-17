import { Routes, Route } from 'react-router-dom'
import useVisit from './hooks/useVisit'
import Home from './views/Home'
import Blog from './views/Blog'
import BlogPost from './views/BlogPost'
import Notes from './views/Notes'
import Space from './views/Space'
import Admin from './views/Admin'

export default function App() {
  useVisit()
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/space" element={<Space />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
