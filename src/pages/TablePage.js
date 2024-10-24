import React, { useEffect, useState } from "react";

const TablePage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch("http://localhost:3001/scrap/allCryptos");
        const data = await response.json();
        setCryptos(data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptos();
  }, []);

  const handleRowClick = (crypto) => {
    setSelectedCrypto(crypto);
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatCirculation = (circulation) => {
    return `${circulation[0].toLocaleString()}`;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-200 flex flex-col h-full">
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
          onChange={handleSearch}
          className="text-blue-500 font-bold p-2 border rounded"
        />
      </header>

      <div className="p-8 flex-grow h-full">
        <div className="overflow-y-auto max-h-96 rounded-lg">
          <table className="min-w-full table-auto bg-gray-800 text-white rounded-lg">
            <thead className="bg-gray-700 sticky top-0 rounded-lg">
              <tr className="text-left">
                <th className="py-3 px-4">Crypto Name</th>
                <th className="py-3 px-4">Price</th>
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
                  <td className="py-4 px-4">{`${formatNumber(
                    crypto.volume.value
                  )}`}<span className="text-blue-500"> {crypto.volume.unit}</span></td>
                  <td
                    className={`py-4 px-4 ${
                      crypto.hourPercent > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {`${crypto.hourPercent.toFixed(2)}%`}
                  </td>
                  <td
                    className={`py-4 px-4 ${
                      crypto.dayPercent > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {`${crypto.dayPercent.toFixed(2)}%`}
                  </td>
                  <td
                    className={`py-4 px-4 ${
                      crypto.weekPercent > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {`${crypto.weekPercent.toFixed(2)}%`}
                  </td>
                  <td className="py-4 px-4">
                    {formatNumber(crypto.marketCapitalization)}
                  </td>
                  <td className="py-4 px-4">
                    {formatCirculation(crypto.offerCirculation)}
                    <span className="text-blue-500"> {crypto.offerCirculation[1]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablePage;
