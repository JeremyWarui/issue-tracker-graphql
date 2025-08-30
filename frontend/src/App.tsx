import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/DashboardPage";
import { IssuesList } from "./components/IssuesList";
import { IssueDetail } from "./components/IssueDetail";
import { UsersList } from "./components/UsersList";
import { MyIssues } from "./components/MyIssues";
import { SignUpForm } from "./components/RegisterPage";
import { LoginForm } from "./components/LoginForm";
import "./App.css";
import { useUser } from "./contexts/AuthContext";
import { Toaster } from "sonner";


function App() {
  const { token, setToken } = useUser()
  console.log("app token: ", token);
  
 
  return (
    <Router>
      <div className="container-fluid">
        {!token ? (
          <Routes>
            <Route path="/" element={<LoginForm setToken={setToken} />} />
            <Route path="/login" element={<LoginForm setToken={setToken} />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="*" element={<LoginForm setToken={setToken} />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/issues" element={<IssuesList />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/my-issues" element={<MyIssues />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm setToken={setToken} />} />
          </Routes>
        )}
      </div>
      <Toaster richColors expand={true} position="top-center" />
    </Router>
  );
}

export default App;
