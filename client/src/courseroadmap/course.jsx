import React, { useEffect, useState } from "react";
import axios from "axios";
import CE from "./CE";
import ME from "./ME";

const Course = () => {
  const [course, setCourse] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users`
        );

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Received data is not an array", response.data);
        }
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  // Fetch course from sessionStorage
  useEffect(() => {
    const userCourse = sessionStorage.getItem("course");
    setCourse(userCourse);
  }, []);

  return (
    <>
      {course === "CE" ? (
        <CE users={users} />
      ) : course === "ME" ? (
        <ME users={users} />
      ) : (
        <div>Please select your course</div>
      )}
    </>
  );
};

export default Course;
