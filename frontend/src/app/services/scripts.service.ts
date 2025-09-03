import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document: Document
  ) { 
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  theme() {
    this.loadScript('assets/js/theme.js');
  }

  js() {
    this.loadScript('assets/js/script.js');
  }

  bootstrap() {
    this.loadScript('assets/js/bootstrap.bundle.min.js');
  }

  popover() {
    this.loadScript('assets/js/popover.js');
  }

  inputfile() {
    this.loadScript('assets/js/input-file.js');
  }

  datatable() {
    this.loadScript('assets/js/datatable.js');
  }

  mask() {
    this.loadScript('assets/js/jquery.maskedinput.min.js');
    this.loadScript('assets/js/mask.js');
  }

  quickprint() {
    this.loadScript('assets/js/quickprint.js');
  }

  lightbox() {
    this.loadScript('assets/plugins/lightbox/glightbox.min.js');
    this.loadScript('assets/plugins/lightbox/lightbox.js');
  }

  networkPrint() {
    this.loadScript('assets/js/network-print.js');
  }

  async carousel() {
    this.loadScript('assets/plugins/owlcarousel/owl.carousel.min.js');
  }

  loadScript(url: string) {
    const s = this.renderer.createElement('script');
    s.type = 'text/javascript';
    s.src = url;
    s.text = ``;
    this.renderer.appendChild(this._document.body, s);
  }

  removeScript(url: string) {
    this.renderer.removeChild(this._document.body, this._document.querySelector(`script[src="${url}"]`));
  }

}
