import React, { useState } from 'react';
import ModalVideo from 'react-modal-video';
import { Link } from 'react-router-dom';

const HeroOne = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <section
        className="hero-section pt-100 background-img"
        style={{
          background: "url('assets/img/app-hero-bg.jpg')no-repeat center center / cover",
        }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-between py-5">
            <div className="col-md-7 col-lg-6">
              <div className="hero-content-left text-white">
                <h1 className="text-white">
                  <span>Brainstorming</span> for Desired Usability
                </h1>
                <p className="lead">
                  Our design projects are fresh and simple and will benefit your business greatly. Learn more about our
                  work!
                </p>
                <form action="#" method="post" className="subscribe-form">
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control input"
                      id="email"
                      name="email"
                      placeholder="info@yourdomain.com"
                    />
                    <input type="submit" className="button btn solid-btn" id="submit" value="Subscribe" />
                  </div>
                </form>

                <div className="video-promo-content py-4 d-flex align-items-center">
                  <Link to="#" className="popup-youtube video-play-icon-without-bip video-play-icon mr-3">
                    <span className="ti-control-play" onClick={() => setOpen(true)}></span>
                  </Link>{' '}
                  Watch Video Overview
                </div>
              </div>
            </div>
            <div className="col-md-5 col-lg-5">
              <div className="hero-animation-img">
                <img src="assets/img/app-product.png" alt="app" className="img-fluid" />
              </div>
            </div>
          </div>
          <ModalVideo channel="youtube" isOpen={isOpen} videoId="9No-FiEInLA" onClose={() => setOpen(false)} />
        </div>
        <div className="bottom-img-absolute">
          <img src="assets/img/hero-bg-shape-1.svg" alt="wave shape" className="img-fluid" />
        </div>
      </section>
    </>
  );
};

export default HeroOne;
