# Expense_Tracker_App

This is a secure full-stack expense tracking application built with **React** (frontend) and **Flask** (backend). Users can register, log in, and manage their personal expenses with full CRUD functionality. The backend provides robust APIs with authentication, secure access control, filtering, categorization, and analytical features like summary and percentage breakdowns.

---


## 🔐 Features

- **Full Authentication (JWT or Session-based)**
- **User-owned Expenses Resource**: Only the owner can view, create, update, or delete their data
- **CRUD Operations** for expenses
- **Date-Based Filtering**: Filter expenses by date or date range
- **Total Spending Calculation**: Instantly see how much you’ve spent in a given period
- **Expense Categories**: Supports categories like Food, Travel, Health, Utilities, etc.
- **Expense Summary View**:
  - Calculates the total per category
  - Displays percentage breakdowns for visual analysis
- **Pagination Support** for large datasets
- **Frontend Integration Ready**: Designed to work seamlessly with the provided React frontend

---



## 🧠 Tech Stack

### 🔧 Backend
- **Flask**: RESTful API Framework
- **Flask-SQLAlchemy**: ORM for database interaction
- **Flask-Migrate**: Handles database migrations
- **Marshmallow**: Schema validation & serialization
- **JWT / Flask-Session**: Authentication
- **SQLite / PostgreSQL**: Database

### 🎨 Frontend
- **React**: Frontend library
- **Axios**: For making API requests
- **React Router**: For client-side routing
- **Recharts**: For category percentage visualizations 

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
npm install --prefix client-with-jwt
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
npm start --prefix client-with-jwt
```
