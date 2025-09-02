# text_summarization
A text summarization project is a Natural Language Processing (NLP) application designed to automatically create a short, coherent summary of a longer text document. The project's goal is to reduce the volume of text while retaining the most important information, making it easier for users to digest large amounts of information efficiently.
This one is just a sample, by virtue of running on a non-server backed environment.
[Site](https://ronaldgosso.gitlab.io/text_summarization)

## Tech-Flow
    - Vanilla JS
    - Static Web 😀

## Model and Caveats
- Xenova/t5-small 🔥
    Runs in-browser, limited by client resources, may be slower for long texts.
- Xenova/pegasus-xsum-small 🔥🔥
    Fast. While similar in size to T5-small, its specific architecture and training for summarization may have a slight variation in speed.
- Xenova/t5-base 🔥🔥🔥
    Moderate. Significantly slower than t5-small due to its larger size and higher parameter count.
- Xenova/distilbart-cnn-6-6 🔥🔥🔥🔥
    Fast. Built with a "distilled" architecture, which intentionally makes it smaller and faster than the full-sized BART model.
- Xenova/bart-large-cnn 🔥🔥🔥🔥🔥
   Slowest. This is the largest model, and therefore requires the most time for inference.

Depends on your Internet connection 


