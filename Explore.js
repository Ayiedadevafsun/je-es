function openTab(id,btn){

  document.querySelectorAll('.tab-content')
  .forEach(el=>el.classList.remove('active'));

  document.querySelectorAll('.tab-btn')
  .forEach(el=>el.classList.remove('active'));

  document.getElementById(id)
  .classList.add('active');

  btn.classList.add('active');
}

function createLinks(target,data,type,param,label){

  let html='';

  data.forEach(item=>{

    html += `
      <a href="/p/explore-movies-tv-shows.html?type=${type}&${param}=${item[0]}">
        ${item[1]} ${label}
      </a>
    `;

  });

  document.getElementById(target).innerHTML = html;
}

fetch('https://raw.githubusercontent.com/Ayiedadevafsun/je-es/main/X.json')
.then(r=>r.json())
.then(data=>{

  createLinks(
    'movieGenres',
    data.movieGenres,
    'movie',
    'genre',
    'Movies'
  );

  createLinks(
    'tvGenres',
    data.tvGenres,
    'tv',
    'genre',
    'TV Shows'
  );

  createLinks(
    'movieCountries',
    data.countries,
    'movie',
    'country',
    'Movies'
  );

  createLinks(
    'tvCountries',
    data.countries,
    'tv',
    'country',
    'TV Shows'
  );

  createLinks(
    'movieLanguages',
    data.languages,
    'movie',
    'language',
    'Movies'
  );

  createLinks(
    'tvLanguages',
    data.languages,
    'tv',
    'language',
    'TV Shows'
  );

});

let movieYears='';
let tvYears='';

for(let year=new Date().getFullYear();year>=data.startYear;year--){

  movieYears += `
    <a href="/p/explore-movies-tv-shows.html?type=movie&year=${year}">
      Movies ${year}
    </a>
  `;

  tvYears += `
    <a href="/p/explore-movies-tv-shows.html?type=tv&year=${year}">
      TV Shows ${year}
    </a>
  `;
}

document.getElementById('movieYears').innerHTML = movieYears;
document.getElementById('tvYears').innerHTML = tvYears;
