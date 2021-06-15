import pages from '../pages.json';
import './index.css';

import './canvas.js';

const sketchesContainer = document.querySelector('#sketches-container');

const PUBLIC_URL = location.href;

const addSketch = (page) => {
  const a = document.createElement('a');
  a.href = PUBLIC_URL + page + '.html';
  a.className = 'sketch-item';

  const name = document.createElement('div');
  name.className = 'sketch-item-name';
  const nameLetters = page.replaceAll('-', ' ').split('');

  nameLetters.forEach((letter, index) => {
    name.innerHTML += `<span>${letter}</span>`;
  });

  const image = document.createElement('img');
  image.src = `${PUBLIC_URL}/images/${page}.jpg`;
  image.style.width = '100%';

  a.appendChild(image);
  a.appendChild(name);

  sketchesContainer.appendChild(a);
};

pages.pages.forEach((page) => {
  addSketch(page);
});
