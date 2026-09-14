import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { EXPERIENCES } from './experiences.mjs';
import { HomePage } from './pages/home';
import { Brand } from './components/brand';
import { ExperienceBoundary } from './components/experience-boundary';
import originLicense from '../../../packages/model-architectures/attention-atlas/LICENSE-ORIGIN?raw';

const routes = EXPERIENCES.map(experience => ({ ...experience, Component: lazy(experience.load) }));

function LoadingExperience() {
  return <section className="route-status" role="status"><h1>Opening the exhibit…</h1><p>The interactive explorer is loading.</p><Link to="/">All exhibits</Link></section>;
}

export function App() {
  const location = useLocation();
  const experience = EXPERIENCES.find(item => item.path === location.pathname.replace(/\/$/, ''));
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = experience ? 'dark' : 'light';
    document.title = experience ? `${experience.title} — Peek LLM` : 'Peek LLM — See how language models work';
  }, [experience]);
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return <div className={experience ? 'experience-shell' : 'home-shell'}>
    {experience ? <nav className="peek-navigation" aria-label="Exhibit navigation">
      <Brand /><Link to="/">All exhibits</Link><span>{experience.title}</span>
      <button onClick={() => (document.getElementById('credits') as HTMLDialogElement).showModal()}>Credits</button>
    </nav> : <header className="masthead"><Brand /><nav aria-label="Main"><Link to="/#exhibits">Exhibits</Link><a href="https://github.com/cofy-x/peek-llm">GitHub ↗</a></nav></header>}
    <main id="main" className={experience ? 'experience-main' : undefined}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {routes.map(({id,path,Component}) => <Route key={id} caseSensitive path={path} element={<ExperienceBoundary key={id}><Suspense fallback={<LoadingExperience />}><Component /></Suspense></ExperienceBoundary>} />)}
        <Route path="*" element={<section className="route-status"><h1>Page not found.</h1><Link to="/">Browse the exhibits</Link></section>} />
      </Routes>
    </main>
    {experience && <dialog id="credits" aria-labelledby="credits-title"><h2 id="credits-title">Sources and runtime licenses</h2><form method="dialog"><button>Close credits</button></form><p>Paper citations and scientific caveats are available in the explorer’s Sources panel.</p><a href={`${import.meta.env.BASE_URL}THIRD-PARTY-NOTICES.txt`} target="_blank" rel="noreferrer">Complete third-party runtime notices</a><pre>{originLicense}</pre></dialog>}
  </div>;
}
