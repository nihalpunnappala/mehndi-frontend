import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="income" element={<Income />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="reports" element={<Reports />} />
                </Route>
            </Routes>
        </AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop pauseOnHover theme="light" />
    </Router>
  );
}

export default App;
