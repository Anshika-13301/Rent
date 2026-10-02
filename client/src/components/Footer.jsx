export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/60 py-6">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            RentSense
          </span>{" "}
          — Smart Rent &amp; Fair Price Predictor.
        </p>
      </div>
    </footer>
  );
}
