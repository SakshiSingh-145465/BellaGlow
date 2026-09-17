import React, { useCallback, useEffect, useState } from "react";
import PackagesCard from "./PackagesCard";
import { supabase } from "../../lib/supabaseClient";
import "./Packages.css";

function Packages({ onSelect }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPackages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("salon_packages")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Packages loading error:", error);
        return;
      }

      setPackages(data || []);
    } catch (error) {
      console.error("Packages loading error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // First load
    loadPackages();

    // Refresh whenever user comes back to website tab
    const handleFocus = () => {
      loadPackages();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadPackages]);

  const handlePackageSelect = (pkg) => {
    if (!onSelect) return;

    onSelect({
      type: "package",
      name: pkg.name,
      price: pkg.price,
      durationMinutes: pkg.duration_minutes,
    });
  };

  return (
    <section className="packages-section" id="packages">
      <div className="packages-container">

        {/* HEADER */}
        <div className="packages-header">

          <div className="packages-label">
            <span></span>
            BEAUTY PACKAGES
          </div>

          <div className="packages-heading-row">

            <h2>
              Curated for
              <br />
              your <em>moment.</em>
            </h2>

            <p>
              Discover our thoughtfully designed beauty packages,
              created to give you more of what you love in one
              beautiful experience.
            </p>

          </div>

        </div>

        {/* LOADING */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <p>Loading our beauty packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <p>
              Our packages are currently being updated.
              Please check again soon.
            </p>
          </div>
        ) : (
          <div className="packages-grid">
            {packages.map((item, index) => (
              <PackagesCard
                key={item.id}
                packageData={{
                  ...item,

                  number:
                    item.number ||
                    String(index + 1).padStart(2, "0"),

                  durationMinutes:
                    item.duration_minutes || 180,

                  services: Array.isArray(item.services)
                    ? item.services
                    : [],

                  featured:
                    item.is_featured === true,
                }}
                onSelect={() => handlePackageSelect(item)}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Packages;