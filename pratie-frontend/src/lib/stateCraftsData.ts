export interface StateCraft {
  name: string;
  slug: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East' | 'Union Territory';
  crafts: string[];
  summary: string;
  description: string;
  featuredWear: string;
  image: string;
  badge?: string;
  isPopular?: boolean;
}

export const STATE_CRAFTS_DIRECTORY: StateCraft[] = [
  // --- EAST ---
  {
    name: 'Bihar',
    slug: 'Bihar',
    region: 'East',
    crafts: ['Madhubani/Mithila Painting', 'Sujini'],
    summary: 'Mithila handpainted folklore & Sujini quilt needlework on pure Bhagalpuri Tussar silk.',
    description: 'Ancestral folk art crafted by women artisans of Mithila using bamboo nibs and natural vegetable pigments, depicting celestial motifs on fine wild Tussar silks.',
    featuredWear: 'Mithila Handpainted Tussar Saree',
    image: '/images/products/mithila-handpainted-tussar-silk-saree.jpeg',
    badge: 'GI-Certified Tussar Silk',
    isPopular: true
  },
  {
    name: 'West Bengal',
    slug: 'West Bengal',
    region: 'East',
    crafts: ['Kantha', 'Jamdani', 'Baluchari'],
    summary: 'Legendary sheer Jamdani muslin, narrative Baluchari silk weaves, and intricate Kantha needlework.',
    description: 'Centuries of Bengal artistry featuring fine mythological Baluchari pallus and diaphanous Jamdani motifs woven on wooden pit-looms.',
    featuredWear: 'Baluchari Mythological Silk Saree',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    badge: 'Bengal Master Weaves',
    isPopular: true
  },
  {
    name: 'Odisha',
    slug: 'Odisha',
    region: 'East',
    crafts: ['Sambalpuri/Ikat', 'Pattachitra', 'Bomkai'],
    summary: 'Hypnotic tie-dye double Ikat Bandha weaves, Bomkai borders, and sacred Pattachitra motifs.',
    description: 'Vibrant resist-dyed yarns arranged with mathematical precision by Bhulia weavers to form sacred motifs and conch shells.',
    featuredWear: 'Sambalpuri Double-Ikat Silk Saree',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Bandha',
    isPopular: true
  },
  {
    name: 'Jharkhand',
    slug: 'Jharkhand',
    region: 'East',
    crafts: ['Sohrai/Khovar', 'Tasar Silk'],
    summary: 'Tribal mud-resist ceremonial Sohrai murals translated onto indigenous wild Tasar silks.',
    description: 'Indigenous mural traditions celebrating nature and harvest, rendered as wearable art with organic earth tones on crisp Tasar silk.',
    featuredWear: 'Sohrai Handpainted Tasar Drape',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'Indigenous Tasar Loom'
  },

  // --- NORTH ---
  {
    name: 'Uttar Pradesh',
    slug: 'Uttar Pradesh',
    region: 'North',
    crafts: ['Chikankari', 'Banarasi', 'Zardozi'],
    summary: 'Imperial pit-loom pure Katan silks with real gold Kadwa zari jaal and Lucknowi shadow Chikankari.',
    description: 'The pinnacle of royal courts: Kashi pit-loom weavers executing intricate floating zari brocades, and Lucknowi artisans creating delicate gossamer white-on-white embroidery with Mukaish.',
    featuredWear: 'Imperial Banarasi Kadwa Brocade Saree',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Banaras Brocade',
    isPopular: true
  },
  {
    name: 'Rajasthan',
    slug: 'Rajasthan',
    region: 'North',
    crafts: ['Bandhej', 'Bagru Print', 'Sanganeri Print', 'Blue Pottery', 'Pichwai'],
    summary: 'Royal Jaipur Gota Patti applique, sacred Nathdwara Pichwai, fine Bandhej wave tie-dyes, and hand-block prints.',
    description: 'From the desert ateliers of Marwar: master dyers tie microscopic knots for imperial Bandhej, complemented by hand-beaten gold ribbon Gota Patti on diaphanous georgettes.',
    featuredWear: 'Royal Bandhej Gota Patti Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'Royal Marwar Ateliers',
    isPopular: true
  },
  {
    name: 'Jammu & Kashmir',
    slug: 'Jammu & Kashmir',
    region: 'North',
    crafts: ['Pashmina', 'Kashmiri Embroidery'],
    summary: 'Pure Changthangi cashmere Pashmina adorned with intricate needle-drawn Sozni and real metallic Tilla wire.',
    description: 'Spun from the high-altitude down of Himalayan goats, handwoven on pinewood looms and delicately embroidered by Srinagar master ustads over months of meditative craftsmanship.',
    featuredWear: 'Royal Tilla Kashmiri Pashmina Shawl & Suit',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Kashmir Pashmina',
    isPopular: true
  },
  {
    name: 'Punjab',
    slug: 'Punjab',
    region: 'North',
    crafts: ['Phulkari'],
    summary: 'Vibrant geometric silk floss embroidery crafted on handspun khaddar drapes.',
    description: 'The flower-work of Punjab: geometric and floral motifs embroidered from the reverse with untreated pat (silk floss), representing blessing and prosperity.',
    featuredWear: 'Heritage Patiala Bagh Phulkari Dupatta & Suit',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Phulkari'
  },
  {
    name: 'Himachal Pradesh',
    slug: 'Himachal Pradesh',
    region: 'North',
    crafts: ['Kullu Shawls', 'Chamba Rumal'],
    summary: 'Geometric interlocking border shawls from Kullu valley and double-sided needle painted Chamba Rumals.',
    description: 'Finely spun indigenous wool handwoven on fly-shuttle frame looms with vibrant Himalayan temple borders.',
    featuredWear: 'Kullu Heritage Pure Wool Handwoven Kurta Suit Set',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Kullu'
  },
  {
    name: 'Haryana',
    slug: 'Haryana',
    region: 'North',
    crafts: ['Phulkari (regional)', 'Panja Durries'],
    summary: 'Regional heirloom Phulkari textiles and heavy flat-weave Panja handloom durries.',
    description: 'Sturdy handloom traditions passed down over generations, featuring bold geometric motifs and artisanal endurance.',
    featuredWear: 'Haryana Heritage Bagh Phulkari Georgette Festive Suit',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Uttarakhand',
    slug: 'Uttarakhand',
    region: 'North',
    crafts: ['Aipan'],
    summary: 'Sacred ritual geometric Aipan designs and handspun high-altitude wool shawls.',
    description: 'Kumaoni geometric ritual motifs rendered in white rice paste over ochre bases, inspiring celestial borders.',
    featuredWear: 'Kumaoni Pichora Ceremonial Festive Silk Saree',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Ladakh',
    slug: 'Ladakh',
    region: 'North',
    crafts: ['Pashmina Wool Weaving'],
    summary: 'Extreme high-altitude nomadic Changpa Pashmina wool harvesting and indigenous loom weaving.',
    description: 'Raw mountain luxury: pure unadulterated cashmere fleece spun by nomadic tribes along the Changthang plateau.',
    featuredWear: 'Ladakhi Goncha Royal Silk Brocade Suit Set',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'Nomadic Alpine Heritage'
  },

  // --- WEST ---
  {
    name: 'Gujarat',
    slug: 'Gujarat',
    region: 'West',
    crafts: ['Bandhani', 'Patola', 'Ajrakh', 'Kutch Embroidery'],
    summary: 'World-renowned Patan double-Ikat, 16-stage indigo Ajrakh resist blocks, and mirror-work needlecraft.',
    description: 'The crown jewel of Indian weaving: Patan Patola takes months of master mathematical calculations to align dyed warp and weft, while Kutch Ajrakh harnesses sacred geometry and river minerals.',
    featuredWear: 'Patan Double-Ikat Pure Silk Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Patola & Ajrakh',
    isPopular: true
  },
  {
    name: 'Maharashtra',
    slug: 'Maharashtra',
    region: 'West',
    crafts: ['Paithani', 'Warli'],
    summary: 'Imperial gold zari tapestry borders, Morbangadi peacock pallus, and tribal Warli story patterns.',
    description: 'The royal drape of the Peshwas: woven with pure mulberry silk and solid fine gold zari tapestry pallus featuring the iconic kaleidoscopic peacock motif.',
    featuredWear: 'Royal Paithani Peacock Zari Silk Saree',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Paithani',
    isPopular: true
  },
  {
    name: 'Goa',
    slug: 'Goa',
    region: 'West',
    crafts: ['Kunbi Weave'],
    summary: 'The historic coastal check weave in natural red earth and unbleached cotton.',
    description: 'Worn by the indigenous Kunbi and Gawda tribal women, revived today as an emblem of sustainable minimalist coastal haute couture.',
    featuredWear: 'Revived Kunbi Handspun Cotton Saree',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85'
  },

  // --- CENTRAL ---
  {
    name: 'Madhya Pradesh',
    slug: 'Madhya Pradesh',
    region: 'Central',
    crafts: ['Chanderi', 'Maheshwari', 'Bagh Print', 'Gond Art'],
    summary: 'Featherlight silk-cotton Chanderi with ashrafi coin bootis, Narmada river Maheshwari borders, and Bagh hand-blocks.',
    description: 'Woven for royal dynasties: gossamer transparent Chanderi with gold zari bootis, and reversible Maheshwari borders designed under Queen Ahilyabai Holkar.',
    featuredWear: 'Pure Chanderi Silk-Cotton Zari Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Chanderi & Maheshwari',
    isPopular: true
  },
  {
    name: 'Chhattisgarh',
    slug: 'Chhattisgarh',
    region: 'Central',
    crafts: ['Bastar Dhokra', 'Kosa Silk'],
    summary: 'Wild forest Kosa silk drapes handspun from silkworm cocoons and lost-wax metal tribal motifs.',
    description: 'Harvested from deep Sal forests, natural gold-hued Kosa silk is cherished worldwide for its organic cooling texture and rich natural sheen.',
    featuredWear: 'Wild Forest Kosa Silk Saree',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    badge: 'Forest GI Kosa Silk'
  },

  // --- SOUTH ---
  {
    name: 'Tamil Nadu',
    slug: 'Tamil Nadu',
    region: 'South',
    crafts: ['Kanchipuram', 'Chettinad', 'Sungudi'],
    summary: 'Heavy mulberry temple silks with interlocking Korvai zari borders and intricate Chettinad checks.',
    description: 'The queen of silks: handwoven using three single-shuttle weavers who interlock contrasting temple borders with pure dipped gold and silver zari.',
    featuredWear: 'Imperial Korvai Kanchipuram Bridal Saree',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Kanjeevaram',
    isPopular: true
  },
  {
    name: 'Andhra Pradesh',
    slug: 'Andhra Pradesh',
    region: 'South',
    crafts: ['Kalamkari'],
    summary: 'Freehand kalam pen-drawn mythological tapestries with natural tamarind twig charcoal and vegetable dyes.',
    description: 'Srikalahasti artisans hand-paint temple epics with bamboo pens and natural milk baths, creating breathable masterpieces that last generations.',
    featuredWear: 'Srikalahasti Freehand Kalamkari Silk Saree',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Kalamkari',
    isPopular: true
  },
  {
    name: 'Karnataka',
    slug: 'Karnataka',
    region: 'South',
    crafts: ['Ilkal', 'Kasuti', 'Mysore Silk'],
    summary: 'Chiki Paras red border Ilkal drapes, Mysore royal palace crepes, and Kasuti single-thread needlework.',
    description: 'Refined royal elegance: pure Mysore crepe silk kissed with tested gold zari, accompanied by Kasuti needlework mirroring temple spires.',
    featuredWear: 'Royal Mysore Crepe Silk Saree',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Mysore Silk',
    isPopular: true
  },
  {
    name: 'Kerala',
    slug: 'Kerala',
    region: 'South',
    crafts: ['Kasavu'],
    summary: 'Pristine unbleached ecru cotton accented with radiant pure gold zari temple borders.',
    description: 'The timeless purity of Gods Own Country: handspun fine cotton bathed in natural spring water, edged with gleaming gold thread for ceremonial grace.',
    featuredWear: 'Balaramapuram Pure Kasavu Zari Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Balaramapuram Kasavu'
  },
  {
    name: 'Telangana',
    slug: 'Telangana',
    region: 'South',
    crafts: ['Pochampally Ikat', 'Gadwal'],
    summary: 'Precision geometric Chowka double-Ikat patterns and contrasting zari-attached Gadwal silks.',
    description: 'Known as the Silk City: Pochampally weavers bundle and dye silk threads before loom setting, generating razor-sharp diamond geometrics.',
    featuredWear: 'Pochampally Chowka Double-Ikat Silk Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Pochampally'
  },

  // --- NORTH-EAST ---
  {
    name: 'Assam',
    slug: 'Assam',
    region: 'North-East',
    crafts: ['Muga Silk', 'Mekhela Chador'],
    summary: 'The naturally golden, glossy Muga silk reserved historically for Ahom royalty, woven into two-piece Mekhela Chador.',
    description: 'Found exclusively in the Brahmaputra valley: wild Muga silk fibers grow more golden and lustrous with every wash, lasting more than a century.',
    featuredWear: 'Pure Golden Muga Silk Mekhela Chador',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Assam Muga Silk',
    isPopular: true
  },
  {
    name: 'Meghalaya',
    slug: 'Meghalaya',
    region: 'North-East',
    crafts: ['Eri Silk (Ryndia)'],
    summary: 'Cruelty-free peace silk handspun into thermal, soft, organic heritage wraps.',
    description: 'Known as Ahimsa silk because silkworms leave the cocoon unharmed. Woven by Khasi and Ri-Bhoi women into warm, organic, hand-dyed shawls.',
    featuredWear: 'Meghalaya Organic Ryndia Eri Peace Silk Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'Ahimsa Peace Silk'
  },
  {
    name: 'Manipur',
    slug: 'Manipur',
    region: 'North-East',
    crafts: ['Moirang Phee', 'Manipuri Weaves'],
    summary: 'Temple stepped motif Moirang Phee shawls handwoven on indigenous waist loin looms.',
    description: 'A regal royal weave honoring the temple spires of Lord Ibudhou Thangjing, hand-embroidered with precision needlecraft.',
    featuredWear: 'Moirang Phee Handwoven Silk Saree',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Moirang Phee'
  },
  {
    name: 'Nagaland',
    slug: 'Nagaland',
    region: 'North-East',
    crafts: ['Naga Shawls'],
    summary: 'Bold symbolic tribal backstrap loin-loom shawls honoring courage and community honor.',
    description: 'Handwoven on primitive backstrap looms using natural hand-dyed cotton and wild nettle fibers with distinct tribal heraldic motifs.',
    featuredWear: 'Nagaland Angami Handwoven Silk Mekhela Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    badge: 'GI-Certified Naga Shawls'
  },
  {
    name: 'Mizoram',
    slug: 'Mizoram',
    region: 'North-East',
    crafts: ['Mizo Puan'],
    summary: 'The celebratory ceremonial handwoven wrap in vibrant black, white, and crimson stripes.',
    description: 'Traditional wrap-around skirts woven with fine intricate multi-colored cross-borders, worn during the Cheraw festival.',
    featuredWear: 'Mizoram Puanchei Handloom Ceremonial Festive Suit',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Arunachal Pradesh',
    slug: 'Arunachal Pradesh',
    region: 'North-East',
    crafts: ['Tribal Handloom Weaves'],
    summary: 'Sacred geometric backstrap loom textiles in organic madder and bark dyes.',
    description: 'Woven by Apatani and Monpa artisans featuring bold diamond chevron patterns representing mountain ridges and tribal totems.',
    featuredWear: 'Arunachal Mechuka Valley Handwoven Eri Silk Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Tripura',
    slug: 'Tripura',
    region: 'North-East',
    crafts: ['Risa (Handwoven Cloth)'],
    summary: 'Indigenous ceremonial chest wrap woven with delicate floral and geometric borders.',
    description: 'An integral symbol of Tripuri heritage, woven on miniature loin looms with natural cotton and shimmering silk accents.',
    featuredWear: 'Tripura Pachra & Rignai Ceremonial Silk Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Sikkim',
    slug: 'Sikkim',
    region: 'North-East',
    crafts: ['Traditional Handicrafts (Thangka-influenced motifs)'],
    summary: 'Buddhism-inspired sacred cloud and lotus motifs woven into handloom stoles and coats.',
    description: 'Rooted in Himalayan spiritual traditions, featuring fine wool and silk tapestries adorned with the eight auspicious signs.',
    featuredWear: 'Sikkimese Handwoven Brocade Honju & Bakhu Suit Set',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'
  },

  // --- UNION TERRITORIES ---
  {
    name: 'Delhi',
    slug: 'Delhi',
    region: 'Union Territory',
    crafts: ['Zardozi (workshop hub, not native craft)'],
    summary: 'The grand Mughal capital workshop hub for high-density heavy metallic gold Zardozi embroidery.',
    description: 'The historical patron seat of imperial karkhanas where master craftsmen embroider real silver and gold-gilt threads onto bridal velvet and raw silk.',
    featuredWear: 'Old Delhi Imperial Zardozi Metallic Silk Suit Set',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    badge: 'Imperial Workshop Atelier'
  },
  {
    name: 'Puducherry',
    slug: 'Puducherry',
    region: 'Union Territory',
    crafts: ['Limited native textile tradition'],
    summary: 'French-influenced coastal handspun cottons and organic khadi drapes.',
    description: 'A serene union of Coromandel coastal weaving traditions with Franco-Tamil aesthetic minimalism in unbleached organic textures.',
    featuredWear: 'Auroville Heritage Organic Khadi Saree',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85'
  },
  {
    name: 'Andaman & Nicobar Islands',
    slug: 'Andaman & Nicobar Islands',
    region: 'Union Territory',
    crafts: ['No major native textile tradition'],
    summary: 'Indigenous island organic fiber weaving and mother-of-pearl artisanal adornments.',
    description: 'Coastal eco-luxury: sustainable woven cane, palm fibers, and shell embroidery embellishments crafted by island artisan collectives.',
    featuredWear: 'Andaman Coastal Coromandel Khadi Silk Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'
  }
];

export const REGIONS_LIST = [
  'All Regions',
  'North',
  'South',
  'East',
  'West',
  'Central',
  'North-East',
  'Union Territory'
] as const;
