export const categories = ['All', 'Renovation', 'Interior', 'Furniture', 'Plumbing', 'Electrical', 'Construction'];

export const feedProjects = [
  { id: 1, title: 'Modern Kitchen Renovation', category: 'Renovation', images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'], costRange: '₹3,50,000 - ₹5,00,000', materials: ['Italian Marble', 'Teak Wood', 'SS Hardware'], timeline: '45 days', company: 'BuildCraft India', companyId: 1, likes: 234, saves: 89, description: 'Complete kitchen overhaul with modular cabinets, granite countertops, and smart lighting.' },
  { id: 2, title: 'Luxury Living Room Interior', category: 'Interior', images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'], costRange: '₹5,00,000 - ₹8,00,000', materials: ['Walnut Veneer', 'Imported Fabric', 'LED Panels'], timeline: '60 days', company: 'DesignHub Studios', companyId: 2, likes: 456, saves: 167, description: 'Elegant living room with custom furniture, ambient lighting, and premium wall paneling.' },
  { id: 3, title: 'Custom Wardrobe & Study', category: 'Furniture', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'], costRange: '₹1,50,000 - ₹2,50,000', materials: ['Plywood BWR', 'Laminate Finish', 'Soft-close Hinges'], timeline: '20 days', company: 'WoodWorks Pro', companyId: 3, likes: 178, saves: 45, description: 'Space-saving wardrobe with integrated study desk and bookshelves.' },
  { id: 4, title: 'Complete Home Wiring', category: 'Electrical', images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600'], costRange: '₹80,000 - ₹1,50,000', materials: ['Havells Wire', 'Legrand Switches', 'Anchor Panels'], timeline: '15 days', company: 'PowerGrid Solutions', companyId: 4, likes: 92, saves: 34, description: 'Full home electrical rewiring with smart switch integration and safety compliance.' },
  { id: 5, title: 'Bathroom Renovation', category: 'Plumbing', images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600'], costRange: '₹2,00,000 - ₹3,50,000', materials: ['Jaquar Fittings', 'Kajaria Tiles', 'Waterproofing Membrane'], timeline: '25 days', company: 'AquaFix Plumbers', companyId: 5, likes: 145, saves: 56, description: 'Complete bathroom makeover with rain shower, wall-hung toilet, and heated flooring.' },
  { id: 6, title: '3BHK Full Construction', category: 'Construction', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'], costRange: '₹25,00,000 - ₹40,00,000', materials: ['UltraTech Cement', 'TATA Steel TMT', 'AAC Blocks'], timeline: '8 months', company: 'BuildCraft India', companyId: 1, likes: 567, saves: 234, description: 'Complete 3BHK residential construction from foundation to finishing.' },
];

export const companies = [
  { id: 1, name: 'BuildCraft India', logo: '🏗️', location: 'Mumbai, Maharashtra', experience: 12, services: ['Construction', 'Renovation'], rating: 4.8, reviews: 234, completedProjects: 189, successRate: 96, gstVerified: true, licensed: true, platformVerified: true, description: 'Leading construction company specializing in residential and commercial projects.' },
  { id: 2, name: 'DesignHub Studios', logo: '🎨', location: 'Bangalore, Karnataka', experience: 8, services: ['Interior', 'Furniture'], rating: 4.9, reviews: 178, completedProjects: 145, successRate: 98, gstVerified: true, licensed: true, platformVerified: true, description: 'Award-winning interior design studio with modern aesthetics.' },
  { id: 3, name: 'WoodWorks Pro', logo: '🪵', location: 'Jaipur, Rajasthan', experience: 15, services: ['Furniture', 'Interior'], rating: 4.7, reviews: 156, completedProjects: 312, successRate: 94, gstVerified: true, licensed: true, platformVerified: true, description: 'Master craftsmen creating bespoke furniture since 2009.' },
  { id: 4, name: 'PowerGrid Solutions', logo: '⚡', location: 'Delhi NCR', experience: 10, services: ['Electrical'], rating: 4.6, reviews: 98, completedProjects: 456, successRate: 97, gstVerified: true, licensed: true, platformVerified: true, description: 'Certified electrical contractors for residential and commercial projects.' },
  { id: 5, name: 'AquaFix Plumbers', logo: '🔧', location: 'Chennai, Tamil Nadu', experience: 7, services: ['Plumbing', 'Renovation'], rating: 4.5, reviews: 87, completedProjects: 234, successRate: 93, gstVerified: true, licensed: false, platformVerified: true, description: 'Professional plumbing services with 24/7 emergency support.' },
  { id: 6, name: 'GreenBuild Eco', logo: '🌱', location: 'Pune, Maharashtra', experience: 5, services: ['Construction', 'Renovation'], rating: 4.8, reviews: 67, completedProjects: 78, successRate: 99, gstVerified: true, licensed: true, platformVerified: true, description: 'Eco-friendly construction using sustainable materials and practices.' },
];

export const materialPrices = [
  { name: 'UltraTech Cement (50kg)', price: 380, change: +2.1, brand: 'UltraTech', category: 'Cement', history: [365, 370, 372, 375, 378, 380] },
  { name: 'ACC Cement (50kg)', price: 370, change: -0.5, brand: 'ACC', category: 'Cement', history: [360, 365, 372, 375, 373, 370] },
  { name: 'Ambuja Cement (50kg)', price: 375, change: +1.2, brand: 'Ambuja', category: 'Cement', history: [362, 365, 368, 370, 373, 375] },
  { name: 'TATA Steel TMT 8mm (kg)', price: 72, change: +3.5, brand: 'TATA', category: 'Steel', history: [65, 67, 68, 70, 71, 72] },
  { name: 'JSW Steel TMT 10mm (kg)', price: 70, change: +2.8, brand: 'JSW', category: 'Steel', history: [64, 65, 67, 68, 69, 70] },
  { name: 'SAIL TMT 12mm (kg)', price: 68, change: -1.2, brand: 'SAIL', category: 'Steel', history: [65, 67, 69, 70, 69, 68] },
  { name: 'Teak Wood (cu.ft)', price: 3500, change: +5.2, brand: 'Grade A', category: 'Wood', history: [3200, 3250, 3300, 3400, 3450, 3500] },
  { name: 'Sal Wood (cu.ft)', price: 1800, change: +1.8, brand: 'Grade A', category: 'Wood', history: [1700, 1720, 1750, 1770, 1790, 1800] },
  { name: 'Plywood BWR 18mm (sheet)', price: 1450, change: -0.8, brand: 'Century', category: 'Wood', history: [1400, 1420, 1440, 1460, 1455, 1450] },
  { name: 'Havells Wire 1.5mm (90m)', price: 2200, change: +1.5, brand: 'Havells', category: 'Electrical', history: [2100, 2120, 2150, 2170, 2190, 2200] },
  { name: 'Legrand Switch (unit)', price: 180, change: 0, brand: 'Legrand', category: 'Electrical', history: [175, 178, 180, 180, 180, 180] },
  { name: 'Jaquar Basin Mixer', price: 4500, change: -2.1, brand: 'Jaquar', category: 'Plumbing', history: [4800, 4700, 4650, 4600, 4550, 4500] },
  { name: 'CPVC Pipe 1" (3m)', price: 320, change: +3.0, brand: 'Astral', category: 'Plumbing', history: [295, 300, 305, 310, 315, 320] },
];

export const quotationRequests = [
  { id: 'QR001', title: '2BHK Interior Design', serviceType: 'Interior', area: '1200 sq.ft', budget: '₹6,00,000 - ₹8,00,000', timeline: '3 months', status: 'Active', bids: 5, date: '2024-01-15', materials: ['Teak Wood', 'Italian Marble', 'Imported Fittings'], description: 'Complete interior design for 2BHK apartment including living room, bedrooms, kitchen, and bathrooms.' },
  { id: 'QR002', title: 'Kitchen Renovation', serviceType: 'Renovation', area: '150 sq.ft', budget: '₹2,00,000 - ₹3,50,000', timeline: '45 days', status: 'Active', bids: 8, date: '2024-01-18', materials: ['Granite Countertop', 'SS Hardware', 'Modular Fittings'], description: 'Complete kitchen renovation with modular design.' },
  { id: 'QR003', title: 'Complete Wiring', serviceType: 'Electrical', area: '1800 sq.ft', budget: '₹1,00,000 - ₹1,50,000', timeline: '15 days', status: 'Closed', bids: 3, date: '2024-01-10', materials: ['Havells Wire', 'Legrand Switches'], description: 'Rewiring for entire house with smart switches.' },
];

export const bids = [
  { id: 'B001', quotationId: 'QR001', companyId: 1, companyName: 'BuildCraft India', totalPrice: 720000, laborCost: 250000, materialCost: 400000, otherCost: 70000, timeline: '75 days', warranty: '2 years', rating: 4.8, status: 'pending' },
  { id: 'B002', quotationId: 'QR001', companyId: 2, companyName: 'DesignHub Studios', totalPrice: 680000, laborCost: 220000, materialCost: 390000, otherCost: 70000, timeline: '90 days', warranty: '3 years', rating: 4.9, status: 'pending' },
  { id: 'B003', quotationId: 'QR001', companyId: 3, companyName: 'WoodWorks Pro', totalPrice: 750000, laborCost: 280000, materialCost: 410000, otherCost: 60000, timeline: '60 days', warranty: '5 years', rating: 4.7, status: 'pending' },
  { id: 'B004', quotationId: 'QR002', companyId: 1, companyName: 'BuildCraft India', totalPrice: 280000, laborCost: 90000, materialCost: 160000, otherCost: 30000, timeline: '40 days', warranty: '2 years', rating: 4.8, status: 'pending' },
  { id: 'B005', quotationId: 'QR002', companyId: 6, companyName: 'GreenBuild Eco', totalPrice: 310000, laborCost: 100000, materialCost: 175000, otherCost: 35000, timeline: '35 days', warranty: '3 years', rating: 4.8, status: 'pending' },
];

export const activeProjects = [
  { id: 'P001', title: '2BHK Interior Design', company: 'DesignHub Studios', status: 'Work in Progress', progress: 65, startDate: '2024-02-01', expectedEnd: '2024-04-15', milestones: [
    { name: 'Planning & Design', status: 'completed', date: '2024-02-10' },
    { name: 'Material Procurement', status: 'completed', date: '2024-02-25' },
    { name: 'Carpentry Work', status: 'in-progress', date: '2024-03-15' },
    { name: 'Painting & Finishing', status: 'pending', date: '2024-04-01' },
    { name: 'Final Inspection', status: 'pending', date: '2024-04-15' },
  ]},
];

export const previousProjects = [
  { id: 'PP001', title: 'Bathroom Renovation', company: 'AquaFix Plumbers', completedDate: '2023-12-20', totalCost: '₹2,80,000', rating: 4.5, hasWarranty: true, warrantyExpiry: '2025-12-20' },
  { id: 'PP002', title: 'Home Wiring', company: 'PowerGrid Solutions', completedDate: '2023-11-15', totalCost: '₹1,20,000', rating: 4.8, hasWarranty: true, warrantyExpiry: '2025-11-15' },
];

export const adminStats = {
  totalUsers: 12450,
  totalCompanies: 856,
  activeProjects: 1234,
  totalRevenue: '₹4.5 Cr',
  projectSuccessRate: 94.5,
  avgQuotationValue: '₹3,80,000',
  monthlyGrowth: 12.5,
  disputes: 23,
};

export const companyRevenue = {
  totalEarnings: '₹45,60,000',
  monthlyData: [
    { month: 'Aug', revenue: 320000 },
    { month: 'Sep', revenue: 450000 },
    { month: 'Oct', revenue: 380000 },
    { month: 'Nov', revenue: 520000 },
    { month: 'Dec', revenue: 480000 },
    { month: 'Jan', revenue: 610000 },
  ],
  activeProjects: 8,
  completedProjects: 45,
  commission: '₹2,28,000',
};
