import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Login from "../pages/Login";
import ExpenseList from "../pages/ExpenseList";
import NewExpense from "../pages/NewExpense";
import ExpenseSummary from "../pages/ExpenseSummary";
import { Switch, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    });
  }, []);

  const onLogin = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
  }

  if (!user) return <Login onLogin={onLogin} />;

  return (
    <>
      <NavBar setUser={setUser} />
      <main>
        {/* <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Welcome!</h1> */}
        <Switch>
          <Route exact path="/new">
            <NewExpense user={user} key={Date.now()} />
          </Route>
          <Route exact path="/">
            <ExpenseList userId={user.id} />
          </Route>
          <Route exact path="/summary">
            <ExpenseSummary />
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
