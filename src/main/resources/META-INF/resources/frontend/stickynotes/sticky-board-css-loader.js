import styles from '@vaadin/flow-frontend/stickynotes/sticky-board.css';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
  <dom-module id="sticky-board-css" theme-for="sticky-board">
    <template><style>${styles}</style></template>
  </dom-module>`;
document.head.appendChild($_documentContainer.content);


