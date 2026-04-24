import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import BlogPage from "./pages/BlogPage/BlogPage";
import BlogPostPage from "./pages/BlogPostPage/BlogPostPage";
import Committee from "./pages/Committee/Committee";
import Contact from "./pages/Contact/Contact";
import AnnualMembership from "./pages/Membership/Annualmembership";
import LifetimeMembership from "./pages/Membership/Lifetimemembership";
import MembershipLanding from "./pages/Membership/MembershipLanding";
import Research from "./pages/Research/Research";
import Collaborations from "./pages/Collaborations/Collaborations";
import JairamJournal from "./pages/JairamJournal/JairamJournal";
import Resources from "./pages/Resources/Resources";
import Media from "./pages/Media/Media";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function AppLayout() {
  return (
    <div className="App">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/research" element={<Research />} />
          <Route path="/collaborations" element={<Collaborations />} />
          <Route path="/jairam-journal" element={<JairamJournal />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/media" element={<Media />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/membership" element={<MembershipLanding />} />
          <Route path="/membership/annual" element={<AnnualMembership />} />
          <Route
            path="/membership/lifetime"
            element={<LifetimeMembership />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
