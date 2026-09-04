import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportFoundItem() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before reporting an item.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: "found",
            title,
            description,
            category,
            location,
            date,
            image,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to report item");
        return;
      }

      setMessage("Found item reported successfully!");

      setTimeout(() => {
        navigate("/found-items");
      }, 1000);
    } catch (error) {
      console.error("Report found item error:", error);
      setError("Unable to connect to the server");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h1>Report Found Item</h1>

          <p>
            Provide details about the item you found.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="title">
              Item Name
            </label>

            <input
              id="title"
              type="text"
              placeholder="e.g. Blue Water Bottle"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              placeholder="Describe the item..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Category
            </label>

            <input
              id="category"
              type="text"
              placeholder="e.g. Electronics, Documents"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">
              Found Location
            </label>

            <input
              id="location"
              type="text"
              placeholder="e.g. Library"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">
              Date
            </label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">
              Image URL
            </label>

            <input
              id="image"
              type="text"
              placeholder="Optional image URL"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
            />
          </div>

          {error && (
            <p className="auth-message error-message">
              {error}
            </p>
          )}

          {message && (
            <p className="auth-message success-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-btn"
          >
            Report Found Item
          </button>

        </form>
      </div>
    </div>
  );
}

export default ReportFoundItem;