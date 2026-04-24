import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/v1/products";
const AUTH = "http://localhost:8080/api/v1/auth/login";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(AUTH, { username: username.trim(), password: password.trim() });
      onLogin(res.data.token);
    } catch (e) {
      if (e.response?.status === 401) {
        setError("❌ Invalid username or password");
      } else {
        setError("❌ Cannot reach API (check backend, URL, or CORS)");
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f1f5f9" }}>
      <div style={{ background: "white", padding: 40, borderRadius: 12, width: 360, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#1e40af", textAlign: "center", marginBottom: 24 }}>🔐 NexaCore Login</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
        {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}
        <button onClick={handleLogin}
          style={{ width: "100%", padding: 12, background: "#1e40af", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 16 }}>
          Login
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 16 }}>username: admin / password: admin123</p>
      </div>
    </div>
  );
}

function Inventory({ token, onLogout }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stockQuantity: "", category: "", sku: "" });
  const [message, setMessage] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchProducts = async () => {
    const res = await axios.get(API, { headers });
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async () => {
    await axios.post(API, { ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity) }, { headers });
    setMessage("✅ Product added!");
    setForm({ name: "", description: "", price: "", stockQuantity: "", category: "", sku: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`, { headers });
    fetchProducts();
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#1e40af" }}>🏬 NexaCore Inventory</h1>
        <button onClick={onLogout}
          style={{ padding: "8px 20px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <div style={{ background: "#f1f5f9", padding: 20, borderRadius: 10, marginBottom: 24 }}>
        <h2>Add Product</h2>
        {["name","description","price","stockQuantity","category","sku"].map(field => (
          <input key={field} placeholder={field} value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            style={{ display: "block", margin: "8px 0", padding: 8, width: "100%", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        ))}
        <button onClick={handleSubmit}
          style={{ marginTop: 10, padding: "10px 24px", background: "#1e40af", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Add Product
        </button>
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>

      <h2>Products ({products.length})</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1e40af", color: "white" }}>
            {["ID","Name","Category","Price","Stock","SKU","Action"].map(h => (
              <th key={h} style={{ padding: 10, textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id} style={{ background: i % 2 === 0 ? "#f8fafc" : "white" }}>
              <td style={{ padding: 10 }}>{p.id}</td>
              <td style={{ padding: 10 }}>{p.name}</td>
              <td style={{ padding: 10 }}>{p.category}</td>
              <td style={{ padding: 10 }}>${p.price}</td>
              <td style={{ padding: 10 }}>{p.stockQuantity}</td>
              <td style={{ padding: 10 }}>{p.sku}</td>
              <td style={{ padding: 10 }}>
                <button onClick={() => handleDelete(p.id)}
                  style={{ padding: "4px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return token ? <Inventory token={token} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
}