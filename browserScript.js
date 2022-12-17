let playButton = document.querySelector("[data-rt*='play-button']"); 

function displayText() {
  console.log('Starting translation...');
  setTimeout(function (){
    observer.observe(document.querySelectorAll("[class*='text-tracks']")[0], {
      subtree: true,
      childList: true,
      attributes: true,
    });
  }, 1000);
}

playButton.addEventListener("click", displayText);

async function translate(original) {
  return await fetch("http://localhost:8000", {
    method: "POST",
    body: JSON.stringify({
      q: original,
      source: "sv",
      target: "en",
      format: "text",
      api_key: ""
	  }),
	  headers: { "Content-Type": "application/json" }
  })
  .then(response => response.json())
  .then(json => (json.translatedText))
  .catch((error) => 'Failed to translate...')
}

async function formatText(unformattedTranslation) {
  const maxLineLength = 42;
  if (unformattedTranslation.length <= maxLineLength) {
    return unformattedTranslation
  }
  let breakCount = (unformattedTranslation.match(/<br>/g) || []).length;
  let breakRatio = unformattedTranslation.length / (Math.max(1, breakCount))
  // console.log(breakCount);
  if (breakRatio > maxLineLength*2 || (breakCount === 0 && unformattedTranslation.length > maxLineLength)){
    let breakIndex = maxLineLength*1
    let searchIndex = breakIndex
    let keepSearching = true;
    while(keepSearching && searchIndex > 0) {
      if ([' ', '.', '!', '?', ',', '-', ':', ';'].includes(unformattedTranslation[searchIndex])){
        breakIndex = searchIndex;
        keepSearching = false;
      } else {
        searchIndex = searchIndex - 1;
      }
    }
    var formattedTranslation = unformattedTranslation.slice(0, breakIndex) + "<br>" + unformattedTranslation.slice(breakIndex);
  } else {
    formattedTranslation = unformattedTranslation;
  }
  // Check for double breaks
  // console.log(formattedTranslation)
  formattedTranslation = formattedTranslation.replace(new RegExp('<br><br>', 'g'), '<br>');
  return formattedTranslation
}

const observer = new MutationObserver( async (mutations, observer) => {
  if(mutations[0].addedNodes.length > 0) {
    observer.disconnect()
    let sv_text = document.querySelectorAll("[class*='text-track']")[0].getElementsByTagName('span')[2].innerHTML;
document.querySelectorAll("[class*='text-track']")[0].getElementsByTagName('span')[2].innerHTML = '';
    let en_text = await translate(sv_text);
    let formattedTranslation = await formatText(en_text);
    document.querySelectorAll("[class*='text-track']")[0].getElementsByTagName('span')[2].innerHTML = formattedTranslation;
    observer.observe(document.querySelectorAll("[class*='text-track']")[0], {
      subtree: true,
      childList: true,
      attributes: true,
    });
  }
});