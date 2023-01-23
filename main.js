const showModalButton = document.getElementById('show-modal');
const modalContainer = document.getElementById('modal-container');
const modalForm = document.getElementById('modal-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const saveItemButton = document.getElementById('save-item');
const closeModalButton = document.getElementById('close-modal');
const removeItemsButton = document.getElementById('remove-button');
const bookmarksContainer = document.getElementById('bookmarks-container');
const entryText = document.getElementById('entry-text');

let bookmarks = [];

// Get Bookmarks
function getBookmarks() {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    entryText.classList.add('hidden');
  } else {
    bookmarks = [];
  }

  if (bookmarks.length === 0) {
    entryText.classList.remove('hidden');
  }

  buildBookmarks();
}

// Helper Function to Set Attributes on DOM Elements
function setAttribute(element, attribute) {
  for (const key in attribute) {
    element.setAttribute(key, attribute[key]);
  }
}

// Build Bookmarks
function buildBookmarks() {
  bookmarksContainer.textContent = '';

  bookmarks.forEach((bookmark) => {
    const { id, name, url } = bookmark;
    const item = document.createElement('li');
    item.classList.add('bookmark');

    const mark = document.createElement('div');
    mark.classList.add('mark');

    const favicon = document.createElement('img');
    setAttribute(favicon, {
      src: `https://s2.googleusercontent.com/s2/favicons?domain=${url}`,
      alt: favicon,
    });

    mark.appendChild(favicon);

    const deleteItemButton = document.createElement('i');
    deleteItemButton.classList.add('fas', 'fa-times');
    setAttribute(deleteItemButton, {
      title: '삭제하기',
      onclick: `deleteBookmark(${id})`,
    });

    const link = document.createElement('a');

    setAttribute(link, {
      href: url,
      target: '_blank',
      title: `Go to ${name}`,
    });
    link.textContent = name;

    item.append(mark, deleteItemButton, link);

    bookmarksContainer.appendChild(item);
  });
}

// Validate Form
function validateForm(nameValue, urlValue) {
  const expression =
    /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue.trim() || !urlValue.trim()) {
    alert('모든 입력창에 유효한 값을 입력해주세요.');
    return false;
  } else if (!urlValue.match(regex)) {
    alert('유효한 웹사이트 주소를 입력해주세요.');
    return false;
  } else {
    return true;
  }
}

// Delete Bookmark
function deleteBookmark(id) {
  bookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  getBookmarks();
}

// Remove all Bookmarks
function removeBookmarks() {
  localStorage.removeItem('bookmarks');
  getBookmarks();
}

// Store Bookmarks
function storeBookmark(event) {
  event.preventDefault();
  let nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
    urlValue = `https://${urlValue}`;
  }

  if (!validateForm(nameValue, urlValue)) {
    return false;
  }

  nameValue =
    nameValue.length > 9 ? `${nameValue.substring(0, 9)}...` : nameValue;

  const bookmark = {
    id: Math.floor(Math.random() * 1000000),
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  getBookmarks();
  hideModal();
}

// Show Modal
function showModal() {
  modalContainer.classList.add('show-modal');
  websiteNameEl.focus();
}

// Hide Modal
function hideModal() {
  modalContainer.classList.remove('show-modal');
  modalForm.reset();
}

// Event Listener
showModalButton.addEventListener('click', showModal);
closeModalButton.addEventListener('click', hideModal);
window.addEventListener('click', (event) => {
  if (event.target === modalContainer) {
    hideModal();
  }
});
modalForm.addEventListener('submit', storeBookmark);
removeItemsButton.addEventListener('click', removeBookmarks);

// On Load, Fetch Bookmarks
getBookmarks();
