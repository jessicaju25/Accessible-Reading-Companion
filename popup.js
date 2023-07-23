let speech = null;
let headersSpoken = false;

document.addEventListener("DOMContentLoaded", () => {
  const speakButton = document.getElementById("speakButton");

  speakButton.addEventListener("click", () => {
    if (!headersSpoken) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: speakHeaderText
      }).then(() => {
        // Call the function you want to execute after speakHeaderText()
        speakHeadersPrompt();
      });
    });
      // when enter is pressed after speakheadersprompt, speakfullcontent
  }else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: speakFullContent
      });
    });
  };
  });
});


function speakHeaderText() {
  const summaryList = document.querySelector("ul.content-intro__list");
  let textToSpeak = "";
  //if there is summary, read it
  if (summaryList) {
    const listItems = summaryList.querySelectorAll("li");
    listItems.forEach(item => {
      textToSpeak += item.innerText.trim() + ". ";
    });
  } //if there isnt, read the headers
  else {
    const headerElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headerElements.forEach(element => {
      textToSpeak += element.innerText.trim() + ". ";
    });
  }

  if (textToSpeak) {
    speech = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(speech);
  }
}






function speakHeadersPrompt() {
  const promptText = "Do you want to continue with the full content? Press enter on the keyboard if yes.";
  speech = new SpeechSynthesisUtterance(promptText);
  window.speechSynthesis.speak(speech);

  document.onkeydown = speakFullContent;
  headersSpoken= true;
}

function speakFullContent() {
  const contentElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
  let textToSpeak = "";

  contentElements.forEach(element => {
    if (element.tagName === "H1" || element.tagName === "H2" || element.tagName === "H3" || element.tagName === "H4" || element.tagName === "H5" || element.tagName === "H6") {
      textToSpeak += element.innerText.trim() + ". ";
    } else if (element.tagName === "P") {
      textToSpeak += element.innerText.trim() + " ";
    }
  });

  if (textToSpeak) {
    speech = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(speech);
  }


}
