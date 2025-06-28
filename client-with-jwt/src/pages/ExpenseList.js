import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box, Button } from "../styles";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("/expenses", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Unauthorized or failed to fetch");
        }
      })
      .then((data) => {
        setExpenses(data.expenses || []);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        setExpenses([]);
      });
  }, []);

  return (
    <Wrapper>
      {expenses.length > 0 ? (
        expenses.map((expense) => (
          <ExpenseCard key={expense.id}>
            <Box>
              <h2>{expense.purchase_item}</h2>
              <p>
                💵 Amount: ${expense.amount}
                <br />
                📅 Date: {new Date(expense.date).toLocaleDateString()}
                <br />
              </p>
            </Box>
          </ExpenseCard>
        ))
      ) : (
        <>
          <h2>No Expense Records Found</h2>
          <Button as={Link} to="/new">
            Add a New Expense
          </Button>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 800px;
  margin: 40px auto;
`;

const ExpenseCard = styled.article`
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f6f8fa;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export default ExpenseList;











// import { useEffect, useState } from "react";
// import ReactMarkdown from "react-markdown";
// import { Link } from "react-router-dom";
// import styled from "styled-components";
// import { Box, Button } from "../styles";

// function ExpenseList() {
//   const [expenses, setExpenses] = useState([]);

//   // JWT - add an Authorization header with token from localStorage:
//   useEffect(() => {
//   fetch("/expenses", {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`
//     }
//   })
//     .then((r) => r.json())
//     .then(setExpenses);
// }, []);

//   return (
//     <Wrapper>
//       {expenses.length > 0 ? (
//         expenses.map((expense) => (
//           <Expense key={expense.id}>
//             <Box>
//               <h2>{expense.title}</h2>
//               <p>
//                 <em>Time to Complete: {expense.minutes_to_complete} minutes</em>
//                 &nbsp;·&nbsp;
//                 <cite>By {expense.user.username}</cite>
//               </p>
//               <ReactMarkdown>{expense.instructions}</ReactMarkdown>
//             </Box>
//           </Expense>
//         ))
//       ) : (
//         <>
//           <h2>No Record Found</h2>
//           <Button as={Link} to="/new">
//             Add a New Expense
//           </Button>
//         </>
//       )}
//     </Wrapper>
//   );
// }

// const Wrapper = styled.section`
//   max-width: 800px;
//   margin: 40px auto;
// `;

// const Expense = styled.article`
//   margin-bottom: 24px;
// `;

// export default ExpenseList;
