export default function HeroThree() {
  return (
    <>
      <section className="hero-section hero-section-3 ptb-100">
        <div className="circles">
          <div className="point animated-point-1"></div>
          <div className="point animated-point-2"></div>
          <div className="point animated-point-3"></div>
          <div className="point animated-point-4"></div>
          <div className="point animated-point-5"></div>
          <div className="point animated-point-6"></div>
        </div>

        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-6 col-lg-6">
              <div className="hero-content-left ptb-100">
                <h1>
                  <span>Best Way to Connect</span> with Your Customers
                </h1>
                <p className="lead">
                  Conveniently generate multifunctional markets and B2C vortals. Uniquely enable inexpensive materials
                  rather than sticky products revolutionize robust initiatives.
                </p>

                <a href="#contact" className="btn solid-btn">
                  Contact with us
                </a>
              </div>
            </div>
            <div className="col-md-6 col-lg-5">
              <div className="hero-animation-img">
                <img
                  className="img-fluid d-block m-auto animation-one"
                  src="assets/img/Telemedicine_01.svg"
                  width="150"
                  alt="animation "
                />
                <img
                  className="img-fluid d-none d-lg-block animation-two"
                  src="assets/img/hero-animation-01.svg"
                  alt="animation "
                  width="120"
                />
                <img
                  className="img-fluid d-none d-lg-block animation-three"
                  src="assets/img/Telemedicine_03.svg"
                  alt="animation "
                  width="120"
                />
                <img
                  className="img-fluid d-none d-lg-block animation-four"
                  src="assets/img/hero-animation-03.svg"
                  alt="animation "
                  width="200"
                />
              </div>
            </div>
          </div>
        </div>

        <img src="assets/img/hero-bg-shape-2.svg" className="shape-image" alt="shape " />
      </section>
    </>
  );
}
