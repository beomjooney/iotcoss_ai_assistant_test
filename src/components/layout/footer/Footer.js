import React from 'react';

export default function Footer({ space }) {
  return (
    <>
      <footer className="footer-section">
        <div
          className={`footer-top background-img-2 ${space ? 'pt-150' : 'pt-60'}`}
          style={{
            background: "url('assets/img/footer-bg.png') no-repeat center top / cover",
          }}
        >
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-md-12 col-lg-4 mb-4 mb-md-4 mb-sm-4 mb-lg-0">
                <div className="footer-nav-wrap text-white">
                  <img src="assets/img/logo-white-1x.png" alt="footer logo" width="120" className="img-fluid mb-3" />
                  <p>
                    Holisticly empower premium architectures without value-added ideas. Seamlessly evolve cross-platform
                    experiences.
                  </p>

                  <div className="social-list-wrap">
                    <ul className="social-list list-inline list-unstyled">
                      <li className="list-inline-item">
                        <a href="#/" target="_blank" title="Facebook">
                          <span className="ti-facebook"></span>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#/" target="_blank" title="Twitter">
                          <span className="ti-twitter"></span>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#/" target="_blank" title="Instagram">
                          <span className="ti-instagram"></span>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#/" target="_blank" title="printerst">
                          <span className="ti-pinterest"></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-8">
                <div className="row">
                  <div className="col-sm-6 col-md-4 col-lg-4 mb-4 mb-sm-4 mb-md-0 mb-lg-0">
                    <div className="footer-nav-wrap text-white">
                      <h5 className="mb-3 text-white">Resources</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <a href="#/">Help</a>
                        </li>
                        <li className="mb-2">
                          <a href="#/">Events</a>
                        </li>
                        <li className="mb-2">
                          <a href="#/">Live Support</a>
                        </li>
                        <li className="mb-2">
                          <a href="#/">Open Sources</a>
                        </li>
                        <li className="mb-2">
                          <a href="#/">Documentation</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4 col-lg-4 mb-4 mb-sm-4 mb-md-0 mb-lg-0">
                    <div className="footer-nav-wrap text-white">
                      <h5 className="mb-3 text-white">Company</h5>
                      <ul className="list-unstyled support-list">
                        <li className="mb-2">
                          <a href="#about">About Us</a>
                        </li>
                        <li className="mb-2">
                          <a href="#/">Careers</a>
                        </li>
                        <li className="mb-2">
                          <a href="#/">Customers</a>
                        </li>
                        <li className="mb-2">
                          <a href="#/">Community</a>
                        </li>
                        <li className="mb-2">
                          <a href="#team">Our Team</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4 col-lg-4">
                    <div className="footer-nav-wrap text-white">
                      <h5 className="mb-3 text-white">Location</h5>
                      <ul className="list-unstyled support-list">
                        <li className="mb-2 d-flex align-items-center">
                          <span className="ti-location-pin mr-2"></span>
                          121 King Melbourne
                          <br />
                          Australia 3000
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="ti-mobile mr-2"></span>
                          <a href="tel:+61283766284"> +61 2 8376 6284</a>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="ti-email mr-2"></span>
                          <a href="mailto:mail@example.com"> mail@example.com</a>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="ti-world mr-2"></span>
                          <a href="#/"> www.yourdomain.com</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom border-gray-light mt-5 py-3">
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-lg-7">
                  <div className="copyright-wrap small-text">
                    <p className="mb-0 text-white">© ThemeTags Design Agency, All rights reserved</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-5">
                  <div className="terms-policy-wrap text-lg-right text-md-right text-left">
                    <ul className="list-inline">
                      <li className="list-inline-item">
                        <a className="small-text" href="#/">
                          Terms
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a className="small-text" href="#/">
                          Security
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a className="small-text" href="#/">
                          Privacy Policy
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
