import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import monsterAnimation from "../assets/monster.json";
import lottie from "lottie-web";
import axios from "axios";
import "./login-style.css";

const LoginUser = () => {
  const containerRef = useRef(null);
  const lottieInstance = useRef(null);
  const lastPlayedRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let blinkInterval;

    if (containerRef.current) {
      lottieInstance.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: monsterAnimation,
      });

      lottieInstance.current.addEventListener("DOMLoaded", () => {
        playSegment(40, 90, true); // Start idle loop

        // Start random blinking
        const startBlinking = () => {
          blinkInterval = setInterval(() => {
            // Random delay between 4 to 7 seconds
            const delay = Math.random() * 3000 + 4000;
            setTimeout(() => {
              playSegment(25, 35); // Blink
              setTimeout(() => playSegment(40, 90, true), 1000); // Return to idle
            }, delay);
          }, 6000);
        };

        startBlinking();
      });
    }

    return () => {
      clearInterval(blinkInterval);
      lottieInstance.current?.destroy();
    };
  }, []);

  const playSegment = (start, end, loop = false) => {
    const segmentKey = `${start}-${end}-${loop}`;
    if (lottieInstance.current && lastPlayedRef.current !== segmentKey) {
      lottieInstance.current.loop = loop;
      lottieInstance.current.playSegments([start, end], true);
      lastPlayedRef.current = segmentKey;
    }
  };

  const handleFocus = () => playSegment(25, 35); // Wink
  const handleBlur = () => playSegment(40, 90, true); // Idle loop
  const handlePasswordFocus = () => playSegment(25, 35); // Wink
  const handlePasswordBlur = () => playSegment(40, 90, true); // Idle loop

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 2) {
      playSegment(15, 20); // Look left
    } else {
      playSegment(20, 15); // Look right (reverse)
    }
  };

  const handleMouseLeave = () => {
    playSegment(40, 90, true); // Idle loop
  };

  console.log("API URL:", process.env.REACT_APP_API_URL);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `
        ${process.env.REACT_APP_API_URL}/api/login`,
        { email, password },
        { withCredentials: true }
      );
      sessionStorage.setItem("course", response.data.user.course);

      sessionStorage.setItem("userId", response.data.user.userId);
      sessionStorage.setItem("targetId", response.data.user.targetId || "");

      navigate("/dashboard");
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Email and Password are incorrect"
      ) {
        setError("Invalid username or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="loginBackground">
      <div className="login-container-center">
        <form
          className="loginForm"
          onSubmit={handleLogin}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={containerRef} className="lottie-animation-top" />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
            autoComplete="email"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            required
            autoComplete="current-password"
          />

          <button type="submit" className="btn btn-primary">
            Login
          </button>

          {error && <p className="login-error">{error}</p>}

          <div className="login-container-links">
            <Link className="login-links text-decoration-none" to="/">
              Back
            </Link>
            <Link className="login-links text-decoration-none" to="/loginAdmin">
              Admin Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginUser;
