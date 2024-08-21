const categoryImage = document.querySelector(".category-image");
const contactPhone = document.querySelector(".contact-phone");
const navigation = document.querySelector(".navigation");
const headerInner = document.querySelector(".header-inner");
const burgerMenuImg = document.querySelector(".burger-menu-img");
const subMenu = document.querySelector(".sub-menu");
const dropdownMenuBtn = document.querySelector(".dropdown-menu-btn");
const searchContainer = document.querySelector(".search-inner");
const mainCategoryBlock = document.querySelector(".main-category-block");

if (window.innerWidth <= 1024) {
    categoryImage.classList.add("remove");
    navigation.appendChild(contactPhone);
}

window.addEventListener("resize", function () {
    if (window.innerWidth <= 1024) {
        categoryImage.classList.add("remove");
        navigation.appendChild(contactPhone);
    }
    else {
        categoryImage.classList.remove("remove");
        headerInner.appendChild(contactPhone);
    }
});

function openMenu() {
    navigation.classList.toggle("open-menu");
    searchContainer.classList.remove("open-search")
    if (navigation.classList.contains("open-menu")) {
        burgerMenuImg.src = "images/Menu-close.svg";
    }
    else {
        burgerMenuImg.src = "images/Menu-open.svg";
    }
}

function openSubMenu() {
    dropdownMenuBtn.classList.toggle("rotate-icon");
    subMenu.classList.toggle("open-sub-menu");
}

function openSearch() {
    navigation.classList.remove("open-menu");
    burgerMenuImg.src = "images/Menu-open.svg";
    searchContainer.classList.toggle("open-search");
}

let maxOpenedLevel = 1

document.body.addEventListener('click', function (event) {
    getSub(event);
    handleColors(event)
});

function handleColors(event) {
    const current = event.target;
    const parent = current.parentElement;
    const nestedElements = Array.from(parent.children);
    const array = JSON.parse(current.getAttribute('data-sub'));

    if (!array?.length) {
        return
    }

    if (current.tagName === 'LI') {
        const node = document.getElementsByClassName('category-btn')
        nestedElements.forEach(element => {
            element.setAttribute('class', 'category-btn')
        });

        current.setAttribute('class', 'category-btn active-btn')

        if (parent.tagName === "UL") {
            parent.setAttribute('class', 'new-color active')
        }
    }
}

function getSub(event) {
    const data = event.target.getAttribute('data-sub');
    
    if (!data) {
        return;
    }

    const dataLevel = event.target.parentElement.getAttribute('data-level');
    const level = parseInt(dataLevel);
    const array = JSON.parse(data);
    determineItems(array, level, event.target);
}

function determineItems(array, level, target) {
    categoryImage.remove();
    mainCategoryBlock.style.gap = "0";
    const container = document.getElementById("deep");
    const ul = document.createElement("ul");
    ul.className = 'active';
    collectsNode(array, ul);

    if (level === maxOpenedLevel && array?.length) {
        ul.setAttribute('data-level', level + 1)

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                target.appendChild(ul);
            } else {
                container.appendChild(ul);
            }
        })
        if (window.innerWidth <= 1024) {
            target.appendChild(ul);
        } else {
            container.appendChild(ul);
        }
        ++maxOpenedLevel;
    } else if (!array.length) {
        // Delete if was click on top level, and there aren't sub-elements, and it deletes the last opened elements.
        deleteNextOpened(maxOpenedLevel, level);
        maxOpenedLevel = level;
    } else {
        // Delete if was click on top level, and replaces the last opened elements with new ones
        deleteNextOpened(maxOpenedLevel, level);
        maxOpenedLevel = level;
        determineItems(array, level);
    }
}

function collectsNode(array, ul) {
    for (item of array) {
        const [key] = Object.keys(item);
        if (typeof item[key] === 'object') {
            const li = document.createElement("li");
            li.className = 'category-btn';
            li.setAttribute('data-sub', JSON.stringify(item[key]));
            li.innerText = key;
            ul.appendChild(li);
        } else {
            const li = document.createElement("li");
            li.className = 'category-btn';
            li.setAttribute('data-sub', JSON.stringify([]));
            li.innerText = item[key];
            ul.appendChild(li);
        }
    }
}

function deleteNextOpened(maxOpenedLevel, level) {
    for (let i = maxOpenedLevel; i > level; i--) {
        const element = document.querySelectorAll(`[data-level="${i}"]`);
        const need = element[0];
        need.remove();
    }
}