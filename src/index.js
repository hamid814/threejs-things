import pages from '../pages.json';
import './index.css';

const sketchesContainer = document.querySelector('#sketches-container');

const PUBLIC_URL = location.href;

const addSketch = (page) => {
  const a = document.createElement('a');
  a.href = PUBLIC_URL + page + '.html';
  a.className = 'sketch-item';
  a.innerHTML = page;

  sketchesContainer.appendChild(a);
};

pages.pages.forEach((page) => {
  addSketch(page);
});
