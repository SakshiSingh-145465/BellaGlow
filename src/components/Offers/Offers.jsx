import React, { useEffect, useState } from "react";
import OfferCard from "./OfferCard";
import { supabase } from "../../lib/supabaseClient";
import "./Offers.css";

function Offers({ onSelect }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("salon_offers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Offers loading error:", error);
        setOffers([]);
      } else {
        setOffers(data || []);
      }

      setLoading(false);
    };

    loadOffers();
  }, []);

  return (
    <section className="offers-section" id="offers">
      <div className="offers-container">

        <div className="offers-header">

          <div className="offers-label">
            <span></span>
            SPECIAL OFFERS
          </div>

          <div className="offers-heading-row">
            <h2>
              A little more
              <br />
              <em>to love.</em>
            </h2>

            <p>
              Beautiful experiences deserve beautiful little extras.
              Explore our current offers and make your next BellaGlow
              visit even more special.
            </p>
          </div>

        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <p>Loading our latest offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <p>
              Our special offers are currently being updated.
              Please check again soon.
            </p>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map((offer, index) => (
              <OfferCard
                key={offer.id}
                offer={{
                  number: String(index + 1).padStart(2, "0"),
                  tag:
                    index === 0
                      ? "NEW CLIENT"
                      : index === 1
                      ? "SPECIAL OFFER"
                      : "SELF CARE",
                  title: offer.title,
                  discount: offer.discount,
                  description: offer.description,
                  valid: offer.valid,
                  image_url: offer.image_url,
                }}
                onSelect={() =>
                  onSelect?.({
                    type: "offer",
                    name: offer.title,
                    discount: offer.discount,
                    valid: offer.valid,
                  })
                }
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Offers;