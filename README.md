# Expense_Tracker_Flask_Backend

A secure, full-authentication Flask backend for a productivity tool that allows users to track personal expenses. Built from scratch to support integration with a pre-built frontend (JWT-based or session-based), this API enables users to manage their own data privately and securely.

## 🔐 Features

- **Full User Authentication**  
  Supports both JWT-based or session-based authentication (choose one method to implement).
  
- **User-Owned Resource**  
  Each authenticated user can manage their own **Expenses**, with full CRUD functionality.

- **Secure Access Control**  
  Users **cannot access or modify other users’ data**.

- **Pagination Support**  
  List endpoints are paginated for better performance and usability.

- **Frontend Integration Ready**  
  Compatible with a provided frontend that includes login/registration flows. Your backend must support all required endpoints for integration.

---


## Set Up

 Clone the repository
   ```bash
   git clone https://github.com/luciayin9944/Expense_Tracker_Flask_Backend.git
   cd Expense_Tracker_Flask_Backend
  ```


To get set up, run:

```bash
pipenv install && pipenv shell
npm install --prefix client
cd server
flask db init
flask db migrate -m "initial migration"
flask db upgrade head
python seed.py
```

You can run the Flask server with:

```bash
python app.py
```
And you can run React in another terminal from the project root directory with:

```bash
npm start --prefix client
```
