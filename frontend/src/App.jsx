import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/v1/products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stockQuantity: "", category: "", sku: "" });
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async () => {
    await axios.post(API, { ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity) });
    setMessage("✅ Product added!");
    setForm({ name: "", description: "", price: "", stockQuantity: "", category: "", sku: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ color: "#1e40af" }}>🏬 NexaCore Inventory</h1>

      <div style={{ background: "#f1f5f9", padding: 20, borderRadius: 10, marginBottom: 24 }}>
        <h2>Add Product</h2>
        {["name","description","price","stockQuantity","category","sku"].map(field => (
          <input key={field} placeholder={field} value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            style={{ display: "block", margin: "8px 0", padding: 8, width: "100%", borderRadius: 6, border: "1px solid #cbd5e1" }}
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