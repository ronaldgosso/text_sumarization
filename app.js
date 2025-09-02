import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

let summarizer;

// Load model with blocking UI
async function loadModel() {
  try {
    Notiflix.Block.circle('body', 'Loading AI model...');
    summarizer = await pipeline("text2text-generation", "Xenova/t5-small");
    Notiflix.Block.remove('body');
    Notiflix.Notify.success("Model loaded successfully! 🚀");
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

  try {
    Notiflix.Block.circle('#output', 'Summarizing...');
    const result = await summarizer("summarize: " + inputText, {
      max_length: 100,
      min_length: 30,
    });

    document.getElementById("output").innerText = result[0].generated_text;
    Notiflix.Block.remove('#output');
    Notiflix.Notify.success("Summary ready! ✅");
  } catch (err) {
    console.error(err);
    Notiflix.Block.remove('#output');
    Notiflix.Report.failure("Summarization Error", "Something went wrong while summarizing.", "Close");
  }
}

// Initialize app
window.addEventListener("load", loadModel);
document.getElementById("summarizeBtn").addEventListener("click", summarizeText);
