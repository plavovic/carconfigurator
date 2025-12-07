import carImage from "../../images/porschetaycan.png";

function TestTaycan() {
  return (
    <div className="app">
      <section className="hero">
        <header className="site-header">
          <h1 className="logo">Car Configurator</h1>
        </header>

        <h2 className="hero-word">TAYCAN</h2>

        <img src={carImage} alt="Porsche Taycan" className="hero-car" />
      </section>

      <main className="page-content">
        <section className="taycan-info">
          <h2>Porsche Taycan</h2>
          <p>Porsche Taycan is an all-electric car produced by Porsche.</p>
          <p>
            From <span>103.000 €</span>
          </p>
        </section>
      </main>
    </div>
  );
}

export default TestTaycan;