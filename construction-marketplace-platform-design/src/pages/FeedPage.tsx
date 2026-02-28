import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Share2, MessageCircle, Filter, Clock, DollarSign } from 'lucide-react';
import { feedProjects, categories } from '../data/mockData';

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());

  const filtered = activeCategory === 'All' ? feedProjects : feedProjects.filter(p => p.category === activeCategory);

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSavedPosts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Feed</h1>
              <p className="text-gray-500 mt-1">Explore completed projects from verified companies</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Filter by category</span>
            </div>
          </div>
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(project => (
            <div key={project.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={project.images[0]} alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-gray-700">{project.category}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg">{project.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <DollarSign size={14} className="text-green-500" /> {project.costRange}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-4">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{project.timeline}</span>
                </div>

                {/* Materials */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.materials.map(m => (
                    <span key={m} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs">{m}</span>
                  ))}
                </div>

                {/* Company */}
                <Link to={`/company/${project.companyId}`}
                  className="flex items-center gap-2 mb-4 hover:bg-gray-50 rounded-lg p-1.5 -ml-1.5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                    {project.company[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{project.company}</span>
                </Link>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(project.id)} className="flex items-center gap-1 group/btn">
                      <Heart size={18} className={`transition-colors ${likedPosts.has(project.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/btn:text-red-400'}`} />
                      <span className="text-sm text-gray-500">{project.likes + (likedPosts.has(project.id) ? 1 : 0)}</span>
                    </button>
                    <button onClick={() => toggleSave(project.id)} className="flex items-center gap-1 group/btn">
                      <Bookmark size={18} className={`transition-colors ${savedPosts.has(project.id) ? 'fill-primary-500 text-primary-500' : 'text-gray-400 group-hover/btn:text-primary-400'}`} />
                      <span className="text-sm text-gray-500">{project.saves + (savedPosts.has(project.id) ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-1 group/btn">
                      <MessageCircle size={18} className="text-gray-400 group-hover/btn:text-primary-400 transition-colors" />
                    </button>
                  </div>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
