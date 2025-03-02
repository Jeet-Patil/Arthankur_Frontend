import React, { useState } from 'react';
import CaseStudyCard from './CaseStudyCard';
import Navbar from '../Navbar';

// Sample case study data - In a real app, this would come from an API
const caseStudiesData = [
  // Technology Domain
  {
    id: 1,
    title: "Tech Startup Growth Analysis",
    domain: "Technology",
    description: "How a tech startup scaled from 0 to 1M users in 18 months",
    challenge: "Rapid scaling while maintaining service quality",
    solution: "Implemented microservices architecture and automated scaling",
    results: ["1M+ active users", "99.9% uptime", "50% reduction in operational costs"],
    tags: ["Technology", "Scaling", "Cloud Infrastructure"],
    imageUrl: "https://example.com/tech-case-study.jpg",
    roadmap: [
      {
        phase: "Foundation Setup",
        description: "Built initial MVP and established core team",
        duration: "3 months"
      },
      {
        phase: "Architecture Redesign",
        description: "Transitioned to microservices architecture for scalability",
        duration: "4 months"
      },
      {
        phase: "Market Expansion",
        description: "Launched marketing campaigns and user acquisition strategy",
        duration: "6 months"
      },
      {
        phase: "Infrastructure Scaling",
        description: "Implemented auto-scaling and performance optimizations",
        duration: "3 months"
      },
      {
        phase: "Global Launch",
        description: "Expanded to international markets with localized features",
        duration: "2 months"
      }
    ]
  },
  {
    id: 2,
    title: "AI-Powered Customer Service Platform",
    domain: "Technology",
    description: "Revolutionizing customer support with AI chatbots",
    challenge: "High volume of repetitive customer queries causing delays",
    solution: "Developed ML-based chatbot with natural language processing",
    results: ["70% reduction in response time", "90% customer satisfaction", "45% cost savings"],
    tags: ["AI", "Customer Service", "Machine Learning"],
    imageUrl: "https://example.com/ai-case-study.jpg",
    roadmap: [
      {
        phase: "Data Collection",
        description: "Gathered and analyzed historical customer service data",
        duration: "2 months"
      },
      {
        phase: "AI Model Development",
        description: "Built and trained NLP models for query understanding",
        duration: "4 months"
      },
      {
        phase: "Integration Phase",
        description: "Integrated AI system with existing customer service platform",
        duration: "3 months"
      },
      {
        phase: "Beta Testing",
        description: "Conducted pilot program with select customer segments",
        duration: "2 months"
      },
      {
        phase: "Full Deployment",
        description: "Rolled out to all customers with continuous learning",
        duration: "1 month"
      }
    ]
  },
  {
    id: 3,
    title: "Cloud Migration Success Story",
    domain: "Technology",
    description: "Enterprise-scale cloud migration for legacy systems",
    challenge: "Complex legacy infrastructure with minimal downtime requirements",
    solution: "Phased migration approach with containerization",
    results: ["Zero downtime during migration", "40% infrastructure cost reduction", "3x faster deployment"],
    tags: ["Cloud", "Migration", "DevOps"],
    imageUrl: "https://example.com/cloud-case-study.jpg",
    roadmap: [
      {
        phase: "Assessment & Planning",
        description: "Analyzed existing infrastructure and created migration strategy",
        duration: "2 months"
      },
      {
        phase: "Containerization",
        description: "Converted applications to container-based architecture",
        duration: "4 months"
      },
      {
        phase: "Test Environment Setup",
        description: "Created cloud test environment and conducted initial migrations",
        duration: "2 months"
      },
      {
        phase: "Gradual Migration",
        description: "Migrated applications in phases with parallel running",
        duration: "6 months"
      },
      {
        phase: "Optimization",
        description: "Fine-tuned cloud resources and implemented cost optimization",
        duration: "2 months"
      }
    ]
  },
  {
    id: 4,
    title: "Mobile App Innovation",
    domain: "Technology",
    description: "Creating a revolutionary mobile payment solution",
    challenge: "Complex regulatory requirements and security concerns",
    solution: "Blockchain-based secure transaction system",
    results: ["5M+ downloads", "Zero security breaches", "4.8/5 app rating"],
    tags: ["Mobile", "Fintech", "Security"],
    imageUrl: "https://example.com/mobile-case-study.jpg",
    roadmap: [
      {
        phase: "Market Research",
        description: "Conducted user research and competitor analysis",
        duration: "2 months"
      },
      {
        phase: "Security Architecture",
        description: "Designed blockchain-based security framework",
        duration: "3 months"
      },
      {
        phase: "Regulatory Compliance",
        description: "Obtained necessary financial licenses and certifications",
        duration: "4 months"
      },
      {
        phase: "MVP Development",
        description: "Built and tested core payment features",
        duration: "3 months"
      },
      {
        phase: "Market Launch",
        description: "Phased launch with marketing campaign",
        duration: "2 months"
      }
    ]
  },
  {
    id: 5,
    title: "IoT Smart City Implementation",
    domain: "Technology",
    description: "Smart city infrastructure development using IoT",
    challenge: "Integration of multiple city services and data sources",
    solution: "Centralized IoT platform with real-time analytics",
    results: ["30% energy savings", "50% better traffic management", "Real-time city monitoring"],
    tags: ["IoT", "Smart City", "Analytics"],
    imageUrl: "https://example.com/iot-case-study.jpg",
    roadmap: [
      {
        phase: "Infrastructure Planning",
        description: "Mapped city infrastructure and identified IoT touchpoints",
        duration: "3 months"
      },
      {
        phase: "Sensor Deployment",
        description: "Installed IoT sensors across key city locations",
        duration: "6 months"
      },
      {
        phase: "Platform Development",
        description: "Built centralized monitoring and analytics platform",
        duration: "4 months"
      },
      {
        phase: "Integration",
        description: "Connected all city services to central platform",
        duration: "3 months"
      },
      {
        phase: "Public Launch",
        description: "Rolled out citizen-facing applications and dashboards",
        duration: "2 months"
      }
    ]
  },
  {
    id: 6,
    title: "Sustainable Fashion Brand Launch",
    domain: "Retail",
    description: "Launching an eco-friendly fashion brand in a competitive market",
    challenge: "Breaking into saturated market with sustainable practices",
    solution: "Direct-to-consumer model with transparent supply chain",
    results: ["200K+ customers in first year", "85% positive reviews", "30% market share in eco-fashion"],
    tags: ["Retail", "Sustainability", "D2C"],
    imageUrl: "https://example.com/fashion-case-study.jpg",
    roadmap: [
      {
        phase: "Supply Chain Setup",
        description: "Established partnerships with sustainable suppliers",
        duration: "4 months"
      },
      {
        phase: "Product Development",
        description: "Designed and tested initial product line",
        duration: "3 months"
      },
      {
        phase: "E-commerce Platform",
        description: "Built D2C website with supply chain transparency",
        duration: "2 months"
      },
      {
        phase: "Marketing Strategy",
        description: "Launched sustainability-focused marketing campaign",
        duration: "3 months"
      },
      {
        phase: "Scale Operations",
        description: "Expanded product line and distribution",
        duration: "6 months"
      }
    ]
  },
  {
    id: 7,
    title: "Omnichannel Retail Transformation",
    domain: "Retail",
    description: "Traditional retailer's digital transformation journey",
    challenge: "Integrating online and offline retail experiences",
    solution: "Unified commerce platform with real-time inventory",
    results: ["60% increase in sales", "40% higher customer retention", "Seamless omnichannel experience"],
    tags: ["Omnichannel", "Digital Transformation", "Retail"],
    imageUrl: "https://example.com/retail-case-study.jpg",
    roadmap: [
      {
        phase: "Assessment & Planning",
        description: "Analyzed existing infrastructure and created transformation strategy",
        duration: "2 months"
      },
      {
        phase: "Platform Development",
        description: "Built unified commerce platform with real-time inventory",
        duration: "4 months"
      },
      {
        phase: "Integration",
        description: "Integrated online and offline channels with single customer view",
        duration: "3 months"
      },
      {
        phase: "Training & Support",
        description: "Provided employee training and ongoing support",
        duration: "2 months"
      },
      {
        phase: "Launch & Optimization",
        description: "Launched omnichannel experience and continuously optimized",
        duration: "3 months"
      }
    ]
  },
  {
    id: 8,
    title: "Local Marketplace Success",
    domain: "Retail",
    description: "Building a thriving local artisan marketplace",
    challenge: "Connecting local artisans with global customers",
    solution: "Mobile-first marketplace with artisan stories",
    results: ["1000+ artisans onboarded", "3x artisan income increase", "Global shipping network"],
    tags: ["Marketplace", "Local Business", "E-commerce"],
    imageUrl: "https://example.com/marketplace-case-study.jpg",
    roadmap: [
      {
        phase: "Market Research",
        description: "Conducted user research and competitor analysis",
        duration: "2 months"
      },
      {
        phase: "Platform Development",
        description: "Built mobile-first marketplace with artisan profiles",
        duration: "4 months"
      },
      {
        phase: "Artisan Onboarding",
        description: "Onboarded local artisans and provided training",
        duration: "3 months"
      },
      {
        phase: "Marketing Strategy",
        description: "Launched marketing campaign targeting global customers",
        duration: "2 months"
      },
      {
        phase: "Scale Operations",
        description: "Expanded marketplace to new regions and artisans",
        duration: "6 months"
      }
    ]
  },
  {
    id: 9,
    title: "Smart Retail Analytics",
    domain: "Retail",
    description: "Data-driven retail optimization strategy",
    challenge: "Inefficient inventory management and customer targeting",
    solution: "AI-powered analytics platform for retail insights",
    results: ["25% reduction in inventory costs", "40% better prediction accuracy", "15% sales increase"],
    tags: ["Analytics", "AI", "Retail Operations"],
    imageUrl: "https://example.com/analytics-case-study.jpg",
    roadmap: [
      {
        phase: "Data Collection",
        description: "Gathered and analyzed historical sales and customer data",
        duration: "2 months"
      },
      {
        phase: "AI Model Development",
        description: "Built and trained predictive models for inventory and customer behavior",
        duration: "4 months"
      },
      {
        phase: "Platform Integration",
        description: "Integrated AI platform with existing retail systems",
        duration: "3 months"
      },
      {
        phase: "Insight Generation",
        description: "Generated actionable insights for inventory and customer optimization",
        duration: "2 months"
      },
      {
        phase: "Continuous Improvement",
        description: "Continuously refined AI models and retail strategies",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 10,
    title: "Luxury Brand Digital Presence",
    domain: "Retail",
    description: "Expanding luxury retail to digital channels",
    challenge: "Maintaining brand exclusivity in digital space",
    solution: "VR/AR-powered virtual boutique experience",
    results: ["200% online sales growth", "Virtual try-ons", "Enhanced brand value"],
    tags: ["Luxury", "Digital", "VR/AR"],
    imageUrl: "https://example.com/luxury-case-study.jpg",
    roadmap: [
      {
        phase: "Brand Strategy",
        description: "Defined luxury brand's digital vision and goals",
        duration: "2 months"
      },
      {
        phase: "Virtual Boutique Development",
        description: "Built VR/AR-powered virtual boutique experience",
        duration: "4 months"
      },
      {
        phase: "Content Creation",
        description: "Developed high-end digital content for virtual boutique",
        duration: "3 months"
      },
      {
        phase: "Launch & Promotion",
        description: "Launched virtual boutique and promoted through social media",
        duration: "2 months"
      },
      {
        phase: "Ongoing Optimization",
        description: "Continuously refined virtual boutique experience",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 11,
    title: "FinTech Payment Solution",
    domain: "Finance",
    description: "Revolutionizing B2B payments with blockchain",
    challenge: "High transaction costs and slow processing times",
    solution: "Blockchain-based payment network with smart contracts",
    results: ["90% reduction in processing time", "75% cost savings", "500+ business partners"],
    tags: ["Finance", "Blockchain", "B2B"],
    imageUrl: "https://example.com/fintech-case-study.jpg",
    roadmap: [
      {
        phase: "Market Research",
        description: "Conducted user research and competitor analysis",
        duration: "2 months"
      },
      {
        phase: "Blockchain Development",
        description: "Built blockchain-based payment network with smart contracts",
        duration: "4 months"
      },
      {
        phase: "Partnership Development",
        description: "Established partnerships with businesses and financial institutions",
        duration: "3 months"
      },
      {
        phase: "Pilot Program",
        description: "Conducted pilot program with select business partners",
        duration: "2 months"
      },
      {
        phase: "Full Launch",
        description: "Launched blockchain-based payment network",
        duration: "1 month"
      }
    ]
  },
  {
    id: 12,
    title: "Digital Banking Platform",
    domain: "Finance",
    description: "Launch of a fully digital banking solution",
    challenge: "Complex regulatory compliance and security requirements",
    solution: "Cloud-native banking platform with AI security",
    results: ["1M+ accounts opened", "Zero security breaches", "24/7 banking services"],
    tags: ["Digital Banking", "Security", "Cloud"],
    imageUrl: "https://example.com/banking-case-study.jpg",
    roadmap: [
      {
        phase: "Regulatory Compliance",
        description: "Obtained necessary financial licenses and certifications",
        duration: "4 months"
      },
      {
        phase: "Platform Development",
        description: "Built cloud-native banking platform with AI security",
        duration: "6 months"
      },
      {
        phase: "Security Testing",
        description: "Conducted rigorous security testing and penetration testing",
        duration: "2 months"
      },
      {
        phase: "Launch Preparation",
        description: "Prepared for launch with marketing campaign and customer support",
        duration: "2 months"
      },
      {
        phase: "Launch & Optimization",
        description: "Launched digital banking platform and continuously optimized",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 13,
    title: "Investment App Innovation",
    domain: "Finance",
    description: "Democratizing investment for millennials",
    challenge: "Making investing accessible to young investors",
    solution: "Gamified investment platform with educational content",
    results: ["2M+ young investors", "Average 18% returns", "High user engagement"],
    tags: ["Investment", "Millennials", "Fintech"],
    imageUrl: "https://example.com/investment-case-study.jpg",
    roadmap: [
      {
        phase: "Market Research",
        description: "Conducted user research and competitor analysis",
        duration: "2 months"
      },
      {
        phase: "Platform Development",
        description: "Built gamified investment platform with educational content",
        duration: "4 months"
      },
      {
        phase: "Content Creation",
        description: "Developed engaging educational content for young investors",
        duration: "3 months"
      },
      {
        phase: "Marketing Strategy",
        description: "Launched marketing campaign targeting millennials",
        duration: "2 months"
      },
      {
        phase: "Ongoing Optimization",
        description: "Continuously refined investment platform and content",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 14,
    title: "Insurance Tech Revolution",
    domain: "Finance",
    description: "Modernizing insurance claims processing",
    challenge: "Slow and paper-heavy claims process",
    solution: "AI-powered claims automation system",
    results: ["5-minute claim processing", "95% customer satisfaction", "60% operational savings"],
    tags: ["Insurance", "AI", "Process Automation"],
    imageUrl: "https://example.com/insurance-case-study.jpg",
    roadmap: [
      {
        phase: "Process Analysis",
        description: "Analyzed existing claims processing workflow",
        duration: "2 months"
      },
      {
        phase: "AI Development",
        description: "Built AI-powered claims automation system",
        duration: "4 months"
      },
      {
        phase: "Integration",
        description: "Integrated AI system with existing insurance systems",
        duration: "3 months"
      },
      {
        phase: "Testing & Training",
        description: "Conducted testing and training for insurance staff",
        duration: "2 months"
      },
      {
        phase: "Launch & Optimization",
        description: "Launched AI-powered claims automation system and continuously optimized",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 15,
    title: "Crypto Trading Platform",
    domain: "Finance",
    description: "Building a secure cryptocurrency exchange",
    challenge: "Security concerns and market volatility",
    solution: "Advanced trading engine with multi-layer security",
    results: ["$1B+ daily trading volume", "Military-grade security", "24/7 market access"],
    tags: ["Cryptocurrency", "Trading", "Security"],
    imageUrl: "https://example.com/crypto-case-study.jpg",
    roadmap: [
      {
        phase: "Market Research",
        description: "Conducted user research and competitor analysis",
        duration: "2 months"
      },
      {
        phase: "Trading Engine Development",
        description: "Built advanced trading engine with multi-layer security",
        duration: "4 months"
      },
      {
        phase: "Security Testing",
        description: "Conducted rigorous security testing and penetration testing",
        duration: "2 months"
      },
      {
        phase: "Launch Preparation",
        description: "Prepared for launch with marketing campaign and customer support",
        duration: "2 months"
      },
      {
        phase: "Launch & Optimization",
        description: "Launched cryptocurrency trading platform and continuously optimized",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 16,
    title: "Healthcare AI Implementation",
    domain: "Healthcare",
    description: "AI-powered diagnostic assistance for rural healthcare",
    challenge: "Limited access to specialist doctors in rural areas",
    solution: "AI-based diagnostic tool with telemedicine integration",
    results: ["100,000+ diagnoses", "95% accuracy rate", "60% reduction in wait times"],
    tags: ["Healthcare", "AI", "Rural Development"],
    imageUrl: "https://example.com/healthcare-case-study.jpg",
    roadmap: [
      {
        phase: "Needs Assessment",
        description: "Assessed healthcare needs in rural areas",
        duration: "2 months"
      },
      {
        phase: "AI Development",
        description: "Built AI-based diagnostic tool with telemedicine integration",
        duration: "4 months"
      },
      {
        phase: "Clinical Testing",
        description: "Conducted clinical testing and validation",
        duration: "3 months"
      },
      {
        phase: "Deployment",
        description: "Deployed AI-powered diagnostic tool in rural healthcare facilities",
        duration: "2 months"
      },
      {
        phase: "Ongoing Support",
        description: "Provided ongoing support and maintenance",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 17,
    title: "Digital Health Records Platform",
    domain: "Healthcare",
    description: "Unified electronic health records system",
    challenge: "Fragmented patient data across healthcare providers",
    solution: "Blockchain-based health records platform",
    results: ["1M+ patient records", "Instant access to medical history", "HIPAA compliant"],
    tags: ["EHR", "Blockchain", "Healthcare IT"],
    imageUrl: "https://example.com/ehr-case-study.jpg",
    roadmap: [
      {
        phase: "Needs Assessment",
        description: "Assessed healthcare provider needs for unified EHR system",
        duration: "2 months"
      },
      {
        phase: "Blockchain Development",
        description: "Built blockchain-based health records platform",
        duration: "4 months"
      },
      {
        phase: "Integration",
        description: "Integrated platform with existing healthcare systems",
        duration: "3 months"
      },
      {
        phase: "Security Testing",
        description: "Conducted rigorous security testing and penetration testing",
        duration: "2 months"
      },
      {
        phase: "Launch & Optimization",
        description: "Launched digital health records platform and continuously optimized",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 18,
    title: "Mental Health App Success",
    domain: "Healthcare",
    description: "Digital mental health support platform",
    challenge: "Increasing mental health support accessibility",
    solution: "AI-powered therapy and meditation app",
    results: ["500K+ active users", "85% symptom improvement", "24/7 support availability"],
    tags: ["Mental Health", "Digital Therapy", "Wellness"],
    imageUrl: "https://example.com/mental-health-case-study.jpg",
    roadmap: [
      {
        phase: "Market Research",
        description: "Conducted user research and competitor analysis",
        duration: "2 months"
      },
      {
        phase: "AI Development",
        description: "Built AI-powered therapy and meditation app",
        duration: "4 months"
      },
      {
        phase: "Content Creation",
        description: "Developed engaging mental health content",
        duration: "3 months"
      },
      {
        phase: "Marketing Strategy",
        description: "Launched marketing campaign targeting mental health awareness",
        duration: "2 months"
      },
      {
        phase: "Ongoing Optimization",
        description: "Continuously refined mental health app and content",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 19,
    title: "Remote Patient Monitoring",
    domain: "Healthcare",
    description: "IoT-based patient monitoring system",
    challenge: "Continuous monitoring of chronic disease patients",
    solution: "Wearable devices with real-time monitoring",
    results: ["30% reduction in hospital readmissions", "Early warning system", "Improved patient outcomes"],
    tags: ["IoT", "Patient Care", "Remote Monitoring"],
    imageUrl: "https://example.com/monitoring-case-study.jpg",
    roadmap: [
      {
        phase: "Needs Assessment",
        description: "Assessed patient needs for remote monitoring",
        duration: "2 months"
      },
      {
        phase: "IoT Development",
        description: "Built IoT-based patient monitoring system",
        duration: "4 months"
      },
      {
        phase: "Clinical Testing",
        description: "Conducted clinical testing and validation",
        duration: "3 months"
      },
      {
        phase: "Deployment",
        description: "Deployed remote patient monitoring system",
        duration: "2 months"
      },
      {
        phase: "Ongoing Support",
        description: "Provided ongoing support and maintenance",
        duration: "Ongoing"
      }
    ]
  },
  {
    id: 20,
    title: "Pharmaceutical Supply Chain",
    domain: "Healthcare",
    description: "Blockchain for pharmaceutical tracking",
    challenge: "Counterfeit drugs and supply chain transparency",
    solution: "End-to-end blockchain tracking system",
    results: ["100% drug traceability", "Zero counterfeit incidents", "Real-time inventory tracking"],
    tags: ["Pharma", "Blockchain", "Supply Chain"],
    imageUrl: "https://example.com/pharma-case-study.jpg",
    roadmap: [
      {
        phase: "Needs Assessment",
        description: "Assessed pharmaceutical supply chain needs",
        duration: "2 months"
      },
      {
        phase: "Blockchain Development",
        description: "Built end-to-end blockchain tracking system",
        duration: "4 months"
      },
      {
        phase: "Integration",
        description: "Integrated platform with existing supply chain systems",
        duration: "3 months"
      },
      {
        phase: "Security Testing",
        description: "Conducted rigorous security testing and penetration testing",
        duration: "2 months"
      },
      {
        phase: "Launch & Optimization",
        description: "Launched blockchain-based pharmaceutical tracking system and continuously optimized",
        duration: "Ongoing"
      }
    ]
  }
];

const domains = [...new Set(caseStudiesData.map(study => study.domain))];

const CaseStudies = () => {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCaseStudies = caseStudiesData.filter(study => {
    const matchesDomain = selectedDomain === 'All' || study.domain === selectedDomain;
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Case Studies
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Explore success stories across different domains
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Domain Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDomain('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedDomain === 'All'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                All
              </button>
              {['Technology', 'Retail', 'Finance', 'Healthcare'].map(domain => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedDomain === domain
                      ? 'bg-violet-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300`}
                >
                  {domain}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>

          {/* Case Studies Grid */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {filteredCaseStudies.map(study => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>

          {filteredCaseStudies.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-500">No case studies found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
