import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ItemDetails() {
  const { id } = useParams();
  console.log("Logged in user:", JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claimMessage, setClaimMessage] = useState("");
  const [claimStatus, setClaimStatus] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/items/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch item");
          return;
        }

        setItem(data.item);
      } catch (error) {
        console.error("Error fetching item:", error);
        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="items-page">
        <h1>Loading item...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="items-page">
        <h1>Item not found</h1>
        <p>{error}</p>
        <button
          className="auth-btn"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="items-page">
      <div className="items-header">
        <p className="tagline">
          {item.type.toUpperCase()} ITEM
        </p>

        <h1>{item.title}</h1>

        <p>{item.description}</p>
      </div>

      <div className="empty-state">
        <h2>Item Details</h2>

        <div className="item-details">
          <p>
            <strong>Type:</strong>{" "}
            {item.type.toUpperCase()}
          </p>

          <p>
            <strong>Category:</strong> {item.category}
          </p>

          <p>
            <strong>Location:</strong> {item.location}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(item.date).toLocaleDateString()}
          </p>

          <p>
            <strong>Status:</strong> {item.status}
          </p>

          <p>
            <strong>Reported by:</strong>{" "}
            {item.reportedBy?.name || "Unknown"}
          </p>
        </div>

        <button
          className="auth-btn"
          onClick={() => navigate(-1)}
        >
         Go Back
        </button>

        {item.type === "found" && item.status === "active" && (
  <div className="claim-section">
    <h2>Claim This Item</h2>

    <p>
      Explain why you believe this item belongs to you.
    </p>

    <textarea
      value={claimMessage}
      onChange={(e) => setClaimMessage(e.target.value)}
      placeholder="Example: I lost this water bottle near the library. It has a small scratch on the cap..."
    />

    <button
  className="auth-btn"
  onClick={async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setClaimStatus("Please login before submitting a claim.");
      return;
    }

    if (!claimMessage.trim()) {
      setClaimStatus("Please explain why you believe this item is yours.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:5000/api/claims",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      itemId: item._id,
      message: claimMessage,
    }),
  }
);

      const data = await response.json();

      if (!response.ok) {
        setClaimStatus(data.message || "Failed to submit claim");
        return;
      }

      setClaimStatus("Claim submitted successfully!");
      setClaimMessage("");
    } catch (error) {
      console.error("Claim error:", error);
      setClaimStatus("Unable to connect to the server");
    }
  }}
>
  Submit Claim
</button>

    {claimStatus && (
      <p className="success-message">
        {claimStatus}
      </p>
    )}
  </div>
)}
      </div>
    </div>
  );
}

export default ItemDetails;