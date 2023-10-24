const form = document.querySelector(".form"),
	pageNumber = form.querySelector("#page-number"),
	limitNumber = form.querySelector("#limit-number"),
	submitButton = form.querySelector("#submit-button"),
	outputBlock = document.querySelector(".output"),
	cardsBlock = outputBlock.querySelector(".cards"),
	errorParagraph = outputBlock.querySelector(".error");

const errorDescriptions = {
	ERR_PAGE_NUMBER_OUTTA_RANGE: "Номер страницы вне диапазона от 1 до 10",
	ERR_LIMIT_NUMBER_OUTTA_RANGE: "Лимит вне диапазона от 1 до 10",
	ERR_PAGE_NUMBER_AND_LIMIT_NUMBER_OUTTA_RANGE:
		"Номер страницы и лимит вне диапазона от 1 до 10",
};

loadImagesFromLocalStorage();

form.addEventListener("submit", function (event) {
	event.preventDefault();

	errorParagraph.classList.add("display-none");

	const pageNumberValue = +pageNumber.value;
	const limitNumberValue = +limitNumber.value;

	if (
		((pageNumberValue < 1 || pageNumberValue > 10) &&
			(limitNumberValue < 1 || limitNumberValue > 10)) ||
		Number.isNaN(pageNumberValue) ||
		Number.isNaN(limitNumberValue)
	) {
		errorParagraph.textContent =
			errorDescriptions.ERR_PAGE_NUMBER_AND_LIMIT_NUMBER_OUTTA_RANGE;
		errorParagraph.classList.remove("display-none");
		return;
	} else if (
		pageNumberValue < 1 ||
		pageNumberValue > 10 ||
		Number.isNaN(pageNumberValue)
	) {
		errorParagraph.textContent = errorDescriptions.ERR_PAGE_NUMBER_OUTTA_RANGE;
		errorParagraph.classList.remove("display-none");
		return;
	} else if (
		limitNumberValue < 1 ||
		limitNumberValue > 10 ||
		Number.isNaN(limitNumberValue)
	) {
		errorParagraph.textContent = errorDescriptions.ERR_LIMIT_NUMBER_OUTTA_RANGE;
		errorParagraph.classList.remove("display-none");
		return;
	}

	const requestURL = formatRequestURL(pageNumberValue, limitNumberValue);

	fetch(requestURL)
		.then((response) => response.json())
		.then((result) => {
			clearCardsBlock();
			displayCards(result);
			saveImagesIntoLocalStorage(JSON.stringify(result));
		});
});

function displayCards(cardsData) {
	const cards = createCards(cardsData);
	cards.forEach((item) => {
		cardsBlock.appendChild(item);
	});
}

function formatRequestURL(page, limit) {
	return `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
}

function createCards(infoArray) {
	let cards = [];

	cards = infoArray.map((item) => {
		const card = document.createElement("div");
		card.classList.add("card");

		const imageElement = document.createElement("img");
		imageElement.setAttribute("src", item.download_url);
		imageElement.setAttribute("alt", "image");
		card.appendChild(imageElement);

		const authorParagraphElement = document.createElement("p");
		authorParagraphElement.textContent = item.author;
		card.appendChild(authorParagraphElement);

		return card;
	});

	return cards;
}

function clearCardsBlock() {
	cardsBlock.innerHTML = "";
}

function saveImagesIntoLocalStorage(images) {
	localStorage.setItem("images", images);
}

function loadImagesFromLocalStorage() {
	const images = localStorage.getItem("images");
	if (images) {
		displayCards(JSON.parse(images));
	}
}
