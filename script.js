const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let isInitialLoad = true;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photos = [];
let count = 15;
let initialCount = 5;
const clientId = '00_CDnKrSo7dT4gLMFsrkQ4DxfeQDCNbwQPvDsqurTg';
const initialLoadApiUrl = `https://api.unsplash.com/photos/random?count=${initialCount}&client_id=${clientId}`;
const apiUrl = `https://api.unsplash.com/photos/random?count=${count}&client_id=${clientId}`;
const appName = 'JS Infinite Scroll';

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photos.length;
    photos.forEach(photo => {
        const item = document.createElement('div');
        setAttributes(item, {class: 'image'})
    
        const link = document.createElement('a');
        setAttributes(item, {href: photo.links.html, target: '_blank'});

        const img = document.createElement('img');
        setAttributes(img, {src: photo.urls.regular, alt: photo.description, title: photo.description});
        img.addEventListener('load', imageLoaded);
        
        link.appendChild(img);

        const description = document.createElement('span');
        setAttributes(description, {class: 'image-description'});
        description.insertAdjacentHTML('beforeend', `Photo by <a href="${photo.user.links.html}?utm_source=${appName}&utm_medium=referral" target="_blank">${photo.user.name}</a> on <a href="https://unsplash.com/?utm_source=${appName}&utm_medium=referral" target="_blank">Unsplash</a>`);
        item.appendChild(link);
        item.appendChild(description);

        imageContainer.appendChild(item);
    });
}

async function getPhotos() {
    try {
        const url = isInitialLoad ? initialLoadApiUrl : apiUrl;
        const response = await fetch(url);
        photos = await response.json();
        displayPhotos();
        isInitialLoad = false;
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
})

getPhotos();