import React from 'react';

export default function Subsribe() {
  return (
    <>
      <div className="shape-img subscribe-wrap">
        <img src="assets/img/footer-top-shape.png" alt="footer shape" className="img-fluid" />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <form
                action="#"
                method="post"
                className="subscribe-form subscribe-form-footer d-none d-md-block d-lg-block"
              >
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control input"
                    id="email-footer"
                    name="email"
                    placeholder="info@yourdomain.com"
                  />
                  <input type="submit" className="button btn solid-btn" id="submit-footer" value="Subscribe" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
