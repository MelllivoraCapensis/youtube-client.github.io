import getSearchPromise from './searchPromise';
import createItemDom from './itemDom';

export default class ItemsBoxObj {
  constructor(requestValue) {
    this.requestValue = requestValue;
    this.pageToken = '';
    this.items = [];
    this.size = null;
    this.restOfClips = null;
    this.width = null;
    this.leftScroll = 0;
    this.itemWidth = 250;
    this.itemMarginRight = 30;
    document.body.onresize = () => {
      this.setSize(document.body.offsetWidth);
      this.setRestOfClips();
    };
    this.createItemsBoxDom();
    this.createItemsWrapperDom();
  }

  createInterface(items) {
    this.addItems(items);
    this.setSize(document.body.offsetWidth);
    this.setMouseSwipe();
    this.setMobileSwipe();
    this.setRestOfClips();
  }

  createItemsBoxDom() {
    this.itemsBoxDom = document.createElement('div');
    this.itemsBoxDom.id = 'itemsBoxDom';
  }

  createItemsWrapperDom() {
    this.itemsWrapperDom = document.createElement('div');
    this.itemsWrapperDom.id = 'itemsWrapperDom';
    this.itemsBoxDom.appendChild(this.itemsWrapperDom);
  }

  addItems(items) {
    items.forEach((item) => {
      this.items.push(item);
      const itemDom = createItemDom(item);
      this.itemsWrapperDom.appendChild(itemDom);
    });
  }

  stopSwiping() {
    this.itemsWrapperDom.onmousedown = null;
    this.itemsWrapperDom.ontouchstart = null;
    document.body.onresize = null;
  }

  startSwiping() {
    this.setMouseSwipe();
    this.setMobileSwipe();
    document.body.onresize = () => {
      this.setSize(document.body.offsetWidth);
      this.setRestOfClips();
    };
  }

  setSize(screenWidth) {
    this.size = Math.min(4, Math.floor(screenWidth / (this.itemWidth
      + this.itemMarginRight)));
    this.width = this.size * (this.itemWidth + this.itemMarginRight)
    - this.itemMarginRight;
    this.itemsBoxDom.style.width = `${this.width}px`;
  }

  setRestOfClips() {
    this.restOfClips = this.items.length - this.size + this.leftScroll;
    if (this.restOfClips < this.size) {
      this.makeRequest();
    }
  }

  setMouseSwipe() {
    const elem = this.itemsWrapperDom;
    let deltaLeft = 0;
    elem.ondragstart = () => false;
    elem.onmousedown = (startEvent) => {
      const startLeftScroll = this.leftScroll;
      const startLeftMouse = startEvent.pageX;
      elem.onmousemove = (moveEvent) => {
        deltaLeft = moveEvent.pageX - startLeftMouse;
        const finishMove = () => {
          deltaLeft = this.size * Math.sign(deltaLeft) * (Math.abs(deltaLeft) > 20 ? 1 : 0);
          this.leftScroll = Math.min(0, startLeftScroll + deltaLeft);
          new Promise((resolve) => {
            this.setRestOfClips();
            resolve();
          }).then(() => {
            elem.style.left = `${this.leftScroll * (this.itemWidth + this.itemMarginRight)}px`;
          });
          elem.onmousemove = null;
          elem.onmouseleave = null;
          window.onmouseup = null;
        };
        elem.onmouseleave = finishMove;
        window.onmouseup = finishMove;
      };
      elem.onmouseup = () => {
        elem.onmousemove = null;
      };
    };
  }

  setMobileSwipe() {
    const elem = this.itemsWrapperDom;
    elem.ontouchstart = (startEvent) => {
      const startLeftScroll = this.leftScroll;
      const startLeftTouch = startEvent.touches[0].pageX;
      elem.ontouchmove = (moveEvent) => {
        let deltaLeft = moveEvent.touches[0].pageX - startLeftTouch;
        elem.ontouchend = () => {
          deltaLeft = Math.abs(deltaLeft) > 10 ? this.size * Math.sign(deltaLeft) : 0;
          this.leftScroll = Math.min(0, startLeftScroll + deltaLeft);
          elem.ontouchend = null;
          elem.ontouchmove = null;
          new Promise((resolve) => {
            this.setRestOfClips();
            resolve();
          }).then(() => {
            elem.style.left = `${this.leftScroll * (this.itemWidth + this.itemMarginRight)}px`;
          });
        };
      };
    };
  }

  makeRequest() {
    this.stopSwiping();
    getSearchPromise(this.requestValue, this.pageToken)
      .then((result) => {
        this.pageToken = result.pageToken;
        if (this.items.length === 0) {
          this.createInterface(result.itemsArr);
        } else if (this.items.length > 0) {
          this.addItems(result.itemsArr);
        }
        this.startSwiping();
      });
  }
}
