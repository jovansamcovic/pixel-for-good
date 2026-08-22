export default function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label="Učitavanje stranice">
      <div className="loading-content">
        <span className="loading-heart" aria-hidden="true">♥</span>
        <p className="loading-kicker">Srce dobrote</p>
        <h1>Bojimo srce zajedno.</h1>
        <div className="loading-progress" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="sr-only">Stranica se učitava…</span>
      </div>
    </div>
  );
}