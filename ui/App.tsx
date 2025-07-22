import * as React from "react";
import "./app.css";

const App = ({}) => {
  const [text, setText] = React.useState("");

  const getStrForObj = (obj) => {
    return JSON.stringify(obj, null, 2)
        .replaceAll('  ', '&nbsp;&nbsp;&nbsp;&nbsp;')
        .replaceAll('\n', '<br>')
  };

  const logOnce = (val) => {
    const currentText = typeof val === 'string' ? val : getStrForObj(val)
    setText(previos => previos + currentText + '<br>')
  }

  const log = (...arr) => arr.forEach(logOnce)

  const onClearClick = () => {
    setText("")
  }

  const onProcess = () => {
    parent.postMessage({ pluginMessage: 'GET_SELECTION' }, '*')
  }

  onmessage = (event) => {
    const { result, message } = event.data.pluginMessage

    result.forEach((it) => {
      const { type, name, component, componentProperties , children } = it

      if(component === 'Button') {
        log({
          type: component,
          value: componentProperties.text.value
        })
      } else {
        log(it)
      }
    })
  }

  return (
      <div className="container">
        <h4>Pixso Plugin</h4>
        <div>
          <button onClick={onProcess}>Process</button>
          <button>Download</button>
          <button onClick={onClearClick}>Clear</button>
        </div>
        <p id="console" dangerouslySetInnerHTML={{__html: text}}></p>
      </div>
  );
};

export default App;
