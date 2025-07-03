// src/components/ExpenseSummary.js
import styled from "styled-components";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box } from "../styles";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658",
  "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c"
];

function ExpenseSummary() {
  const [data, setData] = useState([]);
  const [filterYear, setFilterYear] = useState("2025");
  const [filterMonth, setFilterMonth] = useState("06");

  useEffect(() => {
    const query = new URLSearchParams();
    if (filterYear) query.append("year", filterYear);
    if (filterMonth) query.append("month", filterMonth);

    fetch(`/expenses/summary_by_category?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        const processed = data.map((item) => ({
          ...item,
          name: item.category,
        }));
        setData(processed);
      });
  }, [filterYear, filterMonth]);

  const totalSpending = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Box>
      <h2 style={{ textAlign: "center" }}>Summary by Category</h2>

      {/* filter */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <label>
          Year:
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">All</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </label>

        <label style={{ marginLeft: "10px" }}>
          Month:
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="">All</option>
            {[...Array(12)].map((_, i) => {
              const value = String(i + 1).padStart(2, "0");
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      {data.length === 0 ? (
        <p style={{ textAlign: "center" }}>No data available</p>
      ) : (
        <FlexWrapper>
            <ChartBox>
              <PieChart width={1000} height={400}>
                <Pie
                    dataKey="total"
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartBox>

          {/* summary */}
          <SummaryBox>
            <p style={{ textAlign: "left", fontWeight: "bold", marginTop: "100px" }}> 
              {filterYear ? `${filterYear}` : "All Years"}{" "}
              {filterMonth ? `/${filterMonth}` : ""}
                {" "}Spending Summary
            </p>

            <ul style={{ textAlign: "left", listStyleType: "none", padding: 0 }}>
              {data.map((item, index) => (
                <li
                  key={index}
                  style={{
                    color: COLORS[index % COLORS.length],
                    margin: "4px 0",
                    fontSize: "16px",
                  }}
                >
                  {item.name}: ${item.total.toFixed(2)}
                </li>
              ))}
            </ul>

            <p style={{ textAlign: "left", fontWeight: "bold", marginTop: "12px" }}>
              Total Spending: ${totalSpending.toFixed(2)}
            </p>
          </SummaryBox>
        </FlexWrapper>
      )}
    </Box>
  );
}

export default ExpenseSummary;



const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const ChartBox = styled.div`
  flex: 1;
  min-width: 400px;
`;

const SummaryBox = styled.div`
  flex: 1;
  min-width: 220px;

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin: 4px 0;
    font-size: 16px;
  }

  p {
    text-align: center;
    font-weight: bold;
  }
`;













// // src/components/ExpenseSummary.js

// import { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// import { Box } from "../styles";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c"];

// function ExpenseSummary() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch("/expenses/summary_by_category", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       }
//     })
//       .then(r => r.json())
//       .then(data => {
//         const processedData = data.map(item => ({
//             ...item,
//             name: item.category
//         }));
//         setData(processedData);
//       })
//       .catch(err => {
//         console.error("Failed to load summary", err);
//       });
//   }, []);

//   return (
//     <Box>
//         <h2>Summary by Category</h2>
//         {data.length === 0 ? (
//         <p>No data available</p>
//         ) : (
//         <>
//             <PieChart width={400} height={400}>
//             <Pie
//                 dataKey="total"
//                 data={data}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={120}
//                 fill="#8884d8"
//                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//             >
//                 {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//             </PieChart>

//             <div>
//             <ul style={{ textAlign: "center", listStyleType: "none", padding: 0 }}>
//                 {data.map((item, index) => (
//                 <li key={index} style={{ color: COLORS[index % COLORS.length], margin: "4px 0" }}>
//                     {item.name}: ${item.total.toFixed(2)}
//                 </li>
//                 ))}
//             </ul>
//             </div>
//         </>
//         )}
//     </Box>
//   );
// }

// export default ExpenseSummary;