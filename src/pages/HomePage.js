import React, { useEffect, useState } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import LineChart from "../components/LineChart";
import DonutChart from "../components/DonutChart";
import { Toggle } from "@fluentui/react";

const TablePage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("1w");
  const [marketCapData, setMarketCapData] = useState(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch("https://tdat901.vercel.app/scrap/allCryptos");
        const data = await response.json();
        setCryptos(data);

        const bitcoin = data.find((crypto) => crypto.name === "Bitcoin");
        if (bitcoin) {
          setSelectedCrypto(bitcoin);
          fetchChartData(bitcoin.name, timeRange);
          fetchMarketCapData(bitcoin.name);
        }
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptos();
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      fetchChartData(selectedCrypto.name, timeRange);
      fetchMarketCapData(selectedCrypto.name);
    }
  }, [selectedCrypto, timeRange]);

  const fetchChartData = async (cryptoName, range) => {
    try {
      const response = await fetch(
        `https://tdat901.vercel.app/scrap/cryptosByName/${cryptoName}?range=${range}`
      );
      const data = await response.json();

      const maxDays = range === "1w" ? 7 : range === "1m" ? 30 : 7;
      const filteredData = data.filter((entry) => {
        const entryDate = new Date(entry.date);
        const currentDate = new Date();
        const differenceInDays =
          (currentDate - entryDate) / (1000 * 60 * 60 * 24);
        return differenceInDays <= maxDays;
      });

      setChartData(filteredData);
    } catch (error) {
      console.error(
        "Erreur lors de l'appel API pour les données du graphique:",
        error
      );
    }
  };

  const fetchMarketCapData = async (cryptoName) => {
    try {
      const response = await fetch(
        "https://tdat901.vercel.app/analytics/allCryptos"
      );
      const data = await response.json();

      const totalMarketCap = data.reduce(
        (acc, crypto) => acc + crypto.totalMarketCapitalization,
        0
      );
      const selectedCryptoData = data.find(
        (crypto) => crypto.name === cryptoName
      );

      const selectedMarketCap = selectedCryptoData
        ? selectedCryptoData.totalMarketCapitalization
        : 0;

      setMarketCapData({
        selected: selectedMarketCap,
        total: totalMarketCap,
      });
    } catch (error) {
      console.error("Error fetching market cap data:", error);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleRowClick = (crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleSortByPrice = () => {
    const sortedCryptos = [...cryptos].sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });
    setCryptos(sortedCryptos);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A";
    return num.toLocaleString();
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div>
          <div className="header-logo text-2xl font-bold">
            <span className="text-white">Coin</span>
            <span className="text-blue-500">Market</span>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search crypto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-blue-500 font-bold p-2 border rounded"
        />
      </header>

      <div className="p-8 flex-grow">
        <div className="overflow-y-auto max-h-96 rounded-lg">
          <table className="min-w-full table-auto bg-gray-800 text-white rounded-lg">
            <thead className="bg-gray-700 sticky top-0 rounded-lg">
              <tr className="text-left">
                <th className="py-3 px-4">Crypto Name</th>
                <th className="py-3 px-4">
                  Price
                  <button onClick={handleSortByPrice} className="ml-2">
                    {sortOrder === "asc" ? (
                      <FaSortUp className="inline w-4 h-4" />
                    ) : (
                      <FaSortDown className="inline w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Volume</th>
                <th className="py-3 px-4">1h %</th>
                <th className="py-3 px-4">24h %</th>
                <th className="py-3 px-4">7j %</th>
                <th className="py-3 px-4">Market cap</th>
                <th className="py-3 px-4">Circulation supply</th>
              </tr>
            </thead>
            <tbody>
              {filteredCryptos.map((crypto) => (
                <tr
                  key={crypto._id}
                  className="table-row table-row-border cursor-pointer"
                  onClick={() => handleRowClick(crypto)}
                >
                  <td className="py-4 px-4 flex items-center space-x-2">
                    <img
                      src={`${crypto.icon}`}
                      alt={crypto.name}
                      className="w-6 h-6"
                    />
                    <span>{crypto.name}</span>
                  </td>
                  <td className="py-4 px-4">{`$${crypto.price}`}</td>
                  <td className="py-4 px-4">
                    {crypto.volume && typeof crypto.volume === "object" ? (
                      <>
                        {formatNumber(crypto.volume.value || 0)}
                        <span className="text-blue-500">
                          {" "}
                          {crypto.volume.unit || ""}
                        </span>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td
                    className={`py-4 px-4 ${crypto.hourPercent > 0 ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {crypto.hourPercent}%
                  </td>
                  <td
                    className={`py-4 px-4 ${crypto.dayPercent > 0 ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {crypto.dayPercent}%
                  </td>
                  <td
                    className={`py-4 px-4 ${crypto.weekPercent > 0 ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {crypto.weekPercent}%
                  </td>
                  <td className="py-4 px-4">
                    {formatNumber(crypto.marketCapitalization)}
                  </td>
                  <td className="py-4 px-4">
                    {crypto.offerCirculation &&
                      Array.isArray(crypto.offerCirculation) ? (
                      <>
                        {formatNumber(crypto.offerCirculation[0] || 0)}
                        <span className="text-blue-500">
                          {" "}
                          {crypto.offerCirculation[1] || ""}
                        </span>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-row items-center mb-2">
        <div className="w-1/2 pl-8 pr-4">
          {selectedCrypto ? (
            <>
              <div className="mb-4 flex items-center h-10 justify-between">
                <h2 className="text-2xl font-bold text-gray-700">
                  {selectedCrypto.name} Price Evolution
                </h2>
                <div className="flex items-center space-x-2">
                  <span className={`text-gray-700 ${timeRange === "1w" ? "font-bold" : ""}`}>
                    Week
                  </span>
                  <Toggle
                    label=""
                    inlineLabel
                    checked={timeRange === "1m"}
                    onChange={(e, checked) => handleTimeRangeChange(checked ? "1m" : "1w")}
                    styles={{
                      root: { marginTop: "9px" },
                      thumb: { backgroundColor: "#f97316" },
                    }}
                  />
                  <span className={`text-gray-700 ${timeRange === "1m" ? "font-bold" : ""}`}>
                    Month
                  </span>
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-lg p-4 border border-sky-500">
                <LineChart data={chartData} />
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No cryptocurrency selected.
            </div>
          )}
        </div>

        <div className="w-1/2 pl-4 pr-8">
          {marketCapData ? (
            <>
              <h2 className="text-2xl font-bold text-gray-700 mb-4 h-10">
                {selectedCrypto.name}'s Market Share
              </h2>
              <div className="bg-white shadow-lg rounded-lg p-4 border border-sky-500">
                <DonutChart
                  data={[
                    {
                      label: selectedCrypto.name,
                      value: marketCapData.selected,
                    },
                    {
                      label: "Other Cryptos",
                      value: marketCapData.total - marketCapData.selected,
                    },
                  ]}
                />
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Market Cap Data Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TablePage;