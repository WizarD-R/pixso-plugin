pixso.showUI(__html__, {
  width: 360,
  height: 600
});

const clearProps = (obj) => {
  const cleared = {}
  for(const key of Object.keys(obj)) {
    cleared[key.split('#')[0]] = obj[key]
  }
  return cleared
}

const getNameForComponent = (component) => {
  if(component.parent?.type === 'COMPONENT_SET') {
    return component.parent.name
  }
  return component.name
}

const processNode = node => {
  const { type, name } = node

  const base = {
    type,
    name,
  }

  if(type === 'FRAME') {
    return {
      ...base,
      children: node.children.map(processNode)
    }
  }

  if(type === 'INSTANCE') {
    const { mainComponent, componentProperties, overrides } = node

    return {
      ...base,
      component: getNameForComponent(mainComponent),
      componentProperties: clearProps(componentProperties),
    }
  }

  return base
}

pixso.ui.onmessage = (message) => {
  const selection = pixso.currentPage.selection


  const result = selection.map(processNode)

  console.log(result)

  pixso.ui.postMessage({
    result,
    message
  });
};