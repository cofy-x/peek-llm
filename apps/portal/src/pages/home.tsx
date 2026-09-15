import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EXPERIENCES } from '../experiences.mjs';
import { Brand } from '../components/brand';
const number = (index:number) => String(index + 1).padStart(2, '0');

export function HomePage() {
  const [current, setCurrent] = useState(0);
  const location = useLocation();
  useEffect(() => {
    if (location.hash === '#exhibits') document.getElementById('exhibits')?.scrollIntoView();
  }, [location]);
  const select = (index:number) => setCurrent((index + EXPERIENCES.length) % EXPERIENCES.length);
  const featured = EXPERIENCES[current];
  if (!featured) return <section className="route-status"><h1>New exhibits are being prepared.</h1></section>;
  return <>
    <section className="hero" aria-labelledby="intro-title">
      <div className="intro"><p className="eyebrow">Interactive field notes on language models</p>
        <h1 id="intro-title">Look inside.<br /><em>See the<br /> connections.</em></h1>
        <p className="intro-copy">A language model, opened up.<br /> Explore its parts. Follow the signals.<br /> Make the mechanisms make sense.</p>
        <div className="actions"><Link className="button primary" to={featured.path}>Explore {featured.title} <span aria-hidden="true">↗</span></Link><a className="text-link" href="https://github.com/cofy-x/peek-llm">Open source ↗</a></div>
        <div className="principles"><span>Observe.</span><span>Interact.</span><span>Understand.</span></div>
      </div>
      <section className="showcase" aria-label="Featured exhibits" aria-roledescription="carousel" onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault(); select(current + (event.key === 'ArrowRight' ? 1 : -1));
      }}>
        <div className="stage-heading">
          <div><p className="eyebrow">Now showing / {featured.category}</p><h2>{number(current)} — {featured.title}</h2></div>
          {EXPERIENCES.length > 1 && <div className="gallery-controls" aria-label="Choose an exhibit"><button onClick={() => select(current-1)} aria-label="Previous exhibit">←</button>{EXPERIENCES.map((experience,index) => <button key={experience.id} onClick={() => select(index)} aria-label={`Show ${experience.title}`} aria-pressed={index===current}>{number(index)}</button>)}<button onClick={() => select(current+1)} aria-label="Next exhibit">→</button></div>}
        </div>
        <Link className="preview" to={featured.path} aria-label={`Explore ${featured.title} preview`}><img src={featured.preview} width="760" height="510" alt={featured.previewAlt} /></Link>
        <span className="sr-only" role="status">{featured.title}</span>
      </section>
    </section>
    <section id="exhibits" className="collection" aria-labelledby="collection-title"><div className="collection-heading"><div><p className="eyebrow">The collection</p><h2 id="collection-title">One idea. Many ways in.</h2></div><span className="count">{String(EXPERIENCES.length).padStart(2,'0')} {EXPERIENCES.length===1?'exhibit':'exhibits'}</span></div>
      {EXPERIENCES.map((experience,index) => <Link className="collection-row" to={experience.path} key={experience.id}><span className="row-number">{number(index)}</span><div><p className="eyebrow">{experience.category}</p><h3>{experience.title}</h3><p className="description">{experience.description}</p></div><span className="row-action">Explore <span aria-hidden="true">↗</span></span></Link>)}
    </section>
    <footer className="home-footer"><Brand /><p>Understanding begins with a closer look.</p><a href="https://github.com/cofy-x/peek-llm">Source &amp; credits ↗</a></footer>
  </>;
}
