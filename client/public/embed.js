console.log('say ho!!!');


window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
//   if (origin !== "http://example.org:8080")
    // return;

  // ...
//   console.log(event);
  var type, message;
  try {
      [type, message] = JSON.parse(event.data);
  } catch(e) {

  }

  console.log(type, message);

  if (type === 'rendered') {
iframe.style.height = message.height + 'px';
console.log(message.height + 'px');
  }





}
const d = document;
const iframe = d.createElement('iframe');
window.testApp = {
  name: 'Albert',
  setup: (schema) => {
    console.log(schema);
// console.log()


    const containerId = 'ad_factory_editor';
    
    const container = document.getElementById(containerId);
    // )
    

    container.appendChild(iframe);

    let url = 'http://127.0.0.1:3001/';

    url = `http://10.64.54.37:3001/editor.html?schema=${schema}`;


    iframe.style.display = 'none';
    // var a = this.elem = h.createElement("iframe");
    // iframe.setAttribute("id", this.uid);
    // iframe.setAttribute("name", this.uid);
    iframe.setAttribute('allowTransparency', 'true');
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('scrolling', 'no');


    iframe.setAttribute('width', '100%');

    iframe.setAttribute('src', url);
    iframe.addEventListener('load', () => {
      iframe.style.display = 'block';
    });
  },
};
console.log('set testApp');
