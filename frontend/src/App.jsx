import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Research from './pages/Research';
import Papers from './pages/Papers';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';  // ✅ NEW
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminResearch from './pages/AdminResearch';
import AdminPapers from './pages/AdminPapers';
import ResearchDetail from './pages/ResearchDetail';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/research" element={<Research />} />
            <Route path="/papers" element={<Papers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/research/:id" element={<ResearchDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />  {/* ✅ Dashboard */}
            <Route path="/admin/blogs" element={<Admin />} />     {/* ✅ Changed path */}
            <Route path="/admin/research" element={<AdminResearch />} />
            <Route path="/admin/papers" element={<AdminPapers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;