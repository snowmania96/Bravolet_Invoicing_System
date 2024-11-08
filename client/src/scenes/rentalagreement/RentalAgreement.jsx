import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export default function RentalAgreement() {
  const { id } = useParams();
  const [text, setText] = useState([]);
  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_BASE_URL}/rentalagreement/${id}`
      );
      const string = response.data.split("\n");
      console.log(string);
      setText(string);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="d-flex flex-column justify-content-center">
      <div>
        <h1 className="text-center mt-5">Contratto di locazione</h1>
      </div>
      <div className="container mt-3" style={{ fontSize: "16px" }}>
        {text.map((subtext) => {
          if (subtext === "") return <br />;
          else return <p>{subtext}</p>;
        })}
      </div>
    </div>
  );
}
