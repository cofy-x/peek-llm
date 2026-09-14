import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EXPERIENCES } from '../experiences.mjs';
import { Brand } from '../components/brand';
const number = (index:number) => String(index + 1).padStart(2, '0');

export function HomePage() {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const location = useLocation();
  useEffect(() => {
    if (location.hash === '#exhibits') document.getElementById('exhibits')?.scrollIntoView();
  }, [location]);
  useEffect(() => {
    const root = track.current;
    if (!root || EXPERIENCES.length < 2) return;
    const slides = Array.from(root.children);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setCurrent(slides.indexOf(entry.target));
    }, {root, threshold:.6});
    slides.forEach(slide => observer.observe(slide));
    return () => observer.disconnect();
  }, []);
  const select = (index:number) => {
    const root = track.current;
    const next = (index + EXPERIENCES.length) % EXPERIENCES.length;
    const slide = root?.children[next] as HTMLElement | undefined;
    if (root && slide) root.scrollTo({left:slide.offsetLeft - (root.firstElementChild as HTMLElement).offsetLeft, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  };
  return <>
    <section className="hero" aria-labelledby="intro-title">
      <div className="intro"><p className="eyebrow">Interactive field notes on language models</p>
        <h1 id="intro-title">Look inside.<br /><em>See the<br /> connections.</em></h1>
        <p className="intro-copy">A language model, opened up.<br /> Explore its parts. Follow the signals.<br /> Make the mechanisms make sense.</p>
        <div className="actions"><a className="button primary" href="#exhibits">Explore the exhibits <span aria-hidden="true">↗</span></a><a className="text-link" href="https://github.com/cofy-x/peek-llm">Open source ↗</a></div>
        <div className="principles"><span>Observe.</span><span>Interact.</span><span>Understand.</span></div>
      </div>
      <section className="showcase" aria-label="Featured exhibits" aria-roledescription="carousel">
        <div className="slides" ref={track} onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();select(current + (event.key === 'ArrowRight' ? 1 : -1));
        }}>
          {EXPERIENCES.map((experience,index) => <article className="slide" key={experience.id} aria-label={`${number(index)} — ${experience.title}`}>
            <div className="stage-heading"><div><p className="eyebrow">Now showing / {experience.category}</p><h2>{number(index)} — {experience.title}</h2></div><span className="edition">{number(index)} / {String(EXPERIENCES.length).padStart(2,'0')}</span></div>
            <Link className="preview" to={experience.path} aria-label={`Explore ${experience.title}`}><img src={experience.preview} width="760" height="510" alt={experience.previewAlt} /><span className="preview-cta">Enter the exhibit <span aria-hidden="true">↗</span></span></Link>
            <div className="stage-caption"><span>{experience.interaction}</span><span>{experience.format}</span></div>
          </article>)}
        </div>
        {EXPERIENCES.length > 1 && <div className="gallery-controls"><button onClick={() => select(current-1)} aria-label="Previous exhibit">←</button>{EXPERIENCES.map((experience,index) => <button key={experience.id} onClick={() => select(index)} aria-label={`Show ${experience.title}`} aria-pressed={index===current}>{number(index)}</button>)}<button onClick={() => select(current+1)} aria-label="Next exhibit">→</button><span className="sr-only" role="status">{EXPERIENCES[current]?.title}</span></div>}
      </section>
    </section>
    <section id="exhibits" className="collection" aria-labelledby="collection-title"><div className="collection-heading"><div><p className="eyebrow">The collection</p><h2 id="collection-title">One idea. Many ways in.</h2></div><span className="count">{String(EXPERIENCES.length).padStart(2,'0')} {EXPERIENCES.length===1?'exhibit':'exhibits'}</span></div>
      {EXPERIENCES.map((experience,index) => <Link className="collection-row" to={experience.path} key={experience.id}><span className="row-number">{number(index)}</span><div><p className="eyebrow">{experience.category}</p><h3>{experience.title}</h3><p className="description">{experience.description}</p></div><span className="row-action">Explore <span aria-hidden="true">↗</span></span></Link>)}
    </section>
    <footer className="home-footer"><Brand /><p>Understanding begins with a closer look.</p><a href="https://github.com/cofy-x/peek-llm">Source &amp; credits ↗</a></footer>
  </>;
}
