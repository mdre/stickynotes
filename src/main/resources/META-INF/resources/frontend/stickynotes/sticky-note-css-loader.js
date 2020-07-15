import styles from '@vaadin/flow-frontend/stickynotes/sticky-note.css';

const $_documentContainerSN = document.createElement('template');

$_documentContainerSN.innerHTML = `
  <dom-module id="sticky-note-css" theme-for="sticky-note">
    <template><style>${styles}</style></template>
  </dom-module>`;
document.head.appendChild($_documentContainerSN.content);


