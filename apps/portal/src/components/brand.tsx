import { Link } from 'react-router-dom';
export function Brand() {
  return <Link className="brand" to="/">
    <span className="brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" focusable="false"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="5.5" fill="currentColor" /></svg></span>
    Peek LLM
  </Link>;
}
