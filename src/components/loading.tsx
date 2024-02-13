export default function Loading() {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      ></span>
      Loading...
    </div>
  );
}
