import { defined, knockout } from "cesium";
import defaultLangs from './defaultLangs'

/** Cesium 本地化类 */
export default class CesiumLocale {
  /**
   *
   * @param {*} viewer - Cesium Viewer实例对象
   * @param {*} langs - 本地化配置列表
   */
  constructor(viewer, langs = {}) {
    this._viewer = viewer;
    this._lang = {
      ...defaultLangs,
      ...langs,
    };

    this.init();
  }

  get viewer() {
    return this._viewer;
  }

  get lang() {
    return this._lang;
  }

  init() {
    this._translateHomeButton();
    this._translateBaseLayerPicker();
    this._translateHelpButton();
    this._translateGeocoder();
    this._translateSceneModePicker();
    this._translateFullscreenButton();
  }

  _isUnf(obj, prop) {
    return typeof obj[prop] === "undefined";
  }

  _getEleByCls(el, classname, cb) {
    const ele = el.getElementsByClassName(classname);
    cb && cb(ele);
    return ele;
  }

  _translateDom(el, classname, cb) {
    let eles = this._getEleByCls(el, classname);
    for (let i = 0; i < eles.length; i++) {
      const str = eles[i].innerHTML;
      if (!this._isUnf(this.lang, str)) {
        eles[i].innerHTML = this.lang[str];
        cb && cb(eles[i]);
      }
    }
  }

  _isDefined(prop) {
    return !defined(this.viewer[prop]);
  }

  // 本地化 HomeButton
  _translateHomeButton() {
    if (this._isDefined("homeButton")) return;
    this.viewer.homeButton.viewModel.tooltip = this.lang.HomeButtonToolTip;
  }

  // 本地化BaseLayerPicker
  _translateBaseLayerPicker() {
    if (this._isDefined("baseLayerPicker")) return;
    const { container } = this.viewer;
    this._translateDom(container, "cesium-baseLayerPicker-sectionTitle");
    this._translateDom(container, "cesium-baseLayerPicker-categoryTitle");
    this._translateDom(container, "cesium-baseLayerPicker-itemLabel");
  }

  // 本地化HelpButton
  _translateHelpButton() {
    if (this._isDefined("navigationHelpButton")) return;
    this.viewer.navigationHelpButton.viewModel.tooltip = this.lang.NavigationInstructions;
    const { container } = this.viewer;
    const nodes = this._getEleByCls(container, "cesium-navigation-button");

    [">Mouse", ">Touch"].forEach((text, i) => {
      if (!this._isUnf(this.lang, text)) {
        nodes[i].innerHTML = nodes[i].innerHTML.replace(text, this.lang[text]);
      }
    });

    this._translateDom(container, "cesium-navigation-help-details", (ele) => {
      const span = ele.parentNode.children[0];
      if (!this._isUnf(this.lang, span.innerHTML)) {
        span.innerHTML = this.lang[span.innerHTML];
      }
    });
  }

  _translateGeocoder() {
    if (this._isDefined("geocoder")) return;
    let geocoders = this._getEleByCls(
      this.viewer.container,
      "cesium-geocoder-input"
    );
    geocoders.forEach((geocoder) => {
      geocoder.setAttribute("placeholder", this.lang.GeocodersPlaceholder);
    });
  }

  // 本地化 sceneModePicker
  _translateSceneModePicker() {
    if (this._isDefined("sceneModePicker")) return;
    const { viewModel } = this.viewer.sceneModePicker;
    viewModel.tooltip2D = this.lang.SceneModePickerToolTip2D;
    viewModel.tooltip3D = this.lang.SceneModePickerToolTip3D;
    viewModel.tooltipColumbusView = this.lang.SceneModePickerToolTipView;
  }

  // 本地化全屏按钮
  _translateFullscreenButton() {
    if (this._isDefined(fullscreenButton)) return;
    const { fullscreenButton } = this.viewer;
    const { exitFullScreen, enterFullScreen } = this.lang;
    let tmpIsFullscreen = knockout.getObservable(
      fullscreenButton.viewModel,
      "isFullscreen"
    );
    delete fullscreenButton.viewModel.tooltip;
    knockout.defineProperty(fullscreenButton.viewModel, "tooltip", function () {
      if (!fullscreenButton.viewModel.isFullscreenEnabled) {
        return "Full screen unavailable";
      }
      return tmpIsFullscreen() ? exitFullScreen : enterFullScreen;
    });
    // 重新绑定全屏按钮
    let fullScreenButtonElement = fullscreenButton.container.getElementsByClassName(
      "cesium-fullscreenButton"
    )[0];
    knockout.cleanNode(fullScreenButtonElement);
    knockout.applyBindings(fullscreenButton.viewModel, fullScreenButtonElement);
  }
}
