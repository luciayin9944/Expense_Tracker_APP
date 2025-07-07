// ExpenseList.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box, Button } from "../styles";
import Pagination from "../components/Pagination";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    purchase_item: "",
    category: "",
    amount: "",
    date: ""
  });
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage);
    queryParams.append("per_page", 5);
    if (filterYear) queryParams.append("year", filterYear);
    if (filterMonth) queryParams.append("month", filterMonth);
  

    // `/expenses?page=2&per_page=5&year=2025&month=06`
    fetch(`/expenses?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => {
        // console.log("Loaded expenses:", data);
        setExpenses(data.expenses || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setExpenses([]);
      });
    }, [filterYear, filterMonth, currentPage]);


    function handleFilter() {
      const queryParams = new URLSearchParams();
      if (filterYear) queryParams.append("year", filterYear);
      if (filterMonth) queryParams.append("month", filterMonth);

      fetch(`/expenses/filter?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((r) => {
        if (r.ok)
          return r.json();
        //else:
        throw new Error("Filter failed");
      })
      .then((data) => {
        setExpenses(data.expenses || []);
      })
      .catch((err) => {
        console.error("Error filtering:", err);
      });
    }
    


  function handleEdit(expense) {
    setEditingId(expense.id);
    setEditFormData({
      purchase_item: expense.purchase_item,
      category: expense.category,
      amount: expense.amount,
      date: expense.date.slice(0, 10),
    });
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  }

  function handleEditSubmit(id) {
    fetch(`/expenses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(editFormData),
    })
      .then((r) => r.ok ? r.json() : Promise.reject("Update failed"))
      .then((updated) => {
        setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
        setEditingId(null);
      })
      .catch((err) => alert(err));
  }

  function handleDelete(id) {
    fetch(`/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((r) => {
      if (r.ok) setExpenses((prev) => prev.filter((e) => e.id !== id));
    });
  }

  return (
    <div>
      <FilterWrapper>
        <label>
          Year:
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">All</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            {/* {["2022", "2023", "2024", "2025"].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))} */}
          </select>
        </label>
        <label>
          Month:
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="">All</option>
            {[...Array(12)].map((_, i) => {
              const val = String(i + 1).padStart(2, "0");
              return <option key={val} value={val}>{val}</option>;
            })}
          </select>
        </label>
        <Button onClick={() => handleFilter()}>Filter</Button>
      </FilterWrapper>

      <div style={{ textAlign: "center" }}>
        {/* <p style={{ fontWeight: "bold" }}>Total: ${totalExpense.toFixed(2)}</p> */}
        <Button as={Link} to="/new" variant="outline">
          New Expense
        </Button>
      </div>

      <Wrapper>
        {expenses.length > 0 ? ( 
          expenses.map((expense) => (
            <ExpenseCard key={expense.id}>
              <Box>
                {editingId === expense.id ? (
                  <EditForm>
                    <input
                      name="purchase_item"
                      value={editFormData.purchase_item}
                      onChange={handleEditFormChange}
                    />
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditFormChange}
                    >
                      {["Food", "Clothing", "Utilities", "Home", "Travel", "Entertainment", "Health", "Other"].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      name="amount"
                      type="number"
                      value={editFormData.amount}
                      onChange={handleEditFormChange}
                    />
                    <input
                      name="date"
                      type="date"
                      value={editFormData.date}
                      onChange={handleEditFormChange}
                    />
                    <Button onClick={() => handleEditSubmit(expense.id)}>Save</Button>
                    <Button onClick={() => setEditingId(null)}>Cancel</Button>
                  </EditForm>
                ) : (
                  <>
                    <h2>{expense.purchase_item}</h2>
                    <p>
                      📂 {expense.category} <br />
                      💵 ${expense.amount} <br />
                      📅 {new Date(expense.date).toLocaleDateString()} <br />
                    </p>
                    <Button onClick={() => handleEdit(expense)}>Edit</Button>
                    <Button onClick={() => handleDelete(expense.id)}>Delete</Button>
                  </>
                )}
              </Box>
            </ExpenseCard>
          ))
        ) : (
          <>
            <h3>No Expense Records Found</h3>
            <Button as={Link} to="/new">Add a New Expense</Button>
          </>
        )}
      </Wrapper>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(pageNum) => setCurrentPage(pageNum)}
      />
    </div>
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
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input, select {
    padding: 8px;
    font-size: 16px;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 40px auto;
`;

export default ExpenseList;

















