import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Summary from './pages/Summary'
import Projects from './pages/Projects'
import Articles from './pages/Articles'
import ProjectView from './components/ProjectView'
import ArticleView from './components/ArticleView'
import './App.css'

function App() {
  return (
    <Router basename="/Portfolio">
      <Layout>
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/*" element={<ProjectView />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/*" element={<ArticleView />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
