import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Login from "../pages/Login";
import ExpenseList from "../pages/ExpenseList";
import NewExpense from "../pages/NewExpense";
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
        {/* <p>Welcome!</p> */}
        <Switch>
          <Route exact path="/new">
            <NewExpense user={user} />
          </Route>
          <Route exact path="/">
            <ExpenseList key={user.id + Date.now()} />
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
