const innerCard = document.querySelector('#card-inner');
const leaderBoard = document.querySelector('#leaderboard-donor-list');
const leaderBoardTotal = document.querySelector('.leaderboard-total');
const numOfTopDonors = document.querySelector('#card-back-top-donors');
const loader = document.querySelector('#loader');
const API = '/data/donors.json';

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const createElements = (donors) => {
  let total = 0;
  numOfTopDonors.textContent =
    donors.length > 1 ? `Top ${donors.length} donors` : `Top donor`;

  for (const donor of donors) {
    const newListItem = document.createElement('li');
    const { name, amount, type } = donor;
    total += +amount;

    const nameEl = document.createElement('p');
    nameEl.textContent = name;

    const amountEl = document.createElement('p');
    amountEl.textContent = `$${amount}`;

    const typeEl = document.createElement('p');
    typeEl.textContent = type;

    [nameEl, amountEl, typeEl].forEach((element) => {
      newListItem.append(element);
    });
    leaderBoard.appendChild(newListItem);
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  leaderBoardTotal.textContent = `${formatter.format(total)}`;
};

const clearElements = () => {
  numOfTopDonors.textContent = 'Top donors';
  leaderBoard.innerHTML = '';
  leaderBoard.appendChild(loader);
  leaderBoardTotal.textContent = `$0`;
};

const fetchData = debounce(async function () {
  const style = getComputedStyle(innerCard);
  if (style.transform.includes('matrix3d')) {
    try {
      const res = await fetch(API);
      const donors = await res.json();

      if (leaderBoard.contains(loader)) leaderBoard.removeChild(loader);

      if (leaderBoard.children.length > 1 || !donors.length) return;
      createElements(donors);
    } catch (err) {
      console.log(err);
    }
  } else {
    clearElements();
  }
}, 1000);

innerCard.addEventListener('transitionrun', () => {
  fetchData();
});
