import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box, Button } from "../styles";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    purchase_item: "",
    amount: "",
    date: ""
  });

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

  function handleEdit(expense) {
    setEditingId(expense.id);
    setEditFormData({
      purchase_item: expense.purchase_item,
      amount: expense.amount,
      date: expense.date.slice(0, 10)
    });
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  }


  // function handleEditSubmit(id) {
  //   fetch(`/expenses/${id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`
  //     },
  //     body: JSON.stringify(editFormData)
  //   })
  //   .then((r) => {
  //     if (r.ok) {
  //       return r.json();
  //     } else {
  //       throw new Error("Failed to update expense");
  //     }
  //   })
  //   .then((updatedExpense) => {
  //     setExpenses(expenses.map(expense => 
  //       expense.id === id ? updatedExpense : expense
  //     ));
  //     setEditingId(null)
  //   })
  //   .catch((error) => {
  //     console.error("Error updating expense:", error);
  //     alert(`Update failed: ${error.message}\nCheck console for details`);
  //     if (error.message.includes("401")) {
  //       // 处理token过期
  //       localStorage.removeItem("token");
  //       window.location.href = "/login";
  //     }
  //   })
  // }

  function handleEditSubmit(id) {
    fetch(`/expenses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(editFormData)
    })
    .then((r) => {
      if (r.ok) return r.json();
      throw new Error("Failed to update expense");
    })
    .then((updatedExpense) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? updatedExpense : e))
      );
      setEditingId(null);
    })
    .catch((err) => {
      console.error("Update failed:", err);
      alert("Error updating expense.");
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
  }




  return (
    <Wrapper>
      {expenses.length > 0 ? (
        expenses.map((expense) => (
          <ExpenseCard key={expense.id}>
            <Box>
              {editingId === expense.id ? (
                <EditForm>
                  <input
                    type="text"
                    name="purchase_item"
                    value={editFormData.purchase_item}
                    onChange={handleEditFormChange}
                  />
                  <input
                    type="number"
                    name="amount"
                    value={editFormData.amount}
                    onChange={handleEditFormChange}
                  />
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleEditFormChange}
                  />
                  <Button onClick={() => handleEditSubmit(expense.id)}>
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </EditForm>
              ) : (
                <>
                  <h2>{expense.purchase_item}</h2>
                  <p>
                    💵 Amount: ${expense.amount}
                    <br />
                    📅 Date: {new Date(expense.date).toLocaleDateString()}
                    <br />
                  </p>
                  <Button onClick={() => handleEdit(expense)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(expense.id)}>
                    Delete
                  </Button>
                </>
              )}
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


const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
`;


export default ExpenseList;

