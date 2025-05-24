import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const AutoDownloadUserData = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAndDownload = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8000/api/download-data",
          {
            method: "GET",
            credentials: "include", // important for session cookies!
          }
        );

        if (!response.ok) {
          alert("Failed to fetch data");
          return;
        }

        const data = await response.json();

        const doc = new jsPDF();
        doc.setFontSize(12);
        let y = 10;

        Object.entries(data).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`, 10, y);
          y += 10;
        });

        doc.save("user_data.pdf");

        setTimeout(() => {
          navigate("/profile");
        }, 1000); // 1 second delay
      } catch (error) {
        console.error("Error downloading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndDownload();
  }, [navigate]);

  return (
    <>{loading ? <p>Downloading your data...</p> : <p>Download complete!</p>}</>
  );
};

export default AutoDownloadUserData;
