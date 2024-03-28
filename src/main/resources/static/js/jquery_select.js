const selectBoxElements = document.querySelectorAll(".select");

function toggleSelectBox(selectBox) {
  selectBox.classList.toggle("active");
}

function selectOption(optionElement) {
  const selectBox = optionElement.closest(".select");
  const selectedElement = selectBox.querySelector(".selected-value");
  selectedElement.textContent = optionElement.textContent;
}

selectBoxElements.forEach(selectBoxElement => {
  selectBoxElement.addEventListener("click", function (e) {
    const targetElement = e.target;
    const isOptionElement = targetElement.classList.contains("option");

    if (isOptionElement) {
      selectOption(targetElement);
    }

    toggleSelectBox(selectBoxElement);
  });
});

document.addEventListener("click", function (e) {
  const targetElement = e.target;
  const isSelect = targetElement.classList.contains("select") || targetElement.closest(".select");

  if (isSelect) {
    return;
  }

  const allSelectBoxElements = document.querySelectorAll(".select");

  allSelectBoxElements.forEach(boxElement => {
    boxElement.classList.remove("active");
  });
});