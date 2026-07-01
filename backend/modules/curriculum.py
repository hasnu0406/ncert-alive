from bson import ObjectId
from database import cached_content_collection, progress_collection

# Detailed NCERT chapter lists for CBSE Classes 6 to 12
CURRICULUM_DATA = {
    # ─── MIDDLE SCHOOL (CLASSES 6, 7, 8) ─────────────────────────────
    6: {
        "mathematics": [
            "Knowing Our Numbers",
            "Whole Numbers",
            "Playing with Numbers",
            "Basic Geometrical Ideas",
            "Understanding Elementary Shapes",
            "Integers",
            "Fractions",
            "Decimals",
            "Data Handling",
            "Mensuration",
            "Algebra",
            "Ratio and Proportion"
        ],
        "science": [
            "Components of Food",
            "Sorting Materials into Groups",
            "Separation of Substances",
            "Getting to Know Plants",
            "Body Movements",
            "The Living Organisms and their Surroundings",
            "Motion and Measurement of Distances",
            "Light, Shadows and Reflections",
            "Electricity and Circuits",
            "Fun with Magnets",
            "Air Around Us"
        ],
        "social_science": [
            "What, Where, How and When? (History)",
            "From Hunting-Gathering to Growing Food (History)",
            "In the Earliest Cities (History)",
            "The Earth in the Solar System (Geography)",
            "Globe: Latitudes and Longitudes (Geography)",
            "Motions of the Earth (Geography)",
            "Understanding Diversity (Civics)",
            "Diversity and Discrimination (Civics)"
        ],
        "english": [
            "Who Did Patrick's Homework?",
            "How the Dog Found Himself a New Master!",
            "Taro's Reward",
            "An Indian-American Woman in Space",
            "A Different Kind of School",
            "Who I Am"
        ],
        "hindi": [
            "वह चिड़िया जो",
            "बचपन",
            "नादान दोस्त",
            "चाँद से थोड़ी सी गप्पें",
            "अक्षरों का महत्व"
        ]
    },
    7: {
        "mathematics": [
            "Integers",
            "Fractions and Decimals",
            "Data Handling",
            "Simple Equations",
            "Lines and Angles",
            "The Triangle and its Properties",
            "Comparing Quantities",
            "Rational Numbers",
            "Perimeter and Area",
            "Algebraic Expressions",
            "Exponents and Powers",
            "Symmetry"
        ],
        "science": [
            "Nutrition in Plants",
            "Nutrition in Animals",
            "Heat",
            "Acids, Bases and Salts",
            "Physical and Chemical Changes",
            "Respiration in Organisms",
            "Transportation in Animals and Plants",
            "Reproduction in Plants",
            "Motion and Time",
            "Electric Current and its Effects",
            "Light"
        ],
        "social_science": [
            "Tracing Changes Through a Thousand Years (History)",
            "New Kings and Kingdoms (History)",
            "The Delhi Sultans (History)",
            "Environment (Geography)",
            "Inside Our Earth (Geography)",
            "Our Changing Earth (Geography)",
            "On Equality (Civics)",
            "Role of the Government in Health (Civics)"
        ],
        "english": [
            "Three Questions",
            "A Gift of Chappals",
            "Gopal and the Hilsa Fish",
            "The Ashes That Made Trees Bloom",
            "Quality",
            "Expert Detectives"
        ],
        "hindi": [
            "हम पंछी उन्मुक्त गगन के",
            "दादी माँ",
            "हिमालय की बेटियाँ",
            "कठपुतली",
            "मीठाईवाला"
        ]
    },
    8: {
        "mathematics": [
            "Rational Numbers",
            "Linear Equations in One Variable",
            "Understanding Quadrilaterals",
            "Data Handling",
            "Squares and Square Roots",
            "Cubes and Cube Roots",
            "Comparing Quantities",
            "Algebraic Expressions and Identities",
            "Mensuration",
            "Exponents and Powers",
            "Direct and Inverse Proportions",
            "Factorisation",
            "Introduction to Graphs"
        ],
        "science": [
            "Crop Production and Management",
            "Microorganisms: Friend and Foe",
            "Coal and Petroleum",
            "Combustion and Flame",
            "Conservation of Plants and Animals",
            "Reproduction in Animals",
            "Reaching the Age of Adolescence",
            "Force and Pressure",
            "Friction",
            "Sound",
            "Chemical Effects of Electric Current",
            "Some Natural Phenomena",
            "Light"
        ],
        "social_science": [
            "How, When and Where (History)",
            "From Trade to Territory (History)",
            "Ruling the Countryside (History)",
            "Resources (Geography)",
            "Land, Soil, Water, Natural Vegetation (Geography)",
            "The Indian Constitution (Civics)",
            "Understanding Secularism (Civics)"
        ],
        "english": [
            "The Best Christmas Present in the World",
            "The Tsunami",
            "Glimpses of the Past",
            "Bepin Choudhury's Lapse of Memory",
            "The Summit Within"
        ],
        "hindi": [
            "ध्वनि",
            "लाख की चूड़ियाँ",
            "बस की यात्रा",
            "दीवानों की हस्ती",
            "चिट्ठियों की अनूठी दुनिया"
        ]
    },
    
    # ─── HIGH SCHOOL (CLASSES 9, 10) ─────────────────────────────────
    9: {
        "mathematics": [
            "Number Systems",
            "Polynomials",
            "Coordinate Geometry",
            "Linear Equations in Two Variables",
            "Introduction to Euclid's Geometry",
            "Lines and Angles",
            "Triangles",
            "Quadrilaterals",
            "Circles",
            "Heron's Formula",
            "Surface Areas and Volumes",
            "Statistics"
        ],
        "science": [
            "Matter in Our Surroundings",
            "Is Matter Around Us Pure?",
            "Atoms and Molecules",
            "Structure of the Atom",
            "The Fundamental Unit of Life",
            "Tissues",
            "Motion",
            "Force and Laws of Motion",
            "Gravitation",
            "Work and Energy",
            "Sound",
            "Improvement in Food Resources"
        ],
        "social_science": [
            "The French Revolution (History)",
            "Socialism in Europe and the Russian Revolution (History)",
            "India - Size and Location (Geography)",
            "Physical Features of India (Geography)",
            "What is Democracy? Why Democracy? (Political Science)",
            "Constitutional Design (Political Science)",
            "The Story of Village Palampur (Economics)",
            "People as Resource (Economics)"
        ],
        "english": [
            "The Fun They Had",
            "The Sound of Music",
            "The Little Girl",
            "A Truly Beautiful Mind",
            "The Snake and the Mirror",
            "My Childhood"
        ],
        "hindi": [
            "दो बैलों की कथा",
            "ल्हासा की ओर",
            "उपभोक्तावाद की संस्कृति",
            "सांवले सपनों की याद"
        ]
    },
    10: {
        "mathematics": [
            "Real Numbers",
            "Polynomials",
            "Pair of Linear Equations in Two Variables",
            "Quadratic Equations",
            "Arithmetic Progressions",
            "Triangles",
            "Coordinate Geometry",
            "Introduction to Trigonometry",
            "Some Applications of Trigonometry",
            "Circles",
            "Areas Related to Circles",
            "Surface Areas and Volumes",
            "Statistics",
            "Probability"
        ],
        "science": [
            "Chemical Reactions and Equations",
            "Acids, Bases and Salts",
            "Metals and Non-metals",
            "Carbon and its Compounds",
            "Life Processes",
            "Control and Coordination",
            "How do Organisms Reproduce?",
            "Heredity and Evolution",
            "Light - Reflection and Refraction",
            "The Human Eye and the Colorful World",
            "Electricity",
            "Magnetic Effects of Electric Current",
            "Our Environment"
        ],
        "social_science": [
            "The Rise of Nationalism in Europe (History)",
            "Nationalism in India (History)",
            "Resources and Development (Geography)",
            "Forest and Wildlife Resources (Geography)",
            "Power Sharing (Political Science)",
            "Federalism (Political Science)",
            "Development (Economics)",
            "Sectors of the Indian Economy (Economics)"
        ],
        "english": [
            "A Letter to God",
            "Nelson Mandela: Long Walk to Freedom",
            "Two Stories about Flying",
            "From the Diary of Anne Frank",
            "Glimpses of India"
        ],
        "hindi": [
            "सूरदास के पद",
            "राम-लक्ष्मण-परशुराम संवाद",
            "नेताजी का चश्मा",
            "बालगोबिन भगत"
        ]
    },
    
    # ─── SENIOR SECONDARY (CLASSES 11, 12) ───────────────────────────
    11: {
        "physics": [
            "Units and Measurements",
            "Motion in a Straight Line",
            "Motion in a Plane",
            "Laws of Motion",
            "Work, Energy and Power",
            "System of Particles and Rotational Motion",
            "Gravitation",
            "Mechanical Properties of Solids",
            "Mechanical Properties of Fluids",
            "Thermal Properties of Matter",
            "Thermodynamics",
            "Kinetic Theory",
            "Oscillations",
            "Waves"
        ],
        "chemistry": [
            "Some Basic Concepts of Chemistry",
            "Structure of Atom",
            "Classification of Elements and Periodicity in Properties",
            "Chemical Bonding and Molecular Structure",
            "Chemical Thermodynamics",
            "Equilibrium",
            "Redox Reactions",
            "Organic Chemistry: Some Basic Principles and Techniques",
            "Hydrocarbons"
        ],
        "biology": [
            "The Living World",
            "Biological Classification",
            "Plant Kingdom",
            "Animal Kingdom",
            "Morphology of Flowering Plants",
            "Anatomy of Flowering Plants",
            "Cell: The Unit of Life",
            "Biomolecules",
            "Cell Cycle and Cell Division",
            "Photosynthesis in Higher Plants",
            "Respiration in Plants",
            "Plant Growth and Development"
        ],
        "mathematics": [
            "Sets",
            "Relations and Functions",
            "Trigonometric Functions",
            "Complex Numbers and Quadratic Equations",
            "Linear Inequalities",
            "Permutations and Combinations",
            "Binomial Theorem",
            "Sequences and Series",
            "Straight Lines",
            "Conic Sections",
            "Limits and Derivatives",
            "Probability"
        ],
        "accountancy": [
            "Introduction to Accounting",
            "Theory Base of Accounting",
            "Recording of Transactions - I",
            "Recording of Transactions - II",
            "Bank Reconciliation Statement",
            "Trial Balance and Rectification of Errors",
            "Financial Statements - I"
        ],
        "business_studies": [
            "Nature and Purpose of Business",
            "Forms of Business Organisations",
            "Public, Private and Global Enterprises",
            "Business Services",
            "Emerging Modes of Business",
            "Sources of Business Finance"
        ],
        "economics": [
            "Introduction to Microeconomics",
            "Consumer's Equilibrium and Demand",
            "Producer Behaviour and Supply",
            "Forms of Market",
            "Introduction to Statistics for Economics",
            "Collection, Organisation and Presentation of Data"
        ],
        "history": [
            "Writing and City Life",
            "An Empire Across Three Continents",
            "Nomadic Empires",
            "The Three Orders",
            "Changing Cultural Traditions"
        ],
        "geography": [
            "Geography as a Discipline",
            "The Origin and Evolution of the Earth",
            "Interior of the Earth",
            "Distribution of Oceans and Continents",
            "Geomorphic Processes",
            "Landforms and their Evolution"
        ],
        "political_science": [
            "Constitution: Why and How?",
            "Rights in the Indian Constitution",
            "Election and Representation",
            "Executive",
            "Legislature",
            "Judiciary"
        ],
        "english": [
            "The Portrait of a Lady",
            "We're Not Afraid to Die...",
            "Discovering Tut: The Saga Continues",
            "The Laburnum Top",
            "The Voice of the Rain"
        ]
    },
    12: {
        "physics": [
            "Electric Charges and Fields",
            "Electrostatic Potential and Capacitance",
            "Current Electricity",
            "Moving Charges and Magnetism",
            "Magnetism and Matter",
            "Electromagnetic Induction",
            "Alternating Current",
            "Electromagnetic Waves",
            "Ray Optics and Optical Instruments",
            "Wave Optics",
            "Dual Nature of Radiation and Matter",
            "Atoms",
            "Nuclei",
            "Semiconductor Electronics"
        ],
        "chemistry": [
            "Solutions",
            "Electrochemistry",
            "Chemical Kinetics",
            "d and f Block Elements",
            "Coordination Compounds",
            "Haloalkanes and Haloarenes",
            "Alcohols, Phenols and Ethers",
            "Aldehydes, Ketones and Carboxylic Acids",
            "Amines",
            "Biomolecules"
        ],
        "biology": [
            "Sexual Reproduction in Flowering Plants",
            "Human Reproduction",
            "Reproductive Health",
            "Principles of Inheritance and Variation",
            "Molecular Basis of Inheritance",
            "Evolution",
            "Human Health and Disease",
            "Microbes in Human Welfare",
            "Biotechnology: Principles and Processes",
            "Biotechnology and its Applications",
            "Organisms and Populations",
            "Ecosystem"
        ],
        "mathematics": [
            "Relations and Functions",
            "Inverse Trigonometric Functions",
            "Matrices",
            "Determinants",
            "Continuity and Differentiability",
            "Application of Derivatives",
            "Integrals",
            "Application of Integrals",
            "Differential Equations",
            "Vector Algebra",
            "Three Dimensional Geometry",
            "Linear Programming",
            "Probability"
        ],
        "accountancy": [
            "Accounting for Partnership Firms",
            "Reconstitution of a Partnership Firm",
            "Dissolution of Partnership Firm",
            "Accounting for Share Capital",
            "Accounting for Debentures",
            "Financial Statements of a Company"
        ],
        "business_studies": [
            "Nature and Significance of Management",
            "Principles of Management",
            "Business Environment",
            "Planning",
            "Organising",
            "Staffing",
            "Directing",
            "Controlling",
            "Financial Management"
        ],
        "economics": [
            "National Income and Related Aggregates",
            "Money and Banking",
            "Determination of Income and Employment",
            "Government Budget and the Economy",
            "Balance of Payments",
            "Development Experience of India (1947-90)"
        ],
        "history": [
            "Bricks, Beads and Bones",
            "Kings, Farmers and Towns",
            "Kinship, Caste and Class",
            "Thinkers, Beliefs and Buildings",
            "Through the Eyes of Travellers"
        ],
        "geography": [
            "Human Geography: Nature and Scope",
            "The World Population: Density and Growth",
            "Human Development",
            "Primary Activities",
            "Secondary Activities"
        ],
        "political_science": [
            "The End of Bipolarity",
            "Contemporary Centres of Power",
            "Contemporary South Asia",
            "International Organisations",
            "Security in the Contemporary World"
        ],
        "english": [
            "The Last Lesson",
            "Lost Spring",
            "Deep Water",
            "The Rattrap",
            "Indigo"
        ]
    }
}

def get_subjects_for_class(class_level: int) -> list:
    class_level = int(class_level)
    if class_level in [6, 7, 8]:
        return ["mathematics", "science", "social_science", "english", "hindi"]
    elif class_level in [9, 10]:
        return ["mathematics", "science", "social_science", "english", "hindi"]
    elif class_level in [11, 12]:
        return ["physics", "chemistry", "biology", "mathematics", "accountancy", "business_studies", "economics", "history", "geography", "political_science", "english"]
    return ["science", "mathematics"]

async def get_roadmap_progress(student_id: str, class_level: int, subject: str = "science") -> list:
    subject = subject.lower().strip()
    class_level = int(class_level)
    
    # Get chapters list
    class_data = CURRICULUM_DATA.get(class_level, {})
    
    # Generate generic subject-based chapters if not explicitly curated
    if subject in class_data:
        chapters = class_data[subject]
    else:
        # Subject-specific fallbacks
        chapters = [
            f"Chapter 1: Foundations of {subject.replace('_', ' ').capitalize()}",
            f"Chapter 2: Core Theories and Systems",
            f"Chapter 3: Essential Processes and Mechanics",
            f"Chapter 4: Advanced Principles and Layouts",
            f"Chapter 5: Real-world CBSE Applications",
            f"Chapter 6: CBSE Revision & Practice Questions"
        ]
    
    # Get all cached documents for this student
    cursor = cached_content_collection.find({"userIds": student_id, "classLevel": class_level})
    uploaded_docs = []
    async for doc in cursor:
        uploaded_docs.append({
            "pageId": doc["pageId"],
            "topic": doc.get("topic", "").lower(),
            "subject": doc.get("subject", "").lower()
        })
        
    # Get student progress
    p_cursor = progress_collection.find({"userId": ObjectId(student_id)})
    progress_records = {}
    async for p in p_cursor:
        progress_records[p["pageId"]] = {
            "status": p.get("status", "in_progress"),
            "score": p.get("quizScore", 0)
        }
        
    roadmap = []
    for idx, ch in enumerate(chapters):
        # Match chapter with uploaded documents
        matching_docs = []
        for d in uploaded_docs:
            if d["subject"] == subject or subject == "general":
                # Fuzzy match: check if chapter name or part of it is in topic name
                ch_words = set(ch.lower().split())
                topic_words = set(d["topic"].split())
                # Intersect to check overlap
                if len(ch_words.intersection(topic_words)) >= 2 or ch.lower() in d["topic"] or d["topic"] in ch.lower():
                    matching_docs.append(d["pageId"])
        
        status = "locked"
        score = 0
        if matching_docs:
            status = "in_progress"
            # If any matching doc is completed, check the highest quiz score
            scores = [progress_records[pid]["score"] for pid in matching_docs if pid in progress_records]
            if scores:
                score = max(scores)
                # If they scored 70% or more, consider the chapter mastered!
                if score >= 70:
                    status = "mastered"
                    
        roadmap.append({
            "chapterNumber": idx + 1,
            "chapterName": ch,
            "status": status,  # locked | in_progress | mastered
            "quizScore": score
        })
        
    return roadmap
