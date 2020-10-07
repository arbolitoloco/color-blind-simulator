const contributorGallery = document.getElementById('contributors-gallery');

const buildContributorCard = (contributor) => {
  const div = document.createElement('div');
  const img = document.createElement('img');
  const strong = document.createElement('strong');
  const a = document.createElement('a');

  contributorGallery.append(div);
  div.append(img);
  div.append(strong);
  div.append(a);

  div.setAttribute('class', 'contributor');
  img.setAttribute('src', contributor.avatar_url);
  img.setAttribute('alt', contributor.login);
  strong.innerHTML = contributor.login;
  a.innerHTML = `github.com/${contributor.login}`;
  a.setAttribute('href', contributor.html_url);
}

fetch('https://api.github.com/repos/arbolitoloco/color-blind-simulator/contributors')
    .then((response) => response.json())
    .then((data) => {
      data.map((contributor) => buildContributorCard(contributor));
    })
    .catch((err) => console.warn('Problem retrieving contributors.', err));
    