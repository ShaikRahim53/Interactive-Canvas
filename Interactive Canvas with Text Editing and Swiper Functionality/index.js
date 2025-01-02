let activeTextBox = null;
const activeTextBoxes = {};

// Object to store the font family, font style, font size, and color for each slide
const activeFontFamilies = {};
const activeFontStyles = {};
const activeFontSizes = {};
const activeColors = {};

// Set default language to English
window.addEventListener("DOMContentLoaded", () => {
  const languageDropdown = document.getElementById("language");
  languageDropdown.value = "en-GB";
  const movableTextboxes = document.querySelectorAll(".movable-textbox");

  movableTextboxes.forEach((textbox) => {
    textbox.value = textbox.value.trim();
  });

  const featurePanelTextarea = document.getElementById("canvasText");
  featurePanelTextarea.value = featurePanelTextarea.value.trim();
});

var textBox1 = document.getElementById("canvas1-text");
var textBox2 = document.getElementById("canvas2-text");
var textBox3 = document.getElementById("canvas3-text");

// Initialize Swiper
const swiper = new Swiper(".swiper-container", {
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  on: {
    slideChange: function () {
      const languageDropdown = document.getElementById("language");

      const currentSlideIndex = swiper.previousIndex;
      if (activeTextBox) {
        activeTextBoxes[currentSlideIndex] = activeTextBox;
      }

      // Update the feature panel based on the active slide
      const activeSlide = swiper.slides[swiper.activeIndex];
      //console.log("Active slide:", activeSlide);
      activeTextBox = activeSlide.querySelector(".movable-textbox");
      activeTextBox =
        activeTextBoxes[swiper.activeIndex] ||
        activeSlide.querySelector(".movable-textbox");

      if (activeTextBox) {
        const languageValue =
          activeTextBox.getAttribute("data-language") || "en-GB";
        document.getElementById("language").value = languageValue;
        const languageText = languages[languageValue];
        languageDropdown.querySelector(
          `option[value="${languageValue}"]`
        ).selected = true;
      }
      // Restore the font family dropdown value
      const fontFamily = activeFontFamilies[swiper.activeIndex] || "Arial";
      document.getElementById("fontFamily").value = fontFamily;

      // Restore the font style dropdown value
      const fontStyle = activeFontStyles[swiper.activeIndex] || "normal";
      document.getElementById("fontStyle").value = fontStyle;

      // Restore the font size dropdown value
      const fontSize = activeFontSizes[swiper.activeIndex] || "12px";
      document.getElementById("fontSize").value = fontSize;

      // Restore the color icon's background color
      const color = activeColors[swiper.activeIndex] || "#ededede8";
      colorIcon.querySelector("i").style.backgroundColor = color;
      // Set feature panel values based on the active text box
      if (activeTextBox) {
        document.getElementById("fontFamily").value =
          activeTextBox.getAttribute("data-font-family") || "Arial";
        document.getElementById("fontSize").value =
          activeTextBox.style.fontSize || "12px";
        document.getElementById("fontStyle").value =
          activeTextBox.style.fontStyle || "normal";
        document.getElementById("canvasText").value = activeTextBox.value || "";
      }

      languageDropdown.addEventListener("change", () => {
        const activeSlide = swiper.slides[swiper.activeIndex];
        const activeTextBox = activeSlide.querySelector(".movable-textbox");
        if (activeTextBox) {
          activeTextBox.setAttribute("data-language", languageDropdown.value);
        }
      });

      // Update the text properties based on the panel values
      updateTextProperties();
    },
  },
});
// Add event listener for font family dropdown
document.getElementById("fontFamily").addEventListener("change", function () {
  if (activeTextBox) {
    activeTextBox.style.fontFamily = this.value;
    activeTextBox.setAttribute("data-font-family", this.value);
    // Save the font family for the current slide
    activeFontFamilies[swiper.activeIndex] = this.value;
  }
});

// Add event listener for font style dropdown
document.getElementById("fontStyle").addEventListener("change", function () {
  if (activeTextBox) {
    activeTextBox.style.fontStyle = this.value;
    // Save the font style for the current slide
    activeFontStyles[swiper.activeIndex] = this.value;
  }
});

// Add event listener for font size dropdown
document.getElementById("fontSize").addEventListener("change", function () {
  if (activeTextBox) {
    activeTextBox.style.fontSize = this.value;
    // Save the font size for the current slide
    activeFontSizes[swiper.activeIndex] = this.value;
  }
});

// Color change functionality
const colorIcon = document.getElementById("color_icon");
const colorPanel = document.getElementById("colorPickerPanel");
const colorOptions = document.querySelectorAll(".color-option");

colorIcon.addEventListener("click", () => {
  colorPanel.style.display =
    colorPanel.style.display === "none" || !colorPanel.style.display
      ? "block"
      : "none";
});

colorOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    const selectedColor = e.target.getAttribute("data-color");

    // Update only the active text box with the selected color
    if (activeTextBox) {
      activeTextBox.style.color = selectedColor;

      // Update the color icon using clip-path
      const icon = colorIcon.querySelector("i");
      icon.style.backgroundColor = selectedColor; // Apply background color
      icon.style.webkitClipPath = "circle(50% at 50% 50%)";
      icon.style.clipPath = "circle(50% at 50% 50%)";

      // Store the color for the current slide
      activeColors[swiper.activeIndex] = selectedColor;
    }

    colorPanel.style.display = "none";
  });
});

document.addEventListener("click", (e) => {
  if (
    !colorPanel.contains(e.target) &&
    !colorIcon.contains(e.target) &&
    e.target !== colorIcon
  ) {
    colorPanel.style.display = "none";
  }
});

// Function to handle drag start
// Function to handle drag start
const onDragStart = (event) => {
  const textbox = event.target;
  const shiftX = event.clientX - textbox.getBoundingClientRect().left;
  const shiftY = event.clientY - textbox.getBoundingClientRect().top;

  const canvas = textbox.parentElement;
  const canvasRect = canvas.getBoundingClientRect();
  //console.log("Canvas rect:", canvasRect);
  console.log("Canvas width:", canvasRect.width);
  console.log("Canvas height:", canvasRect.height);

  const onMouseMove = (moveEvent) => {
    let newX = moveEvent.clientX - shiftX - canvasRect.left;
    let newY = moveEvent.clientY - shiftY - canvasRect.top;

    // Ensure the textbox stays within the canvas
    if (newX < 0) {
      newX = 0;
    }
    if (newX + textbox.offsetWidth > canvasRect.width) {
      newX = canvasRect.width - textbox.offsetWidth;
    }
    if (newY < 0) {
      newY = 0;
    }
    if (newY + textbox.offsetHeight > canvasRect.height) {
      newY = canvasRect.height - textbox.offsetHeight;
    }
    //console.log("New X:", newX);
    //console.log("New Y:", newY);

    textbox.style.left = `${newX}px`;
    textbox.style.top = `${newY}px`;
    //console.log("Textbox left:", textbox.style.left);
    //console.log("Textbox top:", textbox.style.top);
  };

  const onDragEnd = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onDragEnd);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onDragEnd);

  textbox.ondragstart = () => false;
  // Prevent default drag behavior
};

const languages = {
  "ar-SA": "Arabic",
  "be-BY": "Bielarus",
  "ca-ES": "Catalan",
  "cy-GB": "Welsh",
  "da-DK": "Danish",
  "de-DE": "German",
  "el-GR": "Greek",
  "en-GB": "English",
  "es-ES": "Spanish",
  "et-EE": "Estonian",
  "eu-ES": "Basque",
  "fa-IR": "Persian",
  "fi-FI": "Finnish",
  "fo-FO": "Faroese",
  "fr-FR": "French",
  "gl-ES": "Galician",
  "gu-IN": "Gujarati",
  "ha-NE": "Hausa",
  "he-IL": "Hebrew",
  "hi-IN": "Hindi",
  "hr-HR": "Croatian",
  "hu-HU": "Hungarian",
  "id-ID": "Indonesian",
  "is-IS": "Icelandic",
  "it-IT": "Italian",
  "ja-JP": "Japanese",
  "kk-KZ": "Kazakh",
  "km-KM": "Khmer",
  "kn-IN": "Kannada",
  "ko-KR": "Korean",
  "ky-KG": "Kyrgyz",
  "la-VA": "Latin",
  "lo-LA": "Lao",
  "lv-LV": "Latvian",
  "mg-MG": "Malagasy",
  "ms-MY": "Malay",
  "mt-MT": "Maltese",
  "my-MM": "Burmese",
  "ne-NP": "Nepali",
  "niu-NU": "Niuean",
  "nl-NL": "Dutch",
  "no-NO": "Norwegian",
  "ny-MW": "Nyanja",
  "ur-PK": "Pakistani",
  "pa-IN": "Panjabi",
  "ps-PK": "Pashto",
  "pis-SB": "Pijin",
  "pl-PL": "Polish",
  "pt-PT": "Portuguese",
  "rn-BI": "Kirundi",
  "ro-RO": "Romanian",
  "ru-RU": "Russian",
  "sg-CF": "Sango",
  "si-LK": "Sinhala",
  "sk-SK": "Slovak",
  "sn-ZW": "Shona",
  "so-SO": "Somali",
  "sq-AL": "Albanian",
  "sr-RS": "Serbian",
  "sv-SE": "Swedish",
  "sw-SZ": "Swahili",
  "tet-TL": "Tetum",
  "th-TH": "Thai",
  "ti-TI": "Tigrinya",
  "tk-TM": "Turkmen",
  "tn-BW": "Tswana",
  "tr-TR": "Turkish",
  "uk-UA": "Ukrainian",
  "uz-UZ": "Uzbek",
  "wo-SN": "Wolof",
  "yi-YD": "Yiddish",
  "zu-ZA": "Zulu",
};

// Populate the language dropdown
const languageDropdown = document.getElementById("language");
for (let lang_code in languages) {
  let option = `<option value="${lang_code}">${languages[lang_code]}</option>`;
  languageDropdown.insertAdjacentHTML("beforeend", option);
}

// Function to update text properties based on feature panel settings
function updateTextProperties() {
  // Get the value from the feature panel's textarea
  const featurePanelTextarea = document.getElementById("canvasText");
  const newText = featurePanelTextarea.value;

  // Update only the activeTextBox with the new text
  if (activeTextBox) {
    activeTextBox.value = newText;
  }
}

// Add event listener to feature panel text area
document.getElementById("canvasText").addEventListener("input", function () {
  if (activeTextBox) {
    activeTextBox.value = this.value;
  }
});

// Add event listener to update feature panel text area when canvas text changes
document.querySelectorAll(".movable-textbox").forEach((textbox) => {
  textbox.addEventListener("input", function () {
    if (textbox === activeTextBox) {
      document.getElementById("canvasText").value = textbox.value;
    }
  });
  textbox.addEventListener("mousedown", onDragStart);
  // Ensure drag functionality
});

// Function to translate text using MyMemory Translation API
async function translateText(text, targetLanguage) {
  const sourceLanguage = "en"; // Assuming the source language is always English
  if (sourceLanguage === targetLanguage) {
    return text; // If source and target languages are the same, return the original text
  }
  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${sourceLanguage}|${targetLanguage}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      console.log("Translation successful:", data.responseData.translatedText);
      return data.responseData.translatedText;
    } else {
      console.error(
        `Translation API response error for language: ${targetLanguage}`,
        data
      );
      return null;
    }
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let activeTextarea = null; // Track the currently active textarea

  const updateFeaturePanelTextarea = (textarea) => {
    const featureTextarea = document.querySelector(".feature-panel textarea");
    if (featureTextarea) {
      featureTextarea.value = textarea.value; // Reflect the clicked textarea's content
      featureTextarea.removeEventListener("input", onFeatureTextareaInput);
      featureTextarea.addEventListener("input", onFeatureTextareaInput);
    }

    function onFeatureTextareaInput() {
      if (activeTextarea) {
        activeTextarea.value = featureTextarea.value; // Reflect changes back to the active textarea
      }
    }
  };

  const synchronizeFeaturePanelWithActiveTextarea = () => {
    if (activeTextarea) {
      const featureTextarea = document.querySelector(".feature-panel textarea");
      if (featureTextarea) {
        featureTextarea.value = activeTextarea.value;
      }
    }
  };

  let textareaCount = 0;

  const addNewTextarea = () => {
    const activeSlide = document.querySelector(".swiper-slide-active");
    const activeCanvas = activeSlide.querySelector(".canvas");

    if (activeCanvas) {
      const newTextArea = document.createElement("textarea");
      newTextArea.classList.add("movable-textbox");
      newTextArea.setAttribute("aria-label", "Editable text");
      newTextArea.setAttribute("rows", "3");
      newTextArea.setAttribute("contenteditable", "true");
      newTextArea.setAttribute("draggable", "true");
      newTextArea.value = "New Text";

      // Set a default position for the new textarea
      const offset = 20 * textareaCount; // Adjust the offset as needed
      newTextArea.style.position = "absolute";
      newTextArea.style.left = `${50 + offset}px`; // Adjust the position as needed
      newTextArea.style.top = `${40 + offset}px`; // Adjust the position as needed
      newTextArea.style.backgroundColor = "transparent";

      activeCanvas.appendChild(newTextArea);

      // Add event listeners for functionality
      attachTextareaEvents(newTextArea);

      // Show feature panel and hide horizontal box
      togglePanels("feature");

      textareaCount++;
    }
  };

  const togglePanels = (panel) => {
    const tip = document.getElementById("tip");
    const horizontalBox = document.getElementById("horizontalBox");
    const arrowMark = document.getElementById("arrowMark");
    const featurePanel = document.querySelector(".feature-panel");

    if (panel === "feature") {
      tip.style.display = "none";
      horizontalBox.style.display = "none";
      arrowMark.style.display = "block";
      featurePanel.style.display = "block";
    } else {
      tip.style.display = "block";
      horizontalBox.style.display = "flex";
      arrowMark.style.display = "none";
      featurePanel.style.display = "none";
    }
  };

  const featureTextarea = document.querySelector(".feature-panel textarea");
  if (featureTextarea) {
    featureTextarea.addEventListener("input", () => {
      if (activeTextarea) {
        activeTextarea.value = featureTextarea.value; // Reflect changes back to the active canvas textarea
      }
    });
  }

  const attachTextareaEvents = (textarea) => {
    textarea.addEventListener("click", () => {
      activeTextarea = textarea; // Set the clicked textarea as active
      activeTextBox = textarea; // Set activeTextBox to the clicked textarea
      updateFeaturePanelTextarea(textarea); // Sync feature panel with the clicked textarea
      togglePanels("feature"); // Show feature panel
    });

    textarea.addEventListener("input", () => {
      if (activeTextarea === textarea) {
        synchronizeFeaturePanelWithActiveTextarea(); // Update feature panel when editing
      }
    });

    textarea.addEventListener("mousedown", (event) => {
      const shiftX = event.clientX - textarea.getBoundingClientRect().left;
      const shiftY = event.clientY - textarea.getBoundingClientRect().top;

      const canvas = textarea.parentElement;
      const canvasRect = canvas.getBoundingClientRect();

      const onMouseMove = (moveEvent) => {
        let newX = moveEvent.clientX - shiftX - canvasRect.left;
        let newY = moveEvent.clientY - shiftY - canvasRect.top;

        // Ensure the textbox stays within the canvas
        if (newX < 0) {
          newX = 0;
        }
        if (newX + textarea.offsetWidth > canvasRect.width) {
          newX = canvasRect.width - textarea.offsetWidth;
        }
        if (newY < 0) {
          newY = 0;
        }
        if (newY + textarea.offsetHeight > canvasRect.height) {
          newY = canvasRect.height - textarea.offsetHeight;
        }

        textarea.style.left = `${newX}px`;
        textarea.style.top = `${newY}px`;
      };

      const onDragEnd = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onDragEnd);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onDragEnd);

      textarea.ondragstart = () => false; // Prevent default drag behavior
    });
  };

  const updateStyleProperty = (property, value) => {
    if (activeTextarea) {
      activeTextarea.style[property] = value;
    }
  };

  document
    .getElementById("language")
    .addEventListener("change", async function () {
      if (activeTextarea) {
        // Ensure we have an active textarea
        const selectedLanguage = this.value; // Get selected language
        if (selectedLanguage === "en") {
          activeTextarea.value =
            activeTextarea.getAttribute("data-original-text") ||
            activeTextarea.value; // Restore original text
        } else {
          const originalText =
            activeTextarea.getAttribute("data-original-text") ||
            activeTextarea.value;
          const translatedText = await translateText(
            originalText,
            selectedLanguage
          );
          if (translatedText !== null) {
            activeTextarea.setAttribute("data-original-text", originalText); // Save original text
            activeTextarea.value = translatedText; // Update textarea with translated text
          }
        }
      }
    });

  // Font family, style, size handlers
  document.getElementById("fontFamily").addEventListener("change", (e) => {
    updateStyleProperty("fontFamily", e.target.value);
  });

  document.getElementById("fontStyle").addEventListener("change", (e) => {
    updateStyleProperty("fontStyle", e.target.value);
  });

  document.getElementById("fontSize").addEventListener("change", (e) => {
    updateStyleProperty("fontSize", e.target.value);
  });

  // Object to store the color for each slide

  // Alignment functionality
  const alignments = ["left", "center", "right"];
  let alignmentIndex = 0;

  document.getElementById("alignment_icon").addEventListener("click", () => {
    alignmentIndex = (alignmentIndex + 1) % alignments.length;
    updateStyleProperty("textAlign", alignments[alignmentIndex]);
  });

  // Line height functionality
  const lineHeights = ["1.2", "1.5", "1.8"];
  let lineHeightIndex = 0;

  document.getElementById("line_height_icon").addEventListener("click", () => {
    lineHeightIndex = (lineHeightIndex + 1) % lineHeights.length;
    updateStyleProperty("lineHeight", lineHeights[lineHeightIndex]);
  });

  // Add event listener to "Add Text" icon
  document
    .querySelector(".horizontal-options .option:nth-child(1)")
    .addEventListener("click", addNewTextarea);

  // Handle arrow mark click
  document.getElementById("arrowMark").addEventListener("click", () => {
    togglePanels("tip");
  });

  // Initialize textareas in all canvases
  document.querySelectorAll(".movable-textbox").forEach(attachTextareaEvents);
});
