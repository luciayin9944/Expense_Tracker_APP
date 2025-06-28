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

  function handleDelete(id) {
  fetch(`/expenses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((r) => {
      if (r.ok) {
        // Remove the deleted expense from the local state
        setExpenses((prev) => prev.filter((e) => e.id !== id));
      } else {
        console.error("Delete failed");
      }
    });
}

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
              <Button onClick={() => handleDelete(expense.id)}>
                Delete
              </Button>
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










