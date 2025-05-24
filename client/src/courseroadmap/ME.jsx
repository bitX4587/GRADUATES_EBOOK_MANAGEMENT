import React, { useState } from "react";
import "./course-styles/me-style.css";

const specializationsData = [
  {
    name: "Thermal Engineering",
    icon: "fa-solid fa-fire",
    industry: "Energy",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Cannular_combustor_on_a_Pratt_%26_Whitney_JT9D_turbofan.jpg/640px-Cannular_combustor_on_a_Pratt_%26_Whitney_JT9D_turbofan.jpg",
    description:
      "Focuses on heat transfer, thermodynamics, and energy systems like turbines and engines.",
  },
  {
    name: "Design and Manufacturing",
    icon: "fa-solid fa-cogs",
    industry: "Production",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/TGFT29_guitar_neck_CNC_milling_machines_-_Taylor_Guitar_Factory.jpg/640px-TGFT29_guitar_neck_CNC_milling_machines_-_Taylor_Guitar_Factory.jpg",
    description:
      "Involves CAD, CAM, and product development from concept to production.",
  },
  {
    name: "Automotive Engineering",
    icon: "fa-solid fa-car",
    industry: "Automotive",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/R10_Engine.jpg/640px-R10_Engine.jpg",
    description:
      "Focuses on design, development, and testing of vehicles and their systems.",
  },
  {
    name: "Robotics and Automation",
    icon: "fa-solid fa-robot",
    industry: "Automation",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Factory_Automation_Robotics_Palettizing_Bread.jpg/640px-Factory_Automation_Robotics_Palettizing_Bread.jpg",
    description:
      "Integrates mechanical systems with electronics and programming for intelligent automation.",
  },
  {
    name: "Mechatronics",
    icon: "fa-solid fa-microchip",
    industry: "Automation",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Mechatronics_lab_at_PCoE.JPG/640px-Mechatronics_lab_at_PCoE.JPG",
    description:
      "Cross-disciplinary field combining mechanics, electronics, and control systems.",
  },
  {
    name: "Aerospace Engineering",
    icon: "fa-solid fa-jet-fighter",
    industry: "Aerospace",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Bridenstine_is_inside_Armstrong%27s_Dale_Reed_Flight_Research_Lab_aka_%22The_Model_Shop%22_used_for_rapid_prototyping%2C_design%2C_fabrication%2C_assembly_and_integration%2C_modification%2C_maintenance_and_operation_of_experimenta_%28AFRC2018-0212-025%29.jpg/640px-thumbnail.jpg",
    description:
      "Deals with the development of aircraft and spacecraft, focusing on aerodynamics and propulsion.",
  },
];

const famousEngineers = [
  {
    name: "James Watt",
    quote: "Transformed the steam engine, powering the Industrial Revolution.",
    tooltip: "Father of modern mechanical engineering",
  },
  {
    name: "Nikola Tesla",
    quote: "Pioneer of alternating current and electric machines.",
    tooltip: "Developed AC motors and generators",
  },
  {
    name: "Rudolf Diesel",
    quote: "Inventor of the diesel engine, reshaping energy efficiency.",
    tooltip: "Invented the diesel engine",
  },
  {
    name: "Elon Musk",
    quote: "Redefined modern engineering with electric vehicles and rockets.",
    tooltip: "Founder of Tesla and SpaceX",
  },
];

const companies = [
  {
    name: "General Electric",
    tooltip: "Leader in mechanical systems, energy, and turbines",
    website: "https://www.ge.com",
  },
  {
    name: "Bosch",
    tooltip: "Innovator in automotive and industrial technology",
    website: "https://www.bosch.com",
  },
  {
    name: "Siemens",
    tooltip: "Automation, manufacturing, and mechanical design systems",
    website: "https://www.siemens.com",
  },
  {
    name: "Rolls-Royce",
    tooltip: "Specializes in aerospace and power systems",
    website: "https://www.rolls-royce.com",
  },
];

const ME_Roadmap = () => {
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
      "In this phase, students get introduced to ME fundamentals: Physics, Math (Calculus, Linear Algebra), Drafting, and Intro to Engineering. You'll also touch on CAD tools and basic mechanics.",
    "Core Mechanics":
      "You'll study Statics, Dynamics, Thermodynamics, and Material Science. These form the backbone of understanding how systems behave under different forces and environments.",
    "Specializations & Systems":
      "Dive into specialized topics: Heat Transfer, Fluid Mechanics, Robotics, Manufacturing, and Control Systems. Choose electives based on your interests like Automotive or Aerospace.",
    "Innovation & Application":
      "This is where theory meets practice: capstone design projects, internships, R&D work, and engineering ethics. You'll build real systems and solve real-world problems.",
  };

  return (
    <div className="me-container">
      <div className="generalDIV">
        <h2 className="someInfo">Mechanical Engineering Roadmap</h2>

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
                  "Intro to ME, Physics, Math, Drafting."}
                {stage === "Core Mechanics" &&
                  "Statics, Dynamics, Thermodynamics, Materials."}
                {stage === "Specializations & Systems" &&
                  "Thermal systems, manufacturing, robotics."}
                {stage === "Innovation & Application" &&
                  "Capstone design, R&D projects, internships."}
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

        <div className="specializations">
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
          <h3>Famous Mechanical Engineers</h3>
          <ul>
            {famousEngineers.map((eng, idx) => (
              <li key={idx} data-tooltip={eng.tooltip}>
                <strong>{eng.name}</strong>: <em>“{eng.quote}”</em>
              </li>
            ))}
          </ul>
        </div>

        <div className="companies-section">
          <h3>Top Companies in Mechanical Engineering</h3>
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
          <h3>External Learning Resources</h3>
          <ul>
            <li>
              <a
                href="https://www.asme.org/learning"
                target="_blank"
                rel="noopener noreferrer"
              >
                🌐 Learn from ASME (American Society of Mechanical Engineers)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ME_Roadmap;
