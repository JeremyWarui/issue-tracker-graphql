import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Dashboard } from "./components/DashboardPage"
import { IssuesList } from "./components/IssuesList"
import { IssueDetail } from "./components/IssueDetail"
import { UsersList } from "./components/UsersList"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/issues" element={<IssuesList />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/users" element={<UsersList />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
