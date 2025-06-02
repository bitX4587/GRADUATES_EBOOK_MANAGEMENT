import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./download-style.css";

const AutoDownloadUserData = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndDownload = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/download-data`,
          {
            method: "GET",
            credentials: "include", // include session cookies
          }
        );

        if (!response.ok) {
          alert("Failed to fetch data");
          return;
        }

        const data = await response.json();

        // Exclude sensitive fields
        const {
          password,
          beta_password,
          token,
          __v,
          _id,
          image, // optional: include image URL separately
          ...safeData
        } = data;

        const doc = new jsPDF();
        doc.setFontSize(12);
        let y = 10;

        const addLine = (text) => {
          doc.text(text, 10, y);
          y += 10;
          if (y > 270) {
            doc.addPage();
            y = 10;
          }
        };

        const formatDate = (dateStr) => {
          if (!dateStr) return "N/A";
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        };

        addLine("Personal Data Sheet");
        doc.setFontSize(10);
        addLine("----------------------------");

        Object.entries(safeData).forEach(([key, value]) => {
          if (key === "birthday") {
            addLine(`Birthday: ${formatDate(value)}`);
          } else if (Array.isArray(value)) {
            addLine(`${key.charAt(0).toUpperCase() + key.slice(1)}:`);
            value.forEach((item) => {
              addLine(`  - ${item}`);
            });
          } else if (typeof value === "object" && value !== null) {
            addLine(`${key.charAt(0).toUpperCase() + key.slice(1)}:`);
            Object.entries(value).forEach(([subKey, subVal]) => {
              addLine(`  ${subKey}: ${subVal}`);
            });
          } else {
            addLine(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
          }
        });

        const fileName = `${safeData.name || "user"}_data.pdf`;
        doc.save(fileName);

        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } catch (error) {
        console.error("Error downloading data:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndDownload();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {loading ? (
        <div>
          <div className="spinner" />
          <p>Preparing your data...</p>
        </div>
      ) : (
        <p>Download complete! Redirecting...</p>
      )}
    </div>
  );
};

export default AutoDownloadUserData;
