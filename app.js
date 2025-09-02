import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2/dist/transformers.min.js'


let summarizer;
const themeToggleBtn = document.getElementById("themeToggle");

// Load model with blocking UI
async function loadModel(modelName) {
  try {
    Notiflix.Block.circle('body', 'Loading AI model...');
    summarizer = await pipeline("summarization", modelName);
    Notiflix.Block.remove('body');
    Notiflix.Notify.success(`Model ${modelName} loaded!`);
  } catch (err) {
    console.error(err);
    Notiflix.Block.remove('body');
    Notiflix.Report.failure("Model Error", "Failed to load the model.", "Close");
  }
}

// Summarize text with blocking animation
async function summarizeText() {
  const inputText = document.getElementById("inputText").value.trim();
  if (!inputText) {
    Notiflix.Report.warning("Empty Input", "Please enter some text to summarize.", "OK");
    return;
  }

  // Show blocking spinner first
  Notiflix.Block.pulse('#output', 'Summarizing...');

  // Allow the spinner to render
  setTimeout(async () => {
    try {
      const result = await summarizer("summarize: " + inputText, {
        max_length: 100,
        min_length: 30,
      });

      document.getElementById("output").innerText = result[0].summary_text || result[0].generated_text;
      Notiflix.Block.remove('#output');
      Notiflix.Notify.success("Summary ready! ✅");
    } catch (err) {
      console.error(err);
      Notiflix.Block.remove('#output');
      Notiflix.Report.failure("Summarization Error", "Something went wrong while summarizing.", "Close");
    }
  }, 50); // 50ms gives browser time to render
}


//THEME
// Toggle dark theme dynamically
function applyHfDarkTheme() {
  document.body.classList.add("dark-theme");
  themeToggleBtn.innerText = "Light";
}

function removeHfDarkTheme() {
  document.body.classList.remove("dark-theme");
  themeToggleBtn.innerText = "Dark";

}

// Optional: detect system dark mode
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDark) {
  applyHfDarkTheme();
} else {
  removeHfDarkTheme();
}


// Initialize Model
window.addEventListener("load", () => loadModel('Xenova/t5-small'));

// Model selection event listener
document.getElementById("modelSelect").addEventListener("change", (event) => {
  loadModel(event.target.value);
  console.log (`Model changed to ${event.target.value}`);
});


document.getElementById("summarizeBtn").addEventListener("click", summarizeText);

themeToggleBtn.addEventListener("click", () => {
  if (document.body.classList.contains("dark-theme")) {
    removeHfDarkTheme();
  } else {
    applyHfDarkTheme();
  }
});
