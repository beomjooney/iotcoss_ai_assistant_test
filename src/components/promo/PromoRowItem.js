import React from 'react';

export default function PromoRowItem(props) {
  return (
    <div className="col-lg-3 col-sm-6 mb-lg-0">
      <div className="card single-promo-card single-promo-hover">
        <div className="card-body">
          <div className="pb-2">
            <span className="ti-credit-card icon-md color-secondary"></span>
          </div>
          <div className="pt-2 pb-3">
            <h5>{props.first_name}</h5>
            <p className="text-muted mb-0">{props.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
