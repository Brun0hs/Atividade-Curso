// ── Mini-helper de DOM (cria elementos como o JSX do React, mas em JS puro) ──

/**
 * Cria um elemento DOM.
 * @param {string} tag - nome da tag (ex: 'div')
 * @param {object} props - atributos/propriedades. Chaves 'onClick'/'onInput'... viram listeners.
 * @param  {...any} children - filhos (elementos, textos, arrays; null/false são ignorados)
 */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);

  for (const [chave, valor] of Object.entries(props || {})) {
    if (valor === null || valor === undefined || valor === false) continue;

    if (chave === 'class') {
      node.className = valor;
    } else if (chave === 'html') {
      node.innerHTML = valor;
    } else if (chave === 'value') {
      node.value = valor;
    } else if (chave.startsWith('on') && typeof valor === 'function') {
      node.addEventListener(chave.slice(2).toLowerCase(), valor);
    } else if (valor === true) {
      node.setAttribute(chave, '');
    } else {
      node.setAttribute(chave, valor);
    }
  }

  anexarFilhos(node, children);
  return node;
}

function anexarFilhos(node, children) {
  for (const filho of children.flat(Infinity)) {
    if (filho === null || filho === undefined || filho === false) continue;
    node.append(filho.nodeType ? filho : document.createTextNode(String(filho)));
  }
}

/** Substitui todo o conteúdo de `container` pelos `nodes` informados. */
export function mount(container, ...nodes) {
  container.replaceChildren();
  anexarFilhos(container, nodes);
}
