import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

let summarizer;

async function loadModel() {
  try {
    document.getElementById("status").innerText = "⏳ Loading model...";
    summarizer = await pipeline("text2text-generation", "Xenova/t5-small");
    document.getElementById("status").innerText = "✅ Model loaded, ready!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Failed to load model.";
  }
}

async function summarizeText() {
  const inputText = document.getElementById("inputText").value.trim();
  if (!inputText) {
    alert("Please enter some text to summarize.");
    return;
  }

  try {
    document.getElementById("status").innerText = "⏳ Summarizing...";
    const result = await summarizer("summarize: " + inputText, {
      max_length: 100,
      min_length: 30,
    });

    document.getElementById("output").innerText = result[0].generated_text;
    document.getElementById("status").innerText = "✅ Done!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Summarization failed.";
  }
}

// Initialize app
window.addEventListener("load", loadModel);
document.getElementById("summarizeBtn").addEventListener("click", summarizeText);
