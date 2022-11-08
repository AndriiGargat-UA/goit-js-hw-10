import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import Handlebars from 'handlebars';
import API from './fetchCountries';
import countryListTmp from './templates/country-list.hbs';
import singleCountryTmp from './templates/single-country.hbs';

const getEl = selector => document.querySelector(selector);
const inputRef = getEl('#search-box');
const countryListRef = getEl('.country-list');
const countryInfoRef = getEl('.country-info');
const DEBOUNCE_DELAY = 300;

inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
Handlebars.registerHelper('objValues', Object.values);

function onSearch() {
    const name = inputRef.value.trim();
    API.fetchCountries(name)
        .then(interfaceRender)
        .catch(onFetchError);
};

function interfaceRender(country) {
    clearMarkup();
    const len = country.length;

    if (len > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        } else if (len <= 10 && len > 1) {
            const markupList = country.map(countryListTmp).join('');
            countryListRef.insertAdjacentHTML('beforeend', markupList);
        } else {
            const markupDescription = country.map(singleCountryTmp).join('');
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