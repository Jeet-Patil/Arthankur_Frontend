import React, { useState } from 'react';
import { X } from 'lucide-react';

const SuccessStories = () => {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'startup', or 'investor'

  const stories = [
    {
      id: 1,
      type: 'startup',
      companyName: 'TechGrow Solutions',
      founderName: 'Priya Sharma',
      fundingAmount: '₹2.5 Crore',
      description: 'TechGrow Solutions secured Series A funding through Arthankur, enabling them to expand their AI-powered agriculture solutions across India.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3',
      result: '3x growth in 12 months'
    },
    {
      id: 2,
      type: 'investor',
      investorName: 'Rajesh Kumar',
      firm: 'Future Ventures',
      investmentCount: '5 startups',
      description: 'Successfully invested in 5 promising startups through Arthankur, with 2 achieving successful exits and 3 showing strong growth trajectories.',
      image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3',
      returns: '45% average ROI'
    },
    {
      id: 3,
      type: 'startup',
      companyName: 'HealthTech Innovations',
      founderName: 'Dr. Amit Patel',
      fundingAmount: '₹5 Crore',
      description: 'Revolutionizing healthcare with AI-driven diagnostics, secured major funding through Arthankur to expand across 5 states.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3',
      result: 'Serving 100,000+ patients'
    },
    {
      id: 4,
      type: 'investor',
      investorName: 'Sarah Williams',
      firm: 'Green Earth Capital',
      investmentCount: '3 startups',
      description: 'Focused on sustainable technology investments, found perfect matches through Arthankur\'s curated startup selection.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3',
      returns: '30% portfolio growth'
    },
    {
      id: 5,
      type: 'startup',
      companyName: 'EcoWaste Solutions',
      founderName: 'Rahul Verma',
      fundingAmount: '₹3.2 Crore',
      description: 'Transforming waste management with IoT-enabled smart bins, secured seed funding through Arthankur.',
      image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?ixlib=rb-4.0.3',
      result: '200+ smart bins deployed'
    },
    {
      id: 6,
      type: 'investor',
      investorName: 'Meera Patel',
      firm: 'Innovate Capital',
      investmentCount: '7 startups',
      description: 'Specializing in cleantech investments, found promising opportunities through Arthankur\'s sector-focused approach.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3',
      returns: '52% portfolio growth'
    },
    {
      id: 7,
      type: 'startup',
      companyName: 'EdTech Pioneers',
      founderName: 'Ankit Shah',
      fundingAmount: '₹4.8 Crore',
      description: 'Revolutionizing K-12 education with AR/VR technology, secured Series A funding through Arthankur platform.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3',
      result: '500k+ student users'
    },
    {
      id: 8,
      type: 'investor',
      investorName: 'David Chen',
      firm: 'Global Ventures',
      investmentCount: '4 startups',
      description: 'International investor who found perfect investment matches in Indian startups through Arthankur.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3',
      returns: '38% average ROI'
    }
  ];

  const filteredStories = filter === 'all' 
    ? stories 
    : stories.filter(story => story.type === filter);

  const StoryCard = ({ story }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img
          src={story.image}
          alt={story.type === 'startup' ? story.companyName : story.investorName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        {story.type === 'startup' ? (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {story.companyName}
            </h3>
            <p className="text-violet-600 font-medium mb-2">
              Founded by {story.founderName}
            </p>
            <p className="text-gray-600 mb-4">{story.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-600 font-medium">
                Raised: {story.fundingAmount}
              </span>
              <span className="text-violet-600 font-medium">
                {story.result}
              </span>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {story.investorName}
            </h3>
            <p className="text-violet-600 font-medium mb-2">
              {story.firm}
            </p>
            <p className="text-gray-600 mb-4">{story.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-600 font-medium">
                Invested in: {story.investmentCount}
              </span>
              <span className="text-violet-600 font-medium">
                {story.returns}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600">
            Discover how Arthankur is transforming startup funding and investment journeys
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stories.slice(0, 4).map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-violet-600 text-white px-8 py-3 rounded-lg hover:bg-violet-700 transition-colors duration-300"
          >
            View More Success Stories
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-bold text-gray-900">Success Stories</h3>
              <div className="flex items-center space-x-4">
                <div className="flex rounded-lg overflow-hidden border border-violet-200">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm ${
                      filter === 'all' 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-violet-50'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('startup')}
                    className={`px-4 py-2 text-sm ${
                      filter === 'startup' 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-violet-50'
                    }`}
                  >
                    Startups
                  </button>
                  <button
                    onClick={() => setFilter('investor')}
                    className={`px-4 py-2 text-sm ${
                      filter === 'investor' 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-violet-50'
                    }`}
                  >
                    Investors
                  </button>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SuccessStories; 