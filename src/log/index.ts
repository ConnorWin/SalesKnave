export default class Log {
  private current: Element = null;
  constructor(private node: Element) {
    node.classList.remove("hidden");

    this.pause();

    setInterval(() => {
      node.scrollTop += 3;
    }, 20);
  }

  add(str: string) {
    str = str.replace(/{(.*?)}(.*?){}/g, (match, color, str) => {
      return `<span style="color:${color}">${str}</span>`;
    });
    str = str.replace(/\n/g, "<br/>") + "<br/>";

    let item = document.createElement("span");
    item.innerHTML = `${str} `;
    this.current.appendChild(item);
  }

  pause() {
    if (this.current && this.current.childNodes.length == 0) {
      return;
    }
    this.current = document.createElement("p");
    this.node.appendChild(this.current);

    while (this.node.childNodes.length > 50) {
      this.node.removeChild(this.node.firstChild);
    }
  }
}
