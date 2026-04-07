import { useState } from 'react';
import { BookOpen, GraduationCap, Users, Calendar, Globe, Search, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

export default function EducationalCloak() {
  const [activeTab, setActiveTab] = useState('Home');

  const renderContent = () => {
    switch (activeTab) {
      case 'Admissions':
        return (
          <div className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-[#003366] mb-8">Admissions Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Eligibility Criteria</h3>
                <ul className="space-y-4 text-slate-600">
                  <li className="flex gap-3 italic">
                    <ChevronRight className="w-5 h-5 text-blue-600 shrink-0" />
                    Profoundly gifted students scoring in the 99.9th percentile.
                  </li>
                  <li className="flex gap-3 italic">
                    <ChevronRight className="w-5 h-5 text-blue-600 shrink-0" />
                    Demonstrated advanced ability in core academic subjects.
                  </li>
                  <li className="flex gap-3 italic">
                    <ChevronRight className="w-5 h-5 text-blue-600 shrink-0" />
                    Ages 9 to 18 (Grades 5-12).
                  </li>
                </ul>
              </div>
              <div className="bg-[#003366] text-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Apply Now</h3>
                <p className="mb-6 text-blue-100 italic">Applications for the 2026-2027 academic year are now open.</p>
                <button className="w-full bg-white text-[#003366] py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                  Start Application
                </button>
              </div>
            </div>
          </div>
        );
      case 'Academics':
        return (
          <div className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-[#003366] mb-8">Curriculum & Academics</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-bold mb-2">Ability-Based Grouping</h3>
                <p className="text-slate-600 italic">Students are placed in courses based on their current level of mastery, not their age or grade level.</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-bold mb-2">Advanced Research</h3>
                <p className="text-slate-600 italic">Upper-level students engage in university-level research projects and interdisciplinary studies.</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-bold mb-2">STEM Excellence</h3>
                <p className="text-slate-600 italic">Rigorous mathematics and science tracks designed for high-level thinkers.</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="bg-slate-50 py-16 px-4 sm:px-8 border-b border-slate-200 animate-in fade-in duration-700">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-[#003366] mb-6 leading-tight">
                  Nurturing the Potential of Profoundly Gifted Students
                </h2>
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 italic">
                  The Davidson Academy is a public school designed specifically for profoundly gifted students. 
                  We offer an accelerated, highly personalized curriculum aimed at students who perform far beyond standard grade-level expectations.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button onClick={() => setActiveTab('Admissions')} className="bg-[#003366] text-white px-8 py-3 rounded-md font-sans font-bold hover:bg-blue-800 transition-colors">
                    Request Information
                  </button>
                  <button className="border-2 border-[#003366] text-[#003366] px-8 py-3 rounded-md font-sans font-bold hover:bg-blue-50 transition-colors">
                    Virtual Tour
                  </button>
                </div>
              </div>
            </section>

            {/* Info Grid */}
            <section className="py-20 px-4 sm:px-8">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => setActiveTab('Academics')}>
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#003366] mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Personalized Curriculum</h3>
                  <p className="text-slate-600 leading-relaxed italic">
                    Our curriculum is flexible and ability-based. Students progress not by age, but by demonstrated mastery across all subjects.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#003366] mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Intellectual Community</h3>
                  <p className="text-slate-600 leading-relaxed italic">
                    Students find a peer group of like-minded thinkers, fostering deep inquiry, self-direction, and collaborative research.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#003366] mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Online & On-Campus</h3>
                  <p className="text-slate-600 leading-relaxed italic">
                    Whether in Reno, Nevada or through our Online Academy, we provide a rigorous academic environment for students worldwide.
                  </p>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-serif selection:bg-blue-100">
      {/* Top Bar */}
      <div className="bg-[#003366] text-white py-2 px-4 text-[10px] sm:text-xs font-sans flex justify-between items-center">
        <div className="flex gap-4">
          <span className="hover:text-blue-200 cursor-pointer">Current Students</span>
          <span className="hover:text-blue-200 cursor-pointer">Faculty & Staff</span>
          <span className="hover:text-blue-200 cursor-pointer">Alumni</span>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-3 h-3" />
          <span>Search Portal</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-slate-200 py-6 px-4 sm:px-8 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('Home')}>
            <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center text-white">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#003366]">Davidson Academy</h1>
              <p className="text-xs sm:text-sm text-slate-500 italic">Excellence in Profoundly Gifted Education</p>
            </div>
          </div>
          <nav className="flex gap-4 sm:gap-8 text-[10px] sm:text-sm font-sans font-bold text-[#003366] uppercase tracking-wide">
            {['Admissions', 'Academics', 'Student Life', 'About Us'].map(tab => (
              <span 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`hover:text-blue-600 cursor-pointer transition-colors ${activeTab === tab ? 'border-b-2 border-blue-600' : ''}`}
              >
                {tab}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8">
        {renderContent()}
      </main>

      {/* News Section (Only on Home) */}
      {activeTab === 'Home' && (
        <section className="bg-slate-900 text-white py-20 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Academy News</h2>
                <p className="text-slate-400">Updates from our community</p>
              </div>
              <button className="text-blue-400 font-bold hover:underline">View All News</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white/5 p-6 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-blue-400 text-xs font-bold mb-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Oct {i + 10}, 2025
                  </div>
                  <h4 className="font-bold leading-snug mb-4">
                    Academy Students Win National Science Competition
                  </h4>
                  <p className="text-xs text-slate-400">
                    Our students continue to demonstrate excellence in interdisciplinary research...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#003366] text-white py-12 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-8 h-8" />
              <span className="text-xl font-bold">Davidson Academy</span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed max-w-sm italic">
              The Davidson Academy is a public school for profoundly gifted students, 
              providing a unique learning environment that supports intellectual growth and social-emotional development.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6">Quick Links</h5>
            <ul className="text-sm text-blue-200 space-y-3">
              <li className="hover:text-white cursor-pointer">Admissions Process</li>
              <li className="hover:text-white cursor-pointer">Curriculum Overview</li>
              <li className="hover:text-white cursor-pointer">Financial Aid</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6">Contact Information</h5>
            <div className="text-sm text-blue-200 space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>1164 W. 2nd St.<br />Reno, NV 89503</span>
              </div>
              <div className="flex gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <span>(775) 682-5800</span>
              </div>
              <div className="flex gap-3">
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@davidsonacademy.unr.edu</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
