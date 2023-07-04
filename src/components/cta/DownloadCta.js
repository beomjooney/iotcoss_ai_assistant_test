import React from 'react';

export default function DownloadCta() {
  return (
    <>
      <section id="download" className="video-promo ptb-100">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-7">
              <div className="download-content">
                <h2>Download App Manage Your Business More Faster</h2>
                <p>
                  Objectively deliver professional value with diverse web-readiness. Collaboratively transition wireless
                  service without goal-oriented catalysts for change. Collaboratively.
                </p>
                <p>
                  Progressively disseminate sustainable "outside the box" thinking before end-to-end ideas. Dramatically
                  disintermediate resource maximizing action.
                </p>
                <div className="download-btn mt-4">
                  <a href="#/" className="btn solid-btn mr-3">
                    <span className="ti-android"></span> Google Play
                  </a>
                  <a href="#/" className="btn outline-btn">
                    <span className="ti-apple"></span> App Store
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="download-img mt-lg-5 mt-md-5 mt-sm-0">
                <img src="assets/img/image-14.png" alt="download" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
