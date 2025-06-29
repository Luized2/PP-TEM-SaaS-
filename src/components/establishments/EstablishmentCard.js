import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./EstablishmentCard.css";

function EstablishmentCard({ establishment }) {
  const { id, name, description, address, category, rating, imageUrl } =
    establishment;

  const truncatedDescription =
    description?.length > 100
      ? `${description.substring(0, 100)}...`
      : description;
  const placeholderImage = "https://placehold.co/600x400/e2e8f0/e2e8f0?text=";

  return (
    <div className="establishment-card">
      <Link to={`/establishments/${id}`} className="card-link-wrapper">
        <div className="establishment-card-image">
          <img
            src={imageUrl || placeholderImage}
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage;
            }}
          />
        </div>
        <div className="establishment-card-content">
          <div className="establishment-card-header">
            <h3 className="establishment-card-title">{name}</h3>
            {rating && (
              <div className="establishment-card-rating">
                {rating.toFixed(1)} <span className="rating-star">★</span>
              </div>
            )}
          </div>
          <p className="establishment-card-category">{category}</p>
          <p className="establishment-card-description">
            {truncatedDescription || "Sem descrição disponível."}
          </p>
          <div className="establishment-card-footer">
            <span className="establishment-card-address">{address}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

EstablishmentCard.propTypes = {
  establishment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    address: PropTypes.string,
    category: PropTypes.string,
    rating: PropTypes.number,
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default EstablishmentCard;
