import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import { supabase } from "../supabaseClient";
import "../styles/Procurement.css";

const ProcurementPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    distributor_id: "",
    item_id: "",
    qty: 1,
    created_by: "", // TODO: replace with logged-in employee
  });

  // 🔹 Fetch purchases in Procurement stage
  const fetchPurchases = async () => {
    const { data, error } = await supabase
      .from("purchases")
      .select(
        `id, qty, total, status, stage, created_at,
         distributors(name), items(name, brand, model)`
      )
      .eq("stage", "procurement");

    if (error) console.error("Error fetching purchases:", error);
    else setPurchases(data || []);
  };

  // 🔹 Fetch distributors & items for dropdown
  const fetchOptions = async () => {
    const { data: distData } = await supabase
      .from("distributors")
      .select("id, name");
    setDistributors(distData || []);

    const { data: itemData } = await supabase
      .from("items")
      .select("id, name, price");
    setItems(itemData || []);
  };

  // 🔹 Create purchase
  const createPurchase = async (e) => {
    e.preventDefault();

    const item = items.find((i) => i.id === form.item_id);
    if (!item) return alert("Invalid item selected");

    const total = item.price * form.qty;

    const { error } = await supabase.from("purchases").insert([
      {
        distributor_id: form.distributor_id,
        item_id: form.item_id,
        qty: form.qty,
        total,
        status: "pending",
        stage: "procurement",
        created_by: form.created_by || "00000000-0000-0000-0000-000000000000",
      },
    ]);

    if (error) console.error("Error creating purchase:", error);
    else {
      fetchPurchases();
      setForm({ distributor_id: "", item_id: "", qty: 1, created_by: "" });
    }
  };

  // 🔹 Move purchase to warehouse stage
  const moveToWarehouse = async (id) => {
    const { error } = await supabase
      .from("purchases")
      .update({ stage: "warehouse" })
      .eq("id", id);

    if (error) console.error("Error updating stage:", error);
    else fetchPurchases();
  };

  useEffect(() => {
    fetchPurchases();
    fetchOptions();
  }, []);

  return (
    <div className="procurement-container">
      <Sidebar />
      <main className="procurement-main">
        <header className="procurement-header">
          <h1 className="procurement-title">Procurement</h1>
        </header>

        <div className="procurement-content">
          {/* Purchase Form Card */}
          <div className="procurement-card">
            <form onSubmit={createPurchase}>
              <div className="form-row">
                <div className="form-group product-group">
                  <label>Distributor</label>
                  <select
                    className="form-select"
                    value={form.distributor_id}
                    onChange={(e) =>
                      setForm({ ...form, distributor_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Distributor</option>
                    {distributors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group product-group">
                  <label>Item</label>
                  <select
                    className="form-select"
                    value={form.item_id}
                    onChange={(e) =>
                      setForm({ ...form, item_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Item</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} - ₱{i.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group qty-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.qty}
                    min="1"
                    onChange={(e) =>
                      setForm({ ...form, qty: Number(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-submit">
                <button type="submit" className="submit-btn">
                  ➕ Add Purchase
                </button>
              </div>
            </form>
          </div>

          {/* Purchases Table */}
          <div className="procurement-card">
            <h2>Pending Purchases</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Distributor</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Stage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id.slice(0, 8)}...</td>
                    <td>{p.distributors?.name || "N/A"}</td>
                    <td>
                      {p.items?.name} ({p.items?.brand} {p.items?.model})
                    </td>
                    <td>{p.qty}</td>
                    <td>₱{p.total}</td>
                    <td>{p.status}</td>
                    <td>{p.stage}</td>
                    <td>
                      <button
                        className="procurement-actions__buy"
                        onClick={() => moveToWarehouse(p.id)}
                      >
                        Send to Warehouse ➡️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcurementPage;
