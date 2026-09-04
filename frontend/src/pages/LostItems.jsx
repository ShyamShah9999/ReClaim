import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LostItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/items"
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch items");
          return;
        }

        const lostItems = data.items.filter(
          (item) => item.type === "lost"
        );

        setItems(lostItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Get unique categories
  const categories = [
    ...new Set(items.map((item) => item.category)),
  ];

  // Get unique locations
  const locations = [
    ...new Set(items.map((item) => item.location)),
  ];

  // Filter items
  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "" || item.category === category;

    const matchesLocation =
      location === "" || item.location === location;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation
    );
  });

  if (loading) {
    return (
      <div className="items-page">
        <h1>Lost Items</h1>
        <p>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="items-page">
        <h1>Lost Items</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="items-page">

      <div className="items-header">
        <p className="tagline">CAMPUS LOST & FOUND</p>

        <h1>Lost Items</h1>

        <p>
          Browse items reported lost by students on campus.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="item-filters">

        <input
          type="text"
          placeholder="Search lost items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>

          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

      </div>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <h2>No lost items found</h2>

          <p>
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="items-grid">

          {filteredItems.map((item) => (
            <div
              className="item-card"
              key={item._id}
               onClick={() => navigate(`/items/${item._id}`)}
               style={{ cursor: "pointer" }}
            >
              <div className="item-card-content">

                <span className="item-type">
                  LOST
                </span>

                <h2>{item.title}</h2>

                <p className="item-description">
                  {item.description}
                </p>

                <div className="item-details">

                  <p>
                    <strong>Category:</strong>{" "}
                    {item.category}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {item.location}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </p>

                </div>

                <p className="reported-by">
                  Reported by{" "}
                  {item.reportedBy?.name || "Unknown"}
                </p>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default LostItems;