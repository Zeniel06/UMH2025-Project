'use client'

import { useState, useEffect } from 'react';
import { MapPin, Filter, Calendar, AlertTriangle, Check, ArrowRight, Menu, X, BarChart3, Download, Share2, HelpCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';

// Import new components
import DonationComponent from './DonationComponent';
import TransactionTrackingComponent from './TransactionTrackingComponent';

// Dynamic import for Leaflet components to prevent SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

// Mock data for demonstration
const mockRegions = [
  { id: 1, name: 'Kuala Lumpur', needIndex: 75, lat: 3.139, lng: 101.6869, cases: 230, population: 1700000, causes: ['food', 'shelter'] },
  { id: 2, name: 'Penang', needIndex: 45, lat: 5.4164, lng: 100.3327, cases: 120, population: 1800000, causes: ['education', 'healthcare'] },
  { id: 3, name: 'Johor', needIndex: 82, lat: 1.4927, lng: 103.7414, cases: 350, population: 3600000, causes: ['food', 'shelter', 'healthcare'] },
  { id: 4, name: 'Sabah', needIndex: 91, lat: 5.9788, lng: 116.0753, cases: 410, population: 3900000, causes: ['food', 'shelter', 'water'] },
  { id: 5, name: 'Sarawak', needIndex: 68, lat: 1.5533, lng: 110.3592, cases: 200, population: 2800000, causes: ['education', 'healthcare'] },
  { id: 6, name: 'Kelantan', needIndex: 88, lat: 6.1254, lng: 102.2386, cases: 280, population: 1900000, causes: ['food', 'shelter', 'water'] },
  { id: 7, name: 'Perak', needIndex: 52, lat: 4.5921, lng: 101.0901, cases: 150, population: 2500000, causes: ['education', 'healthcare'] },
  { id: 8, name: 'Pahang', needIndex: 61, lat: 3.8126, lng: 103.3256, cases: 180, population: 1700000, causes: ['healthcare', 'water'] },
];

const mockNeeds = [
  { id: 1, title: 'Flood Relief in Kelantan', location: 'Kelantan', cause: 'shelter', urgency: 'critical', timestamp: '2025-04-09T14:30:00', description: 'Flash floods have displaced 230 families. Temporary shelter and food supplies needed.', organization: 'Malaysian Red Crescent' },
  { id: 2, title: 'Education Support for Rural Areas', location: 'Sabah', cause: 'education', urgency: 'high', timestamp: '2025-04-08T09:15:00', description: 'Remote learning resources required for 45 villages with limited internet connectivity', organization: 'Education For All Malaysia' },
  { id: 3, title: 'Medical Supplies Shortage', location: 'Penang', cause: 'healthcare', urgency: 'medium', timestamp: '2025-04-07T11:45:00', description: 'Community clinics need basic medical supplies and medication for chronic disease patients', organization: 'Doctors Without Borders Malaysia' },
  { id: 4, title: 'Food Distribution Program', location: 'Kuala Lumpur', cause: 'food', urgency: 'high', timestamp: '2025-04-09T16:20:00', description: 'Urban poor communities need nutritional support for 500+ families', organization: 'Food Aid Foundation' },
  { id: 5, title: 'Clean Water Crisis', location: 'Sabah', cause: 'water', urgency: 'critical', timestamp: '2025-04-10T08:45:00', description: 'Several villages facing contaminated water sources affecting 2,000+ residents', organization: 'WaterAid Malaysia' },
  { id: 6, title: 'Shelter for Displaced Families', location: 'Johor', cause: 'shelter', urgency: 'high', timestamp: '2025-04-06T13:30:00', description: 'Construction materials needed for rebuilding homes affected by severe storms', organization: 'Habitat for Humanity' },
  { id: 7, title: 'Mental Health Support', location: 'Perak', cause: 'healthcare', urgency: 'medium', timestamp: '2025-04-05T10:15:00', description: 'Counseling and mental health services needed for flood-affected communities', organization: 'Mental Health Malaysia' },
  { id: 8, title: 'School Supplies for Children', location: 'Pahang', cause: 'education', urgency: 'medium', timestamp: '2025-04-08T15:40:00', description: 'Educational materials needed for 500 students from low-income families', organization: 'Education For All Malaysia' },
];

// More detailed need data for the detailed view
const detailedNeedData = {
  1: {
    title: 'Flood Relief in Kelantan',
    location: 'Kelantan',
    coordinates: '6.1254, 102.2386',
    cause: 'shelter',
    urgency: 'critical',
    timestamp: '2025-04-09T14:30:00',
    description: 'Flash floods have displaced 230 families in the northeastern region of Kelantan. Heavy rainfall over the past 72 hours has caused rivers to overflow, affecting 12 villages in the Kota Bharu and Pasir Mas districts. Temporary shelter facilities are at capacity, and many families are currently housed in school buildings that need to resume classes soon. Immediate needs include portable shelter units, bedding, clean water, and food supplies.',
    organization: 'Malaysian Red Crescent',
    contactPerson: 'Dr. Ahmad Razak',
    contactEmail: 'emergency@redcrescent.my',
    contactPhone: '+60 12-345-6789',
    fundingRequired: 'RM 250,000',
    fundingReceived: 'RM 65,000',
    volunteersNeeded: 50,
    volunteersRegistered: 22,
    updates: [
      { date: '2025-04-09', content: 'Initial assessment completed. 230 families identified in need of immediate assistance.' },
      { date: '2025-04-10', content: 'First shipment of emergency supplies delivered to Kota Bharu relief center.' }
    ],
    respondingOrganizations: ['Malaysian Red Crescent', 'Islamic Relief Malaysia', 'Malaysian Civil Defense']
  },
  2: {
    title: 'Education Support for Rural Areas',
    location: 'Sabah',
    coordinates: '5.9788, 116.0753',
    cause: 'education',
    urgency: 'high',
    timestamp: '2025-04-08T09:15:00',
    description: 'Remote learning resources required for 45 villages with limited internet connectivity. Many students have been unable to access online education due to poor infrastructure. This program aims to distribute offline learning materials, solar-powered tablets, and establish community learning centers.',
    organization: 'Education For All Malaysia',
    contactPerson: 'Sarah Abdullah',
    contactEmail: 'programs@educationforall.my',
    contactPhone: '+60 13-456-7890',
    fundingRequired: 'RM 175,000',
    fundingReceived: 'RM 48,000',
    volunteersNeeded: 30,
    volunteersRegistered: 15,
    updates: [
      { date: '2025-04-08', content: 'Needs assessment completed across 45 villages.' },
      { date: '2025-04-09', content: 'First batch of learning materials prepared for distribution.' }
    ],
    respondingOrganizations: ['Education For All Malaysia', 'UNICEF Malaysia', 'Ministry of Education']
  },
  3: {
    title: 'Medical Supplies Shortage',
    location: 'Penang',
    coordinates: '5.4164, 100.3327',
    cause: 'healthcare',
    urgency: 'medium',
    timestamp: '2025-04-07T11:45:00',
    description: 'Community clinics need basic medical supplies and medication for chronic disease patients. Several rural clinics are running low on essential medicines, particularly for diabetes and hypertension treatment.',
    organization: 'Doctors Without Borders Malaysia',
    contactPerson: 'Dr. Mei Ling',
    contactEmail: 'operations@dwb.my',
    contactPhone: '+60 14-567-8901',
    fundingRequired: 'RM 120,000',
    fundingReceived: 'RM 45,000',
    volunteersNeeded: 15,
    volunteersRegistered: 8,
    updates: [
      { date: '2025-04-07', content: 'Inventory assessment completed at 12 community clinics.' }
    ],
    respondingOrganizations: ['Doctors Without Borders Malaysia', 'Malaysian Medical Association']
  },
  4: {
    title: 'Food Distribution Program',
    location: 'Kuala Lumpur',
    coordinates: '3.139, 101.6869',
    cause: 'food',
    urgency: 'high',
    timestamp: '2025-04-09T16:20:00',
    description: 'Urban poor communities need nutritional support for 500+ families. Economic challenges have left many families struggling to afford adequate nutrition, particularly in several low-income housing areas.',
    organization: 'Food Aid Foundation',
    contactPerson: 'Zulkifli Ibrahim',
    contactEmail: 'programs@foodaid.my',
    contactPhone: '+60 15-678-9012',
    fundingRequired: 'RM 85,000',
    fundingReceived: 'RM 32,000',
    volunteersNeeded: 40,
    volunteersRegistered: 28,
    updates: [
      { date: '2025-04-09', content: 'Identified 520 families in need of immediate food assistance.' }
    ],
    respondingOrganizations: ['Food Aid Foundation', 'Islamic Relief Malaysia']
  },
  5: {
    title: 'Clean Water Crisis',
    location: 'Sabah',
    coordinates: '5.9788, 116.0753',
    cause: 'water',
    urgency: 'critical',
    timestamp: '2025-04-10T08:45:00',
    description: 'Several villages facing contaminated water sources affecting 2,000+ residents. Recent floods have contaminated wells and damaged water supply infrastructure, creating a public health emergency.',
    organization: 'WaterAid Malaysia',
    contactPerson: 'Tan Wei Liang',
    contactEmail: 'emergency@wateraid.my',
    contactPhone: '+60 16-789-0123',
    fundingRequired: 'RM 200,000',
    fundingReceived: 'RM 55,000',
    volunteersNeeded: 45,
    volunteersRegistered: 20,
    updates: [
      { date: '2025-04-10', content: 'Water quality testing completed in 8 villages, confirming contamination.' }
    ],
    respondingOrganizations: ['WaterAid Malaysia', 'Malaysian Red Crescent', 'Civil Defense']
  },
  6: {
    title: 'Shelter for Displaced Families',
    location: 'Johor',
    coordinates: '1.4927, 103.7414',
    cause: 'shelter',
    urgency: 'high',
    timestamp: '2025-04-06T13:30:00',
    description: 'Construction materials needed for rebuilding homes affected by severe storms. Recent weather events have damaged approximately 120 homes across several communities.',
    organization: 'Habitat for Humanity',
    contactPerson: 'Ahmad Rizal',
    contactEmail: 'projects@habitat.my',
    contactPhone: '+60 17-890-1234',
    fundingRequired: 'RM 320,000',
    fundingReceived: 'RM 95,000',
    volunteersNeeded: 60,
    volunteersRegistered: 35,
    updates: [
      { date: '2025-04-06', content: 'Damage assessment completed for 120 affected homes.' },
      { date: '2025-04-08', content: 'First shipment of building materials received.' }
    ],
    respondingOrganizations: ['Habitat for Humanity', 'Malaysian Construction Association']
  },
  7: {
    title: 'Mental Health Support',
    location: 'Perak',
    coordinates: '4.5921, 101.0901',
    cause: 'healthcare',
    urgency: 'medium',
    timestamp: '2025-04-05T10:15:00',
    description: 'Counseling and mental health services needed for flood-affected communities. Many residents are experiencing trauma and stress following recent natural disasters.',
    organization: 'Mental Health Malaysia',
    contactPerson: 'Dr. Lim Siew Mei',
    contactEmail: 'support@mentalhealth.my',
    contactPhone: '+60 18-901-2345',
    fundingRequired: 'RM 90,000',
    fundingReceived: 'RM 25,000',
    volunteersNeeded: 25,
    volunteersRegistered: 10,
    updates: [
      { date: '2025-04-05', content: 'Initial assessment of mental health needs completed in 5 communities.' }
    ],
    respondingOrganizations: ['Mental Health Malaysia', 'Malaysian Psychiatric Association']
  },
  8: {
    title: 'School Supplies for Children',
    location: 'Pahang',
    coordinates: '3.8126, 103.3256',
    cause: 'education',
    urgency: 'medium',
    timestamp: '2025-04-08T15:40:00',
    description: 'Educational materials needed for 500 students from low-income families. Many children lack basic school supplies, which is impacting their education.',
    organization: 'Education For All Malaysia',
    contactPerson: 'Nurul Huda',
    contactEmail: 'projects@educationforall.my',
    contactPhone: '+60 19-012-3456',
    fundingRequired: 'RM 65,000',
    fundingReceived: 'RM 18,000',
    volunteersNeeded: 20,
    volunteersRegistered: 12,
    updates: [
      { date: '2025-04-08', content: 'Identified 500 students in need across 12 schools.' }
    ],
    respondingOrganizations: ['Education For All Malaysia', 'Local School Board']
  }
};

export default function HumanitarianDashboard() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCause, setSelectedCause] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [timeFrame, setTimeFrame] = useState('week');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showDetailedNeed, setShowDetailedNeed] = useState(null);
  const [showAllNeeds, setShowAllNeeds] = useState(false);
  
  // New state variables for donation and transaction tracking
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showTransactionTracking, setShowTransactionTracking] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  
  const isAnyModalOpen = showDetailedNeed || showAllNeeds || showDonationModal || showTransactionTracking;
  
  // Get all needs for a specific region
  const getRegionNeeds = (regionName) => {
    return mockNeeds.filter(need => need.location === regionName);
  };
  
  const filteredNeeds = mockNeeds.filter(need => {
    return (selectedCause === 'all' || need.cause === selectedCause) &&
           (selectedUrgency === 'all' || need.urgency === selectedUrgency);
  });
  
  // Filter needs for region view
  const regionNeeds = selectedRegion ? getRegionNeeds(selectedRegion.name) : [];
  
  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'critical': return 'bg-red-600'; 
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };
  
  const getNeedIndexColor = (index) => {
    if (index >= 80) return 'bg-red-600';
    if (index >= 60) return 'bg-orange-500';
    if (index >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Function to get the marker color for the map without the 'bg-' prefix
  const getMarkerColor = (index) => {
    if (index >= 80) return '#dc2626'; // red-600
    if (index >= 60) return '#f97316'; // orange-500
    if (index >= 40) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleViewAllNeeds = () => {
    if (selectedRegion) {
      setShowAllNeeds(true);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handler for donation completion
  const handleDonationComplete = (transactionId) => {
    setShowDonationModal(false);
    setCurrentTransactionId(transactionId);
    setShowTransactionTracking(true);
  };

  // Helper function to count needs by category for analytics
  const countNeedsByCategory = () => {
    const categoryCounts = {
      food: 0,
      shelter: 0,
      education: 0,
      healthcare: 0,
      water: 0
    };
    
    mockNeeds.forEach(need => {
      if (categoryCounts[need.cause] !== undefined) {
        categoryCounts[need.cause]++;
      }
    });
    
    return [
      { name: 'Food', value: categoryCounts.food, fill: '#ef4444' },
      { name: 'Shelter', value: categoryCounts.shelter, fill: '#f97316' },
      { name: 'Education', value: categoryCounts.education, fill: '#3b82f6' },
      { name: 'Healthcare', value: categoryCounts.healthcare, fill: '#22c55e' },
      { name: 'Water', value: categoryCounts.water, fill: '#06b6d4' },
    ];
  };
  
  // Function to show donation modal
  const showDonation = (needId) => {
    setShowDetailedNeed(needId);
    setShowDonationModal(true);
  };

  // Function to track a donation by transaction ID
  const trackDonation = () => {
    const txId = prompt("Enter your donation transaction ID:");
    if (txId) {
      setCurrentTransactionId(txId);
      setShowTransactionTracking(true);
    }
  };
  
  // Helper function to count needs by region for analytics
  const countNeedsByRegion = () => {
    const regionCounts = {};
    
    mockRegions.forEach(region => {
      regionCounts[region.name] = 0;
    });
    
    mockNeeds.forEach(need => {
      if (regionCounts[need.location] !== undefined) {
        regionCounts[need.location]++;
      }
    });
    
    return Object.keys(regionCounts).map(region => ({
      name: region,
      needs: regionCounts[region]
    }));
  };

  // Render filter bar component
  const renderFilterBar = () => {
    if (showDonationModal || showTransactionTracking || showAllNeeds) {
      return null; // Don't show filter bar when modals are open
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-blue-700" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={selectedCause}
              onChange={(e) => setSelectedCause(e.target.value)}
            >
              <option value="all">All Causes</option>
              <option value="food">Food</option>
              <option value="shelter">Shelter</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="water">Water & Sanitation</option>
            </select>
            
            <select 
              className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
            >
              <option value="all">All Urgency Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <div className="flex items-center space-x-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-2">
              <Calendar size={16} className="text-gray-500" />
              <select 
                className="bg-transparent text-sm"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                <option value="day">Past 24 Hours</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>
          
          <div className="hidden md:block text-sm text-gray-500">
            Last updated: 10 April 2025, 08:30 AM
          </div>
        </div>
      </div>
    );
  };

  // Render analytics tab
  const renderAnalyticsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">Insights and trends across humanitarian needs</p>
        </div>
        
        <div className="p-4">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600">
                <BarChart3 size={24} />
              </div>
              <div className="mt-2 text-2xl font-bold">{mockNeeds.length}</div>
              <div className="text-sm text-gray-600">Active Verified Needs</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div className="mt-2 text-2xl font-bold">
                {mockNeeds.filter(need => need.urgency === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical Needs</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600">
                <Check size={24} />
              </div>
              <div className="mt-2 text-2xl font-bold">42</div>
              <div className="text-sm text-gray-600">Resolved Cases (This Month)</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600">
                <MapPin size={24} />
              </div>
              <div className="mt-2 text-2xl font-bold">{mockRegions.length}</div>
              <div className="text-sm text-gray-600">Affected Regions</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Need Categories Distribution</h3>
            <div className="h-64 bg-white rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countNeedsByCategory()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  />
                  <Tooltip formatter={(value) => [`${value} needs`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Urgency Level Trends</h3>
              <div className="h-64 bg-white rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Jan', critical: 2, high: 4, medium: 8, low: 3 },
                      { name: 'Feb', critical: 3, high: 5, medium: 6, low: 4 },
                      { name: 'Mar', critical: 1, high: 7, medium: 5, low: 6 },
                      { name: 'Apr', critical: 2, high: 6, medium: 4, low: 5 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="critical" stackId="a" fill="#dc2626" />
                    <Bar dataKey="high" stackId="a" fill="#f97316" />
                    <Bar dataKey="medium" stackId="a" fill="#eab308" />
                    <Bar dataKey="low" stackId="a" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Needs by Region</h3>
              <div className="h-64 bg-white rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={countNeedsByRegion()}
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="needs" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium flex items-center">
              <Download size={16} className="mr-2" />
              Download Full Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render needs tab
  const renderNeedsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Verified Humanitarian Needs</h2>
          <p className="text-sm text-gray-500">Displaying all validated needs across Malaysia</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredNeeds.length > 0 ? (
            filteredNeeds.map(need => (
              <div key={need.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium">{need.title}</h3>
                      <div className={`${getUrgencyColor(need.urgency)} text-white text-xs rounded-full px-2 py-0.5`}>
                        {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin size={14} className="text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">{need.location}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{formatDate(need.timestamp)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    <Check size={12} />
                    <span>Verified</span>
                  </div>
                </div>
                
                <p className="mt-3 text-gray-700">{need.description}</p>
                
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Submitted by:</span> {need.organization}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-md text-sm font-medium"
                      onClick={() => setShowDetailedNeed(need.id)}
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => showDonation(need.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <AlertTriangle size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500">No verified needs found with the current filter settings.</p>
              <button 
                onClick={() => {
                  setSelectedCause('all');
                  setSelectedUrgency('all');
                }}
                className="mt-3 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render the detailed need view
  const renderDetailedNeedView = () => {
    const need = detailedNeedData[showDetailedNeed];
    
    if (!need) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{need.title}</h2>
            <button 
              onClick={() => setShowDetailedNeed(null)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className={`${getUrgencyColor(need.urgency)} text-white text-sm rounded-full px-3 py-1`}>
                {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin size={16} className="mr-1" />
                {need.location}
              </div>
              <div className="flex items-center text-gray-500">
                <Calendar size={16} className="mr-1" />
                {formatDate(need.timestamp)}
              </div>
              <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                <Check size={12} />
                <span>Verified</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Organization Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Name:</span> {need.organization}</div>
                  <div><span className="text-gray-500">Contact:</span> {need.contactPerson}</div>
                  <div><span className="text-gray-500">Email:</span> {need.contactEmail}</div>
                  <div><span className="text-gray-500">Phone:</span> {need.contactPhone}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Resource Requirements</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Funding Required:</span> {need.fundingRequired}</div>
                  <div><span className="text-gray-500">Funding Received:</span> {need.fundingReceived}</div>
                  <div><span className="text-gray-500">Volunteers Needed:</span> {need.volunteersNeeded}</div>
                  <div><span className="text-gray-500">Volunteers Registered:</span> {need.volunteersRegistered}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Location Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Region:</span> {need.location}</div>
                  <div><span className="text-gray-500">Coordinates:</span> {need.coordinates}</div>
                  <div className="pt-2">
                    <div className="w-full h-20 bg-blue-100 rounded flex items-center justify-center text-gray-500 text-xs">
                      Map view would appear here
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Detailed Description</h3>
              <p className="text-gray-700">{need.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Updates</h3>
              <div className="space-y-3">
                {need.updates.map((update, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 font-medium rounded-md px-2 py-1 text-xs min-w-16 text-center mr-3">
                      {update.date}
                    </div>
                    <div className="text-gray-700 text-sm">{update.content}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Responding Organizations</h3>
              <div className="flex flex-wrap gap-2">
                {need.respondingOrganizations.map((org, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {org}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium flex items-center">
                <Share2 size={16} className="mr-2" />
                Share
              </button>
              <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium flex items-center">
                <Download size={16} className="mr-2" />
                Download Report
              </button>
              <button 
                onClick={() => setShowDonationModal(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Donate Now
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Respond to Need
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show all needs for a specific region
  const renderRegionNeedsView = () => {
    if (!showAllNeeds || !selectedRegion) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Needs in {selectedRegion.name}</h2>
            <button 
              onClick={() => setShowAllNeeds(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {regionNeeds.length > 0 ? (
              regionNeeds.map(need => (
                <div key={need.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium">{need.title}</h3>
                        <div className={`${getUrgencyColor(need.urgency)} text-white text-xs rounded-full px-2 py-0.5`}>
                          {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <MapPin size={14} className="text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">{need.location}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{formatDate(need.timestamp)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      <Check size={12} />
                      <span>Verified</span>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-gray-700">{need.description}</p>
                  
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Submitted by:</span> {need.organization}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-md text-sm font-medium"
                        onClick={() => {
                          setShowAllNeeds(false);
                          setShowDetailedNeed(need.id);
                        }}
                      >
                        View Details
                      </button>
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium"
                        onClick={() => {
                          setShowAllNeeds(false);
                          showDonation(need.id);
                        }}
                      >
                        Donate
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No verified needs found for this region.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header - Always visible */}
      <header className="bg-blue-700 text-white shadow-md">
        {/* Header content remains unchanged */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={24} />
            <h1 className="text-xl font-bold">ReliefResource</h1>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button 
              className={`px-3 py-2 ${activeTab === 'map' ? 'border-b-2 border-white font-medium' : ''}`}
              onClick={() => {
                setActiveTab('map');
                setShowDetailedNeed(null);
                setShowAllNeeds(false);
                setShowDonationModal(false);
                setShowTransactionTracking(false);
              }}
              disabled={showDonationModal || showTransactionTracking}
            >
              Live Heatmap
            </button>
            <button 
              className={`px-3 py-2 ${activeTab === 'needs' ? 'border-b-2 border-white font-medium' : ''}`}
              onClick={() => {
                setActiveTab('needs');
                setShowDetailedNeed(null);
                setShowAllNeeds(false);
                setShowDonationModal(false);
                setShowTransactionTracking(false);
              }}
              disabled={showDonationModal || showTransactionTracking}
            >
              Verified Needs
            </button>
            <button 
              className={`px-3 py-2 ${activeTab === 'analytics' ? 'border-b-2 border-white font-medium' : ''}`}
              onClick={() => {
                setActiveTab('analytics');
                setShowDetailedNeed(null);
                setShowAllNeeds(false);
                setShowDonationModal(false);
                setShowTransactionTracking(false);
              }}
              disabled={showDonationModal || showTransactionTracking}
            >
              Analytics
            </button>
            <button
              className="px-3 py-2 text-white"
              onClick={trackDonation}
              disabled={showDonationModal || showTransactionTracking}
            >
              Track Donation
            </button>
          </div>
          
          <button onClick={toggleMobileMenu} className="md:hidden" disabled={showDonationModal || showTransactionTracking}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800 p-4">
            <div className="flex flex-col space-y-2">
              <button 
                className={`px-3 py-2 text-left ${activeTab === 'map' ? 'bg-blue-900 rounded' : ''}`}
                onClick={() => { 
                  setActiveTab('map'); 
                  toggleMobileMenu(); 
                  setShowDetailedNeed(null);
                  setShowAllNeeds(false);
                  setShowDonationModal(false);
                  setShowTransactionTracking(false);
                }}
              >
                Live Heatmap
              </button>
              <button 
                className={`px-3 py-2 text-left ${activeTab === 'needs' ? 'bg-blue-900 rounded' : ''}`}
                onClick={() => { 
                  setActiveTab('needs'); 
                  toggleMobileMenu(); 
                  setShowDetailedNeed(null);
                  setShowAllNeeds(false);
                  setShowDonationModal(false);
                  setShowTransactionTracking(false);
                }}
              >
                Verified Needs
              </button>
              <button 
                className={`px-3 py-2 text-left ${activeTab === 'analytics' ? 'bg-blue-900 rounded' : ''}`}
                onClick={() => { 
                  setActiveTab('analytics'); 
                  toggleMobileMenu(); 
                  setShowDetailedNeed(null);
                  setShowAllNeeds(false);
                  setShowDonationModal(false);
                  setShowTransactionTracking(false);
                }}
              >
                Analytics
              </button>
              <button 
                className="px-3 py-2 text-left"
                onClick={() => { 
                  trackDonation(); 
                  toggleMobileMenu(); 
                }}
              >
                Track Donation
              </button>
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Filter bar */}
        {renderFilterBar()}
        
        {activeTab === 'map' && !showDonationModal && !showTransactionTracking && !showAllNeeds && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Map visualization with Leaflet */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Humanitarian Need Heatmap</h2>
                <p className="text-sm text-gray-500">Visualizing high-need areas across Malaysia</p>
              </div>
              
              <div className="p-0 h-96 relative">
                <MapComponent 
                  regions={mockRegions} 
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  getMarkerColor={getMarkerColor}
                />
                
                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-md shadow-md z-10">
                  <div className="text-xs font-medium mb-2">Need Index</div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span className="text-xs">Critical (80-100)</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs">High (60-79)</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">Medium (40-59)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">Low (0-39)</span>
                  </div>
                </div>
                
                {/* Help button */}
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-600 hover:bg-gray-100 z-10">
                  <HelpCircle size={18} />
                </button>
              </div>
            </div>
            
            {/* Region details */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Region Details</h2>
                <p className="text-sm text-gray-500">Select a region on the map to view details</p>
              </div>
              
              {selectedRegion ? (
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-medium">{selectedRegion.name}</h3>
                      <div className="flex items-center mt-1">
                        <MapPin size={16} className="text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">Malaysia</span>
                      </div>
                    </div>
                    <div className={`${getNeedIndexColor(selectedRegion.needIndex)} text-white px-3 py-1 rounded-full font-medium`}>
                      Need Index: {selectedRegion.needIndex}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Population</h4>
                      <p className="font-medium">{selectedRegion.population.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Recent Cases</h4>
                      <p className="font-medium">{selectedRegion.cases}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Primary Needs</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedRegion.causes.map((cause, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {cause.charAt(0).toUpperCase() + cause.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Recent Verified Needs</h4>
                      <div className="space-y-2 mt-1">
                        {regionNeeds.slice(0, 2).map(need => (
                          <div key={need.id} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-sm">{need.title}</div>
                              <div className={`${getUrgencyColor(need.urgency)} text-white text-xs rounded-full px-2 py-0.5`}>
                                {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">{need.description}</p>
                            <button 
                              onClick={() => showDonation(need.id)}
                              className="text-blue-600 text-xs mt-2 flex items-center"
                            >
                              Donate now <ArrowRight size={12} className="ml-1" />
                            </button>
                          </div>
                        ))}
                        
                        {regionNeeds.length > 2 && (
                          <button 
                            onClick={() => setShowAllNeeds(true)} 
                            className="text-blue-600 text-sm flex items-center mt-2"
                          >
                            Show all {regionNeeds.length} needs <ArrowRight size={16} className="ml-1" />
                          </button>
                        )}
                        
                        {regionNeeds.length === 0 && (
                          <div className="text-sm text-gray-500">No verified needs found for this region.</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <button 
                        onClick={() => setSelectedRegion(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Back to Map
                      </button>
                      
                      <button 
                        onClick={handleViewAllNeeds}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        View All Needs
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <MapPin size={48} className="mx-auto" />
                  </div>
                  <p className="text-sm text-gray-500">Select a region on the map to view detailed information.</p>
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <button
                      onClick={trackDonation}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ArrowRight size={16} className="mr-2" />
                      Track an existing donation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'needs' && !showDonationModal && !showTransactionTracking && !showAllNeeds && renderNeedsTab()}
        
        {activeTab === 'analytics' && !showDonationModal && !showTransactionTracking && !showAllNeeds && renderAnalyticsTab()}
      </main>
      
      {/* Donation Modal */}
      {showDonationModal && showDetailedNeed && (
        <DonationComponent 
          need={detailedNeedData[showDetailedNeed]}
          onClose={() => setShowDonationModal(false)}
          onDonationComplete={handleDonationComplete}
        />
      )}
      
      {/* Transaction Tracking Modal */}
      {showTransactionTracking && currentTransactionId && (
        <TransactionTrackingComponent 
          transactionId={currentTransactionId}
          onClose={() => setShowTransactionTracking(false)}
        />
      )}
      
      {/* Modals */}
      {showDetailedNeed && !showDonationModal && renderDetailedNeedView()}
      {renderRegionNeedsView()}
      
      {/* Footer */}
      <footer className={`bg-gray-800 text-white py-8 ${showDonationModal || showTransactionTracking || showAllNeeds ? 'hidden' : ''}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle size={22} />
                <h2 className="text-xl font-bold">ReliefResource</h2>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">Real-time humanitarian need tracking for Malaysia. Connecting resources to the people who need them most.</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li><a href="#" className="hover:text-white">Documentation</a></li>
                    <li><a href="#" className="hover:text-white">API Access</a></li>
                    <li><a href="#" className="hover:text-white">Training</a></li>
                    <li><a href="#" className="hover:text-white">Research</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Support</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li><a href="#" className="hover:text-white">Help Center</a></li>
                    <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white">FAQs</a></li>
                    <li><a href="#" className="hover:text-white">Community</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Legal</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white">Data Usage</a></li>
                    <li><a href="#" className="hover:text-white">Compliance</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-300 flex flex-col md:flex-row justify-between items-center">
            <div>© 2025 ReliefResource. All rights reserved.</div>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white mr-4">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-white mr-4">Terms</a>
              <a href="#" className="text-gray-300 hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}