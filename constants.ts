
import { Entity, Deal, NewsItem, PortfolioCompany, FundMetrics, NetworkDeal } from './types';

// Helper to generate random financial data for the PitchBook look
const getRandomAUM = () => {
  const ranges = ['$10M', '$50M', '$100M', '$250M', '$500M', '$1B', '$5B+'];
  return ranges[Math.floor(Math.random() * ranges.length)];
};

const getRandomDeals = () => Math.floor(Math.random() * 50) + 1;

// Full parsed dataset from CSV
const RAW_INVESTORS = [
  { name: "[sīc] Ventures", location: "San Francisco, CA", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue, Growth", desc: "We invest in emerging markets startups.", website: "https://www.sicstudio.org/ventures/ventures" },
  { name: "1 4 All Group", location: "Dubai, UAE", type: "Angel network", focus: "Early Revenue, Scaling, Growth", desc: "We invest in Financial, Consumer, Healthcare, Energy/Mining/Industrials, IT/Media, and Infrastructure sectors.", website: "https://1-4-all.group/" },
  { name: "01 Ventures", location: "Amsterdam, NL", type: "VC", focus: "Prototype, Early Revenue", desc: "We invest in deep tech innovations including software and hardware solutions to the world's biggest challenges.", website: "https://www.01ventures.com/" },
  { name: "1Sharpe Ventures", location: "Oakland, CA", type: "VC", focus: "Prototype, Early Revenue, Idea or Patent", desc: "We invest in Fintech, Real Estate Tech, Proptech, Architecture, Engineering, Construction, Supply Chain, Logistics.", website: "https://www.1sharpe.ventures/" },
  { name: "1st Course Capital", location: "Redwood City, CA", type: "VC", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in business model and technology innovations across the food supply chain.", website: "https://www.1cc.vc/" },
  { name: "2|Twelve", location: "Tiburon, CA", type: "VC", focus: "Prototype, Early Revenue", desc: "We invest in B2B, Enterprise, SaaS, B2B Fintech at seed stage.", website: "https://212angels.com" },
  { name: "3CC Third Culture Capital", location: "Boston, MA", type: "VC", focus: "Early Revenue, Scaling, Prototype, Idea or Patent", desc: "We invest in diverse founders who innovate at the intersection of culture and healthcare delivery.", website: "https://3cc.io" },
  { name: "3cubed VC", location: "San Francisco, CA", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue, Growth", desc: "We invest in AI, Fintech, Blockchain Tech, Enterprise Software, Consumer Internet, Health Tech.", website: "https://3cubed.vc" },
  { name: "3one4 Capital", location: "Bengaluru, India", type: "VC", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in SaaS, Enterprise & SMB Automation, Fintech, Consumer Internet, and Digital Health.", website: "https://www.3one4capital.com" },
  { name: "3VC", location: "Vienna, Austria", type: "VC", focus: "Early Revenue, Scaling", desc: "We invest in AI, dev tools, deep tech, security, AR/VR, data analytics, digital health.", website: "https://www.three.vc/" },
  { name: "4F Ventures", location: "Remote, CA", type: "VC", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in traditionally overlooked founders building seed-stage eCommerce and FinTech companies.", website: "https://4fventures.com/" },
  { name: "4impact", location: "The Hague, Netherlands", type: "VC", focus: "Prototype, Early Revenue", desc: "We invest in European software startups that achieve tangible positive impact in environment, health, or inclusion.", website: "https://www.4impact.vc/" },
  { name: "7percent Ventures", location: "London, UK", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in frontier (deeptech) and transformative technologies.", website: "http://www.7percent.vc" },
  { name: "9Unicorns", location: "Mumbai, India", type: "VC", focus: "Early Revenue, Scaling, Prototype, Idea or Patent", desc: "We invest in early stage startups across all sectors.", website: "https://www.9unicorns.in/" },
  { name: "10D", location: "Tel Aviv, Israel", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in Israeli and Israeli-related exceptional entrepreneurs, from early-stage to Seed and Series A rounds.", website: "https://www.10d.vc/" },
  { name: "10K Ventures", location: "Berlin, Germany", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in early stage startups and funds globally.", website: "https://www.10kventures.co/" },
  { name: "10x Founders", location: "Munich, Germany", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in the most ambitious tech founders in pre/seed across Europe and the US.", website: "https://www.10xfounders.com/" },
  { name: "10X Venture Partners", location: "Manchester, NH", type: "Angel network", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in SaaS, AI, Artificial Intelligence, CV, Computer Vision SportsTech, CyberSecurity.", website: "https://10xvp.com" },
  { name: "11 Tribes Ventures", location: "Chicago, IL", type: "VC", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in purpose driven entrepreneurs that are creating category defining technologies.", website: "https://11tribes.vc/" },
  { name: "13o3", location: "London, UK", type: "PE fund", focus: "Pre-IPO, Growth, Scaling, Early Revenue, Prototype", desc: "We invest in IoT, Blockchain, Real Estate, Media, B2B Saas, Clean Energy, Supply Chain.", website: "https://13o3.com" },
  { name: "14Peaks Capital", location: "Cham, Switzerland", type: "VC", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in Pre-Seed, Seed and Series A B2B SaaS startups in Fintech and Future of Work.", website: "https://www.14peaks.capital/" },
  { name: "20 Ventures", location: "Rome, Italy", type: "Startup studio", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in disruptive ideas and talented people. Venture Builder focused on pre-seed stage.", website: "http://20v.it/" },
  { name: "27V (Twenty Seven Ventures)", location: "Cayman Islands", type: "VC", focus: "Prototype, Idea or Patent, Early Revenue", desc: "We invest in global EdTech and Future of Work startups at the Pre-Seed/Seed stages.", website: "https://twentyseven.ventures/" },
  { name: "30N Ventures", location: "Santiago, Chile", type: "VC", focus: "Early Revenue, Scaling, Growth", desc: "We invest in Fintech, Foodtech, and Retail startups at Late Seed and Series A stages.", website: "https://30n.vc" },
  { name: "35 North Ventures", location: "Mumbai, India", type: "VC", focus: "Growth, Pre-IPO", desc: "We invest in early growth-stage companies, Pre-Series A and above.", website: "https://www.35northventures.com/" },
  { name: "42CAP", location: "Munich, Germany", type: "VC", focus: "Early Revenue, Prototype", desc: "We invest in seed-stage tech- and data-driven B2B software companies across Europe.", website: "https://www.42cap.com/" },
  { name: "43North", location: "Buffalo, NY", type: "Incubator", focus: "Early Revenue, Scaling", desc: "We invest in startups that have a full-time founding team, are generating revenue, and have raised outside capital.", website: "https://www.43north.org/" },
  { name: "44 Capital Management", location: "New York, NY", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue, Scaling", desc: "We invest in companies at the intersection of Blockchain + real estate / emerging proptech.", website: "https://www.44.capital/" },
  { name: "50 Partners Capital", location: "Paris, France", type: "Angel network", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We only invest in the companies accelerated by 50 Partners.", website: "http://www.50partners.fr/" },
  { name: "70V", location: "Vilnius, Lithuania", type: "VC", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in B2B SaaS / Enterprise software companies with ACV > 2kEUR and outbound sales strategies.", website: "https://www.70v.com/" },
  { name: "77 Partners", location: "Brisbane, Australia", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in ambitious Australian founders leveraging FrontierTech including AI & Machine Learning.", website: "https://www.77partners.vc/" },
  { name: "100X.VC", location: "Mumbai, India", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in all sectors focused on writing the first cheque in Indian pre-seed / seed-stage startups.", website: "https://www.100x.vc" },
  { name: "115K", location: "Paris, France", type: "Corporate VC", focus: "Early Revenue, Scaling", desc: "We invest in B2B SaaS with a focus on Fintech, Insurtech, Cybersecurity, Data and AI.", website: "https://www.115k.fr/" },
  { name: "128vc", location: "Lexington, MA", type: "VC", focus: "Early Revenue, Scaling", desc: "We invest in AI B2B software companies in North America.", website: "https://www.128vc.com" },
  { name: "212", location: "Istanbul, Turkey", type: "VC", focus: "Scaling, Growth", desc: "We invest in Series A with an average ticket size of €1-5 million and are looking for B2B tech solutions.", website: "https://212.vc/" },
  { name: "360 Capital", location: "Paris, France", type: "VC", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in early-stage, innovative deeptech & digital enterprises across Europe.", website: "https://www.360cap.vc/" },
  { name: "500 Global", location: "San Francisco, CA", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue, Scaling, Growth", desc: "We invest in companies in markets where technology, innovation, and capital can unlock long-term value.", website: "https://500.co/" },
  { name: "645 Ventures", location: "New York City, USA", type: "VC", focus: "Early Revenue, Prototype, Scaling", desc: "We invest in tech-enabled businesses across SaaS, Citizen Professionals, Engineering Value Chain, and Consumer Tech.", website: "https://645ventures.com/" },
  { name: "Aezist", location: "Miami, FL", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue, Scaling, Growth", desc: "We invest in B2B freight-tech, insurance-tech, synthetic biology, energy, mobility, space.", website: "https://www.aezist.com/" },
  { name: "Alecla7", location: "Milan, Italy", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue, Scaling", desc: "We invest in VC opportunities globally, we are geography and industry agnostic.", website: "https://www.alecla7.com/" },
  { name: "American Prudential Capital", location: "Houston, TX", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in B2B companies in Texas and other states. No crypto, no cannabis.", website: "https://apccash.com/" },
  { name: "AQAL Capital", location: "Munich, Germany", type: "Family office", focus: "Early Revenue, Prototype, Scaling", desc: "We invest in state-of-the-art exponential technology companies which have the potential for integral impact.", website: "https://aqalcapital.com" },
  { name: "Arcarian Capital", location: "Dublin, Ireland", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in retail, hospitality, professional services, financial services, consumer products.", website: "https://www.arcariancapital.com/" },
  { name: "Aston Capital", location: "Coral Gables, FL", type: "Family office", focus: "Early Revenue, Pre-IPO, Growth", desc: "We invest across all areas.", website: "http://www.astoncapital.net/" },
  { name: "Autonom Ventures", location: "Bucharest, Romania", type: "Family office", focus: "Growth, Scaling, Early Revenue", desc: "We invest in DevOps, Fintech, Mobility, EV Mobility startups", website: "https://holding.ro/" },
  { name: "Barkawi Group", location: "Munich, Germany", type: "Family office", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in ventures who are reshaping global supply chains through technology", website: "https://barkawi.com/" },
  { name: "Blue 9 Capital", location: "New York, USA", type: "Family office", focus: "Early Revenue, Scaling", desc: "We invest in FinTech, Ecommerce Tech, and blockchain startups", website: "https://www.blue9capital.com/" },
  { name: "Bluesky Equities", location: "Calgary, Canada", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in global B2B technology companies with >$0 ARR.", website: "http://www.blueskyequities.com/" },
  { name: "C2 Capital", location: "London, UK", type: "VC", focus: "Early Revenue, Scaling, Growth", desc: "We invest in technology oriented businesses, solving real-world problems.", website: "https://www.c2capital.org/" },
  { name: "CIG", location: "Kyiv, Ukraine", type: "Family office", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in startups with strong teams and good traction.", website: "https://cig.vc/en" },
  { name: "CreedCap", location: "Bangalore, India", type: "Family office", focus: "Early Revenue, Scaling", desc: "We invest in Consumer, SaaS, CleanTech, HealthTech", website: "https://www.creedcapasia.com/" },
  { name: "D Squared Capital", location: "London, UK", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in growth stage businesses", website: "https://www.dsquaredcap.com/" },
  { name: "Dinare Ventures", location: "Dubai, UAE", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in early stage startups in the MENA region", website: "https://dinareventures.com/" },
  { name: "EcoMachines Ventures", location: "London, UK", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in early-stage startups with the focus on: fintech, blockchain, hardware.", website: "http://ecomachinesventures.com" },
  { name: "Endurance Companies", location: "San Francisco, CA", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in a range of categories with an emphasis on very early stage startups.", website: "https://www.endurancecos.com/" },
  { name: "Evolem Start", location: "Lyon, France", type: "Family office", focus: "Early Revenue, Scaling", desc: "We invest in all types of early stage startups with some revenue, a bold vision for societal impact.", website: "https://www.evolem.com/" },
  { name: "Foray Capital", location: "Dubai, UAE", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in early stage teams building in AI, deep-tech, AR/VR domains.", website: "https://www.foray.capital/" },
  { name: "HashedHealth", location: "Nashville, TN", type: "Startup studio", focus: "Prototype, Idea or Patent, Early Revenue", desc: "We invest in blockchain, healthcare, ai", website: "https://hashedhealth.com/" },
  { name: "ID Capital", location: "Singapore", type: "Family office", focus: "Prototype, Early Revenue", desc: "We invest in transformative agritech and foodtech startups.", website: "https://www.idcapital.com.sg/" },
  { name: "Jaiatech Ventures", location: "Bangalore, India", type: "Family office", focus: "Early Revenue, Prototype, Scaling", desc: "We invest in disruptive innovation", website: "https://www.jtventures.in/" },
  { name: "Jib Ventures", location: "Amherst, NY", type: "Angel network", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in companies building an interoperable future of proactive and patient-centered healthcare.", website: "https://www.linkedin.com/in/dfrancojib/" },
  { name: "K for Capital", location: "Paris, France", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in early stage tech companies in AI, biotech, and foodtech.", website: "https://kfor.capital" },
  { name: "Knockout Capital", location: "Los Angeles, CA", type: "Family office", focus: "Growth, Pre-IPO", desc: "We invest in startups defined by automation and platforms that scale.", website: "https://knockout.capital" },
  { name: "Lemonade Stand", location: "Tallinn, Estonia", type: "Family office", focus: "Prototype, Early Revenue", desc: "We invest in Baltic and East European founders working on impactful B2B software solutions.", website: "https://lemonadestand.ee" },
  { name: "Lyall Ventures", location: "London, UK", type: "Family office", focus: "Early Revenue, Scaling", desc: "We invest in AI, tech, early-stage up to before series A.", website: "https://www.linkedin.com/company/lyall-ventures" },
  { name: "Malpani Ventures", location: "Mumbai, India", type: "Family office", focus: "Prototype, Early Revenue", desc: "We invest in early revenue/ traction India focused companies across software/ SAAS.", website: "https://www.malpaniventures.com" },
  { name: "Mava Ventures", location: "New York, USA", type: "Family office", focus: "Prototype, Early Revenue, Idea or Patent", desc: "We invest in early-stage (angel, pre-seed, seed) US-based B2B SaaS and B2B FinTech startups.", website: "http://mavavc.com/" },
  { name: "MGA Ventures", location: "Mumbai, India", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in Consumer, Fintech and SaaS at early-stage.", website: "https://mgaventures.in" },
  { name: "Meyer Global Management", location: "New York, NY", type: "Family office", focus: "Pre-IPO, Growth, Scaling", desc: "We invest in US-based B2B companies in manufacturing, energy, transportation.", website: "https://www.meyerglobalmgmt.com" },
  { name: "MFO Ventures", location: "Delray Beach, FL", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in growing early-stage and middle-market healthcare services and healthcare technology companies.", website: "https://www.mfoventures.com/" },
  { name: "Montechiaro Consultants", location: "Miami, FL", type: "Family office", focus: "Prototype, Early Revenue", desc: "We invest in startups with practical applications, particularly in fields like healthcare and fintech.", website: "https://www.montechiaroconsultants.com" },
  { name: "NEON Adventures", location: "London, UK", type: "Family office", focus: "Early Revenue, Scaling", desc: "We invest in consumer internet companies with early traction.", website: "https://neon.com" },
  { name: "No Brand", location: "Sydney, Australia", type: "Family office", focus: "Early Revenue, Scaling", desc: "We invest in Australian or New Zealand startups in Seed or Series A rounds.", website: "https://www.nbrnd.com/" },
  { name: "NYVP New York Venture Partners", location: "New York, NY", type: "Family office", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in the team first early on but the more traction the better.", website: "http://www.nyvp.com/" },
  { name: "Octava", location: "Singapore", type: "Family office", focus: "Early Revenue, Scaling", desc: "We invest in fintech and AI software startups that have generated revenue.", website: "https://octava.sg/" },
  { name: "Orion Bridge Capital", location: "Singapore", type: "Family office", focus: "Prototype, Early Revenue, Scaling", desc: "We invest into early-stage startups aiming to address critical issues and inconveniences at scale.", website: "https://obc.capital/" },
  { name: "Otium Capital", location: "Paris, France", type: "Family office", focus: "Early Revenue, Prototype, Scaling", desc: "We invest in ambitious founders across EU/US from Pre-Seed to LBO.", website: "https://www.otiumcapital.com/" },
  { name: "Poligono Capital", location: "Zapopan, Mexico", type: "Family office", focus: "Early Revenue, Scaling", desc: "We invest in early stages startups, with a MVP, no matter what location they are.", website: "https://www.poligonocapital.com/" },
  { name: "Randev Ventures", location: "Dubai, UAE", type: "Family office", focus: "Prototype, Idea or Patent, Early Revenue", desc: "We invest in B2B Emerging technology, Deeptech, SaaS, Cleantech, and Web3.", website: "https://www.randevventures.com" },
  { name: "RCR Investing", location: "Tampa, FL", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in all sectors post-revenue. RCR Investing is a family owned holding & investment company.", website: "https://www.rcrinvesting.com/" },
  { name: "Rhodium Ventures", location: "Tel Aviv, Israel", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in Internet & Impact, globally", website: "https://www.rhodium.co.il/" },
  { name: "Rushworth Investments", location: "London, UK", type: "Family office", focus: "Prototype, Early Revenue, Scaling", desc: "We invest in revenue-generating ventures with growth momentum.", website: "https://www.rushworthinvestments.com/" },
  { name: "Sabban Corp Investment", location: "Dubai, UAE", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in Fintech, Manufacturing, Agriculture, Software, IoT, Logistics, Edtech", website: "https://sabbancorp.com" },
  { name: "Saber Capital", location: "Vienna, Austria", type: "Family office", focus: "Early Revenue, Scaling", desc: "We invest in early stage startups with proven traction.", website: "https://saber.wien/" },
  { name: "Seed + Speed Ventures", location: "Berlin, Germany", type: "Family office", focus: "Prototype, Early Revenue, Idea or Patent", desc: "We invest in pre-seed and seed stage software startups in Germany, Switzerland and Austria.", website: "https://www.seedandspeed.com/" },
  { name: "Secways", location: "Barcelona, Spain", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in post-revenue startups.", website: "https://secways.com" },
  { name: "Small Ventures USA", location: "Houston, TX", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in three broad areas: Energy, Technology, Entertainment.", website: "https://www.smallventuresusa.com/" },
  { name: "Solid Bond Capital", location: "Chorley, UK", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in UK Pre-Seed stage businesses. Ranging from pre-revenue/MVP to early traction.", website: "https://www.solidbond.com/" },
  { name: "Stephen Industries", location: "Helsinki, Finland", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in companies creating innovative Healthtech, Deeptech and Greentech solutions.", website: "https://www.stephenindustries.com/" },
  { name: "Strategic Group", location: "Calgary, Canada", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in Founders and companies solving real problems in our world.", website: "https://www.strategicgroup.ca/venture-capital" },
  { name: "Sur Ventures", location: "San Francisco, CA", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in companies that develop technology we find both innovative and insightful.", website: "https://sur.vc/" },
  { name: "Titan Capital", location: "Gurugram, India", type: "Family office", focus: "Early Revenue, Prototype, Idea or Patent", desc: "We invest in early-stage companies with a valuation cap of $6M USD. Sector agnostic.", website: "https://www.titancapital.vc/" },
  { name: "Tushiconcept", location: "Tbilisi, Georgia", type: "Family office", focus: "Early Revenue, Prototype, Idea or Patent", desc: "We invest in FinTech, EdTech, LegalTech, and BioTech.", website: "https://www.tushiconcept.co/" },
  { name: "UCEA Capital Partners", location: "London, UK", type: "Family office", focus: "Early Revenue, Scaling, Growth", desc: "We invest in sports, real estate, technology, renewable energy and healthcare", website: "https://ucea.pt/" },
  { name: "Vulpes Investment Management", location: "Singapore", type: "Family office", focus: "Early Revenue, Prototype, Scaling", desc: "We invest in Biotech, Diagnostics", website: "https://vulpesinvest.com/" },
  { name: "Wei Capital Management", location: "Santa Clara, CA", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in Deep tech, comparable public listed companies that have a market cap of beyond $100 Billion.", website: "https://www.weicapitalmanagement.com/" },
  { name: "YAP Capital", location: "Munich, Germany", type: "Family office", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in core infrastructure projects, decentralized finance (DeFi), Metaverse.", website: "https://www.yapcapital.ventures/" },
  { name: "YYM Ventures", location: "Nashville, TN", type: "Family office", focus: "Prototype, Early Revenue", desc: "We invest in early-stage cybersecurity startups", website: "http://www.yemin-family.com" },
  { name: "Zell Capital", location: "Columbus, OH", type: "VC", focus: "Prototype, Early Revenue", desc: "We invest in early-stage startups, using our Value Investment Thesis to filter opportunities.", website: "https://zellcapital.com" },
  { name: "Zentynel", location: "Santiago, Chile", type: "VC", focus: "Early Revenue, Prototype, Scaling", desc: "We invest in biotech-based companies with a strong relation to Latinamerica.", website: "https://zentynel.com/" },
  { name: "Zephyr Angels", location: "Skopje, North Macedonia", type: "Angel network", focus: "Prototype, Early Revenue", desc: "We invest in all industries", website: "https://zephyr.mk/" },
  { name: "Zest Investments", location: "Milan, Italy", type: "VC", focus: "Idea or Patent, Prototype, Early Revenue", desc: "We invest in cutting-edge technologies that are reshaping markets and society.", website: "https://zestgroup.vc/en" },
  { name: "ZILHive Ventures", location: "Singapore", type: "VC", focus: "Prototype, Early Revenue", desc: "We invest in Global Blockchain startups with prototypes building on the Zilliqa Blockchain.", website: "https://zilhive.org/ventures/" },
  { name: "ZWC Partners", location: "Hong Kong", type: "VC", focus: "Scaling, Early Revenue, Prototype", desc: "We invest in early growth stage startups in China and early stage in Southeast Asia.", website: "https://www.zwcpartners.com/" }
];

// Enrich entities with random AUM and Deal Count
export const MOCK_ENTITIES: Entity[] = [
  // Preserving a few non-investors for diversity in filtering
  {
    id: 'advisor-1',
    name: 'Growth Catalysts M&A',
    type: 'ADVISOR',
    description: 'Buy-side advisory for first-time searchers. We help you find the needle in the haystack.',
    location: 'Chicago, IL',
    focusAreas: ['Deal Sourcing', 'Valuation', 'Negotiation', 'Advisor'],
    contactEmail: 'info@growthcat-example.com',
    website: 'https://example.com',
    rating: 4.2,
    dealCount: 45
  },
  {
    id: 'legal-1',
    name: 'LegalEase Advisors',
    type: 'LEGAL',
    description: 'Full-service M&A legal counsel for search funds. From LOI to closing, we ensure your interests are protected.',
    location: 'New York, NY',
    focusAreas: ['M&A', 'Due Diligence', 'Contract Law', 'Legal'],
    contactEmail: 'contact@legalease-example.com',
    website: 'https://example.com',
    rating: 4.9,
    dealCount: 120
  },
  // Spread raw investors
  ...RAW_INVESTORS.map((inv, idx) => ({
    id: `inv-${idx + 100}`,
    name: inv.name,
    type: 'INVESTOR', // Core type for the app is INVESTOR
    description: inv.desc,
    location: inv.location,
    // Add the specific investor subtype (Family office, VC) to focus areas so filters work
    focusAreas: [...inv.focus.split(',').map(s => s.trim()), inv.type],
    minCheckSize: '$50,000', // Mock data for now as CSV had varied formats
    maxCheckSize: '$5,000,000',
    contactEmail: 'contact@example.com', // Placeholder
    website: inv.website,
    rating: (Math.random() * 2 + 3).toFixed(1) as unknown as number, // Random rating 3.0-5.0
    aum: getRandomAUM(),
    dealCount: getRandomDeals()
  }))
] as Entity[];

export const MOCK_DEALS: Deal[] = [
  {
    id: '101',
    title: 'Project Bluebird',
    companyName: 'Acme Logistics',
    industry: 'Logistics',
    revenue: '$5.2M',
    ebitda: '$1.1M',
    stage: 'LOI',
    description: 'Regional logistics provider with a fleet of 50 trucks and stable contracts.',
    notes: 'Seller is motivated. Diligence ongoing.',
    documents: [
      { id: 'd1', name: 'CIM_Project_Bluebird.pdf', uploadDate: '2023-10-01', size: '2.4MB', type: 'PDF' },
      { id: 'd2', name: 'Financials_2022.xlsx', uploadDate: '2023-10-05', size: '1.1MB', type: 'EXCEL' }
    ]
  },
  {
    id: '102',
    title: 'Project Codebase',
    companyName: 'DevTools Inc',
    industry: 'SaaS',
    revenue: '$2.8M',
    ebitda: '$0.8M',
    stage: 'SOURCING',
    description: 'Niche developer tool for API management. High margins, low churn.',
    notes: 'Initial outreach sent via broker.',
    documents: []
  },
  {
    id: '103',
    title: 'Project Care',
    companyName: 'Elderly Home Care LLC',
    industry: 'Healthcare',
    revenue: '$8.5M',
    ebitda: '$1.9M',
    stage: 'DILIGENCE',
    description: 'Multi-location home care provider in the Midwest.',
    notes: 'QofE pending. Legal review started.',
    documents: [
      { id: 'd3', name: 'QofE_Draft.pdf', uploadDate: '2023-10-20', size: '5.6MB', type: 'PDF' }
    ]
  }
];

// Mock Network Deal Flow
export const MOCK_NETWORK_DEALS: NetworkDeal[] = [
  {
    id: 'nd-1',
    title: 'Project Sky High',
    type: 'M&A',
    amount: '$15M',
    sector: 'Aerospace Components',
    description: 'Tier 2 aerospace supplier looking for exit. EBITDA $3M.',
    postedDate: '2024-11-20'
  },
  {
    id: 'nd-2',
    title: 'Series B - FinTech AI',
    type: 'Company Round',
    amount: '$25M',
    sector: 'FinTech',
    description: 'Rapidly growing AI-driven credit scoring platform for emerging markets.',
    postedDate: '2024-11-22'
  },
  {
    id: 'nd-3',
    title: 'Global Trade Export Facility',
    type: 'Trade Finance',
    amount: '$50M',
    sector: 'Logistics / Commodities',
    description: 'Structured trade finance opportunity for agricultural exports in SEA.',
    postedDate: '2024-11-24'
  },
  {
    id: 'nd-4',
    title: 'Solar Farm Development',
    type: 'Project Finance',
    amount: '$120M',
    sector: 'Energy',
    description: 'Utility-scale solar project in Arizona seeking debt/equity mix.',
    postedDate: '2024-11-18'
  },
  {
    id: 'nd-5',
    title: 'SaaS Rollup Opportunity',
    type: 'M&A',
    amount: '$8M',
    sector: 'Vertical SaaS',
    description: 'Portfolio of 3 profitable micro-SaaS tools in the HR tech space.',
    postedDate: '2024-11-25'
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Global PE Dry Powder Hits Record $2.6 Trillion',
    source: 'PitchBook Wire',
    date: '2024-11-25',
    summary: 'Private equity firms are sitting on record levels of unspent capital as dealmaking stabilizes in Q4, signaling a potential surge in 2025 acquisitions.',
    url: '#',
    tags: ['Private Equity', 'Market Data', 'Capital']
  },
  {
    id: 'n2',
    title: 'Search Fund "Nova Capital" Acquires Midwest Manufacturing Giant',
    source: 'M&A Today',
    date: '2024-11-25',
    summary: 'In the largest traditional search fund deal of the quarter, Nova Capital has acquired a leading precision manufacturing firm for $45M.',
    url: '#',
    tags: ['M&A', 'Search Funds', 'Manufacturing']
  },
  {
    id: 'n3',
    title: 'SEC Adopts New Private Fund Adviser Rules',
    source: 'Regulatory Watch',
    date: '2024-11-25',
    summary: 'New transparency requirements regarding quarterly statements and audit rules for private fund advisers officially take effect today.',
    url: '#',
    tags: ['Regulation', 'SEC', 'Compliance']
  },
  {
    id: 'n4',
    title: 'Tech Valuations Stabilize: SaaS Multiples Hold at 6.5x Revenue',
    source: 'SaaS Metrics Daily',
    date: '2024-11-25',
    summary: 'After a volatile year, B2B SaaS valuation multiples show signs of bottoming out, providing clarity for both buyers and sellers.',
    url: '#',
    tags: ['SaaS', 'Valuations', 'Tech']
  },
  {
    id: 'n5',
    title: 'Blackstone Closes $5B Life Sciences Fund V',
    source: 'BioPharma Dive',
    date: '2024-11-25',
    summary: 'Blackstone completes fundraising for its latest life sciences vehicle, exceeding its initial target by $500M.',
    url: '#',
    tags: ['Life Sciences', 'Fundraising', 'Blackstone']
  }
];

// Fund Manager Portfolio Mock Data
export const MOCK_PORTFOLIO: PortfolioCompany[] = [
  {
    id: 'port-1',
    name: 'NexGen Composites',
    sector: 'Manufacturing',
    vintage: '2019',
    investmentDate: '2019-06-15',
    initialInvestment: 5.0,
    currentValue: 12.5,
    ownershipPercentage: 35,
    moic: 2.5,
    irr: 22.4,
    status: 'Active',
    boardSeat: true,
    lastValuationDate: '2024-09-30',
    revenue: '$32.5M',
    ebitda: '$4.2M',
    documents: [
        { id: 'd1', name: 'CIM_NexGen_Final.pdf', uploadDate: '2019-05-01', size: '3.1MB', type: 'PDF' },
        { id: 'd2', name: 'Q3_2024_Financials.xlsx', uploadDate: '2024-10-15', size: '1.2MB', type: 'EXCEL' },
        { id: 'd3', name: 'Board_Deck_Sept2024.pdf', uploadDate: '2024-09-28', size: '5.5MB', type: 'PDF' }
    ],
    goals: [
        { id: 'g1', title: 'Expand to European Market', deadline: '2025-06-30', status: 'On Track', progress: 65 },
        { id: 'g2', title: 'Hire new CFO', deadline: '2024-12-31', status: 'At Risk', progress: 30 },
        { id: 'g3', title: 'Implement ERP System', deadline: '2024-08-30', status: 'Completed', progress: 100 }
    ]
  },
  {
    id: 'port-2',
    name: 'CloudScale Logistics',
    sector: 'Software / Logistics',
    vintage: '2020',
    investmentDate: '2020-02-10',
    initialInvestment: 3.2,
    currentValue: 4.1,
    ownershipPercentage: 20,
    moic: 1.28,
    irr: 8.5,
    status: 'Active',
    boardSeat: false,
    lastValuationDate: '2024-09-30',
    revenue: '$8.2M',
    ebitda: '$0.5M',
    documents: [
        { id: 'd4', name: 'Shareholder_Agreement.pdf', uploadDate: '2020-02-10', size: '1.8MB', type: 'PDF' }
    ],
    goals: [
        { id: 'g4', title: 'Reach $10M ARR', deadline: '2025-03-31', status: 'On Track', progress: 80 }
    ]
  },
  {
    id: 'port-3',
    name: 'BioPure Health',
    sector: 'Healthcare Services',
    vintage: '2018',
    investmentDate: '2018-11-01',
    initialInvestment: 4.5,
    currentValue: 18.0,
    ownershipPercentage: 45,
    moic: 4.0,
    irr: 38.1,
    status: 'Active',
    boardSeat: true,
    lastValuationDate: '2024-09-30',
    revenue: '$45.0M',
    ebitda: '$9.8M',
    documents: [
        { id: 'd5', name: 'CIM_BioPure.pdf', uploadDate: '2018-10-01', size: '4.2MB', type: 'PDF' },
        { id: 'd6', name: '2023_Audit_Report.pdf', uploadDate: '2024-03-15', size: '2.9MB', type: 'PDF' }
    ],
    goals: [
        { id: 'g5', title: 'Acquire Competitor X', deadline: '2025-01-31', status: 'Delayed', progress: 40 },
        { id: 'g6', title: 'Launch Telehealth Division', deadline: '2023-11-01', status: 'Completed', progress: 100 }
    ]
  },
  {
    id: 'port-4',
    name: 'Urban Retail Group',
    sector: 'Consumer',
    vintage: '2017',
    investmentDate: '2017-05-20',
    initialInvestment: 2.0,
    currentValue: 0.5,
    ownershipPercentage: 15,
    moic: 0.25,
    irr: -25.0,
    status: 'Write-off',
    boardSeat: false,
    lastValuationDate: '2023-12-31',
    revenue: '$2.1M',
    ebitda: '-$0.5M',
    documents: [],
    goals: []
  },
  {
    id: 'port-5',
    name: 'SecureNet AI',
    sector: 'Cybersecurity',
    vintage: '2021',
    investmentDate: '2021-08-15',
    initialInvestment: 6.0,
    currentValue: 10.2,
    ownershipPercentage: 25,
    moic: 1.7,
    irr: 19.5,
    status: 'Active',
    boardSeat: true,
    lastValuationDate: '2024-09-30',
    revenue: '$12.5M',
    ebitda: '-$1.2M',
    documents: [
        { id: 'd7', name: 'Series_A_Deck.pdf', uploadDate: '2021-08-01', size: '8.5MB', type: 'PDF' }
    ],
    goals: [
        { id: 'g7', title: 'Release Enterprise V2', deadline: '2024-12-31', status: 'On Track', progress: 90 }
    ]
  },
  {
    id: 'port-6',
    name: 'GreenField Energy',
    sector: 'Energy',
    vintage: '2016',
    investmentDate: '2016-03-10',
    initialInvestment: 3.0,
    currentValue: 15.0,
    ownershipPercentage: 100, // Full exit simulation context usually, but keeping as 'Active' record for tracking history or partial exit
    moic: 5.0,
    irr: 45.0,
    status: 'Exited',
    boardSeat: false,
    lastValuationDate: '2022-06-15',
    revenue: '$0',
    ebitda: '$0',
    documents: [],
    goals: []
  }
];

export const MOCK_FUND_METRICS: FundMetrics = {
  aum: 150, // 150M
  deployedCapital: 85.5,
  tvpi: 2.15,
  dpi: 0.45,
  netIrr: 24.8,
  activeCompanies: 4
};
