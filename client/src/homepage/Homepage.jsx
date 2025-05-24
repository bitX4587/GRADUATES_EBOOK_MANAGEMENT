import { useState } from "react";
import { Link } from "react-router-dom";
import AddUser from "../register/register";
import AddAdmin from "../register/registerAdmin";
import "./homepage-style.css";
import HeroSlider from "./heroSliders";

import Hero1 from "../assets/img1.png";
import Hero2 from "../assets/img2.png";
import Hero3 from "../assets/img3.png";

const heroImages = [Hero1, Hero2, Hero3];

const Homepage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminRegister, setShowAdminRegister] = useState(false);

  const [bgIndex, setBgIndex] = useState(0);

  return (
    <div className="homepage-container position-relative text-white">
      {/* Live Background */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 transition-opacity"
        style={{
          backgroundImage: `url(${heroImages[bgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(8px)",
          transition: "opacity 1s ease-in-out",
          zIndex: -1,
        }}
      ></div>

      <div className="container d-flex justify-content-center align-items-center h-100 position-relative z-2">
        <div className="glass-card row w-100" style={{ minHeight: "600px" }}>
          {/* Left Side */}
          {/* Left Side */}
          <div
            className={`${
              showRegister ? "d-none d-lg-flex" : "d-flex d-lg-flex d-none"
            } col-12 col-lg-6 flex-column align-items-center justify-content-center p-0`}
          >
            <HeroSlider images={heroImages} onSlideChange={setBgIndex} />
          </div>

          {/* Right Side: Either Text+Buttons OR Register Form */}
          <div
            className={
              showRegister
                ? "col-12 col-md-12 col-lg-6 d-flex align-items-center justify-content-center p-0"
                : "col-12 col-md-12 col-lg-6 d-flex align-items-center justify-content-center p-0"
            }
          >
            {showRegister ? (
              <div className="w-100">
                <AddUser
                  onCancel={() => setShowRegister(false)}
                  onSwitchToAdmin={() => {
                    setShowRegister(false);
                    setShowAdminRegister(true);
                  }}
                />
              </div>
            ) : showAdminRegister ? (
              <div className="w-100">
                <AddAdmin
                  onCancel={() => setShowAdminRegister(false)}
                  onSwitchToUser={() => {
                    setShowAdminRegister(false);
                    setShowRegister(true);
                  }}
                />
              </div>
            ) : (
              <div className="text-start w-100 p-5 text-black">
                <p
                  className="text-uppercase fw-semibold fs-5"
                  style={{ letterSpacing: "1px" }}
                >
                  A Smarter Future Begins Here
                </p>
                <h1 className="fw-bold display-4 mb-3">Graduates E-Book</h1>
                <p className="lead mb-4">
                  Discover the stories, journeys, and accomplishments of our
                  graduates. This platform is a digital yearbook and networking
                  tool that honors the legacy of every student.
                </p>

                <div className="d-flex gap-3">
                  <button
                    className="btn btn-primary btn-lg rounded-pill"
                    onClick={() => setShowRegister(true)}
                  >
                    Get Started
                  </button>
                  <Link
                    to="/login"
                    className="btn btn-primary btn-lg rounded-pill text-decoration-none"
                  >
                    Login
                  </Link>
                </div>
                <div className="company-name position-absolute bottom-0 end-0 m-3 text-white">
                  Codex Intel
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
