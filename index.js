
const { Plugin } = require('powercord/entities');
const fs = require('fs'),
  path = require('path');
let timeout;
const css = document.createElement('style');
css.appendChild(document.createTextNode(''));
document.head.append(css);
css.type = 'text/css';
let last;
let styles;
const div = document.createElement('div');
div.classList.add('bg2');
document.querySelector('.app-2rEoOp').prepend(div);
document.body.insertAdjacentHTML('beforebegin', `
<svg style='display:none;' class='hiddensvg'>
<filter id='sharpBlur'>
  <feGaussianBlur stdDeviation='8'></feGaussianBlur>
  <feColorMatrix type='matrix' values='1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 9 0'></feColorMatrix>
  <feComposite in2='SourceGraphic' operator='in'></feComposite>
</filter>
</svg>`);
module.exports = class RandomBG extends Plugin {
  reload (b64data) {
    let random = Math.floor(Math.random() * b64data.length);
    while (random === last) {
      random = Math.floor(Math.random() * b64data.length);
    }
    styles = `.bg2{
      background-image: url(${b64data[last]});
    }
      .bg-h5JY_x{
        background-image: url(${b64data[random]});
    }`;
    css.innerHTML = styles;
    void div.offsetWidth;
    styles = `.bg-h5JY_x{
      background-image: url(${b64data[random]});
      animation: fadein 10s linear forwards;
  }
  .bg2{
    background-image: url(${b64data[last]});
}`;
    css.innerHTML = styles;
    last = random;
  }

  getFiles (files) {
    const b64data = [];
    for (let i = 0; i < files.length; i++) {
      console.log(i);
      const file = fs.readFileSync(path.join(__dirname, 'images', files[i]), { encoding: 'base64' });
      const filearray = path.join(__dirname, 'images', files[i]).split('.');
      const ext = filearray[filearray.length - 1];
      let prefix;
      if (ext === 'jpg' || ext === 'jpeg') {
        prefix = 'data:image/jpeg;base64,';
        const dataurl = `${prefix}${file}`;
        b64data.push(dataurl);
      } else if (ext === 'png') {
        prefix = 'data:image/png;base64,';
        const dataurl = `${prefix}${file}`;
        b64data.push(dataurl);
      } else {
        console.log('unsupported');
      }
    }
    return (b64data);
  }

  async startPlugin () {
    this.loadStylesheet(path.join(__dirname, 'style.css'))
    const files = await fs.readdirSync(path.join(__dirname, 'images'));
    console.log('starting read dir');
    const b64data = await this.getFiles(files);
    this.reload(b64data);
    timeout = setInterval(this.reload, 60000, b64data);
  }

  pluginWillUnload () {
    clearInterval(timeout);
    css.parentNode.removeChild(css);
    document.querySelector('.bg2').parentNode.removeChild(document.querySelector('.bg2'));
    document.querySelector('.hiddensvg').parentNode.removeChild(document.querySelector('.hiddensvg'));
  }
};
