import React from 'react';
import { useTranslation } from 'react-i18next';
import { YourCompanySection } from '../components/YourCompanySection';

// Variant A: Masonry Grid Gallery
export const ShowcaseVariantA: React.FC = () => {
  useTranslation(['home']);

  const projects = [1, 2, 3, 4, 5, 6];

  return (
    <YourCompanySection id="showcase" background="gradient" height="auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          Recent Solar Installations
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See our work across Dublin & Leinster
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map((project, idx) => (
          <div
            key={project}
            className={`group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
              idx % 3 === 0 ? 'md:row-span-2' : ''
            }`}
          >
            {/* Image Placeholder */}
            <div
              className={`bg-gradient-to-br ${
                idx % 3 === 0
                  ? 'from-primary-400 to-primary-600 aspect-[3/4]'
                  : 'from-secondary-400 to-secondary-600 aspect-[4/3]'
              } flex items-center justify-center`}
            >
              <div className="text-center p-6">
                <svg className="w-16 h-16 mx-auto mb-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white/80 font-medium">Project Photo {project}</p>
              </div>
            </div>

            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Dublin Residential Install</h3>
                <p className="text-sm text-white/90 mb-3">6.5kW System • 16 Panels • 2024</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Dublin 4
                  </span>
                  <span>€8,450</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold">
          View All Projects
        </button>
      </div>
    </YourCompanySection>
  );
};

// Variant B: Featured Projects with Large Cards
export const ShowcaseVariantB: React.FC = () => {
  useTranslation(['home']);

  return (
    <YourCompanySection id="showcase" background="gradient" height="auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          Featured Projects
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transforming homes across Ireland
        </p>
      </div>

      {/* Featured Project Cards */}
      <div className="space-y-12">
        {[1, 2].map((project) => (
          <div key={project} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                <div className="text-center p-8">
                  <svg className="w-24 h-24 mx-auto mb-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-white/90 font-semibold text-xl">Add Project Photo Here</p>
                  <p className="text-white/70 text-sm mt-2">1200x900px recommended</p>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Residential
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 font-display">
                  Modern Family Home in Dublin
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  A complete 7.2kW solar installation featuring 18 premium panels, battery storage, and smart monitoring. This family now saves over 85% on their electricity bills.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-700">7.2kW</div>
                    <div className="text-xs text-gray-600">System Size</div>
                  </div>
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-700">18</div>
                    <div className="text-xs text-gray-600">Panels</div>
                  </div>
                  <div className="text-center p-4 bg-accent-50 rounded-lg">
                    <div className="text-2xl font-bold text-accent-700">85%</div>
                    <div className="text-xs text-gray-600">Savings</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Dublin 15 • Installed March 2024</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="px-8 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-semibold">
          Explore More Projects
        </button>
      </div>
    </YourCompanySection>
  );
};

// Variant C: Before/After Slider Style
export const ShowcaseVariantC: React.FC = () => {
  useTranslation(['home']);

  return (
    <YourCompanySection id="showcase" background="gradient" height="auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
          See The Transformation
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Real homes, real results
        </p>
      </div>

      {/* Before/After Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {[1, 2, 3, 4].map((project) => (
          <div key={project} className="bg-white rounded-xl shadow-lg overflow-hidden group">
            {/* Before/After Split */}
            <div className="relative aspect-[4/3]">
              {/* Before (left half) */}
              <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center border-r-2 border-white">
                <div className="text-center p-4">
                  <p className="text-white/90 font-semibold mb-2">BEFORE</p>
                  <svg className="w-12 h-12 mx-auto text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              {/* After (right half) */}
              <div className="absolute inset-0 left-1/2 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-white/90 font-semibold mb-2">AFTER</p>
                  <svg className="w-12 h-12 mx-auto text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Residential Installation
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Kildare
                </span>
                <span className="font-semibold text-primary-600">5.5kW System</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="px-8 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-semibold">
          View Full Gallery
        </button>
      </div>
    </YourCompanySection>
  );
};

