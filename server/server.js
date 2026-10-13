// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create Express app
const app = express();

// Enable frontend connection
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/contactManager")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

// Contact database model
const Contact = mongoose.model("Contact", {
    name: String,
    phone: String,
    email: String
});

// Display all contacts
app.get("/contacts", async (req, res) => {
    const contacts = await Contact.find();
    res.json(contacts);
});

// Add new contact
app.post("/contacts", async (req, res) => {
    const contact = await Contact.create(req.body);
    res.json(contact);
});

// Update contact
app.put("/contacts/:id", async (req, res) => {
    const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(contact);
});

// Delete contact
app.delete("/contacts/:id", async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted" });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});