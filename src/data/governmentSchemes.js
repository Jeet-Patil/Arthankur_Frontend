const governmentSchemes = [
  {
    id: 1,
    title: 'Startup India Seed Fund Scheme',
    ministry: 'Ministry of Commerce and Industry',
    description: 'Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.',
    colorClass: 'bg-blue-50',
    details: [
      { label: 'Funding Amount', value: 'Up to ₹20 Lakhs' },
      { label: 'Eligibility', value: 'DPIIT Recognized Startups' },
      { label: 'Focus Sectors', value: 'All Sectors' }
    ],
    website: 'https://www.startupindia.gov.in/content/sih/en/government-schemes/seed-fund-scheme.html',
    applicationUrl: 'https://www.startupindia.gov.in/content/sih/en/government-schemes/seed-fund-scheme.html',
    eligibilityCriteria: {
      startupStage: ['Ideation', 'Validation', 'Early Traction'],
      industryType: ['Agriculture', 'EdTech', 'FinTech', 'Healthcare', 'IT/Software', 'Manufacturing', 'Retail', 'Clean Energy', 'Transportation', 'Others'],
      annualRevenue: ['Pre-revenue', 'Less than ₹10 Lakhs', '₹10 Lakhs - ₹50 Lakhs'],
      employees: ['1-5 employees', '6-20 employees'],
      registeredLocation: ['Metro City', 'Tier 2 City', 'Tier 3 City', 'Rural Area', 'Special Economic Zone', 'Industrial Cluster'],
      existingSupport: ['none', 'incubation']
    }
  },
  {
    id: 2,
    title: 'Credit Guarantee Scheme',
    ministry: 'Ministry of MSME',
    description: 'Provides collateral-free loans to micro and small enterprises through financial institutions, covering both term loans and working capital.',
    colorClass: 'bg-green-50',
    details: [
      { label: 'Maximum Guarantee Cover', value: 'Up to ₹2 Crore' },
      { label: 'Eligibility', value: 'New & Existing MSMEs' },
      { label: 'Sector Focus', value: 'Manufacturing & Service' }
    ],
    website: 'https://www.cgtmse.in/',
    applicationUrl: 'https://www.cgtmse.in/Apply',
    eligibilityCriteria: {
      startupStage: ['Early Traction', 'Scaling', 'Established'],
      industryType: ['Agriculture', 'Manufacturing', 'Retail', 'Clean Energy', 'Transportation', 'Others'],
      annualRevenue: ['₹10 Lakhs - ₹50 Lakhs', '₹50 Lakhs - ₹2 Crore', '₹2 Crore - ₹5 Crore'],
      employees: ['6-20 employees', '21-50 employees', '51-100 employees'],
      registeredLocation: ['Metro City', 'Tier 2 City', 'Tier 3 City', 'Industrial Cluster'],
      existingSupport: ['none', 'tax', 'multiple']
    }
  },
  {
    id: 3,
    title: 'Stand-Up India',
    ministry: 'Department of Financial Services',
    description: 'Facilitates bank loans between ₹10 lakh and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and one woman borrower per bank branch.',
    colorClass: 'bg-purple-50',
    details: [
      { label: 'Loan Amount', value: '₹10 Lakh - ₹1 Crore' },
      { label: 'Purpose', value: 'Greenfield enterprises' },
      { label: 'Target Beneficiaries', value: 'SC/ST & Women' }
    ],
    website: 'https://www.standupmitra.in/',
    applicationUrl: 'https://www.standupmitra.in/Registration/BorrowerRegistration',
    eligibilityCriteria: {
      startupStage: ['Validation', 'Early Traction', 'Scaling'],
      industryType: ['Agriculture', 'Manufacturing', 'Retail', 'Clean Energy', 'Transportation', 'Others'],
      annualRevenue: ['Pre-revenue', 'Less than ₹10 Lakhs', '₹10 Lakhs - ₹50 Lakhs', '₹50 Lakhs - ₹2 Crore'],
      employees: ['1-5 employees', '6-20 employees', '21-50 employees'],
      registeredLocation: ['Metro City', 'Tier 2 City', 'Tier 3 City', 'Rural Area'],
      existingSupport: ['none', 'incubation', 'tax']
    }
  },
  {
    id: 4,
    title: 'Atal Innovation Mission (AIM)',
    ministry: 'NITI Aayog',
    description: 'Promotes innovation and entrepreneurship through Atal Incubation Centers, Atal Tinkering Labs, and providing scale-up support to established incubators.',
    colorClass: 'bg-yellow-50',
    details: [
      { label: 'Grant Support', value: 'Up to ₹10 Crore' },
      { label: 'For', value: 'Incubators & Startups' },
      { label: 'Focus Area', value: 'Innovation & R&D' }
    ],
    website: 'https://aim.gov.in/',
    applicationUrl: 'https://aim.gov.in/schemes.php',
    eligibilityCriteria: {
      startupStage: ['Ideation', 'Validation', 'Early Traction'],
      industryType: ['EdTech', 'FinTech', 'Healthcare', 'IT/Software', 'Clean Energy'],
      annualRevenue: ['Pre-revenue', 'Less than ₹10 Lakhs', '₹10 Lakhs - ₹50 Lakhs'],
      employees: ['1-5 employees', '6-20 employees'],
      registeredLocation: ['Metro City', 'Tier 2 City', 'Special Economic Zone'],
      existingSupport: ['none', 'incubation']
    }
  },
  {
    id: 5,
    title: 'ASPIRE - Scheme for Promotion of Innovation in Rural Industry',
    ministry: 'Ministry of MSME',
    description: 'Promotes innovation, entrepreneurship and agro-industry in rural areas by setting up Livelihood Business Incubators (LBIs) and Technology Business Incubators (TBIs).',
    colorClass: 'bg-orange-50',
    details: [
      { label: 'Financial Assistance', value: 'Up to ₹1 Crore' },
      { label: 'Focus', value: 'Rural Enterprises' },
      { label: 'Support Type', value: 'Incubation & Technical' }
    ],
    website: 'https://msme.gov.in/schemes/technology-upgradation-and-quality-certification/aspire-scheme-promotion-innovation-rural',
    applicationUrl: null,
    eligibilityCriteria: {
      startupStage: ['Ideation', 'Validation', 'Early Traction'],
      industryType: ['Agriculture', 'Manufacturing', 'Clean Energy'],
      annualRevenue: ['Pre-revenue', 'Less than ₹10 Lakhs', '₹10 Lakhs - ₹50 Lakhs'],
      employees: ['1-5 employees', '6-20 employees'],
      registeredLocation: ['Tier 3 City', 'Rural Area'],
      existingSupport: ['none', 'incubation', 'funding']
    }
  },
  {
    id: 6,
    title: "PMEGP - Prime Minister's Employment Generation Programme",
    ministry: 'Ministry of MSME',
    description: 'Credit-linked subsidy program that helps in generating self-employment opportunities through establishment of micro-enterprises in non-farm sectors.',
    colorClass: 'bg-pink-50',
    details: [
      { label: 'Subsidy', value: '15-35% of project cost' },
      { label: 'Maximum Project Cost', value: '₹50 Lakhs (Manufacturing)' },
      { label: 'Target Group', value: 'Individuals, SHGs, Trusts' }
    ],
    website: 'https://msme.gov.in/schemes/prime-ministers-employment-generation-programme-pmegp',
    applicationUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    eligibilityCriteria: {
      startupStage: ['Ideation', 'Validation', 'Early Traction'],
      industryType: ['Agriculture', 'Manufacturing', 'Retail', 'Others'],
      annualRevenue: ['Pre-revenue', 'Less than ₹10 Lakhs', '₹10 Lakhs - ₹50 Lakhs'],
      employees: ['1-5 employees', '6-20 employees'],
      registeredLocation: ['Metro City', 'Tier 2 City', 'Tier 3 City', 'Rural Area'],
      existingSupport: ['none']
    }
  },
  {
    id: 7,
    title: 'National SC-ST Hub',
    ministry: 'Ministry of MSME',
    description: 'Provides professional support to SC/ST entrepreneurs to fulfill the obligations under the Central Government procurement policy for Micro and Small Enterprises.',
    colorClass: 'bg-indigo-50',
    details: [
      { label: 'Financial Support', value: 'Various Schemes' },
      { label: 'Target Group', value: 'SC/ST Entrepreneurs' },
      { label: 'Benefits', value: 'Market Access & Training' }
    ],
    website: 'https://nssh.msme.gov.in/',
    applicationUrl: 'https://nssh.msme.gov.in/NSSHO/Membership/ApplicationForm',
    eligibilityCriteria: {
      startupStage: ['Validation', 'Early Traction', 'Scaling', 'Established'],
      industryType: ['Agriculture', 'Manufacturing', 'Retail', 'Others'],
      annualRevenue: ['Less than ₹10 Lakhs', '₹10 Lakhs - ₹50 Lakhs', '₹50 Lakhs - ₹2 Crore'],
      employees: ['1-5 employees', '6-20 employees', '21-50 employees'],
      registeredLocation: ['Metro City', 'Tier 2 City', 'Tier 3 City', 'Rural Area'],
      existingSupport: ['none', 'incubation', 'funding', 'tax', 'multiple']
    }
  },
  {
    id: 8,
    title: 'Fund of Funds for Startups (FFS)',
    ministry: 'Department for Promotion of Industry and Internal Trade',
    description: 'A fund established by the Government to invest in SEBI-registered Alternative Investment Funds (AIFs) which, in turn, invest in startups.',
    colorClass: 'bg-red-50',
    details: [
      { label: 'Fund Size', value: '₹10,000 Crore' },
      { label: 'Investment Mode', value: 'Through AIFs' },
      { label: 'Eligibility', value: 'DPIIT Recognized Startups' }
    ],
    website: 'https://www.startupindia.gov.in/content/sih/en/government-schemes/fund-of-funds.html',
    applicationUrl: null,
    eligibilityCriteria: {
      startupStage: ['Early Traction', 'Scaling'],
      industryType: ['EdTech', 'FinTech', 'Healthcare', 'IT/Software', 'Clean Energy', 'Transportation'],
      annualRevenue: ['₹10 Lakhs - ₹50 Lakhs', '₹50 Lakhs - ₹2 Crore', '₹2 Crore - ₹5 Crore'],
      employees: ['6-20 employees', '21-50 employees', '51-100 employees'],
      registeredLocation: ['Metro City', 'Tier 2 City'],
      existingSupport: ['none', 'incubation', 'tax']
    }
  }
];

export default governmentSchemes;
