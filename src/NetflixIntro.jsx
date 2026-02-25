import { useState, useEffect } from 'react';
import './NetflixIntro.css';

export default function NetflixIntro({ onComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="netflix-intro">
      <div className="netflix-logo">
        <span className="letter">S</span>
        <span className="letter">A</span>
        <span className="letter">F</span>
        <span className="letter">E</span>
        <span className="letter">H</span>
        <span className="letter">A</span>
        <span className="letter">V</span>
        <span className="letter">E</span>
        <span className="letter">N</span>
      </div>
    </div>
  );
}
