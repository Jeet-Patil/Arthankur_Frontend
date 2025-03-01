import React, { useState } from 'react';

const SuccessStories = () => {
  const [showAll, setShowAll] = useState(false);

  const allStories = [
    {
      id: 1,
      companyName: "TechVision AI",
      founderName: "Priya Sharma",
      fundingAmount: "₹2.5 Cr",
      investorName: "Nexus Ventures",
      description: "AI-powered healthcare solutions startup that secured Series A funding within 6 months of joining Arthankur.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      category: "Healthcare Tech",
      yearFunded: 2023,
      location: "Bangalore"
    },
    {
      id: 2,
      companyName: "GreenEnergy Solutions",
      founderName: "Rahul Verma",
      fundingAmount: "₹1.8 Cr",
      investorName: "Clean Energy Fund",
      description: "Renewable energy startup that revolutionized solar panel efficiency by 40% using nanotechnology.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      category: "Clean Tech",
      yearFunded: 2023,
      location: "Chennai"
    },
    {
      id: 3,
      companyName: "EduTech Plus",
      founderName: "Anita Desai",
      fundingAmount: "₹3.2 Cr",
      investorName: "Education First Capital",
      description: "EdTech platform reaching 1M+ students with AI-personalized learning paths across India.",
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800",
      category: "Education",
      yearFunded: 2023,
      location: "Mumbai"
    },
    {
      id: 4,
      companyName: "FinNext",
      founderName: "Arjun Kapoor",
      fundingAmount: "₹4.5 Cr",
      investorName: "Sequoia India",
      description: "Revolutionizing SME lending with blockchain and AI, serving 10,000+ businesses.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
      category: "FinTech",
      yearFunded: 2023,
      location: "Hyderabad"
    },
    {
      id: 5,
      companyName: "FoodTech Express",
      founderName: "Meera Patel",
      fundingAmount: "₹1.2 Cr",
      investorName: "Food & Agri Fund",
      description: "Farm-to-table platform connecting 50,000+ farmers directly to urban consumers.",
      image: "https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=800",
      category: "AgriTech",
      yearFunded: 2023,
      location: "Pune"
    },
    {
      id: 6,
      companyName: "DroneMap India",
      founderName: "Vikram Singh",
      fundingAmount: "₹2.8 Cr",
      investorName: "Tech Ventures",
      description: "Precision agriculture drone solutions improving crop yields by 30% for farmers.",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800",
      category: "Drone Tech",
      yearFunded: 2023,
      location: "Delhi"
    },
    {
      id: 7,
      companyName: "EcoPackage",
      founderName: "Riya Reddy",
      fundingAmount: "₹1.5 Cr",
      investorName: "Green Future Fund",
      description: "Biodegradable packaging startup eliminating 1000+ tons of plastic waste monthly.",
      image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800",
      category: "Sustainability",
      yearFunded: 2023,
      location: "Ahmedabad"
    },
    {
      id: 8,
      companyName: "HealthAI Labs",
      founderName: "Dr. Sanjay Kumar",
      fundingAmount: "₹5.0 Cr",
      investorName: "Healthcare Capital",
      description: "AI diagnostics platform achieving 99% accuracy in early disease detection.",
      image: "https://images.unsplash.com/photo-1581093458791-4b41ce2c3d37?w=800",
      category: "Healthcare",
      yearFunded: 2023,
      location: "Bangalore"
    },
    {
      id: 9,
      companyName: "Urban Mobility",
      founderName: "Karan Shah",
      fundingAmount: "₹3.5 Cr",
      investorName: "Mobility Ventures",
      description: "Electric scooter sharing platform with 5000+ vehicles across 10 cities.",
      image: "https://images.unsplash.com/photo-1556998832-48adef7a3915?w=800",
      category: "Electric Vehicles",
      yearFunded: 2023,
      location: "Mumbai"
    },
    {
      id: 10,
      companyName: "CyberShield",
      founderName: "Neha Gupta",
      fundingAmount: "₹4.2 Cr",
      investorName: "Cyber Security Fund",
      description: "AI-powered cybersecurity solution protecting 1000+ enterprises from advanced threats.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
      category: "Cybersecurity",
      yearFunded: 2023,
      location: "Pune"
    },
    {
      id: 11,
      companyName: "RoboLogistics",
      founderName: "Arun Kumar",
      fundingAmount: "₹6.0 Cr",
      investorName: "Future Tech Fund",
      description: "Warehouse automation robots reducing operational costs by 60% for e-commerce.",
      image: "https://images.unsplash.com/photo-1584907797015-7554cd315667?w=800",
      category: "Robotics",
      yearFunded: 2023,
      location: "Chennai"
    },
    {
      id: 12,
      companyName: "MetaVerse India",
      founderName: "Zara Khan",
      fundingAmount: "₹7.5 Cr",
      investorName: "Digital Ventures",
      description: "Virtual reality education platform used by 500+ institutions nationwide.",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800",
      category: "VR/AR",
      yearFunded: 2023,
      location: "Hyderabad"
    }
  ];

  const displayedStories = showAll ? allStories : allStories.slice(0, 3);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600">
            Discover how startups and investors are achieving their goals with Arthankur
          </p>
          
          {/* Updated Success Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-violet-600">₹42Cr+</div>
              <div className="text-sm text-gray-600">Total Funding Raised</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-violet-600">75+</div>
              <div className="text-sm text-gray-600">Successful Startups</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-violet-600">150+</div>
              <div className="text-sm text-gray-600">Active Investors</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-violet-600">92%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedStories.map((story) => (
            <div 
              key={story.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.companyName} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {story.companyName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-violet-600 font-medium">
                        {story.category}
                      </p>
                      <span className="text-sm text-gray-500">• {story.location}</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {story.fundingAmount}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  {story.description}
                </p>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {story.founderName}
                      </p>
                      <p className="text-sm text-gray-500">Founder</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {story.investorName}
                      </p>
                      <p className="text-sm text-gray-500">Investor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700"
          >
            {showAll ? 'Show Less' : 'View All Success Stories'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories; 