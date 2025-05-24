import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/verify?id=${id}`
        );
        setStatus(response.data); // Set the response text directly
      } catch (error) {
        console.error(error);
        setStatus("❌ Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [id]);

  return (
    <div className="verify-container">
      <h2>{status}</h2>
    </div>
  );
};

export default Verify;
