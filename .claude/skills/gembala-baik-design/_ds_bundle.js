/* @ds-bundle: {"format":4,"namespace":"GembalaBaikDesignSystem_674cc5","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"LUCIDE_VERSION","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Lockup","sourcePath":"components/core/Lockup.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"NewsCard","sourcePath":"components/patterns/NewsCard.jsx"},{"name":"UnitCard","sourcePath":"components/patterns/UnitCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"f60657c4b294","components/core/Button.jsx":"bb9fd75a281a","components/core/Card.jsx":"5b73c6692a35","components/core/Icon.jsx":"69e79d8a780a","components/core/IconButton.jsx":"441456d5d088","components/core/Lockup.jsx":"b601036b7645","components/core/SectionHeading.jsx":"70f7fc4037f8","components/core/Tag.jsx":"9866229dea5d","components/feedback/Dialog.jsx":"360a8b5456ef","components/feedback/Toast.jsx":"baf90846106a","components/feedback/Tooltip.jsx":"a5da7d2f7c52","components/forms/Checkbox.jsx":"8ad9c19e3f0f","components/forms/Input.jsx":"923ee754a997","components/forms/Radio.jsx":"1084d5216d5e","components/forms/Select.jsx":"7694ff6d3d6c","components/forms/Switch.jsx":"621d40e7e004","components/navigation/NavBar.jsx":"92f80e4ed8fa","components/navigation/Tabs.jsx":"5cd92d569ce0","components/patterns/NewsCard.jsx":"af67df23f182","components/patterns/UnitCard.jsx":"b7e0fd15e940","tailwind/tailwind.config.js":"f77d2fbe84d8","ui_kits/website/App.jsx":"d665431bc733","ui_kits/website/Berita.jsx":"bd3fa691e9e0","ui_kits/website/Footer.jsx":"1671d18d0131","ui_kits/website/Home.jsx":"9a01e5b29546","ui_kits/website/Kontak.jsx":"403239619308"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GembalaBaikDesignSystem_674cc5 = window.GembalaBaikDesignSystem_674cc5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Badge({
  tone = 'neutral',
  icon,
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cx('gb-badge', `gb-badge--${tone}`, className)
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Card({
  tone = 'default',
  pad = 'md',
  interactive = false,
  rule = false,
  as,
  href,
  children,
  className = '',
  ...rest
}) {
  const Tag = as || (href ? 'a' : 'div');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    className: cx('gb-card', tone !== 'default' && `gb-card--${tone}`, `gb-card--pad-${pad}`, (interactive || href) && 'gb-card--interactive', rule && 'gb-card--rule', className)
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Brand icon set: Lucide (stroke 2, round caps). SVGs are fetched from the
   lucide-static CDN, cached, and inlined so stroke="currentColor" in the
   source SVG paints correctly — CSS mask-image is unreliable cross-origin. */
const LUCIDE_VERSION = '0.544.0';
const BASE = `https://unpkg.com/lucide-static@${LUCIDE_VERSION}/icons/`;
const cache = {};
function loadSvg(name) {
  if (!cache[name]) {
    cache[name] = fetch(`${BASE}${name}.svg`).then(r => r.text());
  }
  return cache[name];
}
function Icon({
  name,
  size = 20,
  title,
  className = '',
  style,
  ...rest
}) {
  const [markup, setMarkup] = React.useState(cache[name] && typeof cache[name] !== 'object' ? cache[name] : null);
  React.useEffect(() => {
    let live = true;
    loadSvg(name).then(svg => {
      if (live) setMarkup(svg);
    });
    return () => {
      live = false;
    };
  }, [name]);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['gb-icon-wrap', className].filter(Boolean).join(' '),
    role: title ? 'img' : undefined,
    "aria-label": title || undefined,
    "aria-hidden": title ? undefined : 'true',
    style: {
      display: 'inline-flex',
      flex: 'none',
      width: size,
      height: size,
      color: 'inherit',
      ...style
    },
    dangerouslySetInnerHTML: markup ? {
      __html: markup
    } : undefined
  }, rest));
}
Object.assign(__ds_scope, { LUCIDE_VERSION, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  as,
  href,
  iconLeft,
  iconRight,
  children,
  className = '',
  ...rest
}) {
  const Tag = as || (href ? 'a' : 'button');
  const glyph = size === 'lg' ? 20 : 16;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    className: cx('gb-btn', `gb-btn--${variant}`, variant !== 'link' && `gb-btn--${size}`, block && 'gb-btn--block', className)
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: glyph
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: glyph
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function IconButton({
  icon,
  label,
  variant = 'quiet',
  size = 'md',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    className: cx('gb-iconbtn', `gb-iconbtn--${variant}`, `gb-iconbtn--${size}`, className)
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 16 : size === 'lg' ? 22 : 18
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Lockup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');

/* Brand lockup: seal + "Yayasan Pendidikan" kicker + GEMBALA BAIK wordmark (+ optional place line).
   chip = white circular backing for the seal on dark grounds (its line art is dark ink). */
function Lockup({
  logo,
  kicker = 'Yayasan Pendidikan',
  name = 'Gembala Baik',
  place,
  size = 'md',
  chip = false,
  tone = 'inherit',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cx('gb-lockup', 'gb-lockup--' + size, chip && 'gb-lockup--chip', tone === 'onlight' && 'gb-lockup--onlight', className)
  }, rest), logo && /*#__PURE__*/React.createElement("span", {
    className: "gb-lockup__seal"
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: ""
  })), /*#__PURE__*/React.createElement("span", {
    className: "gb-lockup__text"
  }, kicker && /*#__PURE__*/React.createElement("span", {
    className: "gb-lockup__kicker"
  }, kicker), /*#__PURE__*/React.createElement("span", {
    className: "gb-lockup__name"
  }, name), place && /*#__PURE__*/React.createElement("span", {
    className: "gb-lockup__place"
  }, place)));
}
Object.assign(__ds_scope, { Lockup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Lockup.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function SectionHeading({
  overline,
  title,
  subtitle,
  level = 'h2',
  align = 'left',
  action,
  className = '',
  ...rest
}) {
  const Tag = level;
  const head = /*#__PURE__*/React.createElement("div", _extends({
    className: cx('gb-sec', align === 'center' && 'gb-sec--center', className)
  }, rest), overline && /*#__PURE__*/React.createElement("span", {
    className: "gb-sec__over"
  }, overline), /*#__PURE__*/React.createElement(Tag, {
    className: cx('gb-sec__title', `gb-sec__title--${level}`)
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "gb-sec__sub"
  }, subtitle));
  if (!action) return head;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      flexWrap: 'wrap'
    }
  }, head, action);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Tag({
  selected = false,
  onRemove,
  onClick,
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    className: cx('gb-tag', selected && 'gb-tag--selected', !onRemove && 'gb-tag--plain', className),
    style: onClick ? {
      cursor: 'pointer'
    } : undefined
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "gb-tag__x",
    "aria-label": "Hapus",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 12
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  icon,
  onClose,
  footer,
  children,
  width = 520
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "gb-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "gb-dialog",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": typeof title === 'string' ? title : undefined,
    style: {
      maxWidth: width
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "gb-dialog__head"
  }, icon, /*#__PURE__*/React.createElement("h2", {
    className: "gb-dialog__title",
    style: {
      flex: 1
    }
  }, title), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Tutup",
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    className: "gb-dialog__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "gb-dialog__foot"
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
const GLYPH = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'octagon-alert'
};
const COLOR = {
  info: 'var(--blue-700)',
  success: 'var(--green-700)',
  warning: 'var(--gold-700)',
  danger: 'var(--red-700)'
};
function Toast({
  tone = 'info',
  title,
  children,
  onDismiss,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    className: cx('gb-toast', `gb-toast--${tone}`, className)
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: COLOR[tone],
      display: 'flex',
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: GLYPH[tone],
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "gb-toast__title"
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "gb-toast__msg"
  }, children)), onDismiss && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Tutup",
    size: "sm",
    onClick: onDismiss
  }));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Tooltip({
  label,
  side = 'top',
  children,
  className = '',
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cx('gb-tip', open && 'gb-tip--open', className),
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    className: cx('gb-tip__bubble', `gb-tip__bubble--${side}`)
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Checkbox({
  label,
  description,
  checked = false,
  disabled = false,
  onChange,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: cx('gb-choice', disabled && 'gb-choice--disabled', className),
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: cx('gb-choice__box', checked && 'gb-choice__box--on')
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13
  })), /*#__PURE__*/React.createElement("span", {
    className: "gb-choice__text"
  }, /*#__PURE__*/React.createElement("span", null, label), description && /*#__PURE__*/React.createElement("span", {
    className: "gb-choice__desc"
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Input({
  label,
  hint,
  error,
  required = false,
  icon,
  multiline = false,
  size = 'md',
  id,
  className = '',
  ...rest
}) {
  const fid = id || `gb-${Math.random().toString(36).slice(2, 8)}`;
  const Tag = multiline ? 'textarea' : 'input';
  const control = /*#__PURE__*/React.createElement(Tag, _extends({
    id: fid,
    "aria-invalid": error ? 'true' : undefined,
    className: cx('gb-control', 'gb-input', multiline && 'gb-input--textarea', size === 'sm' && 'gb-input--sm', icon && 'gb-input--withicon', error && 'gb-control--invalid', className)
  }, rest));
  return /*#__PURE__*/React.createElement("div", {
    className: "gb-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "gb-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "gb-field__req"
  }, "*")), icon ? /*#__PURE__*/React.createElement("span", {
    className: "gb-input__wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gb-input__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), control) : control, error ? /*#__PURE__*/React.createElement("span", {
    className: "gb-field__err"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "gb-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Radio({
  label,
  description,
  checked = false,
  disabled = false,
  name,
  value,
  onChange,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: cx('gb-choice', disabled && 'gb-choice--disabled', className),
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: onChange
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: cx('gb-choice__box', 'gb-choice__box--radio', checked && 'gb-choice__box--on')
  }, checked && /*#__PURE__*/React.createElement("span", {
    className: "gb-choice__dot"
  })), /*#__PURE__*/React.createElement("span", {
    className: "gb-choice__text"
  }, /*#__PURE__*/React.createElement("span", null, label), description && /*#__PURE__*/React.createElement("span", {
    className: "gb-choice__desc"
  }, description)));
}
function RadioGroup({
  label,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "gb-field",
    role: "radiogroup",
    "aria-label": typeof label === 'string' ? label : undefined
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "gb-field__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: inline ? 'row' : 'column',
      gap: inline ? 'var(--space-5)' : 'var(--space-3)',
      marginTop: 2
    }
  }, children));
}
Object.assign(__ds_scope, { Radio, RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Select({
  label,
  hint,
  error,
  required = false,
  options = [],
  placeholder,
  id,
  className = '',
  children,
  ...rest
}) {
  const fid = id || `gb-${Math.random().toString(36).slice(2, 8)}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "gb-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "gb-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "gb-field__req"
  }, "*")), /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    className: cx('gb-control', 'gb-select', error && 'gb-control--invalid', className)
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), children || options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), error ? /*#__PURE__*/React.createElement("span", {
    className: "gb-field__err"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "gb-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Switch({
  label,
  checked = false,
  disabled = false,
  onChange,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: cx('gb-switch', disabled && 'gb-switch--disabled', className),
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: cx('gb-switch__track', checked && 'gb-switch__track--on')
  }, /*#__PURE__*/React.createElement("span", {
    className: "gb-switch__knob"
  })), /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: onChange
  }, rest)), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');

/* Seal logo sits on a white chip (its line art is dark ink, drawn for light
   grounds) so it reads on the dark brand band; omit `logo` for text-only. */
function NavBar({
  tone = 'brand',
  logo,
  mark = 'Gembala Baik',
  kicker = 'Yayasan Pendidikan',
  items = [],
  activeId,
  onNavigate,
  actions,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    className: cx('gb-nav', tone === 'light' && 'gb-nav--light', className)
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "gb-nav__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "gb-nav__mark",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(items[0] && items[0].id);
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Lockup, {
    logo: logo,
    kicker: kicker,
    name: mark,
    size: "sm",
    chip: tone === 'brand',
    tone: tone === 'light' ? 'onlight' : 'inherit'
  })), /*#__PURE__*/React.createElement("nav", {
    className: "gb-nav__links"
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.id,
    href: it.href || '#',
    className: cx('gb-nav__link', it.id === activeId && 'gb-nav__link--active'),
    onClick: e => {
      if (!it.href) {
        e.preventDefault();
        onNavigate && onNavigate(it.id);
      }
    }
  }, it.label, it.external && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "external-link",
    size: 13
  }))), actions)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...a) => a.filter(Boolean).join(' ');
function Tabs({
  items = [],
  value,
  onChange,
  variant = 'underline',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    className: cx('gb-tabs', variant === 'pill' && 'gb-tabs--pill', className)
  }, rest), items.map(it => {
    const id = typeof it === 'string' ? it : it.id;
    const label = typeof it === 'string' ? it : it.label;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      role: "tab",
      type: "button",
      "aria-selected": id === value,
      className: cx('gb-tab', id === value && 'gb-tab--active'),
      onClick: () => onChange && onChange(id)
    }, label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/patterns/NewsCard.jsx
try { (() => {
const cx = (...a) => a.filter(Boolean).join(' ');
function NewsCard({
  title,
  date,
  category,
  excerpt,
  image,
  imageNote = 'Foto kegiatan',
  layout = 'stack',
  href,
  onOpen
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    pad: "none",
    className: cx('gb-news', layout === 'row' && 'gb-news--row'),
    href: href,
    interactive: !!onOpen,
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("div", {
    className: "gb-news__figure"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "gb-news__ph"
  }, imageNote), category && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "accent"
  }, category)), /*#__PURE__*/React.createElement("div", {
    className: "gb-news__body"
  }, date && /*#__PURE__*/React.createElement("span", {
    className: "gb-news__date"
  }, date), /*#__PURE__*/React.createElement("h3", {
    className: "gb-news__title"
  }, title), excerpt && /*#__PURE__*/React.createElement("p", {
    className: "gb-news__excerpt"
  }, excerpt)));
}
Object.assign(__ds_scope, { NewsCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/NewsCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/UnitCard.jsx
try { (() => {
function UnitCard({
  abbr,
  name,
  level,
  address,
  coordinator,
  accreditation,
  website,
  onOpen
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    pad: "none",
    className: "gb-unit",
    interactive: !!onOpen,
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("div", {
    className: "gb-unit__band"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gb-unit__abbr"
  }, abbr), level && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    style: {
      background: 'rgba(255,255,255,.18)',
      color: '#fff'
    }
  }, level)), /*#__PURE__*/React.createElement("div", {
    className: "gb-unit__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gb-unit__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "gb-unit__meta"
  }, address && /*#__PURE__*/React.createElement("span", {
    className: "gb-unit__row"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 14
  }), address), coordinator && /*#__PURE__*/React.createElement("span", {
    className: "gb-unit__row"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "user-round",
    size: 14
  }), coordinator), accreditation && /*#__PURE__*/React.createElement("span", {
    className: "gb-unit__row"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "award",
    size: 14
  }), accreditation)), website && /*#__PURE__*/React.createElement("div", {
    className: "gb-unit__foot"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "link",
    href: website,
    iconRight: "external-link"
  }, "Website"))));
}
Object.assign(__ds_scope, { UnitCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/UnitCard.jsx", error: String((e && e.message) || e) }); }

// tailwind/tailwind.config.js
try { (() => {
/* YPGB × Tailwind v3 preset (legacy projects; prefer tailwind/theme.css on v4).
   Usage: presets: [require('<ds>/tailwind/tailwind.config.js')]
   and import <ds>/styles.css in your global CSS after `@tailwind base;`.
   v3 naming differs from v4 for radius/shadow: v3 `rounded` = v4 `rounded-sm` (4px),
   v3 `shadow` = v4 `shadow-sm`, v3 `shadow-sm` = v4 `shadow-xs`. Status colors,
   breakpoints and the rest of radius/shadow stay Tailwind defaults. */
const v = n => `var(--${n})`;
module.exports = {
  theme: {
    extend: {
      colors: {
        wheat: {
          DEFAULT: v('wheat-gold'),
          50: v('gold-50'),
          100: v('gold-100'),
          300: v('gold-300'),
          500: v('gold-500'),
          600: v('gold-600'),
          700: v('gold-700')
        },
        umber: {
          DEFAULT: v('shepherd-umber'),
          50: v('sand-50'),
          100: v('sand-100'),
          200: v('sand-200'),
          400: v('sand-400'),
          600: v('sand-600'),
          800: v('sand-800'),
          900: v('sand-900'),
          950: v('sand-950')
        },
        seal: {
          DEFAULT: v('wax-seal'),
          50: v('clay-50'),
          100: v('clay-100'),
          400: v('clay-400'),
          600: v('clay-600'),
          700: v('clay-700'),
          900: v('clay-900')
        },
        marian: {
          DEFAULT: v('marian-blue'),
          50: v('blue-50'),
          100: v('blue-100'),
          300: v('blue-300'),
          600: v('blue-600'),
          700: v('blue-700'),
          800: v('blue-800'),
          900: v('blue-900')
        },
        parchment: v('parchment'),
        page: v('surface-page'),
        card: v('surface-card'),
        sunken: v('surface-sunken'),
        brand: {
          DEFAULT: v('surface-brand'),
          deep: v('surface-brand-deep'),
          soft: v('surface-brand-soft')
        },
        primary: {
          DEFAULT: v('surface-primary'),
          hover: v('surface-primary-hover')
        },
        'on-primary': v('text-on-primary'),
        accent: {
          DEFAULT: v('surface-accent'),
          soft: v('surface-accent-soft')
        },
        ink: {
          DEFAULT: v('text-body'),
          muted: v('text-muted'),
          subtle: v('text-subtle')
        },
        link: {
          DEFAULT: v('text-link'),
          hover: v('text-link-hover')
        },
        hairline: v('border-hairline'),
        quiet: v('border-quiet'),
        strong: v('border-strong'),
        focus: v('focus-ring')
      },
      fontFamily: {
        display: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Zilla Slab"', 'Georgia', 'serif'],
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'display-1': ['56px', {
          lineHeight: '1.08',
          letterSpacing: '-0.02em'
        }],
        'display-2': ['42px', {
          lineHeight: '1.08',
          letterSpacing: '-0.02em'
        }],
        h1: ['34px', {
          lineHeight: '1.25',
          letterSpacing: '-0.01em'
        }],
        h2: ['27px', {
          lineHeight: '1.25',
          letterSpacing: '-0.01em'
        }],
        h3: ['21px', {
          lineHeight: '1.25'
        }],
        lead: ['19px', {
          lineHeight: '1.5'
        }],
        base: ['17px', {
          lineHeight: '1.5'
        }],
        small: ['15px', {
          lineHeight: '1.5'
        }],
        caption: ['13px', {
          lineHeight: '1.4'
        }],
        overline: ['12px', {
          letterSpacing: '0.14em'
        }]
      },
      /* Brand spacing steps missing from v3's default scale (v4 generates these automatically) */
      spacing: {
        4.5: '18px',
        6.5: '26px',
        13: '52px',
        18: '72px',
        26: '104px'
      },
      maxWidth: {
        site: '1120px',
        prose: '720px'
      }
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "tailwind/tailwind.config.js", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
function App() {
  const {
    NavBar,
    Button
  } = window.GembalaBaikDesignSystem_674cc5;
  const [view, setView] = React.useState('home');
  const items = [{
    id: 'home',
    label: 'Home'
  }, {
    id: 'berita',
    label: 'Berita'
  }, {
    id: 'kontak',
    label: 'Kontak'
  }, {
    id: 'spp',
    label: 'SPP',
    href: 'https://spp.ypgb.or.id',
    external: true
  }];
  const Screen = view === 'berita' ? window.Berita : view === 'kontak' ? window.Kontak : window.Home;
  const Footer = window.Footer;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      background: 'var(--surface-page)',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    logo: "../../assets/logo.png",
    activeId: view,
    items: items,
    onNavigate: setView,
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "onbrand",
      size: "sm",
      onClick: () => setView('kontak')
    }, "Daftar")
  }), /*#__PURE__*/React.createElement(Screen, {
    onNavigate: setView
  }), /*#__PURE__*/React.createElement(Footer, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Berita.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Berita() {
  const {
    SectionHeading,
    NewsCard,
    Tag
  } = window.GembalaBaikDesignSystem_674cc5;
  const all = [{
    category: 'Kegiatan',
    date: '25 November 2025',
    title: 'Perayaan Hari Guru Nasional di Aula Yayasan',
    excerpt: 'Seluruh unit TK, SD, SMP dan SMA berkumpul untuk merayakan jasa para guru dengan misa syukur dan pentas seni.',
    imageNote: 'Foto perayaan Hari Guru'
  }, {
    category: 'Pengumuman',
    date: '2 Oktober 2025',
    title: 'Jadwal Pendaftaran Peserta Didik Baru 2026/2027',
    excerpt: 'Pendaftaran gelombang pertama dibuka mulai 10 Januari 2026 untuk seluruh jenjang.',
    imageNote: 'Foto pendaftaran siswa'
  }, {
    category: 'Prestasi',
    date: '14 September 2025',
    title: 'Siswa SMA Gembala Baik Raih Juara Olimpiade Sains',
    excerpt: 'Tiga siswa mewakili Kalimantan Barat di tingkat nasional pada Olimpiade Sains Nasional.',
    imageNote: 'Foto penyerahan medali'
  }, {
    category: 'Kegiatan',
    date: '30 Agustus 2025',
    title: 'Retret Guru dan Karyawan Yayasan di Singkawang',
    excerpt: 'Kegiatan tahunan untuk memperkuat semangat pelayanan seluruh tenaga pendidik.',
    imageNote: 'Foto retret guru'
  }, {
    category: 'Pengumuman',
    date: '12 Agustus 2025',
    title: 'Pembukaan Kelas Plus SMA Gembala Baik',
    excerpt: 'Program kelas dengan kurikulum internasional tambahan mulai tahun ajaran depan.',
    imageNote: 'Foto kelas plus'
  }, {
    category: 'Kegiatan',
    date: '17 Juli 2025',
    title: 'Masa Orientasi Peserta Didik Baru Berjalan Lancar',
    excerpt: 'Ratusan siswa baru dari empat jenjang mengikuti masa pengenalan lingkungan sekolah.',
    imageNote: 'Foto MOS'
  }];
  const cats = ['Semua', 'Kegiatan', 'Pengumuman', 'Prestasi'];
  const [cat, setCat] = React.useState('Semua');
  const list = cat === 'Semua' ? all : all.filter(n => n.category === cat);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--container-pad) var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Berita & Pengumuman",
    title: "Kabar Yayasan Gembala Baik",
    subtitle: "Kegiatan, pengumuman, dan prestasi dari seluruh unit sekolah."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-5)',
      flexWrap: 'wrap'
    }
  }, cats.map(c => /*#__PURE__*/React.createElement(Tag, {
    key: c,
    selected: c === cat,
    onClick: () => setCat(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-6)'
    }
  }, list.map(n => /*#__PURE__*/React.createElement(NewsCard, _extends({
    key: n.title,
    layout: "row"
  }, n)))));
}
window.Berita = Berita;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Berita.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
function Footer() {
  const {
    Lockup
  } = window.GembalaBaikDesignSystem_674cc5;
  const cols = [{
    h: 'Unit Sekolah',
    items: ['TK Gembala Baik', 'SD Gembala Baik I & II', 'SMP Gembala Baik', 'SMA Gembala Baik']
  }, {
    h: 'Yayasan',
    items: ['Tentang Kami', 'Berita', 'Karir', 'Kontak']
  }, {
    h: 'Layanan',
    items: ['Portal SPP', 'Pendaftaran Siswa Baru', 'Kalender Akademik']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-brand-deep)',
      color: 'rgba(255,255,255,.82)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--container-pad) var(--space-6)',
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lockup, {
    logo: "../../assets/logo.png",
    size: "md",
    chip: true,
    style: {
      color: 'var(--text-inverse)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 'var(--size-small)',
      lineHeight: 'var(--lh-loose)',
      maxWidth: 280
    }
  }, "Melayani pendidikan Katolik di Pontianak sejak 1973, dari jenjang TK hingga SMA.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--size-caption)',
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      opacity: .6,
      marginBottom: 'var(--space-3)'
    }
  }, c.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      fontSize: 'var(--size-small)'
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      color: 'rgba(255,255,255,.85)',
      textDecoration: 'none'
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.12)',
      padding: 'var(--space-4) var(--container-pad)',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      fontSize: 'var(--size-caption)',
      opacity: .55,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Yayasan Pendidikan Gembala Baik"), /*#__PURE__*/React.createElement("span", null, "Jl. A. Yani, Pontianak, Kalimantan Barat")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Home({
  onNavigate
}) {
  const {
    SectionHeading,
    Button,
    Card,
    Tabs,
    Icon,
    UnitCard,
    NewsCard
  } = window.GembalaBaikDesignSystem_674cc5;
  const [tab, setTab] = React.useState('visi');
  const units = [{
    abbr: 'TK GB',
    level: 'TK',
    name: 'Taman Kanak-Kanak Gembala Baik',
    address: 'Jl. A. Yani, Pontianak',
    accreditation: 'Terakreditasi A'
  }, {
    abbr: 'SD GB I',
    level: 'SD',
    name: 'Sekolah Dasar Gembala Baik I',
    address: 'Jl. Merdeka, Pontianak',
    accreditation: 'Terakreditasi A'
  }, {
    abbr: 'SMP GB',
    level: 'SMP',
    name: 'Sekolah Menengah Pertama Gembala Baik',
    address: 'Jl. A. Yani, Pontianak',
    accreditation: 'Terakreditasi A'
  }, {
    abbr: 'SMA GB',
    level: 'SMA',
    name: 'Sekolah Menengah Atas Gembala Baik',
    address: 'Jl. A. Yani, Pontianak',
    accreditation: 'Terakreditasi A'
  }];
  const news = [{
    category: 'Kegiatan',
    date: '25 November 2025',
    title: 'Perayaan Hari Guru Nasional di Aula Yayasan',
    excerpt: 'Seluruh unit TK, SD, SMP dan SMA berkumpul untuk merayakan jasa para guru.',
    imageNote: 'Foto perayaan Hari Guru'
  }, {
    category: 'Pengumuman',
    date: '2 Oktober 2025',
    title: 'Jadwal Pendaftaran Peserta Didik Baru 2026/2027',
    excerpt: 'Pendaftaran gelombang pertama dibuka mulai 10 Januari 2026.',
    imageNote: 'Foto pendaftaran siswa'
  }, {
    category: 'Prestasi',
    date: '14 September 2025',
    title: 'Siswa SMA Gembala Baik Raih Juara Olimpiade Sains',
    excerpt: 'Tiga siswa mewakili Kalimantan Barat di tingkat nasional.',
    imageNote: 'Foto penyerahan medali'
  }];
  const tabContent = {
    visi: 'Menjadi lembaga pendidikan Katolik yang unggul dalam iman, ilmu, dan pelayanan kasih di Kalimantan Barat.',
    misi: 'Menyelenggarakan pendidikan yang membentuk pribadi berkarakter, cerdas, dan berbelas kasih seperti Gembala yang Baik, dari jenjang TK hingga SMA.',
    sejarah: 'Yayasan Pendidikan Gembala Baik didirikan pada tahun 1973 oleh para Bruder MTB dan mitra awam di Pontianak, sebagai wujud karya pendidikan sosial Gereja Katolik.'
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand)',
      color: 'var(--text-inverse)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-9) var(--container-pad)',
      display: 'grid',
      gridTemplateColumns: '1.1fr .9fr',
      gap: 'var(--space-7)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--size-overline)',
      fontWeight: 700,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--gold-300)'
    }
  }, "Sejak 1973 \xB7 Pontianak"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      color: 'var(--text-inverse)',
      fontSize: 'var(--size-display-2)',
      fontWeight: 'var(--weight-bold)',
      textTransform: 'uppercase',
      lineHeight: 'var(--lh-tight)',
      marginTop: 'var(--space-3)',
      letterSpacing: 'var(--ls-display)',
      textWrap: 'balance'
    }
  }, "Melayani dengan kasih, seperti Gembala yang Baik"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,.82)',
      fontSize: 'var(--size-lead)',
      lineHeight: 'var(--lh-loose)',
      marginTop: 'var(--space-4)',
      maxWidth: 480
    }
  }, "Empat jenjang pendidikan Katolik di Pontianak \u2014 dari Taman Kanak-Kanak hingga Sekolah Menengah Atas \u2014 dibangun atas iman, ilmu, dan pelayanan."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    iconRight: "arrow-right",
    onClick: () => onNavigate('kontak')
  }, "Daftar Sekarang"), /*#__PURE__*/React.createElement(Button, {
    variant: "onbrand",
    size: "lg",
    onClick: () => onNavigate('berita')
  }, "Lihat Berita"))), /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/3',
      background: 'rgba(255,255,255,.08)',
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: 'var(--radius-2xl)',
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(255,255,255,.55)',
      fontSize: 'var(--size-small)',
      textAlign: 'center',
      padding: 'var(--space-5)'
    }
  }, "Foto gedung utama Yayasan / suasana kampus"))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-gap) var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Tentang Kami",
    title: "Visi, Misi & Sejarah",
    align: "left"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      id: 'visi',
      label: 'Visi'
    }, {
      id: 'misi',
      label: 'Misi'
    }, {
      id: 'sejarah',
      label: 'Sejarah'
    }],
    value: tab,
    onChange: setTab,
    style: {
      flexDirection: 'row',
      borderBottom: 'none',
      gap: 'var(--space-3)',
      alignItems: 'flex-start'
    }
  }), /*#__PURE__*/React.createElement(Card, {
    tone: "warm",
    rule: true,
    pad: "lg"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--size-lead)',
      lineHeight: 'var(--lh-loose)',
      color: 'var(--text-body)',
      margin: 0
    }
  }, tabContent[tab])))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-warm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-gap) var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Unit Sekolah",
    title: "Empat jenjang, satu yayasan",
    subtitle: "Dari Taman Kanak-Kanak hingga Sekolah Menengah Atas, seluruh unit berada dalam satu naungan Yayasan."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--grid-gutter)'
    }
  }, units.map(u => /*#__PURE__*/React.createElement(UnitCard, _extends({
    key: u.abbr
  }, u, {
    website: "#"
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-gap) var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Berita",
    title: "Kabar terbaru",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "link",
      iconRight: "arrow-right",
      onClick: () => onNavigate('berita')
    }, "Lihat Semua")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--grid-gutter)'
    }
  }, news.map(n => /*#__PURE__*/React.createElement(NewsCard, _extends({
    key: n.title
  }, n))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand-deep)',
      color: 'var(--text-inverse)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-narrow)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--container-pad)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart-handshake",
    size: 32,
    style: {
      color: 'var(--gold-500)'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      color: 'var(--text-inverse)',
      fontSize: 'var(--size-h1)',
      marginTop: 'var(--space-3)',
      textWrap: 'balance'
    }
  }, "Bergabunglah dengan keluarga Gembala Baik"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,.78)',
      marginTop: 'var(--space-3)',
      fontSize: 'var(--size-lead)'
    }
  }, "Pendaftaran peserta didik baru tahun ajaran 2026/2027 telah dibuka."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onNavigate('kontak')
  }, "Hubungi Sekretariat")))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Kontak.jsx
try { (() => {
function Kontak() {
  const {
    SectionHeading,
    Card,
    Input,
    Select,
    Checkbox,
    Button,
    Icon,
    Toast
  } = window.GembalaBaikDesignSystem_674cc5;
  const [agree, setAgree] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const submit = e => {
    e.preventDefault();
    setSent(true);
  };
  const info = [{
    icon: 'map-pin',
    label: 'Alamat',
    value: 'Jl. A. Yani, Pontianak, Kalimantan Barat'
  }, {
    icon: 'phone',
    label: 'Telepon',
    value: '(0561) 700-000'
  }, {
    icon: 'mail',
    label: 'Email',
    value: 'sekretariat@ypgb.or.id'
  }, {
    icon: 'calendar-days',
    label: 'Jam Layanan',
    value: 'Senin–Jumat, 08.00–15.00 WIB'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--container-pad) var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    overline: "Kontak",
    title: "Hubungi Sekretariat Yayasan",
    subtitle: "Pertanyaan seputar pendaftaran, administrasi, atau kerja sama dapat disampaikan melalui formulir berikut."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      display: 'grid',
      gridTemplateColumns: '1fr 1.3fr',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, info.map(i => /*#__PURE__*/React.createElement(Card, {
    key: i.label,
    pad: "md",
    tone: "warm",
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-accent)',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: i.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--size-caption)',
      fontWeight: 700,
      color: 'var(--text-heading)',
      textTransform: 'uppercase',
      letterSpacing: '.06em'
    }
  }, i.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--size-small)',
      color: 'var(--text-subtle)',
      marginTop: 2
    }
  }, i.value))))), /*#__PURE__*/React.createElement(Card, {
    pad: "lg"
  }, sent ? /*#__PURE__*/React.createElement(Toast, {
    tone: "success",
    title: "Pesan terkirim",
    onDismiss: () => setSent(false)
  }, "Sekretariat akan membalas melalui email pada hari kerja berikutnya.") : /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nama Lengkap",
    required: true,
    placeholder: "Nama sesuai identitas"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Nomor Telepon",
    required: true,
    placeholder: "08xx-xxxx-xxxx"
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    required: true,
    placeholder: "nama@email.com"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Unit yang Dituju",
    required: true,
    placeholder: "Pilih unit",
    options: ['TK Gembala Baik', 'SD Gembala Baik I', 'SD Gembala Baik II', 'SMP Gembala Baik', 'SMA Gembala Baik']
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Pesan",
    multiline: true,
    required: true,
    placeholder: "Tuliskan pertanyaan atau keperluan Anda"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Saya menyetujui data ini digunakan untuk keperluan korespondensi Yayasan",
    checked: agree,
    onChange: () => setAgree(!agree)
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    disabled: !agree,
    iconRight: "arrow-right"
  }, "Kirim Pesan")))));
}
window.Kontak = Kontak;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Kontak.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.LUCIDE_VERSION = __ds_scope.LUCIDE_VERSION;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Lockup = __ds_scope.Lockup;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.NewsCard = __ds_scope.NewsCard;

__ds_ns.UnitCard = __ds_scope.UnitCard;

})();
