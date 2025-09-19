import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import { supabase } from "../supabaseClient";
import "../styles/Procurement.css";
import { FaUserCircle } from "react-icons/fa";

const ProcurementPage = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    supplier_id: "",
    item_id: "",
    qty: 1,
    created_by: "",
  });

  // --- Fetch authenticated user & role ---
  useEffect(() => {
    const fetchUserAndRole = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.error("User not authenticated");
          return;
        }

        setUser(user);

        // Adjust column if needed to match employees table
        const { data: employeeData, error: empError } = await supabase
          .from("employees")
          .select(`id, full_name, email, role_id, roles:roles(id, role, label)`)
          .eq("auth_user_id", user.id) // ensure correct column name
          .single();

        if (empError || !employeeData) {
          console.warn("No employee record found, falling back to warehouse role.");
          setUserRole("procurement");
          // fallback: use auth user id
          setForm((prev) => ({ ...prev, created_by: user.id }));
        } else {
          setUserRole(employeeData.roles?.role || "warehouse");
          setForm((prev) => ({ ...prev, created_by: employeeData.id }));
        }
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };

    fetchUserAndRole();
  }, []);

  // --- Fetch all purchases ---
  const fetchPurchases = async () => {
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        id, qty, total, status, stage, created_at,
        suppliers:supplier_id ( name ),
        items:item_id ( name, brand, model, price )
      `)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching purchases:", error);
    else setPurchases(data || []);
  };

  // --- Fetch suppliers & items for dropdowns ---
  const fetchOptions = async () => {
    const { data: suppliersData } = await supabase
      .from("suppliers")
      .select("id, name");
    setSuppliers(suppliersData || []);

    const { data: itemsData } = await supabase
      .from("items")
      .select("id, name, price, brand, model");
    setItems(itemsData || []);
  };

  // --- CREATE ---
  const createPurchase = async (e) => {
    e.preventDefault();

    if (!form.created_by) {
      return alert("User not identified, cannot create purchase.");
    }

    const selectedItem = items.find((i) => i.id === form.item_id);
    if (!selectedItem) return alert("Invalid item selected");

    const total = selectedItem.price * form.qty;

    const { error } = await supabase.from("purchases").insert([
      {
        supplier_id: form.supplier_id,
        item_id: form.item_id,
        qty: form.qty,
        total,
        status: "pending",
        stage: "procurement",
        created_by: form.created_by,
      },
    ]);

    if (error) {
      console.error("Error creating purchase:", error);
    } else {
      await fetchPurchases();
      setForm((prev) => ({
        ...prev,
        supplier_id: "",
        item_id: "",
        qty: 1,
      }));
    }
  };

  // --- UPDATE (Approve & move to warehouse) ---
  const moveToWarehouse = async (id) => {
    const { error } = await supabase
      .from("purchases")
      .update({ stage: "warehouse", status: "approved" })
      .eq("id", id);

    if (error) console.error("Error moving purchase:", error);
    else fetchPurchases();
  };

  // --- DELETE ---
  const deletePurchase = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;

    const { error } = await supabase.from("purchases").delete().eq("id", id);

    if (error) console.error("Error deleting purchase:", error);
    else fetchPurchases();
  };

  useEffect(() => {
    fetchPurchases();
    fetchOptions();
  }, []);

  return (
    <div className="procurement-container">
      <Sidebar userRole={userRole} />
      <main className="procurement-main">
        <header className="procurement-header">
          <FaUserCircle className="user-pfp" />
          <div className="user-details">
            <span className="user-name">
              {user?.user_metadata?.full_name ||
                user?.user_metadata?.name ||
                user?.email ||
                "User"}
            </span>
            <span className="user-role" style={{ fontSize: 12, color: "#666" }}>
              Role: {userRole}
            </span>
          </div>
        </header>

        <div className="procurement-content">
          {/* --- Form --- */}
          <div className="procurement-main__header">
            <h1 className="procurement-title">Procurement Form</h1>
          </div>
          <div className="procurement-card">
            <form onSubmit={createPurchase}>
              <div className="form-row">
                <div className="form-group product-group">
                  <label>Supplier</label>
                  <select
                    className="form-select"
                    value={form.supplier_id}
                    onChange={(e) =>
                      setForm({ ...form, supplier_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
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
                    min="1"
                    className="form-input"
                    value={form.qty}
                    onChange={(e) =>
                      setForm({ ...form, qty: Number(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-submit">
                <button type="submit" className="action-btn action-approve">
                  + Add Purchase
                </button>
              </div>
            </form>
          </div>

          {/* --- Purchases Table --- */}
          <div className="procurement-main__header">
            <h1 className="procurement-title">Pending Purchases</h1>
          </div>
          <div className="procurement-table__main">
            <table className="procurement-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Supplier</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Stage</th>
                  <th className="last-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id.slice(0, 8)}...</td>
                    <td>{p.suppliers?.name || "N/A"}</td>
                    <td>
                      {p.items?.name} ({p.items?.brand} {p.items?.model})
                    </td>
                    <td>{p.qty}</td>
                    <td>₱{p.total}</td>
                    <td>
                      <span className={`status-badge status-${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{p.stage}</td>
                    <td className="flex gap-4">
                      <button
                        className="action-btn action-approve"
                        onClick={() => moveToWarehouse(p.id)}
                      >
                        Approve & Send to Warehouse
                      </button>
                      <button
                        className="action-btn action-deny"
                        onClick={() => deletePurchase(p.id)}
                      >
                        Delete Purchase
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
