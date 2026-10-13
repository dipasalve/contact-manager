import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  // Show or hide contacts
  const [showContacts, setShowContacts] = useState(false);

  const API = "http://localhost:5000/contacts";

  // Get all contacts
  const getContacts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      alert("Cannot connect to server");
    }
  };

  // Load contacts when page opens
  useEffect(() => {
    getContacts();
  }, []);

  // Add or update contact
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Enter a valid email address");
      return;
    }

    const contact = { name, phone, email };

    try {
      const url = editId ? `${API}/${editId}` : API;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      // Clear form after saving
      setName("");
      setPhone("");
      setEmail("");
      setEditId(null);

      // Refresh contacts without opening the list
      await getContacts();

      alert(editId ? "Contact updated successfully!" : "Contact added successfully!");
    } catch (error) {
      alert("Unable to save contact");
    }
  };

  // Edit contact
  const handleEdit = (contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setEmail(contact.email);
    setEditId(contact._id);

    // Show the list while editing
    setShowContacts(true);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete contact
  const handleDelete = async (id) => {
    if (window.confirm("Do you want to delete this contact?")) {
      try {
        const res = await fetch(`${API}/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Delete failed");
        }

        await getContacts();
        alert("Contact deleted successfully!");
      } catch (error) {
        alert("Unable to delete contact");
      }
    }
  };

  return (
    <div className="container">

      {/* Header */}
      <header>
        <h1>📇 Contact Manager</h1>
        <p>Manage all your contacts in one place</p>
      </header>

      {/* Add Contact Form */}
      <div className="form-box">
        <h2>{editId ? "Update Contact" : "Add New Contact"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="10-digit Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength="10"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            {editId ? "Update Contact" : "Add Contact"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel"
              onClick={() => {
                setName("");
                setPhone("");
                setEmail("");
                setEditId(null);
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* View Contacts Section */}
      <div className="contact-box">

        <button
          type="button"
          className="view-btn"
          onClick={() => setShowContacts(!showContacts)}
        >
          {showContacts ? "Hide Your Contacts ▲" : "View Your Contacts 👥"}
        </button>

        {showContacts && (
          <>
            <h2>My Contacts ({contacts.length})</h2>

            {contacts.length === 0 ? (
              <p className="empty">
                No contacts yet. Add your first contact!
              </p>
            ) : (
              <div className="contact-list">
                {contacts.map((contact) => (
                  <div className="contact-card" key={contact._id}>
                    <h3>{contact.name}</h3>

                    <p>📱 {contact.phone}</p>
                    <p>✉️ {contact.email}</p>

                    <button
                      type="button"
                      className="edit"
                      onClick={() => handleEdit(contact)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete"
                      onClick={() => handleDelete(contact._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer>
        Contact Manager | Built with React & Node.js
      </footer>

    </div>
  );
}

export default App;