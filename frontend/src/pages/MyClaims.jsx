import { useEffect, useState } from "react";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaims = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        setError("Please login to view your claims.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

const response = await fetch(
  `http://localhost:5000/api/claims/my-claims/${user.id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch claims");
          return;
        }

        setClaims(data.claims);
      } catch (error) {
        console.error("Error fetching claims:", error);
        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) {
    return (
      <div className="items-page">
        <h1>My Claims</h1>
        <p>Loading claims...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="items-page">
        <h1>My Claims</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="items-page">
      <div className="items-header">
        <p className="tagline">RECLAIM ACCOUNT</p>
        <h1>My Claims</h1>
        <p>
          Track the claims you have submitted for found items.
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="empty-state">
          <h2>No claims yet</h2>
          <p>
            You haven't submitted any claims for found items.
          </p>
        </div>
      ) : (
        <div className="items-grid">
          {claims.map((claim) => (
            <div className="item-card" key={claim._id}>
              <div className="item-card-content">
                <span className={`claim-status ${claim.status}`}>
                {claim.status.toUpperCase()}
                 </span>

                <h2>{claim.item?.title}</h2>

                <p className="item-description">
                  {claim.message}
                </p>

                <div className="item-details">
                  <p>
                    <strong>Category:</strong>{" "}
                    {claim.item?.category}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {claim.item?.location}
                  </p>

                  <p>
                    <strong>Claim Status:</strong>{" "}
                    {claim.status}
                  </p>

                  <p>
                    <strong>Submitted:</strong>{" "}
                    {new Date(
                      claim.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyClaims;