import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://campus-marketplace-api-filmt.onrender.com/api/listings";

function App() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortPrice, setSortPrice] = useState("none");
  const [editingId, setEditingId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const [profile, setProfile] = useState({
    name: "",
    course: "",
    year: "1st Year",
  });

  const [showProfile, setShowProfile] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Books",
    condition: "Good",
    imageUrl: "",
    location: "",
  });

  const fetchListings = async () => {
    try {
      const response = await axios.get(API_URL);
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.price) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(API_URL, form);
      }

      resetForm();
      fetchListings();
    } catch (error) {
      console.error("Error saving listing:", error);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      category: "Books",
      condition: "Good",
      imageUrl: "",
      location: "",
    });
  };

  const editListing = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      condition: item.condition,
      imageUrl: item.imageUrl || "",
      location: item.location || "",
    });

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const deleteListing = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setFavorites(favorites.filter((fav) => fav !== id));

      fetchListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredListings = listings
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortPrice === "low") {
        return Number(a.price) - Number(b.price);
      }

      if (sortPrice === "high") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    });

  return (
    <div>
      {/* HEADER */}
      <header>
        <h1>Campus Marketplace</h1>
        <p>Buy • Sell • Exchange • Connect</p>

        <button
          onClick={() => setShowProfile(!showProfile)}
          style={{
            marginTop: "20px",
            background: "white",
            color: "#4f46e5",
            border: "none",
            padding: "10px 20px",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          👤 {profile.name ? profile.name : "Student Profile"}
        </button>
      </header>

      <main>
        {/* PROFILE */}
        {showProfile && (
          <section>
            <h2>👤 Student Profile</h2>

            <input
              name="name"
              placeholder="Your Name"
              value={profile.name}
              onChange={handleProfileChange}
            />

            <br />
            <br />

            <input
              name="course"
              placeholder="Course / Branch"
              value={profile.course}
              onChange={handleProfileChange}
            />

            <br />
            <br />

            <select
              name="year"
              value={profile.year}
              onChange={handleProfileChange}
            >
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>

            <p style={{ marginTop: "15px" }}>
              {profile.name
                ? `Welcome, ${profile.name}!`
                : "Create your student profile."}
            </p>
          </section>
        )}

        {/* SEARCH */}
        <section>
          <h2>🔎 Find Items</h2>

          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Furniture">Furniture</option>
            <option value="Notes">Notes</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
          >
            <option value="none">Sort by Price</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </section>

        {/* ADD / EDIT */}
        <section>
          <h2>
            {editingId ? "✏️ Edit Listing" : "➕ Post an Item"}
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="Item title"
              value={form.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />

            <input
              name="price"
              type="number"
              placeholder="Price (₹)"
              value={form.price}
              onChange={handleChange}
            />

            <input
              name="imageUrl"
              placeholder="Image URL (optional)"
              value={form.imageUrl}
              onChange={handleChange}
            />

            <input
              name="location"
              placeholder="Campus location (e.g. Block A, Hostel)"
              value={form.location}
              onChange={handleChange}
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Books</option>
              <option>Electronics</option>
              <option>Vehicles</option>
              <option>Furniture</option>
              <option>Notes</option>
              <option>Other</option>
            </select>

            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
            >
              <option>New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Used</option>
            </select>

            <button type="submit">
              {editingId ? "Update Listing" : "Add Listing"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{ background: "#64748b" }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {/* LISTINGS */}
        <section>
          <h2>🛍️ Marketplace Listings</h2>

          {filteredListings.length === 0 ? (
            <p>No listings found.</p>
          ) : (
            filteredListings.map((item) => (
              <article key={item.id}>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "15px",
                    }}
                  />
                )}

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <strong>₹{item.price}</strong>

                <p>
                  🏷️ {item.category} • {item.condition}
                </p>

                {item.location && (
                  <p>📍 {item.location}</p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    style={{
                      background: favorites.includes(item.id)
                        ? "#e11d48"
                        : "#f59e0b",
                    }}
                  >
                    {favorites.includes(item.id)
                      ? "❤️ Saved"
                      : "♡ Save"}
                  </button>

                  <button
                    onClick={() => editListing(item)}
                    style={{ background: "#4f46e5" }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deleteListing(item.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;