import { useEffect, useState } from "react";

function ReceivedClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH RECEIVED CLAIMS
  // ======================================================

  useEffect(() => {
    const fetchClaims = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        setError("Please login to view received claims.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/claims/received/${user.id}`,
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
        console.error(
          "Error fetching received claims:",
          error
        );

        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // ======================================================
  // APPROVE OR REJECT CLAIM
  // ======================================================

  const updateClaimStatus = async (claimId, status) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/claims/${claimId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to update claim"
        );
        return;
      }

      // Update the claim in the frontend
      setClaims((currentClaims) =>
        currentClaims.map((claim) =>
          claim._id === claimId
            ? {
                ...claim,
                status: status,
              }
            : claim
        )
      );
    } catch (error) {
      console.error(
        "Error updating claim:",
        error
      );

      setError("Unable to connect to the server");
    }
  };

  // ======================================================
  // LOADING STATE
  // ======================================================

  if (loading) {
    return (
      <div className="items-page">
        <h1>Received Claims</h1>
        <p>Loading claims...</p>
      </div>
    );
  }

  // ======================================================
  // ERROR STATE
  // ======================================================

  if (error && claims.length === 0) {
    return (
      <div className="items-page">
        <h1>Received Claims</h1>

        <p className="error-message">
          {error}
        </p>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="items-page">

      <div className="items-header">

        <p className="tagline">
          ITEM MANAGEMENT
        </p>

        <h1>
          Received Claims
        </h1>

        <p>
          Review claims submitted for the found
          items you reported.
        </p>

      </div>

      {/* Error message */}
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* No claims */}
      {claims.length === 0 ? (

        <div className="empty-state">

          <h2>
            No claims received
          </h2>

          <p>
            You currently don't have any claims
            on your found items.
          </p>

        </div>

      ) : (

        <div className="items-grid">

          {claims.map((claim) => (

            <div
              className="item-card"
              key={claim._id}
            >

              <div className="item-card-content">

                {/* Claim Status */}
                <span
                  className={`claim-status ${claim.status}`}
                >
                  {claim.status.toUpperCase()}
                </span>

                {/* Item Name */}
                <h2>
                  {claim.item?.title}
                </h2>

                {/* Claim Message */}
                <p className="item-description">

                  <strong>
                    Claim message:
                  </strong>

                  <br />

                  {claim.message}

                </p>

                {/* Claim Details */}
                <div className="item-details">

                  <p>
                    <strong>
                      Claimant:
                    </strong>{" "}
                    {claim.claimedBy?.name ||
                      "Unknown"}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {claim.claimedBy?.email ||
                      "Not available"}
                  </p>

                  <p>
                    <strong>
                      Location:
                    </strong>{" "}
                    {claim.item?.location}
                  </p>

                  <p>
                    <strong>
                      Submitted:
                    </strong>{" "}
                    {new Date(
                      claim.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

                {/* Approve / Reject buttons */}
                {claim.status === "pending" && (

                  <div className="claim-actions">

                    <button
                      className="approve-btn"
                      onClick={() =>
                        updateClaimStatus(
                          claim._id,
                          "approved"
                        )
                      }
                    >
                      Approve Claim
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateClaimStatus(
                          claim._id,
                          "rejected"
                        )
                      }
                    >
                      Reject Claim
                    </button>

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default ReceivedClaims;
