import React from 'react';

const Promo = () => {
  return (
    <>
      <section className="promo-section ptb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-8">
              <div className="section-heading text-center mb-5">
                <h2>Why Peoples Love AppCo?</h2>
                <p className="lead">
                  Following reasons show advantages of adding AppCo to your lead pages, demos and checkouts evisculate
                  imperatives rather.
                </p>
              </div>
            </div>
          </div>
          <div className="row equal">
            <div className="col-md-4 col-lg-4">
              <div className="single-promo single-promo-hover single-promo-1 rounded text-center white-bg p-5 h-100">
                <div className="circle-icon mb-5">
                  <span className="ti-vector text-white"></span>
                </div>
                <h5>Clean Design</h5>
                <p>Increase sales by showing true dynamics of your website.</p>
              </div>
            </div>
            <div className="col-md-4 col-lg-4">
              <div className="single-promo single-promo-hover single-promo-1 rounded text-center white-bg p-5 h-100">
                <div className="circle-icon mb-5">
                  <span className="ti-lock text-white"></span>
                </div>
                <h5>Secure Data</h5>
                <p>Build your online store’s trust using Social Proof & Urgency.</p>
              </div>
            </div>
            <div className="col-md-4 col-lg-4">
              <div className="single-promo single-promo-hover single-promo-1 rounded text-center white-bg p-5 h-100">
                <div className="circle-icon mb-5">
                  <span className="ti-eye text-white"></span>
                </div>
                <h5>Retina Ready</h5>
                <p>Realize importance of social proof in customer’s purchase decision.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Promo;
