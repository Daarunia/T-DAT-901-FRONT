import React, { useEffect, useState } from "react";
import LineChart from "../components/LineChart";
import axios from "axios";

const HomePage = () => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://tdat901-git-main-daarunias-projects.vercel.app/scrap/cryptosByName/Bitcoin"
        );

        console.log(response);

        // Mettre à jour les données
        setCryptoData(response.data);
      } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full w-full">
      <LineChart data={cryptoData} className="h-2/4 w-2/4" />
    </div>
  );
};

export default HomePage;
