import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import API from './fetchCountries';

const getEl = selector => document.querySelector(selector);
const inputRef = getEl('#search-box');
const countryListRef = getEl('.country-list');
const countryInfoRef = getEl('.country-info');

const DEBOUNCE_DELAY = 300;

inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
    const name = inputRef.value.trim();
    API.fetchCountries(name)
        .then(country => {
        interfaceRender(country);           
    })
        .catch(onFetchError);
};

function interfaceRender(country) {
    clearMarkup();
    if (country.length > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        } else if (country.length <= 10 && country.length > 1) {
            const markupList = country.map(item => `
                <li class="country-list__item">
                    <img class="country__flag" src="${item.flags.svg}" alt="flag">
                    <p class="country__name">${item.name.official}</p>
                </li>
        `).join('');
        countryListRef.insertAdjacentHTML('beforeend', markupList);
        } else {
            const markupDescription = country.map(item => `
                <img class="single-country__flag" src="${item.flags.svg}" alt="flag">
                <p class="single-country__name">${item.name.official}</p>
                <p class="options">Capital: <span class="value">${item.capital}</span></p>
                <p class="options">Population: <span class="value">${item.population}</span></p>
                <p class="options">Languages: <span class="value">${Object.values(item.languages)}</span></p>
                `).join('');
            countryInfoRef.insertAdjacentHTML('beforeend', markupDescription);
        }
};

function onFetchError(error) {
    Notiflix.Notify.failure("Oops, there is no country with that name")
};

function clearMarkup() {
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
};

