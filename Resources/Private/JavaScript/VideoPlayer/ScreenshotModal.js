import { drawCanvas } from './Screenshot';
import SimpleModal from './SimpleModal';

const imageFormats = [
  {
    mimeType: 'image/png',
    label: "PNG",
  },
  {
    mimeType: 'image/jpeg',
    label: "JPEG",
  },
  {
    mimeType: 'image/tiff',
    label: "TIFF",
  },
];

export default class ScreenshotModal extends SimpleModal {
  constructor(parent, videoDomElement, env) {
    const supportedImageFormats = imageFormats.filter(format => env.supportsCanvasExport(format.mimeType));

    super(parent, {
      env,
      metadata: null,
      showMetadata: true,
      supportedImageFormats,
      selectedImageFormat: supportedImageFormats[0],
    });

    this._videoDomElement = videoDomElement;
  }

  _createDom() {
    const env = this._state.env;
    const dom = super._createDom("screenshot-modal");

    dom.title.innerText = "Screenshot";

    const idShowMetadata = env.mkid();

    const configTmpl = document.createElement("template");
    configTmpl.innerHTML = `
      <div class="screenshot-config">
        <input type="checkbox" id="${idShowMetadata}" class="show-metadata"><!--
        --><label for="${idShowMetadata}"> Metadaten einblenden</label>

        ·

        Dateiformat:
        <span class="image-formats"></span>

        ·

        <a href="#" class="download-image">Bild herunterladen</a>
      </div>
    `;
    dom.config = configTmpl.content.firstElementChild;
    dom.showMetadata = dom.config.querySelector('.show-metadata');
    dom.showMetadata.checked = this._state.showMetadata;
    dom.showMetadata.addEventListener('change', this.handleChangeShowMetadata.bind(this));
    dom.imageFormatSpan = dom.config.querySelector('.image-formats');
    const radioGroup = env.mkid();
    for (const format of this._state.supportedImageFormats) {
      const radioId = env.mkid();

      const radio = document.createElement('input');
      radio.id = radioId;
      radio.name = radioGroup;
      radio.type = 'radio';
      radio.checked = format.mimeType === this._state.selectedImageFormat.mimeType;
      radio.addEventListener('change', () => {
        this.setState({
          selectedImageFormat: format,
        });
      });

      const label = document.createElement('label');
      label.htmlFor = radioId;
      label.innerText = ` ${format.label}`;

      dom.imageFormatSpan.append(radio, label);
    }
    dom.downloadImage = dom.config.querySelector('.download-image');
    dom.downloadImage.addEventListener('click', this.handleDownloadImage.bind(this));
    dom.body.append(dom.config);

    dom.canvas = document.createElement("canvas");
    dom.body.append(dom.canvas);

    return dom;
  }

  setMetadata(metadata) {
    this.setState({ metadata });
    return this;
  }

  handleChangeShowMetadata(e) {
    this.setState({
      showMetadata: e.target.checked,
    });
  }

  handleDownloadImage(e) {
    e.preventDefault();

    // We could've set `downloadImage.href` in `render()` or in the radio box
    // change listener, but avoid this for performance reasons

    const a = document.createElement("a");
    a.href = this._dom.canvas.toDataURL(this._state.selectedImageFormat.mimeType);
    a.download = "screenshot";
    a.click();
  }

  render(state) {
    super.render(state);

    const { show, metadata, showMetadata } = state;

    if (show && (!this._state.show || showMetadata !== this._state.showMetadata)) {
      const metadataArray = showMetadata && metadata
        ? metadata
        : { metadata: {}, screenshotFields: [] };

      drawCanvas(this._dom.canvas, this._videoDomElement, metadataArray);
    }
  }
}
