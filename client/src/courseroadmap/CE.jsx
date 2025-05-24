import React, { useState } from "react";
import "./course-styles/ce-style.css";

const specializationsData = [
  {
    name: "Structural Engineering",
    icon: "fa-solid fa-building",
    industry: "Infrastructure",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Steel_Bridge_Below_%28Unsplash%29.jpg/640px-Steel_Bridge_Below_%28Unsplash%29.jpg",
    description:
      "Focuses on design and analysis of buildings, bridges, and towers.",
  },
  {
    name: "Transportation Engineering",
    icon: "fa-solid fa-road",
    industry: "Infrastructure",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Tonkin_Highway_from_Great_Eastern_Highway_bridge_first.jpg/640px-Tonkin_Highway_from_Great_Eastern_Highway_bridge_first.jpg",
    description:
      "Planning, design, operation of transportation systems like roads and airports.",
  },
  {
    name: "Water Resources",
    icon: "fa-solid fa-water",
    industry: "Environmental",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Svisla%C4%8D_river_%28Minsk%29_%E2%80%94_small_dam_04.jpg/640px-Svisla%C4%8D_river_%28Minsk%29_%E2%80%94_small_dam_04.jpg",
    description:
      "Deals with hydraulics, hydrology, and water management systems.",
  },
  {
    name: "Environmental Engineering",
    icon: "fa-solid fa-recycle",
    industry: "Environmental",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/La_Crosse_wastewater_treatment_facility-2.jpg/640px-La_Crosse_wastewater_treatment_facility-2.jpg",
    description:
      "Focuses on waste treatment, pollution control, and recycling.",
  },
  {
    name: "Geotechnical Engineering",
    icon: "fa-solid fa-mountain",
    industry: "Infrastructure",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/A_d%C3%A9li_pajzs_a_keresztez%C5%91kamr%C3%A1ban.jpg/640px-A_d%C3%A9li_pajzs_a_keresztez%C5%91kamr%C3%A1ban.jpg",
    description: "Studies soil behavior to support foundations and earthworks.",
  },
  {
    name: "Construction Management",
    icon: "fa-solid fa-hard-hat",
    industry: "Project Management",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photo_of_a_construction_site_with_a_crane_and_concrete_foundations._In_the_background_the_arch_of_the_old_roof_cap_of_Central_station%3B_Amsterdam_free_photo_in_2005%2C_Fons_Heijnsbroek.tif/lossy-page1-640px-thumbnail.tif.jpg",
    description:
      "Manages building processes, cost control, and project timelines.",
  },
];

const famousEngineers = [
  {
    name: "John A. Roebling",
    quote: "The man who bridged the East River with vision and cables.",
    tooltip: "Designed the Brooklyn Bridge",
  },
  {
    name: "Gustave Eiffel",
    quote: "Engineer behind the Eiffel Tower and early innovator of steel.",
    tooltip: "Reinforced concrete design & Eiffel Tower",
  },
  {
    name: "Frank Crowe",
    quote: "Built the Hoover Dam with precision and vision.",
    tooltip: "Built Hoover Dam and the Pentagon",
  },
  {
    name: "Joseph Strauss",
    quote: "Pioneer of movable bridges like the Golden Gate.",
    tooltip: "Pioneer in earthquake engineering",
  },
];

const companies = [
  {
    name: "AECOM",
    tooltip: "Global design, engineering, and project management company",
    website: "https://www.aecom.com",
  },
  {
    name: "Bechtel",
    tooltip: "Specializes in construction and infrastructure",
    website: "https://www.bechtel.com",
  },
  {
    name: "Arup",
    tooltip: "Leader in sustainable design & construction",
    website: "https://www.arup.com",
  },
  {
    name: "Fluor Corporation",
    tooltip: "Major projects in transportation and energy",
    website: "https://www.fluor.com",
  },
];

const CE_Roadmap = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStage, setExpandedStage] = useState(null);

  const industries = [
    "All",
    ...new Set(specializationsData.map((s) => s.industry)),
  ];

  const filteredSpecializations = specializationsData.filter((s) => {
    const matchesIndustry =
      selectedIndustry === "All" || s.industry === selectedIndustry;
    const matchesSearch = s.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const stageDetails = {
    Foundations:
      "In this phase, students are introduced to Civil Engineering fundamentals including technical drawing, surveying basics, calculus, physics, and introductory CAD software.",
    "Core Concepts":
      "Courses include structural mechanics, fluid mechanics, soil mechanics, engineering materials, and hydrology. Labs and small projects enhance practical understanding.",
    "Specializations & Design":
      "Students explore fields like structural, geotechnical, transportation, water resources, and environmental engineering through advanced electives and design studios.",
    "Application & Integration":
      "Capstone projects, internships, and fieldwork form the core. You'll apply all you've learned to solve real infrastructure problems, manage projects, and understand professional ethics.",
  };

  return (
    <div className="ce-container">
      <div className="generalDIV">
        <h2 className="someInfo">Civil Engineering Roadmap</h2>

        <div className="timeline">
          {Object.keys(stageDetails).map((stage, idx) => (
            <div
              key={idx}
              className={`timeline-step ${
                expandedStage === stage ? "expanded" : ""
              }`}
              onClick={() =>
                setExpandedStage(expandedStage === stage ? null : stage)
              }
              style={{ cursor: "pointer" }}
            >
              <h4>{`Year ${idx + 1}: ${stage}`}</h4>
              <p>
                {stage === "Foundations" &&
                  "Intro to CE, Math, Physics, Drafting."}
                {stage === "Core Concepts" &&
                  "Mechanics, Hydraulics, Surveying."}
                {stage === "Specializations & Design" &&
                  "Structural Design, Transportation, Environmental."}
                {stage === "Application & Integration" &&
                  "Capstone, internships, management."}
              </p>
              {expandedStage === stage && (
                <div className="deep-info">
                  <p>{stageDetails[stage]}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="search-filter-wrap">
          <input
            type="text"
            placeholder="Search specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="course-search-bar"
          />
          <div className="filter-controls">
            {industries.map((ind) => (
              <button
                key={ind}
                className={`filter-btn ${
                  selectedIndustry === ind ? "active" : ""
                }`}
                onClick={() => setSelectedIndustry(ind)}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="specializations ">
          {filteredSpecializations.map((spec, index) => (
            <div key={index} className="specialization-card fade-in">
              <a target="_blank" rel="noopener noreferrer" href={spec.image}>
                <img src={spec.image} alt={spec.name} />
              </a>
              <i className={spec.icon}></i>
              <h4>{spec.name}</h4>
              <p>{spec.description}</p>
            </div>
          ))}
        </div>

        <div className="famous-section">
          <h3>Famous Civil Engineers</h3>
          <ul>
            {famousEngineers.map((eng, idx) => (
              <li key={idx} data-tooltip={eng.tooltip}>
                <strong>{eng.name}</strong>: <em>“{eng.quote}”</em>
              </li>
            ))}
          </ul>
        </div>

        <div className="companies-section">
          <h3>Top Companies in Civil Engineering</h3>
          <ul>
            {companies.map((comp, idx) => (
              <li key={idx} data-tooltip={comp.tooltip}>
                <a href={comp.website} target="_blank" rel="noreferrer">
                  {comp.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="resources-section">
          <h3>Downloadable Resources</h3>
          <ul>
            <li>
              <a href="/docs/CE_Roadmap_Guide.pdf" download>
                📘 Roadmap Guide PDF
              </a>
            </li>
            <li>
              <a
                href="https://www.asce.org/education"
                target="_blank"
                rel="noopener noreferrer"
              >
                🌐 Learn from ASCE (American Society of Civil Engineers)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CE_Roadmap;
