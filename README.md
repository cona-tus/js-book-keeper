# 🔖 즐겨찾기 앱, 'Book Keeper' 토이프로젝트

![mark-thumb](https://user-images.githubusercontent.com/90844424/213954370-efd28908-fd33-4b99-9362-e51c64069f7e.jpg)

<br />

[![Netlify Status](https://api.netlify.com/api/v1/badges/36b5ada3-c0e6-468b-8de3-67515049df00/deploy-status)](https://app.netlify.com/sites/conatus-js-book-keeper/deploys) | [Live Demo](https://conatus-js-book-keeper.netlify.app/)

<br/>
<br/>

# 1. Project

## 1.1. Project Information

> 본 프로젝트는 **즐겨찾기 애플리케이션** 입니다. 웹사이트의 이름과 주소를 등록하는 모달창과, 저장된 북마크의 목록을 보여주는 메인 페이지로 구성되어 있습니다. 북마크의 이름을 클릭하면 해당 웹사이트가 새창으로 열립니다. 개별 북마크를 삭제하거나 전체 목록을 지울 수 있습니다. 또한 반응형 웹으로 코드를 작성하였습니다.

<br/>

## 1.2. Project Duration & Participants

- 2023-1-21 ~ 2023-1-22
- 개인 프로젝트 (1인)

<br/>
<br/>

# 2. Skills

![HTML](https://img.shields.io/badge/html-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JAVASCRIPT](https://img.shields.io/badge/JavaScript-f6e158?style=for-the-badge&logo=JavaScript&logoColor=ffffff) ![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)

<br/>
<br/>

# 3. Main Features

## 3.1. Create Bookmarks & Save in the Local Storage

![mark-store](https://user-images.githubusercontent.com/90844424/213954363-a3edd379-7e16-4237-b626-e196da0a3c68.gif)

사용자가 웹사이트명과 주소를 입력하여 새로운 북마크를 생성할 수 있습니다. 이름은 9글자를 초과할 시 줄임표(`...`)로 처리되며, 주소는 `https://` 또는 `http://` 를 입력하지 않았다면 자동으로 붙여줍니다.

```js
let bookmarks = [];

function storeBookmark(event) {
  event.preventDefault();

  let nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  // https:// 붙이기
  if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
    urlValue = `https://${urlValue}`;
  }

  // 유효성 검사
  if (!validateForm(nameValue, urlValue)) {
    return false;
  }

  // 이름 말줄임 처리
  nameValue =
    nameValue.length > 9 ? `${nameValue.substring(0, 9)}...` : nameValue;
```

<br/>

![mark-storage](https://user-images.githubusercontent.com/90844424/213956095-9eeb6226-1ee4-4d5a-82a0-5a0744b8ca26.jpg)

간단한 유효성 검사 후 id와 이름, 주소가 할당된 북마크를 bookmarks 배열에 push하고, 이를 로컬스토리지에 저장합니다.

```js
  // 북마크 오브젝트를 배열에 추가
  const bookmark = {
    id: Math.floor(Math.random() * 1000000),
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);

  // 로컬스토리지에 저장
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  getBookmarks();
  hideModal();
}
```

<br />

## 3.2. Get Bookmarks

로컬스토리지에 저장된 북마크 배열이 있다면 파싱하여 메인 화면에 보여줍니다. 없다면 빈 배열을 반환합니다.

```js
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
```

<br />

## 3.3. Build Bookmarks & Add to DOM

![mark-build](https://user-images.githubusercontent.com/90844424/213956916-197365f8-3701-4e0d-8cc6-bb228983a70a.jpg)

북마크 오브젝트의 정보를 받아와 document.createElement() 메서드로 HTML 요소를 생성합니다. 이때 `setAttribute()` 함수를 만들어 엘레먼트의 속성을 쉽게 추가할 수 있도록 합니다.

```js
// element에 속성 부여
function setAttribute(element, attribute) {
  for (const key in attribute) {
    element.setAttribute(key, attribute[key]);
  }
}

// HTML element 생성
function buildBookmarks() {
  bookmarksContainer.textContent = '';

  bookmarks.forEach((bookmark) => {
    const { id, name, url } = bookmark;

    // 아이템
    const item = document.createElement('li');
    item.classList.add('bookmark');

    // 파비콘
    const mark = document.createElement('div');
    mark.classList.add('mark');

    const favicon = document.createElement('img');
    setAttribute(favicon, {
      src: `https://s2.googleusercontent.com/s2/favicons?domain=${url}`,
      alt: favicon,
    });

    mark.appendChild(favicon);

    // 삭제 버튼
    const deleteItemButton = document.createElement('i');
    deleteItemButton.classList.add('fas', 'fa-times');
    setAttribute(deleteItemButton, {
      title: '삭제하기',
      onclick: `deleteBookmark(${id})`,
    });

    // 링크
    const link = document.createElement('a');

    setAttribute(link, {
      href: url,
      target: '_blank',
      title: `Go to ${name}`,
    });
    link.textContent = name;

    // 컨테이너(ul)에 북마크(li) 삽입
    item.append(mark, deleteItemButton, link);
    bookmarksContainer.appendChild(item);
  });
}
```

<br/>

## 3.4. Delete Bookmark & Remove all

![mark-delete](https://user-images.githubusercontent.com/90844424/213959007-3cab9114-22e4-4dcd-bdff-d42f3d18fe06.gif)

Array.filter() 메서드를 사용하여 북마크의 id 값으로 개별 아이템을 삭제할 수 있습니다. 모든 아이템을 제거할 때는 로컬스토리지의 bookmarks key를 지워줍니다.

```js
// 개별 북마크 삭제
function deleteBookmark(id) {
  bookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  getBookmarks();
}

// 모든 북마크 제거
function removeBookmarks() {
  localStorage.removeItem('bookmarks');
  getBookmarks();
}
```

<br/>
<br/>

# 4. UI/UX

## 4.1 Open and Close Modal

![mark-modal](https://user-images.githubusercontent.com/90844424/213961688-fb53807e-cab7-4356-932f-03c26d572bb2.gif)

우측 하단의 Create 버튼을 클릭하여 모달창을 열 수 있으며, 배경이나 Cancle 버튼을 클릭하면 창이 닫힙니다. modalContainer에 적용된 display `none`을 제거하는 show-modal 클래스를 조작합니다.

```js
// 모달창 열기
function showModal() {
  modalContainer.classList.add('show-modal');
  websiteNameEl.focus();
}

// 모달창 닫기
function hideModal() {
  modalContainer.classList.remove('show-modal');
  modalForm.reset();
}

// 이벤트 리스너
showModalButton.addEventListener('click', showModal);
closeModalButton.addEventListener('click', hideModal);
window.addEventListener('click', (event) => {
  if (event.target === modalContainer) {
    hideModal();
  }
});
```

<br />

## 4.2 Go to Website

![mark-link](https://user-images.githubusercontent.com/90844424/213961575-672cf85a-1a47-4ccf-94a5-ec53b639eccc.gif)

사용자 편의를 고려해 타이틀에 부가설명을 추가했습니다. 웹사이트명을 클릭하면 새창이 열리며 원하는 페이지로 바로가기 됩니다.

```js
const link = document.createElement('a');

setAttribute(link, {
  href: url,
  target: '_blank',
  title: `Go to ${name}`,
});
```

<br />

## 4.3. Responsive App Design

![mrak-responsive](https://user-images.githubusercontent.com/90844424/213960193-164b29bf-8b2b-4b06-9f22-3834cb05cc35.gif)

![mark-device](https://user-images.githubusercontent.com/90844424/213960164-57e68491-e92f-433d-958c-882eb1ad41d8.jpg)

bookmarks-container의 `grid-template-columns`를 수정하여 다양한 디바이스에 반응형으로 작동하도록 했습니다.

```css
.bookmarks-container {
  min-height: calc(500px - 16rem);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 80px;
  gap: 20px;
  padding: 2rem 3rem;
}

@media screen and (max-width: 780px) {
  .bookmarks-container {
    min-height: calc(100vh - 8rem);
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 480px) {
    .bookmarks-container {
      grid-template-columns: 1fr;
    }
  }
}
```

<br />
<br />

<sub><sup>본 애플리케이션은 인터넷 강의를 참고하여 만들었습니다. 필요하다 생각되는 부분에서 원본 코드를 수정하고, 기능을 보완했습니다. 또한 새롭게 디자인했습니다.</sup></sub>
