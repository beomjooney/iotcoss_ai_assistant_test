import React, { useState } from 'react';
import ModalVideo from 'react-modal-video';
import { Link } from 'react-router-dom';

export default function VideoPromoTwo() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <section
        id="download"
        className="video-promo ptb-100 background-img"
        style={{
          background: "url('assets/img/video-bg.jpg')no-repeat center center / cover",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="video-promo-content mt-4 text-center">
                <Link to="#" className="popup-youtube video-play-icon d-inline-block">
                  <span className="ti-control-play" onClick={() => setOpen(true)}></span>{' '}
                </Link>
                <h5 className="mt-4 text-white">Watch video overview</h5>

                <div className="download-btn mt-5">
                  <a href="#/" className="btn google-play-btn mr-3">
                    <span className="ti-android"></span> Google Play
                  </a>
                  <a href="#/" className="btn app-store-btn">
                    <span className="ti-apple"></span> App Store
                  </a>
                </div>
              </div>
            </div>
          </div>
          <ModalVideo channel="youtube" isOpen={isOpen} videoId="9No-FiEInLA" onClose={() => setOpen(false)} />
        </div>
      </section>
    </>
  );
}
