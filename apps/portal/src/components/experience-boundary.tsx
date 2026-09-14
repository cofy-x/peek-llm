import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
export class ExperienceBoundary extends Component<{children:ReactNode}, {failed:boolean}> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() {
    if (this.state.failed) return <section className="route-status" role="alert">
      <h1>This exhibit could not be loaded.</h1><p>Reload to try again, or return to the collection.</p>
      <div><button onClick={() => window.location.reload()}>Reload</button><Link to="/">All exhibits</Link></div>
    </section>;
    return this.props.children;
  }
}
