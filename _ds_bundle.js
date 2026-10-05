/* @ds-bundle: {"format":4,"namespace":"MeridianDesignSystem_962c43","components":[{"name":"DateRangePicker","sourcePath":"components/composite/DateRangePicker.jsx"},{"name":"DateTimePicker","sourcePath":"components/composite/DateTimePicker.jsx"},{"name":"FileUpload","sourcePath":"components/composite/FileUpload.jsx"},{"name":"ScopePicker","sourcePath":"components/composite/ScopePicker.jsx"},{"name":"SearchField","sourcePath":"components/composite/SearchField.jsx"},{"name":"SortableCollection","sourcePath":"components/composite/SortableCollection.jsx"},{"name":"SplitButton","sourcePath":"components/composite/SplitButton.jsx"},{"name":"Toolbar","sourcePath":"components/composite/Toolbar.jsx"},{"name":"AccordionItem","sourcePath":"components/core/Accordion.jsx"},{"name":"Accordion","sourcePath":"components/core/Accordion.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"AvatarGroup","sourcePath":"components/core/AvatarGroup.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"ButtonGroup","sourcePath":"components/core/ButtonGroup.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"ChipGroup","sourcePath":"components/core/ChipGroup.jsx"},{"name":"Fieldset","sourcePath":"components/core/Fieldset.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Link","sourcePath":"components/core/Link.jsx"},{"name":"SegmentedControl","sourcePath":"components/core/SegmentedControl.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"TagList","sourcePath":"components/core/Tag.jsx"},{"name":"DescriptionList","sourcePath":"components/data/DescriptionList.jsx"},{"name":"EmptyState","sourcePath":"components/data/EmptyState.jsx"},{"name":"List","sourcePath":"components/data/List.jsx"},{"name":"ListItem","sourcePath":"components/data/List.jsx"},{"name":"Pagination","sourcePath":"components/data/Pagination.jsx"},{"name":"Skeleton","sourcePath":"components/data/Skeleton.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Tree","sourcePath":"components/data/Tree.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Drawer","sourcePath":"components/feedback/Drawer.jsx"},{"name":"Popover","sourcePath":"components/feedback/Popover.jsx"},{"name":"Progress","sourcePath":"components/feedback/Progress.jsx"},{"name":"Snackbar","sourcePath":"components/feedback/Snackbar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Toaster","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Autocomplete","sourcePath":"components/forms/Autocomplete.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"CheckboxGroup","sourcePath":"components/forms/CheckboxGroup.jsx"},{"name":"Combobox","sourcePath":"components/forms/Combobox.jsx"},{"name":"DatePicker","sourcePath":"components/forms/DatePicker.jsx"},{"name":"FieldContext","sourcePath":"components/forms/Field.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"FileDropzone","sourcePath":"components/forms/FileDropzone.jsx"},{"name":"FileItem","sourcePath":"components/forms/FileItem.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"MultiCombobox","sourcePath":"components/forms/MultiCombobox.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"RangeSlider","sourcePath":"components/forms/RangeSlider.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"TimeField","sourcePath":"components/forms/TimeField.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"MenuList","sourcePath":"components/navigation/Menu.jsx"},{"name":"Menu","sourcePath":"components/navigation/Menu.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"TabPanel","sourcePath":"components/navigation/Tabs.jsx"},{"name":"AspectRatio","sourcePath":"components/primitives/AspectRatio.jsx"},{"name":"Box","sourcePath":"components/primitives/Box.jsx"},{"name":"Container","sourcePath":"components/primitives/Container.jsx"},{"name":"Divider","sourcePath":"components/primitives/Divider.jsx"},{"name":"Grid","sourcePath":"components/primitives/Grid.jsx"},{"name":"GridItem","sourcePath":"components/primitives/Grid.jsx"},{"name":"Heading","sourcePath":"components/primitives/Heading.jsx"},{"name":"Image","sourcePath":"components/primitives/Image.jsx"},{"name":"Spacer","sourcePath":"components/primitives/Spacer.jsx"},{"name":"Stack","sourcePath":"components/primitives/Stack.jsx"},{"name":"Surface","sourcePath":"components/primitives/Surface.jsx"},{"name":"Text","sourcePath":"components/primitives/Text.jsx"},{"name":"BarChart","sourcePath":"components/data/BarChart.jsx"},{"name":"LineChart","sourcePath":"components/data/LineChart.jsx"},{"name":"AreaChart","sourcePath":"components/data/AreaChart.jsx"},{"name":"ScatterPlot","sourcePath":"components/data/ScatterPlot.jsx"},{"name":"DistributionPlot","sourcePath":"components/data/DistributionPlot.jsx"},{"name":"Heatmap","sourcePath":"components/data/Heatmap.jsx"},{"name":"PieChart","sourcePath":"components/data/PieChart.jsx"},{"name":"Treemap","sourcePath":"components/data/Treemap.jsx"},{"name":"TreeDiagram","sourcePath":"components/data/TreeDiagram.jsx"},{"name":"SankeyDiagram","sourcePath":"components/data/SankeyDiagram.jsx"},{"name":"NetworkDiagram","sourcePath":"components/data/NetworkDiagram.jsx"},{"name":"GeoMap","sourcePath":"components/data/GeoMap.jsx"},{"name":"RangeChart","sourcePath":"components/data/RangeChart.jsx"},{"name":"GanttChart","sourcePath":"components/data/GanttChart.jsx"},{"name":"ParallelCoordinates","sourcePath":"components/data/ParallelCoordinates.jsx"}]} */
(() => {
var __meridianBrowserBundle = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // react-global:react
  var require_react = __commonJS({
    "react-global:react"(exports, module) {
      module.exports = globalThis.React;
    }
  });

  // browser-entry.jsx
  var browser_entry_exports = {};
  __export(browser_entry_exports, {
    Accordion: () => Accordion,
    AccordionItem: () => AccordionItem,
    Alert: () => Alert,
    AreaChart: () => AreaChart,
    AspectRatio: () => AspectRatio,
    Autocomplete: () => Autocomplete,
    Avatar: () => Avatar,
    AvatarGroup: () => AvatarGroup,
    Badge: () => Badge,
    BarChart: () => BarChart,
    Box: () => Box,
    Breadcrumb: () => Breadcrumb,
    Button: () => Button,
    ButtonGroup: () => ButtonGroup,
    Card: () => Card,
    Checkbox: () => Checkbox,
    CheckboxGroup: () => CheckboxGroup,
    Chip: () => Chip,
    ChipGroup: () => ChipGroup,
    Combobox: () => Combobox,
    Container: () => Container,
    DatePicker: () => DatePicker,
    DateRangePicker: () => DateRangePicker,
    DateTimePicker: () => DateTimePicker,
    DescriptionList: () => DescriptionList,
    Dialog: () => Dialog,
    DistributionPlot: () => DistributionPlot,
    Divider: () => Divider,
    Drawer: () => Drawer,
    EmptyState: () => EmptyState,
    Field: () => Field,
    FieldContext: () => FieldContext,
    Fieldset: () => Fieldset,
    FileDropzone: () => FileDropzone,
    FileItem: () => FileItem,
    FileUpload: () => FileUpload,
    GanttChart: () => GanttChart,
    GeoMap: () => GeoMap,
    Grid: () => Grid,
    GridItem: () => GridItem,
    Heading: () => Heading,
    Heatmap: () => Heatmap,
    Icon: () => Icon,
    IconButton: () => IconButton,
    Image: () => Image2,
    Input: () => Input,
    LineChart: () => LineChart,
    Link: () => Link,
    List: () => List,
    ListItem: () => ListItem,
    Menu: () => Menu,
    MenuList: () => MenuList,
    MultiCombobox: () => MultiCombobox,
    NetworkDiagram: () => NetworkDiagram,
    Pagination: () => Pagination,
    ParallelCoordinates: () => ParallelCoordinates,
    PieChart: () => PieChart,
    Popover: () => Popover,
    Progress: () => Progress,
    Radio: () => Radio,
    RadioGroup: () => RadioGroup,
    RangeChart: () => RangeChart,
    RangeSlider: () => RangeSlider,
    SankeyDiagram: () => SankeyDiagram,
    ScatterPlot: () => ScatterPlot,
    ScopePicker: () => ScopePicker,
    SearchField: () => SearchField,
    SegmentedControl: () => SegmentedControl,
    Select: () => Select,
    Skeleton: () => Skeleton,
    Slider: () => Slider,
    Snackbar: () => Snackbar,
    SortableCollection: () => SortableCollection,
    Spacer: () => Spacer,
    SplitButton: () => SplitButton,
    Stack: () => Stack,
    Surface: () => Surface,
    Switch: () => Switch,
    TabPanel: () => TabPanel,
    Table: () => Table,
    Tabs: () => Tabs,
    Tag: () => Tag,
    TagList: () => TagList,
    Text: () => Text,
    Textarea: () => Textarea,
    TimeField: () => TimeField,
    Toast: () => Toast,
    Toaster: () => Toaster,
    Toolbar: () => Toolbar,
    Tooltip: () => Tooltip,
    Tree: () => Tree,
    TreeDiagram: () => TreeDiagram,
    Treemap: () => Treemap
  });

  // components/composite/DateRangePicker.jsx
  var import_react9 = __toESM(require_react(), 1);

  // components/primitives/Box.jsx
  var import_react = __toESM(require_react(), 1);

  // components/primitives/scale.js
  var warned = /* @__PURE__ */ new Set();
  function warnOnce(key, msg) {
    if (warned.has(key)) return;
    warned.add(key);
    console.warn("[Meridian] " + msg);
  }
  var SPACE = ["0", "px", "half", "1", "2", "3", "4", "5", "6", "7", "8", "10", "12", "16", "20", "24"];
  function sp(v) {
    if (v == null || v === false) return void 0;
    const k = String(v);
    return SPACE.indexOf(k) > -1 ? "var(--space-" + k + ")" : k;
  }
  var COLOR_LITERAL = /^(#|rgb|hsl|oklch|var\(|transparent|currentColor|inherit|none)/;
  var COLOR_FAMILY = /^(text|surface|background|border|action|status|overlay|viz|focus)-/;
  function col(v) {
    if (!v) return void 0;
    if (COLOR_LITERAL.test(v)) return v;
    if (!COLOR_FAMILY.test(v)) {
      warnOnce("col:" + v, `primitives: "${v}" is not a semantic colour token. Expected one of the text-/surface-/background-/border-/action-/status-/overlay-/viz-/focus- families, a CSS colour, or a var(). An unknown name compiles to var(--${v}) and silently resolves to nothing.`);
    }
    return "var(--" + v + ")";
  }
  var RADII = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "pill"];
  function rad(v) {
    if (v == null || v === false) return void 0;
    if (typeof v === "number") return v;
    if (RADII.indexOf(v) > -1) return "var(--radius-" + v + ")";
    if (!/^(var\(|calc\()/.test(v) && !/^\d/.test(v)) {
      warnOnce("rad:" + v, `primitives: radius "${v}" is not on the scale (${RADII.join(" / ")}).`);
    }
    return v;
  }
  function shadow(v) {
    if (v == null || v === false) return void 0;
    if (typeof v === "number") {
      if (v < 0 || v > 5 || !Number.isInteger(v)) {
        warnOnce("shadow:" + v, `primitives: elevation ${v} is off the ladder \u2014 it runs 0 to 5.`);
      }
      return "var(--elevation-" + v + ")";
    }
    return col(v);
  }
  var BORDER_TONES = ["default", "subtle", "strong", "hairline", "control", "focus", "inverse", "critical", "warning", "success", "info"];
  function hairline(v) {
    if (!v || v === "none") return void 0;
    const tone = v === true ? "default" : v;
    if (BORDER_TONES.indexOf(tone) === -1) {
      warnOnce("border:" + tone, `primitives: border tone "${tone}" is not a --border-* semantic. Expected one of ${BORDER_TONES.join(" / ")}.`);
    }
    return "var(--border-width) solid var(--border-" + tone + ")";
  }
  var textSizes = ["2xs", "xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];
  function fontSize(v) {
    if (!v) return void 0;
    if (textSizes.indexOf(v) > -1) return "var(--text-" + v + ")";
    if (/^display-(sm|md|lg|xl)$/.test(v)) return "var(--" + v + ")";
    if (!/^(var\(|calc\()/.test(v) && !/^\d/.test(v)) {
      warnOnce("size:" + v, `primitives: text size "${v}" is not on the scale (${textSizes.join(" / ")} or display-sm|md|lg|xl).`);
    }
    return v;
  }
  function deprecatedMargin(props) {
    const used = ["m", "mx", "my", "mt", "mr", "mb", "ml"].filter((k) => props[k] != null);
    if (!used.length) return;
    warnOnce("margin:" + used.join(","), `Box: margin props (${used.join(", ")}) are deprecated. Space siblings with the parent's gap \u2014 Stack gap, Grid gap, or Box gap \u2014 not with margins on the children. Element margins collapse unpredictably, and they break when a sibling is reordered or deleted, which is exactly what layout tooling does.`);
  }

  // components/primitives/Box.jsx
  function Box({
    as: Tag2 = "div",
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    display,
    background,
    radius,
    border,
    borderTop,
    borderBottom,
    elevation,
    overflow,
    position,
    flex,
    grow,
    shrink,
    basis,
    align,
    justify,
    gap,
    children,
    style,
    ...rest
  }) {
    deprecatedMargin({ m, mx, my, mt, mr, mb, ml });
    return /* @__PURE__ */ import_react.default.createElement(
      Tag2,
      {
        ...rest,
        style: {
          display,
          boxSizing: "border-box",
          padding: sp(p),
          paddingLeft: sp(pl != null ? pl : px),
          paddingRight: sp(pr != null ? pr : px),
          paddingTop: sp(pt != null ? pt : py),
          paddingBottom: sp(pb != null ? pb : py),
          margin: sp(m),
          marginLeft: sp(ml != null ? ml : mx),
          marginRight: sp(mr != null ? mr : mx),
          marginTop: sp(mt != null ? mt : my),
          marginBottom: sp(mb != null ? mb : my),
          width,
          height,
          minWidth,
          maxWidth,
          minHeight,
          maxHeight,
          background: col(background),
          borderRadius: rad(radius),
          border: hairline(border),
          borderTop: hairline(borderTop),
          borderBottom: hairline(borderBottom),
          boxShadow: shadow(elevation),
          overflow,
          position,
          flex: flex != null ? flex : void 0,
          flexGrow: grow != null ? Number(grow) : void 0,
          flexShrink: shrink != null ? Number(shrink) : void 0,
          flexBasis: basis,
          alignItems: align,
          justifyContent: justify,
          gap: sp(gap),
          ...style
        }
      },
      children
    );
  }

  // components/primitives/Text.jsx
  var import_react2 = __toESM(require_react(), 1);
  var WEIGHTS = { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 };
  var LEADING = { none: 1, tight: 1.2, snug: 1.35, normal: 1.5, relaxed: 1.65 };
  var MEASURE = { prose: "var(--measure-prose)", narrow: "var(--measure-narrow)", hint: "var(--measure-hint)" };
  function Text({
    as: Tag2 = "span",
    size = "base",
    weight = "regular",
    tone = "primary",
    family = "sans",
    leading = "normal",
    align,
    caps = false,
    numeric = false,
    measure,
    truncate = false,
    block = false,
    children,
    style,
    ...rest
  }) {
    const lines = typeof truncate === "number" ? truncate : truncate ? 1 : 0;
    const clamp3 = lines > 1 ? { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" } : lines === 1 ? { display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } : null;
    return /* @__PURE__ */ import_react2.default.createElement(
      Tag2,
      {
        ...rest,
        style: {
          margin: 0,
          display: block && !clamp3 ? "block" : void 0,
          fontFamily: family === "mono" ? "var(--font-mono)" : "var(--font-sans)",
          fontSize: caps ? "var(--text-2xs)" : fontSize(size),
          fontWeight: WEIGHTS[weight] || weight,
          lineHeight: LEADING[leading] || leading,
          letterSpacing: caps ? "var(--tracking-caps)" : family === "mono" ? "var(--tracking-mono)" : "var(--tracking-body)",
          textTransform: caps ? "uppercase" : void 0,
          color: col("text-" + tone),
          textAlign: align,
          maxWidth: MEASURE[measure] || measure,
          fontVariantNumeric: numeric ? "tabular-nums" : void 0,
          textWrap: measure ? "pretty" : void 0,
          ...clamp3,
          ...style
        }
      },
      children
    );
  }

  // components/core/Icon.jsx
  var import_react3 = __toESM(require_react(), 1);
  var CDN = "https://unpkg.com/lucide-static@0.469.0/icons/";
  var basePath = CDN;
  var warnedMissing = false;
  var STEPS = {
    mark: "var(--icon-mark)",
    xs: "var(--icon-xs)",
    sm: "var(--icon-sm)",
    md: "var(--icon-md)",
    lg: "var(--icon-lg)"
  };
  function step(v) {
    if (typeof v === "number") return v;
    if (STEPS[v]) return STEPS[v];
    if (/^\d/.test(String(v))) return v;
    console.warn(
      `[Meridian] Icon: unknown size "${v}" \u2014 falling back to 16px. Valid steps: mark (11) \xB7 xs (14) \xB7 sm (16) \xB7 md (20) \xB7 lg (22), a number, or a CSS length.`
    );
    return 16;
  }
  var resolved = /* @__PURE__ */ new Map();
  function probe(url) {
    const pending = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve("ok");
      img.onerror = () => resolve("missing");
      img.src = url;
    }).then((state) => {
      resolved.set(url, state);
      if (state === "missing") {
        console.warn(
          `[Meridian] Icon: no glyph at ${url} \u2014 rendering nothing. Check the name against Lucide 0.469.0 (several were renamed: alert-triangle \u2192 triangle-alert, more-horizontal \u2192 ellipsis).`
        );
      }
      return state;
    });
    resolved.set(url, pending);
    return pending;
  }
  function Icon({ name, size = 16, style, title, ...rest }) {
    const url = basePath + name + ".svg";
    const [state, setState] = import_react3.default.useState(() => {
      const known = resolved.get(url);
      if (typeof known === "string") return known;
      return typeof window === "undefined" || typeof Image === "undefined" ? "ok" : "pending";
    });
    import_react3.default.useEffect(() => {
      const known = resolved.get(url);
      if (typeof known === "string") {
        setState(known);
        return void 0;
      }
      let live = true;
      (known || probe(url)).then((s) => {
        if (live) setState(s);
        if (s === "missing" && !warnedMissing) {
          warnedMissing = true;
          console.warn(`[Meridian] Icon: no glyph resolved from ${basePath} (first failure: "${name}"). Glyphs load from the pinned Lucide CDN by default, which fails offline and under a strict img-src CSP. Vendor them and call Icon.setBasePath('/assets/icons') at startup \u2014 see assets/icons/README.md. Every icon renders as an empty box until then.`);
        }
      });
      return () => {
        live = false;
      };
    }, [url, name]);
    const painted = state === "ok";
    const mask = painted ? `url("${url}")` : void 0;
    return /* @__PURE__ */ import_react3.default.createElement(
      "span",
      {
        role: title ? "img" : "presentation",
        "aria-label": title,
        "aria-hidden": title ? void 0 : "true",
        "data-icon": name,
        "data-icon-missing": state === "missing" ? "" : void 0,
        ...rest,
        style: {
          display: "inline-block",
          flex: "0 0 auto",
          width: step(size),
          height: step(size),
          backgroundColor: painted ? "currentColor" : "transparent",
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          ...style
        }
      }
    );
  }
  Icon.setBasePath = function setBasePath(path) {
    basePath = /\/$/.test(path) ? path : path + "/";
    warnedMissing = false;
  };
  Icon.getBasePath = function getBasePath() {
    return basePath;
  };

  // components/forms/DatePicker.jsx
  var import_react8 = __toESM(require_react(), 1);

  // components/core/IconButton.jsx
  var import_react4 = __toESM(require_react(), 1);
  var SIZES = {
    sm: { box: "var(--control-h-sm)", icon: 14 },
    md: { box: "var(--control-h-md)", icon: 16 },
    lg: { box: "var(--control-h-lg)", icon: 18 }
  };
  var IconButton = import_react4.default.forwardRef(function IconButton2({
    icon,
    label,
    variant = "ghost",
    size = "md",
    selected = false,
    disabled = false,
    style,
    ...rest
  }, ref) {
    const [hover, setHover] = import_react4.default.useState(false);
    const [down, setDown] = import_react4.default.useState(false);
    const [focus, setFocus] = import_react4.default.useState(false);
    const s = SIZES[size] || SIZES.md;
    const solid = variant === "solid";
    const outline = variant === "outline";
    const danger = variant === "danger";
    let bg = "transparent";
    let fg = "var(--icon-button-foreground)";
    let bc = outline ? "var(--icon-button-border)" : "transparent";
    if (danger) {
      bg = down ? "var(--icon-button-critical-background-active)" : hover ? "var(--icon-button-critical-background-hover)" : "var(--icon-button-critical-background)";
      fg = "var(--icon-button-critical-foreground)";
    } else if (solid) {
      bg = down ? "var(--icon-button-solid-background-active)" : hover ? "var(--icon-button-solid-background-hover)" : "var(--icon-button-solid-background)";
      fg = "var(--icon-button-solid-foreground)";
    } else if (selected) {
      bg = "var(--icon-button-background-selected)";
      fg = "var(--icon-button-foreground-selected)";
    } else if (down) {
      bg = "var(--icon-button-background-active)";
      fg = "var(--icon-button-foreground-hover)";
    } else if (hover) {
      bg = "var(--icon-button-background-hover)";
      fg = "var(--icon-button-foreground-hover)";
    }
    if (disabled) {
      bg = "transparent";
      fg = "var(--icon-button-foreground-disabled)";
    }
    return /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        ref,
        type: "button",
        "aria-label": label,
        title: label,
        "aria-pressed": selected || void 0,
        disabled,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => {
          setHover(false);
          setDown(false);
        },
        onMouseDown: () => setDown(true),
        onMouseUp: () => setDown(false),
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
        ...rest,
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: s.box,
          height: s.box,
          padding: 0,
          color: fg,
          background: bg,
          border: `var(--border-width) solid ${disabled && outline ? "var(--icon-button-border-disabled)" : bc}`,
          borderRadius: "var(--icon-button-radius)",
          boxShadow: focus && !disabled ? "var(--button-focus-ring)" : solid || danger ? "var(--button-primary-shadow)" : "none",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "var(--transition-control)",
          ...style
        }
      },
      /* @__PURE__ */ import_react4.default.createElement(Icon, { name: icon, size: s.icon })
    );
  });

  // components/core/Button.jsx
  var import_react5 = __toESM(require_react(), 1);
  var SIZES2 = {
    sm: { h: "var(--control-h-sm)", px: "var(--control-px-sm)", fs: "var(--text-xs)", icon: 14, gap: 5 },
    md: { h: "var(--control-h-md)", px: "var(--control-px-md)", fs: "var(--text-sm)", icon: 16, gap: 6 },
    lg: { h: "var(--control-h-lg)", px: "var(--control-px-lg)", fs: "var(--text-base)", icon: 16, gap: 7 }
  };
  function palette(variant, state) {
    const on = (rest, hover, active) => state === "active" ? active : state === "hover" ? hover : rest;
    switch (variant) {
      case "secondary":
        return {
          bg: on("var(--button-secondary-background)", "var(--button-secondary-background-hover)", "var(--button-secondary-background-active)"),
          fg: "var(--button-secondary-foreground)",
          bc: on("var(--button-secondary-border)", "var(--button-secondary-border-hover)", "var(--button-secondary-border-hover)"),
          sh: "var(--button-primary-shadow)"
        };
      case "ghost":
        return {
          bg: on("transparent", "var(--button-ghost-background-hover)", "var(--button-ghost-background-active)"),
          fg: state === "rest" ? "var(--button-ghost-foreground)" : "var(--button-ghost-foreground-hover)",
          bc: "transparent",
          sh: "none"
        };
      case "danger":
        return {
          bg: on("var(--button-critical-background)", "var(--button-critical-background-hover)", "var(--button-critical-background-active)"),
          fg: "var(--button-critical-foreground)",
          bc: "transparent",
          sh: "var(--button-primary-shadow)"
        };
      case "link":
        return {
          bg: "transparent",
          fg: on("var(--button-link-foreground)", "var(--button-link-foreground-hover)", "var(--button-link-foreground-active)"),
          bc: "transparent",
          sh: "none"
        };
      default:
        return {
          bg: on("var(--button-primary-background)", "var(--button-primary-background-hover)", "var(--button-primary-background-active)"),
          fg: "var(--button-primary-foreground)",
          bc: "transparent",
          sh: "var(--button-primary-shadow)"
        };
    }
  }
  var Button = import_react5.default.forwardRef(function Button2({
    variant = "primary",
    size = "md",
    iconLeft,
    iconRight,
    loading = false,
    disabled = false,
    fullWidth = false,
    type = "button",
    children,
    style,
    ...rest
  }, ref) {
    const [hover, setHover] = import_react5.default.useState(false);
    const [down, setDown] = import_react5.default.useState(false);
    const [focus, setFocus] = import_react5.default.useState(false);
    const s = SIZES2[size] || SIZES2.md;
    const off = disabled || loading;
    const p = palette(variant, off ? "rest" : down ? "active" : hover ? "hover" : "rest");
    const bare = variant === "link";
    return /* @__PURE__ */ import_react5.default.createElement(
      "button",
      {
        ref,
        type,
        disabled: off,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => {
          setHover(false);
          setDown(false);
        },
        onMouseDown: () => setDown(true),
        onMouseUp: () => setDown(false),
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
        ...rest,
        style: {
          display: fullWidth ? "flex" : "inline-flex",
          width: fullWidth ? "100%" : void 0,
          alignItems: "center",
          justifyContent: "center",
          gap: s.gap,
          height: bare ? "auto" : s.h,
          padding: bare ? 0 : `0 ${s.px}`,
          font: "inherit",
          fontFamily: "var(--font-sans)",
          fontSize: s.fs,
          fontWeight: "var(--weight-medium)",
          letterSpacing: "var(--tracking-body)",
          lineHeight: 1,
          whiteSpace: "nowrap",
          color: off ? "var(--button-disabled-foreground)" : p.fg,
          background: off && !bare ? "var(--button-disabled-background)" : p.bg,
          border: `var(--border-width) solid ${off && !bare ? "var(--button-disabled-border)" : p.bc}`,
          borderRadius: "var(--button-radius)",
          boxShadow: focus && !off ? "var(--button-focus-ring)" : off ? "none" : p.sh,
          textDecoration: bare && hover && !off ? "underline" : "none",
          textUnderlineOffset: 2,
          cursor: off ? "not-allowed" : "pointer",
          transition: "var(--transition-control)",
          ...style
        }
      },
      loading ? /* @__PURE__ */ import_react5.default.createElement(Icon, { name: "loader-circle", size: s.icon, style: { animation: "var(--anim-spin)", opacity: 0.7 } }) : iconLeft ? /* @__PURE__ */ import_react5.default.createElement(Icon, { name: iconLeft, size: s.icon }) : null,
      children,
      iconRight ? /* @__PURE__ */ import_react5.default.createElement(Icon, { name: iconRight, size: s.icon }) : null
    );
  });

  // components/forms/Field.jsx
  var import_react6 = __toESM(require_react(), 1);
  var FieldContext = import_react6.default.createContext(null);
  function Field({
    label,
    labelHidden = false,
    hint,
    error,
    required = false,
    htmlFor,
    children,
    style,
    ...rest
  }) {
    const auto = import_react6.default.useId();
    const id = htmlFor || auto;
    const hintId = `${id}-hint`;
    const errId = `${id}-err`;
    const labelId = `${id}-label`;
    const [group, setGroup] = import_react6.default.useState(false);
    const claimGroup = import_react6.default.useCallback(() => setGroup(true), []);
    if (!label) {
      console.warn("[Meridian] Field: no label. Field wires the label association, so without one the control inside it has an id, a description and no NAME \u2014 which is invisible on screen and leaves the control unusable by a screen reader. Pass `label` (with labelHidden if it must not be seen), or give the control its own aria-label and do not wrap it in a Field.");
    }
    const described = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(" ") || void 0;
    const ctx = import_react6.default.useMemo(
      () => ({ id, labelId, describedBy: described, invalid: !!error, required, claimGroup }),
      [id, labelId, described, error, required, claimGroup]
    );
    return /* @__PURE__ */ import_react6.default.createElement("div", { ...rest, style: { display: "flex", flexDirection: "column", gap: "var(--field-gap)", minWidth: 0, ...style } }, label && /* @__PURE__ */ import_react6.default.createElement(
      "label",
      {
        id: labelId,
        htmlFor: group ? void 0 : id,
        style: labelHidden ? { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" } : { display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)", color: "var(--field-label-text)", letterSpacing: "var(--tracking-body)" }
      },
      label,
      required && /* @__PURE__ */ import_react6.default.createElement("span", { style: { color: "var(--field-required-mark)" }, "aria-hidden": "true" }, "*")
    ), /* @__PURE__ */ import_react6.default.createElement(FieldContext.Provider, { value: ctx }, children), hint && /* @__PURE__ */ import_react6.default.createElement("span", { id: hintId, style: { fontSize: "var(--text-xs)", color: "var(--field-hint-text)" } }, hint), /* @__PURE__ */ import_react6.default.createElement("span", { id: errId, role: "alert", style: error ? { display: "flex", alignItems: "flex-start", gap: "var(--field-message-gap)", fontSize: "var(--text-xs)", color: "var(--field-error-text)" } : { display: "none" } }, error ? /* @__PURE__ */ import_react6.default.createElement(import_react6.default.Fragment, null, /* @__PURE__ */ import_react6.default.createElement(Icon, { name: "circle-alert", size: "xs", "aria-hidden": "true", style: { flex: "none", marginTop: 2 } }), error) : null));
  }

  // components/core/anchor.js
  var import_react7 = __toESM(require_react(), 1);
  var MARGIN = 8;
  var MIN_ROOM = 96;
  var FALLBACK = 200;
  var flipped = { top: "bottom", bottom: "top", left: "right", right: "left" };
  function contentHeight(f) {
    let h = 0;
    for (let i = 0; i < f.children.length; i++) h += f.children[i].offsetHeight;
    return h ? h + (f.offsetHeight - f.clientHeight) : 0;
  }
  function roomFor(a, side, offset) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (side === "bottom") return vh - a.bottom - offset - MARGIN;
    if (side === "top") return a.top - offset - MARGIN;
    if (side === "right") return vw - a.right - offset - MARGIN;
    return a.left - offset - MARGIN;
  }
  function useAnchor(anchorRef, floatRef, {
    open,
    side = "bottom",
    align = "start",
    offset = 4,
    matchWidth = false,
    clampHeight = true,
    max = Infinity
  } = {}) {
    const [pos, setPos] = import_react7.default.useState(null);
    const sideRef = import_react7.default.useRef(side);
    const openedRef = import_react7.default.useRef(true);
    import_react7.default.useEffect(() => {
      if (!open) {
        openedRef.current = true;
        return void 0;
      }
      let raf = 0;
      let last = "";
      const sync = () => {
        const a = anchorRef.current?.getBoundingClientRect();
        if (!a) return;
        const f = floatRef.current;
        const want = f ? contentHeight(f) : 0;
        if (f && clampHeight) {
          const s = sideRef.current;
          const room = s === "top" || s === "bottom" ? roomFor(a, s, offset) : window.innerHeight - 2 * MARGIN;
          const px = `${Math.round(Math.min(Math.min(want || FALLBACK, max), Math.max(MIN_ROOM, room)))}px`;
          if (f.style.maxHeight !== px) f.style.maxHeight = px;
        }
        const fw = f?.offsetWidth || 0;
        const key = `${Math.round(a.left)}|${Math.round(a.top)}|${Math.round(a.bottom)}|${Math.round(a.width)}|${fw}|${want}`;
        if (key === last) return;
        last = key;
        measure(a, fw, want, openedRef.current);
        openedRef.current = false;
      };
      const tick = () => {
        sync();
        raf = requestAnimationFrame(tick);
      };
      sync();
      raf = requestAnimationFrame(tick);
      window.addEventListener("scroll", sync, true);
      window.addEventListener("resize", sync);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", sync, true);
        window.removeEventListener("resize", sync);
      };
    }, [open, side, align, offset, matchWidth, clampHeight, max]);
    function measure(a, fw, fh, opening) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const wantW = matchWidth ? a.width : fw || FALLBACK;
      const wantH = Math.min(fh || FALLBACK, max);
      const vertical = side === "top" || side === "bottom";
      const want = vertical ? wantH : wantW;
      const primary = roomFor(a, side, offset);
      const secondary = roomFor(a, flipped[side], offset);
      if (opening) sideRef.current = primary < want && secondary > primary ? flipped[side] : side;
      else {
        const cur = roomFor(a, sideRef.current, offset);
        const alt = roomFor(a, flipped[sideRef.current], offset);
        if (cur < MIN_ROOM && alt > cur) sideRef.current = flipped[sideRef.current];
      }
      const s = sideRef.current;
      const next = { side: s, width: matchWidth ? a.width : void 0 };
      if (s === "bottom" || s === "top") {
        if (s === "bottom") next.top = a.bottom + offset;
        else next.bottom = vh - a.top + offset;
        const raw = align === "center" ? a.left + a.width / 2 - wantW / 2 : align === "end" ? a.right - wantW : a.left;
        next.left = matchWidth ? a.left : Math.max(MARGIN, Math.min(raw, vw - wantW - MARGIN));
      } else {
        next.left = s === "right" ? a.right + offset : Math.max(MARGIN, a.left - offset - wantW);
        const raw = align === "center" ? a.top + a.height / 2 - wantH / 2 : align === "end" ? a.bottom - wantH : a.top;
        next.top = Math.max(MARGIN, Math.min(raw, vh - wantH - MARGIN));
      }
      setPos(next);
    }
    return pos;
  }
  function anchorStyle(pos, z = "var(--z-dropdown)") {
    return {
      position: "fixed",
      left: pos.left,
      top: pos.top,
      bottom: pos.bottom,
      width: pos.width,
      zIndex: z
    };
  }

  // components/forms/date.js
  var pad = (n) => String(n).padStart(2, "0");
  var toIso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
  function parseIso(s) {
    if (typeof s !== "string") return null;
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s.trim());
    if (!m) return null;
    const y = +m[1];
    const mo = +m[2];
    const d = +m[3];
    if (mo < 1 || mo > 12 || d < 1 || d > daysInMonth(y, mo)) return null;
    return { y, m: mo, d };
  }
  function parseTyped(s, today) {
    if (!s) return null;
    const t = s.trim().toLowerCase();
    if (t === "today") return today;
    if (t === "yesterday") return addDays(today, -1);
    const compact = /^(\d{4})(\d{2})(\d{2})$/.exec(t);
    if (compact) return parseIso(`${compact[1]}-${compact[2]}-${compact[3]}`);
    return parseIso(t);
  }
  function daysInMonth(y, m) {
    return [31, y % 4 === 0 && y % 100 !== 0 || y % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  }
  function weekdayIndex(iso, weekStartsOn = 1) {
    const p = parseIso(iso);
    if (!p) return 0;
    const dow = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay();
    return (dow - weekStartsOn + 7) % 7;
  }
  function addDays(iso, n) {
    const p = parseIso(iso);
    if (!p) return iso;
    const t = new Date(Date.UTC(p.y, p.m - 1, p.d));
    t.setUTCDate(t.getUTCDate() + n);
    return toIso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
  }
  function addMonths(iso, n) {
    const p = parseIso(iso);
    if (!p) return iso;
    const total = p.y * 12 + (p.m - 1) + n;
    const y = Math.floor(total / 12);
    const m = total % 12 + 1;
    return toIso(y, m, Math.min(p.d, daysInMonth(y, m)));
  }
  var inRange = (iso, from, to) => !!from && !!to && iso >= from && iso <= to;
  function todayIso() {
    const n = /* @__PURE__ */ new Date();
    return toIso(n.getFullYear(), n.getMonth() + 1, n.getDate());
  }
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var monthName = (m) => MONTHS[m - 1];
  var weekdayNames = (weekStartsOn = 1) => Array.from({ length: 7 }, (_, i) => DAYS[(i + weekStartsOn) % 7]);
  function spokenDate(iso) {
    const p = parseIso(iso);
    if (!p) return iso;
    const dow = DAYS[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()];
    return `${dow} ${p.d} ${monthName(p.m)} ${p.y}`;
  }
  function monthGrid(y, m, weekStartsOn = 1) {
    const first = toIso(y, m, 1);
    const lead = weekdayIndex(first, weekStartsOn);
    const start = addDays(first, -lead);
    return Array.from({ length: 42 }, (_, i) => {
      const iso = addDays(start, i);
      const p = parseIso(iso);
      return { iso, day: p.d, outside: p.m !== m || p.y !== y };
    });
  }

  // components/forms/DatePicker.jsx
  var H = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  var PX = { sm: "var(--control-px-sm)", md: "var(--control-px-md)", lg: "var(--control-px-lg)" };
  var TS = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-lg)" };
  function DatePicker({
    value,
    onChange,
    range = false,
    presets,
    min,
    max,
    isDateDisabled,
    weekStartsOn = 1,
    size = "md",
    disabled = false,
    readOnly = false,
    clearable = true,
    label,
    placeholder = "YYYY-MM-DD",
    style,
    ...rest
  }) {
    const field = import_react8.default.useContext(FieldContext);
    const uid = import_react8.default.useId();
    const today = todayIso();
    const from = range ? Array.isArray(value) ? value[0] : void 0 : value;
    const to = range ? Array.isArray(value) ? value[1] : void 0 : void 0;
    if (range && value != null && !Array.isArray(value)) {
      console.warn("[Meridian] DatePicker: `range` needs an array value ([from, to]). A single string cannot say which end it is.");
    }
    if (!range && Array.isArray(value)) {
      console.warn("[Meridian] DatePicker: array `value` without `range`. A single date is one string.");
    }
    if (!label && !field && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] DatePicker: no accessible name. Wrap it in a `Field`, or pass `label` \u2014 a date field announces as an unnamed text box, and "YYYY-MM-DD" is a format, not a question.');
    }
    const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...spread } = rest;
    const subject = label || ariaLabel;
    if (range && !subject && (field || ariaLabelledBy)) {
      console.warn('[Meridian] DatePicker: `range` needs a `label` (or `aria-label`) of its own. Each input qualifies itself ("Start date"/"End date"), and an aria-label outranks whatever named the group \u2014 but a `Field` association and `aria-labelledby` are both ids, not text, so neither can be composed into the two inputs. Without a subject the field\'s own name is discarded, any `aria-labelledby` you passed is dropped rather than half-applied, and two range pickers on a form are indistinguishable.');
    }
    if (min && max && min > max) {
      console.warn(`[Meridian] DatePicker: min (${min}) is after max (${max}), so every date is disabled and the panel offers nothing.`);
    }
    const [open, setOpen] = import_react8.default.useState(false);
    const [editing, setEditing] = import_react8.default.useState("from");
    const [cursor, setCursor] = import_react8.default.useState(() => parseIso(from) ? from : today);
    const [text, setText] = import_react8.default.useState({ from: from || "", to: to || "" });
    const [focused, setFocused] = import_react8.default.useState(null);
    import_react8.default.useEffect(() => {
      setText({ from: from || "", to: to || "" });
    }, [from, to]);
    import_react8.default.useEffect(() => {
      if (open) setCursor((c) => parseIso(editing === "to" ? to : from) ? editing === "to" ? to : from : c);
    }, [open, editing, from, to]);
    const wantFocus = import_react8.default.useRef(false);
    const wrapRef = import_react8.default.useRef(null);
    const panelRef = import_react8.default.useRef(null);
    const gridRef = import_react8.default.useRef(null);
    const fromRef = import_react8.default.useRef(null);
    const toRef = import_react8.default.useRef(null);
    const pos = useAnchor(wrapRef, panelRef, { open, side: "bottom", align: "start", clampHeight: false });
    import_react8.default.useEffect(() => {
      if (!open || !wantFocus.current) return;
      const el = gridRef.current?.querySelector('[data-day-focus="true"]');
      if (!el) return;
      wantFocus.current = false;
      el.focus();
    }, [open, pos, cursor]);
    const off = disabled || field?.disabled;
    const invalid = field?.invalid;
    const dayOff = (iso) => min && iso < min || max && iso > max || (isDateDisabled ? !!isDateDisabled(iso) : false);
    const commit = (iso, which) => {
      if (!onChange || dayOff(iso)) return;
      if (!range) {
        onChange(iso);
        setOpen(false);
        fromRef.current?.focus();
        return;
      }
      const end = which || editing;
      let next = end === "from" ? [iso, to] : [from, iso];
      if (next[0] && next[1] && next[0] > next[1]) next = [next[1], next[0]];
      onChange(next);
      if (end === "from") {
        setEditing("to");
      } else {
        setOpen(false);
        toRef.current?.focus();
      }
    };
    const onTyped = (which) => (e) => {
      const raw = e.target.value;
      setText((t) => ({ ...t, [which]: raw }));
      if (!raw) {
        onChange?.(range ? which === "from" ? [void 0, to] : [from, void 0] : void 0);
        return;
      }
      const parsed = parseTyped(raw, today);
      if (parsed) {
        const iso = toIso(parsed.y, parsed.m, parsed.d);
        setCursor(iso);
        commit(iso, which);
      }
    };
    const move = (n, unit) => {
      const next = unit === "month" ? addMonths(cursor, n) : unit === "year" ? addMonths(cursor, n * 12) : addDays(cursor, n);
      wantFocus.current = true;
      setCursor(next);
    };
    const onGridKey = (e) => {
      const k = e.key;
      const map = { ArrowLeft: [-1, "day"], ArrowRight: [1, "day"], ArrowUp: [-7, "day"], ArrowDown: [7, "day"] };
      if (map[k]) {
        e.preventDefault();
        move(map[k][0], map[k][1]);
        return;
      }
      if (k === "PageUp") {
        e.preventDefault();
        move(e.shiftKey ? -1 : -1, e.shiftKey ? "year" : "month");
        return;
      }
      if (k === "PageDown") {
        e.preventDefault();
        move(e.shiftKey ? 1 : 1, e.shiftKey ? "year" : "month");
        return;
      }
      if (k === "Home") {
        e.preventDefault();
        const p2 = parseIso(cursor);
        wantFocus.current = true;
        setCursor(toIso(p2.y, p2.m, 1));
        return;
      }
      if (k === "End") {
        e.preventDefault();
        const p2 = parseIso(cursor);
        wantFocus.current = true;
        setCursor(toIso(p2.y, p2.m, daysInMonth(p2.y, p2.m)));
        return;
      }
      if (k === "Enter" || k === " ") {
        e.preventDefault();
        commit(cursor);
        return;
      }
      if (k === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        (editing === "to" ? toRef : fromRef).current?.focus();
      }
    };
    import_react8.default.useEffect(() => {
      if (!open) return void 0;
      const onDown = (e) => {
        if (wrapRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
        setOpen(false);
      };
      window.addEventListener("mousedown", onDown, true);
      return () => window.removeEventListener("mousedown", onDown, true);
    }, [open]);
    const openPanel = (which) => {
      if (off || readOnly) return;
      setEditing(which);
      wantFocus.current = true;
      setOpen(true);
    };
    const boxStyle = (active) => ({
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      height: H[size] || H.md,
      padding: `0 ${PX[size] || PX.md}`,
      background: off ? "var(--input-background-disabled)" : readOnly ? "var(--surface-sunken)" : "var(--input-background)",
      border: `var(--border-width) solid ${invalid ? "var(--input-border-invalid)" : active ? "var(--input-border-focus)" : "var(--input-border)"}`,
      borderRadius: "var(--input-radius)",
      boxShadow: active ? invalid ? "var(--input-focus-ring-invalid)" : "var(--input-focus-ring)" : "none",
      transition: "var(--transition-control)",
      minWidth: 0,
      flex: 1
    });
    const inputStyle = {
      flex: 1,
      /* 10ch — "YYYY-MM-DD" — for the same reason as TimeField's 5ch: with a
         clear and a calendar button beside it, a zero-basis flex item with
         min-width: 0 shrinks below its own value and clips the date. */
      minWidth: "10ch",
      border: 0,
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-mono)",
      fontSize: TS[size] || TS.md,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "var(--tracking-mono)",
      color: off ? "var(--input-text-disabled)" : "var(--input-text)"
    };
    const p = parseIso(cursor) || parseIso(today);
    const cells = monthGrid(p.y, p.m, weekStartsOn);
    const selected = (iso) => iso === from || iso === to;
    const one = (which) => /* @__PURE__ */ import_react8.default.createElement("div", { style: boxStyle(focused === which || open && editing === which) }, /* @__PURE__ */ import_react8.default.createElement(
      "input",
      {
        ref: which === "from" ? fromRef : toRef,
        id: which === "from" ? field?.id || `${uid}-from` : `${uid}-to`,
        type: "text",
        inputMode: "numeric",
        autoComplete: "off",
        spellCheck: false,
        value: text[which],
        placeholder,
        disabled: off,
        readOnly,
        "aria-label": which === "to" || range ? [subject, which === "to" ? "End date" : "Start date"].filter(Boolean).join(" ") : field ? void 0 : subject,
        "aria-labelledby": !range && !subject ? ariaLabelledBy : void 0,
        "aria-describedby": field?.describedBy,
        "aria-invalid": invalid || void 0,
        "aria-required": field?.required || void 0,
        onChange: onTyped(which),
        onFocus: () => setFocused(which),
        onBlur: () => setFocused(null),
        onKeyDown: (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openPanel(which);
          }
          if (e.key === "Escape" && open) {
            e.preventDefault();
            setOpen(false);
          }
        },
        style: inputStyle
      }
    ), clearable && !off && !readOnly && text[which] && /* @__PURE__ */ import_react8.default.createElement(
      IconButton,
      {
        icon: "x",
        size: "sm",
        variant: "ghost",
        label: which === "to" ? "Clear end date" : "Clear date",
        onClick: () => {
          setText((t) => ({ ...t, [which]: "" }));
          onChange?.(range ? which === "from" ? [void 0, to] : [from, void 0] : void 0);
          (which === "from" ? fromRef : toRef).current?.focus();
        },
        style: { flex: "none" }
      }
    ), /* @__PURE__ */ import_react8.default.createElement(
      IconButton,
      {
        icon: "calendar",
        size: "sm",
        variant: "ghost",
        label: [subject, which === "to" ? "Choose an end date" : "Choose a date"].filter(Boolean).join(" \u2014 "),
        "aria-expanded": open && editing === which,
        disabled: off || readOnly,
        onClick: () => open && editing === which ? setOpen(false) : openPanel(which),
        style: { flex: "none" }
      }
    ));
    return /* @__PURE__ */ import_react8.default.createElement("div", { ref: wrapRef, ...spread, style: { display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 0, ...style } }, /* @__PURE__ */ import_react8.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0 } }, one("from"), range && /* @__PURE__ */ import_react8.default.createElement(import_react8.default.Fragment, null, /* @__PURE__ */ import_react8.default.createElement(Icon, { name: "arrow-right", size: "xs", "aria-hidden": "true", style: { flex: "none", color: "var(--text-tertiary)" } }), one("to"))), open && pos && /* @__PURE__ */ import_react8.default.createElement(
      "div",
      {
        ref: panelRef,
        role: "dialog",
        "aria-label": [subject, range ? "Choose a date range" : "Choose a date"].filter(Boolean).join(" \u2014 "),
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            setOpen(false);
            (editing === "to" ? toRef : fromRef).current?.focus();
          }
        },
        style: {
          ...anchorStyle(pos, "var(--z-dropdown)"),
          display: "flex",
          background: "var(--datepicker-panel-background)",
          border: `var(--border-width) solid var(--datepicker-panel-border)`,
          borderRadius: "var(--datepicker-panel-radius)",
          boxShadow: "var(--datepicker-panel-shadow)",
          animation: "var(--anim-drop-in)"
        }
      },
      presets?.length > 0 && /* @__PURE__ */ import_react8.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 2, padding: "var(--space-2)", borderRight: `var(--border-width) solid var(--datepicker-footer-border)`, minWidth: 132 } }, presets.map((ps) => /* @__PURE__ */ import_react8.default.createElement(
        Button,
        {
          key: ps.label,
          variant: "ghost",
          size: "sm",
          style: { justifyContent: "flex-start" },
          onClick: () => {
            if (!onChange) return;
            onChange(range ? ps.value : Array.isArray(ps.value) ? ps.value[0] : ps.value);
            setCursor(Array.isArray(ps.value) ? ps.value[0] : ps.value);
            setOpen(false);
            fromRef.current?.focus();
          }
        },
        ps.label
      ))),
      /* @__PURE__ */ import_react8.default.createElement("div", { style: { padding: "var(--space-3)" } }, /* @__PURE__ */ import_react8.default.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", marginBottom: "var(--space-2)" } }, /* @__PURE__ */ import_react8.default.createElement(IconButton, { icon: "chevron-left", size: "sm", label: "Previous month", onClick: () => setCursor(addMonths(cursor, -1)) }), /* @__PURE__ */ import_react8.default.createElement("div", { "aria-live": "polite", style: { fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--datepicker-header-text)" } }, monthName(p.m), " ", p.y), /* @__PURE__ */ import_react8.default.createElement(IconButton, { icon: "chevron-right", size: "sm", label: "Next month", onClick: () => setCursor(addMonths(cursor, 1)) })), /* @__PURE__ */ import_react8.default.createElement(
        "div",
        {
          ref: gridRef,
          role: "grid",
          "aria-label": `${monthName(p.m)} ${p.y}`,
          onKeyDown: onGridKey,
          style: { display: "grid", gridTemplateColumns: "repeat(7, var(--datepicker-day-size))", gap: 2 }
        },
        weekdayNames(weekStartsOn).map((d) => /* @__PURE__ */ import_react8.default.createElement("div", { key: d, role: "columnheader", "aria-label": d, style: { height: 22, display: "grid", placeItems: "center", fontSize: "var(--text-2xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", color: "var(--datepicker-weekday-text)" } }, d.slice(0, 2))),
        cells.map((c) => {
          const isSel = selected(c.iso);
          const isSpan = range && !isSel && inRange(c.iso, from, to);
          const isToday = c.iso === today;
          const d = dayOff(c.iso);
          const isCursor = c.iso === cursor;
          return /* @__PURE__ */ import_react8.default.createElement("div", { key: c.iso, role: "gridcell", "aria-selected": isSel || void 0, style: { display: "grid" } }, /* @__PURE__ */ import_react8.default.createElement(
            "button",
            {
              type: "button",
              "data-day-focus": isCursor ? "true" : void 0,
              tabIndex: isCursor ? 0 : -1,
              disabled: d,
              "aria-label": spokenDate(c.iso),
              "aria-current": isToday ? "date" : void 0,
              onClick: () => commit(c.iso),
              style: {
                width: "var(--datepicker-day-size)",
                height: "var(--datepicker-day-size)",
                display: "grid",
                placeItems: "center",
                padding: 0,
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontVariantNumeric: "tabular-nums",
                color: d ? "var(--datepicker-day-disabled-text)" : isSel ? "var(--datepicker-day-foreground-selected)" : isSpan ? "var(--datepicker-day-foreground-range)" : c.outside ? "var(--datepicker-day-outside-text)" : "var(--datepicker-day-text)",
                background: isSel ? "var(--datepicker-day-background-selected)" : isSpan ? "var(--datepicker-day-background-range)" : "transparent",
                border: `var(--border-width) solid ${isToday && !isSel ? "var(--datepicker-today-border)" : "transparent"}`,
                borderRadius: "var(--datepicker-day-radius)",
                cursor: d ? "not-allowed" : "pointer",
                transition: "var(--transition-control)"
              }
            },
            c.day
          ));
        })
      ), /* @__PURE__ */ import_react8.default.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", marginTop: "var(--space-2)", paddingTop: "var(--space-2)", borderTop: `var(--border-width) solid var(--datepicker-footer-border)` } }, /* @__PURE__ */ import_react8.default.createElement(Button, { variant: "ghost", size: "sm", onClick: () => {
        setCursor(today);
        commit(today);
      }, disabled: dayOff(today) }, "Today"), range && /* @__PURE__ */ import_react8.default.createElement("span", { style: { fontSize: "var(--text-2xs)", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" } }, editing === "from" ? "picking start" : "picking end")))
    ));
  }

  // components/composite/DateRangePicker.jsx
  var MIN_COL = { sm: 176, md: 192, lg: 208 };
  function DateRangePicker({
    label,
    value,
    onChange,
    startLabel = "Start",
    endLabel = "End",
    min,
    max,
    constrain = true,
    allowPartial = false,
    error,
    hint,
    startHint,
    endHint,
    layout = "auto",
    size = "md",
    disabled = false,
    readOnly = false,
    clearable = true,
    weekStartsOn = 1,
    isDateDisabled,
    onValidityChange,
    presets,
    style,
    ...rest
  }) {
    const field = import_react9.default.useContext(FieldContext);
    const uid = import_react9.default.useId();
    import_react9.default.useEffect(() => {
      field?.claimGroup?.();
    }, [field]);
    const startId = `${uid}-s`;
    const endId = `${uid}-e`;
    const hintId = `${uid}-hint`;
    const errId = `${uid}-err`;
    const startHintId = `${uid}-s-hint`;
    const endHintId = `${uid}-e-hint`;
    const pair = Array.isArray(value) ? value : [void 0, void 0];
    const start = pair[0] || void 0;
    const end = pair[1] || void 0;
    const [touched, setTouched] = import_react9.default.useState({ start: false, end: false });
    const blurred = (which) => (e) => {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      setTouched((t) => t[which] ? t : { ...t, [which]: true });
    };
    if (value != null && !Array.isArray(value)) {
      console.warn("[Meridian] DateRangePicker: `value` is one range, expressed as [start, end] \u2014 the same pair shape `DatePicker range` emits. A single string cannot say which endpoint it is.");
    }
    if (!label && !field) {
      console.warn('[Meridian] DateRangePicker: no `label`. It names the range as a whole ("Report window"); the two endpoints are named by their own visible labels. Without it the group is unnamed, and two ranges on one form are told apart only by reading their fields.');
    }
    if (min && max && min > max) {
      console.warn(`[Meridian] DateRangePicker: min (${min}) is after max (${max}), so no valid range exists and both panels offer nothing.`);
    }
    if (presets) {
      console.warn("[Meridian] DateRangePicker: `presets` is not supported here. A preset sets BOTH endpoints at once, which belongs to a control with one shared panel \u2014 use `DatePicker range presets={\u2026}`. This composite is two separately named, separately validated fields.");
    }
    const outOfOrder = !!start && !!end && end < start;
    const malformed = (iso) => !!iso && !parseIso(iso);
    const outside = (iso) => !!iso && !malformed(iso) && (min && iso < min || max && iso > max);
    const startBad = malformed(start) || outside(start);
    const endBad = malformed(end) || outside(end);
    const partial = !allowPartial && !!start !== !!end;
    const partialShown = partial && (start ? touched.end : touched.start);
    const reason = outOfOrder ? "order" : startBad || endBad ? "bounds" : partial ? "partial" : null;
    const valid = !reason && !field?.invalid;
    const shown = outOfOrder ? "order" : startBad || endBad ? "bounds" : partialShown ? "partial" : null;
    const message = error || (shown === "order" ? `${endLabel} must be on or after ${startLabel.toLowerCase()}.` : null) || (shown === "bounds" ? `${startBad ? startLabel : endLabel} must be${min ? ` on or after ${min}` : ""}${min && max ? " and" : ""}${max ? ` on or before ${max}` : ""}.` : null) || (shown === "partial" ? `Both ${startLabel.toLowerCase()} and ${endLabel.toLowerCase()} are required \u2014 a half-open range is not accepted here.` : null);
    const startInvalid = !!field?.invalid || !!error || outOfOrder || startBad || partialShown && !start;
    const endInvalid = !!field?.invalid || !!error || outOfOrder || endBad || partialShown && !end;
    const changed = import_react9.default.useRef();
    import_react9.default.useEffect(() => {
      const key = `${valid}|${reason || ""}`;
      if (changed.current === key) return;
      changed.current = key;
      onValidityChange?.({ valid, reason });
    }, [valid, reason]);
    const cross = constrain && !outOfOrder;
    const startMax = cross && end ? max && max < end ? max : end : max;
    const endMin = cross && start ? min && min > start ? min : start : min;
    const emit2 = (next) => {
      onChange?.(next);
    };
    const stacked = layout === "stacked";
    const rowStyle = stacked ? { display: "flex", flexDirection: "column", gap: "var(--date-range-gap)", minWidth: 0 } : {
      display: "flex",
      flexDirection: "row",
      /* `auto` wraps to a column when a side can no longer hold a whole
         date; `inline` is a promise the caller made about its container. */
      flexWrap: layout === "inline" ? "nowrap" : "wrap",
      alignItems: "flex-start",
      gap: "var(--date-range-gap)",
      minWidth: 0
    };
    const colStyle = stacked || layout === "inline" ? { display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 0, flex: "1 1 0" } : {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)",
      flex: `1 1 ${MIN_COL[size] || MIN_COL.md}px`,
      /* min(), so a container narrower than one column shrinks the field
         instead of overflowing it. */
      minWidth: `min(100%, ${MIN_COL[size] || MIN_COL.md}px)`
    };
    const describedBy = (own) => [field?.describedBy, hint ? hintId : null, own, message ? errId : null].filter(Boolean).join(" ") || void 0;
    const startCtx = import_react9.default.useMemo(
      () => ({ id: startId, describedBy: describedBy(startHint ? startHintId : null), invalid: startInvalid, required: !!field?.required }),
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
      [startId, field?.describedBy, field?.required, hint, startHint, startInvalid, message]
    );
    const endCtx = import_react9.default.useMemo(
      () => ({ id: endId, describedBy: describedBy(endHint ? endHintId : null), invalid: endInvalid, required: !!field?.required }),
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
      [endId, field?.describedBy, field?.required, hint, endHint, endInvalid, message]
    );
    const endpoint = (which) => {
      const isStart = which === "start";
      return /* @__PURE__ */ import_react9.default.createElement("div", { style: colStyle, onBlur: blurred(which) }, /* @__PURE__ */ import_react9.default.createElement(Text, { as: "label", htmlFor: isStart ? startId : endId, size: "xs", weight: "medium", style: { color: "var(--field-label-text)" } }, isStart ? startLabel : endLabel), /* @__PURE__ */ import_react9.default.createElement(FieldContext.Provider, { value: isStart ? startCtx : endCtx }, /* @__PURE__ */ import_react9.default.createElement(
        DatePicker,
        {
          label: [label, isStart ? startLabel : endLabel].filter(Boolean).join(" "),
          value: isStart ? start : end,
          onChange: (iso) => emit2(isStart ? [iso, end] : [start, iso]),
          min: isStart ? min : endMin,
          max: isStart ? startMax : max,
          isDateDisabled,
          weekStartsOn,
          size,
          disabled,
          readOnly,
          clearable
        }
      )), (isStart ? startHint : endHint) ? /* @__PURE__ */ import_react9.default.createElement(Text, { id: isStart ? startHintId : endHintId, size: "xs", tone: "tertiary", measure: "hint" }, isStart ? startHint : endHint) : null);
    };
    return /* @__PURE__ */ import_react9.default.createElement(
      Box,
      {
        role: "group",
        "aria-label": !field && label ? label : void 0,
        "aria-labelledby": field?.labelId,
        ...rest,
        display: "flex",
        style: { flexDirection: "column", gap: "var(--space-1)", minWidth: 0, ...style }
      },
      label && !field ? /* @__PURE__ */ import_react9.default.createElement(Text, { size: "xs", weight: "medium", style: { color: "var(--field-label-text)" } }, label) : null,
      /* @__PURE__ */ import_react9.default.createElement("div", { style: rowStyle }, endpoint("start"), endpoint("end")),
      hint ? /* @__PURE__ */ import_react9.default.createElement(Text, { id: hintId, size: "xs", tone: "tertiary", measure: "hint" }, hint) : null,
      /* @__PURE__ */ import_react9.default.createElement("span", { id: errId, role: "alert", style: message ? { display: "flex", alignItems: "flex-start", gap: "var(--field-message-gap)", fontSize: "var(--text-xs)", color: "var(--field-error-text)" } : { display: "none" } }, message ? /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, /* @__PURE__ */ import_react9.default.createElement(Icon, { name: "circle-alert", size: "xs", "aria-hidden": "true", style: { flex: "none", marginTop: 2 } }), message) : null)
    );
  }

  // components/composite/DateTimePicker.jsx
  var import_react11 = __toESM(require_react(), 1);

  // components/forms/TimeField.jsx
  var import_react10 = __toESM(require_react(), 1);

  // components/forms/time.js
  var toHm = (h, m) => `${pad(h)}:${pad(m)}`;
  function parseHm(s) {
    if (typeof s !== "string") return null;
    const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
    if (!m) return null;
    const h = +m[1];
    const mi = +m[2];
    if (h > 23 || mi > 59) return null;
    return { h, m: mi };
  }
  function parseTypedTime(s, nowHm2) {
    if (!s) return null;
    const t = s.trim().toLowerCase();
    if (t === "now") return parseHm(nowHm2);
    if (/^\d{1,2}$/.test(t)) {
      const h = +t;
      return h <= 23 ? { h, m: 0 } : null;
    }
    const digits = /^(\d{3,4})$/.exec(t);
    if (digits) {
      const d = digits[1];
      const h = +d.slice(0, d.length - 2);
      const mi = +d.slice(-2);
      return h <= 23 && mi <= 59 ? { h, m: mi } : null;
    }
    const dot = /^(\d{1,2})[.h](\d{2})$/.exec(t);
    if (dot) return parseHm(`${dot[1]}:${dot[2]}`);
    return parseHm(t);
  }
  var minutesOf = (hm) => {
    const p = parseHm(hm);
    return p ? p.h * 60 + p.m : null;
  };
  function addMinutes(hm, n, { min, max } = {}) {
    const cur = minutesOf(hm);
    if (cur == null) return hm;
    let next = cur + n;
    const lo = Math.max(0, minutesOf(min) ?? 0);
    const hi = Math.min(1439, minutesOf(max) ?? 1439);
    next = Math.max(lo, Math.min(hi, next));
    return toHm(Math.floor(next / 60), next % 60);
  }
  function stepFrom(hm, dir, step2, bounds) {
    const cur = minutesOf(hm);
    if (cur == null) return hm;
    if (step2 <= 1) return addMinutes(hm, dir, bounds);
    const snapped = dir > 0 ? Math.floor(cur / step2) * step2 + step2 : Math.ceil(cur / step2) * step2 - step2;
    return addMinutes(hm, snapped - cur, bounds);
  }
  function nowHm() {
    const n = /* @__PURE__ */ new Date();
    return toHm(n.getHours(), n.getMinutes());
  }
  function spokenTime(hm) {
    const p = parseHm(hm);
    if (!p) return hm;
    return `${p.h} ${p.m === 0 ? "o'clock" : pad(p.m)}`;
  }

  // components/forms/TimeField.jsx
  var H2 = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  var PX2 = { sm: "var(--control-px-sm)", md: "var(--control-px-md)", lg: "var(--control-px-lg)" };
  var TS2 = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-lg)" };
  function TimeField({
    value,
    onChange,
    step: step2 = 1,
    min,
    max,
    zone,
    size = "md",
    disabled = false,
    readOnly = false,
    clearable = true,
    label,
    placeholder = "HH:MM",
    style,
    ...rest
  }) {
    const field = import_react10.default.useContext(FieldContext);
    const uid = import_react10.default.useId();
    const [text, setText] = import_react10.default.useState(value || "");
    const inputRef = import_react10.default.useRef(null);
    const [focus, setFocus] = import_react10.default.useState(false);
    const focusRef = import_react10.default.useRef(false);
    const lastValue = import_react10.default.useRef(value);
    import_react10.default.useEffect(() => {
      if (value === lastValue.current) return;
      lastValue.current = value;
      if (!focusRef.current) setText(value || "");
    }, [value]);
    if (!label && !field && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] TimeField: no accessible name. Wrap it in a `Field` or pass `label` \u2014 "HH:MM" is a format, not a question, and a placeholder is not a label.');
    }
    if (value && !parseHm(value)) {
      console.warn(`[Meridian] TimeField: value ${JSON.stringify(value)} is not "HH:mm". A time is two integers in a string \u2014 not a Date, not minutes since midnight, not "4:12 pm".`);
    }
    if (min && max && minutesOf(min) > minutesOf(max)) {
      console.warn(`[Meridian] TimeField: min (${min}) is after max (${max}), so no time is acceptable. A window that crosses midnight cannot be expressed by a field with no date \u2014 validate the pair in the form.`);
    }
    const off = disabled || field?.disabled;
    const invalid = field?.invalid;
    const bounds = { min, max };
    const commit = (hm) => {
      if (onChange && hm !== value) onChange(hm);
    };
    const onTyped = (e) => {
      const raw = e.target.value;
      setText(raw);
      if (!raw) {
        commit(void 0);
        return;
      }
      const p = parseTypedTime(raw, nowHm());
      const bareHour = /^\d{1,2}$/.test(raw.trim());
      if (p && !bareHour) commit(toHm(p.h, p.m));
    };
    const onBlur = () => {
      focusRef.current = false;
      setFocus(false);
      if (!text) return;
      const p = parseTypedTime(text, nowHm());
      if (p) {
        setText(toHm(p.h, p.m));
        commit(toHm(p.h, p.m));
      }
    };
    const nudge = (dir) => {
      if (off || readOnly) return;
      const base = parseHm(value) ? value : min || nowHm();
      const next = parseHm(value) ? stepFrom(value, dir, step2, bounds) : base;
      setText(next);
      commit(next);
    };
    return /* @__PURE__ */ import_react10.default.createElement(
      "div",
      {
        ...rest,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          height: H2[size] || H2.md,
          padding: `0 ${PX2[size] || PX2.md}`,
          background: off ? "var(--input-background-disabled)" : readOnly ? "var(--surface-sunken)" : "var(--input-background)",
          border: `var(--border-width) solid ${invalid ? "var(--input-border-invalid)" : focus ? "var(--input-border-focus)" : "var(--input-border)"}`,
          borderRadius: "var(--input-radius)",
          boxShadow: focus ? invalid ? "var(--input-focus-ring-invalid)" : "var(--input-focus-ring)" : "none",
          transition: "var(--transition-control)",
          minWidth: 0,
          ...style
        }
      },
      /* @__PURE__ */ import_react10.default.createElement(
        "input",
        {
          ref: inputRef,
          id: field?.id || `${uid}-time`,
          type: "text",
          inputMode: "numeric",
          autoComplete: "off",
          spellCheck: false,
          value: text,
          placeholder,
          disabled: off,
          readOnly,
          "aria-label": label ? void 0 : rest["aria-label"],
          "aria-describedby": field?.describedBy,
          "aria-invalid": invalid || void 0,
          "aria-required": field?.required || void 0,
          onChange: onTyped,
          onFocus: () => {
            focusRef.current = true;
            setFocus(true);
          },
          onBlur,
          onKeyDown: (e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              nudge(1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              nudge(-1);
            } else if (e.key === "PageUp") {
              e.preventDefault();
              if (parseHm(value)) {
                const n = stepFrom(value, 1, 60, bounds);
                setText(n);
                commit(n);
              }
            } else if (e.key === "PageDown") {
              e.preventDefault();
              if (parseHm(value)) {
                const n = stepFrom(value, -1, 60, bounds);
                setText(n);
                commit(n);
              }
            }
          },
          style: {
            flex: 1,
            /* 5ch, not 0. The input is a zero-basis flex item, so with a zone
               label and a clear button beside it — 98px of a 120px box once
               padding and gaps are counted — min-width: 0 let it shrink to
               28px for a value needing 43px, and the field CLIPPED the time it
               exists to show. A control may shrink to its content, never
               below it: five mono characters is exactly "HH:MM". */
            minWidth: "5ch",
            width: "100%",
            border: 0,
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-mono)",
            fontSize: TS2[size] || TS2.md,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "var(--tracking-mono)",
            color: off ? "var(--input-text-disabled)" : "var(--input-text)"
          }
        }
      ),
      /* @__PURE__ */ import_react10.default.createElement("span", { "aria-live": "polite", style: { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" } }, parseHm(value) ? spokenTime(value) : ""),
      zone && /* @__PURE__ */ import_react10.default.createElement(
        "span",
        {
          style: { flex: "none", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--text-tertiary)", letterSpacing: "var(--tracking-caps)" }
        },
        zone
      ),
      clearable && !off && !readOnly && text && /* @__PURE__ */ import_react10.default.createElement(
        IconButton,
        {
          icon: "x",
          size: "sm",
          variant: "ghost",
          label: "Clear time",
          onClick: () => {
            setText("");
            commit(void 0);
            inputRef.current?.focus();
          },
          style: { flex: "none" }
        }
      )
    );
  }

  // components/forms/zone.js
  var cache = /* @__PURE__ */ new Map();
  var fmt = (zone, opts) => {
    const key = zone + JSON.stringify(opts);
    let f = cache.get(key);
    if (!f) {
      f = new Intl.DateTimeFormat("en-US", { timeZone: zone, ...opts });
      cache.set(key, f);
    }
    return f;
  };
  function isZone(zone) {
    if (typeof zone !== "string" || !zone.includes("/")) return false;
    try {
      fmt(zone, { year: "numeric" }).format(0);
      return true;
    } catch {
      return false;
    }
  }
  var PARTS = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false };
  function zoneParts(instant, zone) {
    const t = Date.parse(instant);
    if (Number.isNaN(t) || !isZone(zone)) return { date: void 0, time: void 0 };
    const p = {};
    for (const { type, value } of fmt(zone, PARTS).formatToParts(t)) p[type] = value;
    const h = p.hour === "24" ? "00" : p.hour;
    return { date: `${p.year}-${p.month}-${p.day}`, time: `${h}:${p.minute}` };
  }
  function offsetAt(instant, zone) {
    const t = Date.parse(instant);
    if (Number.isNaN(t) || !isZone(zone)) return 0;
    const { date, time } = zoneParts(instant, zone);
    const asUtc = Date.parse(`${date}T${time}:00Z`);
    return Math.round((asUtc - Math.floor(t / 6e4) * 6e4) / 6e4);
  }
  function instantFrom(date, time, zone) {
    if (!date || !time || !isZone(zone)) return { instant: void 0, shifted: false, ambiguous: false };
    const naive = `${date}T${time}:00Z`;
    const t0 = Date.parse(naive);
    if (Number.isNaN(t0)) return { instant: void 0, shifted: false, ambiguous: false };
    let guess = t0 - offsetAt(new Date(t0).toISOString(), zone) * 6e4;
    guess = t0 - offsetAt(new Date(guess).toISOString(), zone) * 6e4;
    const iso = (ms) => new Date(Math.floor(ms / 6e4) * 6e4).toISOString().replace(/:\d{2}\.\d{3}Z$/, ":00Z");
    const back = zoneParts(iso(guess), zone);
    const shifted = back.date !== date || back.time !== time;
    let ambiguous = false;
    if (!shifted) {
      for (const mins of [60, 30]) {
        const earlier = guess - mins * 6e4;
        const p = zoneParts(iso(earlier), zone);
        if (p.date === date && p.time === time) {
          guess = earlier;
          ambiguous = true;
          break;
        }
      }
    }
    return { instant: iso(guess), shifted, ambiguous };
  }
  function zoneAbbr(zone, instant) {
    if (!isZone(zone)) return void 0;
    const at = instant || (/* @__PURE__ */ new Date()).toISOString();
    const t = Date.parse(at);
    const part = fmt(zone, { hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short" }).formatToParts(t).find((p) => p.type === "timeZoneName");
    const v = part && part.value;
    if (v && !v.includes("/") && v.length <= 6 && !/^(GMT|UTC)/i.test(v)) return v;
    const o = offsetAt(at, zone);
    if (o === 0) return "UTC";
    const sign = o < 0 ? "-" : "+";
    const h = Math.floor(Math.abs(o) / 60);
    const m = Math.abs(o) % 60;
    return `UTC${sign}${h}${m ? `:${pad(m)}` : ""}`;
  }

  // components/composite/DateTimePicker.jsx
  var LOCAL = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/;
  var MIN_ROW = { sm: 300, md: 330, lg: 360 };
  var splitLocal = (v) => {
    if (v == null) return { date: void 0, time: void 0 };
    if (typeof v === "object") return { date: v.date || void 0, time: v.time || void 0 };
    const m = String(v).match(LOCAL);
    return m ? { date: m[1], time: m[2] } : { date: void 0, time: void 0 };
  };
  var isInstant = (v) => typeof v === "string" && /Z$/.test(v);
  function DateTimePicker({
    label,
    value,
    onChange,
    zone,
    dateLabel = "Date",
    timeLabel = "Time",
    min,
    max,
    allowPartial = false,
    step: step2 = 1,
    error,
    hint,
    dateHint,
    timeHint,
    layout = "auto",
    size = "md",
    disabled = false,
    readOnly = false,
    clearable = true,
    weekStartsOn = 1,
    isDateDisabled,
    onValidityChange,
    style,
    ...rest
  }) {
    const field = import_react11.default.useContext(FieldContext);
    const uid = import_react11.default.useId();
    import_react11.default.useEffect(() => {
      field?.claimGroup?.();
    }, [field]);
    const dateId = `${uid}-d`;
    const timeId = `${uid}-t`;
    const hintId = `${uid}-hint`;
    const errId = `${uid}-err`;
    const noteId = `${uid}-note`;
    const dateHintId = `${uid}-d-hint`;
    const timeHintId = `${uid}-t-hint`;
    const zoned = !!zone && isZone(zone);
    if (zone && !zoned) {
      console.warn(`[Meridian] DateTimePicker: zone ${JSON.stringify(zone)} is not an IANA zone this platform knows ("Asia/Kolkata", "America/Chicago"). An abbreviation like "IST" is a LABEL, not a zone \u2014 India, Ireland and Israel all use it. Falling back to a floating wall-clock value with no zone.`);
    }
    if (isInstant(value) && !zoned) {
      console.warn(`[Meridian] DateTimePicker: value ${JSON.stringify(value)} is a UTC instant but no valid \`zone\` was given, so there is no clock to show it on. Pass the record's Site zone; without one this control edits a floating wall clock.`);
    }
    if (!isInstant(value) && value != null && zoned) {
      console.warn(`[Meridian] DateTimePicker: with \`zone\` set the value is a UTC instant ending in Z. Got ${JSON.stringify(value)} \u2014 a wall clock with no offset, which cannot be placed on a timeline.`);
    }
    if (value != null && !isInstant(value) && typeof value !== "object" && !LOCAL.test(String(value))) {
      console.warn(`[Meridian] DateTimePicker: value ${JSON.stringify(value)} is neither an instant, 'YYYY-MM-DDTHH:mm', nor { date, time }.`);
    }
    if (!label && !field) {
      console.warn('[Meridian] DateTimePicker: no `label`. It names the moment as a whole ("Fault occurred"); the halves are named by their own labels. Without it the group is unnamed and two of these on one form are told apart only by reading their fields.');
    }
    const shownParts = zoned && isInstant(value) ? zoneParts(value, zone) : splitLocal(value);
    const [pending, setPending] = import_react11.default.useState({});
    const date = pending.date !== void 0 ? pending.date : shownParts.date;
    const time = pending.time !== void 0 ? pending.time : shownParts.time;
    const abbr = zoned ? zoneAbbr(zone, isInstant(value) ? value : void 0) : void 0;
    const built = zoned ? instantFrom(date, time, zone) : { instant: void 0, shifted: false, ambiguous: false };
    const complete = !!date && !!time;
    const malformedDate = !!date && !parseIso(date);
    const malformedTime = !!time && !parseHm(time);
    const partial = !allowPartial && !!date !== !!time;
    const asWall = (b, endOfDay) => {
      if (b == null) return void 0;
      const p = isInstant(b) && zoned ? zoneParts(b, zone) : splitLocal(b);
      if (!p.date) return void 0;
      return { date: p.date, full: `${p.date}T${p.time || (endOfDay ? "23:59" : "00:00")}` };
    };
    const lo = asWall(min, false);
    const hi = asWall(max, true);
    const wall = complete ? `${date}T${time}` : void 0;
    const below = !!wall && !!lo && wall < lo.full;
    const above = !!wall && !!hi && wall > hi.full;
    const dateOutside = !!date && !malformedDate && (lo && date < lo.date || hi && date > hi.date);
    const reason = malformedDate || malformedTime ? "malformed" : built.shifted ? "nonexistent" : dateOutside || below || above ? "bounds" : partial ? "partial" : null;
    const valid = !reason && !field?.invalid;
    const [touched, setTouched] = import_react11.default.useState({ date: false, time: false });
    const blurred = (which) => (e) => {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      setTouched((t) => t[which] ? t : { ...t, [which]: true });
    };
    const partialShown = partial && (date ? touched.time : touched.date);
    const shown = reason === "partial" ? partialShown ? "partial" : null : reason;
    const message = error || (shown === "malformed" ? `${malformedDate ? dateLabel : timeLabel} is not a valid ${malformedDate ? "date" : "time"}.` : null) || (shown === "nonexistent" ? `${time} does not exist on ${date} in ${abbr || zone} \u2014 the clock moves forward through that hour. Choose a time on either side of it.` : null) || (shown === "bounds" ? `Must be between ${lo ? lo.full.replace("T", " ") : "\u2014"} and ${hi ? hi.full.replace("T", " ") : "\u2014"}${abbr ? ` ${abbr}` : ""}.` : null) || (shown === "partial" ? `Both ${dateLabel.toLowerCase()} and ${timeLabel.toLowerCase()} are required \u2014 neither half is assumed.` : null);
    const note = !message && built.ambiguous ? `${time} occurs twice on ${date} in ${abbr || zone} \u2014 the clock moves back through that hour. The first occurrence is used.` : null;
    const dateInvalid = !!field?.invalid || !!error || malformedDate || dateOutside || below || above || built.shifted || partialShown && !date;
    const timeInvalid = !!field?.invalid || !!error || malformedTime || below || above || built.shifted || partialShown && !time;
    const changed = import_react11.default.useRef();
    import_react11.default.useEffect(() => {
      const key = `${valid}|${reason || ""}`;
      if (changed.current === key) return;
      changed.current = key;
      onValidityChange?.({ valid, reason, complete });
    }, [valid, reason, complete]);
    const timeMin = date && lo && lo.date === date ? lo.full.slice(11) : void 0;
    const timeMax = date && hi && hi.date === date ? hi.full.slice(11) : void 0;
    const emit2 = (nextDate, nextTime) => {
      const whole = !!nextDate && !!nextTime;
      const parts = { date: nextDate, time: nextTime, complete: whole, zone: zoned ? zone : void 0 };
      if (!zoned) {
        setPending(whole ? {} : { date: nextDate, time: nextTime });
        onChange?.(whole ? `${nextDate}T${nextTime}` : void 0, parts);
        return;
      }
      const b = whole ? instantFrom(nextDate, nextTime, zone) : { instant: void 0, shifted: false, ambiguous: false };
      const emitted = whole && !b.shifted ? b.instant : void 0;
      setPending(emitted ? {} : { date: nextDate, time: nextTime });
      onChange?.(emitted, { ...parts, shifted: b.shifted, ambiguous: b.ambiguous });
    };
    const stacked = layout === "stacked";
    const rowStyle = stacked ? { display: "flex", flexDirection: "column", gap: "var(--date-time-gap)", minWidth: 0 } : {
      display: "flex",
      flexDirection: "row",
      flexWrap: layout === "inline" ? "nowrap" : "wrap",
      alignItems: "flex-start",
      gap: "var(--date-time-gap)",
      minWidth: 0
    };
    const col2 = (grow) => stacked || layout === "inline" ? { display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 0, flex: `${grow} 1 0` } : {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)",
      flex: `${grow} 1 ${Math.round((MIN_ROW[size] || MIN_ROW.md) * (grow === 3 ? 0.58 : 0.34))}px`,
      minWidth: `min(100%, ${grow === 3 ? 168 : 116}px)`
    };
    const describedBy = (own) => [field?.describedBy, hint ? hintId : null, own, note ? noteId : null, message ? errId : null].filter(Boolean).join(" ") || void 0;
    const dateCtx = import_react11.default.useMemo(
      () => ({ id: dateId, describedBy: describedBy(dateHint ? dateHintId : null), invalid: dateInvalid, required: !!field?.required }),
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
      [dateId, field?.describedBy, field?.required, hint, dateHint, dateInvalid, message, note]
    );
    const timeCtx = import_react11.default.useMemo(
      () => ({ id: timeId, describedBy: describedBy(timeHint ? timeHintId : null), invalid: timeInvalid, required: !!field?.required }),
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
      [timeId, field?.describedBy, field?.required, hint, timeHint, timeInvalid, message, note]
    );
    return /* @__PURE__ */ import_react11.default.createElement(
      Box,
      {
        role: "group",
        "aria-label": !field && label ? label : void 0,
        "aria-labelledby": field?.labelId,
        ...rest,
        display: "flex",
        style: { flexDirection: "column", gap: "var(--space-1)", minWidth: 0, ...style }
      },
      label && !field ? /* @__PURE__ */ import_react11.default.createElement(Text, { size: "xs", weight: "medium", style: { color: "var(--field-label-text)" } }, label) : null,
      /* @__PURE__ */ import_react11.default.createElement("div", { style: rowStyle }, /* @__PURE__ */ import_react11.default.createElement("div", { style: col2(3), onBlur: blurred("date") }, /* @__PURE__ */ import_react11.default.createElement(Text, { as: "label", htmlFor: dateId, size: "xs", weight: "medium", style: { color: "var(--field-label-text)" } }, dateLabel), /* @__PURE__ */ import_react11.default.createElement(FieldContext.Provider, { value: dateCtx }, /* @__PURE__ */ import_react11.default.createElement(
        DatePicker,
        {
          label: [label, dateLabel].filter(Boolean).join(" "),
          value: date,
          onChange: (iso) => emit2(iso, time),
          min: lo?.date,
          max: hi?.date,
          isDateDisabled,
          weekStartsOn,
          size,
          disabled,
          readOnly,
          clearable
        }
      )), dateHint ? /* @__PURE__ */ import_react11.default.createElement(Text, { id: dateHintId, size: "xs", tone: "tertiary", measure: "hint" }, dateHint) : null), /* @__PURE__ */ import_react11.default.createElement("div", { style: col2(2), onBlur: blurred("time") }, /* @__PURE__ */ import_react11.default.createElement(Text, { as: "label", htmlFor: timeId, size: "xs", weight: "medium", style: { color: "var(--field-label-text)" } }, timeLabel), /* @__PURE__ */ import_react11.default.createElement(FieldContext.Provider, { value: timeCtx }, /* @__PURE__ */ import_react11.default.createElement(
        TimeField,
        {
          value: time,
          onChange: (hm) => emit2(date, hm),
          min: timeMin,
          max: timeMax,
          step: step2,
          zone: abbr,
          size,
          disabled,
          readOnly,
          clearable
        }
      )), timeHint ? /* @__PURE__ */ import_react11.default.createElement(Text, { id: timeHintId, size: "xs", tone: "tertiary", measure: "hint" }, timeHint) : null)),
      hint ? /* @__PURE__ */ import_react11.default.createElement(Text, { id: hintId, size: "xs", tone: "tertiary", measure: "hint" }, hint) : null,
      note ? /* @__PURE__ */ import_react11.default.createElement(Text, { id: noteId, size: "xs", tone: "tertiary", measure: "hint" }, note) : null,
      /* @__PURE__ */ import_react11.default.createElement("span", { id: errId, role: "alert", style: message ? { display: "flex", alignItems: "flex-start", gap: "var(--field-message-gap)", fontSize: "var(--text-xs)", color: "var(--field-error-text)" } : { display: "none" } }, message ? /* @__PURE__ */ import_react11.default.createElement(import_react11.default.Fragment, null, /* @__PURE__ */ import_react11.default.createElement(Icon, { name: "circle-alert", size: "xs", "aria-hidden": "true", style: { flex: "none", marginTop: 2 } }), message) : null)
    );
  }

  // components/composite/FileUpload.jsx
  var import_react14 = __toESM(require_react(), 1);

  // components/forms/FileDropzone.jsx
  var import_react12 = __toESM(require_react(), 1);
  var SIZES3 = { sm: { pad: 14, gap: 6 }, md: { pad: 22, gap: 10 } };
  function formatBytes(bytes) {
    if (bytes == null || Number.isNaN(bytes)) return "";
    if (bytes < 1024) return bytes + " B";
    const kb = bytes / 1024;
    if (kb < 1024) return (kb < 10 ? kb.toFixed(1) : Math.round(kb)) + " KB";
    const mb = kb / 1024;
    if (mb < 1024) return (mb < 10 ? mb.toFixed(1) : Math.round(mb)) + " MB";
    return (mb / 1024).toFixed(1) + " GB";
  }
  function matchesAccept(file, accept) {
    if (!accept) return true;
    const name = (file.name || "").toLowerCase();
    return accept.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean).some((p) => {
      if (p.startsWith(".")) return name.endsWith(p);
      if (p.endsWith("/*")) return (file.type || "").startsWith(p.slice(0, -1));
      return (file.type || "") === p;
    });
  }
  function validateFiles(files, { accept, maxSize, maxFiles, currentCount = 0 } = {}) {
    const accepted = [];
    const rejected = [];
    let room = maxFiles == null ? Infinity : Math.max(0, maxFiles - currentCount);
    for (const file of files) {
      if (!matchesAccept(file, accept)) {
        rejected.push({ file, reason: "type" });
        continue;
      }
      if (maxSize != null && file.size > maxSize) {
        rejected.push({ file, reason: "size" });
        continue;
      }
      if (room <= 0) {
        rejected.push({ file, reason: "count" });
        continue;
      }
      room -= 1;
      accepted.push(file);
    }
    return { accepted, rejected };
  }
  var GLYPHS = {
    "file-text": ["pdf", "doc", "docx", "rtf", "txt", "md"],
    "file-spreadsheet": ["csv", "xls", "xlsx", "tsv"],
    "file-image": ["png", "jpg", "jpeg", "gif", "webp", "bmp", "tif", "tiff", "svg"],
    "file-box": ["dwg", "dxf", "step", "stp", "iges", "igs", "stl", "sldprt", "sldasm"],
    "file-code": ["xml", "json", "yaml", "yml", "html", "js", "ts", "sql"],
    "file-archive": ["zip", "rar", "7z", "tar", "gz"],
    "file-audio": ["mp3", "wav", "m4a"],
    "file-video": ["mp4", "mov", "avi", "mkv"]
  };
  var BY_EXT = Object.entries(GLYPHS).reduce((acc, [glyph, exts]) => {
    for (const e of exts) acc[e] = glyph;
    return acc;
  }, {});
  function FileDropzone({
    label = "Drop files here, or browse",
    hint,
    accept,
    multiple = false,
    maxSize,
    maxFiles,
    currentCount = 0,
    disabled = false,
    invalid: invalidProp = false,
    size = "md",
    onSelect,
    style,
    ...rest
  }) {
    const inputRef = import_react12.default.useRef(null);
    const [over, setOver] = import_react12.default.useState(false);
    const [hover, setHover] = import_react12.default.useState(false);
    const [focus, setFocus] = import_react12.default.useState(false);
    const autoId = import_react12.default.useId();
    const hintId = hint ? autoId + "-hint" : void 0;
    const s = SIZES3[size] || SIZES3.md;
    const field = import_react12.default.useContext(FieldContext);
    const id = field?.id || autoId;
    const invalid = invalidProp || !!field?.invalid;
    const describedBy = rest["aria-describedby"] ?? [field?.describedBy, hintId].filter(Boolean).join(" ") ?? void 0;
    import_react12.default.useEffect(() => {
      field?.claimGroup?.();
    }, [field]);
    if (!onSelect) {
      console.warn("[Meridian] FileDropzone: no onSelect. The component does not hold files \u2014 without a handler the selection is discarded.");
    }
    if (maxFiles != null && maxFiles > 1 && !multiple) {
      console.warn("[Meridian] FileDropzone: maxFiles > 1 with multiple={false}. The picker will only ever return one file.");
    }
    function take(fileList) {
      const files = Array.from(fileList || []);
      if (!files.length) return;
      const list = multiple ? files : files.slice(0, 1);
      const result = validateFiles(list, { accept, maxSize, maxFiles, currentCount });
      if (!multiple && files.length > 1) {
        for (const f of files.slice(1)) result.rejected.push({ file: f, reason: "count" });
      }
      onSelect?.(result.accepted, result.rejected);
    }
    const border = disabled ? "var(--border-subtle)" : invalid ? "var(--status-critical-solid)" : over || hover ? "var(--border-control-hover)" : "var(--border-control)";
    return /* @__PURE__ */ import_react12.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0, ...style } }, /* @__PURE__ */ import_react12.default.createElement(
      "div",
      {
        ...field?.labelId ? { role: "group", "aria-labelledby": field.labelId } : null,
        onDragOver: (e) => {
          if (disabled) return;
          e.preventDefault();
          setOver(true);
        },
        onDragLeave: () => setOver(false),
        onDrop: (e) => {
          if (disabled) return;
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer?.files);
        },
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: s.gap,
          padding: s.pad,
          textAlign: "center",
          minWidth: 0,
          /* Dashed, so the target reads as a place to put something rather
             than as a card. */
          border: "var(--border-width) dashed " + border,
          borderRadius: "var(--radius-md)",
          background: disabled ? "var(--surface-disabled)" : over ? "var(--surface-selected)" : "var(--surface-sunken)",
          boxShadow: focus ? invalid ? "var(--input-focus-ring-invalid)" : "var(--input-focus-ring)" : "none",
          transition: "var(--transition-control)"
        }
      },
      /* @__PURE__ */ import_react12.default.createElement(
        "input",
        {
          ref: inputRef,
          type: "file",
          ...rest,
          accept,
          multiple,
          disabled,
          required: rest.required ?? field?.required,
          "aria-invalid": invalid || void 0,
          "aria-describedby": describedBy || void 0,
          onFocus: (e) => {
            setFocus(e.target.matches(":focus-visible"));
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocus(false);
            rest.onBlur?.(e);
          },
          onChange: (e) => {
            take(e.target.files);
            e.target.value = "";
          },
          style: { position: "absolute", opacity: 0, width: 0, height: 0 },
          id
        }
      ),
      /* @__PURE__ */ import_react12.default.createElement(
        "label",
        {
          htmlFor: id,
          style: {
            fontSize: size === "sm" ? "var(--text-xs)" : "var(--text-sm)",
            color: disabled ? "var(--text-disabled)" : "var(--text-primary)",
            cursor: disabled ? "not-allowed" : "pointer",
            minHeight: "var(--control-h-sm)",
            display: "inline-flex",
            alignItems: "center"
          }
        },
        label
      ),
      hint && /* @__PURE__ */ import_react12.default.createElement("span", { id: hintId, style: { fontSize: "var(--text-xs)", color: disabled ? "var(--text-disabled)" : "var(--text-tertiary)", textWrap: "pretty" } }, hint)
    ));
  }

  // components/forms/FileItem.jsx
  var import_react13 = __toESM(require_react(), 1);
  var STATE_TEXT = {
    queued: "Queued",
    uploading: "Uploading",
    complete: "",
    failed: "Failed"
  };
  function FileItem({
    name,
    size,
    state = "complete",
    progress,
    error,
    meta,
    onRemove,
    onRetry,
    disabled = false,
    style,
    ...rest
  }) {
    const autoId = import_react13.default.useId();
    const failed = state === "failed";
    const uploading = state === "uploading";
    if (uploading && progress == null) {
      console.warn('[Meridian] FileItem: state="uploading" with no progress. An indeterminate upload cannot be distinguished from a stalled one \u2014 pass a number, or use state="queued".');
    }
    const secondary = [formatBytes(size), meta].filter(Boolean).join(" \xB7 ");
    const status = failed ? error || STATE_TEXT.failed : uploading ? Math.round(progress ?? 0) + "%" : STATE_TEXT[state];
    return /* @__PURE__ */ import_react13.default.createElement(
      "div",
      {
        ...rest,
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--space-3)",
          minWidth: 0,
          padding: "8px 10px",
          border: "var(--border-width) solid " + (failed ? "var(--status-critical-border)" : "var(--border-subtle)"),
          borderRadius: "var(--radius-sm)",
          background: failed ? "var(--status-critical-soft)" : "var(--surface-card)",
          ...style
        }
      },
      /* @__PURE__ */ import_react13.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 3, minWidth: 0, flex: "1 1 auto" } }, /* @__PURE__ */ import_react13.default.createElement("span", { style: {
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        color: disabled ? "var(--text-disabled)" : "var(--text-primary)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }, title: name }, name), /* @__PURE__ */ import_react13.default.createElement("span", { style: { display: "flex", gap: 8, fontSize: "var(--text-2xs)", color: failed ? "var(--text-critical)" : "var(--text-tertiary)" } }, secondary && /* @__PURE__ */ import_react13.default.createElement("span", null, secondary), status && /* @__PURE__ */ import_react13.default.createElement("span", { role: uploading || failed ? "status" : void 0, id: autoId + "-status" }, status)), uploading && /* Determinate only: the bar is the progress prop, never an animation
         the component invents. */
      /* @__PURE__ */ import_react13.default.createElement(
        "div",
        {
          role: "progressbar",
          "aria-valuenow": Math.round(progress ?? 0),
          "aria-valuemin": 0,
          "aria-valuemax": 100,
          "aria-label": "Uploading " + name,
          style: { height: 3, borderRadius: "var(--radius-pill)", background: "var(--surface-track)", overflow: "hidden", marginTop: 2 }
        },
        /* @__PURE__ */ import_react13.default.createElement("div", { style: { width: Math.max(0, Math.min(100, progress ?? 0)) + "%", height: "100%", background: "var(--action-solid)", transition: "width var(--duration-fast) var(--ease-out)" } })
      )),
      /* @__PURE__ */ import_react13.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, flex: "0 0 auto" } }, failed && onRetry && /* @__PURE__ */ import_react13.default.createElement(Button, { variant: "secondary", size: "sm", iconLeft: "rotate-ccw", onClick: onRetry, disabled }, "Retry"), onRemove && /* @__PURE__ */ import_react13.default.createElement(
        IconButton,
        {
          icon: "x",
          size: "sm",
          variant: "ghost",
          disabled,
          label: (uploading ? "Cancel upload of " : "Remove ") + name,
          onClick: onRemove
        }
      ))
    );
  }

  // components/composite/FileUpload.jsx
  var REASON = {
    type: "is not an accepted file type",
    size: "is over the size limit",
    count: "is over the file limit"
  };
  function deriveStatus(value = [], { required = false, rejected = 0 } = {}) {
    if (rejected > 0 || required && value.length === 0) return "invalid";
    if (value.some((f) => f.state === "failed")) return "failed";
    if (value.some((f) => f.state === "uploading" || f.state === "queued")) return "busy";
    return "idle";
  }
  var newId = () => globalThis.crypto?.randomUUID?.() || "f" + Math.random().toString(36).slice(2, 10);
  function FileUpload({
    value = [],
    onChange,
    label,
    targetLabel,
    hint,
    error,
    required = false,
    requiredMessage,
    showRequired = false,
    accept,
    maxSize,
    maxFiles,
    size = "md",
    disabled = false,
    onStatusChange,
    style,
    ...rest
  }) {
    const wrapRef = import_react14.default.useRef(null);
    const [rejections, setRejections] = import_react14.default.useState([]);
    const [announcement, setAnnouncement] = import_react14.default.useState("");
    const [focusRow, setFocusRow] = import_react14.default.useState(null);
    const [touched, setTouched] = import_react14.default.useState(false);
    const multiple = maxFiles !== 1;
    import_react14.default.useEffect(() => {
      if (label) return void 0;
      const t = window.setTimeout(() => {
        console.warn("[Meridian] FileUpload: no label. The set is ONE form field with several values; the label names the set, and the dropzone borrows it as the group name.");
      }, 0);
      return () => window.clearTimeout(t);
    }, [label]);
    const status = deriveStatus(value, { required, rejected: rejections.length });
    const lastStatus = import_react14.default.useRef(null);
    import_react14.default.useEffect(() => {
      if (lastStatus.current === status) return;
      lastStatus.current = status;
      onStatusChange?.(status);
    }, [status, onStatusChange]);
    const derivedError = error ?? (rejections.length ? rejections.length === 1 ? rejections[0] : `${rejections.length} files were refused: ${rejections.join("; ")}` : status === "failed" ? "One file did not upload. Retry it, or remove it." : status === "invalid" && (touched || showRequired) ? requiredMessage ?? "At least one file is required." : void 0);
    import_react14.default.useEffect(() => {
      if (focusRow == null) return;
      const rows = wrapRef.current?.querySelectorAll("[data-file-row]") || [];
      const row = rows[Math.min(focusRow, rows.length - 1)];
      const buttons = row?.querySelectorAll("button");
      if (buttons?.length) buttons[buttons.length - 1].focus();
      else wrapRef.current?.querySelector('input[type="file"]')?.focus();
      setFocusRow(null);
    }, [focusRow, value.length]);
    function warnIfUnwired(what) {
      if (!onChange) {
        console.warn("[Meridian] FileUpload: " + what + " was discarded \u2014 no onChange. The set is controlled, so the queue lives with whoever owns the transport; without a handler nothing the operator does survives.");
      }
    }
    function onSelect(accepted, rejected) {
      warnIfUnwired(accepted.length + " file(s)");
      setTouched(true);
      setRejections(rejected.map((r) => `${r.file.name} ${REASON[r.reason]}`));
      const added = accepted.map((file) => ({
        id: newId(),
        file,
        name: file.name,
        size: file.size,
        state: "queued"
      }));
      if (added.length) onChange?.([...value, ...added]);
      const parts = [];
      if (added.length) parts.push(`${added.length} file${added.length === 1 ? "" : "s"} added`);
      if (rejected.length) parts.push(`${rejected.length} refused`);
      setAnnouncement(parts.join(", "));
    }
    function removeAt(index) {
      if (disabled) return;
      warnIfUnwired("a removal");
      setTouched(true);
      const next = value.filter((_, i) => i !== index);
      onChange?.(next);
      setRejections([]);
      setAnnouncement(`${value[index]?.name} removed`);
      setFocusRow(next.length ? index : null);
      if (!next.length) {
        window.setTimeout(() => wrapRef.current?.querySelector('input[type="file"]')?.focus(), 0);
      }
    }
    function patch(index, changes) {
      onChange?.(value.map((f, i) => i === index ? { ...f, ...changes } : f));
    }
    return /* @__PURE__ */ import_react14.default.createElement("div", { ref: wrapRef, ...rest, style: { minWidth: 0, ...style } }, /* @__PURE__ */ import_react14.default.createElement(Field, { label, error: derivedError, required }, /* @__PURE__ */ import_react14.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 } }, /* @__PURE__ */ import_react14.default.createElement(
      FileDropzone,
      {
        size,
        label: targetLabel,
        hint,
        accept,
        multiple,
        maxSize,
        maxFiles,
        currentCount: value.length,
        disabled,
        onSelect
      }
    ), value.map((f, i) => /* @__PURE__ */ import_react14.default.createElement(
      FileItem,
      {
        key: f.id ?? i,
        "data-file-row": "",
        name: f.name,
        size: f.size,
        meta: f.meta,
        state: f.state,
        progress: f.progress,
        error: f.error,
        disabled,
        onRemove: () => removeAt(i),
        onRetry: f.state === "failed" ? f.onRetry ? () => f.onRetry(f) : () => patch(i, { state: "uploading", progress: 0, error: void 0 }) : void 0
      }
    )))), /* @__PURE__ */ import_react14.default.createElement("span", { "aria-live": "polite", style: { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" } }, announcement));
  }

  // components/composite/ScopePicker.jsx
  var import_react18 = __toESM(require_react(), 1);

  // components/data/Tree.jsx
  var import_react15 = __toESM(require_react(), 1);
  var ROW_H = { sm: "var(--tree-row-height-sm)", md: "var(--tree-row-height-md)" };
  var LABEL = { sm: "var(--text-xs)", md: "var(--text-sm)" };
  var has = (n) => !!(n.children && n.children.length || n.hasChildren);
  function flatten(items, expanded, level = 0, parentId = null, out = []) {
    items.forEach((node, i) => {
      const branch = has(node);
      const open = branch && expanded.has(node.id);
      out.push({ id: node.id, node, level, parentId, branch, open, posinset: i + 1, setsize: items.length });
      if (open && node.children && node.children.length) flatten(node.children, expanded, level + 1, node.id, out);
    });
    return out;
  }
  function descendantIds(node, acc = []) {
    (node.children || []).forEach((c) => {
      acc.push(c.id);
      descendantIds(c, acc);
    });
    return acc;
  }
  function TreeRow({ node, level, posinset, setsize, branch, open, size, selection, isSelected, partial, busy, tabbable, guides, registerRef, onRowClick, onChevron, onKeys, onFocusRow, children }) {
    const [hover, setHover] = import_react15.default.useState(false);
    const [twisty, setTwisty] = import_react15.default.useState(false);
    const [focus, setFocus] = import_react15.default.useState(false);
    const disabled = !!node.disabled;
    return /* @__PURE__ */ import_react15.default.createElement(
      "li",
      {
        ref: registerRef,
        role: "treeitem",
        tabIndex: tabbable ? 0 : -1,
        "aria-expanded": branch ? open : void 0,
        "aria-selected": selection === "none" ? void 0 : isSelected,
        "aria-level": level + 1,
        "aria-posinset": posinset,
        "aria-setsize": setsize,
        "aria-disabled": disabled || void 0,
        "aria-busy": busy || void 0,
        onFocus: (e) => {
          if (e.target !== e.currentTarget) return;
          setFocus(e.target.matches(":focus-visible"));
          onFocusRow();
        },
        onBlur: (e) => {
          if (e.target === e.currentTarget) setFocus(false);
        },
        onKeyDown: (e) => {
          if (e.target === e.currentTarget) onKeys(e);
        },
        style: { listStyle: "none", margin: 0, padding: 0, outline: "none", minWidth: 0 }
      },
      /* @__PURE__ */ import_react15.default.createElement(
        "div",
        {
          onClick: disabled ? void 0 : onRowClick,
          onMouseEnter: () => setHover(true),
          onMouseLeave: () => setHover(false),
          style: {
            display: "flex",
            alignItems: "center",
            gap: "var(--tree-row-gap)",
            padding: "0 var(--tree-row-padding-x)",
            minHeight: ROW_H[size] || ROW_H.md,
            borderRadius: "var(--tree-row-radius)",
            background: isSelected ? "var(--tree-row-background-selected)" : hover && !disabled ? "var(--tree-row-background-hover)" : "transparent",
            color: disabled ? "var(--tree-row-text-disabled)" : isSelected ? "var(--tree-row-text-selected)" : branch ? "var(--tree-branch-text)" : "var(--tree-leaf-text)",
            fontSize: LABEL[size] || LABEL.md,
            fontWeight: branch ? "var(--weight-medium)" : "var(--weight-regular)",
            cursor: disabled ? "not-allowed" : "default",
            userSelect: "none",
            boxShadow: focus ? "var(--tree-focus-ring)" : "none",
            position: "relative",
            zIndex: focus ? 1 : void 0,
            transition: "background-color var(--duration-fast) var(--ease-out)",
            minWidth: 0
          }
        },
        /* @__PURE__ */ import_react15.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            onClick: branch && !disabled ? onChevron : void 0,
            onMouseEnter: () => setTwisty(true),
            onMouseLeave: () => setTwisty(false),
            style: { flex: "0 0 auto", width: 16, height: 16, display: "grid", placeItems: "center", color: branch && twisty && !disabled ? "var(--tree-chevron-hover)" : "var(--tree-chevron)", cursor: branch && !disabled ? "pointer" : "default", transition: "color var(--duration-fast) var(--ease-out)" }
          },
          branch ? /* @__PURE__ */ import_react15.default.createElement(Icon, { name: open ? "chevron-down" : "chevron-right", size: "xs" }) : null
        ),
        selection === "multiple" && /* @__PURE__ */ import_react15.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            style: {
              flex: "0 0 auto",
              width: 14,
              height: 14,
              display: "grid",
              placeItems: "center",
              borderRadius: "var(--radius-xs)",
              border: isSelected || partial ? "none" : "var(--border-width) solid var(--tree-indicator-border)",
              background: isSelected || partial ? "var(--tree-indicator-background-selected)" : "var(--tree-indicator-background)",
              color: "var(--tree-indicator-foreground)"
            }
          },
          isSelected ? /* @__PURE__ */ import_react15.default.createElement(Icon, { name: "check", size: "mark" }) : partial ? /* @__PURE__ */ import_react15.default.createElement(Icon, { name: "minus", size: "mark" }) : null
        ),
        node.icon && /* @__PURE__ */ import_react15.default.createElement("span", { "aria-hidden": "true", style: { flex: "0 0 auto", display: "grid", placeItems: "center", color: isSelected ? "inherit" : "var(--tree-leading-foreground)" } }, /* @__PURE__ */ import_react15.default.createElement(Icon, { name: node.icon, size: "xs" })),
        /* @__PURE__ */ import_react15.default.createElement("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, node.label),
        busy && /* @__PURE__ */ import_react15.default.createElement("span", { style: { flex: "0 0 auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--tree-meta-text)" } }, "Loading\u2026"),
        !busy && node.meta != null && /* @__PURE__ */ import_react15.default.createElement("span", { style: { flex: "0 0 auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", fontVariantNumeric: "tabular-nums", color: "var(--tree-meta-text)", whiteSpace: "nowrap" } }, node.meta),
        node.trailing != null && /* @__PURE__ */ import_react15.default.createElement("span", { style: { flex: "0 0 auto", display: "flex", alignItems: "center" } }, node.trailing)
      ),
      children
    );
  }
  function Tree({
    items = [],
    label,
    size = "md",
    selection = "none",
    selectedIds = [],
    onSelectionChange,
    /* Selecting a branch selects everything under it. OFF by default, because
       it changes what a parent's selection MEANS — with cascade "Press shop"
       stands for its four presses; without it "Press shop" is its own answer.
       A component cannot guess which one the product asked for. */
    cascade = false,
    expandedIds,
    defaultExpandedIds = [],
    onExpandedChange,
    onActivate,
    /* Ids whose children are being fetched. The parent row goes aria-busy and
       says so inline; it does NOT grow a placeholder child row, because a row
       inside role="group" that is not a treeitem is invalid structure, and one
       that is becomes a focus stop for a thing that does not exist yet. */
    loadingIds = [],
    guides = true,
    style,
    ...rest
  }) {
    const controlled = expandedIds != null;
    const [ownExpanded, setOwnExpanded] = import_react15.default.useState(() => new Set(defaultExpandedIds));
    const expanded = import_react15.default.useMemo(() => new Set(controlled ? expandedIds : ownExpanded), [controlled, expandedIds, ownExpanded]);
    const loading = import_react15.default.useMemo(() => new Set(loadingIds), [loadingIds]);
    const selected = import_react15.default.useMemo(() => new Set(selectedIds), [selectedIds]);
    const rows = import_react15.default.useMemo(() => flatten(items, expanded), [items, expanded]);
    const [focusId, setFocusId] = import_react15.default.useState(null);
    const nodeRefs = import_react15.default.useRef(/* @__PURE__ */ new Map());
    const typeahead = import_react15.default.useRef({ buf: "", at: 0 });
    const wantFocus = import_react15.default.useRef(false);
    import_react15.default.useEffect(() => {
      if (!wantFocus.current) return;
      wantFocus.current = false;
      const el = nodeRefs.current.get(focusId);
      if (el) el.focus();
    }, [focusId]);
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] Tree: no `label`. A tree announces level and position but never its subject \u2014 name it ("Plant assets", "BOM \xB7 BRK-4820-A") or point aria-labelledby at the heading above it.');
    }
    const first = rows[0] && rows[0].id;
    const tabId = rows.some((r) => r.id === focusId) ? focusId : (selection !== "none" && rows.find((r) => selected.has(r.id)) || {}).id || first;
    const setExpanded = (next) => {
      if (onExpandedChange) onExpandedChange([...next]);
      if (!controlled) setOwnExpanded(next);
    };
    const toggle = (row, open) => {
      if (!row.branch) return;
      const next = new Set(expanded);
      const wantOpen = open == null ? !next.has(row.id) : open;
      if (wantOpen) next.add(row.id);
      else next.delete(row.id);
      setExpanded(next);
    };
    const move = (id) => {
      if (id == null) return;
      wantFocus.current = true;
      setFocusId(id);
    };
    const select = (row) => {
      if (row.node.disabled) return;
      if (selection === "none") {
        if (onActivate) onActivate(row.node);
        return;
      }
      if (selection === "single") {
        if (onSelectionChange) onSelectionChange([row.id]);
        if (onActivate) onActivate(row.node);
        return;
      }
      const next = new Set(selected);
      const ids = cascade ? [row.id, ...descendantIds(row.node)] : [row.id];
      if (next.has(row.id)) ids.forEach((i) => next.delete(i));
      else ids.forEach((i) => next.add(i));
      if (onSelectionChange) onSelectionChange([...next]);
    };
    const onKeys = (e) => {
      const i = rows.findIndex((r) => r.id === tabId);
      if (i < 0) return;
      const row = rows[i];
      const key = e.key;
      if (key === "ArrowDown") {
        e.preventDefault();
        move((rows[i + 1] || row).id);
        return;
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        move((rows[i - 1] || row).id);
        return;
      }
      if (key === "Home") {
        e.preventDefault();
        move(rows[0].id);
        return;
      }
      if (key === "End") {
        e.preventDefault();
        move(rows[rows.length - 1].id);
        return;
      }
      if (key === "ArrowRight") {
        e.preventDefault();
        if (row.branch && !row.open) toggle(row, true);
        else if (row.open && rows[i + 1] && rows[i + 1].parentId === row.id) move(rows[i + 1].id);
        return;
      }
      if (key === "ArrowLeft") {
        e.preventDefault();
        if (row.branch && row.open) toggle(row, false);
        else if (row.parentId != null) move(row.parentId);
        return;
      }
      if (key === "Enter") {
        e.preventDefault();
        select(row);
        return;
      }
      if (key === " ") {
        e.preventDefault();
        if (selection === "none" && row.branch) toggle(row);
        else select(row);
        return;
      }
      if (key === "*") {
        e.preventDefault();
        const next = new Set(expanded);
        rows.filter((r) => r.parentId === row.parentId && r.branch).forEach((r) => next.add(r.id));
        setExpanded(next);
        return;
      }
      if (key.length === 1 && /\S/.test(key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const now = Date.now();
        const ta = typeahead.current;
        ta.buf = now - ta.at < 700 ? ta.buf + key.toLowerCase() : key.toLowerCase();
        ta.at = now;
        const order = [...rows.slice(i + 1), ...rows.slice(0, i + 1)];
        const hit = order.find((r) => String(r.node.label || "").toLowerCase().startsWith(ta.buf));
        if (hit) move(hit.id);
      }
    };
    const renderLevel = (list, level, parentId) => /* @__PURE__ */ import_react15.default.createElement(
      "ul",
      {
        role: level === 0 ? void 0 : "group",
        style: {
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          ...level > 0 ? guides ? { marginLeft: "var(--tree-indent)", borderLeft: "var(--border-width) solid var(--tree-guide)", paddingLeft: 2 } : { marginLeft: "var(--tree-indent)" } : null
        }
      },
      list.map((node, idx) => {
        const branch = has(node);
        const open = branch && expanded.has(node.id);
        const isSelected = selected.has(node.id);
        const row = { id: node.id, node, level, parentId, branch, open };
        return /* @__PURE__ */ import_react15.default.createElement(
          TreeRow,
          {
            key: node.id,
            node,
            level,
            posinset: idx + 1,
            setsize: list.length,
            branch,
            open,
            size,
            selection,
            isSelected,
            partial: selection === "multiple" && !isSelected && descendantIds(node).some((d) => selected.has(d)),
            busy: loading.has(node.id),
            tabbable: tabId === node.id,
            guides,
            registerRef: (el) => {
              if (el) nodeRefs.current.set(node.id, el);
              else nodeRefs.current.delete(node.id);
            },
            onFocusRow: () => setFocusId(node.id),
            onKeys,
            onChevron: (e) => {
              e.stopPropagation();
              setFocusId(node.id);
              toggle(row);
            },
            onRowClick: () => {
              setFocusId(node.id);
              if (selection === "none" && branch) toggle(row);
              else select(row);
            }
          },
          open && node.children && node.children.length ? renderLevel(node.children, level + 1, node.id) : null
        );
      })
    );
    return /* @__PURE__ */ import_react15.default.createElement(
      "div",
      {
        ...rest,
        role: "tree",
        "aria-label": label || rest["aria-label"],
        "aria-multiselectable": selection === "multiple" ? true : void 0,
        style: { minWidth: 0, ...style }
      },
      renderLevel(items, 0, null)
    );
  }

  // components/composite/SearchField.jsx
  var import_react17 = __toESM(require_react(), 1);

  // components/forms/Input.jsx
  var import_react16 = __toESM(require_react(), 1);
  var H3 = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  var PX3 = { sm: "var(--control-px-sm)", md: "var(--control-px-md)", lg: "var(--control-px-lg)" };
  var FS = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-lg)" };
  var IS = { sm: "xs", md: "xs", lg: "sm" };
  var Input = import_react16.default.forwardRef(function Input2({
    size = "md",
    iconLeft,
    suffix,
    invalid = false,
    mono = false,
    disabled = false,
    readOnly = false,
    style,
    ...rest
  }, forwarded) {
    const field = import_react16.default.useContext(FieldContext);
    const ref = import_react16.default.useRef(null);
    const setRef = (el) => {
      ref.current = el;
      if (typeof forwarded === "function") forwarded(el);
      else if (forwarded) forwarded.current = el;
    };
    const [focus, setFocus] = import_react16.default.useState(false);
    const [hover, setHover] = import_react16.default.useState(false);
    const id = rest.id ?? field?.id;
    const describedBy = rest["aria-describedby"] ?? field?.describedBy;
    const isInvalid = invalid || !!field?.invalid;
    const named = id != null || rest["aria-label"] != null || rest["aria-labelledby"] != null;
    if (!named) {
      console.warn('[Meridian] Input: no accessible name. A placeholder is not a label \u2014 it disappears on the first keystroke and is not announced by every screen reader. Wrap the control in <Field label="\u2026"> (which wires the id automatically) or pass aria-label.');
    }
    if (isInvalid && !describedBy) {
      console.warn('[Meridian] Input: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing \u2014 pass the message through <Field error="\u2026">, which renders it and points the control at it.');
    }
    if (rest.type === "number") {
      console.warn('[Meridian] Input: type="number" mutates the value on mouse wheel while focused, hides digits behind spinners, and silently rejects thousands separators. Use type="text" with inputMode="numeric" (and `mono` for machine values) instead.');
    }
    const border = isInvalid ? "var(--input-border-invalid)" : focus ? "var(--input-border-focus)" : hover && !disabled ? "var(--input-border-hover)" : "var(--input-border)";
    return /* @__PURE__ */ import_react16.default.createElement(
      "div",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onMouseDown: (e) => {
          if (e.target !== ref.current && ref.current && !disabled) {
            e.preventDefault();
            ref.current.focus();
          }
        },
        style: {
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: H3[size] || H3.md,
          padding: `0 ${PX3[size] || PX3.md}`,
          background: disabled ? "var(--input-background-disabled)" : readOnly ? "var(--surface-sunken)" : "var(--input-background)",
          border: `var(--border-width) solid ${border}`,
          borderRadius: "var(--input-radius)",
          boxShadow: focus ? isInvalid ? "var(--input-focus-ring-invalid)" : "var(--input-focus-ring)" : "none",
          color: disabled ? "var(--input-text-disabled)" : "var(--input-icon)",
          cursor: disabled ? "not-allowed" : "text",
          transition: "var(--transition-control)",
          minWidth: 0,
          ...style
        }
      },
      iconLeft && /* @__PURE__ */ import_react16.default.createElement(Icon, { name: iconLeft, size: IS[size] || IS.md }),
      /* @__PURE__ */ import_react16.default.createElement(
        "input",
        {
          ...rest,
          ref: setRef,
          id,
          disabled,
          readOnly,
          "aria-describedby": describedBy,
          "aria-invalid": isInvalid || void 0,
          "aria-required": field?.required || void 0,
          onFocus: (e) => {
            setFocus(true);
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocus(false);
            rest.onBlur?.(e);
          },
          style: {
            flex: 1,
            minWidth: 0,
            height: "100%",
            margin: 0,
            padding: 0,
            border: 0,
            outline: "none",
            background: "transparent",
            fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
            fontSize: FS[size] || FS.md,
            letterSpacing: mono ? "var(--tracking-mono)" : "var(--tracking-body)",
            color: disabled ? "var(--input-text-disabled)" : "var(--input-text)",
            cursor: disabled ? "not-allowed" : "text"
          }
        }
      ),
      suffix && /* @__PURE__ */ import_react16.default.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--text-tertiary)", flex: "0 0 auto" } }, suffix)
    );
  });

  // components/composite/SearchField.jsx
  var CLEAR_SIZE = { sm: "sm", md: "sm", lg: "md" };
  function SearchField({
    label,
    value,
    defaultValue = "",
    onChange,
    onSubmit,
    onClear,
    placeholder,
    submit = "none",
    clearable = true,
    landmark = false,
    size = "md",
    disabled = false,
    readOnly = false,
    hint,
    style,
    ...rest
  }) {
    const controlled = value !== void 0;
    const [inner, setInner] = import_react17.default.useState(defaultValue);
    const q = controlled ? value : inner;
    const hintId = import_react17.default.useId();
    const ref = import_react17.default.useRef(null);
    if (!label) {
      console.warn("[Meridian] SearchField: `label` is required \u2014 a placeholder is not a label (it disappears on the first keystroke), and the field would be announced only as an unnamed search box.");
    }
    if (submit !== "none" && !onSubmit) {
      console.warn('[Meridian] SearchField: submit="' + submit + '" with no `onSubmit`. A submit control that does nothing is worse than none \u2014 either pass a handler or drop to submit="none" and search as the query changes.');
    }
    const set = (next, e) => {
      if (!controlled) setInner(next);
      onChange?.(next, e);
    };
    const clear = (e) => {
      set("", e);
      onClear?.(e);
      ref.current?.focus();
    };
    const fire = (e) => {
      onSubmit?.(q, e);
    };
    const has3 = String(q ?? "").length > 0;
    const showClear = !disabled && !readOnly && (clearable === "always" || clearable === true && has3);
    const field = /* @__PURE__ */ import_react17.default.createElement(
      Input,
      {
        ...rest,
        ref,
        type: "text",
        role: "searchbox",
        "aria-label": label,
        size,
        iconLeft: submit === "icon" ? void 0 : "search",
        placeholder,
        "aria-describedby": hint ? hintId : rest["aria-describedby"],
        disabled,
        readOnly,
        value: q,
        onChange: (e) => set(e.target.value, e),
        onKeyDown: (e) => {
          if (e.key === "Enter" && onSubmit) {
            e.preventDefault();
            fire(e);
          }
          rest.onKeyDown?.(e);
        },
        suffix: showClear ? /* @__PURE__ */ import_react17.default.createElement(
          IconButton,
          {
            icon: "x",
            label: "Clear " + (label || "search"),
            variant: "ghost",
            size: CLEAR_SIZE[size] || "sm",
            onClick: clear,
            disabled: !has3
          }
        ) : null,
        style: { flex: 1, minWidth: 0 }
      }
    );
    return /* @__PURE__ */ import_react17.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 0, ...style } }, /* @__PURE__ */ import_react17.default.createElement(
      "div",
      {
        role: landmark ? "search" : void 0,
        "aria-label": landmark ? label : void 0,
        style: { display: "flex", alignItems: "center", gap: "var(--search-field-gap)", minWidth: 0 }
      },
      field,
      submit === "button" ? /* @__PURE__ */ import_react17.default.createElement(Button, { size, onClick: fire, disabled }, "Search") : null,
      submit === "icon" ? /* @__PURE__ */ import_react17.default.createElement(IconButton, { icon: "search", label: "Run " + (label || "search"), variant: "solid", size, onClick: fire, disabled }) : null
    ), hint ? /* @__PURE__ */ import_react17.default.createElement(Text, { id: hintId, size: "xs", tone: "tertiary", measure: "hint" }, hint) : null);
  }

  // components/composite/ScopePicker.jsx
  var has2 = (n) => !!(n.children && n.children.length || n.hasChildren);
  function walk(nodes, fn, ancestors = []) {
    nodes.forEach((n) => {
      fn(n, ancestors);
      walk(n.children || [], fn, [...ancestors, n]);
    });
  }
  function prune(nodes, q) {
    const out = [];
    nodes.forEach((n) => {
      const kids = prune(n.children || [], q);
      const self = String(n.label || "").toLowerCase().includes(q);
      if (self || kids.length) out.push({ ...n, children: kids.length ? kids : self ? n.children : [] });
    });
    return out;
  }
  function ScopePicker({
    items = [],
    label,
    /* The normalised covering set. A consumer stores exactly this and never
       has to re-derive what a parent stood for. */
    value = [],
    onChange,
    cascade = true,
    size = "md",
    searchable = true,
    searchPlaceholder = "Filter\u2026",
    required = false,
    invalid,
    /* One line under the frame: the failure, in the product's words. The
       composite decides WHEN a scope is unacceptable; only the product can say
       what that costs. */
    requiredMessage = "Select at least one node.",
    /** Names what one leaf is, for the summary: "cost centre" → "3 cost centres". */
    unit = "node",
    expandedIds,
    defaultExpandedIds = [],
    onExpandedChange,
    loadingIds = [],
    hint,
    style,
    ...rest
  }) {
    const [query, setQuery] = import_react18.default.useState("");
    const frameRef = import_react18.default.useRef(null);
    const [ownExpanded, setOwnExpanded] = import_react18.default.useState(() => new Set(defaultExpandedIds));
    const controlled = expandedIds != null;
    const openSet = controlled ? new Set(expandedIds) : ownExpanded;
    if (!label) {
      console.warn('[Meridian] ScopePicker: `label` is required \u2014 it names the scope ("Charge scope"), the tree inside it and, when `searchable`, the filter. Three unnamed controls in one frame.');
    }
    const index = import_react18.default.useMemo(() => {
      const byId = /* @__PURE__ */ new Map();
      const parentOf = /* @__PURE__ */ new Map();
      walk(items, (n, anc) => {
        byId.set(n.id, n);
        if (anc.length) parentOf.set(n.id, anc[anc.length - 1].id);
      });
      return { byId, parentOf };
    }, [items]);
    const resolved2 = import_react18.default.useMemo(() => {
      const leaves = /* @__PURE__ */ new Set();
      let provisional = false;
      const take = (node) => {
        if (!has2(node)) {
          leaves.add(node.id);
          return;
        }
        if (node.hasChildren && !(node.children && node.children.length)) {
          provisional = true;
          leaves.add(node.id);
          return;
        }
        (node.children || []).forEach(take);
      };
      value.forEach((id) => {
        const n = index.byId.get(id);
        if (n) take(n);
      });
      return { count: leaves.size, provisional };
    }, [value, index]);
    const normalise = (ids) => {
      const set = new Set(ids);
      [...set].forEach((id) => {
        let p = index.parentOf.get(id);
        while (p) {
          if (set.has(p)) {
            set.delete(id);
            break;
          }
          p = index.parentOf.get(p);
        }
      });
      if (!cascade) return [...set];
      let changed = true;
      while (changed) {
        changed = false;
        walk(items, (n) => {
          const kids = n.children || [];
          if (!kids.length || set.has(n.id)) return;
          if (kids.every((k) => set.has(k.id)) && !n.hasChildren) {
            kids.forEach((k) => set.delete(k.id));
            set.add(n.id);
            changed = true;
          }
        });
      }
      return [...set];
    };
    const treeSelected = import_react18.default.useMemo(() => {
      const out = /* @__PURE__ */ new Set();
      const take = (node) => {
        out.add(node.id);
        (node.children || []).forEach(take);
      };
      value.forEach((id) => {
        const n = index.byId.get(id);
        if (n) take(n);
      });
      return [...out];
    }, [value, index]);
    const q = query.trim().toLowerCase();
    const shown = q ? prune(items, q) : items;
    const noHits = q && shown.length === 0;
    const filterOpen = import_react18.default.useMemo(() => {
      if (!q) return null;
      const ids = /* @__PURE__ */ new Set();
      walk(shown, (n, anc) => {
        if (has2(n)) ids.add(n.id);
        anc.forEach((a) => ids.add(a.id));
      });
      return [...ids];
    }, [q, shown]);
    const setExpanded = (ids) => {
      if (q) return;
      if (onExpandedChange) onExpandedChange(ids);
      if (!controlled) setOwnExpanded(new Set(ids));
    };
    const isInvalid = invalid != null ? invalid : required && value.length === 0;
    return /* @__PURE__ */ import_react18.default.createElement("div", { ...rest, style: { display: "flex", flexDirection: "column", gap: "var(--scope-picker-gap)", minWidth: 0, ...style } }, /* @__PURE__ */ import_react18.default.createElement(
      "div",
      {
        ref: frameRef,
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 0,
          minWidth: 0,
          background: "var(--scope-picker-background)",
          border: `var(--border-width) solid ${isInvalid ? "var(--scope-picker-border-invalid)" : "var(--scope-picker-border)"}`,
          borderRadius: "var(--scope-picker-radius)",
          overflow: "hidden"
        }
      },
      searchable && /* @__PURE__ */ import_react18.default.createElement(
        "div",
        {
          style: { padding: "var(--scope-picker-tree-padding)", borderBottom: "var(--border-width) solid var(--scope-picker-summary-border)" },
          onKeyDown: (e) => {
            if (e.key === "ArrowDown") {
              const row = frameRef.current && frameRef.current.querySelector('[role="treeitem"][tabindex="0"]');
              if (row) {
                e.preventDefault();
                row.focus();
              }
            } else if (e.key === "Escape" && query) {
              e.preventDefault();
              setQuery("");
            }
          }
        },
        /* @__PURE__ */ import_react18.default.createElement(
          SearchField,
          {
            label: "Filter " + (label || "scope"),
            placeholder: searchPlaceholder,
            value: query,
            onChange: setQuery,
            size
          }
        )
      ),
      /* @__PURE__ */ import_react18.default.createElement(
        "div",
        {
          style: {
            padding: "var(--scope-picker-tree-padding)",
            maxHeight: "var(--scope-picker-tree-max-height)",
            overflow: "auto",
            minWidth: 0
          }
        },
        noHits ? /* @__PURE__ */ import_react18.default.createElement(Text, { size: "xs", tone: "tertiary", style: { display: "block", padding: "6px 4px" } }, "No ", unit, " matches \u201C", query, "\u201D. The scope is unchanged.") : /* @__PURE__ */ import_react18.default.createElement(
          Tree,
          {
            label,
            items: shown,
            size: size === "lg" ? "md" : size,
            selection: "multiple",
            cascade,
            selectedIds: treeSelected,
            onSelectionChange: (ids) => onChange && onChange(normalise(ids)),
            expandedIds: filterOpen || [...openSet],
            onExpandedChange: setExpanded,
            loadingIds
          }
        )
      ),
      /* @__PURE__ */ import_react18.default.createElement(
        "div",
        {
          "aria-live": "polite",
          style: {
            display: "flex",
            alignItems: "baseline",
            gap: "var(--scope-picker-gap)",
            flexWrap: "wrap",
            padding: "var(--scope-picker-summary-padding)",
            background: "var(--scope-picker-summary-background)",
            borderTop: "var(--border-width) solid var(--scope-picker-summary-border)",
            fontSize: "var(--text-xs)",
            color: "var(--scope-picker-summary-text)"
          }
        },
        value.length === 0 ? /* @__PURE__ */ import_react18.default.createElement("span", { style: { color: "var(--scope-picker-empty-text)" } }, "Nothing in scope") : /* @__PURE__ */ import_react18.default.createElement(import_react18.default.Fragment, null, /* @__PURE__ */ import_react18.default.createElement("span", null, /* @__PURE__ */ import_react18.default.createElement("strong", { style: { color: "var(--scope-picker-summary-count-text)", fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)" } }, resolved2.count), " ", resolved2.count === 1 ? unit : unit + "s", " in scope"), /* @__PURE__ */ import_react18.default.createElement("span", { style: { color: "var(--scope-picker-empty-text)" } }, "from ", value.length, " ", value.length === 1 ? "selection" : "selections", value.length < resolved2.count ? " (rolled up)" : ""), resolved2.provisional && /* @__PURE__ */ import_react18.default.createElement("span", { style: { color: "var(--scope-picker-invalid-text)" } }, "Provisional \u2014 a selected branch is not fully loaded."))
      )
    ), isInvalid ? /* @__PURE__ */ import_react18.default.createElement(Text, { size: "xs", tone: "critical", style: { display: "block" } }, requiredMessage) : hint ? /* @__PURE__ */ import_react18.default.createElement(Text, { size: "xs", tone: "tertiary", style: { display: "block" } }, hint) : null);
  }

  // components/composite/SortableCollection.jsx
  var import_react19 = __toESM(require_react(), 1);
  var HANDLE = "grip-vertical";
  var warnedBool = false;
  var scrollParent = (el) => {
    let n = el?.parentElement;
    while (n) {
      const o = getComputedStyle(n).overflowY;
      if ((o === "auto" || o === "scroll") && n.scrollHeight > n.clientHeight) return n;
      n = n.parentElement;
    }
    return null;
  };
  function SortableCollection({
    items = [],
    label,
    itemName,
    onMove,
    canDrop,
    canMove,
    children,
    renderItem,
    moveControls = "handle-and-steppers",
    announcementScope = "position-and-neighbours",
    onAnnounce,
    liveRegion = true,
    onGrabChange,
    disabled = false,
    disabledReason,
    autoScroll = true,
    size = "md",
    as = "ul",
    style,
    ...rest
  }) {
    const [grab, setGrab] = import_react19.default.useState(null);
    const [said, setSaid] = import_react19.default.useState("");
    const rootRef = import_react19.default.useRef(null);
    const instrId = import_react19.default.useId();
    const grabRef = import_react19.default.useRef(null);
    const dragRef = import_react19.default.useRef(null);
    const winRef = import_react19.default.useRef(null);
    const rowEls = import_react19.default.useRef(/* @__PURE__ */ new Map());
    const skipClick = import_react19.default.useRef(null);
    const lastRefused = import_react19.default.useRef(null);
    const setGrabState = import_react19.default.useCallback((g) => {
      grabRef.current = g;
      setGrab(g);
      onGrabChange?.(g);
    }, [onGrabChange]);
    const name = import_react19.default.useCallback((id) => itemName ? itemName(id) : String(id), [itemName]);
    const warned2 = import_react19.default.useRef({});
    const mismatch = import_react19.default.useRef(null);
    const guard = import_react19.default.useCallback(() => {
      const w = warned2.current;
      if (mismatch.current != null && !w.kids) {
        w.kids = 1;
        console.warn("[Meridian] SortableCollection: " + mismatch.current + " children for " + items.length + " items. Children are paired with `items` by position, so a mismatch renders the wrong content in a row \u2014 render exactly one node per item, in `items` order.");
      }
      if (!label && !w.label) {
        w.label = 1;
        console.warn('[Meridian] SortableCollection: `label` is required \u2014 it names the collection in every announcement ("Moved within Routing sequence"). Without it a screen-reader user is told a position with no subject.');
      }
      if (!itemName && !w.itemName) {
        w.itemName = 1;
        console.warn("[Meridian] SortableCollection: `itemName` is required. Items are named by what they are, never by their index \u2014 the index is the thing being changed and cannot also be the name (pattern \xA714).");
      }
      if (!onMove && !w.onMove) {
        w.onMove = 1;
        console.warn("[Meridian] SortableCollection: no `onMove`. The component never reorders `items` itself; without the callback a drop is a gesture that does nothing.");
      }
      if (moveControls === "none" && !w.controls) {
        w.controls = 1;
        console.warn('[Meridian] SortableCollection: moveControls="none" leaves the drag as the only route to a destination off screen, and removes the control a gloved hand on a tablet uses by preference. Supported, but state the reason (pattern \xA711).');
      }
      if (new Set(items).size !== items.length && !w.dupes) {
        w.dupes = 1;
        console.warn("[Meridian] SortableCollection: `items` contains duplicate identities. Order is held by identity \u2014 duplicates make a grab ambiguous and a rollback impossible.");
      }
    }, [label, itemName, onMove, moveControls, items]);
    const H7 = `var(--control-h-${["sm", "md", "lg"].indexOf(size) > -1 ? size : "md"})`;
    const legalityAt = import_react19.default.useCallback((id, to) => {
      if (!canDrop) return null;
      const next = items.filter((x) => x !== id);
      next.splice(to, 0, id);
      const r = canDrop(id, to, next);
      if (r === true || r == null) return null;
      if (r === false) {
        if (!warnedBool) {
          warnedBool = true;
          console.warn('[Meridian] SortableCollection: `canDrop` returned false. Return the reason as a string instead \u2014 "Invalid position" names neither the rule nor anything the user can move instead (pattern \xA714).');
        }
        return "That position is not available.";
      }
      return String(r);
    }, [canDrop, items]);
    const lock = import_react19.default.useCallback((id) => {
      if (disabled) return disabledReason || "Reordering is unavailable.";
      if (canMove) {
        const r = canMove(id);
        if (r !== true && r != null) return r === false ? "This item cannot be moved." : String(r);
      }
      return null;
    }, [canMove, disabled, disabledReason]);
    const say = import_react19.default.useCallback((text) => {
      setSaid(text);
      onAnnounce?.(text);
    }, [onAnnounce]);
    const neighbours = import_react19.default.useCallback((id, to) => {
      if (announcementScope !== "position-and-neighbours") return "";
      const next = items.filter((x) => x !== id);
      next.splice(to, 0, id);
      const i = next.indexOf(id);
      return (i > 0 ? " after " + name(next[i - 1]) : " at the front") + (i < next.length - 1 ? ", before " + name(next[i + 1]) : "");
    }, [announcementScope, items, name]);
    const doGrab = (id) => {
      guard();
      const why = lock(id);
      if (why) {
        say(name(id) + " cannot be moved. " + why);
        return;
      }
      const i = items.indexOf(id);
      if (i < 0) return;
      setGrabState({ id, originIndex: i, proposedIndex: i });
      say(name(id) + " grabbed, position " + (i + 1) + " of " + items.length + ". Up and down arrows to move it, Space to drop, Escape to leave it at " + (i + 1) + ".");
    };
    const propose = (to) => {
      const g = grabRef.current;
      if (!g) return;
      const t = Math.max(0, Math.min(items.length - 1, to));
      if (t === g.proposedIndex) return;
      const why = legalityAt(g.id, t);
      if (why) {
        if (lastRefused.current === t) return;
        lastRefused.current = t;
        say("Position " + (t + 1) + " will not take " + name(g.id) + ". " + why + " Still in hand at " + (g.proposedIndex + 1) + ".");
        return;
      }
      lastRefused.current = null;
      setGrabState(Object.assign({}, g, { proposedIndex: t }));
      say("Would drop " + name(g.id) + " at " + (t + 1) + " of " + items.length + neighbours(g.id, t) + ".");
    };
    const cancel = (quiet) => {
      const g = grabRef.current;
      if (!g) return;
      setGrabState(null);
      if (!quiet) say(name(g.id) + " left at position " + (g.originIndex + 1) + " of " + items.length + ". Nothing was requested.");
    };
    const drop = () => {
      const g = grabRef.current;
      if (!g) return;
      const { id, originIndex, proposedIndex } = g;
      if (proposedIndex === originIndex) {
        cancel();
        return;
      }
      const why = legalityAt(id, proposedIndex);
      if (why) {
        say(name(id) + " was not moved. " + why + " It is still in hand at position " + (proposedIndex + 1) + ".");
        return;
      }
      setGrabState(null);
      say("Moving " + name(id) + " to " + (proposedIndex + 1) + " of " + items.length + neighbours(id, proposedIndex) + "\u2026");
      onMove?.(id, originIndex, proposedIndex);
    };
    const orderKey = items.join("\0");
    import_react19.default.useEffect(() => {
      const g = grabRef.current;
      if (!g) return;
      const i = items.indexOf(g.id);
      if (i < 0) {
        dragRef.current = null;
        detach();
        setGrabState(null);
        say(name(g.id) + " left the collection while it was in hand. Nothing was requested and the move cannot be made.");
        return;
      }
      if (i !== g.originIndex) {
        setGrabState({ id: g.id, originIndex: i, proposedIndex: i });
        say(label ? label + " changed underneath the grab. " + name(g.id) + " is now at position " + (i + 1) + " of " + items.length + "." : name(g.id) + " is now at position " + (i + 1) + ".");
      }
    }, [orderKey]);
    const proposeFromPointer = (y) => {
      const g = grabRef.current;
      if (!g) return;
      let insertAt = items.length;
      for (let i = 0; i < items.length; i++) {
        const el = rowEls.current.get(items[i]);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (y < r.top + r.height / 2) {
          insertAt = i;
          break;
        }
      }
      propose(insertAt > g.originIndex ? insertAt - 1 : insertAt);
    };
    const pointerDown = (id, why) => (e) => {
      skipClick.current = null;
      if (why || disabled || moveControls === "none" || e.button > 0) return;
      dragRef.current = { id, pointerId: e.pointerId, startY: e.clientY, moved: false };
      const move = (ev) => pointerMove(ev);
      const up = (ev) => {
        detach();
        pointerUp(ev);
      };
      const cancelled = (ev) => {
        detach();
        pointerCancel(ev);
      };
      winRef.current = { move, up, cancelled };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", cancelled);
    };
    const detach = () => {
      const h = winRef.current;
      if (!h) return;
      winRef.current = null;
      window.removeEventListener("pointermove", h.move);
      window.removeEventListener("pointerup", h.up);
      window.removeEventListener("pointercancel", h.cancelled);
    };
    import_react19.default.useEffect(() => detach, []);
    const pointerMove = (e) => {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      if (!d.moved) {
        if (Math.abs(e.clientY - d.startY) < 4) return;
        d.moved = true;
        if (!grabRef.current || grabRef.current.id !== d.id) doGrab(d.id);
        if (!grabRef.current) {
          dragRef.current = null;
          return;
        }
      }
      e.preventDefault();
      edge(e.clientY);
      proposeFromPointer(e.clientY);
    };
    const pointerUp = (e) => {
      const d = dragRef.current;
      dragRef.current = null;
      if (!d || e.pointerId != null && d.pointerId != null && e.pointerId !== d.pointerId) return;
      if (!d.moved) return;
      const box = rootRef.current && rootRef.current.getBoundingClientRect();
      if (box && (e.clientY < box.top - 24 || e.clientY > box.bottom + 24)) {
        cancel();
        return;
      }
      skipClick.current = { id: d.id, at: Date.now() };
      drop();
    };
    const pointerCancel = () => {
      const d = dragRef.current;
      dragRef.current = null;
      if (d && d.moved) cancel();
    };
    const onKeyDown = (id) => (e) => {
      if (e.key === "Escape") {
        if (grab) {
          e.preventDefault();
          cancel();
        }
        return;
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (grab && grab.id === id) drop();
        else doGrab(id);
        return;
      }
      if (!grab || grab.id !== id) return;
      if (e.key === "Tab") {
        cancel();
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        propose(grab.proposedIndex - 1);
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        propose(grab.proposedIndex + 1);
      }
      if (e.key === "Home") {
        e.preventDefault();
        propose(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        propose(items.length - 1);
      }
    };
    const edge = (clientY) => {
      if (!autoScroll) return;
      const box = scrollParent(rootRef.current);
      const t = box || null;
      if (!t) return;
      const r = t.getBoundingClientRect();
      if (clientY - r.top < 44) t.scrollTop = Math.max(0, t.scrollTop - 16);
      else if (r.bottom - clientY < 44) t.scrollTop = Math.min(t.scrollHeight - t.clientHeight, t.scrollTop + 16);
    };
    const step2 = (id, delta) => () => {
      guard();
      const from = items.indexOf(id);
      const to = from + delta;
      if (to < 0 || to > items.length - 1) return;
      const why = legalityAt(id, to);
      if (why) {
        say(name(id) + " was not moved. " + why);
        return;
      }
      say("Moving " + name(id) + " to " + (to + 1) + " of " + items.length + neighbours(id, to) + "\u2026");
      onMove?.(id, from, to);
    };
    const insertBefore = grab ? grab.proposedIndex >= grab.originIndex ? grab.proposedIndex + 1 : grab.proposedIndex : -1;
    let kids = children != null ? import_react19.default.Children.toArray(children) : null;
    if (kids && kids.length === 1 && items.length > 1 && kids[0] && kids[0].type === import_react19.default.Fragment) {
      kids = import_react19.default.Children.toArray(kids[0].props.children);
    }
    if (kids && kids.length && kids.length !== items.length) mismatch.current = kids.length;
    const indicator = (key) => /* @__PURE__ */ import_react19.default.createElement("li", { key, "aria-hidden": "true", "data-sortable-indicator": "", style: { listStyle: "none", height: "2px", margin: "2px 12px", borderRadius: "1px", background: "var(--action-solid)" } });
    const Root = as === "ol" ? "ol" : as === "div" ? "div" : "ul";
    const rows = [];
    items.forEach((id, i) => {
      if (grab && insertBefore === i) rows.push(indicator("ind-" + i));
      const inHand = !!(grab && grab.id === id);
      const why = lock(id);
      const content = kids ? kids[i] : renderItem?.(id, {
        index: i,
        position: i + 1,
        total: items.length,
        grabbed: inHand,
        proposedIndex: inHand ? grab.proposedIndex : null,
        immovable: why
      });
      rows.push(
        /* @__PURE__ */ import_react19.default.createElement(
          "li",
          {
            key: id,
            ref: (el) => {
              if (el) rowEls.current.set(id, el);
              else rowEls.current.delete(id);
            },
            style: {
              listStyle: "none",
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              minHeight: H7,
              paddingInlineStart: "var(--space-1)",
              borderInlineStart: "2px solid " + (inHand ? "var(--action-solid)" : "transparent"),
              background: inHand ? "var(--status-info-soft)" : "transparent"
            }
          },
          /* @__PURE__ */ import_react19.default.createElement("span", { style: { flex: "none", display: "flex", width: H7, height: H7 } }, /* @__PURE__ */ import_react19.default.createElement(
            IconButton,
            {
              icon: HANDLE,
              size,
              variant: "ghost",
              disabled: !!why,
              "aria-pressed": inHand,
              "aria-describedby": instrId,
              onPointerDown: pointerDown(id, why),
              label: why ? name(id) + " cannot be moved \u2014 " + why : inHand ? "Drop " + name(id) + " at position " + (grab.proposedIndex + 1) + " of " + items.length : "Move " + name(id) + ", position " + (i + 1) + " of " + items.length,
              onClick: () => {
                const s = skipClick.current;
                skipClick.current = null;
                if (s && s.id === id && Date.now() - s.at < 300) return;
                inHand ? drop() : doGrab(id);
              },
              onKeyDown: onKeyDown(id),
              style: { width: H7, cursor: why ? "not-allowed" : inHand ? "grabbing" : "grab", touchAction: "none" }
            }
          )),
          /* @__PURE__ */ import_react19.default.createElement("span", { style: { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" } }, "Position " + (i + 1) + " of " + items.length + (inHand ? ", in hand from " + (grab.originIndex + 1) : "")),
          /* @__PURE__ */ import_react19.default.createElement("div", { style: { flex: "1 1 auto", minWidth: 0 } }, content),
          moveControls === "handle-and-steppers" ? /* @__PURE__ */ import_react19.default.createElement("span", { style: { flex: "none", display: "flex", gap: "2px" } }, /* @__PURE__ */ import_react19.default.createElement(
            IconButton,
            {
              icon: "arrow-up",
              size,
              variant: "ghost",
              label: "Move " + name(id) + " earlier",
              disabled: !!why || i === 0 || !!legalityAt(id, i - 1),
              onClick: step2(id, -1)
            }
          ), /* @__PURE__ */ import_react19.default.createElement(
            IconButton,
            {
              icon: "arrow-down",
              size,
              variant: "ghost",
              label: "Move " + name(id) + " later",
              disabled: !!why || i === items.length - 1 || !!legalityAt(id, i + 1),
              onClick: step2(id, 1)
            }
          )) : null
        )
      );
    });
    if (grab && insertBefore === items.length) rows.push(indicator("ind-tail"));
    return /* @__PURE__ */ import_react19.default.createElement(
      Root,
      {
        ref: rootRef,
        "aria-label": label,
        "aria-describedby": instrId,
        ...rest,
        style: { margin: 0, padding: 0, display: "flex", flexDirection: "column", ...style }
      },
      rows,
      /* @__PURE__ */ import_react19.default.createElement("li", { "aria-hidden": "true", style: { listStyle: "none", position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" } }, /* @__PURE__ */ import_react19.default.createElement("span", { id: instrId }, disabled ? disabledReason || "Reordering is unavailable." : "Press Space or Enter to grab an item, arrow keys to move it, Space to drop, Escape to leave it where it was.")),
      liveRegion ? /* @__PURE__ */ import_react19.default.createElement("li", { role: "status", "aria-live": "polite", style: { listStyle: "none", position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" } }, said) : null
    );
  }

  // components/composite/SplitButton.jsx
  var import_react21 = __toESM(require_react(), 1);

  // components/navigation/Menu.jsx
  var import_react20 = __toESM(require_react(), 1);
  var SIZES4 = {
    sm: { h: 28, px: 8, gap: 8, text: "var(--text-xs)", icon: "xs", pad: 4 },
    md: { h: 32, px: 10, gap: 10, text: "var(--text-sm)", icon: "sm", pad: 4 }
  };
  function flatten2(items, out = []) {
    for (const raw of items || []) {
      if (raw == null) continue;
      if (raw === "divider" || raw === "-" || raw.divider) {
        out.push({ type: "divider" });
        continue;
      }
      if (raw.items) {
        if (raw.group) out.push({ type: "group", label: raw.group });
        flatten2(raw.items, out);
        continue;
      }
      const item = typeof raw === "string" ? { label: raw } : raw;
      out.push({ type: "item", ...item });
    }
    return out;
  }
  var isEnabled = (r) => r.type === "item" && !r.disabled;
  function MenuList({
    items,
    size = "md",
    cursor = -1,
    onCursorChange,
    onSelect,
    idBase = "menu",
    domRef,
    style,
    ...rest
  }) {
    const S = SIZES4[size] || SIZES4.md;
    const rows = import_react20.default.useMemo(() => flatten2(items), [items]);
    const anyIndent = rows.some((r) => r.type === "item" && (r.icon || r.checked != null));
    return /* @__PURE__ */ import_react20.default.createElement(
      "div",
      {
        role: "menu",
        ref: domRef,
        ...rest,
        style: { display: "flex", flexDirection: "column", padding: S.pad, minWidth: 0, ...style }
      },
      rows.map((r, i) => {
        if (r.type === "divider") {
          return /* @__PURE__ */ import_react20.default.createElement("div", { key: i, role: "separator", style: { height: "var(--border-width)", background: "var(--menu-divider)", margin: `${S.pad}px 0` } });
        }
        if (r.type === "group") {
          return /* @__PURE__ */ import_react20.default.createElement("div", { key: i, role: "presentation", style: { padding: `${S.pad + 2}px ${S.px}px 3px`, fontSize: "var(--text-2xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", color: "var(--menu-group-text)" } }, r.label);
        }
        const active = i === cursor && !r.disabled;
        const critical = r.tone === "critical" || r.tone === "danger";
        const checkable = r.checked != null;
        return /* @__PURE__ */ import_react20.default.createElement(
          "div",
          {
            key: i,
            id: `${idBase}-r${i}`,
            role: checkable ? r.selection === "single" ? "menuitemradio" : "menuitemcheckbox" : "menuitem",
            "aria-checked": checkable ? !!r.checked : void 0,
            "aria-disabled": r.disabled || void 0,
            "aria-keyshortcuts": r.shortcut || void 0,
            onPointerMove: () => !r.disabled && onCursorChange?.(i),
            onClick: (e) => {
              if (r.disabled) {
                e.stopPropagation();
                return;
              }
              onSelect?.(r, i);
            },
            style: {
              display: "grid",
              gridTemplateColumns: `${anyIndent ? `${S.h - S.px}px ` : ""}minmax(0,1fr) auto`,
              alignItems: "center",
              columnGap: S.gap,
              minHeight: S.h,
              padding: `${r.description ? 5 : 0}px ${S.px}px`,
              borderRadius: "var(--radius-sm)",
              fontSize: S.text,
              lineHeight: 1.35,
              color: r.disabled ? "var(--menu-item-text-disabled)" : critical ? "var(--menu-item-text-critical)" : "var(--menu-item-text)",
              background: active ? critical ? "var(--menu-item-background-critical-active)" : "var(--menu-item-background-active)" : "transparent",
              cursor: r.disabled ? "not-allowed" : "pointer",
              userSelect: "none"
            }
          },
          anyIndent && /* @__PURE__ */ import_react20.default.createElement("span", { style: { display: "grid", placeItems: "center", color: r.disabled ? "inherit" : checkable ? "var(--menu-item-check)" : critical ? "inherit" : "var(--menu-item-icon)" } }, checkable ? r.checked ? /* @__PURE__ */ import_react20.default.createElement(Icon, { name: "check", size: S.icon }) : null : r.icon ? typeof r.icon === "string" ? /* @__PURE__ */ import_react20.default.createElement(Icon, { name: r.icon, size: S.icon }) : r.icon : null),
          /* @__PURE__ */ import_react20.default.createElement("span", { style: { minWidth: 0, display: "flex", flexDirection: "column", gap: 1 } }, /* @__PURE__ */ import_react20.default.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, r.label), r.description && /* @__PURE__ */ import_react20.default.createElement("span", { style: { fontSize: "var(--text-2xs)", color: r.disabled ? "inherit" : "var(--menu-item-description-text)", whiteSpace: "normal" } }, r.description)),
          r.shortcut && /* @__PURE__ */ import_react20.default.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: r.disabled ? "inherit" : "var(--menu-item-shortcut-text)", whiteSpace: "nowrap" } }, r.shortcut)
        );
      })
    );
  }
  function Menu({
    trigger,
    items,
    label,
    open,
    onOpenChange,
    onSelect,
    side = "bottom",
    align = "start",
    offset = 4,
    size = "md",
    minWidth = 180,
    maxWidth = 320,
    matchTriggerWidth = false,
    style,
    ...rest
  }) {
    const [uncontrolled, setUncontrolled] = import_react20.default.useState(false);
    const isControlled = open != null;
    const isOpen = isControlled ? open : uncontrolled;
    const anchorRef = import_react20.default.useRef(null);
    const listRef = import_react20.default.useRef(null);
    const wantFocus = import_react20.default.useRef(false);
    const restoreRef = import_react20.default.useRef(null);
    const typed = import_react20.default.useRef({ buf: "", at: 0 });
    const [cursor, setCursor] = import_react20.default.useState(-1);
    const idBase = import_react20.default.useId();
    const rows = import_react20.default.useMemo(() => flatten2(items), [items]);
    const pos = useAnchor(anchorRef, listRef, { open: isOpen, side, align, offset, matchWidth: matchTriggerWidth });
    if (!label && !rest["aria-label"] && !rest["aria-labelledby"]) {
      console.warn('[Meridian] Menu: no accessible name. Pass `label` \u2014 a screen reader announcing "menu, 6 items" with no name tells the user nothing about what the commands do.');
    }
    const setOpen = import_react20.default.useCallback((next, from) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
      if (next) {
        wantFocus.current = true;
        restoreRef.current = document.activeElement;
        setCursor(from === "last" ? rows.map(isEnabled).lastIndexOf(true) : from === "first" ? rows.findIndex(isEnabled) : -1);
      } else setCursor(-1);
    }, [isControlled, onOpenChange, rows]);
    function close(restore = true) {
      setOpen(false);
      if (restore) restoreRef.current?.focus?.({ preventScroll: true });
      restoreRef.current = null;
    }
    const attachList = import_react20.default.useCallback((el) => {
      listRef.current = el;
      if (el && wantFocus.current) el.focus({ preventScroll: true });
    }, []);
    import_react20.default.useEffect(() => {
      if (!isOpen) {
        wantFocus.current = false;
        return void 0;
      }
      if (!listRef.current?.contains(restoreRef.current) && (restoreRef.current == null || restoreRef.current === document.body)) restoreRef.current = document.activeElement;
      const t = requestAnimationFrame(() => {
        const el = listRef.current;
        if (el && !el.contains(document.activeElement) && document.activeElement !== el) el.focus({ preventScroll: true });
        wantFocus.current = false;
      });
      const onDown = (e) => {
        if (listRef.current?.contains(e.target) || anchorRef.current?.contains(e.target)) return;
        close(false);
      };
      document.addEventListener("pointerdown", onDown);
      return () => {
        cancelAnimationFrame(t);
        document.removeEventListener("pointerdown", onDown);
      };
    }, [isOpen]);
    function step2(dir) {
      const n = rows.length;
      for (let k = 1; k <= n; k++) {
        const i = ((cursor < 0 ? dir > 0 ? -1 : 0 : cursor) + dir * k + n * k) % n;
        if (isEnabled(rows[i])) {
          setCursor(i);
          return;
        }
      }
    }
    function pick(row, i) {
      if (!row || row.disabled) return;
      row.onSelect?.(row);
      onSelect?.(row, i);
      if (row.keepOpen ?? row.checked != null) return;
      close();
    }
    function onKeyDown(e) {
      const k = e.key;
      if (k === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (k === "Tab") {
        close(false);
        return;
      }
      if (k === "ArrowDown") {
        e.preventDefault();
        step2(1);
        return;
      }
      if (k === "ArrowUp") {
        e.preventDefault();
        step2(-1);
        return;
      }
      if (k === "Home") {
        e.preventDefault();
        setCursor(rows.findIndex(isEnabled));
        return;
      }
      if (k === "End") {
        e.preventDefault();
        setCursor(rows.map(isEnabled).lastIndexOf(true));
        return;
      }
      if (k === "Enter" || k === " ") {
        e.preventDefault();
        pick(rows[cursor], cursor);
        return;
      }
      if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const now = Date.now();
        typed.current.buf = now - typed.current.at > 600 ? k : typed.current.buf + k;
        typed.current.at = now;
        const q = typed.current.buf.toLowerCase();
        const from = typed.current.buf.length > 1 ? cursor : cursor + 1;
        const order = rows.map((_, i) => (i + Math.max(from, 0)) % rows.length);
        const hit = order.find((i) => isEnabled(rows[i]) && String(rows[i].label).toLowerCase().startsWith(q));
        if (hit != null) setCursor(hit);
      }
    }
    function onTriggerKeyDown(e) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true, "first");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true, "last");
      }
    }
    return /* @__PURE__ */ import_react20.default.createElement(import_react20.default.Fragment, null, /* @__PURE__ */ import_react20.default.createElement(
      "span",
      {
        ref: anchorRef,
        onClick: () => isOpen ? close() : setOpen(true),
        onKeyDown: isOpen ? onKeyDown : onTriggerKeyDown,
        style: { display: "inline-flex", maxWidth: "100%" }
      },
      import_react20.default.isValidElement(trigger) ? import_react20.default.cloneElement(trigger, { "aria-haspopup": "menu", "aria-expanded": isOpen }) : trigger
    ), isOpen && /* @__PURE__ */ import_react20.default.createElement(
      MenuList,
      {
        ...rest,
        items,
        size,
        cursor,
        onCursorChange: setCursor,
        onSelect: pick,
        idBase,
        "aria-label": label || rest["aria-label"],
        "aria-activedescendant": cursor >= 0 ? `${idBase}-r${cursor}` : void 0,
        tabIndex: -1,
        onKeyDown,
        style: {
          ...anchorStyle(pos || { left: -9999, top: 0 }, "var(--z-popover)"),
          width: matchTriggerWidth ? pos?.width : "max-content",
          minWidth: matchTriggerWidth ? void 0 : minWidth,
          maxWidth: `min(${maxWidth}px, calc(100vw - 16px))`,
          background: "var(--menu-background)",
          border: "var(--border-width) solid var(--menu-border)",
          borderRadius: "var(--menu-radius)",
          boxShadow: "var(--menu-shadow)",
          outline: "none",
          overflow: "auto",
          animation: `${pos?.side === "top" ? "mer-rise-in" : pos?.side === "bottom" ? "mer-drop-in" : "mer-fade-in"} var(--duration-instant) var(--ease-out)`,
          ...style
        },
        domRef: attachList
      }
    ));
  }

  // components/composite/SplitButton.jsx
  var CAP_VARIANT = { primary: "solid", secondary: "outline", ghost: "ghost", danger: "danger" };
  var flat = (list, out = []) => {
    for (const a of list || []) {
      if (a == null || a === "divider" || a === "-" || a.divider) continue;
      if (a.items) flat(a.items, out);
      else out.push(a);
    }
    return out;
  };
  function SplitButton({
    label,
    children,
    onAction,
    actions = [],
    onSelect,
    variant = "primary",
    size = "md",
    iconLeft,
    loading = false,
    disabled = false,
    open,
    onOpenChange,
    menuLabel,
    disclosureLabel,
    disclosureIcon = "chevron-down",
    side = "bottom",
    align = "end",
    menuSize,
    style,
    ...rest
  }) {
    const [raised, setRaised] = import_react21.default.useState(-1);
    const rows = flat(actions);
    if (!label) {
      console.warn('[Meridian] SplitButton: `label` is required \u2014 it names the primary action, the disclosure ("More <label> actions") and the menu. Without it the group is announced as an unnamed pair of buttons and the cap has no purpose of its own.');
    }
    if (!rows.length) {
      console.warn("[Meridian] SplitButton: no `actions`. A split button with an empty menu is a Button with a dead cap \u2014 render a Button instead.");
    }
    if (rows.some((a) => a.id == null)) {
      console.warn("[Meridian] SplitButton: every action needs a stable `id`. Selection is reported by identity, and an index changes the moment the alternatives are reordered or filtered.");
    }
    if (label && rows.some((a) => typeof a.label === "string" && a.label.trim().toLowerCase() === String(label).trim().toLowerCase())) {
      console.warn('[Meridian] SplitButton: an action repeats the primary label "' + label + '". Two routes to the same command make the menu look like the real control \u2014 remove it unless a keyboard-only duplicate is a stated requirement.');
    }
    if (!CAP_VARIANT[variant]) {
      console.warn('[Meridian] SplitButton: variant "' + variant + '" is not supported \u2014 a split button needs a bordered, control-height half on both sides to read as one control. Rendering as "secondary". Supported: primary, secondary, ghost, danger.');
    }
    const v = CAP_VARIANT[variant] ? variant : "secondary";
    const h = `var(--control-h-${["sm", "md", "lg"].indexOf(size) > -1 ? size : "md"})`;
    const r = "var(--split-button-radius)";
    const bw = "calc(var(--border-width) * -1)";
    const seam = v === "primary" || v === "danger" ? { borderLeft: "var(--border-width) solid var(--split-button-seam-solid)" } : v === "ghost" ? { borderLeft: "var(--border-width) solid var(--split-button-divider)" } : { borderColor: "var(--split-button-border)" };
    const pick = (row, i) => {
      const src = rows.find((a) => a.id != null && a.id === row.id) || row;
      onSelect?.(src, i);
    };
    const half = (i) => ({
      onMouseEnter: () => setRaised(i),
      onMouseLeave: () => setRaised(-1),
      onFocusCapture: () => setRaised(i),
      onBlurCapture: () => setRaised(-1),
      style: { display: "inline-flex", position: "relative", minWidth: 0, zIndex: raised === i ? 1 : 0 }
    });
    return /* @__PURE__ */ import_react21.default.createElement(
      Box,
      {
        role: "group",
        "aria-label": label,
        ...rest,
        display: "inline-flex",
        style: { isolation: "isolate", maxWidth: "100%", ...style }
      },
      /* @__PURE__ */ import_react21.default.createElement("span", { ...half(0) }, /* @__PURE__ */ import_react21.default.createElement(
        Button,
        {
          variant: v,
          size,
          iconLeft,
          loading,
          disabled,
          "aria-label": children ? label : void 0,
          onClick: onAction,
          style: {
            borderRadius: `${r} 0 0 ${r}`,
            minWidth: 0,
            ...v === "secondary" ? { borderColor: "var(--split-button-border)" } : null
          }
        },
        children ?? label
      )),
      /* @__PURE__ */ import_react21.default.createElement("span", { ...half(1) }, /* @__PURE__ */ import_react21.default.createElement(
        Menu,
        {
          trigger: /* @__PURE__ */ import_react21.default.createElement(
            IconButton,
            {
              icon: disclosureIcon,
              label: disclosureLabel || "More " + (label || "actions") + " actions",
              variant: CAP_VARIANT[v],
              size,
              disabled: disabled || !rows.length,
              style: {
                /* IconButton sizes from --control-h-* (1.27.x), so the two
                   halves stay the same height at every density; the width is
                   pinned to the same token to keep the cap square. */
                width: h,
                marginLeft: bw,
                borderRadius: `0 ${r} ${r} 0`,
                ...seam
              }
            }
          ),
          items: actions,
          label: menuLabel || (label ? label + " actions" : void 0),
          open,
          onOpenChange,
          onSelect: pick,
          side,
          align,
          size: menuSize || (size === "sm" ? "sm" : "md")
        }
      ))
    );
  }

  // components/composite/Toolbar.jsx
  var import_react23 = __toESM(require_react(), 1);

  // components/primitives/Divider.jsx
  var import_react22 = __toESM(require_react(), 1);
  function Divider({ orientation = "horizontal", tone = "default", spacing = 0, inset = 0, label, style, ...rest }) {
    const line = "var(--border-width) solid " + col("border-" + tone);
    if (orientation === "vertical") {
      return /* @__PURE__ */ import_react22.default.createElement(
        "div",
        {
          role: "separator",
          "aria-orientation": "vertical",
          ...rest,
          style: { alignSelf: "stretch", width: 0, minHeight: "1em", borderLeft: line, marginInline: sp(spacing), marginBlock: sp(inset), ...style }
        }
      );
    }
    if (label) {
      return /* @__PURE__ */ import_react22.default.createElement(
        "div",
        {
          role: "separator",
          ...rest,
          style: { display: "flex", alignItems: "center", gap: "var(--space-3)", marginBlock: sp(spacing), marginInline: sp(inset), ...style }
        },
        /* @__PURE__ */ import_react22.default.createElement("span", { style: { flex: 1, borderTop: line } }),
        /* @__PURE__ */ import_react22.default.createElement("span", { style: { fontFamily: "var(--font-sans)", fontSize: "var(--text-2xs)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-tertiary)", whiteSpace: "nowrap" } }, label),
        /* @__PURE__ */ import_react22.default.createElement("span", { style: { flex: 1, borderTop: line } })
      );
    }
    return /* @__PURE__ */ import_react22.default.createElement(
      "hr",
      {
        ...rest,
        style: { border: 0, borderTop: line, height: 0, marginBlock: sp(spacing), marginInline: sp(inset), alignSelf: "stretch", ...style }
      }
    );
  }

  // components/composite/Toolbar.jsx
  var STOP_SELECTOR = 'button,[href],input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])';
  function collectStops(root) {
    const all = Array.from(root.querySelectorAll(STOP_SELECTOR)).filter(
      (el) => !el.disabled && el.offsetParent !== null
    );
    const seen = {};
    return all.filter((el) => {
      if (el.type !== "radio") return true;
      if (seen[el.name]) return false;
      const group = all.filter((o) => o.type === "radio" && o.name === el.name);
      const stop = group.filter((o) => o.checked)[0] || group[0];
      if (el !== stop) return false;
      seen[el.name] = true;
      return true;
    });
  }
  var isDivider = (child) => child?.type === Divider;
  function textOf(node) {
    if (node === null || node === void 0 || node === false) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(textOf).join("");
    if (import_react23.default.isValidElement(node)) return textOf(node.props?.children);
    return "";
  }
  function holdsControls(node) {
    if (Array.isArray(node)) return node.some(holdsControls);
    if (!import_react23.default.isValidElement(node)) return false;
    const p = node.props || {};
    if (p.icon || p.variant || p.options || p.items || p.trigger) return true;
    return holdsControls(p.children);
  }
  function overflowRow(child) {
    const p = child.props || {};
    if (p.options || p.items || p.trigger) return null;
    if (holdsControls(p.children)) return null;
    const text = textOf(p.children).trim();
    if (text) return { label: text, icon: p.iconLeft, disabled: p.disabled, onSelect: p.onClick };
    if (p.icon && typeof p.label === "string") return { label: p.label, icon: p.icon, disabled: p.disabled, onSelect: p.onClick };
    return null;
  }
  var SIZEABLE = ["icon", "iconLeft", "variant", "options", "items", "trigger", "label"];
  var takesSize = (p) => SIZEABLE.some((k) => p[k] !== void 0);
  function withSize(child, size, vertical) {
    if (isDivider(child)) return vertical ? child : import_react23.default.cloneElement(child, { orientation: "vertical" });
    const p = child.props || {};
    if (p.size || !takesSize(p)) return child;
    if (p.trigger && import_react23.default.isValidElement(p.trigger) && !p.trigger.props?.size) {
      return import_react23.default.cloneElement(child, { size, trigger: import_react23.default.cloneElement(p.trigger, { size }) });
    }
    return import_react23.default.cloneElement(child, { size });
  }
  function publishStop(root, stops, index) {
    const on = stops[index];
    Array.from(root.querySelectorAll(STOP_SELECTOR)).forEach((el) => {
      if (el !== on) el.tabIndex = -1;
    });
    if (on) on.tabIndex = 0;
  }
  function Toolbar({
    label,
    size = "md",
    orientation = "horizontal",
    disabled = false,
    overflow = "none",
    overflowLabel = "More actions",
    children,
    style,
    ...rest
  }) {
    const items = import_react23.default.Children.toArray(children).filter(Boolean);
    const vertical = orientation === "vertical";
    const ref = import_react23.default.useRef(null);
    const lastWidth = import_react23.default.useRef(0);
    const [collapsed, setCollapsed] = import_react23.default.useState(0);
    const active = import_react23.default.useRef(0);
    if (!label) {
      console.warn('[Meridian] Toolbar: `label` is required \u2014 role="toolbar" with no accessible name is announced as an unlabelled group of controls.');
    }
    if (overflow === "menu" && vertical) {
      console.warn('[Meridian] Toolbar: overflow="menu" is only measured on the horizontal axis. A vertical toolbar in a short container should scroll or shorten its action list, not collapse.');
    }
    const candidates = [];
    for (let i = items.length - 1; i >= 0; i--) {
      const c = items[i];
      if (c.props?.["data-priority"] === "high") continue;
      if (overflowRow(c)) candidates.push(i);
    }
    import_react23.default.useLayoutEffect(() => {
      if (overflow !== "menu" || vertical || !ref.current) return;
      const el = ref.current;
      if (el.scrollWidth > el.clientWidth + 1 && collapsed < candidates.length) {
        setCollapsed(collapsed + 1);
      }
    });
    import_react23.default.useEffect(() => {
      if (overflow !== "menu" || vertical || !ref.current) return;
      const el = ref.current;
      lastWidth.current = el.clientWidth;
      const ro = new ResizeObserver(() => {
        if (Math.abs(el.clientWidth - lastWidth.current) < 1) return;
        lastWidth.current = el.clientWidth;
        setCollapsed(0);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [overflow, vertical, size, items.length]);
    import_react23.default.useEffect(() => {
      if (disabled || !ref.current) return;
      const stops = collectStops(ref.current);
      if (!stops.length) return;
      if (active.current > stops.length - 1) active.current = stops.length - 1;
      publishStop(ref.current, stops, active.current);
    });
    const onKeyDown = (e) => {
      if (disabled) return;
      const main = vertical ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
      const isMain = main.indexOf(e.key) > -1;
      if (!isMain && e.key !== "Home" && e.key !== "End") return;
      const stops = collectStops(ref.current);
      if (!stops.length) return;
      let from = stops.indexOf(e.target);
      if (from < 0) from = stops.findIndex((s) => s.closest('fieldset,[role="group"]') && s.closest('fieldset,[role="group"]').contains(e.target));
      if (from < 0) from = active.current;
      let next = from;
      if (e.key === "Home") next = 0;
      else if (e.key === "End") next = stops.length - 1;
      else next = from + (e.key === main[1] ? 1 : -1);
      if (next < 0 || next > stops.length - 1) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      active.current = next;
      publishStop(ref.current, stops, next);
      stops[next].focus();
    };
    const onFocus = (e) => {
      if (disabled) return;
      const stops = collectStops(ref.current);
      const i = stops.indexOf(e.target);
      if (i > -1) active.current = i;
    };
    const hide = candidates.slice(0, collapsed);
    const rows = items.map((c, i) => hide.indexOf(i) > -1 ? { ...overflowRow(c), _i: i } : null).filter(Boolean);
    const visible = items.map((c, i) => hide.indexOf(i) > -1 ? null : { c, i }).filter(Boolean);
    while (visible.length && isDivider(visible[0].c)) visible.shift();
    while (visible.length && isDivider(visible[visible.length - 1].c)) visible.pop();
    const shownIdx = visible.map((v) => v.i);
    const Tag2 = disabled ? "fieldset" : "div";
    return /* @__PURE__ */ import_react23.default.createElement(
      Tag2,
      {
        ref,
        role: "toolbar",
        "aria-label": label,
        "aria-orientation": vertical ? "vertical" : void 0,
        disabled: disabled || void 0,
        onKeyDown,
        onFocus,
        ...rest,
        style: {
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          alignItems: "center",
          gap: "var(--toolbar-gap)",
          padding: "var(--toolbar-padding)",
          background: "var(--toolbar-background)",
          border: `var(--border-width) solid var(--toolbar-border)`,
          borderRadius: "var(--toolbar-radius)",
          flexWrap: "nowrap",
          minWidth: 0,
          margin: 0,
          /* A failed fit must not spill into the panel — but clipping is only
             safe once something CAN collapse, or an action would be hidden with
             no menu to reach it. §11: availability never changes. */
          ...overflow === "menu" && !vertical && candidates.length ? { overflow: "clip", overflowClipMargin: "4px" } : null,
          ...style
        }
      },
      items.map((child, i) => {
        const on = shownIdx.indexOf(i) > -1;
        return /* @__PURE__ */ import_react23.default.createElement(
          "span",
          {
            key: child.key || i,
            style: {
              display: on ? "inline-flex" : "none",
              alignItems: "center",
              flex: "none",
              alignSelf: isDivider(child) ? "stretch" : void 0
            }
          },
          withSize(child, size, vertical)
        );
      }),
      rows.length ? /* @__PURE__ */ import_react23.default.createElement("span", { style: { display: "inline-flex", flex: "none", marginLeft: vertical ? 0 : "auto" } }, /* @__PURE__ */ import_react23.default.createElement(
        Menu,
        {
          label: overflowLabel,
          size,
          items: rows.map((r) => ({ label: r.label, icon: r.icon, disabled: r.disabled, onSelect: r.onSelect })),
          trigger: /* @__PURE__ */ import_react23.default.createElement(IconButton, { icon: "ellipsis", label: overflowLabel, size })
        }
      )) : null
    );
  }

  // components/core/Accordion.jsx
  var import_react24 = __toESM(require_react(), 1);
  var SIZES5 = {
    sm: { h: 34, px: "var(--space-3)", title: "var(--text-xs)", icon: "xs", marker: 14, gap: 8, panelPt: "var(--space-2)", panelPb: "var(--space-3)" },
    md: { h: 44, px: "var(--space-4)", title: "var(--text-sm)", icon: "sm", marker: 16, gap: 10, panelPt: "var(--space-3)", panelPb: "var(--space-5)" }
  };
  var norm = (raw) => typeof raw === "string" ? { value: raw, title: raw } : raw;
  var asArray = (v) => v == null ? [] : Array.isArray(v) ? v : [v];
  function AccordionItem({
    item,
    size = "md",
    variant = "bordered",
    headingLevel = 3,
    open: openProp,
    defaultOpen = false,
    onToggle,
    first = false,
    last = false,
    keepMounted = false,
    idBase,
    buttonRef,
    onKeyDown,
    children
  }) {
    const it = norm(item) || {};
    const s = SIZES5[size] || SIZES5.md;
    const uid = import_react24.default.useId();
    const base = idBase || uid;
    const [selfOpen, setSelfOpen] = import_react24.default.useState(defaultOpen);
    const [hover, setHover] = import_react24.default.useState(false);
    const [focus, setFocus] = import_react24.default.useState(false);
    const open = openProp != null ? openProp : selfOpen;
    const disabled = !!it.disabled;
    const content = children != null ? children : it.content;
    const Heading2 = `h${Math.min(6, Math.max(1, headingLevel))}`;
    const flush = variant === "flush";
    const toggle = () => {
      if (disabled) return;
      if (openProp == null) setSelfOpen((o) => !o);
      if (onToggle) onToggle(!open, it);
    };
    return /* @__PURE__ */ import_react24.default.createElement(
      "div",
      {
        "data-accordion-item": it.value,
        "data-expanded": open ? "" : void 0,
        style: {
          borderTop: first || flush ? 0 : `var(--border-width) solid var(--accordion-divider)`,
          minWidth: 0
        }
      },
      /* @__PURE__ */ import_react24.default.createElement(Heading2, { style: { margin: 0, font: "inherit", fontWeight: "inherit" } }, /* @__PURE__ */ import_react24.default.createElement(
        "button",
        {
          type: "button",
          id: `${base}-header`,
          ref: buttonRef,
          "aria-expanded": open,
          "aria-controls": `${base}-panel`,
          "aria-disabled": disabled || void 0,
          disabled,
          onClick: toggle,
          onKeyDown,
          onMouseEnter: () => setHover(true),
          onMouseLeave: () => setHover(false),
          onFocus: (e) => setFocus(e.target.matches(":focus-visible")),
          onBlur: () => setFocus(false),
          style: {
            display: "flex",
            alignItems: "center",
            gap: s.gap,
            width: "100%",
            minHeight: s.h,
            padding: `${size === "sm" ? 6 : 8}px ${flush ? 0 : s.px}`,
            margin: 0,
            textAlign: "left",
            fontFamily: "var(--font-sans)",
            fontSize: s.title,
            fontWeight: "var(--weight-medium)",
            letterSpacing: "var(--tracking-body)",
            lineHeight: 1.4,
            color: disabled ? "var(--accordion-header-text-disabled)" : hover ? "var(--accordion-header-text-hover)" : "var(--accordion-header-text)",
            background: disabled ? "transparent" : hover && !flush ? "var(--accordion-header-background-hover)" : open ? "var(--accordion-header-background-expanded)" : "var(--accordion-header-background)",
            border: 0,
            borderRadius: flush ? "var(--radius-xs)" : first ? "calc(var(--accordion-radius) - 1px) calc(var(--accordion-radius) - 1px) 0 0" : 0,
            boxShadow: focus ? "var(--accordion-header-focus-ring)" : "none",
            outline: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "var(--transition-control)",
            position: "relative",
            zIndex: focus ? 1 : void 0
          }
        },
        it.icon && /* @__PURE__ */ import_react24.default.createElement(
          Icon,
          {
            name: it.icon,
            size: s.icon,
            style: { color: disabled ? "var(--accordion-marker-disabled)" : "var(--accordion-marker)" }
          }
        ),
        /* @__PURE__ */ import_react24.default.createElement("span", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react24.default.createElement("span", { style: { display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, it.title), it.description && /* @__PURE__ */ import_react24.default.createElement(
          "span",
          {
            style: {
              display: "block",
              marginTop: 2,
              fontSize: "var(--text-2xs)",
              fontWeight: "var(--weight-regular)",
              color: disabled ? "var(--accordion-header-text-disabled)" : "var(--accordion-description-text)"
            }
          },
          it.description
        )),
        it.meta != null && /* @__PURE__ */ import_react24.default.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6, flex: "0 0 auto" }, onClick: (e) => e.stopPropagation() }, it.meta),
        /* @__PURE__ */ import_react24.default.createElement(
          Icon,
          {
            name: "chevron-down",
            size: s.marker,
            style: {
              color: disabled ? "var(--accordion-marker-disabled)" : open ? "var(--accordion-marker-expanded)" : "var(--accordion-marker)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: `transform var(--duration-fast) var(--ease-out)`
            }
          }
        )
      )),
      (open || keepMounted) && /* @__PURE__ */ import_react24.default.createElement(
        "div",
        {
          id: `${base}-panel`,
          role: "region",
          "aria-labelledby": `${base}-header`,
          hidden: !open || void 0,
          style: {
            padding: `${open ? s.panelPt : 0} ${flush ? 0 : s.px} ${open ? s.panelPb : 0}`,
            paddingLeft: flush ? 0 : it.icon ? `calc(${s.px} + ${s.icon === "xs" ? 14 : 16}px + ${s.gap}px)` : s.px,
            fontSize: size === "sm" ? "var(--text-xs)" : "var(--text-sm)",
            color: "var(--accordion-panel-text)",
            minWidth: 0,
            animation: open ? "var(--anim-fade-in)" : void 0
          }
        },
        content
      )
    );
  }
  function Accordion({
    items = [],
    value,
    defaultValue,
    onChange,
    multiple = false,
    size = "md",
    variant = "bordered",
    headingLevel = 3,
    keepMounted = false,
    style,
    ...rest
  }) {
    const uid = import_react24.default.useId();
    const controlled = value !== void 0;
    const [selfValue, setSelfValue] = import_react24.default.useState(() => multiple ? asArray(defaultValue) : defaultValue ?? null);
    const current = controlled ? value : selfValue;
    const openSet = import_react24.default.useMemo(() => new Set(asArray(current)), [current]);
    const refs = import_react24.default.useRef([]);
    const rows = items.map(norm).filter(Boolean);
    const commit = (next) => {
      if (!controlled) setSelfValue(next);
      if (onChange) onChange(next);
    };
    const setOpen = (val, next) => {
      if (multiple) {
        const set = new Set(openSet);
        if (next) set.add(val);
        else set.delete(val);
        commit(rows.map((r) => r.value).filter((v) => set.has(v)));
      } else {
        commit(next ? val : null);
      }
    };
    const move = (from, dir) => {
      const n = rows.length;
      for (let step2 = 1; step2 <= n; step2 += 1) {
        const i = (from + dir * step2 + n * step2) % n;
        if (!rows[i].disabled && refs.current[i]) {
          refs.current[i].focus();
          return;
        }
      }
    };
    const edge = (dir) => {
      const order = dir > 0 ? rows.map((_, i) => i) : rows.map((_, i) => rows.length - 1 - i);
      for (const i of order) if (!rows[i].disabled && refs.current[i]) {
        refs.current[i].focus();
        return;
      }
    };
    const keyDown = (index) => (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(index, 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        move(index, -1);
      } else if (e.key === "Home") {
        e.preventDefault();
        edge(1);
      } else if (e.key === "End") {
        e.preventDefault();
        edge(-1);
      }
    };
    const bordered = variant === "bordered";
    return /* @__PURE__ */ import_react24.default.createElement(
      "div",
      {
        "data-accordion": "",
        ...rest,
        style: {
          display: "flex",
          flexDirection: "column",
          background: bordered ? "var(--accordion-background)" : "transparent",
          border: bordered ? `var(--border-width) solid var(--accordion-border)` : 0,
          borderTop: variant === "divided" ? `var(--border-width) solid var(--accordion-divider)` : void 0,
          borderBottom: variant === "divided" ? `var(--border-width) solid var(--accordion-divider)` : void 0,
          borderRadius: bordered ? "var(--accordion-radius)" : 0,
          minWidth: 0,
          ...style
        }
      },
      rows.map((item, i) => /* @__PURE__ */ import_react24.default.createElement(
        AccordionItem,
        {
          key: item.value,
          item,
          size,
          variant,
          headingLevel,
          idBase: `${uid}-${i}`,
          first: i === 0,
          last: i === rows.length - 1,
          keepMounted,
          open: openSet.has(item.value),
          onToggle: (next) => setOpen(item.value, next),
          buttonRef: (el) => {
            refs.current[i] = el;
          },
          onKeyDown: keyDown(i)
        }
      ))
    );
  }

  // components/core/Avatar.jsx
  var import_react26 = __toESM(require_react(), 1);

  // components/primitives/media.js
  var import_react25 = __toESM(require_react(), 1);
  function useImageFallback(src) {
    const [failedSrc, setFailedSrc] = import_react25.default.useState(null);
    const failed = !!src && failedSrc === src;
    const onError = import_react25.default.useCallback(() => setFailedSrc(src || null), [src]);
    return { show: !!src && !failed, failed, onError };
  }

  // components/core/Avatar.jsx
  var SIZES6 = { xs: "var(--avatar-size-xs)", sm: "var(--avatar-size-sm)", md: "var(--avatar-size-md)", lg: "var(--avatar-size-lg)", xl: "var(--avatar-size-xl)" };
  var NOMINAL = { xs: 20, sm: 24, md: 32, lg: 40, xl: 64 };
  var TYPE_RATIO_ONE = 0.55;
  var TYPE_RATIO_MANY = 0.42;
  var ONE_INITIAL_BELOW = 32;
  var STATUS_MIN = 24;
  var SINGLE_GLYPH_SCRIPT = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/;
  function graphemes(s) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      try {
        return Array.from(new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(s), (g) => g.segment);
      } catch (e) {
      }
    }
    return Array.from(s);
  }
  function deriveInitials(name, max = 2) {
    if (!name) return "";
    let s = String(name).trim();
    if (!s) return "";
    if (s.includes("@") && !s.includes(" ")) s = s.slice(0, s.indexOf("@")).replace(/[._\-+]+/g, " ").trim();
    const words = s.split(/\s+/).filter(Boolean);
    if (!words.length) return "";
    const first = graphemes(words[0])[0] || "";
    if (SINGLE_GLYPH_SCRIPT.test(first)) return first;
    if (max < 2) return first.toUpperCase();
    if (words.length === 1) {
      const isId = /[0-9]/.test(s) || /[-_.]/.test(s);
      if (!isId) return first.toUpperCase();
      const run = (s.match(/[\p{L}\p{N}]+/u) || [s])[0];
      return graphemes(run).slice(0, 2).join("").toUpperCase();
    }
    const last = graphemes(words[words.length - 1])[0] || "";
    return (first + last).toUpperCase();
  }
  function Avatar({
    name,
    initials,
    src,
    kind = "person",
    size = "md",
    status,
    statusLabel,
    /* The default ANNOUNCES. An avatar alone in a topbar is the only identity
         present, so silence there would lose it entirely.

         But `decorative` is the right call in most places an avatar actually
         appears — a table cell, a list row — because the name is already beside
         it and announcing both reads "Maya Osei, image, Maya Osei" on every row.
         Pass it there. (This comment asserted the opposite of the code for one
         build, which on an accessibility default is worse than no comment: a
         developer who trusted it would omit the prop in exactly the case that
         needs it.) */
    decorative = false,
    style,
    ...rest
  }) {
    const { show: showImage, onError } = useImageFallback(src);
    const px = SIZES6[size] || SIZES6.md;
    const machine = kind === "machine";
    const numeric = NOMINAL[size] || NOMINAL.md;
    const resolved2 = initials != null ? initials : deriveInitials(name, numeric < ONE_INITIAL_BELOW ? 1 : 2);
    if (!name && !initials && !src) {
      console.warn("[Meridian] Avatar: no `name`, `initials` or `src` \u2014 this renders an empty disc, which is a layout hole rather than an identity.");
    }
    if (!name && !decorative) {
      console.warn("[Meridian] Avatar: no `name` on a non-decorative avatar. Without it there is nothing to announce; pass `name`, or `decorative` if the name is already beside it in the row.");
    }
    if (rest.onClick) {
      console.warn("[Meridian] Avatar: `onClick` is not supported. An avatar that opens a profile is a Button or Link WRAPPING an avatar \u2014 that way it gets a role, a focus ring, a keyboard and an accessible name. Same rule as Icon.");
    }
    if (status && numeric < STATUS_MIN) {
      console.warn('[Meridian] Avatar: `status` below 24px renders a dot under 7px, which is not legible and not distinguishable by hue. Use size="sm" or larger, or show presence in the row instead.');
    }
    if (status && !statusLabel && !decorative) {
      console.warn(`[Meridian] Avatar: status="${status}" with no \`statusLabel\`. The dot is colour-only (WCAG 1.4.1) unless its meaning reaches the accessible name.`);
    }
    const label = [name, status && (statusLabel || status)].filter(Boolean).join(", ");
    return /* @__PURE__ */ import_react26.default.createElement(
      "span",
      {
        ...rest,
        onClick: void 0,
        role: decorative ? void 0 : "img",
        "aria-label": decorative ? void 0 : label || void 0,
        "aria-hidden": decorative ? "true" : void 0,
        "data-avatar": kind,
        style: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
          width: px,
          height: px,
          /* Both, so a flex row cannot squash the disc into an oval — the one
             way an avatar visibly breaks and the reason width alone is not
             enough. */
          minWidth: px,
          background: machine ? "var(--avatar-background-machine)" : "var(--avatar-background)",
          border: `var(--border-width) solid var(--avatar-border)`,
          borderRadius: machine ? "var(--avatar-radius-machine)" : "var(--avatar-radius)",
          boxSizing: "border-box",
          /* The initials' ink travels as a custom property rather than being set
             directly on the text span. A plain `color` on the span always wins
             over anything inherited, which is why AvatarGroup's
             --avatar-overflow-foreground was a declared, documented, inert
             token for one build: it was passed as `color` on this disc and the
             span overrode it every time. A caller can now retarget the ink by
             setting --avatar-ink in `style`. */
          "--avatar-ink": machine ? "var(--avatar-foreground-machine)" : "var(--avatar-foreground)",
          /* NOT overflow: hidden. The photo is the only child that needs
             clipping to the disc shape, and it clips itself with
             borderRadius: 'inherit' — whereas a clip HERE also cut the presence
             dot into a crescent and erased its ring entirely, which is the one
             thing the ring exists to prevent (§02: "so it reads as sitting on
             top rather than being part of the portrait"). Shipped that way for
             one build. Any future child gets the same freedom. */
          userSelect: "none",
          ...style
        }
      },
      /* @__PURE__ */ import_react26.default.createElement(
        "span",
        {
          "aria-hidden": "true",
          style: {
            fontFamily: machine ? "var(--font-mono)" : "var(--font-sans)",
            fontSize: `max(calc(${px} * ${(resolved2 || "").length > 1 ? TYPE_RATIO_MANY : TYPE_RATIO_ONE}), var(--text-2xs))`,
            fontWeight: machine ? "var(--weight-regular)" : "var(--weight-medium)",
            letterSpacing: machine ? "-0.03em" : "0.01em",
            lineHeight: 1,
            color: "var(--avatar-ink)"
          }
        },
        resolved2 || (machine ? /* @__PURE__ */ import_react26.default.createElement(Icon, { name: "cpu", size: numeric < 32 ? "xs" : "sm" }) : /* @__PURE__ */ import_react26.default.createElement(Icon, { name: "user", size: numeric < 32 ? "xs" : "sm" }))
      ),
      showImage && /* @__PURE__ */ import_react26.default.createElement(
        "img",
        {
          src,
          alt: "",
          onError,
          style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "inherit" }
        }
      ),
      status && /* @__PURE__ */ import_react26.default.createElement(
        "span",
        {
          "aria-hidden": "true",
          style: {
            position: "absolute",
            right: 0,
            bottom: 0,
            width: `calc(${px} * var(--avatar-status-size))`,
            height: `calc(${px} * var(--avatar-status-size))`,
            background: `var(--avatar-status-${status})`,
            borderRadius: "var(--radius-full)",
            /* Ringed in the surface behind it, so the dot reads as sitting
               on top of the disc rather than being part of the portrait. */
            boxShadow: `0 0 0 var(--avatar-group-ring-width) var(--avatar-group-ring)`
          }
        }
      )
    );
  }
  Avatar.deriveInitials = deriveInitials;

  // components/core/AvatarGroup.jsx
  var import_react27 = __toESM(require_react(), 1);
  function AvatarGroup({
    people = [],
    max = 4,
    size = "sm",
    label,
    style,
    ...rest
  }) {
    const shown = people.slice(0, max);
    const hidden = people.length - shown.length;
    if (people.length > 12 && !label) {
      console.warn('[Meridian] AvatarGroup: more than 12 people and no `label`. The generated summary becomes a long string nobody wants read out \u2014 pass a label like "12 assignees".');
    }
    if (max < 1) {
      console.warn("[Meridian] AvatarGroup: `max` below 1 renders nothing but a count, which is a number, not a group. Use a Badge.");
    }
    const names = shown.map((p) => typeof p === "string" ? p : p.name).filter(Boolean);
    const hiddenNames = people.slice(max).map((p) => typeof p === "string" ? p : p.name).filter(Boolean);
    const summary = label || (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0] || "");
    return /* @__PURE__ */ import_react27.default.createElement(
      "span",
      {
        ...rest,
        style: { display: "inline-flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "flex-end", ...style }
      },
      hidden > 0 && /* The chip is NOT decorative: it takes the name "+2 more" and carries
                 the hidden names as its DESCRIPTION, so nothing is double-counted
                 against the group's own label and nobody hears the same string
                 twice.

                 The description arrives via `title` rather than a Tooltip, and the
                 reason is layering, not taste. Core is tier 2 — it may reach down
                 into primitives and sideways within itself, and nothing else. This
                 file's `../feedback/Tooltip.jsx` import was the system's only edge
                 pointing UP a tier, and `layer-violation` in check-contracts.mjs
                 now fails the build on any successor.

                 Promoting `Tooltip` into core was the obvious alternative and is
                 refused on taxonomy: it is a feedback surface — warmth, dismissal,
                 hover tolerance, the family Toast, Snackbar, Alert and Popover
                 belong to — and moving it to satisfy one import would distort the
                 category to serve its tail. (At 1.26.0 there was a harder reason on
                 top: Tooltip imported `feedback/anchor.js`, so promoting it would
                 only have moved the violation onto a file with seven consumers.
                 That argument retired at 1.27.0, when the anchoring engine moved to
                 core/ on its own merits. The taxonomic one stands alone.)

                 Taking the tooltip as a prop was refused on different grounds: the
                 hidden names are an accessibility feature, and an opt-in one is
                 absent wherever a caller forgets it.

                 `title` is the option that DELETES the dependency instead of
                 relocating it, and it preserves the contract intact: with role="img"
                 and an aria-label present, accname skips `title` for the name and
                 exposes it as the description — one attribute, both audiences, no
                 hidden span.

                 What is genuinely lost is the styled panel on KEYBOARD focus, since
                 `title` answers the pointer only. So the chip no longer takes
                 tabIndex: a focus stop that offers a keyboard user nothing is its
                 own defect, and the chip stays in the accessibility tree — a screen
                 reader still reaches it, names it and reads the names off it in
                 browse mode. A product that wants the warm, dismissible panel wraps
                 the chip itself at the call site, where reaching for feedback/ is
                 legal.

                 Rule, generally: a decorative element may not own a focusable
                 trigger. It stops being decorative instead. */
      /* @__PURE__ */ import_react27.default.createElement(
        "span",
        {
          role: "img",
          "aria-label": `+${hidden} more`,
          title: hiddenNames.length ? hiddenNames.join(", ") : void 0,
          style: { display: "inline-flex", position: "relative", zIndex: 1, borderRadius: "var(--avatar-radius)" }
        },
        /* @__PURE__ */ import_react27.default.createElement(
          Avatar,
          {
            decorative: true,
            size,
            initials: `+${hidden}`,
            style: { boxShadow: `0 0 0 var(--avatar-group-ring-width) var(--avatar-group-ring)`, "--avatar-ink": "var(--avatar-overflow-foreground)" }
          }
        )
      ),
      /* @__PURE__ */ import_react27.default.createElement("span", { role: "img", "aria-label": summary, style: { display: "inline-flex", flexDirection: "row-reverse", alignItems: "center" } }, [...shown].reverse().map((p, i) => {
        const person = typeof p === "string" ? { name: p } : p;
        return /* @__PURE__ */ import_react27.default.createElement(
          Avatar,
          {
            key: person.id || person.name || i,
            decorative: true,
            size,
            name: person.name,
            initials: person.initials != null ? person.initials : Avatar.deriveInitials(person.name, 1),
            src: person.src,
            kind: person.kind,
            style: {
              /* Negative margin-RIGHT because the row is reversed: in
                 row-reverse the main axis runs right-to-left, so
                 margin-right is the leading edge and a negative one pulls
                 each disc over the neighbour to its right. The visually
                 right-most disc gets none, so the group ends flush — unless
                 the overflow chip follows it, which then needs the pull. */
              marginRight: i === 0 ? hidden === 0 ? 0 : `calc(var(--avatar-size-${size}) * -1 * var(--avatar-group-overlap))` : `calc(var(--avatar-size-${size}) * -1 * var(--avatar-group-overlap))`,
              boxShadow: `0 0 0 var(--avatar-group-ring-width) var(--avatar-group-ring)`
            }
          }
        );
      }))
    );
  }

  // components/core/Badge.jsx
  var import_react28 = __toESM(require_react(), 1);
  var TONES = {
    neutral: ["var(--badge-neutral-background)", "var(--badge-neutral-foreground)", "var(--badge-neutral-border)", "var(--badge-neutral-dot)"],
    accent: ["var(--badge-accent-background)", "var(--badge-accent-foreground)", "var(--badge-accent-border)", "var(--badge-accent-dot)"],
    success: ["var(--badge-success-background)", "var(--badge-success-foreground)", "var(--badge-success-border)", "var(--badge-success-dot)"],
    warning: ["var(--badge-warning-background)", "var(--badge-warning-foreground)", "var(--badge-warning-border)", "var(--badge-warning-dot)"],
    critical: ["var(--badge-critical-background)", "var(--badge-critical-foreground)", "var(--badge-critical-border)", "var(--badge-critical-dot)"]
  };
  TONES.danger = TONES.critical;
  var SIZES7 = {
    sm: { h: "var(--badge-height-sm)", px: "var(--badge-padding-sm)", gap: "var(--badge-gap-sm)", text: "var(--text-2xs)", icon: "mark" },
    md: { h: "var(--badge-height-md)", px: "var(--badge-padding-md)", gap: "var(--badge-gap-md)", text: "var(--text-xs)", icon: "xs" }
  };
  function Badge({ tone = "neutral", size = "md", dot = false, icon, max, children, style, ...rest }) {
    const [bg, fg, bc, solid] = TONES[tone] || TONES.neutral;
    const S = SIZES7[size] || SIZES7.md;
    const numeric = typeof children === "number" || typeof children === "string" && /^\d+$/.test(children);
    const capped = max != null && numeric && Number(children) > max;
    const label = capped ? `${max}+` : children;
    const hasText = children != null && children !== "" && children !== false;
    const named = hasText || rest["aria-label"] || rest["aria-labelledby"];
    {
      if (!named) {
        console.warn(
          '[Meridian] Badge: no text and no aria-label \u2014 a dot or icon alone carries its meaning in colour, which fails WCAG 1.4.1. Pass a label or aria-label="Down".'
        );
      }
      if (dot && icon) {
        console.warn("[Meridian] Badge: `dot` and `icon` together read as two status marks. Pick one.");
      }
      if (rest.onClick || rest.href) {
        console.warn(
          "[Meridian] Badge: badges are not interactive. Use Button for an action, Link to navigate, or Tag for a value the user can toggle."
        );
      }
    }
    return /* @__PURE__ */ import_react28.default.createElement(
      "span",
      {
        "data-badge": "",
        ...capped ? { "aria-label": rest["aria-label"] ?? String(children), title: rest.title ?? String(children) } : null,
        ...rest,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: S.gap,
          height: S.h,
          padding: `0 ${S.px}`,
          fontFamily: "var(--font-sans)",
          fontSize: S.text,
          fontWeight: "var(--weight-medium)",
          lineHeight: 1,
          whiteSpace: "nowrap",
          fontVariantNumeric: numeric ? "tabular-nums" : void 0,
          color: fg,
          background: bg,
          border: `var(--border-width) solid ${bc}`,
          borderRadius: "var(--badge-radius)",
          ...style
        }
      },
      dot && /* @__PURE__ */ import_react28.default.createElement(
        "span",
        {
          "data-badge-dot": "",
          "aria-hidden": "true",
          style: {
            width: "var(--badge-dot-size)",
            height: "var(--badge-dot-size)",
            borderRadius: "var(--radius-pill)",
            background: solid,
            flex: "0 0 auto"
          }
        }
      ),
      icon && !dot && /* @__PURE__ */ import_react28.default.createElement(Icon, { name: icon, size: S.icon }),
      label
    );
  }

  // components/core/ButtonGroup.jsx
  var import_react29 = __toESM(require_react(), 1);
  var ICON_VARIANT = { primary: "solid", secondary: "outline", ghost: "ghost", danger: "solid" };
  var FILLED = ["primary", "danger", "solid"];
  function ButtonGroup({ label, variant = "secondary", size = "md", children, style, ...rest }) {
    const items = import_react29.default.Children.toArray(children).filter(Boolean);
    const [raised, setRaised] = import_react29.default.useState(-1);
    if (!label) {
      console.warn('[Meridian] ButtonGroup: `label` is required \u2014 role="group" with no accessible name is announced as an unlabelled group.');
    }
    const resolved2 = items.map((child) => {
      const isIcon = child.type === IconButton;
      const isButton = child.type === Button;
      let v = child.props?.variant || (isIcon ? ICON_VARIANT[variant] : variant);
      if (!isIcon && !isButton) {
        console.warn(
          "[Meridian] ButtonGroup: children must be Button or IconButton. Anything else is handed `variant` and `size` props it does not understand, and the corner and seam styles will not land \u2014 the cluster will not read as one control."
        );
      }
      if (v === "link") {
        console.warn(
          '[Meridian] ButtonGroup: variant "link" cannot be used inside a group \u2014 it has no border or height to join, so it breaks the seam. Rendering as "secondary"; put a link action outside the group instead.'
        );
        v = isIcon ? "outline" : "secondary";
      }
      return { child, isIcon, variant: v };
    });
    const fills = resolved2.filter((r2) => !r2.isIcon && FILLED.indexOf(r2.variant) > -1).length;
    if (fills > 1) {
      console.warn("[Meridian] ButtonGroup: more than one filled button in a group. Two solid fills side by side read as two competing primaries \u2014 keep one filled button at most.");
    }
    const r = "var(--button-group-radius)";
    return /* @__PURE__ */ import_react29.default.createElement(
      "div",
      {
        role: "group",
        "aria-label": label,
        ...rest,
        style: { display: "inline-flex", isolation: "isolate", ...style }
      },
      resolved2.map(({ child, variant: childVariant }, i) => {
        const first = i === 0;
        const last = i === resolved2.length - 1;
        const structural = {
          borderRadius: `${first ? r : "0"} ${last ? r : "0"} ${last ? r : "0"} ${first ? r : "0"}`,
          marginLeft: first ? void 0 : "calc(var(--border-width) * -1)",
          /* One seam colour for the whole cluster. Button `secondary` borders
             at --border-default while IconButton `outline` borders at
             --border-control (4.74:1, correct for a STANDALONE icon button
             whose border is its only boundary) — left alone, a split button
             draws its icon cap 3.7x darker than its lettered half. Inside a
             group an icon child is not standalone: it is identified by its
             siblings and the group name, so the contrast argument does not
             apply. Overriding the colour outright also holds the outline
             steady while one child is hovered, which is what a single
             continuous control should do. */
          ...childVariant === "secondary" || childVariant === "outline" ? { borderColor: "var(--button-group-border)" } : null,
          ...childVariant === "ghost" && !first ? { borderLeftColor: "var(--button-group-divider)" } : null
        };
        return /* @__PURE__ */ import_react29.default.createElement(
          "span",
          {
            key: child.key || i,
            onMouseEnter: () => setRaised(i),
            onMouseLeave: () => setRaised(-1),
            onFocusCapture: () => setRaised(i),
            onBlurCapture: () => setRaised(-1),
            style: { display: "inline-flex", position: "relative", zIndex: raised === i ? 1 : 0 }
          },
          import_react29.default.cloneElement(child, {
            variant: childVariant,
            size: child.props.size || size,
            style: { ...child.props.style, ...structural }
          })
        );
      })
    );
  }

  // components/core/Card.jsx
  var import_react30 = __toESM(require_react(), 1);
  var PAD = { none: 0, sm: "var(--space-4)", md: "var(--space-6)", lg: "var(--space-8)" };
  var FOOTER_ALIGN = { end: "flex-end", start: "flex-start", between: "space-between" };
  function Card({
    as,
    title,
    subtitle,
    actions,
    footer,
    footerAlign = "end",
    headingLevel = 3,
    padding = "md",
    elevated = false,
    interactive = false,
    onClick,
    children,
    style,
    ...rest
  }) {
    const uid = import_react30.default.useId();
    const titleId = `${uid}-title`;
    const pad2 = PAD[padding] != null ? PAD[padding] : PAD.md;
    const hasHeader = title || subtitle || actions;
    const clickable = interactive && !!onClick;
    if (interactive && !onClick) {
      console.warn("[Meridian] Card: `interactive` with no `onClick` gives the card a pointer cursor and a hover border but nothing to activate \u2014 and passing onClick through the spread instead leaves it unfocusable and keyboard-inert. Pass onClick, or drop `interactive`.");
    }
    const Tag2 = as || (title ? "section" : "div");
    return /* @__PURE__ */ import_react30.default.createElement(
      Tag2,
      {
        "data-card": clickable ? "interactive" : "static",
        "data-elevated": elevated ? "" : void 0,
        "aria-labelledby": title && Tag2 === "section" ? titleId : void 0,
        onClick: clickable ? onClick : void 0,
        tabIndex: clickable ? 0 : void 0,
        role: clickable ? "button" : void 0,
        onKeyDown: clickable ? (e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e);
          }
        } : void 0,
        ...rest,
        style: {
          display: "flex",
          flexDirection: "column",
          /* Background, border AND box-shadow are all owned by base.css.
             The shadow has to be there too, not just the border: the
             focus-visible ring IS a box-shadow, and an inline box-shadow of
             any value outranks it, so leaving the resting shadow inline
             silently killed the focus ring. */
          borderRadius: "var(--card-radius)",
          minWidth: 0,
          ...style
        }
      },
      hasHeader && /* @__PURE__ */ import_react30.default.createElement("header", { style: { display: "flex", alignItems: "flex-start", gap: "var(--space-4)", padding: `var(--space-4) ${pad2 || "var(--space-4)"}`, borderBottom: "var(--border-width) solid var(--card-header-border)" } }, /* @__PURE__ */ import_react30.default.createElement("div", { style: { minWidth: 0, flex: 1 } }, title && import_react30.default.createElement(
        `h${Math.min(Math.max(headingLevel, 1), 6)}`,
        { id: titleId, style: { margin: 0, fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-heading)", color: "var(--card-title-text)" } },
        title
      ), subtitle && /* @__PURE__ */ import_react30.default.createElement("p", { style: { margin: "3px 0 0", fontSize: "var(--text-xs)", color: "var(--card-subtitle-text)" } }, subtitle)), actions && /* @__PURE__ */ import_react30.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flex: "0 0 auto" } }, actions)),
      /* @__PURE__ */ import_react30.default.createElement("div", { style: { padding: pad2, minWidth: 0, flex: 1 } }, children),
      footer && /* @__PURE__ */ import_react30.default.createElement(
        "footer",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: FOOTER_ALIGN[footerAlign] || FOOTER_ALIGN.end,
            flexWrap: "wrap",
            gap: "var(--space-2)",
            padding: `var(--space-3) ${pad2 || "var(--space-4)"}`,
            borderTop: "var(--border-width) solid var(--card-footer-border)",
            background: "var(--card-footer-background)",
            borderRadius: "0 0 var(--card-radius) var(--card-radius)"
          }
        },
        footerAlign === "between" ? /* @__PURE__ */ import_react30.default.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex" } }, import_react30.default.isValidElement(footer) ? import_react30.default.cloneElement(footer, { style: { flex: 1, minWidth: 0, ...footer.props.style || {} } }) : footer) : footer
      )
    );
  }

  // components/core/Chip.jsx
  var import_react31 = __toESM(require_react(), 1);
  var chipContext = import_react31.default.createContext(null);
  var SIZES8 = {
    sm: { h: "var(--chip-height-sm)", px: "var(--chip-padding-sm)", gap: 6, text: "var(--text-xs)", icon: "xs" },
    md: { h: "var(--chip-height-md)", px: "var(--chip-padding-md)", gap: 7, text: "var(--text-sm)", icon: "sm" }
  };
  function Chip({
    label,
    children,
    value,
    icon,
    count,
    selected,
    disabled = false,
    size,
    style,
    ...rest
  }) {
    const group = import_react31.default.useContext(chipContext);
    const [hover, setHover] = import_react31.default.useState(false);
    const [focus, setFocus] = import_react31.default.useState(false);
    const text = label ?? children;
    const S = SIZES8[size || group?.size || "md"] || SIZES8.md;
    const on = selected ?? (group ? group.isSelected(value) : false);
    const off = disabled || group?.disabled;
    if (!group) {
      console.warn(
        "[Meridian] Chip: rendered outside a ChipGroup. A chip is one of a set \u2014 a single chip standing alone is a toggle Button, and outside a group it has no name, no legend and no selection semantics."
      );
    }
    const bg = off ? "var(--chip-background-disabled)" : on ? hover ? "var(--chip-background-selected-hover)" : "var(--chip-background-selected)" : hover ? "var(--chip-background-hover)" : "var(--chip-background)";
    return /* @__PURE__ */ import_react31.default.createElement(
      "label",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: S.gap,
          height: S.h,
          padding: `0 ${S.px}`,
          fontFamily: "var(--font-sans)",
          fontSize: S.text,
          fontWeight: on ? "var(--weight-medium)" : "var(--weight-regular)",
          lineHeight: 1,
          whiteSpace: "nowrap",
          color: off ? "var(--chip-foreground-disabled)" : on ? "var(--chip-foreground-selected)" : "var(--chip-foreground)",
          background: bg,
          border: `var(--border-width) solid ${off ? "var(--chip-border-disabled)" : on ? "var(--chip-border-selected)" : hover ? "var(--chip-border-hover)" : "var(--chip-border)"}`,
          borderRadius: "var(--chip-radius)",
          boxShadow: focus ? "var(--chip-focus-ring)" : "none",
          cursor: off ? "not-allowed" : "pointer",
          transition: "var(--transition-control)",
          ...style
        }
      },
      /* @__PURE__ */ import_react31.default.createElement(
        "input",
        {
          type: group?.type || "checkbox",
          name: group?.name,
          value,
          checked: on,
          disabled: off,
          required: group?.requiredValue != null && group.requiredValue === value ? true : void 0,
          onChange: (e) => {
            group?.onToggle(value, e);
            rest.onChange?.(e);
          },
          onFocus: (e) => {
            setFocus(e.target.matches(":focus-visible"));
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocus(false);
            rest.onBlur?.(e);
          },
          ...rest,
          style: { position: "absolute", opacity: 0, width: 0, height: 0 }
        }
      ),
      /* @__PURE__ */ import_react31.default.createElement(
        "span",
        {
          "aria-hidden": "true",
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
            width: "var(--chip-check-size)",
            height: "var(--chip-check-size)",
            opacity: on ? 1 : 0,
            transition: "var(--transition-control)"
          }
        },
        /* @__PURE__ */ import_react31.default.createElement(Icon, { name: "check", size: "mark" })
      ),
      icon && /* @__PURE__ */ import_react31.default.createElement(Icon, { name: icon, size: S.icon, style: { color: off ? "inherit" : on ? "inherit" : "var(--chip-icon)" } }),
      /* @__PURE__ */ import_react31.default.createElement("span", { style: { minWidth: 0 } }, text),
      count != null && /* @__PURE__ */ import_react31.default.createElement("span", { style: {
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-2xs)",
        fontVariantNumeric: "tabular-nums",
        color: off ? "inherit" : on ? "inherit" : "var(--chip-count-foreground)"
      } }, count)
    );
  }

  // components/core/ChipGroup.jsx
  var import_react33 = __toESM(require_react(), 1);

  // components/core/Fieldset.jsx
  var import_react32 = __toESM(require_react(), 1);
  function Fieldset({
    label,
    hint,
    error,
    required = false,
    disabled = false,
    gap = "var(--space-2)",
    children,
    style,
    ...rest
  }) {
    const autoId = import_react32.default.useId();
    const hintId = `${autoId}-hint`;
    const errId = `${autoId}-err`;
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn("[Meridian] Fieldset: no label. A <fieldset> with no <legend> is an unnamed group \u2014 the one thing this component exists to provide. Screen readers announce the options with no idea what question they answer. Pass a label, or aria-label if the question is already on screen.");
    }
    const described = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ import_react32.default.createElement(
      "fieldset",
      {
        ...rest,
        disabled,
        "aria-describedby": rest["aria-describedby"] ?? described,
        style: {
          display: "flex",
          flexDirection: "column",
          gap,
          border: 0,
          margin: 0,
          padding: 0,
          /* Both, deliberately: a fieldset's default min-inline-size is
             min-content, which stops it shrinking inside a flex or grid parent
             however small its content is. */
          minInlineSize: 0,
          minWidth: 0,
          ...style
        }
      },
      label && /* @__PURE__ */ import_react32.default.createElement("legend", { style: { float: "none", display: "flex", alignItems: "center", gap: 4, padding: 0, fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)", color: "var(--field-label-text)", letterSpacing: "var(--tracking-body)" } }, label, required && /* @__PURE__ */ import_react32.default.createElement("span", { style: { color: "var(--field-required-mark)" }, "aria-hidden": "true" }, "*")),
      children,
      hint && /* @__PURE__ */ import_react32.default.createElement("span", { id: hintId, style: { fontSize: "var(--text-xs)", color: "var(--field-hint-text)" } }, hint),
      /* @__PURE__ */ import_react32.default.createElement("span", { id: errId, role: "alert", style: error ? { display: "flex", alignItems: "flex-start", gap: "var(--field-message-gap)", fontSize: "var(--text-xs)", color: "var(--field-error-text)" } : { display: "none" } }, error ? /* @__PURE__ */ import_react32.default.createElement(import_react32.default.Fragment, null, /* @__PURE__ */ import_react32.default.createElement(Icon, { name: "circle-alert", size: "xs", "aria-hidden": "true", style: { flex: "none", marginTop: 2 } }), error) : null)
    );
  }

  // components/core/ChipGroup.jsx
  function ChipGroup({
    label,
    hint,
    error,
    options,
    children,
    value,
    onChange,
    multiple = false,
    required = false,
    disabled = false,
    size = "md",
    name,
    /* Token, not 8: freeze criterion 3 — a product re-scaling the space
       scale must not leave this row on a private number. */
    gap = "var(--space-2)",
    style,
    ...rest
  }) {
    const autoId = import_react33.default.useId();
    const groupName = name || `chip-${autoId}`;
    const items = options || [];
    const childList = import_react33.default.Children.toArray(children).filter(Boolean);
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] ChipGroup: no `label`. A set of options with no question announces as loose controls \u2014 pass the question the chips answer ("Shift", "Areas").');
    }
    if ((items.length || childList.length) < 2) {
      console.warn("[Meridian] ChipGroup: fewer than two options. One chip is a toggle Button.");
    }
    if (items.length && childList.length) {
      console.warn("[Meridian] ChipGroup: both `options` and children. The children render after the options, outside the value model \u2014 pass one or the other.");
    }
    if (!multiple && Array.isArray(value)) {
      console.warn("[Meridian] ChipGroup: array `value` without `multiple`. Single-select holds one string.");
    }
    if (items.length > 7) {
      console.warn("[Meridian] ChipGroup: more than seven options. Past about seven the row wraps into a block nobody scans \u2014 use Select for a known list, Combobox for a searchable one.");
    }
    const order = items.length ? items.map((o) => o.value) : childList.map((c) => c.props?.value).filter((v) => v != null);
    if (value != null && value !== "" && order.length) {
      const missing = (multiple ? Array.isArray(value) ? value : [] : [value]).filter((v) => v != null && v !== "" && order.indexOf(v) === -1);
      if (missing.length) {
        console.warn(`[Meridian] ChipGroup: value ${JSON.stringify(missing)} matches no option, so nothing appears selected \u2014 a silent mismatch between the form model and the offered set.`);
      }
    }
    const selectedSet = multiple ? new Set(Array.isArray(value) ? value : []) : null;
    const requiredValue = required && !multiple && !disabled ? items.length ? items.find((o) => !o.disabled)?.value : order[0] : void 0;
    const ctx = {
      name: groupName,
      type: multiple ? "checkbox" : "radio",
      size,
      disabled,
      required,
      requiredValue,
      isSelected: (v) => multiple ? selectedSet.has(v) : value === v,
      onToggle: (v, e) => {
        if (!onChange) return;
        if (!multiple) {
          onChange(v, e);
          return;
        }
        const next = new Set(selectedSet);
        next.has(v) ? next.delete(v) : next.add(v);
        onChange(order.length ? order.filter((k) => next.has(k)) : Array.from(next), e);
      }
    };
    return /* @__PURE__ */ import_react33.default.createElement(Fieldset, { ...rest, label, hint, error, required, disabled, style }, /* @__PURE__ */ import_react33.default.createElement(chipContext.Provider, { value: ctx }, /* @__PURE__ */ import_react33.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap, minWidth: 0 } }, items.map((o) => /* @__PURE__ */ import_react33.default.createElement(Chip, { key: o.value, value: o.value, label: o.label, icon: o.icon, count: o.count, disabled: o.disabled })), children)));
  }

  // components/core/Link.jsx
  var import_react34 = __toESM(require_react(), 1);
  var TONES2 = {
    default: { rest: "var(--link-foreground)", hover: "var(--link-foreground-hover)", active: "var(--link-foreground-active)" },
    subtle: { rest: "var(--link-foreground-subtle)", hover: "var(--link-foreground-subtle-hover)", active: "var(--link-foreground-subtle-hover)" },
    inverse: { rest: "var(--link-foreground-inverse)", hover: "var(--link-foreground-inverse-hover)", active: "var(--link-foreground-inverse-active)" }
  };
  function Link({
    href,
    children,
    tone = "default",
    underline = "always",
    external = false,
    showExternalIcon = true,
    style,
    ...rest
  }) {
    const [hover, setHover] = import_react34.default.useState(false);
    const [down, setDown] = import_react34.default.useState(false);
    if (!href) {
      console.warn('[Meridian] Link: `href` is required. A control with no destination is not a link \u2014 use <Button variant="link"> for an action, which is announced as a button and reachable by Space.');
    }
    if (tone === "inverse" && underline === "hover") {
      console.warn('[Meridian] Link: tone="inverse" cannot use underline="hover" \u2014 an inverse link is only 1.63:1 against surrounding inverse text, so the underline is its only resting cue. Rendering underlined.');
      underline = "always";
    }
    const t = TONES2[tone] || TONES2.default;
    const colour = down ? t.active : hover ? t.hover : t.rest;
    const lined = underline === "always" || underline === "hover" && hover;
    return /* @__PURE__ */ import_react34.default.createElement(
      "a",
      {
        href,
        target: external ? "_blank" : void 0,
        rel: external ? "noopener noreferrer" : void 0,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => {
          setHover(false);
          setDown(false);
        },
        onMouseDown: () => setDown(true),
        onMouseUp: () => setDown(false),
        ...rest,
        style: {
          color: colour,
          textDecoration: lined ? "underline" : "none",
          textUnderlineOffset: 2,
          /* Keeps the glyph and the label on one line and lets the underline run
             under both, so an external link reads as a single target. */
          ...external && showExternalIcon ? { display: "inline-flex", alignItems: "center", gap: "var(--icon-gap-tight)" } : null,
          transition: "color var(--duration-fast) var(--ease-out)",
          ...style
        }
      },
      children,
      external && showExternalIcon ? /* @__PURE__ */ import_react34.default.createElement(Icon, { name: "arrow-up-right", size: "xs" }) : null,
      external ? (
        /* Announced, not drawn: the glyph alone does not tell a screen-reader
           user the destination opens in a new tab. */
        /* @__PURE__ */ import_react34.default.createElement("span", { style: { position: "absolute", width: 1, height: 1, margin: -1, padding: 0, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 } }, "(opens in a new tab)")
      ) : null
    );
  }

  // components/core/SegmentedControl.jsx
  var import_react35 = __toESM(require_react(), 1);
  var SIZES9 = {
    sm: { h: "var(--segmented-height-sm)", px: "var(--segmented-padding-sm)", gap: 6, text: "var(--text-xs)", icon: "xs" },
    md: { h: "var(--segmented-height-md)", px: "var(--segmented-padding-md)", gap: 7, text: "var(--text-sm)", icon: "sm" }
  };
  function Segment({ option, checked, name, size, groupDisabled, iconOnly, onSelect, grow }) {
    const [hover, setHover] = import_react35.default.useState(false);
    const [focus, setFocus] = import_react35.default.useState(false);
    const S = SIZES9[size] || SIZES9.md;
    const off = groupDisabled || option.disabled;
    const label = option.label;
    return /* @__PURE__ */ import_react35.default.createElement(
      "label",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        title: iconOnly && typeof label === "string" ? label : void 0,
        style: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: S.gap,
          minWidth: 0,
          flex: grow ? "1 1 auto" : "0 0 auto",
          height: S.h,
          padding: iconOnly ? 0 : `0 ${S.px}`,
          width: iconOnly ? S.h : void 0,
          fontFamily: "var(--font-sans)",
          fontSize: S.text,
          /* Medium on the selected segment only. The label must not change
             WIDTH on selection or the track jitters, so the weight step is
             paired with equal-width columns by default (§05). */
          fontWeight: checked ? "var(--weight-medium)" : "var(--weight-regular)",
          lineHeight: 1,
          whiteSpace: "nowrap",
          color: off ? "var(--segmented-foreground-disabled)" : checked ? "var(--segmented-foreground-selected)" : hover ? "var(--segmented-foreground-hover)" : "var(--segmented-foreground)",
          background: checked ? "var(--segmented-background-selected)" : hover && !off ? "var(--segmented-background-hover)" : "transparent",
          border: `var(--border-width) solid ${checked ? "var(--segmented-border-selected)" : "transparent"}`,
          borderRadius: "var(--segmented-radius)",
          boxShadow: focus ? "var(--segmented-focus-ring)" : checked ? "var(--segmented-shadow-selected)" : "none",
          cursor: off ? "not-allowed" : "pointer",
          transition: "var(--transition-control)",
          userSelect: "none"
        }
      },
      /* @__PURE__ */ import_react35.default.createElement(
        "input",
        {
          type: "radio",
          name,
          value: option.value,
          checked,
          disabled: off,
          onChange: (e) => onSelect(option.value, e),
          onFocus: (e) => setFocus(e.target.matches(":focus-visible")),
          onBlur: () => setFocus(false),
          style: { position: "absolute", opacity: 0, width: 0, height: 0, margin: 0 }
        }
      ),
      option.icon && /* @__PURE__ */ import_react35.default.createElement(
        Icon,
        {
          name: option.icon,
          size: S.icon,
          title: iconOnly && typeof label === "string" ? label : void 0,
          style: { color: off ? "inherit" : checked ? "var(--segmented-icon-selected)" : "inherit" }
        }
      ),
      !iconOnly && /* The label reserves its BOLD width at all times: a hidden medium-weight
         copy sits in the same grid cell, so the cell is as wide as the
         selected state will ever need and selection cannot re-flow the
         track. Reserving the weight here rather than relying on equal
         columns is what lets the columns size to content — minmax(0,1fr)
         collapsed every label to an ellipsis at the track's intrinsic
         width, which is the defect this replaced. */
      /* @__PURE__ */ import_react35.default.createElement("span", { style: { display: "inline-grid", minWidth: 0 } }, /* @__PURE__ */ import_react35.default.createElement("span", { "aria-hidden": "true", style: { gridArea: "1 / 1", fontWeight: "var(--weight-medium)", visibility: "hidden", overflow: "hidden", whiteSpace: "nowrap" } }, label), /* @__PURE__ */ import_react35.default.createElement("span", { style: { gridArea: "1 / 1", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" } }, label))
    );
  }
  function SegmentedControl({
    label,
    labelVisible = false,
    options = [],
    value,
    defaultValue,
    onChange,
    size = "md",
    disabled = false,
    equalWidth = true,
    iconOnly = false,
    fullWidth = false,
    /* Vertical stacks the segments. NOT a general-purpose "make it a list":
       the four-option ceiling still holds, the track is still one fixed shape,
       and the divider still runs only between unselected neighbours — only the
       axis changes. A vertical control with nine options is a Radio group. */
    orientation = "horizontal",
    name,
    style,
    ...rest
  }) {
    const autoId = import_react35.default.useId();
    const groupName = name || `segmented-${autoId}`;
    const legendId = `${autoId}-legend`;
    const [inner, setInner] = import_react35.default.useState(defaultValue ?? options[0]?.value);
    const controlled = value !== void 0 && typeof onChange === "function";
    const current = controlled ? value : inner;
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] SegmentedControl: no `label`. Pass the question the segments answer ("View", "Units") \u2014 it can stay visually hidden, but a set of unnamed radios announces as loose controls.');
    }
    if (options.length < 2) {
      console.warn("[Meridian] SegmentedControl: fewer than two options. One segment is a toggle Button.");
    }
    if (options.length > 4) {
      console.warn("[Meridian] SegmentedControl: more than four options. The track is fixed-width and every label must fit at once \u2014 use ChipGroup (wraps, up to seven) or Select.");
    }
    if (orientation === "vertical" && iconOnly) {
      console.warn("[Meridian] SegmentedControl: `vertical` with `iconOnly` is a toolbar, not a segmented control \u2014 a column of unlabelled glyphs has none of the side-by-side comparison this control exists for. Use ButtonGroup.");
    }
    if (value !== void 0 && typeof onChange !== "function") {
      console.warn("[Meridian] SegmentedControl: `value` without `onChange`. The control renders but cannot change \u2014 pass onChange, or use `defaultValue` for an uncontrolled control.");
    }
    if (iconOnly && options.some((o) => typeof o.label !== "string" || !o.icon)) {
      console.warn("[Meridian] SegmentedControl: `iconOnly` needs every option to carry an `icon` and a STRING `label` \u2014 the label becomes the accessible name and the tooltip.");
    }
    if (current != null && options.length && !options.some((o) => o.value === current)) {
      console.warn(`[Meridian] SegmentedControl: value ${JSON.stringify(current)} matches no option, so no segment appears selected \u2014 a silent mismatch between the model and the offered set.`);
    }
    const vertical = orientation === "vertical";
    const select = (v, e) => {
      if (!controlled) setInner(v);
      onChange?.(v, e);
    };
    return /* @__PURE__ */ import_react35.default.createElement(
      "fieldset",
      {
        ...rest,
        disabled: disabled || void 0,
        "aria-labelledby": label && !rest["aria-label"] && !rest["aria-labelledby"] ? legendId : void 0,
        style: {
          display: fullWidth ? "block" : "inline-block",
          margin: 0,
          padding: 0,
          border: "none",
          minWidth: 0,
          ...style
        }
      },
      /* @__PURE__ */ import_react35.default.createElement(
        "legend",
        {
          id: legendId,
          style: labelVisible ? { padding: 0, marginBottom: "var(--space-1)", fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" } : { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }
        },
        label
      ),
      /* @__PURE__ */ import_react35.default.createElement(
        "div",
        {
          style: {
            /* Vertical is always a one-column grid: the segments must be equal
               WIDTH down a stack for the track to read as one object, which is
               the opposite axis from equalWidth's job horizontally. */
            display: vertical || equalWidth ? "grid" : "inline-flex",
            /* max-content as the track minimum, not 0: the track's intrinsic
               width must fit every label. 1fr still equalises whatever space is
               left, so fullWidth and a wide container give equal columns. */
            gridTemplateColumns: vertical ? "minmax(max-content, 1fr)" : equalWidth ? `repeat(${options.length}, minmax(max-content, 1fr))` : void 0,
            alignItems: "center",
            gap: 0,
            width: fullWidth || vertical ? "100%" : void 0,
            padding: "var(--border-width)",
            background: disabled ? "var(--segmented-track-background-disabled)" : "var(--segmented-track-background)",
            border: `var(--border-width) solid var(--segmented-track-border)`,
            borderRadius: "var(--segmented-track-radius)",
            boxSizing: "border-box"
          }
        },
        options.map((o, i) => {
          const checked = o.value === current;
          const divided = i > 0 && !checked && options[i - 1].value !== current;
          return /* @__PURE__ */ import_react35.default.createElement(
            "div",
            {
              key: o.value,
              style: {
                display: "flex",
                alignItems: "center",
                minWidth: 0,
                /* The rule moves to the top edge when stacked — same rule,
                   same transparency trick so the 1px never re-flows. */
                [vertical ? "borderTop" : "borderLeft"]: `var(--border-width) solid ${divided ? "var(--segmented-divider)" : "transparent"}`,
                transition: "var(--transition-control)"
              }
            },
            /* @__PURE__ */ import_react35.default.createElement(
              Segment,
              {
                option: o,
                checked,
                name: groupName,
                size,
                groupDisabled: disabled,
                iconOnly,
                onSelect: select,
                grow: equalWidth || fullWidth
              }
            )
          );
        })
      )
    );
  }

  // components/core/Tag.jsx
  var import_react36 = __toESM(require_react(), 1);
  var SIZES10 = {
    sm: { h: "var(--tag-height-sm)", px: "var(--tag-padding-sm)", gap: 4, text: "var(--text-2xs)", icon: "mark" },
    md: { h: "var(--tag-height-md)", px: "var(--tag-padding-md)", gap: 6, text: "var(--text-2xs)", icon: "xs" }
  };
  function Tag({
    label,
    children,
    icon,
    onRemove,
    removeLabel,
    selected = false,
    disabled = false,
    size = "md",
    font = "mono",
    maxWidth,
    style,
    ...rest
  }) {
    const [hover, setHover] = import_react36.default.useState(false);
    const [focus, setFocus] = import_react36.default.useState(false);
    const [closeHover, setCloseHover] = import_react36.default.useState(false);
    const S = SIZES10[size] || SIZES10.md;
    const text = label ?? children;
    const pressable = Boolean(rest.onClick) && !disabled;
    const asButton = Boolean(rest.onClick);
    const removeName = removeLabel || `Remove ${typeof text === "string" ? text : "tag"}`;
    function onKeyDown(e) {
      rest.onKeyDown?.(e);
      if (disabled || !onRemove) return;
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        onRemove(e);
      }
    }
    const bg = disabled ? "var(--tag-background-disabled)" : selected ? pressable && hover ? "var(--tag-background-selected-hover)" : "var(--tag-background-selected)" : pressable && hover ? "var(--tag-background-hover)" : "var(--tag-background)";
    const removeButton = onRemove && /* @__PURE__ */ import_react36.default.createElement(
      "span",
      {
        ...asButton ? { role: "presentation", "aria-hidden": true } : {
          role: "button",
          tabIndex: disabled ? -1 : 0,
          "aria-label": removeName,
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!disabled) onRemove(e);
            }
          }
        },
        onClick: (e) => {
          e.stopPropagation();
          if (!disabled) onRemove(e);
        },
        onMouseEnter: () => setCloseHover(true),
        onMouseLeave: () => setCloseHover(false),
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          /* The glyph box stays 16px; the TARGET grows on a coarse pointer and
             overflows the tag through negative margins, so a 44px touch area
             costs no layout. */
          width: "var(--tag-remove-target)",
          height: "var(--tag-remove-target)",
          margin: "calc((var(--tag-remove-target) - 16px) / -2)",
          marginRight: "calc((var(--tag-remove-target) - 16px) / -2 - 2px)",
          flex: "none",
          color: disabled ? "var(--tag-foreground-disabled)" : closeHover ? "var(--tag-remove-foreground-hover)" : "var(--tag-remove-foreground)",
          background: closeHover && !disabled ? "var(--tag-remove-background-hover)" : "transparent",
          border: 0,
          borderRadius: "var(--radius-xs)",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "var(--transition-control)"
        }
      },
      /* @__PURE__ */ import_react36.default.createElement(Icon, { name: "x", size: "mark" })
    );
    const Body = asButton ? "button" : "span";
    return /* @__PURE__ */ import_react36.default.createElement(
      Body,
      {
        ...asButton ? { type: "button", disabled, "aria-pressed": selected } : { "aria-disabled": disabled || void 0 },
        ...onRemove && !disabled ? { tabIndex: rest.tabIndex ?? 0, "aria-keyshortcuts": "Delete" } : null,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
        ...rest,
        onKeyDown,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: S.gap,
          height: S.h,
          maxWidth,
          padding: `0 ${S.px} 0 ${S.px}`,
          paddingRight: onRemove ? `calc(${S.px} - 4px)` : S.px,
          fontFamily: "var(--font-sans)",
          fontSize: S.text,
          fontWeight: "var(--weight-regular)",
          textAlign: "left",
          color: disabled ? "var(--tag-foreground-disabled)" : selected ? "var(--tag-foreground-selected)" : "var(--tag-foreground)",
          background: bg,
          border: `var(--border-width) solid ${disabled ? "var(--tag-border-disabled)" : selected ? "var(--tag-border-selected)" : pressable && hover ? "var(--tag-border-hover)" : "var(--tag-border)"}`,
          borderRadius: "var(--tag-radius)",
          boxShadow: focus && !disabled ? "var(--tag-focus-ring)" : "none",
          cursor: disabled ? "not-allowed" : pressable ? "pointer" : "default",
          transition: "var(--transition-control)",
          ...style
        }
      },
      icon && /* @__PURE__ */ import_react36.default.createElement(Icon, { name: icon, size: S.icon, style: { flex: "none", color: disabled ? "inherit" : selected ? "inherit" : "var(--tag-icon)" } }),
      /* @__PURE__ */ import_react36.default.createElement("span", { style: {
        fontFamily: font === "mono" ? "var(--font-mono)" : "var(--font-sans)",
        letterSpacing: font === "mono" ? "var(--tracking-label)" : "var(--tracking-body)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        minWidth: 0
      } }, text),
      removeButton
    );
  }
  var TagList = import_react36.default.forwardRef(function TagList2({ children, limit, moreLabel, onShowMore, gap = 6, align = "start", style, ...rest }, forwardedRef) {
    const ref = import_react36.default.useRef(null);
    const [expanded, setExpanded] = import_react36.default.useState(false);
    import_react36.default.useImperativeHandle(forwardedRef, () => ref.current);
    const items = import_react36.default.Children.toArray(children).filter(Boolean);
    const shown = limit != null && !expanded ? items.slice(0, limit) : items;
    const hidden = items.length - shown.length;
    function onKeyDown(e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const stops = Array.from(ref.current?.querySelectorAll("[data-tag-stop]") || []);
      const i = stops.indexOf(e.target.closest?.("[data-tag-stop]"));
      if (i < 0) return;
      e.preventDefault();
      stops[(i + (e.key === "ArrowRight" ? 1 : -1) + stops.length) % stops.length]?.focus();
    }
    return /* @__PURE__ */ import_react36.default.createElement(
      "div",
      {
        ref,
        onKeyDown,
        ...rest,
        style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: align === "end" ? "flex-end" : "flex-start", gap, minWidth: 0, ...style }
      },
      shown.map((child, i) => import_react36.default.isValidElement(child) ? import_react36.default.cloneElement(child, { "data-tag-stop": "", tabIndex: i === 0 ? 0 : -1 }) : child),
      hidden > 0 && /* @__PURE__ */ import_react36.default.createElement(
        "button",
        {
          type: "button",
          "data-tag-stop": "",
          tabIndex: shown.length ? -1 : 0,
          onClick: (e) => onShowMore ? onShowMore(e, hidden) : setExpanded(true),
          style: {
            font: "inherit",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            color: "var(--text-tertiary)",
            background: "transparent",
            border: 0,
            padding: "2px 4px",
            borderRadius: "var(--radius-xs)",
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationColor: "var(--border-default)",
            textUnderlineOffset: 2,
            minHeight: "var(--tag-remove-target)"
          }
        },
        moreLabel ? moreLabel(hidden) : `+${hidden} more`
      ),
      expanded && limit != null && items.length > limit && /* @__PURE__ */ import_react36.default.createElement(
        "button",
        {
          type: "button",
          "data-tag-stop": "",
          tabIndex: -1,
          onClick: () => setExpanded(false),
          style: {
            font: "inherit",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            color: "var(--text-tertiary)",
            background: "transparent",
            border: 0,
            padding: "2px 4px",
            borderRadius: "var(--radius-xs)",
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationColor: "var(--border-default)",
            textUnderlineOffset: 2,
            minHeight: "var(--tag-remove-target)"
          }
        },
        "show fewer"
      )
    );
  });

  // components/data/DescriptionList.jsx
  var import_react37 = __toESM(require_react(), 1);
  var ROW_GAP = { sm: "var(--description-list-row-gap-sm)", md: "var(--description-list-row-gap-md)" };
  var TERM_SIZE = { sm: "var(--text-2xs)", md: "var(--text-xs)" };
  var VALUE_SIZE = { sm: "var(--text-xs)", md: "var(--text-sm)" };
  function DescriptionList({
    items = [],
    layout = "columns",
    size = "md",
    /* What renders for a field with no value. NOT a blank cell: a row whose
       value is empty reads as a rendering failure, and Table's content rule
       applies here too — pick one placeholder and never mix it with another
       down the same list. */
    emptyValue = "\u2014",
    divided = false,
    termWidth,
    /* Opt-in container query (§11). Never automatic: this component is frozen,
       and a default that changed underneath a shipped product is not a
       responsive improvement, it is a regression they did not ask for. */
    responsive = false,
    style,
    ...rest
  }) {
    const stacked = layout === "stacked";
    if (!items.length) {
      console.warn("[Meridian] DescriptionList: no `items`. An empty definition list renders nothing at all \u2014 if the record has no fields yet, that is an EmptyState.");
    }
    if (items.some((f) => !f || f.term == null)) {
      console.warn("[Meridian] DescriptionList: every item needs a `term`. A value with no label is a string on a page.");
    }
    const list = /* @__PURE__ */ import_react37.default.createElement(
      "dl",
      {
        ...rest,
        "data-ds-cq": responsive && !stacked ? "description-list" : void 0,
        style: {
          display: "grid",
          gridTemplateColumns: stacked ? "minmax(0,1fr)" : `${termWidth || "var(--description-list-term-width)"} minmax(0,1fr)`,
          columnGap: "var(--description-list-column-gap)",
          rowGap: ROW_GAP[size] || ROW_GAP.md,
          margin: 0,
          minWidth: 0,
          ...style
        }
      },
      items.map((f, i) => {
        if (!f) return null;
        const values = Array.isArray(f.value) ? f.value : [f.value];
        const empty = values.every((v) => v == null || v === "");
        return (
          /* The pair group: `display: contents` so the div participates in
             the dl's grid rather than becoming a cell of its own, while still
             keeping each dt bound to its own dd in the DOM. This is the one
             place the component needs both a real element and no box. */
          /* @__PURE__ */ import_react37.default.createElement(
            "div",
            {
              key: f.term ?? i,
              style: {
                display: "contents"
              }
            },
            /* @__PURE__ */ import_react37.default.createElement(
              "dt",
              {
                style: {
                  gridColumn: stacked ? "1" : void 0,
                  margin: 0,
                  fontSize: TERM_SIZE[size] || TERM_SIZE.md,
                  color: "var(--description-list-term-text)",
                  textWrap: "pretty",
                  paddingBottom: divided && !stacked ? ROW_GAP[size] || ROW_GAP.md : 0,
                  borderBottom: divided && !stacked && i < items.length - 1 ? "var(--border-width) solid var(--description-list-divider)" : "none"
                }
              },
              f.term
            ),
            empty ? /* @__PURE__ */ import_react37.default.createElement(
              "dd",
              {
                style: {
                  gridColumn: stacked ? "1" : void 0,
                  margin: 0,
                  fontSize: VALUE_SIZE[size] || VALUE_SIZE.md,
                  color: "var(--description-list-empty-text)",
                  paddingBottom: divided && !stacked ? ROW_GAP[size] || ROW_GAP.md : 0,
                  borderBottom: divided && !stacked && i < items.length - 1 ? "var(--border-width) solid var(--description-list-divider)" : "none"
                }
              },
              emptyValue
            ) : values.map((v, vi) => /* @__PURE__ */ import_react37.default.createElement(
              "dd",
              {
                key: vi,
                style: {
                  gridColumn: stacked ? "1" : void 0,
                  /* A term with several values keeps the term column empty
                     on the continuation rows rather than repeating the
                     term — the grid places these in column 2 automatically
                     only because each dd is its own grid item. */
                  gridColumnStart: !stacked && vi > 0 ? 2 : void 0,
                  margin: 0,
                  fontSize: VALUE_SIZE[size] || VALUE_SIZE.md,
                  fontFamily: f.mono ? "var(--font-mono)" : void 0,
                  fontVariantNumeric: f.mono ? "tabular-nums" : void 0,
                  color: "var(--description-list-description-text)",
                  minWidth: 0,
                  textWrap: "pretty",
                  paddingBottom: divided && !stacked && vi === values.length - 1 ? ROW_GAP[size] || ROW_GAP.md : 0,
                  borderBottom: divided && !stacked && vi === values.length - 1 && i < items.length - 1 ? "var(--border-width) solid var(--description-list-divider)" : "none"
                }
              },
              v
            ))
          )
        );
      })
    );
    return responsive && !stacked ? /* @__PURE__ */ import_react37.default.createElement("div", { "data-ds-container": true, style: { minWidth: 0 } }, list) : list;
  }

  // components/data/EmptyState.jsx
  var import_react38 = __toESM(require_react(), 1);
  var VARIANTS = {
    "first-run": { icon: "circle-plus", positive: false },
    "no-results": { icon: "search-x", positive: false },
    cleared: { icon: "circle-check", positive: true },
    restricted: { icon: "lock", positive: false }
  };
  var PAD2 = { sm: "var(--empty-state-padding-sm)", md: "var(--empty-state-padding-md)", lg: "var(--empty-state-padding-lg)" };
  var MINH = { sm: "var(--empty-state-min-height-sm)", md: "var(--empty-state-min-height-md)", lg: "var(--empty-state-min-height-lg)" };
  var ICON = { sm: "sm", md: "lg", lg: "lg" };
  var TITLE = { sm: "var(--text-sm)", md: "var(--text-md)", lg: "var(--text-lg)" };
  var BODY = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-sm)" };
  function EmptyState({
    variant = "first-run",
    /* Opt-in container query (§14): below 380px the illustration goes, because
       it is decoration and the title and action are the content. Never
       automatic — the API is frozen. */
    responsive = false,
    title,
    children,
    hint,
    icon,
    actions,
    headingLevel = 3,
    size = "md",
    align = "center",
    bordered = false,
    /* Off by default, exactly as Alert: an empty state present when the region
       first renders has already been read in document order. Only one that
       APPEARS in response to something the user did — a filter that matched
       nothing — needs announcing. */
    live = "off",
    style,
    ...rest
  }) {
    const v = VARIANTS[variant] || VARIANTS["first-run"];
    const centred = align === "center";
    if (!title) {
      console.warn("[Meridian] EmptyState: no `title`. A glyph over a body sentence gives the user nothing to scan \u2014 the title is the one part that is always read.");
    }
    if (variant === "no-results" && !actions) {
      console.warn('[Meridian] EmptyState: variant="no-results" with no `actions`. The data exists and a filter is hiding it, so the user needs a way back \u2014 a Clear filters button, at minimum. Without one this is a dead end.');
    }
    if (variant === "cleared" && actions) {
      console.warn('[Meridian] EmptyState: variant="cleared" with `actions`. An empty queue is an achievement; a call to action turns it into a task. Show the actions in the region\'s own toolbar instead.');
    }
    if (variant === "restricted" && live !== "off") {
      console.warn('[Meridian] EmptyState: variant="restricted" with `live`. A permission boundary is not an event \u2014 announcing it interrupts to say nothing changed.');
    }
    if (/^(error|failed|something went wrong|could not|couldn)/i.test(String(title || ""))) {
      console.warn('[Meridian] EmptyState: this looks like an error, not an empty state. An error has a cause and a retry \u2014 use <Alert tone="danger"> so it keeps its tone, its retry action and its assertive announcement.');
    }
    const panel = /* @__PURE__ */ import_react38.default.createElement(
      "div",
      {
        role: live === "off" ? "group" : "status",
        "aria-live": live === "off" ? void 0 : "polite",
        "data-empty-state": variant,
        "data-ds-cq": responsive ? "empty-state" : void 0,
        ...rest,
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: centred ? "center" : "flex-start",
          justifyContent: "center",
          textAlign: centred ? "center" : "left",
          gap: "var(--empty-state-gap)",
          /* min-height, never height, and never a viewport unit: the region
             this sits in decides how tall it is, and a vh floor breaks the
             moment it appears inside a Card or a Drawer. */
          minHeight: MINH[size] || MINH.md,
          padding: PAD2[size] || PAD2.md,
          background: bordered ? "var(--empty-state-background-bordered)" : "var(--empty-state-background)",
          border: bordered ? `var(--border-width) solid var(--empty-state-border)` : "none",
          borderRadius: bordered ? "var(--empty-state-radius)" : 0,
          minWidth: 0,
          ...style
        }
      },
      icon !== false && /* @__PURE__ */ import_react38.default.createElement(
        Icon,
        {
          name: icon || v.icon,
          size: ICON[size] || "lg",
          "aria-hidden": "true",
          "data-ds-cq": responsive ? "empty-state-figure" : void 0,
          style: { color: v.positive ? "var(--empty-state-icon-positive)" : "var(--empty-state-icon)", flex: "none" }
        }
      ),
      title && import_react38.default.createElement(
        `h${Math.min(Math.max(headingLevel, 1), 6)}`,
        {
          style: {
            margin: 0,
            fontSize: TITLE[size] || TITLE.md,
            fontWeight: "var(--weight-semibold)",
            letterSpacing: "var(--tracking-heading)",
            color: "var(--empty-state-title-text)",
            textWrap: "balance"
          }
        },
        title
      ),
      children && /* @__PURE__ */ import_react38.default.createElement("p", { style: { margin: 0, maxWidth: "var(--empty-state-measure)", fontSize: BODY[size] || BODY.md, lineHeight: "var(--leading-normal)", color: "var(--empty-state-body-text)", textWrap: "pretty" } }, children),
      actions && /* Wraps, so two actions become two rows in a narrow panel rather
         than shrinking to ellipses. */
      /* @__PURE__ */ import_react38.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: centred ? "center" : "flex-start", gap: "var(--empty-state-gap-actions)", marginTop: "var(--space-1)" } }, actions),
      hint && /* Below the actions on purpose: a keyboard shortcut or a doc link is
         the last thing to read, and above the buttons it pushes the one
         thing the user came for further down. */
      /* @__PURE__ */ import_react38.default.createElement("p", { style: { margin: 0, maxWidth: "var(--empty-state-measure)", fontSize: "var(--text-2xs)", color: "var(--empty-state-hint-text)", textWrap: "pretty" } }, hint)
    );
    return responsive ? /* @__PURE__ */ import_react38.default.createElement("div", { "data-ds-container": true, style: { minWidth: 0 } }, panel) : panel;
  }

  // components/data/List.jsx
  var import_react39 = __toESM(require_react(), 1);
  var PAD3 = { sm: "var(--list-row-padding-y-sm)", md: "var(--list-row-padding-y-md)", lg: "var(--list-row-padding-y-lg)" };
  var GAP = { sm: "var(--list-gap-sm)", md: "var(--list-gap-md)", lg: "var(--list-gap-lg)" };
  var LEAD = { sm: "var(--list-leading-size-sm)", md: "var(--list-leading-size-md)", lg: "var(--list-leading-size-lg)" };
  var TITLE2 = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-base)" };
  var listContext = import_react39.default.createContext({ size: "md", gutter: false, ordinals: false, divided: true, responsive: false });
  function List({
    as,
    variant = "divided",
    size = "md",
    ordered = false,
    /* Opt-in container query (§11) — same reasoning as DescriptionList: frozen
       API, so the caller asks for it. */
    responsive = false,
    label,
    children,
    style,
    ...rest
  }) {
    const divided = variant === "divided";
    const kids = import_react39.default.Children.toArray(children);
    const gutter = kids.some((k) => import_react39.default.isValidElement(k) && k.props.leading);
    const ordinals = ordered || kids.some((k) => import_react39.default.isValidElement(k) && k.props.marker != null);
    const Tag2 = as || (ordered ? "ol" : "ul");
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] List: no `label`. A list announces "list, 6 items" with no indication of what they are \u2014 name it, or point aria-labelledby at the heading above it.');
    }
    const items = kids.map((k, i) => import_react39.default.isValidElement(k) ? import_react39.default.cloneElement(k, {
      __last: i === kids.length - 1,
      ...ordered && k.props.marker == null ? { marker: i + 1 } : null
    }) : k);
    return /* @__PURE__ */ import_react39.default.createElement(
      Tag2,
      {
        ...rest,
        role: "list",
        "aria-label": label || rest["aria-label"],
        "data-ds-container": responsive ? "" : void 0,
        style: {
          display: "flex",
          flexDirection: "column",
          gap: divided ? 0 : GAP[size] || GAP.md,
          listStyle: "none",
          margin: 0,
          padding: 0,
          minWidth: 0,
          ...style
        }
      },
      /* @__PURE__ */ import_react39.default.createElement(listContext.Provider, { value: { size, gutter, ordinals, divided, responsive } }, items)
    );
  }
  function ListItem({
    leading,
    marker,
    title,
    href,
    description,
    meta,
    actions,
    __last,
    style,
    ...rest
  }) {
    const { size, gutter, ordinals, divided, responsive } = import_react39.default.useContext(listContext);
    const pad2 = PAD3[size] || PAD3.md;
    if (rest.onClick) {
      console.warn("[Meridian] ListItem: `onClick` is not supported. A row that navigates puts a Link in its `title` (pass `href`); a row with commands puts a Button or Menu in `actions`. A clickable <li> has no role, no tabindex and no key handler \u2014 the mouse-only control Card shipped in 1.15.0 and Avatar refuses outright.");
    }
    if (!title && !description) {
      console.warn("[Meridian] ListItem: no `title` and no `description` \u2014 a row of only a glyph and a timestamp says nothing that can be scanned or announced.");
    }
    return /* @__PURE__ */ import_react39.default.createElement(
      "li",
      {
        ...rest,
        onClick: void 0,
        "data-ds-cq": responsive ? "list-row" : void 0,
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--list-gutter-gap)",
          padding: divided ? `${pad2} 0` : 0,
          /* A bottom rule on every row but the last, not a top rule on every row
             but the first: a list rendered into a Card already has the Card’s
             header rule above it, and a top rule would double it. */
          borderBottom: divided && !__last ? "var(--border-width) solid var(--list-divider)" : "none",
          minWidth: 0,
          ...style
        }
      },
      ordinals && /* Its own column, and NEVER aria-hidden: the ordinal is the one thing
         this gutter can hold that is not decorative. It was hidden from the
         accessibility tree for one build — keyed off `leading`, which an
         ordered row does not have — while list-style: none had already
         suppressed the native marker, so `ordered` conveyed its number to
         nobody using a screen reader. */
      /* @__PURE__ */ import_react39.default.createElement(
        "span",
        {
          style: {
            flex: "0 0 auto",
            minWidth: "var(--list-leading-size-sm)",
            display: "grid",
            placeItems: "center end",
            height: LEAD[size] || LEAD.md,
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            fontVariantNumeric: "tabular-nums",
            color: "var(--list-marker-text)"
          }
        },
        marker
      ),
      gutter && /* @__PURE__ */ import_react39.default.createElement(
        "span",
        {
          style: {
            flex: "0 0 auto",
            display: "grid",
            placeItems: "center",
            width: LEAD[size] || LEAD.md,
            height: LEAD[size] || LEAD.md,
            /* An icon gets the sunken square; an Avatar, a Badge or a status
               dot brings its own shape and must not be boxed inside a second
               one. So the tile is drawn only for a glyph. */
            background: import_react39.default.isValidElement(leading) && leading.type === Icon ? "var(--list-leading-background)" : "transparent",
            borderRadius: "var(--list-leading-radius)",
            color: "var(--list-leading-foreground)"
          }
        },
        leading
      ),
      /* @__PURE__ */ import_react39.default.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 } }, title && /* @__PURE__ */ import_react39.default.createElement("span", { style: { fontSize: TITLE2[size] || TITLE2.md, color: "var(--list-title-text)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, href ? (
        /* The title becomes the link, and the ROW does not. One tab stop
           per row, the link's accessible name is the title, the text
           stays selectable, and the actions beside it remain reachable —
           none of which survives a block-level overlay link. */
        /* @__PURE__ */ import_react39.default.createElement("a", { href, style: { color: "inherit", textDecoration: "none" } }, title)
      ) : title), description && /* Two lines, clamped. A list row is not a paragraph — Menu's rule,
         and the reason the row keeps a predictable height in a long run. */
      /* @__PURE__ */ import_react39.default.createElement("span", { style: { fontSize: "var(--text-xs)", color: "var(--list-description-text)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textWrap: "pretty" } }, description), meta && /* @__PURE__ */ import_react39.default.createElement("span", { style: { marginTop: 2, fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--list-meta-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, meta)),
      actions && /* @__PURE__ */ import_react39.default.createElement("span", { style: { flex: "0 0 auto", display: "flex", alignItems: "center", gap: "var(--list-actions-gap)" } }, actions)
    );
  }
  List.Item = ListItem;

  // components/data/Pagination.jsx
  var import_react41 = __toESM(require_react(), 1);

  // components/forms/Select.jsx
  var import_react40 = __toESM(require_react(), 1);
  var H4 = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  var PX4 = { sm: "var(--control-px-sm)", md: "var(--control-px-md)", lg: "var(--control-px-lg)" };
  var FS2 = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-lg)" };
  var IS2 = { sm: 14, md: 14, lg: 16 };
  function Select({
    options = [],
    value,
    defaultValue,
    onChange,
    placeholder,
    size = "md",
    invalid = false,
    disabled = false,
    style,
    ...rest
  }) {
    const field = import_react40.default.useContext(FieldContext);
    const [focus, setFocus] = import_react40.default.useState(false);
    const [hover, setHover] = import_react40.default.useState(false);
    const items = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
    const seed = value ?? defaultValue ?? (placeholder ? "" : items[0]?.value ?? "");
    const [chosen, setChosen] = import_react40.default.useState(seed);
    const id = rest.id ?? field?.id;
    const describedBy = rest["aria-describedby"] ?? field?.describedBy;
    const isInvalid = invalid || !!field?.invalid;
    const controlled = typeof onChange === "function";
    const current = controlled ? value ?? "" : chosen;
    const named = id != null || rest["aria-label"] != null || rest["aria-labelledby"] != null;
    if (!named) {
      console.warn('[Meridian] Select: no accessible name. A placeholder option is not a label \u2014 it is replaced by the chosen value and stops being announced. Wrap the control in <Field label="\u2026"> (which wires the id automatically) or pass aria-label.');
    }
    if (isInvalid && !describedBy) {
      console.warn('[Meridian] Select: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing \u2014 pass the message through <Field error="\u2026">, which renders it and points the control at it.');
    }
    if (rest.multiple) {
      console.warn("[Meridian] Select: `multiple` is not supported. A native multi-select requires ctrl/cmd-click to add and shows a scrolling box with no indication of what is selected off-screen. Use CheckboxGroup, which names the set and shows every choice.");
    }
    if (items.length === 0) {
      console.warn("[Meridian] Select: `options` is empty. The control renders as an empty box that opens onto nothing. Render a disabled Select with a placeholder that says why the list is empty, or do not render it yet.");
    }
    const border = isInvalid ? "var(--input-border-invalid)" : focus ? "var(--input-border-focus)" : hover && !disabled ? "var(--input-border-hover)" : "var(--input-border)";
    const px = PX4[size] || PX4.md;
    const iconPx = IS2[size] || IS2.md;
    return /* @__PURE__ */ import_react40.default.createElement(
      "div",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: H4[size] || H4.md,
          background: disabled ? "var(--input-background-disabled)" : "var(--input-background)",
          border: `var(--border-width) solid ${border}`,
          borderRadius: "var(--input-radius)",
          boxShadow: focus ? isInvalid ? "var(--input-focus-ring-invalid)" : "var(--input-focus-ring)" : "none",
          transition: "var(--transition-control)",
          minWidth: 0,
          ...style
        }
      },
      /* @__PURE__ */ import_react40.default.createElement(
        "select",
        {
          ...controlled ? { value: current } : { defaultValue: seed },
          ...rest,
          id,
          disabled,
          "aria-describedby": describedBy,
          "aria-invalid": isInvalid || void 0,
          "aria-required": field?.required || void 0,
          onChange: (e) => {
            if (!controlled) setChosen(e.target.value);
            onChange?.(e);
          },
          onFocus: (e) => {
            setFocus(true);
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocus(false);
            rest.onBlur?.(e);
          },
          style: {
            appearance: "none",
            WebkitAppearance: "none",
            flex: 1,
            minWidth: 0,
            height: "100%",
            /* The gutter is computed, not a fixed 28px: padding-x + glyph + 6px,
               so the value text never slides under the chevron at lg. */
            padding: `0 calc(${px} + ${iconPx}px + 6px) 0 ${px}`,
            margin: 0,
            border: 0,
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-sans)",
            fontSize: FS2[size] || FS2.md,
            color: disabled ? "var(--input-text-disabled)" : current ? "var(--input-text)" : "var(--input-placeholder)",
            cursor: disabled ? "not-allowed" : "pointer",
            textOverflow: "ellipsis"
          }
        },
        placeholder && /* @__PURE__ */ import_react40.default.createElement("option", { value: "" }, placeholder),
        items.map((o) => /* @__PURE__ */ import_react40.default.createElement("option", { key: o.value, value: o.value }, o.label))
      ),
      /* @__PURE__ */ import_react40.default.createElement(
        Icon,
        {
          name: "chevron-down",
          size: iconPx,
          style: { position: "absolute", right: px, color: disabled ? "var(--input-text-disabled)" : "var(--input-icon)", pointerEvents: "none" }
        }
      )
    );
  }

  // components/data/Pagination.jsx
  var SIZES11 = {
    sm: { h: 24, min: 24, px: 6, text: "var(--text-2xs)", icon: 14, gap: 2 },
    md: { h: 28, min: 28, px: 8, text: "var(--text-xs)", icon: 16, gap: 3 }
  };
  var fmt2 = (n) => new Intl.NumberFormat().format(n);
  function Cell({ size, current, disabled, label, ariaLabel, ariaCurrent, onClick, children, wide }) {
    const [hover, setHover] = import_react41.default.useState(false);
    const [focus, setFocus] = import_react41.default.useState(false);
    const s = SIZES11[size] || SIZES11.md;
    return /* @__PURE__ */ import_react41.default.createElement(
      "button",
      {
        type: "button",
        "aria-label": ariaLabel,
        "aria-current": ariaCurrent,
        "aria-disabled": disabled || void 0,
        disabled,
        onClick,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onFocus: (e) => setFocus(e.target.matches(":focus-visible")),
        onBlur: () => setFocus(false),
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          height: s.h,
          minWidth: wide ? void 0 : s.min,
          padding: wide ? `0 ${s.px}px` : "0 4px",
          margin: 0,
          fontFamily: "var(--font-mono)",
          fontSize: s.text,
          fontVariantNumeric: "tabular-nums",
          /* Arrows and numbers share a colour deliberately. Both are
             interactive controls of equal standing, and the only colour that
             may distinguish them is the disabled one. Quietening the arrows
             would need --text-tertiary, which the text contract reserves for
             things the operator does NOT have to read in order to act — an
             arrow is acted upon. There is no --pagination-arrow-text. */
          color: disabled ? "var(--pagination-arrow-text-disabled)" : current ? "var(--pagination-page-text-current)" : hover ? "var(--pagination-page-text-hover)" : "var(--pagination-page-text)",
          background: current ? "var(--pagination-page-background-current)" : hover && !disabled ? "var(--pagination-page-background-hover)" : "transparent",
          border: 0,
          borderRadius: "var(--pagination-page-radius)",
          boxShadow: focus ? "var(--pagination-focus-ring)" : "none",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "var(--transition-control)",
          position: "relative",
          zIndex: focus ? 1 : void 0
        }
      },
      children != null ? children : label
    );
  }
  function windowPages(page, pageCount, siblingCount) {
    const total = siblingCount * 2 + 5;
    if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const left = Math.max(2, page - siblingCount);
    const right = Math.min(pageCount - 1, page + siblingCount);
    const out = [1];
    if (left > 2) out.push("gap-left");
    for (let p = left; p <= right; p += 1) out.push(p);
    if (right < pageCount - 1) out.push("gap-right");
    out.push(pageCount);
    return out;
  }
  function Pagination({
    page = 1,
    pageCount,
    totalItems,
    pageSize = 25,
    onPageChange,
    pageSizeOptions,
    onPageSizeChange,
    variant = "numbered",
    size = "md",
    siblingCount = 1,
    hasNext,
    hasPrev,
    itemLabel = "rows",
    showSummary = true,
    label = "Pagination",
    style,
    ...rest
  }) {
    const s = SIZES11[size] || SIZES11.md;
    const count = pageCount != null ? pageCount : totalItems != null ? Math.max(1, Math.ceil(totalItems / pageSize)) : null;
    const cursor = variant === "cursor";
    import_react41.default.useEffect(() => {
      if (!cursor && count == null) {
        console.warn('[Meridian] Pagination: needs pageCount or totalItems + pageSize. Without a total, use variant="cursor" with hasNext/hasPrev rather than a page count you do not have.');
      }
    }, [cursor, count]);
    const prevOn = cursor ? !!hasPrev : page > 1;
    const nextOn = cursor ? !!hasNext : count != null && page < count;
    const go = (p) => {
      if (onPageChange) onPageChange(p);
    };
    const from = totalItems != null ? Math.min((page - 1) * pageSize + 1, totalItems) : (page - 1) * pageSize + 1;
    const to = totalItems != null ? Math.min(page * pageSize, totalItems) : page * pageSize;
    const summary = cursor ? `${fmt2(from)}\u2013${fmt2(to)}` : totalItems != null ? `${fmt2(from)}\u2013${fmt2(to)} of ${fmt2(totalItems)} ${itemLabel}` : `Page ${fmt2(page)} of ${fmt2(count || 1)}`;
    return /* @__PURE__ */ import_react41.default.createElement(
      "nav",
      {
        "aria-label": label,
        "data-pagination": variant,
        ...rest,
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          minWidth: 0,
          ...style
        }
      },
      showSummary ? /* @__PURE__ */ import_react41.default.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: s.text, color: "var(--pagination-summary-text)", fontVariantNumeric: "tabular-nums" } }, summary) : /* @__PURE__ */ import_react41.default.createElement("span", null),
      /* @__PURE__ */ import_react41.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3)", minWidth: 0 } }, pageSizeOptions && pageSizeOptions.length > 0 && /* @__PURE__ */ import_react41.default.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ import_react41.default.createElement("span", { style: { fontFamily: "var(--font-sans)", fontSize: s.text, color: "var(--pagination-summary-text)" } }, "Per page"), /* @__PURE__ */ import_react41.default.createElement(
        Select,
        {
          "aria-label": `${itemLabel} per page`,
          size: "sm",
          options: pageSizeOptions.map((n) => String(n)),
          value: String(pageSize),
          onChange: (e) => onPageSizeChange && onPageSizeChange(Number(e.target.value)),
          style: { width: 72 }
        }
      )), /* @__PURE__ */ import_react41.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: s.gap } }, /* @__PURE__ */ import_react41.default.createElement(Cell, { size, disabled: !prevOn, ariaLabel: "Previous page", onClick: () => go(page - 1) }, /* @__PURE__ */ import_react41.default.createElement(Icon, { name: "chevron-left", size: s.icon })), variant === "numbered" && count != null && windowPages(page, count, siblingCount).map(
        (p) => typeof p === "number" ? /* @__PURE__ */ import_react41.default.createElement(
          Cell,
          {
            key: p,
            size,
            current: p === page,
            ariaLabel: `Page ${p}`,
            ariaCurrent: p === page ? "page" : void 0,
            onClick: () => go(p),
            label: fmt2(p)
          }
        ) : (
          /* A gap marker, not a control: the pages it stands for are
             reachable by paging or by the arrows, and a menu of forty
             page numbers helps nobody. */
          /* @__PURE__ */ import_react41.default.createElement("span", { key: p, "aria-hidden": "true", style: { minWidth: s.min, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: s.text, color: "var(--pagination-ellipsis-text)" } }, "\u2026")
        )
      ), variant === "compact" && count != null && /* @__PURE__ */ import_react41.default.createElement("span", { style: { padding: `0 ${s.px}px`, fontFamily: "var(--font-mono)", fontSize: s.text, color: "var(--pagination-page-text)", fontVariantNumeric: "tabular-nums" } }, fmt2(page), " / ", fmt2(count)), /* @__PURE__ */ import_react41.default.createElement(Cell, { size, disabled: !nextOn, ariaLabel: "Next page", onClick: () => go(page + 1) }, /* @__PURE__ */ import_react41.default.createElement(Icon, { name: "chevron-right", size: s.icon }))))
    );
  }

  // components/data/Skeleton.jsx
  var import_react42 = __toESM(require_react(), 1);
  function useDelayed(delay) {
    const [shown, setShown] = import_react42.default.useState(!delay);
    import_react42.default.useEffect(() => {
      if (!delay) {
        setShown(true);
        return void 0;
      }
      setShown(false);
      const t = setTimeout(() => setShown(true), delay);
      return () => clearTimeout(t);
    }, [delay]);
    return shown;
  }
  function Skeleton({
    /* Hold the placeholder back for this many ms. */
    delay = 0,
    width = "100%",
    height,
    lines = 1,
    radius,
    animate = true,
    style,
    ...rest
  }) {
    const ready = useDelayed(delay);
    if (lines < 1) {
      console.warn("[Meridian] Skeleton: lines < 1 renders nothing to stand in for the content. Render the component only while the region is loading, rather than asking it for zero lines.");
    }
    const one = (w, key, outer) => /* @__PURE__ */ import_react42.default.createElement(
      "span",
      {
        key,
        "aria-hidden": "true",
        "data-skeleton": "",
        ...outer ? rest : null,
        style: {
          display: "block",
          width: w,
          /* Defaults to the line-box of the text it stands in for, so a
             skeleton in a table cell lines up with the real value. */
          height: height || "1em",
          minHeight: height ? void 0 : "var(--skeleton-min-height)",
          background: "var(--skeleton-background)",
          borderRadius: radius || "var(--skeleton-radius)",
          backgroundImage: animate ? "linear-gradient(90deg, transparent 0%, var(--skeleton-sheen) 50%, transparent 100%)" : void 0,
          backgroundSize: "200% 100%",
          backgroundRepeat: "no-repeat",
          animation: animate ? "var(--anim-skeleton-sweep)" : void 0,
          ...outer ? style : null
        }
      }
    );
    if (!ready) return null;
    if (lines <= 1) return one(width, 0, true);
    return /* @__PURE__ */ import_react42.default.createElement("span", { "aria-hidden": "true", ...rest, style: { display: "flex", flexDirection: "column", gap: "var(--skeleton-line-gap)", ...style } }, Array.from({ length: lines }, (_, i) => one(i === lines - 1 ? "62%" : width, i, false)));
  }

  // components/data/Table.jsx
  var import_react44 = __toESM(require_react(), 1);

  // components/forms/Checkbox.jsx
  var import_react43 = __toESM(require_react(), 1);
  function Checkbox({
    label,
    description,
    checked = false,
    indeterminate = false,
    disabled = false,
    onChange,
    style,
    ...rest
  }) {
    const ref = import_react43.default.useRef(null);
    const autoId = import_react43.default.useId();
    const descId = description ? `${autoId}-desc` : void 0;
    const [focus, setFocus] = import_react43.default.useState(false);
    const [hover, setHover] = import_react43.default.useState(false);
    const on = checked || indeterminate;
    import_react43.default.useEffect(() => {
      if (ref.current) ref.current.indeterminate = indeterminate;
    }, [indeterminate]);
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] Checkbox: no accessible name. A bare box in a table row or a header announces as "checkbox, not checked" with nothing to say what it selects \u2014 pass `label`, or aria-label ("Select all rows", "Select work order WO-4471").');
    }
    const boxBorder = disabled ? "var(--checkbox-border-disabled)" : on ? hover ? "var(--checkbox-border-checked-hover)" : "var(--checkbox-border-checked)" : hover ? "var(--checkbox-border-hover)" : "var(--checkbox-border)";
    return /* @__PURE__ */ import_react43.default.createElement("span", { style: { display: "inline-flex", flexDirection: "column", gap: 2, minWidth: 0, ...style } }, /* @__PURE__ */ import_react43.default.createElement(
      "label",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: label ? "flex-start" : "center",
          gap: "var(--space-2)",
          /* The box is 16px; the TARGET is a control-height row, so a bare
             selector still clears the 24px minimum (2.5.8) and grows with
             density instead of staying 16px on a floor tablet. */
          minHeight: "var(--control-h-sm)",
          minWidth: label ? 0 : "var(--control-h-sm)",
          cursor: disabled ? "not-allowed" : "pointer"
        }
      },
      /* @__PURE__ */ import_react43.default.createElement(
        "input",
        {
          type: "checkbox",
          ...rest,
          ...onChange ? { checked } : { defaultChecked: checked, readOnly: true },
          ref,
          disabled,
          "aria-describedby": rest["aria-describedby"] ?? descId,
          onChange,
          onFocus: (e) => {
            setFocus(e.target.matches(":focus-visible"));
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocus(false);
            rest.onBlur?.(e);
          },
          style: { position: "absolute", opacity: 0, width: 0, height: 0 }
        }
      ),
      /* @__PURE__ */ import_react43.default.createElement("span", { style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        width: 16,
        height: 16,
        color: disabled ? "var(--text-disabled)" : "var(--checkbox-mark)",
        background: disabled ? "var(--checkbox-background-disabled)" : on ? hover ? "var(--checkbox-background-checked-hover)" : "var(--checkbox-background-checked)" : hover ? "var(--checkbox-background-hover)" : "var(--checkbox-background)",
        border: `var(--border-width) solid ${boxBorder}`,
        borderRadius: "var(--checkbox-radius)",
        boxShadow: focus ? "var(--input-focus-ring)" : "none",
        transition: "var(--transition-control)"
      } }, indeterminate ? /* @__PURE__ */ import_react43.default.createElement(Icon, { name: "minus", size: "mark" }) : checked ? /* @__PURE__ */ import_react43.default.createElement(Icon, { name: "check", size: "mark" }) : null),
      label && /* @__PURE__ */ import_react43.default.createElement("span", { style: { minWidth: 0, fontSize: "var(--text-sm)", color: disabled ? "var(--text-disabled)" : "var(--text-primary)", lineHeight: "var(--leading-snug)" } }, label)
    ), description && /* @__PURE__ */ import_react43.default.createElement("span", { id: descId, style: { marginLeft: 24, fontSize: "var(--text-xs)", color: disabled ? "var(--text-disabled)" : "var(--text-tertiary)" } }, description));
  }

  // components/data/Table.jsx
  var SELECT_W = 36;
  var keyOf = (row, rowKey, i) => {
    if (typeof rowKey === "function") return rowKey(row, i);
    const v = row?.[rowKey];
    return v == null ? i : v;
  };
  function Row({ columns, row, rk, index, selectable, selected, rowLabel, freeze, onSelectRow, onRowClick }) {
    const clickable = !!onRowClick;
    return /* @__PURE__ */ import_react44.default.createElement(
      "tr",
      {
        "data-table-row": selected ? "selected" : "default",
        tabIndex: clickable ? 0 : void 0,
        onClick: clickable ? () => onRowClick(row, index) : void 0,
        onKeyDown: clickable ? (e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRowClick(row, index);
          }
        } : void 0,
        style: {
          /* Background is NOT set here: hover, selection and focus all need
             real selectors, and an inline background would outrank every one
             of them. base.css owns them via [data-table-row] — the same
             stylesheet-hook pattern Badge uses for forced colours. */
          cursor: clickable ? "pointer" : "default"
        }
      },
      selectable && /* @__PURE__ */ import_react44.default.createElement("td", { "data-table-frozen": freeze ? "" : void 0, style: { width: SELECT_W, padding: "0 0 0 var(--table-cell-padding-x)", borderBottom: "var(--border-width) solid var(--table-row-border)", ...freeze ? { position: "sticky", left: 0, zIndex: 1 } : null } }, /* @__PURE__ */ import_react44.default.createElement(Checkbox, { "aria-label": `Select ${rowLabel || `row ${index + 1}`}`, checked: selected, onChange: (e) => onSelectRow(rk, e.target.checked), onClick: (e) => e.stopPropagation() })),
      columns.map((c, ci) => {
        const content = c.render ? c.render(row, index) : row[c.key];
        const frozen = freeze && ci === 0;
        return /* @__PURE__ */ import_react44.default.createElement(
          "td",
          {
            key: c.key,
            "data-table-frozen": frozen ? "" : void 0,
            title: !c.wrap && !c.render && typeof content === "string" ? content : void 0,
            style: {
              padding: c.wrap ? "var(--table-cell-padding-y) var(--table-cell-padding-x)" : "0 var(--table-cell-padding-x)",
              height: c.wrap ? void 0 : "var(--table-row-height)",
              borderBottom: "var(--border-width) solid var(--table-row-border)",
              fontSize: "var(--text-sm)",
              fontFamily: c.mono ? "var(--font-mono)" : "var(--font-sans)",
              fontVariantNumeric: c.align === "right" ? "tabular-nums" : void 0,
              color: "var(--table-cell-text)",
              textAlign: c.align || "left",
              verticalAlign: c.wrap ? "top" : "middle",
              width: c.width,
              whiteSpace: c.wrap ? "normal" : "nowrap",
              overflow: c.wrap ? void 0 : "hidden",
              textOverflow: c.wrap ? void 0 : "ellipsis",
              textWrap: c.wrap ? "pretty" : void 0,
              ...frozen ? { position: "sticky", left: selectable ? SELECT_W : 0, zIndex: 1 } : null
            }
          },
          content
        );
      })
    );
  }
  function Table({
    columns = [],
    rows = [],
    rowKey = "id",
    caption,
    selectable = false,
    selectedKeys = [],
    onSelectionChange,
    rowLabel,
    sort,
    onSortChange,
    onRowClick,
    loading = false,
    loadingRows = 5,
    stickyHeader = false,
    freezeLeading = false,
    minWidth,
    emptyMessage = "No results",
    /* Destructured purely to strip it from `rest`: left in, React spreads the
       old prop onto the wrapper div and the consumer gets an unknown-prop
       error on top of the migration warning below. */
    selectedRows,
    style,
    ...rest
  }) {
    const scrollRef = import_react44.default.useRef(null);
    const [scrollable, setScrollable] = import_react44.default.useState(false);
    if (!caption && !rest["aria-label"] && !rest["aria-labelledby"]) {
      console.warn('[Meridian] Table: no caption and no aria-label. A table is the one component whose accessible name cannot be inferred from its content \u2014 a screen-reader user landing in it hears only "table" and a column count.');
    }
    if (freezeLeading && !minWidth) {
      console.warn("[Meridian] Table: freezeLeading with no minWidth does nothing. A table at width:100% with truncating cells never overflows, so there is no horizontal scroll for a frozen column to hold still against \u2014 set minWidth (Table \xA711).");
    }
    if (selectedRows) {
      console.warn("[Meridian] Table: `selectedRows` (array indices) was replaced by `selectedKeys` in 1.14.0. Index-based selection silently reassigns itself when the table is sorted or paged \u2014 select a row, sort, and you are holding a different record. Pass row identities and set `rowKey`.");
    }
    import_react44.default.useEffect(() => {
      const el = scrollRef.current;
      if (!el || typeof ResizeObserver === "undefined") return void 0;
      const check = () => setScrollable(el.scrollWidth > el.clientWidth + 1);
      check();
      const ro = new ResizeObserver(check);
      ro.observe(el);
      return () => ro.disconnect();
    }, [columns, rows]);
    const keys = import_react44.default.useMemo(() => rows.map((r, i) => keyOf(r, rowKey, i)), [rows, rowKey]);
    const allOn = rows.length > 0 && keys.every((k) => selectedKeys.includes(k));
    const someOn = selectedKeys.length > 0 && !allOn;
    const colCount = columns.length + (selectable ? 1 : 0);
    const set = (k, on) => {
      if (!onSelectionChange) return;
      onSelectionChange(on ? [...selectedKeys, k] : selectedKeys.filter((x) => x !== k));
    };
    const headerCell = (c, ci) => {
      const active = sort && sort.key === c.key;
      const dir = active ? sort.direction : null;
      const canSort = c.sortable && onSortChange;
      const frozen = freezeLeading && ci === 0;
      return /* @__PURE__ */ import_react44.default.createElement(
        "th",
        {
          key: c.key,
          scope: "col",
          "data-table-frozen": frozen ? "" : void 0,
          "aria-sort": active ? dir === "asc" ? "ascending" : "descending" : void 0,
          style: {
            height: "var(--table-header-height)",
            padding: 0,
            borderBottom: "var(--border-width) solid var(--table-header-border)",
            textAlign: c.align || "left",
            width: c.width,
            whiteSpace: "nowrap",
            background: stickyHeader ? "var(--table-header-background-sticky)" : void 0,
            /* A frozen header cell is sticky on BOTH axes, and must outrank
               the header row and the frozen body cells it crosses. */
            ...frozen ? { position: "sticky", left: selectable ? SELECT_W : 0, zIndex: stickyHeader ? 3 : 1 } : null
          }
        },
        import_react44.default.createElement(
          canSort ? "button" : "span",
          {
            type: canSort ? "button" : void 0,
            onClick: canSort ? () => onSortChange({ key: c.key, direction: active && dir === "asc" ? "desc" : "asc" }) : void 0,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 4,
              justifyContent: c.align === "right" ? "flex-end" : c.align === "center" ? "center" : "flex-start",
              width: "100%",
              height: "var(--table-header-height)",
              padding: "0 var(--table-cell-padding-x)",
              margin: 0,
              border: "none",
              background: "none",
              font: "inherit",
              fontSize: "var(--text-2xs)",
              fontWeight: "var(--weight-semibold)",
              letterSpacing: "var(--tracking-caps)",
              textTransform: "uppercase",
              textAlign: "inherit",
              color: active ? "var(--table-header-text-active)" : "var(--table-header-text)",
              cursor: canSort ? "pointer" : "default",
              userSelect: "none"
            }
          },
          c.header,
          c.sortable ? /* @__PURE__ */ import_react44.default.createElement(Icon, { key: "i", name: active ? dir === "asc" ? "arrow-up" : "arrow-down" : "chevrons-up-down", size: "mark", style: { opacity: active ? 1 : 0.5, flex: "none" }, "aria-hidden": "true" }) : null
        )
      );
    };
    return /* @__PURE__ */ import_react44.default.createElement(
      "div",
      {
        ref: scrollRef,
        tabIndex: scrollable ? 0 : void 0,
        role: scrollable ? "region" : void 0,
        "aria-label": scrollable ? typeof caption === "string" ? `${caption} (scrollable)` : "Table, scrollable" : void 0,
        "aria-busy": loading || void 0,
        style: { width: "100%", overflowX: "auto", ...style },
        ...rest
      },
      /* @__PURE__ */ import_react44.default.createElement("table", { style: { width: "100%", minWidth, borderCollapse: "collapse", tableLayout: "auto" } }, caption && /* Visually hidden by default: the table's name is usually already
         a visible heading above it, and printing it twice is noise —
         but the table itself must still carry one. */
      /* @__PURE__ */ import_react44.default.createElement("caption", { style: { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" } }, caption), /* @__PURE__ */ import_react44.default.createElement("thead", { style: stickyHeader ? { position: "sticky", top: 0, zIndex: 2, boxShadow: "var(--table-header-shadow-sticky)" } : void 0 }, /* @__PURE__ */ import_react44.default.createElement("tr", { style: { background: "var(--table-header-background)" } }, selectable && /* @__PURE__ */ import_react44.default.createElement("th", { scope: "col", "data-table-frozen": freezeLeading ? "" : void 0, style: { width: SELECT_W, padding: "0 0 0 var(--table-cell-padding-x)", height: "var(--table-header-height)", borderBottom: "var(--border-width) solid var(--table-header-border)", background: stickyHeader ? "var(--table-header-background-sticky)" : void 0, ...freezeLeading ? { position: "sticky", left: 0, zIndex: stickyHeader ? 3 : 1 } : null } }, /* @__PURE__ */ import_react44.default.createElement(
        Checkbox,
        {
          "aria-label": allOn ? "Deselect all rows" : "Select all rows",
          checked: allOn,
          indeterminate: someOn,
          onChange: () => onSelectionChange && onSelectionChange(allOn ? [] : keys)
        }
      )), columns.map(headerCell))), /* @__PURE__ */ import_react44.default.createElement("tbody", null, loading ? (
        /* Rows keep their real geometry while loading, so the table does
           not resize when the data lands. One announcement comes from
           aria-busy on the region; the placeholders are aria-hidden. */
        Array.from({ length: loadingRows }, (_, i) => /* @__PURE__ */ import_react44.default.createElement("tr", { key: `sk-${i}` }, selectable && /* @__PURE__ */ import_react44.default.createElement("td", { "data-table-frozen": freezeLeading ? "" : void 0, style: { width: SELECT_W, padding: "0 0 0 var(--table-cell-padding-x)", height: "var(--table-row-height)", borderBottom: "var(--border-width) solid var(--table-row-border)", ...freezeLeading ? { position: "sticky", left: 0, zIndex: 1 } : null } }, /* @__PURE__ */ import_react44.default.createElement(Skeleton, { width: "16px", height: "16px" })), columns.map((c, ci) => /* @__PURE__ */ import_react44.default.createElement("td", { key: c.key, "data-table-frozen": freezeLeading && ci === 0 ? "" : void 0, style: { padding: "0 var(--table-cell-padding-x)", height: "var(--table-row-height)", borderBottom: "var(--border-width) solid var(--table-row-border)", ...freezeLeading && ci === 0 ? { position: "sticky", left: selectable ? SELECT_W : 0, zIndex: 1 } : null } }, /* @__PURE__ */ import_react44.default.createElement(Skeleton, { width: c.align === "right" ? "48px" : "70%", style: c.align === "right" ? { marginLeft: "auto" } : void 0 })))))
      ) : rows.length === 0 ? /* @__PURE__ */ import_react44.default.createElement("tr", null, /* @__PURE__ */ import_react44.default.createElement("td", { colSpan: colCount, style: { height: 96, textAlign: "center", fontSize: "var(--text-sm)", color: "var(--table-empty-text)" } }, emptyMessage)) : rows.map((row, i) => {
        const rk = keys[i];
        return /* @__PURE__ */ import_react44.default.createElement(
          Row,
          {
            key: rk,
            columns,
            row,
            rk,
            index: i,
            selectable,
            selected: selectedKeys.includes(rk),
            rowLabel: rowLabel ? rowLabel(row, i) : void 0,
            freeze: freezeLeading,
            onSelectRow: set,
            onRowClick
          }
        );
      })))
    );
  }

  // components/feedback/Alert.jsx
  var import_react45 = __toESM(require_react(), 1);
  var TONES3 = {
    info: { icon: "info", bg: "var(--alert-info-background)", border: "var(--alert-info-border)", ic: "var(--alert-info-icon)", title: "var(--alert-info-title)" },
    success: { icon: "circle-check", bg: "var(--alert-success-background)", border: "var(--alert-success-border)", ic: "var(--alert-success-icon)", title: "var(--alert-success-title)" },
    warning: { icon: "triangle-alert", bg: "var(--alert-warning-background)", border: "var(--alert-warning-border)", ic: "var(--alert-warning-icon)", title: "var(--alert-warning-title)" },
    danger: { icon: "circle-alert", bg: "var(--alert-critical-background)", border: "var(--alert-critical-border)", ic: "var(--alert-critical-icon)", title: "var(--alert-critical-title)" },
    neutral: { icon: "info", bg: "var(--alert-neutral-background)", border: "var(--alert-neutral-border)", ic: "var(--alert-neutral-icon)", title: "var(--alert-neutral-title)" }
  };
  function Alert({
    tone = "info",
    title,
    children,
    icon,
    action,
    onDismiss,
    size = "md",
    variant = "inline",
    live = "off",
    style,
    ...rest
  }) {
    const t = TONES3[tone] || TONES3.info;
    const banner = variant === "banner";
    const sm = size === "sm";
    if (!title && !children) {
      console.warn("[Meridian] Alert: needs a title, body content, or both. A tinted block with no words carries its meaning in colour alone, which fails WCAG 1.4.1.");
    }
    if (onDismiss && tone === "danger") {
      console.warn("[Meridian] Alert: a dismissible danger alert lets the user hide a condition that is still true. Remove onDismiss, or resolve the condition instead of silencing it.");
    }
    return /* @__PURE__ */ import_react45.default.createElement(
      "div",
      {
        role: live === "off" ? "group" : tone === "danger" ? "alert" : "status",
        "aria-live": live === "off" ? void 0 : tone === "danger" ? "assertive" : "polite",
        "data-alert": tone,
        "data-alert-variant": variant,
        ...rest,
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--alert-gap)",
          padding: sm ? "var(--alert-padding-sm)" : "var(--alert-padding-md)",
          background: t.bg,
          /* A banner spans the app frame edge to edge, so it keeps only the
             bottom rule and loses its radius: a rounded card wedged against
             two window edges reads as a mistake. The longhands are spread in
             only on that branch — an `undefined` longhand still assigns '' in
             React and would clear the shorthand above it. */
          ...banner ? { border: "none", borderBottom: `var(--border-width) solid ${t.border}`, borderLeft: `var(--alert-accent-width) solid ${t.ic}`, borderRadius: 0 } : { border: `var(--border-width) solid ${t.border}`, borderRadius: "var(--alert-radius)" },
          ...style
        }
      },
      icon !== false && /* @__PURE__ */ import_react45.default.createElement(Icon, { name: icon || t.icon, size: sm ? 14 : 16, style: { color: t.ic, marginTop: sm ? 1 : 2, flex: "none" }, "aria-hidden": "true" }),
      /* @__PURE__ */ import_react45.default.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: children && title ? "var(--space-1)" : 0 } }, title && /* @__PURE__ */ import_react45.default.createElement("div", { style: { fontSize: sm ? "var(--text-xs)" : "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: t.title, lineHeight: "var(--leading-snug)" } }, title), children && /* Body copy is neutral, not the tone's text colour: a paragraph in
         red-700 is a headline pretending to be prose. */
      /* @__PURE__ */ import_react45.default.createElement("div", { style: { fontSize: sm ? "var(--text-xs)" : "var(--text-sm)", color: title ? "var(--alert-body-text)" : "var(--alert-title-text)", lineHeight: "var(--leading-normal)", textWrap: "pretty" } }, children), action && /* @__PURE__ */ import_react45.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-2)" } }, action)),
      onDismiss && /* @__PURE__ */ import_react45.default.createElement(IconButton, { icon: "x", label: "Dismiss", size: "sm", variant: "ghost", onClick: onDismiss, style: { color: "var(--alert-dismiss-icon)", flex: "none" } })
    );
  }

  // components/feedback/Dialog.jsx
  var import_react46 = __toESM(require_react(), 1);
  var WIDTHS = { sm: "var(--dialog-width-sm)", md: "var(--dialog-width-md)", lg: "var(--dialog-width-lg)" };
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function Dialog({
    open = true,
    title,
    description,
    tone = "default",
    width = "md",
    footer,
    onClose,
    dismissible = true,
    initialFocus,
    children,
    style,
    ...rest
  }) {
    const panelRef = import_react46.default.useRef(null);
    const scrimRef = import_react46.default.useRef(null);
    const restoreRef = import_react46.default.useRef(null);
    const uid = import_react46.default.useId();
    const titleId = `${uid}-title`;
    const descId = `${uid}-desc`;
    if (open && !title) {
      console.warn("[Meridian] Dialog: a modal must have a title. It is the accessible name of the dialog and the only thing that tells a screen-reader user what has taken their focus.");
    }
    import_react46.default.useEffect(() => {
      if (!open) return void 0;
      const onKey = (e) => {
        if (e.key === "Escape" && dismissible && onClose) {
          e.stopPropagation();
          onClose();
          return;
        }
        if (e.key !== "Tab") return;
        const nodes = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) || []).filter((n) => n.offsetParent !== null);
        if (!nodes.length) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (!panelRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      };
      window.addEventListener("keydown", onKey, true);
      return () => window.removeEventListener("keydown", onKey, true);
    }, [open, onClose, dismissible]);
    import_react46.default.useEffect(() => {
      if (!open) return void 0;
      restoreRef.current = document.activeElement;
      const target = initialFocus?.current || panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
      const h = requestAnimationFrame(() => target?.focus?.({ preventScroll: true }));
      return () => {
        cancelAnimationFrame(h);
        const prev = restoreRef.current;
        if (prev && document.contains(prev)) prev.focus?.({ preventScroll: true });
      };
    }, [open, initialFocus]);
    import_react46.default.useEffect(() => {
      if (!open) return void 0;
      const r = scrimRef.current?.getBoundingClientRect();
      const covers = r && r.width >= window.innerWidth - 2 && r.height >= window.innerHeight - 2;
      if (!covers) return void 0;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);
    if (!open) return null;
    return /* @__PURE__ */ import_react46.default.createElement(
      "div",
      {
        ref: scrimRef,
        "data-dialog-scrim": "",
        onMouseDown: (e) => {
          if (dismissible && onClose && e.target === e.currentTarget) onClose();
        },
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "var(--dialog-inset-block) var(--dialog-inset-inline)",
          background: "var(--dialog-scrim)",
          backdropFilter: "var(--overlay-blur)",
          zIndex: "var(--z-dialog)",
          animation: "var(--anim-fade-in)"
        }
      },
      /* @__PURE__ */ import_react46.default.createElement(
        "div",
        {
          ref: panelRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          "aria-describedby": description ? descId : void 0,
          "data-dialog": tone,
          ...rest,
          style: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: WIDTHS[width] || WIDTHS.md,
            /* The panel never exceeds the viewport: the body scrolls, the
               header and footer stay. A dialog whose actions have scrolled
               off the bottom of the screen is a trap with no way out. */
            maxHeight: "100%",
            background: "var(--dialog-background)",
            border: "var(--border-width) solid var(--dialog-border)",
            borderRadius: "var(--dialog-radius)",
            boxShadow: "var(--dialog-shadow)",
            /* --anim-rise-in, not a scale: the system has no scale keyframe
               and does not need one. 8px up reads as arrival without the
               zoom that makes a modal feel like it pounced. */
            animation: "var(--anim-rise-in)",
            ...style
          }
        },
        /* @__PURE__ */ import_react46.default.createElement("header", { style: { display: "flex", alignItems: "flex-start", gap: "var(--space-4)", padding: "var(--space-5) var(--dialog-padding-inline) var(--space-4)", flex: "none" } }, /* @__PURE__ */ import_react46.default.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react46.default.createElement("h2", { id: titleId, style: { margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-heading)", color: tone === "danger" ? "var(--dialog-title-text-critical)" : "var(--dialog-title-text)" } }, title), description && /* @__PURE__ */ import_react46.default.createElement("p", { id: descId, style: { margin: "6px 0 0", fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)", color: "var(--dialog-description-text)" } }, description)), dismissible && onClose && /* @__PURE__ */ import_react46.default.createElement(IconButton, { icon: "x", label: "Close", size: "sm", variant: "ghost", onClick: onClose, style: { flex: "none" } })),
        children != null && /* @__PURE__ */ import_react46.default.createElement("div", { style: { padding: `0 var(--dialog-padding-inline) var(--space-5)`, overflowY: "auto", flex: "1 1 auto", minHeight: 0 } }, children),
        footer && /* @__PURE__ */ import_react46.default.createElement("footer", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", gap: "var(--space-2)", padding: "var(--space-4) var(--dialog-padding-inline)", borderTop: "var(--border-width) solid var(--dialog-footer-border)", background: "var(--dialog-footer-background)", borderRadius: "0 0 var(--dialog-radius) var(--dialog-radius)", flex: "none" } }, footer)
      )
    );
  }

  // components/feedback/Drawer.jsx
  var import_react47 = __toESM(require_react(), 1);
  var FOCUSABLE2 = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var SIDES = {
    right: {
      place: { top: 0, bottom: 0, right: 0 },
      radius: "var(--drawer-radius) 0 0 var(--drawer-radius)",
      edge: "borderLeft",
      anim: "var(--anim-slide-in-right)"
    },
    left: {
      place: { top: 0, bottom: 0, left: 0 },
      radius: "0 var(--drawer-radius) var(--drawer-radius) 0",
      edge: "borderRight",
      anim: "var(--anim-slide-in-left)"
    },
    bottom: {
      place: { left: 0, right: 0, bottom: 0 },
      radius: "var(--drawer-radius) var(--drawer-radius) 0 0",
      edge: "borderTop",
      anim: "var(--anim-slide-in-up)"
    }
  };
  function Drawer({
    open = true,
    title,
    description,
    side = "right",
    size = "md",
    modal = true,
    footer,
    onClose,
    dismissible = true,
    initialFocus,
    children,
    style,
    ...rest
  }) {
    const panelRef = import_react47.default.useRef(null);
    const scrimRef = import_react47.default.useRef(null);
    const restoreRef = import_react47.default.useRef(null);
    const uid = import_react47.default.useId();
    const titleId = `${uid}-title`;
    const descId = `${uid}-desc`;
    const S = SIDES[side] || SIDES.right;
    if (open && !title) {
      console.warn('[Meridian] Drawer: no `title`. It is the panel\u2019s accessible name and the only thing that says what has opened beside \u2014 or in front of \u2014 the page. Pass one; a drawer whose subject is only in its body announces as "dialog".');
    }
    if (open && !onClose) {
      console.warn("[Meridian] Drawer: no `onClose`. Escape, the scrim and the close button all route through it, so without one the panel cannot be dismissed by any means \u2014 the definition of a trap.");
    }
    import_react47.default.useEffect(() => {
      if (!open) return void 0;
      const onKey = (e) => {
        if (e.key === "Escape" && dismissible && onClose) {
          e.stopPropagation();
          onClose();
          return;
        }
        if (!modal || e.key !== "Tab") return;
        const nodes = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE2) || []).filter((n) => n.offsetParent !== null);
        if (!nodes.length) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (!panelRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      };
      window.addEventListener("keydown", onKey, true);
      return () => window.removeEventListener("keydown", onKey, true);
    }, [open, onClose, dismissible, modal]);
    import_react47.default.useEffect(() => {
      if (!open) return void 0;
      restoreRef.current = document.activeElement;
      const target = initialFocus?.current || panelRef.current?.querySelector(FOCUSABLE2) || panelRef.current;
      const h = requestAnimationFrame(() => target?.focus?.({ preventScroll: true }));
      return () => {
        cancelAnimationFrame(h);
        const prev = restoreRef.current;
        if (prev && document.contains(prev)) prev.focus?.({ preventScroll: true });
      };
    }, [open, initialFocus]);
    import_react47.default.useEffect(() => {
      if (!open || !modal) return void 0;
      const r = scrimRef.current?.getBoundingClientRect();
      const covers = r && r.width >= window.innerWidth - 2 && r.height >= window.innerHeight - 2;
      if (!covers) return void 0;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open, modal]);
    if (!open) return null;
    const isSheet = side === "bottom";
    const panel = /* @__PURE__ */ import_react47.default.createElement(
      "div",
      {
        ref: panelRef,
        role: "dialog",
        "aria-modal": modal ? "true" : void 0,
        "aria-labelledby": titleId,
        "aria-describedby": description ? descId : void 0,
        "data-drawer": side,
        ...rest,
        style: {
          position: "absolute",
          ...S.place,
          display: "flex",
          flexDirection: "column",
          width: isSheet ? "100%" : `var(--drawer-width-${size})`,
          maxWidth: "100%",
          height: isSheet ? `var(--drawer-height-${size})` : void 0,
          /* A sheet never covers the page: at that point it is a page, and it
             should be one. The side panel is always full-height. */
          maxHeight: isSheet ? "85%" : "100%",
          background: "var(--drawer-background)",
          [S.edge]: "var(--border-width) solid var(--drawer-border)",
          /* Only the leading corners. The other edges are flush with the
             surface, and a radius there shows the page through a 8px notch. */
          borderRadius: S.radius,
          boxShadow: "var(--drawer-shadow)",
          zIndex: "var(--z-drawer)",
          animation: S.anim,
          ...style
        }
      },
      /* @__PURE__ */ import_react47.default.createElement("header", { style: { display: "flex", alignItems: "flex-start", gap: "var(--space-3)", padding: "var(--space-5) var(--drawer-padding-inline) var(--space-4)", flex: "none" } }, /* @__PURE__ */ import_react47.default.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react47.default.createElement("h2", { id: titleId, style: { margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-heading)", color: "var(--drawer-title-text)" } }, title), description && /* @__PURE__ */ import_react47.default.createElement("p", { id: descId, style: { margin: "4px 0 0", fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)", color: "var(--drawer-description-text)" } }, description)), dismissible && onClose && /* @__PURE__ */ import_react47.default.createElement(IconButton, { icon: "x", label: "Close panel", size: "sm", variant: "ghost", onClick: onClose, style: { flex: "none" } })),
      children != null && /* @__PURE__ */ import_react47.default.createElement("div", { style: { padding: `0 var(--drawer-padding-inline) var(--space-5)`, overflowY: "auto", flex: "1 1 auto", minHeight: 0 } }, children),
      footer && /* NOT flex-wrap: wrap. The documented footer is two fullWidth
         buttons, whose base size is the whole content width — with wrapping
         enabled a flex line breaks before either item shrinks, so the row
         the spec asks for becomes the two-row toolbar the spec forbids.
         Without wrapping they shrink and share the row at every width, and
         on a narrow sheet they shrink together rather than stacking. */
      /* @__PURE__ */ import_react47.default.createElement("footer", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-4) var(--drawer-padding-inline)", borderTop: "var(--border-width) solid var(--drawer-footer-border)", background: "var(--drawer-footer-background)", flex: "none" } }, footer)
    );
    if (!modal) return panel;
    return /* @__PURE__ */ import_react47.default.createElement(
      "div",
      {
        ref: scrimRef,
        "data-drawer-scrim": "",
        onMouseDown: (e) => {
          if (dismissible && onClose && e.target === e.currentTarget) onClose();
        },
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: side === "left" ? "flex-start" : "flex-end",
          alignItems: isSheet ? "flex-end" : "stretch",
          background: "var(--drawer-scrim)",
          zIndex: "var(--z-drawer)",
          animation: "var(--anim-fade-in)"
        }
      },
      panel
    );
  }

  // components/feedback/Popover.jsx
  var import_react48 = __toESM(require_react(), 1);
  var WIDTHS2 = { sm: 240, md: 320, lg: 400 };
  var FOCUSABLE3 = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function Popover({
    trigger,
    title,
    open,
    onOpenChange,
    side = "bottom",
    align = "start",
    offset = 4,
    width = "md",
    matchTriggerWidth = false,
    padded = true,
    onClose,
    children,
    style,
    ...rest
  }) {
    const [uncontrolled, setUncontrolled] = import_react48.default.useState(false);
    const isControlled = open != null;
    const isOpen = isControlled ? open : uncontrolled;
    const anchorRef = import_react48.default.useRef(null);
    const panelRef = import_react48.default.useRef(null);
    const restoreRef = import_react48.default.useRef(null);
    const baseId = import_react48.default.useId();
    const titleId = baseId + "-title";
    const pos = useAnchor(anchorRef, panelRef, { open: isOpen, side, align, offset, matchWidth: matchTriggerWidth });
    const setOpen = import_react48.default.useCallback((next) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
      if (!next) onClose?.();
    }, [isControlled, onOpenChange, onClose]);
    if (!title && !rest["aria-label"] && !rest["aria-labelledby"]) {
      console.warn("[Meridian] Popover: no accessible name. A panel that takes focus must announce what it is \u2014 pass `title`, or aria-label when the panel is deliberately untitled.");
    }
    import_react48.default.useEffect(() => {
      if (!isOpen) return void 0;
      restoreRef.current = document.activeElement;
      const t = requestAnimationFrame(() => {
        const el = panelRef.current;
        if (!el) return;
        (el.querySelector("[data-autofocus]") || el.querySelector(FOCUSABLE3) || el).focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(t);
    }, [isOpen]);
    import_react48.default.useEffect(() => {
      if (!isOpen) return void 0;
      const onDown = (e) => {
        if (panelRef.current?.contains(e.target) || anchorRef.current?.contains(e.target)) return;
        setOpen(false);
      };
      const onKey = (e) => {
        if (e.key !== "Escape") return;
        e.stopPropagation();
        setOpen(false);
        restoreRef.current?.focus?.({ preventScroll: true });
      };
      const onFocusOut = (e) => {
        const to = e.relatedTarget;
        if (!to) return;
        if (panelRef.current?.contains(to) || anchorRef.current?.contains(to)) return;
        setOpen(false);
      };
      document.addEventListener("pointerdown", onDown);
      document.addEventListener("keydown", onKey);
      panelRef.current?.addEventListener("focusout", onFocusOut);
      const panel = panelRef.current;
      return () => {
        document.removeEventListener("pointerdown", onDown);
        document.removeEventListener("keydown", onKey);
        panel?.removeEventListener("focusout", onFocusOut);
      };
    }, [isOpen, setOpen]);
    function close() {
      setOpen(false);
      restoreRef.current?.focus?.({ preventScroll: true });
    }
    return /* @__PURE__ */ import_react48.default.createElement(import_react48.default.Fragment, null, /* @__PURE__ */ import_react48.default.createElement(
      "span",
      {
        ref: anchorRef,
        onClick: () => isOpen ? close() : setOpen(true),
        style: { display: "inline-flex", maxWidth: "100%" }
      },
      import_react48.default.isValidElement(trigger) ? import_react48.default.cloneElement(trigger, { "aria-haspopup": "dialog", "aria-expanded": isOpen }) : trigger
    ), isOpen && /* @__PURE__ */ import_react48.default.createElement(
      "div",
      {
        ...rest,
        ref: panelRef,
        role: "dialog",
        tabIndex: -1,
        "aria-labelledby": title ? titleId : rest["aria-labelledby"],
        style: {
          ...anchorStyle(pos || { left: -9999, top: 0 }, "var(--z-popover)"),
          width: matchTriggerWidth ? pos?.width : typeof width === "number" ? width : WIDTHS2[width] || WIDTHS2.md,
          maxWidth: `calc(100vw - 16px)`,
          display: "flex",
          flexDirection: "column",
          background: "var(--popover-background)",
          border: "var(--border-width) solid var(--popover-border)",
          borderRadius: "var(--popover-radius)",
          boxShadow: "var(--popover-shadow)",
          outline: "none",
          overflow: "auto",
          ...style
        }
      },
      title && /* @__PURE__ */ import_react48.default.createElement("header", { style: { display: "flex", alignItems: "flex-start", gap: 8, padding: padded ? "10px 12px 8px" : "10px 12px", borderBottom: "var(--border-width) solid var(--popover-divider)" } }, /* @__PURE__ */ import_react48.default.createElement("h2", { id: titleId, style: { flex: 1, minWidth: 0, margin: 0, fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-label)", color: "var(--popover-title-text)" } }, title), /* @__PURE__ */ import_react48.default.createElement(IconButton, { icon: "x", label: "Close", size: "sm", onClick: close })),
      /* @__PURE__ */ import_react48.default.createElement("div", { style: { minWidth: 0, padding: padded ? 12 : 0 } }, children)
    ));
  }

  // components/feedback/Progress.jsx
  var import_react49 = __toESM(require_react(), 1);
  function useDelayed2(delay) {
    const [shown, setShown] = import_react49.default.useState(!delay);
    import_react49.default.useEffect(() => {
      if (!delay) {
        setShown(true);
        return void 0;
      }
      setShown(false);
      const t = setTimeout(() => setShown(true), delay);
      return () => clearTimeout(t);
    }, [delay]);
    return shown;
  }
  var BAR_H = { sm: "var(--progress-height-sm)", md: "var(--progress-height-md)" };
  var SPIN = {
    sm: "var(--progress-spinner-size-sm)",
    md: "var(--progress-spinner-size-md)",
    lg: "var(--progress-spinner-size-lg)"
  };
  function Progress({
    /* Hold the indicator back for this many ms (≈300 for a spinner over a
       fetch). See useDelayed. */
    delay = 0,
    value,
    variant = "bar",
    size = "md",
    label,
    showValue = false,
    style,
    ...rest
  }) {
    const uid = import_react49.default.useId();
    const labelId = `${uid}-label`;
    const named = label || rest["aria-label"] || rest["aria-labelledby"];
    if (!named) {
      console.warn('[Meridian] Progress: no `label` (or aria-label). An unnamed progressbar announces as "progress bar, busy" with no subject \u2014 and because reduced motion stops the animation dead, the words are sometimes the ONLY cue that work is in flight. Say what is running: "Exporting work orders".');
    }
    const ready = useDelayed2(delay);
    const indeterminate = value == null;
    if (!indeterminate && (value < 0 || value > 100)) {
      console.warn(`[Meridian] Progress: value ${value} is outside 0\u2013100. Pass a percentage; a bar cannot render a fraction it cannot clamp, and a value over 100 reports work that has more than finished.`);
    }
    const pct = indeterminate ? 0 : Math.max(0, Math.min(100, value));
    const aria = {
      role: "progressbar",
      "aria-labelledby": label ? labelId : rest["aria-labelledby"],
      "aria-label": label ? void 0 : rest["aria-label"],
      "aria-valuemin": indeterminate ? void 0 : 0,
      "aria-valuemax": indeterminate ? void 0 : 100,
      "aria-valuenow": indeterminate ? void 0 : Math.round(pct),
      "aria-valuetext": indeterminate ? void 0 : `${Math.round(pct)} %`
    };
    if (!ready) return null;
    if (variant === "spinner") {
      const px = SPIN[size] || SPIN.md;
      if (!indeterminate) {
        console.warn('[Meridian] Progress: variant="spinner" ignores `value`. A ring that reports a percentage is a chart; use variant="bar" for anything measurable.');
      }
      return /* @__PURE__ */ import_react49.default.createElement(
        "span",
        {
          ...aria,
          ...rest,
          style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, ...style }
        },
        /* @__PURE__ */ import_react49.default.createElement(
          "span",
          {
            "aria-hidden": "true",
            "data-progress": "spinner",
            style: {
              flex: "none",
              display: "block",
              width: px,
              height: px,
              borderRadius: "var(--radius-full)",
              border: `var(--progress-spinner-width) solid var(--progress-spinner-track)`,
              borderTopColor: "var(--progress-spinner-indicator)",
              animation: "var(--anim-spin)"
            }
          }
        ),
        label && /* @__PURE__ */ import_react49.default.createElement("span", { id: labelId, style: { fontSize: "var(--text-xs)", color: "var(--progress-label-text)", minWidth: 0 } }, label)
      );
    }
    return /* @__PURE__ */ import_react49.default.createElement("span", { style: { display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 0, ...style } }, (label || showValue) && /* @__PURE__ */ import_react49.default.createElement("span", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)", fontSize: "var(--text-xs)", minWidth: 0 } }, label ? /* @__PURE__ */ import_react49.default.createElement("span", { id: labelId, style: { color: "var(--progress-label-text)", minWidth: 0 } }, label) : /* @__PURE__ */ import_react49.default.createElement("span", null), showValue && !indeterminate && /* @__PURE__ */ import_react49.default.createElement("span", { style: { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: "var(--progress-value-text)", flex: "none" } }, Math.round(pct), " %")), /* @__PURE__ */ import_react49.default.createElement(
      "span",
      {
        ...aria,
        ...rest,
        "data-progress": indeterminate ? "indeterminate" : "bar",
        style: {
          display: "block",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: BAR_H[size] || BAR_H.md,
          background: "var(--progress-track)",
          borderRadius: "var(--progress-radius)"
        }
      },
      /* @__PURE__ */ import_react49.default.createElement(
        "span",
        {
          "aria-hidden": "true",
          style: {
            display: "block",
            height: "100%",
            width: indeterminate ? "var(--progress-indeterminate-width)" : `${pct}%`,
            background: "var(--progress-indicator)",
            borderRadius: "inherit",
            /* Width transitions forward only in practice, because the value
               comes from real work. Never a transform: a scaled bar with a
               radius distorts its own end caps. */
            transition: indeterminate ? void 0 : "width var(--duration-base) var(--ease-out)",
            animation: indeterminate ? "var(--anim-indeterminate)" : void 0
          }
        }
      )
    ));
  }

  // components/feedback/Snackbar.jsx
  var import_react50 = __toESM(require_react(), 1);
  var SIZES12 = {
    sm: { height: "var(--snackbar-height-sm)", padding: "var(--snackbar-padding-sm)", text: "var(--text-xs)" },
    md: { height: "var(--snackbar-height-md)", padding: "var(--snackbar-padding-md)", text: "var(--text-sm)" }
  };
  function Snackbar({
    open = false,
    message,
    action,
    onDismiss,
    duration = 6e3,
    size = "md",
    scope = "container",
    placement = "floating",
    align = "center",
    dismissible = true,
    style,
    ...rest
  }) {
    const s = SIZES12[size] || SIZES12.md;
    const attached = placement === "attached";
    const page = scope === "page";
    const [paused, setPaused] = import_react50.default.useState(false);
    import_react50.default.useEffect(() => {
      if (!open || duration == null || paused || !onDismiss) return void 0;
      const h = window.setTimeout(onDismiss, duration);
      return () => window.clearTimeout(h);
    }, [open, message, duration, paused, onDismiss]);
    return /* @__PURE__ */ import_react50.default.createElement(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true",
        "data-snackbar-region": scope,
        style: {
          position: page ? "fixed" : "absolute",
          zIndex: page ? "var(--z-snackbar)" : 1,
          left: attached ? 0 : "var(--snackbar-inset)",
          right: attached ? 0 : "var(--snackbar-inset)",
          bottom: attached ? 0 : "var(--snackbar-inset)",
          display: "flex",
          justifyContent: align === "start" ? "flex-start" : "center",
          pointerEvents: "none"
        }
      },
      open && /* @__PURE__ */ import_react50.default.createElement(
        "div",
        {
          "data-snackbar": placement,
          onMouseEnter: () => setPaused(true),
          onMouseLeave: () => setPaused(false),
          onFocusCapture: () => setPaused(true),
          onBlurCapture: () => setPaused(false),
          ...rest,
          style: {
            display: "flex",
            alignItems: "center",
            gap: "var(--snackbar-gap)",
            minHeight: s.height,
            width: attached ? "100%" : "auto",
            maxWidth: attached ? "none" : "var(--snackbar-max-width)",
            padding: `0 ${size === "sm" ? "var(--space-2)" : "var(--space-3)"} 0 ${s.padding}`,
            background: "var(--snackbar-background)",
            border: attached ? "none" : "var(--border-width) solid var(--snackbar-border)",
            borderTop: attached ? "var(--border-width) solid var(--snackbar-attached-border)" : void 0,
            borderRadius: attached ? 0 : "var(--snackbar-radius)",
            boxShadow: attached ? "none" : "var(--snackbar-shadow)",
            pointerEvents: "auto",
            animation: `mer-rise-in var(--duration-base) var(--ease-out) both`,
            ...style
          }
        },
        /* @__PURE__ */ import_react50.default.createElement(
          "span",
          {
            style: {
              flex: 1,
              minWidth: 0,
              fontSize: s.text,
              lineHeight: "var(--leading-snug)",
              color: "var(--snackbar-text)",
              /* One line. A snackbar that wraps to three is a Toast with a
                 message, or a banner. */
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }
          },
          message
        ),
        action,
        dismissible && onDismiss && /* @__PURE__ */ import_react50.default.createElement(IconButton, { icon: "x", label: "Dismiss", size: "sm", variant: "ghost", onClick: onDismiss, style: { color: "var(--snackbar-dismiss-icon)" } })
      )
    );
  }

  // components/feedback/Toast.jsx
  var import_react51 = __toESM(require_react(), 1);
  var TONES4 = {
    info: { icon: "info", color: "var(--toast-icon-info)", ms: 5e3 },
    success: { icon: "circle-check", color: "var(--toast-icon-success)", ms: 5e3 },
    warning: { icon: "triangle-alert", color: "var(--toast-icon-warning)", ms: 8e3 },
    /* Critical toasts never expire: a failure the user has not read is not a
       failure they have been told about. */
    danger: { icon: "circle-alert", color: "var(--toast-icon-critical)", ms: null }
  };
  function Toast({ tone = "info", title, message, action, onDismiss, live = "off", style, ...rest }) {
    const t = TONES4[tone] || TONES4.info;
    const assertive = tone === "danger";
    return /* @__PURE__ */ import_react51.default.createElement(
      "div",
      {
        role: assertive ? "alert" : live === "off" ? "group" : "status",
        "aria-live": assertive ? "assertive" : live === "off" ? void 0 : "polite",
        "data-toast": tone,
        ...rest,
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--space-3)",
          width: "var(--toast-width)",
          maxWidth: "100%",
          padding: "var(--space-3) var(--space-3) var(--space-3) var(--space-4)",
          background: "var(--toast-background)",
          border: "var(--border-width) solid var(--toast-border)",
          borderRadius: "var(--toast-radius)",
          boxShadow: "var(--toast-shadow)",
          pointerEvents: "auto",
          ...style
        }
      },
      /* @__PURE__ */ import_react51.default.createElement(Icon, { name: t.icon, size: 16, style: { color: t.color, marginTop: 1 } }),
      /* @__PURE__ */ import_react51.default.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react51.default.createElement("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--toast-title-text)" } }, title), message && /* @__PURE__ */ import_react51.default.createElement("div", { style: { marginTop: 2, fontSize: "var(--text-xs)", lineHeight: "var(--leading-snug)", color: "var(--toast-message-text)" } }, message), action && /* @__PURE__ */ import_react51.default.createElement("div", { style: { marginTop: "var(--space-2)" } }, action)),
      onDismiss && /* @__PURE__ */ import_react51.default.createElement(IconButton, { icon: "x", label: "Dismiss", size: "sm", variant: "ghost", onClick: onDismiss, style: { color: "var(--toast-dismiss-icon)", flex: "none" } })
    );
  }
  var seq = 0;
  var queue = [];
  var listeners = /* @__PURE__ */ new Set();
  var emit = () => listeners.forEach((l) => l(queue));
  function push(input) {
    const spec = typeof input === "string" ? { title: input } : input || {};
    const tone = spec.tone || "info";
    const id = spec.id != null ? spec.id : `toast-${++seq}`;
    const duration = spec.duration !== void 0 ? spec.duration : (TONES4[tone] || TONES4.info).ms;
    const item = { ...spec, id, tone, duration };
    const at = queue.findIndex((q) => q.id === id);
    queue = at === -1 ? [...queue, item] : queue.map((q, i) => i === at ? item : q);
    emit();
    return id;
  }
  function dismiss(id) {
    queue = queue.filter((q) => q.id !== id);
    emit();
  }
  function Toaster({ position = "bottom-right", maxVisible = 3, style, ...rest }) {
    const [items, setItems] = import_react51.default.useState(queue);
    const [paused, setPaused] = import_react51.default.useState(false);
    const timers = import_react51.default.useRef(/* @__PURE__ */ new Map());
    import_react51.default.useEffect(() => {
      listeners.add(setItems);
      setItems(queue);
      return () => listeners.delete(setItems);
    }, []);
    import_react51.default.useEffect(() => {
      const shown2 = items.slice(0, maxVisible);
      shown2.forEach((it) => {
        if (it.duration == null || paused || timers.current.has(it.id)) return;
        timers.current.set(it.id, window.setTimeout(() => {
          timers.current.delete(it.id);
          dismiss(it.id);
        }, it.duration));
      });
      if (paused) {
        timers.current.forEach((h) => window.clearTimeout(h));
        timers.current.clear();
      }
      return void 0;
    }, [items, paused, maxVisible]);
    import_react51.default.useEffect(() => () => {
      timers.current.forEach((h) => window.clearTimeout(h));
      timers.current.clear();
    }, []);
    const shown = items.slice(0, maxVisible);
    const hidden = items.length - shown.length;
    const top = position.startsWith("top");
    const centre = position.endsWith("center");
    return /* @__PURE__ */ import_react51.default.createElement(
      "div",
      {
        "aria-label": "Notifications",
        role: "region",
        "aria-live": "polite",
        "aria-relevant": "additions",
        "data-toaster": position,
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
        onFocusCapture: () => setPaused(true),
        onBlurCapture: () => setPaused(false),
        ...rest,
        style: {
          position: "fixed",
          zIndex: "var(--z-toast)",
          [top ? "top" : "bottom"]: "var(--toast-viewport-inset)",
          ...centre ? { left: "50%", transform: "translateX(-50%)" } : { right: "var(--toast-viewport-inset)" },
          display: "flex",
          flexDirection: top ? "column" : "column-reverse",
          gap: "var(--toast-gap)",
          pointerEvents: "none",
          maxWidth: "calc(100vw - 2 * var(--toast-viewport-inset))",
          ...style
        }
      },
      shown.map((it) => /* @__PURE__ */ import_react51.default.createElement("div", { key: it.id, style: { animation: `${centre && top ? "mer-drop-in" : "mer-slide-in-right"} var(--duration-base) var(--ease-out) both` } }, /* @__PURE__ */ import_react51.default.createElement(
        Toast,
        {
          tone: it.tone,
          title: it.title,
          message: it.message,
          action: it.action,
          onDismiss: it.dismissible === false ? void 0 : () => dismiss(it.id)
        }
      ))),
      hidden > 0 && /* @__PURE__ */ import_react51.default.createElement("span", { style: { alignSelf: centre ? "center" : "flex-end", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--toast-overflow-text)", pointerEvents: "auto" } }, "+", hidden, " more")
    );
  }
  Toaster.show = push;
  Toaster.dismiss = dismiss;
  Toaster.dismissAll = function dismissAll() {
    queue = [];
    emit();
  };
  Toaster.success = (input) => push({ ...typeof input === "string" ? { title: input } : input, tone: "success" });
  Toaster.error = (input) => push({ ...typeof input === "string" ? { title: input } : input, tone: "danger" });
  Toaster.warning = (input) => push({ ...typeof input === "string" ? { title: input } : input, tone: "warning" });

  // components/feedback/Tooltip.jsx
  var import_react52 = __toESM(require_react(), 1);
  var OFFSET = 8;
  var DELAY = 400;
  var WARM = 200;
  var GRACE = 120;
  var warmUntil = 0;
  function Tooltip({
    content,
    shortcut,
    side = "top",
    align = "center",
    delay,
    maxWidth,
    disabled = false,
    open: openProp,
    children,
    style,
    ...rest
  }) {
    const [open, setOpen] = import_react52.default.useState(false);
    const anchorRef = import_react52.default.useRef(null);
    const tipRef = import_react52.default.useRef(null);
    const timer = import_react52.default.useRef(0);
    const id = import_react52.default.useId();
    const isControlled = openProp != null;
    const shown = (isControlled ? openProp : open) && !disabled && content != null;
    const pos = useAnchor(anchorRef, tipRef, { open: shown, side, align, offset: OFFSET, clampHeight: false });
    const clear = () => {
      clearTimeout(timer.current);
      timer.current = 0;
    };
    const show = import_react52.default.useCallback((immediate) => {
      if (disabled || isControlled) return;
      clear();
      const wait = immediate || Date.now() < warmUntil ? 0 : delay ?? DELAY;
      if (wait === 0) setOpen(true);
      else timer.current = setTimeout(() => setOpen(true), wait);
    }, [disabled, isControlled, delay]);
    const hide = import_react52.default.useCallback((graceful) => {
      if (isControlled) return;
      clear();
      const done = () => {
        setOpen((was) => {
          if (was) warmUntil = Date.now() + WARM;
          return false;
        });
      };
      if (graceful) timer.current = setTimeout(done, GRACE);
      else done();
    }, [isControlled]);
    import_react52.default.useEffect(() => clear, []);
    import_react52.default.useEffect(() => {
      if (!shown) return void 0;
      const onKey = (e) => {
        if (e.key === "Escape") hide(false);
      };
      document.addEventListener("keydown", onKey, true);
      return () => document.removeEventListener("keydown", onKey, true);
    }, [shown, hide]);
    const coarse = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
    const childDisabled = import_react52.default.isValidElement(children) && children.props.disabled === true;
    const child = import_react52.default.isValidElement(children) ? import_react52.default.cloneElement(children, childDisabled ? { style: { ...children.props.style, pointerEvents: "none" } } : { "aria-describedby": shown ? [children.props["aria-describedby"], id].filter(Boolean).join(" ") : children.props["aria-describedby"] }) : children;
    return /* @__PURE__ */ import_react52.default.createElement(
      "span",
      {
        ref: anchorRef,
        ...childDisabled && !disabled ? {
          tabIndex: 0,
          role: "button",
          "aria-disabled": true,
          "aria-describedby": shown ? id : void 0
        } : null,
        onPointerEnter: (e) => {
          if (e.pointerType !== "touch" && !coarse) show(false);
        },
        onPointerLeave: (e) => {
          if (e.pointerType !== "touch") hide(true);
        },
        onPointerDown: () => hide(false),
        onFocus: (e) => {
          if (e.target.matches?.(":focus-visible")) show(true);
        },
        onBlur: () => hide(false),
        ...rest,
        style: { display: "inline-flex", maxWidth: "100%", ...style }
      },
      child,
      shown && /* @__PURE__ */ import_react52.default.createElement(
        "span",
        {
          ref: tipRef,
          id,
          role: "tooltip",
          onPointerEnter: clear,
          onPointerLeave: () => hide(true),
          style: {
            ...anchorStyle(pos || { left: -9999, top: 0 }, "var(--z-tooltip)"),
            display: "inline-flex",
            alignItems: "baseline",
            gap: 6,
            padding: "var(--tooltip-padding)",
            maxWidth: maxWidth ?? "var(--tooltip-max-width)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-regular)",
            lineHeight: 1.35,
            textWrap: "pretty",
            color: "var(--tooltip-foreground)",
            background: "var(--tooltip-background)",
            border: "var(--border-width) solid var(--tooltip-border)",
            borderRadius: "var(--tooltip-radius)",
            boxShadow: "var(--tooltip-shadow)",
            animation: "mer-fade-in var(--duration-instant) var(--ease-out)"
          }
        },
        /* @__PURE__ */ import_react52.default.createElement("span", { style: { minWidth: 0 } }, content),
        shortcut && /* @__PURE__ */ import_react52.default.createElement("span", { style: { flex: "none", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--tooltip-shortcut-text)", letterSpacing: "var(--tracking-label)", whiteSpace: "nowrap" } }, shortcut)
      )
    );
  }

  // components/forms/Autocomplete.jsx
  var import_react53 = __toESM(require_react(), 1);
  var H5 = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  var PX5 = { sm: "var(--control-px-sm)", md: "var(--control-px-md)", lg: "var(--control-px-lg)" };
  var FS3 = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-lg)" };
  var IS3 = { sm: 14, md: 14, lg: 16 };
  var WORD_EDGE = /[\s\-_./:,(]/;
  var norm2 = (s) => typeof s === "string" ? { value: s, label: s } : { ...s, label: s.label ?? s.value };
  function rank(label, q) {
    const l = label.toLowerCase();
    if (l.startsWith(q)) return 0;
    const i = l.indexOf(q);
    if (i < 0) return -1;
    return WORD_EDGE.test(l[i - 1]) ? 1 : 2;
  }
  var defaultFilter = (s, q) => rank(s.label, q) >= 0;
  function Completion({ text, query }) {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query);
    if (i !== 0) return text;
    return /* @__PURE__ */ import_react53.default.createElement(import_react53.default.Fragment, null, text.slice(0, query.length), /* @__PURE__ */ import_react53.default.createElement("span", { style: { color: "var(--autocomplete-suggestion-completion-text)", fontWeight: "var(--weight-semibold)" } }, text.slice(query.length)));
  }
  function Autocomplete({
    suggestions = [],
    value = "",
    onChange,
    onSelect,
    filter,
    minChars = 1,
    maxSuggestions = 6,
    inline = false,
    placeholder,
    loading = false,
    size = "md",
    invalid = false,
    disabled = false,
    style,
    ...rest
  }) {
    const field = import_react53.default.useContext(FieldContext);
    const [open, setOpen] = import_react53.default.useState(false);
    const [active, setActive] = import_react53.default.useState(-1);
    const [hover, setHover] = import_react53.default.useState(false);
    const [focus, setFocus] = import_react53.default.useState(false);
    const wrapRef = import_react53.default.useRef(null);
    const inputRef = import_react53.default.useRef(null);
    const listRef = import_react53.default.useRef(null);
    const surfaceRef = import_react53.default.useRef(null);
    const baseId = import_react53.default.useId();
    const listId = baseId + "-list";
    const id = rest.id ?? field?.id;
    const describedBy = rest["aria-describedby"] ?? field?.describedBy;
    const isInvalid = invalid || !!field?.invalid;
    const named = id != null || rest["aria-label"] != null || rest["aria-labelledby"] != null;
    const items = import_react53.default.useMemo(() => suggestions.map(norm2), [suggestions]);
    const q = value.trim().toLowerCase();
    const shown = import_react53.default.useMemo(() => {
      if (q.length < minChars) return [];
      if (filter === false) return items.slice(0, maxSuggestions);
      const fn = typeof filter === "function" ? filter : defaultFilter;
      const hit = items.filter((s) => fn(s, q));
      if (typeof filter === "function") return hit.slice(0, maxSuggestions);
      return hit.map((s, i) => [s, rank(s.label, q), i]).sort((a, b) => a[1] - b[1] || a[2] - b[2]).map((t) => t[0]).slice(0, maxSuggestions);
    }, [items, q, minChars, maxSuggestions, filter]);
    const listOpen = open && !disabled && (loading || shown.length > 0);
    const ghost = inline && listOpen && shown[0] && shown[0].label.toLowerCase().startsWith(value.toLowerCase()) && shown[0].label.length > value.length ? shown[0] : null;
    if (!named) {
      console.warn('[Meridian] Autocomplete: no accessible name. The placeholder is not a label \u2014 it disappears on the first keystroke. Wrap the control in <Field label="\u2026"> or pass aria-label.');
    }
    if (isInvalid && !describedBy) {
      console.warn('[Meridian] Autocomplete: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing \u2014 pass the message through <Field error="\u2026">.');
    }
    if (maxSuggestions > 10) {
      console.warn(`[Meridian] Autocomplete: maxSuggestions={${maxSuggestions}}. A suggestion list is an accelerator, not a browse list \u2014 past ~10 rows it scrolls, stops being scannable at a glance, and the control the user wants is Combobox (a closed list, searched) or a results page.`);
    }
    if (onChange == null) {
      console.warn("[Meridian] Autocomplete: no `onChange`. This control is always controlled \u2014 the typed text IS the value, so it must be held in your state and passed back as `value`.");
    }
    import_react53.default.useEffect(() => {
      if (!listOpen) return void 0;
      const onDown = (e) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("pointerdown", onDown);
      return () => document.removeEventListener("pointerdown", onDown);
    }, [listOpen]);
    const pos = useAnchor(wrapRef, surfaceRef, { open: listOpen, matchWidth: true });
    function accept(s) {
      if (!s) return;
      onChange?.(s.value);
      onSelect?.(s);
      setOpen(false);
      setActive(-1);
      inputRef.current?.focus();
    }
    function onKeyDown(e) {
      if (disabled) return;
      const last = shown.length - 1;
      switch (e.key) {
        case "ArrowDown":
          if (!shown.length) return;
          e.preventDefault();
          if (!listOpen) {
            setOpen(true);
            setActive(0);
            return;
          }
          return setActive((i) => i >= last ? 0 : i + 1);
        case "ArrowUp":
          if (!listOpen) return;
          e.preventDefault();
          return setActive((i) => i <= 0 ? last : i - 1);
        case "ArrowRight":
          if (ghost && e.currentTarget.selectionStart === value.length && e.currentTarget.selectionStart === e.currentTarget.selectionEnd) {
            e.preventDefault();
            accept(ghost);
          }
          return;
        case "Home":
          if (listOpen && active >= 0) {
            e.preventDefault();
            setActive(0);
          }
          return;
        case "End":
          if (listOpen && active >= 0) {
            e.preventDefault();
            setActive(last);
          }
          return;
        case "Enter":
          if (listOpen && active >= 0) {
            e.preventDefault();
            accept(shown[active]);
          } else setOpen(false);
          return;
        case "Escape":
          if (listOpen) {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
            setActive(-1);
          }
          return;
        default:
          return;
      }
    }
    const border = isInvalid ? "var(--input-border-invalid)" : focus ? "var(--input-border-focus)" : hover && !disabled ? "var(--input-border-hover)" : "var(--input-border)";
    const px = PX5[size] || PX5.md;
    const fs = FS3[size] || FS3.md;
    return /* @__PURE__ */ import_react53.default.createElement("div", { ref: wrapRef, style: { position: "relative", minWidth: 0, ...style } }, /* @__PURE__ */ import_react53.default.createElement(
      "div",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: H5[size] || H5.md,
          background: disabled ? "var(--input-background-disabled)" : "var(--input-background)",
          border: `var(--border-width) solid ${border}`,
          borderRadius: "var(--input-radius)",
          boxShadow: focus ? isInvalid ? "var(--input-focus-ring-invalid)" : "var(--input-focus-ring)" : "none",
          transition: "var(--transition-control)",
          minWidth: 0
        }
      },
      ghost && /* @__PURE__ */ import_react53.default.createElement(
        "span",
        {
          "aria-hidden": "true",
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            padding: `0 0 0 ${px}`,
            fontFamily: "var(--font-sans)",
            fontSize: fs,
            whiteSpace: "pre",
            overflow: "hidden",
            pointerEvents: "none"
          }
        },
        /* @__PURE__ */ import_react53.default.createElement("span", { style: { color: "transparent" } }, value),
        /* @__PURE__ */ import_react53.default.createElement("span", { style: { color: "var(--autocomplete-ghost-text)" } }, ghost.label.slice(value.length))
      ),
      /* @__PURE__ */ import_react53.default.createElement(
        "input",
        {
          ...rest,
          ref: inputRef,
          id,
          role: "combobox",
          type: "text",
          autoComplete: "off",
          "aria-expanded": listOpen,
          "aria-controls": listOpen ? listId : void 0,
          "aria-autocomplete": inline ? "both" : "list",
          "aria-activedescendant": listOpen && active >= 0 ? `${baseId}-opt-${active}` : void 0,
          "aria-describedby": describedBy,
          "aria-invalid": isInvalid || void 0,
          "aria-required": field?.required || void 0,
          disabled,
          placeholder,
          value,
          onChange: (e) => {
            const next = e.target.value;
            onChange?.(next);
            setActive(-1);
            if (next.trim().length >= minChars) setOpen(true);
            else setOpen(false);
          },
          onFocus: (e) => {
            setFocus(true);
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocus(false);
            if (!wrapRef.current?.contains(e.relatedTarget)) {
              setOpen(false);
              setActive(-1);
            }
            rest.onBlur?.(e);
          },
          onKeyDown,
          style: {
            position: "relative",
            flex: 1,
            minWidth: 0,
            height: "100%",
            padding: `0 0 0 ${px}`,
            margin: 0,
            border: 0,
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-sans)",
            fontSize: fs,
            color: disabled ? "var(--input-text-disabled)" : "var(--input-text)",
            cursor: disabled ? "not-allowed" : "text",
            textOverflow: "ellipsis"
          }
        }
      ),
      loading && /* @__PURE__ */ import_react53.default.createElement("span", { "aria-hidden": "true", style: { display: "flex", alignItems: "center", padding: `0 ${px}`, color: "var(--input-icon)" } }, /* @__PURE__ */ import_react53.default.createElement(Icon, { name: "loader", size: IS3[size] || IS3.md, style: { animation: "var(--anim-spin)" } }))
    ), listOpen && pos && /* @__PURE__ */ import_react53.default.createElement(
      "div",
      {
        ref: surfaceRef,
        style: {
          ...anchorStyle(pos),
          background: "var(--autocomplete-list-background)",
          border: "var(--border-width) solid var(--autocomplete-list-border)",
          borderRadius: "var(--autocomplete-list-radius)",
          boxShadow: "var(--autocomplete-list-shadow)",
          overflowY: "auto"
        }
      },
      loading && shown.length === 0 ? /* @__PURE__ */ import_react53.default.createElement("div", { role: "status", style: { padding: `10px ${px}`, fontSize: fs, color: "var(--autocomplete-status-text)" } }, "Searching\u2026") : /* @__PURE__ */ import_react53.default.createElement("div", { ref: listRef, role: "listbox", id: listId, "aria-label": rest["aria-label"], style: { padding: "4px 0" } }, shown.map((s, i) => /* @__PURE__ */ import_react53.default.createElement(
        "div",
        {
          key: s.value,
          id: `${baseId}-opt-${i}`,
          role: "option",
          "aria-selected": i === active,
          onMouseEnter: () => setActive(i),
          onMouseLeave: () => setActive(-1),
          onMouseDown: (e) => {
            e.preventDefault();
            accept(s);
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: `6px ${px}`,
            cursor: "pointer",
            background: i === active ? "var(--autocomplete-suggestion-background-active)" : "transparent"
          }
        },
        /* @__PURE__ */ import_react53.default.createElement("span", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react53.default.createElement("span", { style: { display: "block", fontSize: fs, color: "var(--autocomplete-suggestion-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, /* @__PURE__ */ import_react53.default.createElement(Completion, { text: s.label, query: q })), s.description && /* @__PURE__ */ import_react53.default.createElement("span", { style: { display: "block", marginTop: 1, fontSize: "var(--text-2xs)", color: "var(--autocomplete-suggestion-description-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, s.description))
      )))
    ));
  }

  // components/forms/CheckboxGroup.jsx
  var import_react54 = __toESM(require_react(), 1);
  function CheckboxGroup({
    label,
    hint,
    error,
    required = false,
    options = [],
    value,
    defaultValue,
    onChange,
    selectAll,
    columns = 1,
    disabled = false,
    children,
    style,
    ...rest
  }) {
    const autoId = import_react54.default.useId();
    const items = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
    const [inner, setInner] = import_react54.default.useState(defaultValue ?? value ?? []);
    const selected = onChange ? value ?? [] : inner;
    const commit = (next) => {
      if (onChange) onChange(next);
      else setInner(next);
    };
    if (!label) {
      console.warn("[Meridian] CheckboxGroup: `label` is required. A set of boxes with no name is announced as an unlabelled group, which is the defect this component exists to prevent \u2014 if the boxes genuinely have no shared question, they are not a group.");
    }
    if (!children && items.length < 2) {
      console.warn('[Meridian] CheckboxGroup: a group of fewer than two options is a single Checkbox with extra scaffolding around it. Use <Checkbox label="\u2026"> instead.');
    }
    if (children && items.length > 0) {
      console.warn("[Meridian] CheckboxGroup: `options` and `children` are alternatives \u2014 rendering `children` and ignoring `options`.");
    }
    const hasDescriptions = items.some((o) => o.description);
    if (columns > 1 && hasDescriptions) {
      console.warn("[Meridian] CheckboxGroup: columns > 1 with option descriptions puts two blocks of secondary text side by side, and the reading order stops being obvious. Rendering one column.");
      columns = 1;
    }
    const selectable = items.filter((o) => !o.disabled).map((o) => o.value);
    const allOn = selectable.length > 0 && selectable.every((v) => selected.includes(v));
    const someOn = selected.length > 0 && !allOn;
    return (
      /* The <fieldset>/<legend> scaffold is shared with RadioGroup and
         ChipGroup — see core/Fieldset.jsx. */
      /* @__PURE__ */ import_react54.default.createElement(Fieldset, { ...rest, label, hint, error, required, disabled, style }, selectAll && !children && /* @__PURE__ */ import_react54.default.createElement(
        Checkbox,
        {
          label: selectAll,
          disabled,
          checked: allOn,
          indeterminate: someOn,
          onChange: () => commit(allOn ? [] : selectable)
        }
      ), /* @__PURE__ */ import_react54.default.createElement("div", { style: {
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
        gap: "var(--space-1) var(--space-6)",
        marginLeft: selectAll && !children ? 24 : 0,
        minWidth: 0
      } }, children || items.map((o) => /* @__PURE__ */ import_react54.default.createElement(
        Checkbox,
        {
          key: o.value,
          label: o.label,
          description: o.description,
          disabled: disabled || o.disabled,
          checked: selected.includes(o.value),
          onChange: (e) => commit(e.target.checked ? [...selected, o.value] : selected.filter((v) => v !== o.value))
        }
      ))))
    );
  }

  // components/forms/Combobox.jsx
  var import_react55 = __toESM(require_react(), 1);
  var H6 = { sm: "var(--control-h-sm)", md: "var(--control-h-md)", lg: "var(--control-h-lg)" };
  var PX6 = { sm: "var(--control-px-sm)", md: "var(--control-px-md)", lg: "var(--control-px-lg)" };
  var FS4 = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-lg)" };
  var IS4 = { sm: 14, md: 14, lg: 16 };
  var LIST_MAX = 264;
  var norm3 = (o) => typeof o === "string" ? { value: o, label: o } : o;
  var defaultFilter2 = (o, q) => o.label.toLowerCase().includes(q) || (o.description || "").toLowerCase().includes(q);
  function Match({ text, query }) {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query);
    if (i < 0) return text;
    return /* @__PURE__ */ import_react55.default.createElement(import_react55.default.Fragment, null, text.slice(0, i), /* @__PURE__ */ import_react55.default.createElement("mark", { style: { background: "none", color: "var(--combobox-option-match-text)", fontWeight: "var(--weight-semibold)" } }, text.slice(i, i + query.length)), text.slice(i + query.length));
  }
  function Combobox({
    options = [],
    value,
    onChange,
    onSearch,
    filter,
    placeholder,
    emptyMessage = "No matches",
    loading = false,
    size = "md",
    invalid = false,
    disabled = false,
    style,
    ...rest
  }) {
    const field = import_react55.default.useContext(FieldContext);
    const [open, setOpen] = import_react55.default.useState(false);
    const [query, setQuery] = import_react55.default.useState("");
    const [dirty, setDirty] = import_react55.default.useState(false);
    const [active, setActive] = import_react55.default.useState(-1);
    const [hover, setHover] = import_react55.default.useState(false);
    const wrapRef = import_react55.default.useRef(null);
    const inputRef = import_react55.default.useRef(null);
    const listRef = import_react55.default.useRef(null);
    const surfaceRef = import_react55.default.useRef(null);
    const baseId = import_react55.default.useId();
    const listId = baseId + "-list";
    const pos = useAnchor(wrapRef, surfaceRef, { open, matchWidth: true, max: LIST_MAX });
    const id = rest.id ?? field?.id;
    const describedBy = rest["aria-describedby"] ?? field?.describedBy;
    const isInvalid = invalid || !!field?.invalid;
    const named = id != null || rest["aria-label"] != null || rest["aria-labelledby"] != null;
    const items = import_react55.default.useMemo(() => options.map(norm3), [options]);
    const selected = items.find((o) => o.value === value);
    const q = query.trim().toLowerCase();
    const shown = import_react55.default.useMemo(() => {
      if (filter === false || !dirty || !q) return items;
      const fn = typeof filter === "function" ? filter : defaultFilter2;
      return items.filter((o) => fn(o, q));
    }, [items, q, dirty, filter]);
    if (!named) {
      console.warn('[Meridian] Combobox: no accessible name. The placeholder is not a label \u2014 it is replaced by the chosen value and stops being announced. Wrap the control in <Field label="\u2026"> or pass aria-label.');
    }
    if (isInvalid && !describedBy) {
      console.warn('[Meridian] Combobox: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing \u2014 pass the message through <Field error="\u2026">.');
    }
    if (onSearch && filter !== false) {
      console.warn("[Meridian] Combobox: `onSearch` without `filter={false}` filters server results a second time on the client, so rows the server matched on a field you do not render will vanish. Pass filter={false} when the server does the matching.");
    }
    if (value && !selected && items.length > 0) {
      console.warn(`[Meridian] Combobox: value "${value}" is not in \`options\`, so the control renders empty and the user cannot see what is selected. Keep the selected option in the list even when it falls outside the current search.`);
    }
    import_react55.default.useEffect(() => {
      if (!open) return void 0;
      const onDown = (e) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
      };
      document.addEventListener("pointerdown", onDown);
      return () => document.removeEventListener("pointerdown", onDown);
    }, [open]);
    import_react55.default.useEffect(() => {
      if (!open || active < 0 || !listRef.current) return;
      const el = listRef.current.children[active];
      const box = surfaceRef.current;
      if (!el || !box) return;
      if (el.offsetTop < box.scrollTop) box.scrollTop = el.offsetTop;
      else if (el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight) {
        box.scrollTop = el.offsetTop + el.offsetHeight - box.clientHeight;
      }
    }, [active, open, shown.length]);
    function openList(seedActive) {
      if (disabled) return;
      setQuery(selected?.label ?? "");
      setDirty(false);
      setActive(seedActive === "selected" && selected ? items.indexOf(selected) : -1);
      setOpen(true);
    }
    function close() {
      setOpen(false);
      setDirty(false);
      setActive(-1);
    }
    function commit(opt) {
      if (!opt) return;
      onChange?.(opt.value);
      close();
      inputRef.current?.focus();
    }
    function onKeyDown(e) {
      if (disabled) return;
      const last = shown.length - 1;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!open) return openList("selected");
          return setActive((i) => i >= last ? 0 : i + 1);
        case "ArrowUp":
          e.preventDefault();
          if (!open) return openList("selected");
          return setActive((i) => i <= 0 ? last : i - 1);
        case "Home":
          if (open) {
            e.preventDefault();
            setActive(0);
          }
          return;
        case "End":
          if (open) {
            e.preventDefault();
            setActive(last);
          }
          return;
        case "Enter":
          if (open && active >= 0) {
            e.preventDefault();
            commit(shown[active]);
          } else if (open) close();
          return;
        case "Escape":
          if (open) {
            e.preventDefault();
            close();
          }
          return;
        case "Tab":
          if (open && active >= 0) commit(shown[active]);
          else close();
          return;
        default:
          return;
      }
    }
    const border = isInvalid ? "var(--input-border-invalid)" : open ? "var(--input-border-focus)" : hover && !disabled ? "var(--input-border-hover)" : "var(--input-border)";
    const px = PX6[size] || PX6.md;
    const iconPx = IS4[size] || IS4.md;
    const status = loading ? "Searching\u2026" : shown.length === 0 ? emptyMessage : null;
    return /* @__PURE__ */ import_react55.default.createElement("div", { ref: wrapRef, style: { position: "relative", minWidth: 0, ...style } }, /* @__PURE__ */ import_react55.default.createElement(
      "div",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          display: "flex",
          alignItems: "center",
          height: H6[size] || H6.md,
          background: disabled ? "var(--input-background-disabled)" : "var(--input-background)",
          border: `var(--border-width) solid ${border}`,
          borderRadius: "var(--input-radius)",
          boxShadow: open ? isInvalid ? "var(--input-focus-ring-invalid)" : "var(--input-focus-ring)" : "none",
          transition: "var(--transition-control)",
          minWidth: 0
        }
      },
      /* @__PURE__ */ import_react55.default.createElement(
        "input",
        {
          ...rest,
          ref: inputRef,
          id,
          role: "combobox",
          type: "text",
          autoComplete: "off",
          "aria-expanded": open,
          "aria-controls": open ? listId : void 0,
          "aria-autocomplete": "list",
          "aria-activedescendant": open && active >= 0 ? `${baseId}-opt-${active}` : void 0,
          "aria-describedby": describedBy,
          "aria-invalid": isInvalid || void 0,
          "aria-required": field?.required || void 0,
          disabled,
          placeholder,
          value: open ? query : selected?.label ?? "",
          onChange: (e) => {
            setQuery(e.target.value);
            setDirty(true);
            setActive(-1);
            if (!open) setOpen(true);
            onSearch?.(e.target.value);
          },
          onMouseDown: () => {
            if (!open) openList("selected");
          },
          onKeyDown,
          onBlur: (e) => {
            if (!wrapRef.current?.contains(e.relatedTarget)) close();
            rest.onBlur?.(e);
          },
          style: {
            flex: 1,
            minWidth: 0,
            height: "100%",
            padding: `0 0 0 ${px}`,
            margin: 0,
            border: 0,
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-sans)",
            fontSize: FS4[size] || FS4.md,
            color: disabled ? "var(--input-text-disabled)" : "var(--input-text)",
            cursor: disabled ? "not-allowed" : "text",
            textOverflow: "ellipsis"
          }
        }
      ),
      /* @__PURE__ */ import_react55.default.createElement(
        "span",
        {
          "aria-hidden": "true",
          onMouseDown: (e) => {
            e.preventDefault();
            if (open) {
              close();
              inputRef.current?.focus();
            } else {
              openList("selected");
              inputRef.current?.focus();
            }
          },
          style: { display: "flex", alignItems: "center", padding: `0 ${px}`, color: disabled ? "var(--input-text-disabled)" : "var(--input-icon)", cursor: disabled ? "not-allowed" : "pointer" }
        },
        /* @__PURE__ */ import_react55.default.createElement(Icon, { name: loading ? "loader" : "chevron-down", size: iconPx, style: loading ? { animation: "var(--anim-spin)" } : void 0 })
      )
    ), open && pos && /* @__PURE__ */ import_react55.default.createElement(
      "div",
      {
        ref: surfaceRef,
        style: {
          ...anchorStyle(pos),
          background: "var(--combobox-list-background)",
          border: "var(--border-width) solid var(--combobox-list-border)",
          borderRadius: "var(--combobox-list-radius)",
          boxShadow: "var(--combobox-list-shadow)",
          overflowY: "auto"
        }
      },
      status && /* @__PURE__ */ import_react55.default.createElement("div", { role: "status", style: { padding: `10px ${px}`, fontSize: FS4[size] || FS4.md, color: "var(--combobox-status-text)" } }, status),
      /* @__PURE__ */ import_react55.default.createElement(
        "div",
        {
          ref: listRef,
          role: "listbox",
          id: listId,
          "aria-label": rest["aria-label"],
          style: { display: status ? "none" : "block" }
        },
        shown.map((o, i) => {
          const isSelected = o.value === value;
          return /* @__PURE__ */ import_react55.default.createElement(
            "div",
            {
              key: o.value,
              id: `${baseId}-opt-${i}`,
              role: "option",
              "aria-selected": isSelected,
              onMouseEnter: () => setActive(i),
              onMouseDown: (e) => {
                e.preventDefault();
                commit(o);
              },
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: `7px ${px}`,
                cursor: "pointer",
                background: i === active ? "var(--combobox-option-background-active)" : isSelected ? "var(--combobox-option-background-selected)" : "transparent"
              }
            },
            /* @__PURE__ */ import_react55.default.createElement("span", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react55.default.createElement("span", { style: { display: "block", fontSize: FS4[size] || FS4.md, color: "var(--combobox-option-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, /* @__PURE__ */ import_react55.default.createElement(Match, { text: o.label, query: dirty ? q : "" })), o.description && /* @__PURE__ */ import_react55.default.createElement("span", { style: { display: "block", marginTop: 1, fontSize: "var(--text-2xs)", color: "var(--combobox-option-description-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, /* @__PURE__ */ import_react55.default.createElement(Match, { text: o.description, query: dirty ? q : "" }))),
            isSelected && /* @__PURE__ */ import_react55.default.createElement(Icon, { name: "check", size: 14, style: { color: "var(--combobox-option-check)", flex: "0 0 auto" } })
          );
        })
      )
    ));
  }

  // components/forms/MultiCombobox.jsx
  var import_react56 = __toESM(require_react(), 1);
  var MINH2 = { sm: "var(--multi-combobox-min-height-sm)", md: "var(--multi-combobox-min-height-md)", lg: "var(--multi-combobox-min-height-lg)" };
  var PX7 = { sm: "var(--control-px-sm)", md: "var(--control-px-md)", lg: "var(--control-px-lg)" };
  var FS5 = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-lg)" };
  var IS5 = { sm: 14, md: 14, lg: 16 };
  var LIST_MAX2 = 264;
  var norm4 = (o) => typeof o === "string" ? { value: o, label: o } : o;
  var defaultFilter3 = (o, q) => o.label.toLowerCase().includes(q) || (o.description || "").toLowerCase().includes(q);
  function Match2({ text, query }) {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query);
    if (i < 0) return text;
    return /* @__PURE__ */ import_react56.default.createElement(import_react56.default.Fragment, null, text.slice(0, i), /* @__PURE__ */ import_react56.default.createElement("mark", { style: { background: "none", color: "var(--multi-combobox-option-match-text)", fontWeight: "var(--weight-semibold)" } }, text.slice(i, i + query.length)), text.slice(i + query.length));
  }
  function MultiCombobox({
    options = [],
    value = [],
    onChange,
    onSearch,
    filter,
    placeholder,
    emptyMessage = "No matches",
    /* Creatable: the typed text becomes a value. Off by default, because a
       control that invents options is only correct when the SET is open —
       tags, keywords, part numbers a plant adds daily. On a closed set
       (statuses, areas) it silently manufactures values the backend will
       reject, which is worse than "No matches". */
    creatable = false,
    /* Turns typed text into an option. The default trims and uses the text as
       both label and value; a product with ids passes its own. */
    onCreate,
    loading = false,
    /* Unfocused ceiling. 3 fits a half-width field at md without wrapping; false
       shows every token always and lets the box grow. */
    collapseAfter = 3,
    max,
    size = "md",
    invalid = false,
    disabled = false,
    style,
    ...rest
  }) {
    const field = import_react56.default.useContext(FieldContext);
    const [open, setOpen] = import_react56.default.useState(false);
    const [query, setQuery] = import_react56.default.useState("");
    const [active, setActive] = import_react56.default.useState(-1);
    const [hover, setHover] = import_react56.default.useState(false);
    const [focused, setFocused] = import_react56.default.useState(false);
    const wrapRef = import_react56.default.useRef(null);
    const inputRef = import_react56.default.useRef(null);
    const listRef = import_react56.default.useRef(null);
    const surfaceRef = import_react56.default.useRef(null);
    const baseId = import_react56.default.useId();
    const listId = baseId + "-list";
    const pos = useAnchor(wrapRef, surfaceRef, { open, matchWidth: true, max: LIST_MAX2 });
    const id = rest.id ?? field?.id;
    const describedBy = rest["aria-describedby"] ?? field?.describedBy;
    const isInvalid = invalid || !!field?.invalid;
    const named = id != null || rest["aria-label"] != null || rest["aria-labelledby"] != null;
    const items = import_react56.default.useMemo(() => options.map(norm4), [options]);
    const selectedValues = Array.isArray(value) ? value : [];
    const selectedSet = import_react56.default.useMemo(() => new Set(selectedValues), [selectedValues]);
    const selected = import_react56.default.useMemo(
      () => items.filter((o) => selectedSet.has(o.value)),
      [items, selectedSet]
    );
    const q = query.trim().toLowerCase();
    const shown = import_react56.default.useMemo(() => {
      if (filter === false || !q) return items;
      const fn = typeof filter === "function" ? filter : defaultFilter3;
      return items.filter((o) => fn(o, q));
    }, [items, q, filter]);
    const atMax = max != null && selectedValues.length >= max;
    const trimmed = q.trim();
    const exact = trimmed && items.some((o) => String(o.label ?? o.value).toLowerCase() === trimmed.toLowerCase());
    const canCreate = creatable && !!trimmed && !exact && !atMax;
    if (!named) {
      console.warn('[Meridian] MultiCombobox: no accessible name. The placeholder is not a label \u2014 it disappears behind the first token. Wrap the control in <Field label="\u2026"> or pass aria-label.');
    }
    if (isInvalid && !describedBy) {
      console.warn('[Meridian] MultiCombobox: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) \u2014 pass the message through <Field error="\u2026">.');
    }
    if (onSearch && filter !== false) {
      console.warn("[Meridian] MultiCombobox: `onSearch` without `filter={false}` filters server results a second time on the client. Pass filter={false} when the server does the matching.");
    }
    if (value !== void 0 && typeof onChange !== "function") {
      console.warn("[Meridian] MultiCombobox: `value` without `onChange`. The control renders but nothing can be added or removed.");
    }
    if (!Array.isArray(value)) {
      console.warn("[Meridian] MultiCombobox: `value` must be an array. One value is a Combobox.");
    }
    const missing = selectedValues.filter((v) => !items.some((o) => o.value === v));
    if (missing.length && items.length) {
      console.warn(`[Meridian] MultiCombobox: ${JSON.stringify(missing)} is selected but not in \`options\`, so it renders no token and the user cannot see or remove it. Keep selected options in the list even when they fall outside the current search.`);
    }
    import_react56.default.useEffect(() => {
      if (!open) return void 0;
      const onDown = (e) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
      };
      document.addEventListener("pointerdown", onDown);
      return () => document.removeEventListener("pointerdown", onDown);
    }, [open]);
    import_react56.default.useEffect(() => {
      if (!open || active < 0 || !listRef.current) return;
      const el = listRef.current.children[active];
      const box = surfaceRef.current;
      if (!el || !box) return;
      if (el.offsetTop < box.scrollTop) box.scrollTop = el.offsetTop;
      else if (el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight) {
        box.scrollTop = el.offsetTop + el.offsetHeight - box.clientHeight;
      }
    }, [active, open, shown.length]);
    function close() {
      setOpen(false);
      setActive(-1);
    }
    function emit2(next) {
      onChange?.(items.filter((o) => next.has(o.value)).map((o) => o.value));
    }
    function toggle(opt) {
      if (!opt || opt.disabled) return;
      const next = new Set(selectedSet);
      if (next.has(opt.value)) next.delete(opt.value);
      else {
        if (atMax) return;
        next.add(opt.value);
      }
      emit2(next);
      setQuery("");
      onSearch?.("");
      inputRef.current?.focus();
    }
    function remove(v) {
      const next = new Set(selectedSet);
      next.delete(v);
      emit2(next);
      inputRef.current?.focus();
    }
    function create() {
      if (!canCreate) return;
      const made = onCreate ? onCreate(trimmed) : { value: trimmed, label: trimmed };
      if (!made || made.value == null) return;
      onChange?.([...selectedValues, made.value]);
      setQ("");
      setActive(-1);
    }
    function onKeyDown(e) {
      if (disabled) return;
      const last = shown.length - 1 + (canCreate ? 1 : 0);
      const onCreateRow = canCreate && active === shown.length;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setActive(0);
            return;
          }
          return setActive((i) => i >= last ? 0 : i + 1);
        case "ArrowUp":
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setActive(last);
            return;
          }
          return setActive((i) => i <= 0 ? last : i - 1);
        case "Home":
          if (open) {
            e.preventDefault();
            setActive(0);
          }
          return;
        case "End":
          if (open) {
            e.preventDefault();
            setActive(last);
          }
          return;
        case "Enter":
          if (open && onCreateRow) {
            e.preventDefault();
            create();
            return;
          }
          if (open && active >= 0) {
            e.preventDefault();
            toggle(shown[active]);
          }
          return;
        case "Backspace":
          if (query === "" && selected.length) {
            e.preventDefault();
            remove(selected[selected.length - 1].value);
          }
          return;
        case "Escape":
          if (open) {
            e.preventDefault();
            close();
          }
          return;
        case "Tab":
          close();
          return;
        default:
          return;
      }
    }
    const collapsed = collapseAfter !== false && !focused && !open && selected.length > collapseAfter;
    const visible = collapsed ? selected.slice(0, collapseAfter) : selected;
    const hiddenCount = selected.length - visible.length;
    const border = isInvalid ? "var(--multi-combobox-border-invalid)" : open || focused ? "var(--multi-combobox-border-focus)" : hover && !disabled ? "var(--multi-combobox-border-hover)" : "var(--multi-combobox-border)";
    const px = PX7[size] || PX7.md;
    const iconPx = IS5[size] || IS5.md;
    const status = loading ? "Searching\u2026" : shown.length === 0 && !canCreate ? emptyMessage : atMax ? `Limit of ${max} reached` : null;
    const tagSize = size === "lg" ? "md" : "sm";
    return /* @__PURE__ */ import_react56.default.createElement("div", { ref: wrapRef, style: { position: "relative", minWidth: 0, ...style } }, /* @__PURE__ */ import_react56.default.createElement(
      "div",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onMouseDown: (e) => {
          if (e.target === e.currentTarget && !disabled) {
            e.preventDefault();
            inputRef.current?.focus();
            setOpen(true);
          }
        },
        style: {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--space-1)",
          minHeight: MINH2[size] || MINH2.md,
          padding: `3px calc(${px} - 2px)`,
          background: disabled ? "var(--multi-combobox-background-disabled)" : "var(--multi-combobox-background)",
          border: `var(--border-width) solid ${border}`,
          borderRadius: "var(--multi-combobox-radius)",
          boxShadow: open || focused ? isInvalid ? "var(--multi-combobox-focus-ring-invalid)" : "var(--multi-combobox-focus-ring)" : "none",
          transition: "var(--transition-control)",
          cursor: disabled ? "not-allowed" : "text",
          minWidth: 0
        }
      },
      visible.map((o) => (
        /* The non-shrinking wrapper, not a style on the Tag: tokens are flex
           items beside a query input that holds `flex: 1 1 60px`, so at the
           default `0 1 auto` the row squeezes every token to an ellipsis
           ("Thai" → "T…") instead of wrapping a line. The wrapper owns the
           flex behaviour so Tag's own geometry stays Tag's. */
        /* @__PURE__ */ import_react56.default.createElement("span", { key: o.value, style: { display: "inline-flex", flex: "0 0 auto", minWidth: 0, maxWidth: "100%" } }, /* @__PURE__ */ import_react56.default.createElement(
          Tag,
          {
            label: o.label,
            font: "sans",
            size: tagSize,
            onRemove: disabled ? void 0 : () => remove(o.value)
          }
        ))
      )),
      hiddenCount > 0 && /* @__PURE__ */ import_react56.default.createElement(
        "span",
        {
          "aria-hidden": "true",
          style: { fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--multi-combobox-overflow-text)", whiteSpace: "nowrap" }
        },
        "+",
        hiddenCount
      ),
      /* @__PURE__ */ import_react56.default.createElement(
        "input",
        {
          ...rest,
          ref: inputRef,
          id,
          role: "combobox",
          type: "text",
          autoComplete: "off",
          "aria-expanded": open,
          "aria-controls": open ? listId : void 0,
          "aria-autocomplete": "list",
          "aria-activedescendant": open && active >= 0 ? `${baseId}-opt-${active}` : void 0,
          "aria-describedby": [describedBy, `${baseId}-count`].filter(Boolean).join(" "),
          "aria-invalid": isInvalid || void 0,
          "aria-required": field?.required || void 0,
          disabled,
          placeholder: selected.length ? void 0 : placeholder,
          value: query,
          onChange: (e) => {
            setQuery(e.target.value);
            setActive(-1);
            if (!open) setOpen(true);
            onSearch?.(e.target.value);
          },
          onMouseDown: () => {
            if (!open) setOpen(true);
          },
          onKeyDown,
          onFocus: (e) => {
            setFocused(true);
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocused(false);
            if (!wrapRef.current?.contains(e.relatedTarget)) close();
            rest.onBlur?.(e);
          },
          style: {
            flex: "1 1 60px",
            minWidth: 60,
            height: "var(--control-h-sm)",
            padding: 0,
            margin: 0,
            border: 0,
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-sans)",
            fontSize: FS5[size] || FS5.md,
            color: disabled ? "var(--multi-combobox-text-disabled)" : "var(--multi-combobox-text)",
            cursor: disabled ? "not-allowed" : "text"
          }
        }
      ),
      /* @__PURE__ */ import_react56.default.createElement(
        "span",
        {
          "aria-hidden": "true",
          onMouseDown: (e) => {
            e.preventDefault();
            if (disabled) return;
            setOpen(!open);
            inputRef.current?.focus();
          },
          style: { display: "flex", alignItems: "center", paddingLeft: 4, color: disabled ? "var(--multi-combobox-text-disabled)" : "var(--multi-combobox-icon)", cursor: disabled ? "not-allowed" : "pointer" }
        },
        /* @__PURE__ */ import_react56.default.createElement(Icon, { name: loading ? "loader" : "chevron-down", size: iconPx, style: loading ? { animation: "var(--anim-spin)" } : void 0 })
      )
    ), /* @__PURE__ */ import_react56.default.createElement(
      "span",
      {
        id: `${baseId}-count`,
        role: "status",
        style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }
      },
      selected.length === 0 ? "None selected" : `${selected.length} selected`
    ), open && pos && /* @__PURE__ */ import_react56.default.createElement(
      "div",
      {
        ref: surfaceRef,
        style: {
          ...anchorStyle(pos),
          background: "var(--multi-combobox-list-background)",
          border: "var(--border-width) solid var(--multi-combobox-list-border)",
          borderRadius: "var(--multi-combobox-list-radius)",
          boxShadow: "var(--multi-combobox-list-shadow)",
          overflowY: "auto"
        }
      },
      status && /* @__PURE__ */ import_react56.default.createElement("div", { style: { padding: `10px ${px}`, fontSize: FS5[size] || FS5.md, color: "var(--multi-combobox-status-text)" } }, status),
      /* @__PURE__ */ import_react56.default.createElement(
        "div",
        {
          ref: listRef,
          role: "listbox",
          id: listId,
          "aria-multiselectable": "true",
          "aria-label": rest["aria-label"],
          style: { display: shown.length === 0 && !canCreate || loading ? "none" : "block" }
        },
        shown.map((o, i) => {
          const isSelected = selectedSet.has(o.value);
          const blocked = o.disabled || atMax && !isSelected;
          return /* @__PURE__ */ import_react56.default.createElement(
            "div",
            {
              key: o.value,
              id: `${baseId}-opt-${i}`,
              role: "option",
              "aria-selected": isSelected,
              "aria-disabled": blocked || void 0,
              onMouseEnter: () => setActive(i),
              onMouseDown: (e) => {
                e.preventDefault();
                toggle(o);
              },
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: `7px ${px}`,
                cursor: blocked ? "not-allowed" : "pointer",
                opacity: blocked ? 0.55 : 1,
                background: i === active ? "var(--multi-combobox-option-background-active)" : isSelected ? "var(--multi-combobox-option-background-selected)" : "transparent"
              }
            },
            /* @__PURE__ */ import_react56.default.createElement("span", { "aria-hidden": "true", style: { display: "flex", flex: "0 0 auto", width: 14, color: "var(--multi-combobox-option-check)" } }, /* @__PURE__ */ import_react56.default.createElement(Icon, { name: isSelected ? "square-check" : "square", size: 14, style: { color: isSelected ? "var(--multi-combobox-option-check)" : "var(--multi-combobox-icon)" } })),
            /* @__PURE__ */ import_react56.default.createElement("span", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react56.default.createElement("span", { style: { display: "block", fontSize: FS5[size] || FS5.md, color: "var(--multi-combobox-option-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, /* @__PURE__ */ import_react56.default.createElement(Match2, { text: o.label, query: q })), o.description && /* @__PURE__ */ import_react56.default.createElement("span", { style: { display: "block", marginTop: 1, fontSize: "var(--text-2xs)", color: "var(--multi-combobox-option-description-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, /* @__PURE__ */ import_react56.default.createElement(Match2, { text: o.description, query: q })))
          );
        }),
        canCreate && /* role="option" like any other row: it is in the same listbox,
           reachable by the same arrow keys, and announced in the same
           sequence. A div with an onClick here would be invisible to
           the arrow-key model the rest of the list already has. */
        /* @__PURE__ */ import_react56.default.createElement(
          "div",
          {
            id: `${baseId}-opt-${shown.length}`,
            role: "option",
            "aria-selected": false,
            onMouseEnter: () => setActive(shown.length),
            onMouseDown: (e) => {
              e.preventDefault();
              create();
            },
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: `7px ${px}`,
              cursor: "pointer",
              borderTop: shown.length ? "var(--border-width) solid var(--multi-combobox-list-border)" : "none",
              background: active === shown.length ? "var(--multi-combobox-option-background-active)" : "transparent"
            }
          },
          /* @__PURE__ */ import_react56.default.createElement("span", { "aria-hidden": "true", style: { display: "flex", flex: "0 0 auto", width: 14, color: "var(--multi-combobox-icon)" } }, /* @__PURE__ */ import_react56.default.createElement(Icon, { name: "plus", size: 14 })),
          /* @__PURE__ */ import_react56.default.createElement("span", { style: { flex: 1, minWidth: 0, fontSize: FS5[size] || FS5.md, color: "var(--multi-combobox-option-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, "Create ", /* @__PURE__ */ import_react56.default.createElement("strong", { style: { fontWeight: "var(--weight-medium)" } }, "\u201C", trimmed, "\u201D"))
        )
      )
    ));
  }

  // components/forms/Radio.jsx
  var import_react57 = __toESM(require_react(), 1);
  function Radio({
    label,
    description,
    name,
    value,
    checked = false,
    disabled = false,
    onChange,
    style,
    ...rest
  }) {
    const autoId = import_react57.default.useId();
    const descId = description ? `${autoId}-desc` : void 0;
    const [focus, setFocus] = import_react57.default.useState(false);
    const [hover, setHover] = import_react57.default.useState(false);
    if (!name) {
      console.warn("[Meridian] Radio: `name` is required. Radios are exclusive only through a shared name \u2014 without it every radio is its own group of one, nothing ever deselects, and the browser gives no arrow-key navigation between them.");
    }
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] Radio: no accessible name. An unlabelled radio announces as "radio button, not selected" with nothing to say what it chooses \u2014 pass `label`, or aria-label.');
    }
    const border = disabled ? "var(--radio-border-disabled)" : checked ? hover ? "var(--radio-border-checked-hover)" : "var(--radio-border-checked)" : hover ? "var(--radio-border-hover)" : "var(--radio-border)";
    return /* @__PURE__ */ import_react57.default.createElement("span", { style: { display: "inline-flex", flexDirection: "column", gap: 2, minWidth: 0, ...style } }, /* @__PURE__ */ import_react57.default.createElement(
      "label",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: label ? "flex-start" : "center",
          gap: "var(--space-2)",
          /* The dot is 16px; the TARGET is a control-height row, so it clears
             the 24px minimum (2.5.8) and grows with density. */
          minHeight: "var(--control-h-sm)",
          minWidth: label ? 0 : "var(--control-h-sm)",
          cursor: disabled ? "not-allowed" : "pointer"
        }
      },
      /* @__PURE__ */ import_react57.default.createElement(
        "input",
        {
          type: "radio",
          ...rest,
          name,
          value,
          ...onChange ? { checked } : { defaultChecked: checked, readOnly: true },
          disabled,
          "aria-describedby": rest["aria-describedby"] ?? descId,
          onChange,
          onFocus: (e) => {
            setFocus(e.target.matches(":focus-visible"));
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocus(false);
            rest.onBlur?.(e);
          },
          style: { position: "absolute", opacity: 0, width: 0, height: 0 }
        }
      ),
      /* @__PURE__ */ import_react57.default.createElement("span", { style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        width: 16,
        height: 16,
        background: disabled ? "var(--radio-background-disabled)" : hover && !checked ? "var(--radio-background-hover)" : "var(--radio-background)",
        border: `var(--border-width) solid ${border}`,
        borderRadius: "var(--radius-pill)",
        boxShadow: focus ? "var(--input-focus-ring)" : "none",
        transition: "var(--transition-control)"
      } }, checked && /* @__PURE__ */ import_react57.default.createElement("span", { style: {
        width: 8,
        height: 8,
        borderRadius: "var(--radius-pill)",
        background: disabled ? "var(--radio-dot-disabled)" : hover ? "var(--radio-dot-hover)" : "var(--radio-dot)",
        transition: "var(--transition-control)"
      } })),
      label && /* @__PURE__ */ import_react57.default.createElement("span", { style: { minWidth: 0, fontSize: "var(--text-sm)", color: disabled ? "var(--text-disabled)" : "var(--text-primary)", lineHeight: "var(--leading-snug)" } }, label)
    ), description && /* @__PURE__ */ import_react57.default.createElement("span", { id: descId, style: { marginLeft: 24, fontSize: "var(--text-xs)", color: disabled ? "var(--text-disabled)" : "var(--text-tertiary)" } }, description));
  }

  // components/forms/RadioGroup.jsx
  var import_react58 = __toESM(require_react(), 1);
  function RadioGroup({
    label,
    hint,
    error,
    required = false,
    options = [],
    value,
    defaultValue,
    onChange,
    emptyOption,
    name,
    disabled = false,
    children,
    style,
    ...rest
  }) {
    const autoId = import_react58.default.useId();
    const groupName = name || `${autoId}-radio`;
    const items = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
    const [inner, setInner] = import_react58.default.useState(defaultValue ?? value ?? "");
    const selected = onChange ? value ?? "" : inner;
    const commit = (next) => {
      if (onChange) onChange(next);
      else setInner(next);
    };
    if (!label) {
      console.warn('[Meridian] RadioGroup: `label` is required. Without a group name each option is announced with no question \u2014 "First stop, radio button, selected, 1 of 3" tells the user nothing about what is being decided.');
    }
    if (!children && items.length < 2) {
      console.warn("[Meridian] RadioGroup: a one-option radio group cannot be answered any other way, and cannot be cleared. If the choice is yes/no use a single Checkbox or a Switch.");
    }
    if (children && items.length > 0) {
      console.warn("[Meridian] RadioGroup: `options` and `children` are alternatives \u2014 rendering `children` and ignoring `options`.");
    }
    if (items.length > 5) {
      console.warn(`[Meridian] RadioGroup: ${items.length} options. Past five, the set stops being scannable and costs a screen of vertical space for one value \u2014 use <Select> with a <Field>.`);
    }
    if (selected && items.length > 0 && !items.some((o) => o.value === selected)) {
      console.warn(`[Meridian] RadioGroup: value "${selected}" matches no option, so the group renders with nothing selected. A radio set cannot be cleared by the user, so this state is unreachable by hand and usually means a typo or a stale stored value.`);
    }
    return /* @__PURE__ */ import_react58.default.createElement(Fieldset, { ...rest, label, hint, error, required, disabled, style }, /* @__PURE__ */ import_react58.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 0 } }, children || /* @__PURE__ */ import_react58.default.createElement(import_react58.default.Fragment, null, emptyOption && /* @__PURE__ */ import_react58.default.createElement(
      Radio,
      {
        name: groupName,
        value: "",
        label: emptyOption,
        disabled,
        checked: selected === "",
        onChange: () => commit("")
      }
    ), items.map((o) => /* @__PURE__ */ import_react58.default.createElement(
      Radio,
      {
        key: o.value,
        name: groupName,
        value: o.value,
        label: o.label,
        description: o.description,
        disabled: disabled || o.disabled,
        checked: selected === o.value,
        onChange: () => commit(o.value)
      }
    )))));
  }

  // components/forms/RangeSlider.jsx
  var import_react59 = __toESM(require_react(), 1);
  var SIZES13 = {
    sm: { track: "var(--slider-track-height-sm)", thumb: "var(--slider-thumb-size-sm)" },
    md: { track: "var(--slider-track-height-md)", thumb: "var(--slider-thumb-size-md)" }
  };
  var clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  function RangeSlider({
    label,
    value,
    defaultValue,
    min = 0,
    max = 100,
    step: step2 = 1,
    /* The gap the two thumbs may not close. Default 0: they may meet but never
       cross, because a range whose start is past its end is not a state any
       product wants to receive from a control. */
    minDistance = 0,
    unit,
    format,
    showValue = true,
    size = "md",
    disabled = false,
    onChange,
    /* Names for the two thumbs. Each input is a separate control in the tab
       order and announces separately, so "Price" alone would read as two
       identical sliders. */
    startLabel = "Minimum",
    endLabel = "Maximum",
    style,
    ...rest
  }) {
    const autoId = import_react59.default.useId();
    const id = rest.id ?? `${autoId}-range`;
    const trackRef = import_react59.default.useRef(null);
    const dragging = import_react59.default.useRef(null);
    const [inner, setInner] = import_react59.default.useState(() => value ?? defaultValue ?? [min, max]);
    const [focus, setFocus] = import_react59.default.useState(null);
    const [hover, setHover] = import_react59.default.useState(false);
    const s = SIZES13[size] || SIZES13.md;
    const controlled = value != null && typeof onChange === "function";
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] RangeSlider: no accessible name. The thumbs announce as "Minimum, 20" and "Maximum, 80" with nothing to say what they measure \u2014 pass `label`, and each thumb becomes "<label> Minimum" / "<label> Maximum".');
    }
    if (value != null && typeof onChange !== "function") {
      console.warn("[Meridian] RangeSlider: `value` without `onChange` \u2014 neither thumb can move. Pass onChange, or use defaultValue.");
    }
    const pair = controlled ? value : inner;
    const lo = clamp(Math.min(pair[0], pair[1]), min, max);
    const hi = clamp(Math.max(pair[0], pair[1]), min, max);
    const ratio = (n) => max === min ? 0 : (n - min) / (max - min);
    const at = (r) => `calc(${r * 100}% - ${r} * ${s.thumb})`;
    const fmt3 = (n) => format ? format(n) : unit ? `${n}\u2009${unit}` : String(n);
    const commit = (next) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    };
    const setThumb = (which, n) => {
      const v = clamp(Math.round((n - min) / step2) * step2 + min, min, max);
      if (which === 0) commit([Math.min(v, hi - minDistance), hi]);
      else commit([lo, Math.max(v, lo + minDistance)]);
    };
    const valueAt = (clientX) => {
      const el = trackRef.current;
      if (!el) return min;
      const r = el.getBoundingClientRect();
      return min + clamp((clientX - r.left) / r.width, 0, 1) * (max - min);
    };
    const onPointerDown = (e) => {
      if (disabled) return;
      const v = valueAt(e.clientX);
      const which = lo === hi ? v < lo ? 0 : 1 : Math.abs(v - lo) <= Math.abs(v - hi) ? 0 : 1;
      dragging.current = which;
      e.currentTarget.setPointerCapture(e.pointerId);
      setThumb(which, v);
    };
    const onPointerMove = (e) => {
      if (dragging.current == null) return;
      setThumb(dragging.current, valueAt(e.clientX));
    };
    const endDrag = (e) => {
      if (dragging.current == null) return;
      dragging.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
      }
    };
    const fill = disabled ? "var(--slider-fill-disabled)" : hover || focus != null ? "var(--slider-fill-hover)" : "var(--slider-fill)";
    const thumbBorder = (i) => disabled ? "var(--slider-thumb-border-disabled)" : focus === i ? "var(--slider-thumb-border-active)" : "var(--slider-thumb-border)";
    const input = (i, v, name, aMin, aMax) => /* @__PURE__ */ import_react59.default.createElement(
      "input",
      {
        type: "range",
        id: i === 0 ? id : `${id}-end`,
        "aria-label": label ? `${label} ${name}` : name,
        min: aMin,
        max: aMax,
        step: step2,
        value: v,
        disabled,
        onChange: (e) => setThumb(i, Number(e.target.value)),
        "aria-valuetext": fmt3(v),
        onFocus: (e) => {
          if (e.target.matches(":focus-visible")) setFocus(i);
        },
        onBlur: () => setFocus(null),
        style: { position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, pointerEvents: "none" }
      }
    );
    return /* @__PURE__ */ import_react59.default.createElement("span", { style: { display: "flex", flexDirection: "column", gap: "var(--space-2)", minWidth: 0, ...style } }, (label || showValue) && /* @__PURE__ */ import_react59.default.createElement("span", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)" } }, label && /* @__PURE__ */ import_react59.default.createElement("label", { htmlFor: id, style: { fontSize: "var(--text-xs)", color: disabled ? "var(--text-disabled)" : "var(--text-secondary)" } }, label), showValue && /* One reading, not two: "20 – 80" is the value of a range. Two
       separate numbers make the reader assemble the range themselves.
       aria-hidden because both inputs already announce their own. */
    /* @__PURE__ */ import_react59.default.createElement("span", { "aria-hidden": "true", style: { flex: "0 0 auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontVariantNumeric: "var(--numeric-figures)", color: disabled ? "var(--text-disabled)" : "var(--text-primary)" } }, fmt3(lo), "\u2009\u2013\u2009", fmt3(hi))), /* @__PURE__ */ import_react59.default.createElement(
      "span",
      {
        ref: trackRef,
        onPointerDown,
        onPointerMove,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: { position: "relative", display: "block", height: s.thumb, minWidth: 0, touchAction: "none", cursor: disabled ? "not-allowed" : "pointer" }
      },
      /* @__PURE__ */ import_react59.default.createElement("span", { "aria-hidden": "true", style: { position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", height: s.track, background: "var(--slider-track)", borderRadius: "var(--slider-radius)" } }, /* @__PURE__ */ import_react59.default.createElement("span", { style: { position: "absolute", top: 0, bottom: 0, left: `${ratio(lo) * 100}%`, width: `${(ratio(hi) - ratio(lo)) * 100}%`, background: fill, borderRadius: "var(--slider-radius)" } })),
      input(0, lo, startLabel, min, Math.max(min, hi - minDistance)),
      input(1, hi, endLabel, Math.min(max, lo + minDistance), max),
      [[0, lo], [1, hi]].map(([i, v]) => /* @__PURE__ */ import_react59.default.createElement("span", { key: i, "aria-hidden": "true", style: {
        position: "absolute",
        top: "50%",
        left: at(ratio(v)),
        transform: "translateY(-50%)",
        width: s.thumb,
        height: s.thumb,
        borderRadius: "var(--radius-full)",
        background: disabled ? "var(--slider-thumb-disabled)" : "var(--slider-thumb)",
        border: `var(--border-width) solid ${thumbBorder(i)}`,
        boxShadow: focus === i ? "var(--focus-ring)" : "var(--slider-thumb-shadow)"
      } }))
    ));
  }

  // components/forms/Slider.jsx
  var import_react60 = __toESM(require_react(), 1);
  var SIZES14 = {
    sm: { track: "var(--slider-track-height-sm)", thumb: "var(--slider-thumb-size-sm)" },
    md: { track: "var(--slider-track-height-md)", thumb: "var(--slider-thumb-size-md)" }
  };
  var clamp2 = (n, min, max) => Math.min(max, Math.max(min, n));
  function Slider({
    label,
    value,
    defaultValue,
    min = 0,
    max = 100,
    step: step2 = 1,
    unit,
    format,
    showValue = true,
    marks,
    size = "md",
    disabled = false,
    onChange,
    style,
    ...rest
  }) {
    const autoId = import_react60.default.useId();
    const id = rest.id ?? `${autoId}-slider`;
    const [inner, setInner] = import_react60.default.useState(value ?? defaultValue ?? min);
    const [focus, setFocus] = import_react60.default.useState(false);
    const [hover, setHover] = import_react60.default.useState(false);
    const [active, setActive] = import_react60.default.useState(false);
    const s = SIZES14[size] || SIZES14.md;
    const controlled = value != null && typeof onChange === "function";
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] Slider: no accessible name. A bare track announces as "slider, 68" with nothing to say what 68 measures \u2014 pass `label`, or aria-label.');
    }
    if (value != null && typeof onChange !== "function") {
      console.warn("[Meridian] Slider: `value` without `onChange` \u2014 the thumb cannot move. Pass onChange, or use defaultValue for an uncontrolled slider.");
    }
    const v = clamp2(controlled ? value : inner, min, max);
    const ratio = max === min ? 0 : (v - min) / (max - min);
    const pct = ratio * 100;
    const at = (r) => `calc(${r * 100}% - ${r} * ${s.thumb})`;
    const text = format ? format(v) : unit ? `${v}\u2009${unit}` : String(v);
    const handle = (e) => {
      const n = Number(e.target.value);
      if (!controlled) setInner(n);
      onChange?.(e);
    };
    const fill = disabled ? "var(--slider-fill-disabled)" : hover || active ? "var(--slider-fill-hover)" : "var(--slider-fill)";
    const thumbBorder = disabled ? "var(--slider-thumb-border-disabled)" : active ? "var(--slider-thumb-border-active)" : hover ? "var(--slider-thumb-border-hover)" : "var(--slider-thumb-border)";
    const normMarks = (marks || []).map((m) => typeof m === "object" ? m : { value: m });
    return /* @__PURE__ */ import_react60.default.createElement("span", { style: { display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 0, ...style } }, (label || showValue) && /* @__PURE__ */ import_react60.default.createElement("span", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)", minWidth: 0 } }, label ? /* @__PURE__ */ import_react60.default.createElement("label", { htmlFor: id, style: { minWidth: 0, fontSize: "var(--text-sm)", color: disabled ? "var(--text-disabled)" : "var(--slider-label-text)", lineHeight: "var(--leading-snug)", cursor: disabled ? "not-allowed" : "pointer" } }, label) : /* @__PURE__ */ import_react60.default.createElement("span", null), showValue && /* @__PURE__ */ import_react60.default.createElement("span", { "aria-hidden": "true", style: { flex: "0 0 auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontVariantNumeric: "var(--numeric-figures)", color: disabled ? "var(--text-disabled)" : "var(--slider-value-text)" } }, text)), /* @__PURE__ */ import_react60.default.createElement(
      "span",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: { position: "relative", display: "block", minWidth: 0, height: "var(--control-h-sm)" }
      },
      /* @__PURE__ */ import_react60.default.createElement("span", { style: { position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", height: s.track, background: disabled ? "var(--slider-track-disabled)" : "var(--slider-track)", borderRadius: "var(--slider-radius)" } }, /* @__PURE__ */ import_react60.default.createElement("span", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: `calc(${pct}% + ${0.5 - ratio} * ${s.thumb})`, background: fill, borderRadius: "var(--slider-radius)", transition: "var(--transition-tint)" } }), normMarks.map((m) => {
        const r = max === min ? 0 : clamp2((m.value - min) / (max - min), 0, 1);
        return /* @__PURE__ */ import_react60.default.createElement("span", { key: `t${m.value}`, "aria-hidden": "true", style: { position: "absolute", top: 0, bottom: 0, left: `calc(${r * 100}% - ${r} * var(--border-width))`, width: "var(--border-width)", background: "var(--slider-tick)" } });
      })),
      /* @__PURE__ */ import_react60.default.createElement(
        "input",
        {
          ...rest,
          id,
          type: "range",
          min,
          max,
          step: step2,
          value: v,
          disabled,
          onChange: handle,
          "aria-valuetext": text,
          onFocus: (e) => {
            setFocus(e.target.matches(":focus-visible"));
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocus(false);
            setActive(false);
            rest.onBlur?.(e);
          },
          onPointerDown: (e) => {
            setActive(true);
            rest.onPointerDown?.(e);
          },
          onPointerUp: (e) => {
            setActive(false);
            rest.onPointerUp?.(e);
          },
          onKeyDown: (e) => {
            setActive(true);
            rest.onKeyDown?.(e);
          },
          onKeyUp: (e) => {
            setActive(false);
            rest.onKeyUp?.(e);
          },
          style: { position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: disabled ? "not-allowed" : "pointer" }
        }
      ),
      /* @__PURE__ */ import_react60.default.createElement("span", { "aria-hidden": "true", style: {
        position: "absolute",
        top: "50%",
        left: at(ratio),
        width: s.thumb,
        height: s.thumb,
        transform: "translateY(-50%)",
        background: disabled ? "var(--slider-thumb-disabled)" : "var(--slider-thumb)",
        border: `var(--border-width) solid ${thumbBorder}`,
        borderRadius: "var(--slider-radius)",
        boxShadow: focus ? "var(--input-focus-ring)" : disabled ? "none" : "var(--slider-thumb-shadow)",
        transition: "var(--transition-control)",
        pointerEvents: "none"
      } })
    ), normMarks.some((m) => m.label != null) && /* @__PURE__ */ import_react60.default.createElement("span", { "aria-hidden": "true", style: { position: "relative", display: "block", height: 14, minWidth: 0 } }, normMarks.filter((m) => m.label != null).map((m) => {
      const r = max === min ? 0 : clamp2((m.value - min) / (max - min), 0, 1);
      return /* @__PURE__ */ import_react60.default.createElement("span", { key: `l${m.value}`, style: { position: "absolute", top: 0, left: `${r * 100}%`, transform: `translateX(-${r * 100}%)`, whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: disabled ? "var(--text-disabled)" : "var(--slider-tick-label)" } }, m.label);
    })));
  }

  // components/forms/Switch.jsx
  var import_react61 = __toESM(require_react(), 1);
  var SIZES15 = { sm: { w: 28, h: 16, k: 12 }, md: { w: 34, h: 20, k: 16 } };
  function Switch({
    label,
    description,
    checked = false,
    disabled = false,
    size = "md",
    onChange,
    style,
    ...rest
  }) {
    const autoId = import_react61.default.useId();
    const descId = description ? `${autoId}-desc` : void 0;
    const [focus, setFocus] = import_react61.default.useState(false);
    const [hover, setHover] = import_react61.default.useState(false);
    const s = SIZES15[size] || SIZES15.md;
    if (!label && rest["aria-label"] == null && rest["aria-labelledby"] == null) {
      console.warn('[Meridian] Switch: no accessible name. A bare track announces as "switch, off" with nothing to say what it controls \u2014 pass `label`, or aria-label.');
    }
    const track = disabled ? "var(--switch-track-disabled)" : checked ? hover ? "var(--switch-track-checked-hover)" : "var(--switch-track-checked)" : "var(--switch-track)";
    const border = disabled ? "var(--switch-border-disabled)" : checked ? hover ? "var(--switch-border-checked-hover)" : "var(--switch-border-checked)" : hover ? "var(--switch-border-hover)" : "var(--switch-border)";
    return /* @__PURE__ */ import_react61.default.createElement("span", { style: { display: "inline-flex", flexDirection: "column", gap: 2, minWidth: 0, ...style } }, /* @__PURE__ */ import_react61.default.createElement(
      "label",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-3)",
          minHeight: "var(--control-h-sm)",
          cursor: disabled ? "not-allowed" : "pointer",
          minWidth: 0
        }
      },
      /* @__PURE__ */ import_react61.default.createElement(
        "input",
        {
          type: "checkbox",
          role: "switch",
          ...rest,
          ...onChange ? { checked } : { defaultChecked: checked, readOnly: true },
          disabled,
          "aria-describedby": rest["aria-describedby"] ?? descId,
          onChange,
          onFocus: (e) => {
            setFocus(e.target.matches(":focus-visible"));
            rest.onFocus?.(e);
          },
          onBlur: (e) => {
            setFocus(false);
            rest.onBlur?.(e);
          },
          style: { position: "absolute", opacity: 0, width: 0, height: 0 }
        }
      ),
      /* @__PURE__ */ import_react61.default.createElement("span", { style: {
        position: "relative",
        flex: "0 0 auto",
        width: s.w,
        height: s.h,
        background: track,
        border: `var(--border-width) solid ${border}`,
        borderRadius: "var(--radius-pill)",
        boxShadow: focus ? "var(--input-focus-ring)" : "none",
        transition: "var(--transition-control)"
      } }, /* @__PURE__ */ import_react61.default.createElement("span", { style: {
        position: "absolute",
        top: (s.h - 2 - s.k) / 2,
        left: 1,
        width: s.k,
        height: s.k,
        /* Off, the white knob sits on a 1.60:1 track, so it carries its own
           hairline; on, it sits on action blue at 6.98:1 and needs none. */
        background: disabled ? "var(--switch-knob-disabled)" : "var(--switch-knob)",
        border: checked || disabled ? "0" : `var(--border-width) solid var(--switch-knob-border)`,
        borderRadius: "var(--radius-pill)",
        boxShadow: disabled ? "none" : "var(--switch-knob-shadow)",
        /* transform, not `left` — the system animates only opacity,
           transform, colour and shadow. */
        transform: `translateX(${checked ? s.w - 2 - s.k - 2 : 0}px)`,
        transition: "transform var(--duration-fast) var(--ease-out),background-color var(--duration-fast) var(--ease-out)"
      } })),
      label && /* @__PURE__ */ import_react61.default.createElement("span", { style: { minWidth: 0, fontSize: "var(--text-sm)", color: disabled ? "var(--text-disabled)" : "var(--text-primary)", lineHeight: "var(--leading-snug)" } }, label)
    ), description && /* @__PURE__ */ import_react61.default.createElement("span", { id: descId, style: { marginLeft: s.w + 12, fontSize: "var(--text-xs)", color: disabled ? "var(--text-disabled)" : "var(--text-tertiary)" } }, description));
  }

  // components/forms/Textarea.jsx
  var import_react62 = __toESM(require_react(), 1);
  var PY = { sm: "var(--space-1)", md: "var(--space-2)", lg: "var(--space-3)" };
  var PX8 = { sm: "var(--control-px-sm)", md: "var(--control-px-md)", lg: "var(--control-px-lg)" };
  var FS6 = { sm: "var(--text-xs)", md: "var(--text-sm)", lg: "var(--text-lg)" };
  function Textarea({
    rows = 4,
    size = "md",
    invalid = false,
    mono = false,
    disabled = false,
    readOnly = false,
    resize = "vertical",
    style,
    ...rest
  }) {
    const field = import_react62.default.useContext(FieldContext);
    const [focus, setFocus] = import_react62.default.useState(false);
    const [hover, setHover] = import_react62.default.useState(false);
    const id = rest.id ?? field?.id;
    const describedBy = rest["aria-describedby"] ?? field?.describedBy;
    const isInvalid = invalid || !!field?.invalid;
    const named = id != null || rest["aria-label"] != null || rest["aria-labelledby"] != null;
    if (!named) {
      console.warn('[Meridian] Textarea: no accessible name. A placeholder is not a label \u2014 it disappears on the first keystroke. Wrap the control in <Field label="\u2026"> (which wires the id automatically) or pass aria-label.');
    }
    if (isInvalid && !describedBy) {
      console.warn('[Meridian] Textarea: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing \u2014 pass the message through <Field error="\u2026">.');
    }
    if (resize === "both") {
      console.warn('[Meridian] Textarea: resize="both" lets the user drag the control out of its form column and over whatever sits beside it. Rendering resize="vertical" instead \u2014 height is the only dimension worth dragging.');
      resize = "vertical";
    }
    const border = isInvalid ? "var(--input-border-invalid)" : focus ? "var(--input-border-focus)" : hover && !disabled ? "var(--input-border-hover)" : "var(--input-border)";
    return /* @__PURE__ */ import_react62.default.createElement(
      "textarea",
      {
        ...rest,
        rows,
        disabled,
        readOnly,
        id,
        "aria-describedby": describedBy,
        "aria-invalid": isInvalid || void 0,
        "aria-required": field?.required || void 0,
        spellCheck: rest.spellCheck ?? !mono,
        autoCapitalize: rest.autoCapitalize ?? (mono ? "off" : void 0),
        autoCorrect: rest.autoCorrect ?? (mono ? "off" : void 0),
        onMouseEnter: (e) => {
          setHover(true);
          rest.onMouseEnter?.(e);
        },
        onMouseLeave: (e) => {
          setHover(false);
          rest.onMouseLeave?.(e);
        },
        onFocus: (e) => {
          setFocus(true);
          rest.onFocus?.(e);
        },
        onBlur: (e) => {
          setFocus(false);
          rest.onBlur?.(e);
        },
        style: {
          width: "100%",
          /* The resize handle can otherwise be dragged down to a one-line
             sliver, which no longer reads as a multi-line control. */
          minHeight: "var(--control-h-md)",
          padding: `${PY[size] || PY.md} ${PX8[size] || PX8.md}`,
          fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
          fontSize: FS6[size] || FS6.md,
          lineHeight: "var(--leading-normal)",
          letterSpacing: mono ? "var(--tracking-mono)" : "var(--tracking-body)",
          color: disabled ? "var(--input-text-disabled)" : "var(--input-text)",
          background: disabled ? "var(--input-background-disabled)" : readOnly ? "var(--surface-sunken)" : "var(--input-background)",
          border: `var(--border-width) solid ${border}`,
          borderRadius: "var(--input-radius)",
          boxShadow: focus ? isInvalid ? "var(--input-focus-ring-invalid)" : "var(--input-focus-ring)" : "none",
          outline: "none",
          cursor: disabled ? "not-allowed" : "text",
          resize,
          transition: "var(--transition-control)",
          ...style
        }
      }
    );
  }

  // components/navigation/Breadcrumb.jsx
  var import_react63 = __toESM(require_react(), 1);
  var SIZES16 = {
    sm: { text: "var(--text-2xs)", icon: 12, sep: 12, gap: 5 },
    md: { text: "var(--text-xs)", icon: 14, sep: 14, gap: 6 }
  };
  var norm5 = (raw) => typeof raw === "string" ? { label: raw } : raw;
  function Crumb({ item, size, current }) {
    const [hover, setHover] = import_react63.default.useState(false);
    const [focus, setFocus] = import_react63.default.useState(false);
    const s = SIZES16[size] || SIZES16.md;
    const body = /* @__PURE__ */ import_react63.default.createElement(import_react63.default.Fragment, null, item.icon && /* @__PURE__ */ import_react63.default.createElement(Icon, { name: item.icon, size: s.icon, style: { color: current ? "var(--breadcrumb-text-current)" : "var(--breadcrumb-icon)" } }), item.label ? /* @__PURE__ */ import_react63.default.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, item.label) : null);
    const shared = {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--icon-gap-tight)",
      fontFamily: "var(--font-sans)",
      fontSize: s.text,
      letterSpacing: "var(--tracking-body)",
      maxWidth: 220,
      minWidth: 0
    };
    if (current) {
      return (
        /* aria-current, not a disabled link: the crumb is the page title in
           miniature, so it is text, and it is the only crumb in --weight-medium. */
        /* @__PURE__ */ import_react63.default.createElement("span", { "aria-current": "page", style: { ...shared, color: "var(--breadcrumb-text-current)", fontWeight: "var(--weight-medium)" } }, body)
      );
    }
    return /* @__PURE__ */ import_react63.default.createElement(
      "a",
      {
        href: item.href,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onFocus: (e) => setFocus(e.target.matches(":focus-visible")),
        onBlur: () => setFocus(false),
        style: {
          ...shared,
          color: hover ? "var(--breadcrumb-text-hover)" : "var(--breadcrumb-text)",
          textDecoration: hover ? "underline" : "none",
          textUnderlineOffset: 2,
          borderRadius: "var(--radius-xs)",
          boxShadow: focus ? "var(--breadcrumb-focus-ring)" : "none",
          outline: "none",
          transition: "color var(--duration-fast) var(--ease-out)"
        }
      },
      body
    );
  }
  function Sep({ size, variant }) {
    const s = SIZES16[size] || SIZES16.md;
    if (variant === "slash") {
      return /* @__PURE__ */ import_react63.default.createElement("span", { "aria-hidden": "true", style: { color: "var(--breadcrumb-separator)", fontSize: s.text, userSelect: "none" } }, "/");
    }
    return /* @__PURE__ */ import_react63.default.createElement(Icon, { name: "chevron-right", size: s.sep, style: { color: "var(--breadcrumb-separator)" } });
  }
  function Breadcrumb({
    items = [],
    size = "md",
    variant = "chevron",
    maxItems = 4,
    label = "Breadcrumb",
    onNavigate,
    style,
    ...rest
  }) {
    const s = SIZES16[size] || SIZES16.md;
    const rows = items.map(norm5).filter(Boolean);
    import_react63.default.useEffect(() => {
      const missing = rows.slice(0, -1).filter((r) => !r.href).length;
      if (missing) console.warn(`[Meridian] Breadcrumb: ${missing} ancestor crumb(s) have no href. Every crumb except the last must be a real link \u2014 a trail you cannot climb is decoration.`);
    }, [rows.length]);
    let head = rows;
    let hidden = [];
    let tail = [];
    if (rows.length > maxItems && maxItems >= 3) {
      head = rows.slice(0, 1);
      tail = rows.slice(-2);
      hidden = rows.slice(1, -2);
    }
    const visible = [...head, ...hidden.length ? ["overflow"] : [], ...tail];
    return /* @__PURE__ */ import_react63.default.createElement("nav", { "aria-label": label, "data-breadcrumb": variant, ...rest, style: { minWidth: 0, ...style } }, /* @__PURE__ */ import_react63.default.createElement("ol", { style: { display: "flex", alignItems: "center", gap: s.gap, margin: 0, padding: 0, listStyle: "none", minWidth: 0 } }, visible.map((entry, i) => {
      const last = i === visible.length - 1;
      const key = entry === "overflow" ? "overflow" : `${entry.href || ""}-${i}`;
      return /* @__PURE__ */ import_react63.default.createElement("li", { key, style: { display: "flex", alignItems: "center", gap: s.gap, minWidth: 0 } }, entry === "overflow" ? /* @__PURE__ */ import_react63.default.createElement(
        Menu,
        {
          label: "Skipped levels",
          size: "sm",
          items: hidden.map((h) => ({
            label: h.label,
            icon: h.icon,
            /* Menu rows are commands, not links, so the skipped
               levels navigate through a handler. SPAs pass
               onNavigate to keep it inside the router. */
            onSelect: () => onNavigate ? onNavigate(h) : h.href && window.location.assign(h.href)
          })),
          trigger: /* @__PURE__ */ import_react63.default.createElement(
            "button",
            {
              type: "button",
              "aria-label": `Show ${hidden.length} skipped level${hidden.length === 1 ? "" : "s"}`,
              style: {
                display: "inline-flex",
                alignItems: "center",
                height: 18,
                padding: "0 4px",
                border: 0,
                background: "transparent",
                color: "var(--breadcrumb-overflow-text)",
                fontFamily: "var(--font-sans)",
                fontSize: s.text,
                borderRadius: "var(--radius-xs)",
                cursor: "pointer",
                transition: "var(--transition-control)"
              }
            },
            "\u2026"
          )
        }
      ) : /* @__PURE__ */ import_react63.default.createElement(Crumb, { item: entry, size, current: last }), !last && /* @__PURE__ */ import_react63.default.createElement(Sep, { size, variant }));
    })));
  }

  // components/navigation/Tabs.jsx
  var import_react64 = __toESM(require_react(), 1);
  var SIZES17 = {
    sm: { underlineH: 32, pillH: 24, px: 8, text: "var(--text-xs)", icon: 14, gap: 5, pad: 2 },
    md: { underlineH: 36, pillH: 26, px: 10, text: "var(--text-sm)", icon: 14, gap: 6, pad: 3 }
  };
  var norm6 = (raw) => typeof raw === "string" ? { value: raw, label: raw } : raw;
  function Tab({ item, active, variant, size, idBase, fitted, activation, onSelect, tabRef, onKeyDown }) {
    const [hover, setHover] = import_react64.default.useState(false);
    const [focus, setFocus] = import_react64.default.useState(false);
    const s = SIZES17[size] || SIZES17.md;
    const underline = variant === "underline";
    const disabled = !!item.disabled;
    return /* @__PURE__ */ import_react64.default.createElement(
      "button",
      {
        type: "button",
        role: "tab",
        id: idBase ? `${idBase}-tab-${item.value}` : void 0,
        "aria-selected": active,
        "aria-controls": idBase ? `${idBase}-panel-${item.value}` : void 0,
        "aria-disabled": disabled || void 0,
        tabIndex: active ? 0 : -1,
        disabled,
        ref: tabRef,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onFocus: (e) => {
          setFocus(e.target.matches(":focus-visible"));
          if (activation === "automatic" && !disabled && !active) onSelect(item.value);
        },
        onBlur: () => setFocus(false),
        onKeyDown,
        onClick: () => !disabled && onSelect(item.value),
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: s.gap,
          flex: fitted ? "1 1 0" : "0 0 auto",
          minWidth: 0,
          height: underline ? s.underlineH : s.pillH,
          padding: underline ? "0 2px" : `0 ${s.px}px`,
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: s.text,
          fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
          letterSpacing: "var(--tracking-body)",
          color: disabled ? "var(--tab-text-disabled)" : active ? "var(--tab-text-active)" : hover ? "var(--tab-text-hover)" : "var(--tab-text)",
          background: underline ? "transparent" : active ? "var(--tab-pill-background-active)" : hover && !disabled ? "var(--tab-pill-background-hover)" : "transparent",
          border: 0,
          borderBottom: underline ? `var(--border-width-emphasis) solid ${active ? "var(--tab-indicator)" : hover && !disabled ? "var(--tab-indicator-hover)" : "transparent"}` : 0,
          borderRadius: underline ? 0 : "var(--radius-xs)",
          boxShadow: focus ? "var(--tab-focus-ring)" : !underline && active ? "var(--tab-pill-shadow-active)" : "none",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "var(--transition-control)",
          whiteSpace: "nowrap",
          position: "relative",
          zIndex: focus ? 1 : void 0
        }
      },
      item.icon && /* @__PURE__ */ import_react64.default.createElement(Icon, { name: item.icon, size: s.icon, style: { color: disabled ? "var(--tab-text-disabled)" : active ? "var(--tab-icon-active)" : "var(--tab-icon)" } }),
      /* @__PURE__ */ import_react64.default.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis" } }, item.label),
      item.count != null && /* @__PURE__ */ import_react64.default.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: disabled ? "var(--tab-text-disabled)" : active ? "var(--tab-count-text-active)" : "var(--tab-count-text)" } }, item.count)
    );
  }
  function Tabs({
    items = [],
    value,
    onChange,
    variant = "underline",
    size = "md",
    label,
    idBase,
    fitted = false,
    activation = "automatic",
    style,
    ...rest
  }) {
    const underline = variant === "underline";
    const s = SIZES17[size] || SIZES17.md;
    const rows = items.map(norm6).filter(Boolean);
    const refs = import_react64.default.useRef([]);
    const scroller = import_react64.default.useRef(null);
    import_react64.default.useEffect(() => {
      if (!label) console.warn('[Meridian] Tabs: no `label` \u2014 the tablist has no accessible name. Say what the tabs switch between ("Alarm state").');
    }, [label]);
    import_react64.default.useEffect(() => {
      const i = rows.findIndex((r) => r.value === value);
      const el = refs.current[i];
      const box = scroller.current;
      if (!el || !box || box.scrollWidth <= box.clientWidth) return;
      const left = el.offsetLeft;
      const right = left + el.offsetWidth;
      if (left < box.scrollLeft) box.scrollTo({ left: left - 16, behavior: "auto" });
      else if (right > box.scrollLeft + box.clientWidth) box.scrollTo({ left: right - box.clientWidth + 16, behavior: "auto" });
    }, [value, rows.length]);
    const focusAt = (from, dir) => {
      const n = rows.length;
      for (let step2 = 1; step2 <= n; step2 += 1) {
        const i = (from + dir * step2 + n * step2) % n;
        if (!rows[i].disabled && refs.current[i]) {
          refs.current[i].focus();
          return;
        }
      }
    };
    const focusEdge = (dir) => {
      const order = dir > 0 ? rows.map((_, i) => i) : rows.map((_, i) => rows.length - 1 - i);
      for (const i of order) if (!rows[i].disabled && refs.current[i]) {
        refs.current[i].focus();
        return;
      }
    };
    const keyDown = (index) => (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        focusAt(index, 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusAt(index, -1);
      } else if (e.key === "Home") {
        e.preventDefault();
        focusEdge(1);
      } else if (e.key === "End") {
        e.preventDefault();
        focusEdge(-1);
      } else if ((e.key === "Enter" || e.key === " ") && activation === "manual") {
        e.preventDefault();
        if (!rows[index].disabled) onChange(rows[index].value);
      }
    };
    return /* @__PURE__ */ import_react64.default.createElement(
      "div",
      {
        ref: scroller,
        role: "tablist",
        "aria-label": label,
        "aria-orientation": "horizontal",
        "data-tabs": variant,
        ...rest,
        style: {
          display: "flex",
          alignItems: "center",
          gap: underline ? "var(--space-5)" : 2,
          padding: underline ? 0 : s.pad,
          background: underline ? "transparent" : "var(--tabs-pill-background)",
          border: underline ? 0 : "var(--border-width) solid var(--tabs-pill-border)",
          borderBottom: underline ? "var(--border-width) solid var(--tabs-border)" : void 0,
          borderRadius: underline ? 0 : "var(--radius-md)",
          width: underline || fitted ? "100%" : "fit-content",
          maxWidth: "100%",
          overflowX: "auto",
          scrollbarWidth: "none",
          /* The bar scrolls and its scrollbar is hidden, which until now left
             NO cue that there were tabs off-screen. The fade is a mask rather
             than the colour-gradient overlay --tabs-scroll-fade presumed: an
             overlay would need a wrapper element and would paint over the pill
             variant's own background, whereas a mask fades to whatever is
             actually behind and works on both variants. The token was the
             wrong shape for the fix and was removed. */
          maskImage: "linear-gradient(to right, transparent 0, #000 var(--space-4), #000 calc(100% - var(--space-4)), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 var(--space-4), #000 calc(100% - var(--space-4)), transparent 100%)",
          ...style
        }
      },
      rows.map((item, i) => /* @__PURE__ */ import_react64.default.createElement(
        Tab,
        {
          key: item.value,
          item,
          active: item.value === value,
          variant,
          size,
          idBase,
          fitted,
          activation,
          onSelect: onChange,
          tabRef: (el) => {
            refs.current[i] = el;
          },
          onKeyDown: keyDown(i)
        }
      ))
    );
  }
  function TabPanel({ idBase, value, active = true, children, style, ...rest }) {
    return /* @__PURE__ */ import_react64.default.createElement(
      "div",
      {
        id: `${idBase}-panel-${value}`,
        role: "tabpanel",
        "aria-labelledby": `${idBase}-tab-${value}`,
        tabIndex: 0,
        hidden: !active || void 0,
        ...rest,
        style: { outline: "none", minWidth: 0, ...style }
      },
      children
    );
  }

  // components/primitives/AspectRatio.jsx
  var import_react65 = __toESM(require_react(), 1);
  var NAMED = { square: 1, video: 16 / 9, wide: 21 / 9, portrait: 3 / 4, photo: 4 / 3, golden: 1.618 };
  function AspectRatio({ ratio = "video", radius = "md", background, children, style, ...rest }) {
    const r = typeof ratio === "number" ? ratio : NAMED[ratio] != null ? NAMED[ratio] : String(ratio).indexOf("/") > -1 ? Number(String(ratio).split("/")[0]) / Number(String(ratio).split("/")[1]) : 16 / 9;
    return /* @__PURE__ */ import_react65.default.createElement(
      "div",
      {
        ...rest,
        style: {
          position: "relative",
          width: "100%",
          aspectRatio: String(r),
          overflow: "hidden",
          borderRadius: rad(radius),
          background: col(background),
          ...style
        }
      },
      /* @__PURE__ */ import_react65.default.createElement("div", { style: { position: "absolute", inset: 0, display: "flex" } }, children)
    );
  }

  // components/primitives/Container.jsx
  var import_react66 = __toESM(require_react(), 1);
  var SIZES18 = { sm: "var(--container-sm)", md: "var(--container-md)", lg: "var(--container-lg)", xl: "var(--container-xl)", full: "100%" };
  function Container({ as: Tag2 = "div", size = "lg", gutter = true, py, center = true, children, style, ...rest }) {
    return /* @__PURE__ */ import_react66.default.createElement(
      Tag2,
      {
        ...rest,
        style: {
          boxSizing: "border-box",
          width: "100%",
          maxWidth: SIZES18[size] || SIZES18.lg,
          marginInline: center ? "auto" : void 0,
          paddingInline: gutter ? "var(--grid-margin)" : void 0,
          paddingBlock: sp(py),
          minWidth: 0,
          ...style
        }
      },
      children
    );
  }

  // components/primitives/Grid.jsx
  var import_react67 = __toESM(require_react(), 1);
  function Grid({
    as: Tag2 = "div",
    columns = "responsive",
    minItemWidth = 240,
    gap,
    rowGap,
    columnGap,
    align,
    justify,
    children,
    style,
    ...rest
  }) {
    const track = columns === "responsive" ? "repeat(var(--grid-columns), minmax(0, 1fr))" : columns === "fluid" ? "repeat(auto-fit, minmax(min(" + (typeof minItemWidth === "number" ? minItemWidth + "px" : minItemWidth) + ", 100%), 1fr))" : typeof columns === "number" ? "repeat(" + columns + ", minmax(0, 1fr))" : columns;
    const g = gap == null ? "var(--grid-gutter)" : sp(gap);
    return /* @__PURE__ */ import_react67.default.createElement(
      Tag2,
      {
        ...rest,
        style: {
          display: "grid",
          gridTemplateColumns: track,
          gap: g,
          rowGap: sp(rowGap),
          columnGap: sp(columnGap),
          alignItems: align,
          justifyItems: justify,
          minWidth: 0,
          ...style
        }
      },
      children
    );
  }
  function GridItem({ as: Tag2 = "div", span = 1, start, rowSpan, children, style, ...rest }) {
    return /* @__PURE__ */ import_react67.default.createElement(
      Tag2,
      {
        ...rest,
        style: {
          gridColumn: start != null ? start + " / span " + span : "span " + span + " / span " + span,
          gridRow: rowSpan ? "span " + rowSpan + " / span " + rowSpan : void 0,
          minWidth: 0,
          ...style
        }
      },
      children
    );
  }

  // components/primitives/Heading.jsx
  var import_react68 = __toESM(require_react(), 1);
  var LEVEL_SIZE = { 1: "3xl", 2: "2xl", 3: "xl", 4: "lg", 5: "md", 6: "sm" };
  var MEASURE2 = { prose: "var(--measure-prose)", narrow: "var(--measure-narrow)", hint: "var(--measure-hint)" };
  function Heading({
    level = 2,
    as,
    size,
    weight = "semibold",
    tone = "primary",
    display = false,
    align,
    measure,
    truncate = false,
    children,
    style,
    ...rest
  }) {
    const Tag2 = as || "h" + level;
    const resolved2 = size || (display ? "display-md" : LEVEL_SIZE[level] || "xl");
    const isDisplay = /^display-/.test(resolved2);
    return /* @__PURE__ */ import_react68.default.createElement(
      Tag2,
      {
        ...rest,
        style: {
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: fontSize(resolved2),
          fontWeight: weight === "semibold" ? "var(--weight-semibold)" : "var(--weight-" + weight + ")",
          lineHeight: isDisplay ? "var(--leading-display)" : "var(--leading-tight)",
          letterSpacing: isDisplay ? "var(--tracking-display)" : "var(--tracking-heading)",
          color: col("text-" + tone),
          textAlign: align,
          maxWidth: MEASURE2[measure] || measure,
          textWrap: "balance",
          ...truncate ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } : null,
          ...style
        }
      },
      children
    );
  }

  // components/primitives/Image.jsx
  var import_react69 = __toESM(require_react(), 1);
  function Placeholder({ label }) {
    return /* @__PURE__ */ import_react69.default.createElement(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "repeating-linear-gradient(135deg, var(--surface-sunken) 0 8px, var(--surface-card) 8px 16px)",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--code-size)",
          textAlign: "center",
          padding: "var(--space-3)"
        }
      },
      label || "image"
    );
  }
  function Image2({
    src,
    alt = "",
    ratio,
    fit = "cover",
    position = "center",
    radius = "md",
    background = "surface-sunken",
    loading = "lazy",
    placeholder,
    width,
    height,
    style,
    ...rest
  }) {
    const { show, onError } = useImageFallback(src);
    const img = show ? /* @__PURE__ */ import_react69.default.createElement(
      "img",
      {
        src,
        alt,
        loading,
        decoding: "async",
        onError,
        ...rest,
        style: {
          display: "block",
          width: "100%",
          height: ratio ? "100%" : height ? "100%" : "auto",
          objectFit: fit,
          objectPosition: position,
          borderRadius: ratio ? void 0 : rad(radius),
          background: col(background),
          ...ratio ? null : style
        }
      }
    ) : null;
    if (ratio) {
      return /* @__PURE__ */ import_react69.default.createElement(AspectRatio, { ratio, radius, background, style: { width, ...style } }, img, !show && /* @__PURE__ */ import_react69.default.createElement(Placeholder, { label: placeholder || alt }));
    }
    if (!show) {
      return /* @__PURE__ */ import_react69.default.createElement("div", { style: { position: "relative", width: width || "100%", height: height || 160, borderRadius: rad(radius), overflow: "hidden", ...style } }, /* @__PURE__ */ import_react69.default.createElement(Placeholder, { label: placeholder || alt }));
    }
    return img;
  }

  // components/primitives/Spacer.jsx
  var import_react70 = __toESM(require_react(), 1);
  function Spacer({ size, axis = "vertical", grow = false, style, ...rest }) {
    if (grow) return /* @__PURE__ */ import_react70.default.createElement("div", { "aria-hidden": "true", ...rest, style: { flex: "1 1 auto", ...style } });
    const v = sp(size == null ? 4 : size);
    return /* @__PURE__ */ import_react70.default.createElement(
      "div",
      {
        "aria-hidden": "true",
        ...rest,
        style: {
          flex: "0 0 auto",
          width: axis === "horizontal" ? v : void 0,
          height: axis === "vertical" ? v : void 0,
          ...style
        }
      }
    );
  }

  // components/primitives/Stack.jsx
  var import_react71 = __toESM(require_react(), 1);
  function Stack({
    as: Tag2 = "div",
    direction = "column",
    gap = 4,
    align,
    justify,
    wrap = false,
    inline = false,
    grow,
    fill = false,
    children,
    style,
    ...rest
  }) {
    return /* @__PURE__ */ import_react71.default.createElement(
      Tag2,
      {
        ...rest,
        style: {
          display: inline ? "inline-flex" : "flex",
          flexDirection: direction,
          gap: sp(gap),
          alignItems: align || (direction === "row" ? "center" : void 0),
          justifyContent: justify,
          flexWrap: wrap ? "wrap" : void 0,
          flexGrow: grow != null ? Number(grow) : void 0,
          height: fill ? "100%" : void 0,
          minWidth: 0,
          ...style
        }
      },
      children
    );
  }

  // components/primitives/Surface.jsx
  var import_react72 = __toESM(require_react(), 1);
  var TONES5 = {
    card: { bg: "surface-card", fg: "text-primary", border: "default" },
    sunken: { bg: "surface-sunken", fg: "text-primary", border: "subtle" },
    raised: { bg: "surface-raised", fg: "text-primary", border: "default" },
    overlay: { bg: "surface-overlay", fg: "text-primary", border: "default" },
    selected: { bg: "surface-selected", fg: "text-primary", border: "focus" },
    inverse: { bg: "surface-inverse", fg: "text-inverse", border: "inverse" }
  };
  function Surface({
    as: Tag2 = "div",
    tone = "card",
    elevation = 0,
    padding = "none",
    radius = "md",
    border = true,
    interactive = false,
    fill = false,
    children,
    style,
    ...rest
  }) {
    const [hover, setHover] = import_react72.default.useState(false);
    const t = TONES5[tone] || TONES5.card;
    const pad2 = padding === "none" ? void 0 : padding === "sm" ? 4 : padding === "lg" ? 8 : 6;
    const bg = interactive && hover && tone !== "inverse" ? "surface-hover" : t.bg;
    return /* @__PURE__ */ import_react72.default.createElement(
      Tag2,
      {
        onMouseEnter: interactive ? () => setHover(true) : void 0,
        onMouseLeave: interactive ? () => setHover(false) : void 0,
        ...rest,
        style: {
          boxSizing: "border-box",
          background: col(bg),
          color: col(t.fg),
          border: border ? hairline(t.border) : void 0,
          borderRadius: rad(radius),
          boxShadow: shadow(elevation),
          padding: sp(pad2),
          height: fill ? "100%" : void 0,
          minWidth: 0,
          cursor: interactive ? "pointer" : void 0,
          transition: "var(--transition-control)",
          ...style
        }
      },
      children
    );
  }

  // components/data/BarChart.jsx
  var import_react73 = __toESM(require_react(), 1);

  // components/data/viz-core.js
  var VIZ_COLORS = [
    "var(--viz-1, #2563eb)",
    "var(--viz-2, #0d9488)",
    "var(--viz-3, #d97706)",
    "var(--viz-4, #7c3aed)",
    "var(--viz-5, #db2777)",
    "var(--viz-6, #4b5563)"
  ];
  var VIZ_SEMANTIC_COLORS = {
    critical: "var(--status-critical-solid, #ef4444)",
    warning: "var(--status-warning-solid, #f59e0b)",
    success: "var(--status-success-solid, #10b981)",
    info: "var(--action-solid, #2563eb)",
    neutral: "var(--border-strong, #64748b)"
  };
  var PATTERN_PRESETS = [
    { id: "pat-diagonal", name: "Diagonal Lines", transform: "rotate(45 0 0)", strokeWidth: 1.5, stroke: "rgba(255,255,255,0.35)" },
    { id: "pat-dots", name: "Stippled Dots", type: "circle", r: 1.2, fill: "rgba(255,255,255,0.45)" },
    { id: "pat-cross", name: "Crosshatch", strokeWidth: 1, stroke: "rgba(255,255,255,0.35)" },
    { id: "pat-horizontal", name: "Horizontal Stripe", strokeWidth: 1.5, stroke: "rgba(255,255,255,0.35)" },
    { id: "pat-vertical", name: "Vertical Stripe", strokeWidth: 1.5, stroke: "rgba(255,255,255,0.35)" },
    { id: "pat-mesh", name: "Diamond Mesh", transform: "rotate(45 0 0)", strokeWidth: 1, stroke: "rgba(255,255,255,0.3)" }
  ];
  var POINT_SYMBOLS = ["circle", "square", "diamond", "triangle", "cross", "star"];
  function formatVizValue(val, unit = "", locale = "en-IN") {
    if (val == null || typeof val === "number" && isNaN(val)) return "\u2014";
    const num = Number(val);
    if (unit === "\u20B9" || unit === "INR") {
      return `\u20B9${num.toLocaleString(locale)}`;
    }
    if (unit === "%") {
      return `${num.toFixed(1)}%`;
    }
    if (unit === "lakh" || unit === "L") {
      return `\u20B9${(num / 1e5).toFixed(2)}L`;
    }
    if (unit === "crore" || unit === "Cr") {
      return `\u20B9${(num / 1e7).toFixed(2)}Cr`;
    }
    const formatted = num.toLocaleString(locale);
    return unit ? `${formatted} ${unit}` : formatted;
  }
  var LAYER_STACK = {
    BACKGROUND: 0,
    GRIDLINES_AND_BANDS: 10,
    MARKS_AND_FILLS: 20,
    REFERENCE_TARGETS: 30,
    ANNOTATIONS_AND_CROSSHAIR: 40,
    TOOLTIP_AND_OVERLAYS: 50
  };
  function createPlotRegion({
    containerWidth = 600,
    containerHeight = 300,
    margins = { top: 16, right: 24, bottom: 36, left: 54 }
  }) {
    const width = Math.max(10, containerWidth - margins.left - margins.right);
    const height = Math.max(10, containerHeight - margins.top - margins.bottom);
    return {
      containerWidth,
      containerHeight,
      margins,
      plotWidth: width,
      plotHeight: height,
      bounds: {
        left: margins.left,
        top: margins.top,
        right: margins.left + width,
        bottom: margins.top + height
      },
      toPlotX: (canvasX) => canvasX - margins.left,
      toPlotY: (canvasY) => canvasY - margins.top,
      toCanvasX: (plotX) => plotX + margins.left,
      toCanvasY: (plotY) => plotY + margins.top
    };
  }
  function createBandScale({
    domain = [],
    range = [0, 100],
    paddingInner = 0.2,
    paddingOuter = 0.1,
    align = 0.5
  }) {
    const [r0, r1] = range;
    const rangeSpan = r1 - r0;
    const n = domain.length;
    if (n === 0) {
      const fn = () => r0;
      fn.bandwidth = () => 0;
      fn.step = () => 0;
      fn.domain = () => [];
      fn.range = () => range;
      return fn;
    }
    const step2 = rangeSpan / Math.max(1, n - paddingInner + 2 * paddingOuter);
    const start = r0 + step2 * paddingOuter;
    const bandwidth = step2 * (1 - paddingInner);
    const scaleFn = (value) => {
      const idx = domain.indexOf(value);
      if (idx === -1) return void 0;
      return start + idx * step2;
    };
    scaleFn.bandwidth = () => bandwidth;
    scaleFn.step = () => step2;
    scaleFn.domain = () => domain;
    scaleFn.range = () => range;
    scaleFn.type = "band";
    return scaleFn;
  }
  function createLinearScale({
    domain = [0, 100],
    range = [100, 0],
    clamp: clamp3 = false,
    nice = true,
    baseline = 0
  }) {
    let [d0, d1] = domain;
    if (baseline != null) {
      if (d0 > baseline) d0 = baseline;
      if (d1 < baseline) d1 = baseline;
    }
    if (d0 === d1) {
      d1 = d0 + 10;
    }
    const [r0, r1] = range;
    const scaleFn = (value) => {
      const num = Number(value);
      if (isNaN(num)) return void 0;
      let clamped = num;
      if (clamp3) {
        const minD = Math.min(d0, d1);
        const maxD = Math.max(d0, d1);
        clamped = Math.max(minD, Math.min(maxD, num));
      }
      const ratio = (clamped - d0) / (d1 - d0 || 1);
      return r0 + ratio * (r1 - r0);
    };
    scaleFn.invert = (pos) => {
      const ratio = (pos - r0) / (r1 - r0 || 1);
      return d0 + ratio * (d1 - d0);
    };
    scaleFn.domain = () => [d0, d1];
    scaleFn.range = () => [r0, r1];
    scaleFn.baseline = () => baseline;
    scaleFn.type = "linear";
    return scaleFn;
  }
  function createLogScale({
    domain = [1, 1e3],
    range = [100, 0],
    base = 10,
    clamp: clamp3 = false
  }) {
    const d0 = Math.max(1e-6, domain[0]);
    const d1 = Math.max(1e-6, domain[1]);
    const [r0, r1] = range;
    const log0 = Math.log(d0) / Math.log(base);
    const log1 = Math.log(d1) / Math.log(base);
    const scaleFn = (value) => {
      const num = Math.max(1e-6, Number(value));
      const logV = Math.log(num) / Math.log(base);
      const ratio = (logV - log0) / (log1 - log0 || 1);
      return r0 + ratio * (r1 - r0);
    };
    scaleFn.domain = () => [d0, d1];
    scaleFn.range = () => [r0, r1];
    scaleFn.type = "log";
    return scaleFn;
  }
  function createAreaScale({
    domain = [0, 100],
    maxRadius = 24,
    minRadius = 3
  }) {
    const [d0, d1] = domain;
    const maxSqrt = Math.sqrt(Math.max(0, d1));
    const scaleFn = (value) => {
      const num = Math.max(0, Number(value));
      const ratio = Math.sqrt(num) / (maxSqrt || 1);
      return minRadius + ratio * (maxRadius - minRadius);
    };
    scaleFn.domain = () => [d0, d1];
    scaleFn.range = () => [minRadius, maxRadius];
    scaleFn.type = "area-sqrt";
    return scaleFn;
  }
  function createTimeScale({
    domain = [new Date(2026, 0, 1), new Date(2026, 0, 2)],
    range = [0, 100]
  }) {
    const t0 = new Date(domain[0]).getTime();
    const t1 = new Date(domain[1]).getTime();
    const [r0, r1] = range;
    const scaleFn = (dateValue) => {
      const t = new Date(dateValue).getTime();
      const ratio = (t - t0) / (t1 - t0 || 1);
      return r0 + ratio * (r1 - r0);
    };
    scaleFn.invert = (pos) => {
      const ratio = (pos - r0) / (r1 - r0 || 1);
      return new Date(t0 + ratio * (t1 - t0));
    };
    scaleFn.domain = () => [new Date(t0), new Date(t1)];
    scaleFn.range = () => [r0, r1];
    scaleFn.type = "time";
    return scaleFn;
  }
  function generateTicks(scale, approximateCount = 5) {
    if (!scale) return [];
    if (scale.type === "band") {
      return scale.domain();
    }
    if (scale.type === "linear") {
      const [min, max] = scale.domain();
      if (min === max) return [min];
      const span = max - min;
      const rawStep = span / approximateCount;
      const power = Math.pow(10, Math.floor(Math.log10(rawStep)));
      const fraction = rawStep / power;
      let niceMultiplier = 1;
      if (fraction >= 1.5 && fraction < 3) niceMultiplier = 2;
      else if (fraction >= 3 && fraction < 7) niceMultiplier = 5;
      else if (fraction >= 7) niceMultiplier = 10;
      const step2 = niceMultiplier * power;
      const start = Math.ceil(min / step2) * step2;
      const ticks = [];
      for (let v = start; v <= max + 1e-9; v += step2) {
        ticks.push(Number(v.toFixed(6)));
      }
      return ticks;
    }
    if (scale.type === "time") {
      const [d0, d1] = scale.domain();
      const t0 = d0.getTime();
      const t1 = d1.getTime();
      const step2 = (t1 - t0) / approximateCount;
      const ticks = [];
      for (let i = 0; i <= approximateCount; i++) {
        ticks.push(new Date(t0 + step2 * i));
      }
      return ticks;
    }
    return [];
  }
  function createKeyboardRovingFocus({
    itemCount = 0,
    currentIndex = -1,
    onIndexChange = () => {
    },
    onSelect = () => {
    },
    onDismiss = () => {
    },
    onToggleTable = () => {
    }
  }) {
    return function handleKeyDown(e) {
      if (itemCount === 0) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          onIndexChange((currentIndex + 1) % itemCount);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          onIndexChange((currentIndex - 1 + itemCount) % itemCount);
          break;
        case "Home":
          e.preventDefault();
          onIndexChange(0);
          break;
        case "End":
          e.preventDefault();
          onIndexChange(itemCount - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (currentIndex >= 0) onSelect(currentIndex);
          break;
        case "Escape":
          e.preventDefault();
          onDismiss();
          break;
        case "F11":
          if (e.altKey) {
            e.preventDefault();
            onToggleTable();
          }
          break;
        default:
          break;
      }
    };
  }
  var STROKE_DASH_PATTERNS = ["none", "5 4", "8 4", "2 3", "6 3 2 3"];
  function createLinePath(points = [], interpolation = "linear") {
    if (!points || points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    if (interpolation === "step" || interpolation === "step-after") {
      let path2 = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path2 += ` H ${points[i].x} V ${points[i].y}`;
      }
      return path2;
    }
    if (interpolation === "step-before") {
      let path2 = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path2 += ` V ${points[i].y} H ${points[i].x}`;
      }
      return path2;
    }
    if (interpolation === "monotone" || interpolation === "smooth") {
      let path2 = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        path2 += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return path2;
    }
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  }
  function createAreaPath(upperPoints = [], lowerPoints = [], interpolation = "linear") {
    if (!upperPoints || upperPoints.length === 0 || !lowerPoints || lowerPoints.length === 0) return "";
    if (interpolation === "step" || interpolation === "step-after") {
      let path2 = `M ${upperPoints[0].x} ${upperPoints[0].y}`;
      for (let i = 1; i < upperPoints.length; i++) {
        path2 += ` H ${upperPoints[i].x} V ${upperPoints[i].y}`;
      }
      const lastLower = lowerPoints[lowerPoints.length - 1];
      path2 += ` L ${lastLower.x} ${lastLower.y}`;
      for (let i = lowerPoints.length - 2; i >= 0; i--) {
        path2 += ` H ${lowerPoints[i].x} V ${lowerPoints[i].y}`;
      }
      path2 += " Z";
      return path2;
    }
    if (interpolation === "monotone" || interpolation === "smooth") {
      let upperPath = `M ${upperPoints[0].x} ${upperPoints[0].y}`;
      for (let i = 0; i < upperPoints.length - 1; i++) {
        const p0 = upperPoints[Math.max(0, i - 1)];
        const p1 = upperPoints[i];
        const p2 = upperPoints[i + 1];
        const p3 = upperPoints[Math.min(upperPoints.length - 1, i + 2)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        upperPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      const lastLower = lowerPoints[lowerPoints.length - 1];
      let lowerPath = ` L ${lastLower.x} ${lastLower.y}`;
      for (let i = lowerPoints.length - 1; i > 0; i--) {
        const p0 = lowerPoints[Math.min(lowerPoints.length - 1, i + 1)];
        const p1 = lowerPoints[i];
        const p2 = lowerPoints[i - 1];
        const p3 = lowerPoints[Math.max(0, i - 2)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        lowerPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return `${upperPath}${lowerPath} Z`;
    }
    let path = `M ${upperPoints[0].x} ${upperPoints[0].y}`;
    for (let i = 1; i < upperPoints.length; i++) {
      path += ` L ${upperPoints[i].x} ${upperPoints[i].y}`;
    }
    for (let i = lowerPoints.length - 1; i >= 0; i--) {
      path += ` L ${lowerPoints[i].x} ${lowerPoints[i].y}`;
    }
    path += " Z";
    return path;
  }
  function stackSeriesData(data = [], seriesKeys = [], options = {}) {
    const { type = "stacked", baseline = 0 } = options;
    const n = data.length;
    const m = seriesKeys.length;
    const stacked = seriesKeys.map(() => []);
    for (let i = 0; i < n; i++) {
      const datum = data[i];
      const rawValues = seriesKeys.map((k) => Number(datum[k] || 0));
      const totalSum = rawValues.reduce((acc, v) => acc + Math.abs(v), 0);
      if (type === "normalized") {
        let cumulative = 0;
        for (let s = 0; s < m; s++) {
          const val = rawValues[s];
          const share = totalSum > 0 ? val / totalSum * 100 : 0;
          const y0 = cumulative;
          const y1 = cumulative + share;
          cumulative = y1;
          stacked[s].push({ y0, y1, val, share, rawVal: val, datum });
        }
      } else if (type === "stream") {
        let cumulative = -totalSum / 2;
        for (let s = 0; s < m; s++) {
          const val = rawValues[s];
          const y0 = cumulative;
          const y1 = cumulative + val;
          cumulative = y1;
          stacked[s].push({ y0, y1, val, share: totalSum > 0 ? val / totalSum * 100 : 0, rawVal: val, datum });
        }
      } else if (type === "diverging") {
        let posCumulative = baseline;
        let negCumulative = baseline;
        for (let s = 0; s < m; s++) {
          const val = rawValues[s];
          let y0, y1;
          if (val >= 0) {
            y0 = posCumulative;
            y1 = posCumulative + val;
            posCumulative = y1;
          } else {
            y0 = negCumulative;
            y1 = negCumulative + val;
            negCumulative = y1;
          }
          stacked[s].push({ y0, y1, val, share: 0, rawVal: val, datum });
        }
      } else {
        let cumulative = baseline;
        for (let s = 0; s < m; s++) {
          const val = rawValues[s];
          const y0 = cumulative;
          const y1 = cumulative + val;
          cumulative = y1;
          stacked[s].push({ y0, y1, val, share: totalSum > 0 ? val / totalSum * 100 : 0, rawVal: val, datum });
        }
      }
    }
    return stacked;
  }
  function renderPointSymbol(symbol = "circle", x = 0, y = 0, r = 4) {
    switch (symbol) {
      case "square":
        return `M ${x - r} ${y - r} h ${r * 2} v ${r * 2} h ${-r * 2} Z`;
      case "diamond":
        return `M ${x} ${y - r * 1.3} L ${x + r * 1.3} ${y} L ${x} ${y + r * 1.3} L ${x - r * 1.3} ${y} Z`;
      case "triangle":
        return `M ${x} ${y - r * 1.25} L ${x + r * 1.15} ${y + r * 0.9} L ${x - r * 1.15} ${y + r * 0.9} Z`;
      case "cross":
        return `M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x - r} ${y + r} L ${x + r} ${y - r}`;
      case "star": {
        const spikes = 5;
        const step2 = Math.PI / spikes;
        let path = "";
        let rot = Math.PI / 2 * 3;
        let cx = x, cy = y;
        const outerR = r * 1.2;
        const innerR = r * 0.55;
        for (let i = 0; i < spikes; i++) {
          cx = x + Math.cos(rot) * outerR;
          cy = y + Math.sin(rot) * outerR;
          path += i === 0 ? `M ${cx} ${cy}` : ` L ${cx} ${cy}`;
          rot += step2;
          cx = x + Math.cos(rot) * innerR;
          cy = y + Math.sin(rot) * innerR;
          path += ` L ${cx} ${cy}`;
          rot += step2;
        }
        return `${path} Z`;
      }
      case "circle":
      default:
        return `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;
    }
  }
  function calculateLinearRegression(points = []) {
    const valid = points.filter((p) => p && typeof p.x === "number" && typeof p.y === "number" && !isNaN(p.x) && !isNaN(p.y));
    const n = valid.length;
    if (n < 2) return null;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
    for (let i = 0; i < n; i++) {
      const { x, y } = valid[i];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
      sumYY += y * y;
    }
    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) return null;
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;
    const rNumerator = n * sumXY - sumX * sumY;
    const rDenominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    const r = rDenominator !== 0 ? rNumerator / rDenominator : 0;
    const rSquared = r * r;
    return {
      slope,
      intercept,
      r,
      rSquared,
      predict: (x) => slope * x + intercept
    };
  }
  function computeHistogramBins(values = [], options = {}) {
    const valid = values.map(Number).filter((v) => !isNaN(v)).sort((a, b) => a - b);
    const n = valid.length;
    if (n === 0) return [];
    const minVal = options.min != null ? options.min : valid[0];
    const maxVal = options.max != null ? options.max : valid[n - 1];
    const span = maxVal - minVal || 1;
    const defaultBinCount = Math.max(5, Math.min(25, Math.ceil(Math.log2(n) + 1)));
    const binCount = options.binCount || defaultBinCount;
    const binWidth = options.binWidth || span / binCount;
    const bins = [];
    for (let i = 0; i < binCount; i++) {
      const x0 = minVal + i * binWidth;
      const x1 = x0 + binWidth;
      bins.push({
        binIndex: i,
        x0,
        x1,
        xMid: (x0 + x1) / 2,
        count: 0,
        frequency: 0,
        items: []
      });
    }
    valid.forEach((v) => {
      let bIdx = Math.floor((v - minVal) / binWidth);
      if (bIdx >= binCount) bIdx = binCount - 1;
      if (bIdx < 0) bIdx = 0;
      bins[bIdx].count += 1;
      bins[bIdx].items.push(v);
    });
    bins.forEach((b) => {
      b.frequency = n > 0 ? b.count / n : 0;
    });
    return bins;
  }
  function computeBoxPlotQuantiles(values = []) {
    const valid = values.map(Number).filter((v) => !isNaN(v)).sort((a, b) => a - b);
    const n = valid.length;
    if (n === 0) {
      return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerWhisker: 0, upperWhisker: 0, outliers: [], mean: 0, stdDev: 0, count: 0 };
    }
    const getQuantile = (arr, q) => {
      const pos = (arr.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (arr[base + 1] !== void 0) {
        return arr[base] + rest * (arr[base + 1] - arr[base]);
      }
      return arr[base];
    };
    const min = valid[0];
    const max = valid[n - 1];
    const q1 = getQuantile(valid, 0.25);
    const median = getQuantile(valid, 0.5);
    const q3 = getQuantile(valid, 0.75);
    const iqr = q3 - q1;
    const lowerLimit = q1 - 1.5 * iqr;
    const upperLimit = q3 + 1.5 * iqr;
    const inliers = valid.filter((v) => v >= lowerLimit && v <= upperLimit);
    const lowerWhisker = inliers.length > 0 ? inliers[0] : min;
    const upperWhisker = inliers.length > 0 ? inliers[inliers.length - 1] : max;
    const outliers = valid.filter((v) => v < lowerLimit || v > upperLimit);
    const sum = valid.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance = valid.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1 || 1);
    const stdDev = Math.sqrt(variance);
    return {
      min,
      q1,
      median,
      q3,
      max,
      iqr,
      lowerWhisker,
      upperWhisker,
      outliers,
      mean,
      stdDev,
      count: n
    };
  }
  function computeKDE(values = [], options = {}) {
    const valid = values.map(Number).filter((v) => !isNaN(v));
    const n = valid.length;
    if (n === 0) return { points: [], maxDensity: 0, bandwidth: 1 };
    const minVal = options.min != null ? options.min : Math.min(...valid);
    const maxVal = options.max != null ? options.max : Math.max(...valid);
    const sampleCount = options.samplePoints || 50;
    const mean = valid.reduce((a, b) => a + b, 0) / n;
    const stdDev = Math.sqrt(valid.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1 || 1)) || 1;
    const h = options.bandwidth || 1.06 * stdDev * Math.pow(n, -0.2);
    const gaussianKernel = (u) => 1 / Math.sqrt(2 * Math.PI) * Math.exp(-0.5 * u * u);
    const step2 = (maxVal - minVal) / (sampleCount - 1 || 1);
    const kdePoints = [];
    let maxDensity = 0;
    for (let i = 0; i < sampleCount; i++) {
      const x = minVal + i * step2;
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += gaussianKernel((x - valid[j]) / h);
      }
      const density = sum / (n * h);
      if (density > maxDensity) maxDensity = density;
      kdePoints.push({ x, density });
    }
    return {
      points: kdePoints,
      maxDensity,
      bandwidth: h
    };
  }
  function interpolateRgb(hex1, hex2, ratio) {
    const parseHex = (hex) => {
      let clean = (hex || "#000000").replace("#", "");
      if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
      const num = parseInt(clean, 16) || 0;
      return [num >> 16 & 255, num >> 8 & 255, num & 255];
    };
    const rgb1 = parseHex(hex1);
    const rgb2 = parseHex(hex2);
    const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * ratio);
    const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * ratio);
    const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }
  function createSequentialColorScale({
    domain = [0, 100],
    colors = ["#eff6ff", "#1d4ed8"]
  }) {
    const [d0, d1] = domain;
    const span = d1 - d0 || 1;
    const scaleFn = (val) => {
      if (val == null || isNaN(val)) return "transparent";
      const clamped = Math.max(d0, Math.min(d1, Number(val)));
      const ratio = (clamped - d0) / span;
      return interpolateRgb(colors[0], colors[1], ratio);
    };
    scaleFn.domain = () => [d0, d1];
    scaleFn.colors = () => colors;
    return scaleFn;
  }
  function createDivergingColorScale({
    domain = [-1, 1],
    colors = ["#ef4444", "#f8fafc", "#2563eb"],
    neutral = 0
  }) {
    const [d0, d1] = domain;
    const scaleFn = (val) => {
      if (val == null || isNaN(val)) return "transparent";
      const num = Number(val);
      if (num < neutral) {
        const ratio = (num - d0) / (neutral - d0 || 1);
        return interpolateRgb(colors[0], colors[1], Math.max(0, Math.min(1, ratio)));
      } else {
        const ratio = (num - neutral) / (d1 - neutral || 1);
        return interpolateRgb(colors[1], colors[2], Math.max(0, Math.min(1, ratio)));
      }
    };
    scaleFn.domain = () => [d0, d1];
    scaleFn.colors = () => colors;
    return scaleFn;
  }
  function computePieSlices(data = [], options = {}) {
    const { valueKey = "value", startAngle = -Math.PI / 2, padAngle = 0 } = options;
    const validData = data.map((d, i) => {
      const rawVal = typeof d === "number" ? d : Number(d[valueKey] || 0);
      return {
        index: i,
        datum: d,
        value: Math.max(0, isNaN(rawVal) ? 0 : rawVal)
      };
    });
    const total = validData.reduce((acc, d) => acc + d.value, 0);
    const n = validData.length;
    let currentAngle = startAngle;
    return validData.map((d) => {
      const share = total > 0 ? d.value / total : 1 / (n || 1);
      const angleSpan = share * 2 * Math.PI;
      const a0 = currentAngle + (n > 1 ? padAngle / 2 : 0);
      const a1 = currentAngle + angleSpan - (n > 1 ? padAngle / 2 : 0);
      const midAngle = (a0 + a1) / 2;
      currentAngle += angleSpan;
      return {
        ...d,
        share,
        percentage: share * 100,
        startAngle: a0,
        endAngle: a1,
        midAngle,
        total
      };
    });
  }
  function createArcPath({
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 100,
    startAngle = 0,
    endAngle = Math.PI / 2
  }) {
    const isFullCircle = Math.abs(endAngle - startAngle) >= 2 * Math.PI - 1e-4;
    const deltaAngle = endAngle - startAngle;
    const largeArcFlag = deltaAngle > Math.PI ? 1 : 0;
    const p0x = cx + outerRadius * Math.cos(startAngle);
    const p0y = cy + outerRadius * Math.sin(startAngle);
    const p1x = cx + outerRadius * Math.cos(endAngle);
    const p1y = cy + outerRadius * Math.sin(endAngle);
    if (innerRadius <= 0) {
      if (isFullCircle) {
        return `M ${cx - outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx + outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx - outerRadius} ${cy} Z`;
      }
      return `M ${cx} ${cy} L ${p0x} ${p0y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p1x} ${p1y} Z`;
    }
    const p2x = cx + innerRadius * Math.cos(endAngle);
    const p2y = cy + innerRadius * Math.sin(endAngle);
    const p3x = cx + innerRadius * Math.cos(startAngle);
    const p3y = cy + innerRadius * Math.sin(startAngle);
    if (isFullCircle) {
      return `M ${cx - outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx + outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx - outerRadius} ${cy} M ${cx - innerRadius} ${cy} A ${innerRadius} ${innerRadius} 0 1 1 ${cx + innerRadius} ${cy} A ${innerRadius} ${innerRadius} 0 1 1 ${cx - innerRadius} ${cy} Z`;
    }
    return `M ${p0x} ${p0y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p1x} ${p1y} L ${p2x} ${p2y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p3x} ${p3y} Z`;
  }
  function rollupHierarchy(inputData, {
    idKey = "id",
    labelKey = "label",
    valueKey = "value",
    childrenKey = "children",
    categoryKey = "category"
  } = {}) {
    if (!inputData) return null;
    function processNode(node, depth = 0, parent = null) {
      const id = node[idKey] || node.id || node[labelKey] || `node-${Math.random().toString(36).substr(2, 9)}`;
      const label = node[labelKey] || node.label || node.name || id;
      const category = node[categoryKey] || (parent ? parent.category : label);
      const rawChildren = node[childrenKey] || node.children || [];
      const processed = {
        id,
        label,
        category,
        depth,
        parent: parent ? { id: parent.id, label: parent.label } : null,
        raw: node
      };
      if (Array.isArray(rawChildren) && rawChildren.length > 0) {
        processed.children = rawChildren.map((child) => processNode(child, depth + 1, processed)).filter(Boolean).sort((a, b) => (b.value || 0) - (a.value || 0));
        processed.value = processed.children.reduce((sum, c) => sum + (c.value || 0), 0);
        processed.isLeaf = false;
      } else {
        const v = Number(node[valueKey] !== void 0 ? node[valueKey] : node.value);
        processed.value = Math.max(0, isNaN(v) ? 0 : v);
        processed.children = [];
        processed.isLeaf = true;
      }
      return processed;
    }
    if (Array.isArray(inputData)) {
      const processedChildren = inputData.map((item) => processNode(item, 1, null)).sort((a, b) => (b.value || 0) - (a.value || 0));
      const totalVal = processedChildren.reduce((sum, c) => sum + c.value, 0);
      return {
        id: "root",
        label: "Root",
        category: "Root",
        depth: 0,
        parent: null,
        children: processedChildren,
        value: totalVal,
        isLeaf: false,
        raw: inputData
      };
    }
    return processNode(inputData, 0, null);
  }
  function computeTreemapLayout({
    rootNode,
    x = 0,
    y = 0,
    width = 600,
    height = 400,
    padding = 2,
    containerPadding = 4,
    headerHeight = 20,
    algorithm = "squarified",
    // 'squarified' | 'slice-and-dice'
    maxDepth = Infinity
  }) {
    if (!rootNode || width <= 0 || height <= 0) return [];
    const nodes = [];
    function layoutLevel(node, rx, ry, rw, rh) {
      if (rw <= 0 || rh <= 0) return;
      const isRoot = node.depth === 0;
      const isBranch = !node.isLeaf && node.depth < maxDepth && node.children && node.children.length > 0;
      const nodeLayout = {
        ...node,
        x: rx,
        y: ry,
        width: rw,
        height: rh,
        x0: rx,
        y0: ry,
        x1: rx + rw,
        y1: ry + rh
      };
      nodes.push(nodeLayout);
      if (!isBranch) return;
      const childX = rx + (isRoot ? 0 : containerPadding);
      const childY = ry + (isRoot ? 0 : headerHeight + containerPadding);
      const childW = Math.max(0, rw - (isRoot ? 0 : containerPadding * 2));
      const childH = Math.max(0, rh - (isRoot ? 0 : headerHeight + containerPadding * 2));
      if (childW <= 0 || childH <= 0 || node.children.length === 0) return;
      const totalVal = node.value || node.children.reduce((sum, c) => sum + c.value, 0);
      if (totalVal <= 0) return;
      if (algorithm === "slice-and-dice") {
        layoutSliceAndDice(node.children, childX, childY, childW, childH, node.depth % 2 === 0, totalVal);
      } else {
        layoutSquarified(node.children, childX, childY, childW, childH, totalVal);
      }
    }
    function layoutSliceAndDice(children, bx, by, bw, bh, isVertical, totalVal) {
      let offset = isVertical ? bx : by;
      const totalDim = isVertical ? bw : bh;
      children.forEach((child, idx) => {
        const share = totalVal > 0 ? child.value / totalVal : 1 / children.length;
        const span = share * totalDim;
        const pad2 = padding / 2;
        const cx = isVertical ? offset + pad2 : bx + pad2;
        const cy = isVertical ? by + pad2 : offset + pad2;
        const cw = Math.max(0, (isVertical ? span : bw) - padding);
        const ch = Math.max(0, (isVertical ? bh : span) - padding);
        layoutLevel(child, cx, cy, cw, ch);
        offset += span;
      });
    }
    function layoutSquarified(children, bx, by, bw, bh, totalVal) {
      const totalArea = bw * bh;
      const items = children.map((c) => ({
        node: c,
        area: totalVal > 0 ? c.value / totalVal * totalArea : 0
      })).filter((item) => item.area > 0);
      if (items.length === 0) return;
      let curX = bx;
      let curY = by;
      let curW = bw;
      let curH = bh;
      let remaining = [...items];
      while (remaining.length > 0) {
        const shortestSide = Math.min(curW, curH);
        const row = [remaining[0]];
        let bestAspect = worstAspectRatio(row, shortestSide);
        let i = 1;
        while (i < remaining.length) {
          const testRow = [...row, remaining[i]];
          const testAspect = worstAspectRatio(testRow, shortestSide);
          if (testAspect <= bestAspect) {
            row.push(remaining[i]);
            bestAspect = testAspect;
            i++;
          } else {
            break;
          }
        }
        const rowArea = row.reduce((sum, r) => sum + r.area, 0);
        const isHorizontal = curW >= curH;
        const rowThickness = shortestSide > 0 ? rowArea / shortestSide : 0;
        let itemOffset = isHorizontal ? curY : curX;
        row.forEach((item) => {
          const itemSpan = rowArea > 0 ? item.area / rowArea * (isHorizontal ? curH : curW) : 0;
          const ix = isHorizontal ? curX : itemOffset;
          const iy = isHorizontal ? itemOffset : curY;
          const iw = isHorizontal ? rowThickness : itemSpan;
          const ih = isHorizontal ? itemSpan : rowThickness;
          const px = ix + padding / 2;
          const py = iy + padding / 2;
          const pw = Math.max(0, iw - padding);
          const ph = Math.max(0, ih - padding);
          layoutLevel(item.node, px, py, pw, ph);
          itemOffset += itemSpan;
        });
        if (isHorizontal) {
          curX += rowThickness;
          curW = Math.max(0, curW - rowThickness);
        } else {
          curY += rowThickness;
          curH = Math.max(0, curH - rowThickness);
        }
        remaining = remaining.slice(row.length);
      }
    }
    function worstAspectRatio(row, side) {
      if (row.length === 0 || side <= 0) return Infinity;
      const rowArea = row.reduce((sum, r) => sum + r.area, 0);
      if (rowArea <= 0) return Infinity;
      const sideSq = side * side;
      const areaSq = rowArea * rowArea;
      let maxAspect = 0;
      for (const item of row) {
        if (item.area <= 0) continue;
        const aspect = Math.max(
          sideSq * item.area / areaSq,
          areaSq / (sideSq * item.area)
        );
        if (aspect > maxAspect) maxAspect = aspect;
      }
      return maxAspect || Infinity;
    }
    layoutLevel(rootNode, x, y, width, height);
    return nodes;
  }
  function computeTreeTopology({
    rootNode,
    orientation = "horizontal",
    // 'horizontal' | 'vertical'
    nodeWidth = 150,
    nodeHeight = 54,
    levelSpacing = 70,
    siblingSpacing = 20,
    collapsedIds = /* @__PURE__ */ new Set()
  }) {
    if (!rootNode) return { nodes: [], links: [], bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 } };
    const nodes = [];
    const links = [];
    function measureSubtree(node, depth = 0) {
      const isCollapsed = collapsedIds.has(node.id);
      const hasChildren = !isCollapsed && Array.isArray(node.children) && node.children.length > 0;
      if (!hasChildren) {
        const leafBreadth = orientation === "horizontal" ? nodeHeight + siblingSpacing : nodeWidth + siblingSpacing;
        return { ...node, depth, isCollapsed, breadth: leafBreadth, measuredChildren: [] };
      }
      const measuredChildren = node.children.map((child) => measureSubtree(child, depth + 1));
      const totalBreadth = measuredChildren.reduce((sum, c) => sum + c.breadth, 0);
      return {
        ...node,
        depth,
        isCollapsed,
        breadth: Math.max(orientation === "horizontal" ? nodeHeight + siblingSpacing : nodeWidth + siblingSpacing, totalBreadth),
        measuredChildren
      };
    }
    const measuredRoot = measureSubtree(rootNode, 0);
    function positionSubtree(mNode, levelOffset, breadthOffset, parentNode = null) {
      const isHorizontal = orientation === "horizontal";
      let x, y;
      if (isHorizontal) {
        x = levelOffset;
        y = breadthOffset + (mNode.breadth - (nodeHeight + siblingSpacing)) / 2;
      } else {
        x = breadthOffset + (mNode.breadth - (nodeWidth + siblingSpacing)) / 2;
        y = levelOffset;
      }
      const layoutNode = {
        id: mNode.id,
        label: mNode.label,
        category: mNode.category,
        depth: mNode.depth,
        value: mNode.value,
        status: mNode.status,
        code: mNode.code,
        role: mNode.role,
        isLeaf: !mNode.children || mNode.children.length === 0,
        isCollapsed: mNode.isCollapsed,
        childrenCount: mNode.children ? mNode.children.length : 0,
        x,
        y,
        width: nodeWidth,
        height: nodeHeight,
        raw: mNode.raw || mNode,
        parent: parentNode ? { id: parentNode.id, label: parentNode.label, x: parentNode.x, y: parentNode.y } : null
      };
      nodes.push(layoutNode);
      if (parentNode) {
        links.push({
          id: `link-${parentNode.id}-${layoutNode.id}`,
          source: parentNode,
          target: layoutNode
        });
      }
      if (!mNode.isCollapsed && mNode.measuredChildren && mNode.measuredChildren.length > 0) {
        let currentBreadth = breadthOffset;
        const nextLevel = levelOffset + (isHorizontal ? nodeWidth + levelSpacing : nodeHeight + levelSpacing);
        mNode.measuredChildren.forEach((child) => {
          positionSubtree(child, nextLevel, currentBreadth, layoutNode);
          currentBreadth += child.breadth;
        });
      }
    }
    positionSubtree(measuredRoot, 20, 20, null);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach((n) => {
      if (n.x < minX) minX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.x + n.width > maxX) maxX = n.x + n.width;
      if (n.y + n.height > maxY) maxY = n.y + n.height;
    });
    return {
      nodes,
      links,
      bounds: {
        minX: minX === Infinity ? 0 : minX,
        minY: minY === Infinity ? 0 : minY,
        maxX: maxX === -Infinity ? 0 : maxX,
        maxY: maxY === -Infinity ? 0 : maxY,
        width: Math.max(100, maxX - minX + 40),
        height: Math.max(100, maxY - minY + 40)
      }
    };
  }
  function createTreeLinkPath({
    source,
    target,
    orientation = "horizontal",
    linkStyle = "smooth"
    // 'smooth' | 'step' | 'straight'
  }) {
    if (!source || !target) return "";
    const isHorizontal = orientation === "horizontal";
    const sx = isHorizontal ? source.x + source.width : source.x + source.width / 2;
    const sy = isHorizontal ? source.y + source.height / 2 : source.y + source.height;
    const tx = isHorizontal ? target.x : target.x + target.width / 2;
    const ty = isHorizontal ? target.y + target.height / 2 : target.y;
    if (linkStyle === "straight") {
      return `M ${sx} ${sy} L ${tx} ${ty}`;
    }
    if (linkStyle === "step") {
      if (isHorizontal) {
        const midX = (sx + tx) / 2;
        return `M ${sx} ${sy} H ${midX} V ${ty} H ${tx}`;
      } else {
        const midY = (sy + ty) / 2;
        return `M ${sx} ${sy} V ${midY} H ${tx} V ${ty}`;
      }
    }
    if (isHorizontal) {
      const dx = Math.max(20, Math.abs(tx - sx) / 2);
      return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
    } else {
      const dy = Math.max(20, Math.abs(ty - sy) / 2);
      return `M ${sx} ${sy} C ${sx} ${sy + dy}, ${tx} ${ty - dy}, ${tx} ${ty}`;
    }
  }
  function computeSankeyLayout({
    nodes: rawNodes = [],
    links: rawLinks = [],
    width = 760,
    height = 440,
    nodeWidth = 20,
    nodePadding = 18,
    align = "justify",
    margin = { top: 28, right: 28, bottom: 24, left: 28 }
  } = {}) {
    if (!rawNodes || rawNodes.length === 0 || width <= 0 || height <= 0) {
      return { nodes: [], links: [], stages: [], ky: 1, bounds: { width, height } };
    }
    const mTop = margin.top ?? 28;
    const mRight = margin.right ?? 28;
    const mBottom = margin.bottom ?? 24;
    const mLeft = margin.left ?? 28;
    const innerWidth = Math.max(100, width - mLeft - mRight);
    const innerHeight = Math.max(80, height - mTop - mBottom);
    const nodeMap = /* @__PURE__ */ new Map();
    const nodes = rawNodes.map((n, idx) => {
      const id = n.id !== void 0 ? String(n.id) : `node-${idx}`;
      const nodeObj = {
        ...n,
        id,
        label: n.label || n.name || id,
        category: n.category || n.label || id,
        inLinks: [],
        outLinks: [],
        inValue: 0,
        outValue: 0,
        value: 0,
        column: 0
      };
      nodeMap.set(id, nodeObj);
      return nodeObj;
    });
    const links = [];
    rawLinks.forEach((l, idx) => {
      const sId = String(typeof l.source === "object" && l.source !== null ? l.source.id : l.source);
      const tId = String(typeof l.target === "object" && l.target !== null ? l.target.id : l.target);
      const sourceNode = nodeMap.get(sId);
      const targetNode = nodeMap.get(tId);
      const val = Math.max(0, Number(l.value) || 0);
      if (sourceNode && targetNode && val > 0) {
        const linkObj = {
          id: l.id || `link-${sId}-${tId}-${idx}`,
          source: sourceNode,
          target: targetNode,
          value: val,
          category: l.category || sourceNode.category,
          raw: l,
          y0: 0,
          y1: 0,
          width: 0
        };
        sourceNode.outLinks.push(linkObj);
        targetNode.inLinks.push(linkObj);
        sourceNode.outValue += val;
        targetNode.inValue += val;
        links.push(linkObj);
      }
    });
    nodes.forEach((n) => {
      n.value = Math.max(n.inValue, n.outValue);
    });
    let remainingNodes = [...nodes];
    let currentStageNodes = remainingNodes.filter((n) => n.inLinks.length === 0);
    if (currentStageNodes.length === 0) currentStageNodes = [remainingNodes[0]];
    currentStageNodes.forEach((n) => {
      n.column = 0;
    });
    let maxCol = 0;
    const visited = new Set(currentStageNodes.map((n) => n.id));
    let queue2 = [...currentStageNodes];
    while (queue2.length > 0) {
      const curr = queue2.shift();
      curr.outLinks.forEach((link) => {
        const target = link.target;
        target.column = Math.max(target.column, curr.column + 1);
        if (target.column > maxCol) maxCol = target.column;
        if (!visited.has(target.id)) {
          visited.add(target.id);
          queue2.push(target);
        }
      });
    }
    if (align === "justify" && maxCol > 0) {
      nodes.forEach((n) => {
        if (n.outLinks.length === 0 && n.column < maxCol) {
          n.column = maxCol;
        }
      });
    }
    const stageColumns = [];
    for (let c = 0; c <= maxCol; c++) {
      stageColumns.push([]);
    }
    nodes.forEach((n) => {
      stageColumns[n.column].push(n);
    });
    let maxColumnValue = 0;
    stageColumns.forEach((colNodes) => {
      const colVal = colNodes.reduce((sum, n) => sum + n.value, 0);
      if (colVal > maxColumnValue) maxColumnValue = colVal;
    });
    const maxNodeCountInAnyCol = Math.max(1, ...stageColumns.map((c) => c.length));
    const effectivePadding = Math.min(
      nodePadding,
      maxNodeCountInAnyCol > 1 ? innerHeight * 0.45 / (maxNodeCountInAnyCol - 1) : nodePadding
    );
    const availablePlotHeight = Math.max(20, innerHeight - (maxNodeCountInAnyCol - 1) * effectivePadding);
    const ky = maxColumnValue > 0 ? availablePlotHeight / maxColumnValue : 1;
    const colSpacing = maxCol > 0 ? (innerWidth - nodeWidth) / maxCol : 0;
    stageColumns.forEach((colNodes, colIdx) => {
      const colX = mLeft + colIdx * colSpacing;
      const totalColNodeH = colNodes.reduce((sum, n) => sum + Math.max(6, n.value * ky), 0);
      const totalColH = totalColNodeH + (colNodes.length - 1) * effectivePadding;
      let currentY = mTop + Math.max(0, (innerHeight - totalColH) / 2);
      colNodes.forEach((n) => {
        n.x = colX;
        n.y = currentY;
        n.width = nodeWidth;
        n.height = Math.max(6, n.value * ky);
        currentY += n.height + effectivePadding;
      });
    });
    nodes.forEach((n) => {
      n.outLinks.sort((a, b) => a.target.y - b.target.y);
      n.inLinks.sort((a, b) => a.source.y - b.source.y);
    });
    nodes.forEach((n) => {
      let sy = n.y;
      n.outLinks.forEach((l) => {
        l.y0 = sy;
        l.width = Math.max(1.5, l.value * ky);
        sy += l.width;
      });
      let ty = n.y;
      n.inLinks.forEach((l) => {
        l.y1 = ty;
        if (!l.width) l.width = Math.max(1.5, l.value * ky);
        ty += l.width;
      });
    });
    return {
      nodes,
      links,
      stages: stageColumns,
      ky,
      bounds: { width, height }
    };
  }
  function createSankeyRibbonPath({
    link,
    curvature = 0.5
  }) {
    if (!link || !link.source || !link.target) return "";
    const x0 = link.source.x + link.source.width;
    const x1 = link.target.x;
    const y0 = link.y0;
    const y1 = link.y1;
    const w = link.width || 2;
    const dx = Math.max(10, (x1 - x0) * curvature);
    return `M ${x0} ${y0} C ${x0 + dx} ${y0}, ${x1 - dx} ${y1}, ${x1} ${y1} L ${x1} ${y1 + w} C ${x1 - dx} ${y1 + w}, ${x0 + dx} ${y0 + w}, ${x0} ${y0 + w} Z`;
  }
  function computeNetworkLayout({
    nodes: rawNodes = [],
    links: rawLinks = [],
    width = 760,
    height = 480,
    layout = "force",
    // 'force' | 'circular'
    iterations = 120,
    linkDistance = 90,
    repulsion = 1800,
    gravity = 0.06
  } = {}) {
    if (!rawNodes || rawNodes.length === 0 || width <= 0 || height <= 0) {
      return { nodes: [], links: [], adjacencyMap: /* @__PURE__ */ new Map() };
    }
    const cx = width / 2;
    const cy = height / 2;
    const nodeMap = /* @__PURE__ */ new Map();
    const adjacencyMap = /* @__PURE__ */ new Map();
    const nodes = rawNodes.map((n, idx) => {
      const id = n.id !== void 0 ? String(n.id) : `node-${idx}`;
      const r = Math.max(8, Math.min(26, n.size || n.radius || (n.value ? Math.sqrt(n.value) * 3 : 12)));
      const angle = idx * 2.3999632;
      const dist = Math.min(cx, cy) * 0.4 * Math.sqrt((idx + 1) / rawNodes.length);
      const initX = cx + dist * Math.cos(angle);
      const initY = cy + dist * Math.sin(angle);
      const nodeObj = {
        ...n,
        id,
        label: n.label || n.name || id,
        category: n.category || "default",
        radius: r,
        degree: 0,
        x: initX,
        y: initY,
        vx: 0,
        vy: 0,
        raw: n
      };
      nodeMap.set(id, nodeObj);
      adjacencyMap.set(id, /* @__PURE__ */ new Set());
      return nodeObj;
    });
    const links = [];
    rawLinks.forEach((l, idx) => {
      const sId = String(typeof l.source === "object" ? l.source.id : l.source);
      const tId = String(typeof l.target === "object" ? l.target.id : l.target);
      const sNode = nodeMap.get(sId);
      const tNode = nodeMap.get(tId);
      const weight = Math.max(1, Number(l.weight || l.value || 1));
      if (sNode && tNode) {
        const linkObj = {
          id: l.id || `edge-${sId}-${tId}-${idx}`,
          source: sNode,
          target: tNode,
          weight,
          directed: l.directed !== void 0 ? l.directed : true,
          label: l.label || "",
          category: l.category || sNode.category,
          raw: l
        };
        sNode.degree++;
        tNode.degree++;
        adjacencyMap.get(sId).add(tId);
        adjacencyMap.get(tId).add(sId);
        links.push(linkObj);
      }
    });
    if (layout === "circular") {
      const radius = Math.min(cx, cy) - 50;
      const n = nodes.length;
      nodes.forEach((node, i) => {
        const theta = 2 * Math.PI * i / n - Math.PI / 2;
        node.x = cx + radius * Math.cos(theta);
        node.y = cy + radius * Math.sin(theta);
      });
    } else {
      let temp = Math.min(width, height) * 0.15;
      const dt = 1;
      for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const n1 = nodes[i];
            const n2 = nodes[j];
            const dx = n2.x - n1.x || (Math.random() - 0.5) * 0.1;
            const dy = n2.y - n1.y || (Math.random() - 0.5) * 0.1;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq) || 1;
            const f = repulsion / Math.max(100, distSq);
            const fx = dx / dist * f;
            const fy = dy / dist * f;
            n1.vx -= fx;
            n1.vy -= fy;
            n2.vx += fx;
            n2.vy += fy;
          }
        }
        links.forEach((l) => {
          const dx = l.target.x - l.source.x || 0.1;
          const dy = l.target.y - l.source.y || 0.1;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const displacement = dist - linkDistance;
          const f = displacement * 0.05 * Math.sqrt(l.weight);
          const fx = dx / dist * f;
          const fy = dy / dist * f;
          l.source.vx += fx;
          l.source.vy += fy;
          l.target.vx -= fx;
          l.target.vy -= fy;
        });
        nodes.forEach((n) => {
          n.vx += (cx - n.x) * gravity;
          n.vy += (cy - n.y) * gravity;
          const vel = Math.sqrt(n.vx * n.vx + n.vy * n.vy) || 1;
          const step2 = Math.min(vel, temp);
          n.x += n.vx / vel * step2 * dt;
          n.y += n.vy / vel * step2 * dt;
          n.vx = 0;
          n.vy = 0;
          const pad2 = n.radius + 15;
          n.x = Math.max(pad2, Math.min(width - pad2, n.x));
          n.y = Math.max(pad2, Math.min(height - pad2, n.y));
        });
        temp *= 0.96;
      }
    }
    return {
      nodes,
      links,
      adjacencyMap
    };
  }
  function createGeoProjection({
    center = [78.5, 20.5],
    // Center of India (Lon, Lat)
    scale = 850,
    width = 760,
    height = 480,
    projection = "mercator"
  } = {}) {
    const lambda0 = center[0] * Math.PI / 180;
    const phi0 = center[1] * Math.PI / 180;
    const cx = width / 2;
    const cy = height / 2;
    function project(coords) {
      if (!coords || coords.length < 2) return [cx, cy];
      const lon = Number(coords[0]);
      const lat = Number(coords[1]);
      const lambda = lon * Math.PI / 180;
      const phi = Math.max(-85 * Math.PI / 180, Math.min(85 * Math.PI / 180, lat * Math.PI / 180));
      if (projection === "equirectangular") {
        const x2 = cx + scale * (lambda - lambda0);
        const y2 = cy - scale * (phi - phi0);
        return [x2, y2];
      }
      const x = cx + scale * (lambda - lambda0);
      const y0 = Math.log(Math.tan(Math.PI / 4 + phi0 / 2));
      const y1 = Math.log(Math.tan(Math.PI / 4 + phi / 2));
      const y = cy - scale * (y1 - y0);
      return [x, y];
    }
    function invert(point) {
      const x = point[0];
      const y = point[1];
      const lambda = (x - cx) / scale + lambda0;
      const y0 = Math.log(Math.tan(Math.PI / 4 + phi0 / 2));
      const y1 = y0 - (y - cy) / scale;
      const phi = 2 * Math.atan(Math.exp(y1)) - Math.PI / 2;
      return [lambda * 180 / Math.PI, phi * 180 / Math.PI];
    }
    return {
      project,
      invert,
      center,
      scale,
      width,
      height
    };
  }
  function createCurvedRoutePath({
    sourcePoint,
    // [x0, y0]
    targetPoint,
    // [x1, y1]
    curvature = 0.22
  }) {
    if (!sourcePoint || !targetPoint) return "";
    const [x0, y0] = sourcePoint;
    const [x1, y1] = targetPoint;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return `M ${x0} ${y0}`;
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const cx = mx - dy * curvature;
    const cy = my + dx * curvature;
    return `M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`;
  }

  // components/data/BarChart.jsx
  function BarChart({
    data = [],
    categoryKey = "label",
    valueKey = "value",
    series = null,
    // array of { key: string, label: string, color?: string }
    variant = "vertical",
    // 'vertical' | 'horizontal' | 'grouped' | 'stacked' | 'normalized' | 'diverging' | 'floating'
    orientation = null,
    // 'vertical' | 'horizontal' (defaults based on variant)
    title = "",
    caption = "",
    description = "",
    unit = "",
    valueFormatter = null,
    referenceLines = [],
    thresholdBands = [],
    baseline = 0,
    domain = null,
    // [min, max]
    selectedKey = null,
    onSelect = null,
    showGrid = true,
    showValues = false,
    showLegend = true,
    showTooltip = true,
    showTableToggle = true,
    loading = false,
    emptyText = "No data available for this selection",
    height = 280,
    width = "100%",
    className = "",
    style = {},
    ...rest
  }) {
    const chartId = (0, import_react73.useId)().replace(/:/g, "-");
    const containerRef = (0, import_react73.useRef)(null);
    const [hoveredPoint, setHoveredPoint] = (0, import_react73.useState)(null);
    const [activeSeries, setActiveSeries] = (0, import_react73.useState)(null);
    const [focusedIndex, setFocusedIndex] = (0, import_react73.useState)(-1);
    const [focusedSeriesIndex, setFocusedSeriesIndex] = (0, import_react73.useState)(0);
    const [isTableView, setIsTableView] = (0, import_react73.useState)(false);
    const [svgDimensions, setSvgDimensions] = (0, import_react73.useState)({
      width: 600,
      height: typeof height === "number" ? height : 280
    });
    const isHorizontal = orientation === "horizontal" || variant === "horizontal" || variant === "diverging";
    const isGrouped = variant === "grouped";
    const isStacked = variant === "stacked";
    const isNormalized = variant === "normalized";
    const isDiverging = variant === "diverging";
    const isFloating = variant === "floating";
    (0, import_react73.useEffect)(() => {
      if (!containerRef.current) return;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: w, height: h } = entry.contentRect;
          if (w > 0) {
            setSvgDimensions({
              width: w,
              height: typeof height === "number" ? height : Math.max(220, h || 280)
            });
          }
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [height]);
    const normalizedSeries = (0, import_react73.useMemo)(() => {
      if (series && Array.isArray(series) && series.length > 0) {
        return series.map((s, idx) => ({
          key: typeof s === "string" ? s : s.key,
          label: typeof s === "string" ? s : s.label || s.key,
          color: typeof s === "object" && s.color ? s.color : VIZ_COLORS[idx % VIZ_COLORS.length],
          patternId: `${chartId}-${PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id}`
        }));
      }
      return [{
        key: valueKey,
        label: title || "Value",
        color: VIZ_COLORS[0],
        patternId: `${chartId}-${PATTERN_PRESETS[0].id}`
      }];
    }, [series, valueKey, title, chartId]);
    const processedData = (0, import_react73.useMemo)(() => {
      if (!data || data.length === 0) return [];
      return data.map((item, idx) => {
        const cat = item[categoryKey] != null ? item[categoryKey] : `Category ${idx + 1}`;
        if (isNormalized) {
          const total = normalizedSeries.reduce((sum, s) => sum + Math.max(0, Number(item[s.key]) || 0), 0);
          const percentages = {};
          let runningPct = 0;
          normalizedSeries.forEach((s) => {
            const raw = Math.max(0, Number(item[s.key]) || 0);
            const pct = total > 0 ? raw / total * 100 : 0;
            percentages[s.key] = {
              raw,
              pct,
              startPct: runningPct,
              endPct: runningPct + pct
            };
            runningPct += pct;
          });
          return { ...item, _category: cat, _total: total, _percentages: percentages };
        }
        if (isStacked) {
          let posSum = 0;
          let negSum = 0;
          const stackOffsets = {};
          normalizedSeries.forEach((s) => {
            const val = Number(item[s.key]) || 0;
            if (val >= 0) {
              stackOffsets[s.key] = { start: posSum, end: posSum + val, val };
              posSum += val;
            } else {
              stackOffsets[s.key] = { start: negSum, end: negSum + val, val };
              negSum += val;
            }
          });
          return { ...item, _category: cat, _posSum: posSum, _negSum: negSum, _stackOffsets: stackOffsets };
        }
        if (isFloating) {
          const start = Number(item.start ?? item.min ?? 0);
          const end = Number(item.end ?? item.max ?? item[valueKey] ?? 0);
          return { ...item, _category: cat, _start: Math.min(start, end), _end: Math.max(start, end) };
        }
        return { ...item, _category: cat };
      });
    }, [data, categoryKey, normalizedSeries, isNormalized, isStacked, isFloating, valueKey]);
    const [computedMin, computedMax] = (0, import_react73.useMemo)(() => {
      if (domain && Array.isArray(domain) && domain.length === 2) {
        return domain;
      }
      if (isNormalized) {
        return [0, 100];
      }
      if (processedData.length === 0) {
        return [0, 100];
      }
      let min = baseline;
      let max = baseline;
      if (isStacked) {
        processedData.forEach((d) => {
          if (d._posSum > max) max = d._posSum;
          if (d._negSum < min) min = d._negSum;
        });
      } else if (isFloating) {
        processedData.forEach((d) => {
          if (d._end > max) max = d._end;
          if (d._start < min) min = d._start;
        });
      } else if (normalizedSeries.length > 1) {
        processedData.forEach((d) => {
          normalizedSeries.forEach((s) => {
            const v = Number(d[s.key]) || 0;
            if (v > max) max = v;
            if (v < min) min = v;
          });
        });
      } else {
        processedData.forEach((d) => {
          const v = Number(d[valueKey]) || 0;
          if (v > max) max = v;
          if (v < min) min = v;
        });
      }
      referenceLines.forEach((rl) => {
        if (rl.value > max) max = rl.value;
        if (rl.value < min) min = rl.value;
      });
      const diff = max - min || 10;
      max = max + diff * 0.08;
      if (min < 0) min = min - diff * 0.08;
      if (min >= 0 && baseline === 0) {
        min = 0;
      }
      return [min, max];
    }, [domain, isNormalized, processedData, baseline, isStacked, isFloating, normalizedSeries, valueKey, referenceLines]);
    const margins = (0, import_react73.useMemo)(() => {
      if (isHorizontal) {
        const maxCatLen = processedData.reduce((max, d) => Math.max(max, String(d._category).length), 0);
        const leftPad = Math.min(140, Math.max(68, maxCatLen * 7.5 + 16));
        return { top: 16, right: 32, bottom: 32, left: leftPad };
      }
      return { top: 16, right: 16, bottom: 44, left: 56 };
    }, [isHorizontal, processedData]);
    const plotRegion = (0, import_react73.useMemo)(() => {
      return createPlotRegion({
        containerWidth: svgDimensions.width,
        containerHeight: svgDimensions.height,
        margins
      });
    }, [svgDimensions, margins]);
    const quantitativeScale = (0, import_react73.useMemo)(() => {
      if (isHorizontal) {
        return createLinearScale({
          domain: [computedMin, computedMax],
          range: [0, plotRegion.plotWidth],
          baseline
        });
      }
      return createLinearScale({
        domain: [computedMin, computedMax],
        range: [plotRegion.plotHeight, 0],
        baseline
      });
    }, [computedMin, computedMax, plotRegion, isHorizontal, baseline]);
    const categoricalScale = (0, import_react73.useMemo)(() => {
      const categories = processedData.map((d) => d._category);
      return createBandScale({
        domain: categories,
        range: isHorizontal ? [0, plotRegion.plotHeight] : [0, plotRegion.plotWidth],
        paddingInner: 0.24,
        paddingOuter: 0.12
      });
    }, [processedData, isHorizontal, plotRegion]);
    const baselinePos = quantitativeScale(baseline);
    const ticks = (0, import_react73.useMemo)(() => generateTicks(quantitativeScale, isHorizontal ? 5 : 4), [quantitativeScale, isHorizontal]);
    const handleKeyDown = (0, import_react73.useMemo)(() => {
      return createKeyboardRovingFocus({
        itemCount: processedData.length,
        currentIndex: focusedIndex,
        onIndexChange: (newIdx) => {
          setFocusedIndex(newIdx);
          setHoveredPoint({
            data: processedData[newIdx],
            index: newIdx,
            seriesKey: normalizedSeries[focusedSeriesIndex]?.key
          });
        },
        onSelect: (idx) => {
          if (onSelect && processedData[idx]) {
            onSelect(processedData[idx], normalizedSeries[focusedSeriesIndex]?.key);
          }
        },
        onDismiss: () => {
          setHoveredPoint(null);
          setFocusedIndex(-1);
          setActiveSeries(null);
        },
        onToggleTable: () => {
          setIsTableView((prev) => !prev);
        }
      });
    }, [processedData, focusedIndex, normalizedSeries, focusedSeriesIndex, onSelect]);
    if (loading) {
      return /* @__PURE__ */ import_react73.default.createElement(
        "div",
        {
          ref: containerRef,
          className: `mer-barchart-container mer-barchart-loading ${className}`,
          style: { width, height, position: "relative", display: "flex", flexDirection: "column", ...style },
          "aria-busy": "true",
          "aria-label": "Loading bar chart data...",
          ...rest
        },
        /* @__PURE__ */ import_react73.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 12 } }, /* @__PURE__ */ import_react73.default.createElement("div", { style: { width: 140, height: 16, background: "var(--surface-sunken)", borderRadius: "var(--radius-xs)", animation: "mer-skeleton-sweep 1.4s ease-in-out infinite" } }), /* @__PURE__ */ import_react73.default.createElement("div", { style: { width: 60, height: 14, background: "var(--surface-sunken)", borderRadius: "var(--radius-xs)" } })),
        /* @__PURE__ */ import_react73.default.createElement("div", { style: { flex: 1, display: "flex", alignItems: "flex-end", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--border-hairline)" } }, [60, 85, 45, 95, 70, 40].map((h, i) => /* @__PURE__ */ import_react73.default.createElement(
          "div",
          {
            key: i,
            style: {
              flex: 1,
              height: `${h}%`,
              background: "var(--surface-sunken)",
              borderRadius: "var(--radius-xs) var(--radius-xs) 0 0",
              animation: "mer-skeleton-sweep 1.4s ease-in-out infinite",
              animationDelay: `${i * 100}ms`
            }
          }
        )))
      );
    }
    if (!data || data.length === 0) {
      return /* @__PURE__ */ import_react73.default.createElement(
        "div",
        {
          ref: containerRef,
          className: `mer-barchart-container mer-barchart-empty ${className}`,
          style: {
            width,
            height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--surface-card)",
            border: "var(--border-hairline)",
            borderRadius: "var(--radius-md)",
            padding: 24,
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-sans)",
            ...style
          },
          ...rest
        },
        /* @__PURE__ */ import_react73.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", style: { marginBottom: 8, opacity: 0.6 } }, /* @__PURE__ */ import_react73.default.createElement("line", { x1: "18", y1: "20", x2: "18", y2: "10" }), /* @__PURE__ */ import_react73.default.createElement("line", { x1: "12", y1: "20", x2: "12", y2: "4" }), /* @__PURE__ */ import_react73.default.createElement("line", { x1: "6", y1: "20", x2: "6", y2: "14" }), /* @__PURE__ */ import_react73.default.createElement("line", { x1: "2", y1: "20", x2: "22", y2: "20" })),
        /* @__PURE__ */ import_react73.default.createElement("span", { style: { fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" } }, emptyText)
      );
    }
    return /* @__PURE__ */ import_react73.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `mer-barchart-root ${className}`,
        style: {
          width,
          fontFamily: "var(--font-sans)",
          color: "var(--text-primary)",
          position: "relative",
          ...style
        },
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "region",
        "aria-label": caption || title || "Bar chart data visualization",
        ...rest
      },
      (title || caption || showTableToggle) && /* @__PURE__ */ import_react73.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12 } }, /* @__PURE__ */ import_react73.default.createElement("div", null, title && /* @__PURE__ */ import_react73.default.createElement("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" } }, title), caption && /* @__PURE__ */ import_react73.default.createElement("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-secondary)" } }, caption)), showTableToggle && /* @__PURE__ */ import_react73.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => setIsTableView(!isTableView),
          style: {
            background: "transparent",
            border: "var(--border-hairline)",
            borderRadius: "var(--radius-xs)",
            padding: "2px 8px",
            fontSize: "var(--text-2xs)",
            fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4
          },
          title: "Toggle accessible tabular view (Alt+F11)",
          "aria-pressed": isTableView
        },
        /* @__PURE__ */ import_react73.default.createElement("span", null, isTableView ? "\u{1F4CA} Chart View" : "\u{1F4CB} Table View")
      )),
      isTableView ? /* @__PURE__ */ import_react73.default.createElement("div", { style: { maxHeight: height, overflow: "auto", border: "var(--border-hairline)", borderRadius: "var(--radius-md)" } }, /* @__PURE__ */ import_react73.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" } }, /* @__PURE__ */ import_react73.default.createElement("thead", null, /* @__PURE__ */ import_react73.default.createElement("tr", { style: { background: "var(--surface-sunken)", borderBottom: "var(--border-hairline)" } }, /* @__PURE__ */ import_react73.default.createElement("th", { scope: "col", style: { padding: "8px 12px", textAlign: "left", fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" } }, "Category"), normalizedSeries.map((s) => /* @__PURE__ */ import_react73.default.createElement("th", { key: s.key, scope: "col", style: { padding: "8px 12px", textAlign: "right", fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" } }, s.label, " ", unit ? `(${unit})` : "")))), /* @__PURE__ */ import_react73.default.createElement("tbody", null, processedData.map((d, i) => /* @__PURE__ */ import_react73.default.createElement("tr", { key: i, style: { borderBottom: "var(--border-subtle)" } }, /* @__PURE__ */ import_react73.default.createElement("th", { scope: "row", style: { padding: "8px 12px", textAlign: "left", fontWeight: "var(--weight-medium)" } }, d._category), normalizedSeries.map((s) => {
        const rawVal = d[s.key];
        return /* @__PURE__ */ import_react73.default.createElement("td", { key: s.key, style: { padding: "8px 12px", textAlign: "right", fontFamily: "var(--font-mono)" } }, formatVizValue(rawVal, isNormalized ? "%" : unit, "en-IN"));
      })))))) : (
        /* SVG Graphical Bar Chart Canvas */
        /* @__PURE__ */ import_react73.default.createElement("div", { style: { position: "relative", width: "100%", height: svgDimensions.height } }, /* @__PURE__ */ import_react73.default.createElement(
          "svg",
          {
            width: "100%",
            height: svgDimensions.height,
            viewBox: `0 0 ${svgDimensions.width} ${svgDimensions.height}`,
            role: "graphics-document",
            "aria-roledescription": "bar chart",
            style: { overflow: "visible" }
          },
          /* @__PURE__ */ import_react73.default.createElement("desc", null, description || `${title || "Bar chart"} displaying ${processedData.length} categories from ${formatVizValue(computedMin, unit)} to ${formatVizValue(computedMax, unit)}.`),
          /* @__PURE__ */ import_react73.default.createElement("defs", null, PATTERN_PRESETS.map((p) => /* @__PURE__ */ import_react73.default.createElement(
            "pattern",
            {
              key: p.id,
              id: `${chartId}-${p.id}`,
              width: "6",
              height: "6",
              patternTransform: p.transform || void 0,
              patternUnits: "userSpaceOnUse"
            },
            p.type === "circle" ? /* @__PURE__ */ import_react73.default.createElement("circle", { cx: "2", cy: "2", r: p.r, fill: p.fill }) : p.id === "pat-cross" ? /* @__PURE__ */ import_react73.default.createElement(import_react73.default.Fragment, null, /* @__PURE__ */ import_react73.default.createElement("line", { x1: "0", y1: "0", x2: "6", y2: "6", stroke: p.stroke, strokeWidth: p.strokeWidth }), /* @__PURE__ */ import_react73.default.createElement("line", { x1: "6", y1: "0", x2: "0", y2: "6", stroke: p.stroke, strokeWidth: p.strokeWidth })) : /* @__PURE__ */ import_react73.default.createElement("line", { x1: "0", y1: "0", x2: "0", y2: "6", stroke: p.stroke, strokeWidth: p.strokeWidth })
          ))),
          /* @__PURE__ */ import_react73.default.createElement("g", { className: "layer-threshold-bands" }, thresholdBands.map((tb, i) => {
            const startPos = quantitativeScale(tb.min);
            const endPos = quantitativeScale(tb.max);
            const toneColor = tb.tone === "critical" ? "var(--status-critical-soft, rgba(239,68,68,0.12))" : "var(--status-warning-soft, rgba(245,158,11,0.12))";
            if (isHorizontal) {
              const x = Math.min(startPos, endPos) + margins.left;
              const w = Math.abs(endPos - startPos);
              return /* @__PURE__ */ import_react73.default.createElement("rect", { key: i, x, y: margins.top, width: w, height: plotRegion.plotHeight, fill: toneColor, opacity: "0.6" });
            }
            const y = Math.min(startPos, endPos) + margins.top;
            const h = Math.abs(endPos - startPos);
            return /* @__PURE__ */ import_react73.default.createElement("rect", { key: i, x: margins.left, y, width: plotRegion.plotWidth, height: h, fill: toneColor, opacity: "0.6" });
          })),
          showGrid && /* @__PURE__ */ import_react73.default.createElement("g", { className: "layer-gridlines" }, ticks.map((tickVal, i) => {
            const pos = quantitativeScale(tickVal);
            if (isHorizontal) {
              const x = margins.left + pos;
              return /* @__PURE__ */ import_react73.default.createElement("g", { key: i }, /* @__PURE__ */ import_react73.default.createElement(
                "line",
                {
                  x1: x,
                  y1: margins.top,
                  x2: x,
                  y2: margins.top + plotRegion.plotHeight,
                  stroke: "var(--border-subtle, rgba(0,0,0,0.06))",
                  strokeDasharray: tickVal === baseline ? "none" : "3 3",
                  strokeWidth: tickVal === baseline ? "1.5" : "1"
                }
              ), /* @__PURE__ */ import_react73.default.createElement(
                "text",
                {
                  x,
                  y: margins.top + plotRegion.plotHeight + 16,
                  textAnchor: "middle",
                  fontSize: "10",
                  fontFamily: "var(--font-mono)",
                  fill: "var(--text-tertiary)"
                },
                formatVizValue(tickVal, isNormalized ? "%" : unit)
              ));
            }
            const y = margins.top + pos;
            return /* @__PURE__ */ import_react73.default.createElement("g", { key: i }, /* @__PURE__ */ import_react73.default.createElement(
              "line",
              {
                x1: margins.left,
                y1: y,
                x2: margins.left + plotRegion.plotWidth,
                y2: y,
                stroke: "var(--border-subtle, rgba(0,0,0,0.06))",
                strokeDasharray: tickVal === baseline ? "none" : "3 3",
                strokeWidth: tickVal === baseline ? "1.5" : "1"
              }
            ), /* @__PURE__ */ import_react73.default.createElement(
              "text",
              {
                x: margins.left - 8,
                y: y + 3,
                textAnchor: "end",
                fontSize: "10",
                fontFamily: "var(--font-mono)",
                fill: "var(--text-tertiary)"
              },
              formatVizValue(tickVal, isNormalized ? "%" : unit)
            ));
          })),
          baseline >= computedMin && baseline <= computedMax && /* @__PURE__ */ import_react73.default.createElement(
            "line",
            {
              x1: isHorizontal ? margins.left + baselinePos : margins.left,
              y1: isHorizontal ? margins.top : margins.top + baselinePos,
              x2: isHorizontal ? margins.left + baselinePos : margins.left + plotRegion.plotWidth,
              y2: isHorizontal ? margins.top + plotRegion.plotHeight : margins.top + baselinePos,
              stroke: "var(--border-strong, #64748b)",
              strokeWidth: "1.5"
            }
          ),
          /* @__PURE__ */ import_react73.default.createElement("g", { className: "layer-reference-lines" }, referenceLines.map((rl, idx) => {
            const pos = quantitativeScale(rl.value);
            const color = rl.tone === "danger" ? VIZ_SEMANTIC_COLORS.critical : rl.tone === "warning" ? VIZ_SEMANTIC_COLORS.warning : VIZ_SEMANTIC_COLORS.info;
            if (isHorizontal) {
              const x = margins.left + pos;
              return /* @__PURE__ */ import_react73.default.createElement("g", { key: `rl-${idx}` }, /* @__PURE__ */ import_react73.default.createElement("line", { x1: x, y1: margins.top, x2: x, y2: margins.top + plotRegion.plotHeight, stroke: color, strokeDasharray: "4 3", strokeWidth: "1.5" }), /* @__PURE__ */ import_react73.default.createElement("text", { x, y: margins.top - 4, textAnchor: "middle", fontSize: "9", fontFamily: "var(--font-mono)", fill: color, fontWeight: "var(--weight-semibold)" }, rl.label || formatVizValue(rl.value, unit)));
            }
            const y = margins.top + pos;
            return /* @__PURE__ */ import_react73.default.createElement("g", { key: `rl-${idx}` }, /* @__PURE__ */ import_react73.default.createElement("line", { x1: margins.left, y1: y, x2: margins.left + plotRegion.plotWidth, y2: y, stroke: color, strokeDasharray: "4 3", strokeWidth: "1.5" }), /* @__PURE__ */ import_react73.default.createElement("text", { x: margins.left + plotRegion.plotWidth - 4, y: y - 4, textAnchor: "end", fontSize: "9", fontFamily: "var(--font-mono)", fill: color, fontWeight: "var(--weight-semibold)" }, rl.label || formatVizValue(rl.value, unit)));
          })),
          /* @__PURE__ */ import_react73.default.createElement("g", { className: "layer-bar-marks" }, processedData.map((d, catIndex) => {
            const isSelected = selectedKey != null && d[categoryKey] === selectedKey;
            const isFocused = focusedIndex === catIndex;
            const isHovered = hoveredPoint?.index === catIndex;
            const bandPos = categoricalScale(d._category);
            const bandWidth = categoricalScale.bandwidth();
            if (isHorizontal) {
              const catCenterY = margins.top + bandPos + bandWidth / 2;
              const catY = margins.top + bandPos;
              return /* @__PURE__ */ import_react73.default.createElement(
                "g",
                {
                  key: catIndex,
                  role: "graphics-symbol",
                  "aria-label": `${d._category}: ${normalizedSeries.map((s) => `${s.label} ${d[s.key]}`).join(", ")}`,
                  tabIndex: -1,
                  onMouseEnter: () => setHoveredPoint({ data: d, index: catIndex }),
                  onMouseLeave: () => setHoveredPoint(null),
                  onClick: () => onSelect && onSelect(d),
                  style: { cursor: onSelect ? "pointer" : "default" }
                },
                /* @__PURE__ */ import_react73.default.createElement(
                  "text",
                  {
                    x: margins.left - 10,
                    y: catCenterY + 3.5,
                    textAnchor: "end",
                    fontSize: "11",
                    fontFamily: "var(--font-sans)",
                    fontWeight: isHovered || isSelected ? "var(--weight-semibold)" : "var(--weight-regular)",
                    fill: isHovered || isSelected ? "var(--text-primary)" : "var(--text-secondary)"
                  },
                  d._category
                ),
                isGrouped ? normalizedSeries.map((s, sIdx) => {
                  const subH = bandWidth / normalizedSeries.length;
                  const barY = catY + sIdx * subH;
                  const rawVal = Number(d[s.key]) || 0;
                  const barPos = quantitativeScale(rawVal);
                  const startX = margins.left + Math.min(baselinePos, barPos);
                  const barW = Math.abs(barPos - baselinePos);
                  const isDimmed = activeSeries && activeSeries !== s.key;
                  return /* @__PURE__ */ import_react73.default.createElement(
                    "rect",
                    {
                      key: s.key,
                      x: startX,
                      y: barY,
                      width: Math.max(2, barW),
                      height: Math.max(2, subH - 2),
                      rx: "2",
                      fill: s.color,
                      opacity: isDimmed ? 0.25 : isHovered ? 0.95 : 0.85,
                      stroke: isFocused && focusedSeriesIndex === sIdx ? "var(--action-solid)" : isSelected ? "var(--text-primary)" : "none",
                      strokeWidth: isSelected || isFocused ? 2 : 0
                    }
                  );
                }) : isStacked ? normalizedSeries.map((s) => {
                  const stack = d._stackOffsets[s.key];
                  if (!stack || stack.val === 0) return null;
                  const startX = margins.left + quantitativeScale(stack.start);
                  const endX = margins.left + quantitativeScale(stack.end);
                  const barW = Math.abs(endX - startX);
                  const x = Math.min(startX, endX);
                  return /* @__PURE__ */ import_react73.default.createElement("rect", { key: s.key, x, y: catY, width: Math.max(1, barW), height: bandWidth, fill: s.color, opacity: isHovered ? 0.95 : 0.85 });
                }) : (() => {
                  const rawVal = Number(d[valueKey]) || 0;
                  const barPos = quantitativeScale(rawVal);
                  const startX = margins.left + Math.min(baselinePos, barPos);
                  const barW = Math.abs(barPos - baselinePos);
                  const barColor = isDiverging ? rawVal >= 0 ? VIZ_SEMANTIC_COLORS.success : VIZ_SEMANTIC_COLORS.critical : normalizedSeries[0].color;
                  return /* @__PURE__ */ import_react73.default.createElement("g", null, /* @__PURE__ */ import_react73.default.createElement(
                    "rect",
                    {
                      x: startX,
                      y: catY,
                      width: Math.max(2, barW),
                      height: bandWidth,
                      rx: "2",
                      fill: barColor,
                      opacity: isHovered ? 0.95 : 0.85,
                      stroke: isFocused ? "var(--action-solid)" : isSelected ? "var(--text-primary)" : "none",
                      strokeWidth: isSelected || isFocused ? 2 : 0
                    }
                  ), showValues && /* @__PURE__ */ import_react73.default.createElement("text", { x: startX + barW + 6, y: catCenterY + 3.5, fontSize: "10", fontFamily: "var(--font-mono)", fill: "var(--text-secondary)" }, formatVizValue(rawVal, unit)));
                })()
              );
            }
            const catCenterX = margins.left + bandPos + bandWidth / 2;
            const catX = margins.left + bandPos;
            return /* @__PURE__ */ import_react73.default.createElement(
              "g",
              {
                key: catIndex,
                role: "graphics-symbol",
                "aria-label": `${d._category}: ${normalizedSeries.map((s) => `${s.label} ${d[s.key]}`).join(", ")}`,
                tabIndex: -1,
                onMouseEnter: () => setHoveredPoint({ data: d, index: catIndex }),
                onMouseLeave: () => setHoveredPoint(null),
                onClick: () => onSelect && onSelect(d),
                style: { cursor: onSelect ? "pointer" : "default" }
              },
              /* @__PURE__ */ import_react73.default.createElement(
                "text",
                {
                  x: catCenterX,
                  y: margins.top + plotRegion.plotHeight + 16,
                  textAnchor: "middle",
                  fontSize: "11",
                  fontFamily: "var(--font-sans)",
                  fontWeight: isHovered || isSelected ? "var(--weight-semibold)" : "var(--weight-regular)",
                  fill: isHovered || isSelected ? "var(--text-primary)" : "var(--text-secondary)"
                },
                d._category
              ),
              isGrouped ? normalizedSeries.map((s, sIdx) => {
                const subW = bandWidth / normalizedSeries.length;
                const barX = catX + sIdx * subW;
                const rawVal = Number(d[s.key]) || 0;
                const barPos = quantitativeScale(rawVal);
                const startY = margins.top + Math.min(baselinePos, barPos);
                const barH = Math.abs(barPos - baselinePos);
                const isDimmed = activeSeries && activeSeries !== s.key;
                return /* @__PURE__ */ import_react73.default.createElement(
                  "rect",
                  {
                    key: s.key,
                    x: barX,
                    y: startY,
                    width: Math.max(2, subW - 2),
                    height: Math.max(2, barH),
                    rx: "2",
                    fill: s.color,
                    opacity: isDimmed ? 0.25 : isHovered ? 0.95 : 0.85,
                    stroke: isFocused && focusedSeriesIndex === sIdx ? "var(--action-solid)" : isSelected ? "var(--text-primary)" : "none",
                    strokeWidth: isSelected || isFocused ? 2 : 0
                  }
                );
              }) : isStacked ? normalizedSeries.map((s) => {
                const stack = d._stackOffsets[s.key];
                if (!stack || stack.val === 0) return null;
                const startY = margins.top + quantitativeScale(stack.start);
                const endY = margins.top + quantitativeScale(stack.end);
                const barH = Math.abs(startY - endY);
                const y = Math.min(startY, endY);
                return /* @__PURE__ */ import_react73.default.createElement("rect", { key: s.key, x: catX, y, width: bandWidth, height: Math.max(1, barH), fill: s.color, opacity: isHovered ? 0.95 : 0.85 });
              }) : isNormalized ? normalizedSeries.map((s) => {
                const pctInfo = d._percentages[s.key];
                if (!pctInfo || pctInfo.pct === 0) return null;
                const startY = margins.top + quantitativeScale(pctInfo.startPct);
                const endY = margins.top + quantitativeScale(pctInfo.endPct);
                const barH = Math.abs(startY - endY);
                const y = Math.min(startY, endY);
                return /* @__PURE__ */ import_react73.default.createElement("rect", { key: s.key, x: catX, y, width: bandWidth, height: Math.max(1, barH), fill: s.color, opacity: isHovered ? 0.95 : 0.85 });
              }) : isFloating ? (() => {
                const startY = margins.top + quantitativeScale(d._start);
                const endY = margins.top + quantitativeScale(d._end);
                const barH = Math.abs(startY - endY);
                const y = Math.min(startY, endY);
                return /* @__PURE__ */ import_react73.default.createElement(
                  "rect",
                  {
                    x: catX,
                    y,
                    width: bandWidth,
                    height: Math.max(2, barH),
                    rx: "2",
                    fill: normalizedSeries[0].color,
                    opacity: isHovered ? 0.95 : 0.85,
                    stroke: isFocused ? "var(--action-solid)" : isSelected ? "var(--text-primary)" : "none",
                    strokeWidth: isSelected || isFocused ? 2 : 0
                  }
                );
              })() : (() => {
                const rawVal = Number(d[valueKey]) || 0;
                const barPos = quantitativeScale(rawVal);
                const startY = margins.top + Math.min(baselinePos, barPos);
                const barH = Math.abs(barPos - baselinePos);
                return /* @__PURE__ */ import_react73.default.createElement("g", null, /* @__PURE__ */ import_react73.default.createElement(
                  "rect",
                  {
                    x: catX,
                    y: startY,
                    width: bandWidth,
                    height: Math.max(2, barH),
                    rx: "2",
                    fill: normalizedSeries[0].color,
                    opacity: isHovered ? 0.95 : 0.85,
                    stroke: isFocused ? "var(--action-solid)" : isSelected ? "var(--text-primary)" : "none",
                    strokeWidth: isSelected || isFocused ? 2 : 0
                  }
                ), showValues && /* @__PURE__ */ import_react73.default.createElement("text", { x: catCenterX, y: startY - 6, textAnchor: "middle", fontSize: "10", fontFamily: "var(--font-mono)", fill: "var(--text-secondary)" }, formatVizValue(rawVal, unit)));
              })()
            );
          }))
        ), showTooltip && hoveredPoint && /* @__PURE__ */ import_react73.default.createElement(
          "div",
          {
            className: "mer-barchart-tooltip",
            style: {
              position: "absolute",
              top: 8,
              right: 8,
              background: "var(--surface-card, #ffffff)",
              border: "var(--border-hairline, 1px solid rgba(0,0,0,0.12))",
              borderRadius: "var(--radius-sm, 4px)",
              boxShadow: "var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08))",
              padding: "8px 12px",
              fontSize: "var(--text-xs, 12px)",
              pointerEvents: "none",
              zIndex: LAYER_STACK.TOOLTIP_AND_OVERLAYS,
              minWidth: 140,
              lineHeight: 1.4
            }
          },
          /* @__PURE__ */ import_react73.default.createElement("div", { style: { fontWeight: "var(--weight-semibold)", color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 4, marginBottom: 4 } }, hoveredPoint.data._category),
          normalizedSeries.map((s) => {
            const val = hoveredPoint.data[s.key];
            return /* @__PURE__ */ import_react73.default.createElement("div", { key: s.key, style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 2 } }, /* @__PURE__ */ import_react73.default.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" } }, /* @__PURE__ */ import_react73.default.createElement("span", { style: { width: 8, height: 8, borderRadius: "50%", background: s.color } }), s.label), /* @__PURE__ */ import_react73.default.createElement("span", { style: { fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)", color: "var(--text-primary)" } }, formatVizValue(val, isNormalized ? "%" : unit)));
          })
        ))
      ),
      showLegend && normalizedSeries.length > 1 && !isTableView && /* @__PURE__ */ import_react73.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginTop: 12, paddingTop: 8, borderTop: "var(--border-subtle)" } }, normalizedSeries.map((s) => {
        const isDimmed = activeSeries && activeSeries !== s.key;
        return /* @__PURE__ */ import_react73.default.createElement(
          "button",
          {
            key: s.key,
            type: "button",
            onClick: () => setActiveSeries(activeSeries === s.key ? null : s.key),
            style: {
              background: "transparent",
              border: "none",
              padding: "2px 4px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              opacity: isDimmed ? 0.35 : 1,
              fontSize: "var(--text-xs)",
              color: "var(--text-secondary)"
            },
            title: `Click to isolate ${s.label}`
          },
          /* @__PURE__ */ import_react73.default.createElement("span", { style: { width: 10, height: 10, borderRadius: 2, background: s.color } }),
          /* @__PURE__ */ import_react73.default.createElement("span", null, s.label)
        );
      }))
    );
  }

  // components/data/LineChart.jsx
  var import_react74 = __toESM(require_react(), 1);
  function LineChart({
    data = [],
    xKey = "timestamp",
    yKey = "value",
    series = null,
    // array of { key: string, label: string, color?: string, strokeDash?: string, symbol?: string }
    variant = "single",
    // 'single' | 'multi' | 'stepped' | 'indexed' | 'small-multiples'
    interpolation = "linear",
    // 'linear' | 'step' | 'step-after' | 'monotone' | 'smooth'
    compareMode = "absolute",
    // 'absolute' | 'indexed'
    pointVisibility = "hover",
    // 'always' | 'hover' | 'never' | 'endpoints'
    missingValuePolicy = "dashed",
    // 'dashed' | 'gap' | 'zero'
    title = "",
    caption = "",
    description = "",
    unit = "",
    valueFormatter = null,
    referenceLines = [],
    thresholdBands = [],
    domain = null,
    // [min, max]
    selectedKey = null,
    onSelect = null,
    showGrid = true,
    showCrosshair = true,
    showLegend = true,
    showTooltip = true,
    showTableToggle = true,
    loading = false,
    emptyText = "No trajectory data available for this range",
    height = 280,
    width = "100%",
    className = "",
    style = {},
    ...rest
  }) {
    const chartId = (0, import_react74.useId)().replace(/:/g, "-");
    const containerRef = (0, import_react74.useRef)(null);
    const [hoveredPointIndex, setHoveredPointIndex] = (0, import_react74.useState)(null);
    const [activeSeries, setActiveSeries] = (0, import_react74.useState)(null);
    const [focusedIndex, setFocusedIndex] = (0, import_react74.useState)(-1);
    const [focusedSeriesIndex, setFocusedSeriesIndex] = (0, import_react74.useState)(0);
    const [isTableView, setIsTableView] = (0, import_react74.useState)(false);
    const [svgDimensions, setSvgDimensions] = (0, import_react74.useState)({
      width: 600,
      height: typeof height === "number" ? height : 280
    });
    const isStepped = variant === "stepped" || interpolation === "step" || interpolation === "step-after";
    const isIndexed = variant === "indexed" || compareMode === "indexed";
    const isSmallMultiples = variant === "small-multiples";
    (0, import_react74.useEffect)(() => {
      if (!containerRef.current) return;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: w, height: h } = entry.contentRect;
          if (w > 0) {
            setSvgDimensions({
              width: w,
              height: typeof height === "number" ? height : Math.max(220, h || 280)
            });
          }
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [height]);
    const normalizedSeries = (0, import_react74.useMemo)(() => {
      if (series && Array.isArray(series) && series.length > 0) {
        return series.map((s, idx) => ({
          key: typeof s === "string" ? s : s.key,
          label: typeof s === "string" ? s : s.label || s.key,
          color: typeof s === "object" && s.color ? s.color : VIZ_COLORS[idx % VIZ_COLORS.length],
          strokeDash: typeof s === "object" && s.strokeDash ? s.strokeDash : STROKE_DASH_PATTERNS[idx % STROKE_DASH_PATTERNS.length],
          symbol: typeof s === "object" && s.symbol ? s.symbol : POINT_SYMBOLS[idx % POINT_SYMBOLS.length]
        }));
      }
      return [{
        key: yKey,
        label: title || "Value",
        color: VIZ_COLORS[0],
        strokeDash: "none",
        symbol: POINT_SYMBOLS[0]
      }];
    }, [series, yKey, title]);
    const processedData = (0, import_react74.useMemo)(() => {
      if (!data || data.length === 0) return [];
      const initialValues = {};
      if (isIndexed && data.length > 0) {
        normalizedSeries.forEach((s) => {
          const firstValid = data.find((d) => d[s.key] != null && !isNaN(Number(d[s.key])));
          initialValues[s.key] = firstValid ? Number(firstValid[s.key]) : 1;
        });
      }
      return data.map((item, idx) => {
        const xVal = item[xKey] != null ? item[xKey] : idx;
        const point = { ...item, _x: xVal, _raw: item };
        normalizedSeries.forEach((s) => {
          const raw = item[s.key];
          if (raw == null || isNaN(Number(raw))) {
            point[`_val_${s.key}`] = null;
            point[`_display_${s.key}`] = null;
          } else if (isIndexed) {
            const base = initialValues[s.key] || 1;
            const pctChange = (Number(raw) - base) / (base || 1) * 100;
            point[`_val_${s.key}`] = pctChange;
            point[`_display_${s.key}`] = `${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%`;
          } else {
            point[`_val_${s.key}`] = Number(raw);
            point[`_display_${s.key}`] = formatVizValue(raw, unit, "en-IN");
          }
        });
        return point;
      });
    }, [data, xKey, normalizedSeries, isIndexed, unit]);
    const [computedMinY, computedMaxY] = (0, import_react74.useMemo)(() => {
      if (domain && Array.isArray(domain) && domain.length === 2) {
        return domain;
      }
      if (processedData.length === 0) {
        return [0, 100];
      }
      let min = Infinity;
      let max = -Infinity;
      processedData.forEach((d) => {
        normalizedSeries.forEach((s) => {
          const v = d[`_val_${s.key}`];
          if (v != null) {
            if (v < min) min = v;
            if (v > max) max = v;
          }
        });
      });
      referenceLines.forEach((rl) => {
        if (rl.value > max) max = rl.value;
        if (rl.value < min) min = rl.value;
      });
      if (min === Infinity || max === -Infinity) {
        return [0, 100];
      }
      if (min === max) {
        min = min - 10;
        max = max + 10;
      } else {
        const diff = max - min;
        max = max + diff * 0.08;
        min = min - diff * 0.08;
      }
      if (isIndexed) {
        if (min > 0) min = 0;
        if (max < 0) max = 0;
      }
      return [min, max];
    }, [domain, processedData, normalizedSeries, referenceLines, isIndexed]);
    const margins = (0, import_react74.useMemo)(() => ({
      top: 20,
      right: 32,
      bottom: 36,
      left: isIndexed ? 64 : 54
    }), [isIndexed]);
    const plotRegion = (0, import_react74.useMemo)(() => {
      return createPlotRegion({
        containerWidth: svgDimensions.width,
        containerHeight: svgDimensions.height,
        margins
      });
    }, [svgDimensions, margins]);
    const yScale = (0, import_react74.useMemo)(() => {
      return createLinearScale({
        domain: [computedMinY, computedMaxY],
        range: [plotRegion.plotHeight, 0]
      });
    }, [computedMinY, computedMaxY, plotRegion]);
    const getX = (0, import_react74.useMemo)(() => {
      return (index) => {
        if (processedData.length <= 1) return plotRegion.plotWidth / 2;
        return index / (processedData.length - 1) * plotRegion.plotWidth;
      };
    }, [processedData.length, plotRegion.plotWidth]);
    const yTicks = (0, import_react74.useMemo)(() => generateTicks(yScale, 5), [yScale]);
    const handleKeyDown = (0, import_react74.useMemo)(() => {
      return createKeyboardRovingFocus({
        itemCount: processedData.length,
        currentIndex: focusedIndex,
        onIndexChange: (newIdx) => {
          setFocusedIndex(newIdx);
          setHoveredPointIndex(newIdx);
        },
        onSelect: (idx) => {
          if (onSelect && processedData[idx]) {
            onSelect(processedData[idx]._raw, normalizedSeries[focusedSeriesIndex]?.key);
          }
        },
        onDismiss: () => {
          setHoveredPointIndex(null);
          setFocusedIndex(-1);
          setActiveSeries(null);
        },
        onToggleTable: () => {
          setIsTableView((prev) => !prev);
        }
      });
    }, [processedData, focusedIndex, normalizedSeries, focusedSeriesIndex, onSelect]);
    if (loading) {
      return /* @__PURE__ */ import_react74.default.createElement(
        "div",
        {
          ref: containerRef,
          className: `mer-linechart-container mer-linechart-loading ${className}`,
          style: { width, height, position: "relative", display: "flex", flexDirection: "column", ...style },
          "aria-busy": "true",
          "aria-label": "Loading trajectory data...",
          ...rest
        },
        /* @__PURE__ */ import_react74.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 12 } }, /* @__PURE__ */ import_react74.default.createElement("div", { style: { width: 160, height: 16, background: "var(--surface-sunken)", borderRadius: "var(--radius-xs)", animation: "mer-skeleton-sweep 1.4s ease-in-out infinite" } }), /* @__PURE__ */ import_react74.default.createElement("div", { style: { width: 80, height: 14, background: "var(--surface-sunken)", borderRadius: "var(--radius-xs)" } })),
        /* @__PURE__ */ import_react74.default.createElement("div", { style: { flex: 1, position: "relative", borderBottom: "1px solid var(--border-hairline)" } }, /* @__PURE__ */ import_react74.default.createElement("svg", { width: "100%", height: "100%", style: { opacity: 0.4 } }, /* @__PURE__ */ import_react74.default.createElement(
          "path",
          {
            d: `M 20 ${svgDimensions.height * 0.7} Q ${svgDimensions.width * 0.3} ${svgDimensions.height * 0.2}, ${svgDimensions.width * 0.6} ${svgDimensions.height * 0.5} T ${svgDimensions.width - 20} ${svgDimensions.height * 0.3}`,
            fill: "none",
            stroke: "var(--border-strong)",
            strokeWidth: "2",
            strokeDasharray: "4 4"
          }
        )))
      );
    }
    if (!data || data.length === 0) {
      return /* @__PURE__ */ import_react74.default.createElement(
        "div",
        {
          ref: containerRef,
          className: `mer-linechart-container mer-linechart-empty ${className}`,
          style: {
            width,
            height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--surface-card)",
            border: "var(--border-hairline)",
            borderRadius: "var(--radius-md)",
            padding: 24,
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-sans)",
            ...style
          },
          ...rest
        },
        /* @__PURE__ */ import_react74.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", style: { marginBottom: 8, opacity: 0.6 } }, /* @__PURE__ */ import_react74.default.createElement("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" })),
        /* @__PURE__ */ import_react74.default.createElement("span", { style: { fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" } }, emptyText)
      );
    }
    const effectiveInterpolation = isStepped ? "step" : interpolation;
    return /* @__PURE__ */ import_react74.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `mer-linechart-root ${className}`,
        style: {
          width,
          fontFamily: "var(--font-sans)",
          color: "var(--text-primary)",
          position: "relative",
          ...style
        },
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "region",
        "aria-label": caption || title || "Line chart trajectory visualization",
        ...rest
      },
      (title || caption || showTableToggle) && /* @__PURE__ */ import_react74.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12 } }, /* @__PURE__ */ import_react74.default.createElement("div", null, title && /* @__PURE__ */ import_react74.default.createElement("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" } }, title), caption && /* @__PURE__ */ import_react74.default.createElement("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-secondary)" } }, caption)), showTableToggle && /* @__PURE__ */ import_react74.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => setIsTableView(!isTableView),
          style: {
            background: "transparent",
            border: "var(--border-hairline)",
            borderRadius: "var(--radius-xs)",
            padding: "2px 8px",
            fontSize: "var(--text-2xs)",
            fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4
          },
          title: "Toggle accessible tabular view (Alt+F11)",
          "aria-pressed": isTableView
        },
        /* @__PURE__ */ import_react74.default.createElement("span", null, isTableView ? "\u{1F4CA} Chart View" : "\u{1F4CB} Table View")
      )),
      isTableView ? /* @__PURE__ */ import_react74.default.createElement("div", { style: { maxHeight: height, overflow: "auto", border: "var(--border-hairline)", borderRadius: "var(--radius-md)" } }, /* @__PURE__ */ import_react74.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" } }, /* @__PURE__ */ import_react74.default.createElement("thead", null, /* @__PURE__ */ import_react74.default.createElement("tr", { style: { background: "var(--surface-sunken)", borderBottom: "var(--border-hairline)" } }, /* @__PURE__ */ import_react74.default.createElement("th", { scope: "col", style: { padding: "8px 12px", textAlign: "left", fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" } }, "Timestamp / Step"), normalizedSeries.map((s) => /* @__PURE__ */ import_react74.default.createElement("th", { key: s.key, scope: "col", style: { padding: "8px 12px", textAlign: "right", fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" } }, s.label, " ", isIndexed ? "(%)" : unit ? `(${unit})` : "")))), /* @__PURE__ */ import_react74.default.createElement("tbody", null, processedData.map((d, i) => /* @__PURE__ */ import_react74.default.createElement("tr", { key: i, style: { borderBottom: "var(--border-subtle)" } }, /* @__PURE__ */ import_react74.default.createElement("th", { scope: "row", style: { padding: "8px 12px", textAlign: "left", fontWeight: "var(--weight-medium)" } }, d._x), normalizedSeries.map((s) => {
        const displayVal = d[`_display_${s.key}`];
        return /* @__PURE__ */ import_react74.default.createElement("td", { key: s.key, style: { padding: "8px 12px", textAlign: "right", fontFamily: "var(--font-mono)" } }, displayVal != null ? displayVal : "\u2014 (No Telemetry)");
      })))))) : (
        /* SVG Graphical Trajectory View */
        /* @__PURE__ */ import_react74.default.createElement("div", { style: { position: "relative", width: "100%", height: svgDimensions.height } }, /* @__PURE__ */ import_react74.default.createElement(
          "svg",
          {
            width: "100%",
            height: svgDimensions.height,
            viewBox: `0 0 ${svgDimensions.width} ${svgDimensions.height}`,
            role: "graphics-document",
            "aria-roledescription": "line chart",
            style: { overflow: "visible" }
          },
          /* @__PURE__ */ import_react74.default.createElement("desc", null, description || `${title || "Line chart"} tracking ${processedData.length} observations from ${processedData[0]?._x} to ${processedData[processedData.length - 1]?._x}.`),
          /* @__PURE__ */ import_react74.default.createElement("g", { className: "layer-threshold-bands" }, thresholdBands.map((tb, i) => {
            const y1 = yScale(tb.min);
            const y2 = yScale(tb.max);
            const toneColor = tb.tone === "critical" ? "var(--status-critical-soft, rgba(239,68,68,0.12))" : "var(--status-warning-soft, rgba(245,158,11,0.12))";
            const y = Math.min(y1, y2) + margins.top;
            const h = Math.abs(y1 - y2);
            return /* @__PURE__ */ import_react74.default.createElement("rect", { key: i, x: margins.left, y, width: plotRegion.plotWidth, height: h, fill: toneColor, opacity: "0.6" });
          })),
          showGrid && /* @__PURE__ */ import_react74.default.createElement("g", { className: "layer-gridlines" }, yTicks.map((tickVal, i) => {
            const y = margins.top + yScale(tickVal);
            return /* @__PURE__ */ import_react74.default.createElement("g", { key: i }, /* @__PURE__ */ import_react74.default.createElement(
              "line",
              {
                x1: margins.left,
                y1: y,
                x2: margins.left + plotRegion.plotWidth,
                y2: y,
                stroke: "var(--border-subtle, rgba(0,0,0,0.06))",
                strokeDasharray: tickVal === 0 ? "none" : "3 3",
                strokeWidth: tickVal === 0 ? "1.5" : "1"
              }
            ), /* @__PURE__ */ import_react74.default.createElement(
              "text",
              {
                x: margins.left - 8,
                y: y + 3,
                textAnchor: "end",
                fontSize: "10",
                fontFamily: "var(--font-mono)",
                fill: "var(--text-tertiary)"
              },
              isIndexed ? `${tickVal >= 0 ? "+" : ""}${tickVal.toFixed(0)}%` : formatVizValue(tickVal, unit)
            ));
          })),
          /* @__PURE__ */ import_react74.default.createElement("g", { className: "layer-x-axis" }, processedData.map((d, i) => {
            const total = processedData.length;
            const step2 = total > 16 ? Math.ceil(total / 6) : total > 8 ? 2 : 1;
            if (i % step2 !== 0 && i !== total - 1) return null;
            const x = margins.left + getX(i);
            return /* @__PURE__ */ import_react74.default.createElement("g", { key: i }, /* @__PURE__ */ import_react74.default.createElement("line", { x1: x, y1: margins.top + plotRegion.plotHeight, x2: x, y2: margins.top + plotRegion.plotHeight + 4, stroke: "var(--border-strong)", strokeWidth: "1" }), /* @__PURE__ */ import_react74.default.createElement(
              "text",
              {
                x,
                y: margins.top + plotRegion.plotHeight + 16,
                textAnchor: "middle",
                fontSize: "10",
                fontFamily: "var(--font-sans)",
                fill: hoveredPointIndex === i ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: hoveredPointIndex === i ? "var(--weight-semibold)" : "var(--weight-regular)"
              },
              d._x
            ));
          })),
          /* @__PURE__ */ import_react74.default.createElement("g", { className: "layer-reference-lines" }, referenceLines.map((rl, idx) => {
            const y = margins.top + yScale(rl.value);
            const color = rl.tone === "danger" ? VIZ_SEMANTIC_COLORS.critical : rl.tone === "warning" ? VIZ_SEMANTIC_COLORS.warning : VIZ_SEMANTIC_COLORS.info;
            return /* @__PURE__ */ import_react74.default.createElement("g", { key: `rl-${idx}` }, /* @__PURE__ */ import_react74.default.createElement("line", { x1: margins.left, y1: y, x2: margins.left + plotRegion.plotWidth, y2: y, stroke: color, strokeDasharray: "4 3", strokeWidth: "1.5" }), /* @__PURE__ */ import_react74.default.createElement("text", { x: margins.left + plotRegion.plotWidth - 4, y: y - 4, textAnchor: "end", fontSize: "9", fontFamily: "var(--font-mono)", fill: color, fontWeight: "var(--weight-semibold)" }, rl.label || formatVizValue(rl.value, isIndexed ? "%" : unit)));
          })),
          /* @__PURE__ */ import_react74.default.createElement("g", { className: "layer-series-lines" }, normalizedSeries.map((s, sIdx) => {
            const isDimmed = activeSeries && activeSeries !== s.key;
            const segments = [];
            let currentSegment = [];
            processedData.forEach((d, i) => {
              const val = d[`_val_${s.key}`];
              const x = margins.left + getX(i);
              if (val != null) {
                const y = margins.top + yScale(val);
                currentSegment.push({ x, y, val, index: i, raw: d });
              } else {
                if (currentSegment.length > 0) {
                  segments.push({ points: currentSegment, type: "valid" });
                  currentSegment = [];
                }
                if (missingValuePolicy === "zero") {
                  const zeroY = margins.top + yScale(0);
                  currentSegment.push({ x, y: zeroY, val: 0, index: i, raw: d });
                }
              }
            });
            if (currentSegment.length > 0) {
              segments.push({ points: currentSegment, type: "valid" });
            }
            return /* @__PURE__ */ import_react74.default.createElement("g", { key: s.key, role: "graphics-symbol", "aria-label": s.label }, segments.map((seg, segIdx) => {
              const pathD = createLinePath(seg.points, effectiveInterpolation);
              return /* @__PURE__ */ import_react74.default.createElement(
                "path",
                {
                  key: segIdx,
                  d: pathD,
                  fill: "none",
                  stroke: s.color,
                  strokeWidth: sIdx === focusedSeriesIndex ? 2.5 : 2,
                  strokeDasharray: s.strokeDash !== "none" ? s.strokeDash : void 0,
                  opacity: isDimmed ? 0.25 : 1,
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              );
            }), missingValuePolicy === "dashed" && segments.length > 1 && segments.slice(0, -1).map((seg, segIdx) => {
              const nextSeg = segments[segIdx + 1];
              const pStart = seg.points[seg.points.length - 1];
              const pEnd = nextSeg.points[0];
              return /* @__PURE__ */ import_react74.default.createElement(
                "line",
                {
                  key: `gap-${segIdx}`,
                  x1: pStart.x,
                  y1: pStart.y,
                  x2: pEnd.x,
                  y2: pEnd.y,
                  stroke: s.color,
                  strokeWidth: "1.5",
                  strokeDasharray: "2 3",
                  opacity: isDimmed ? 0.2 : 0.6
                }
              );
            }), processedData.map((d, i) => {
              const val = d[`_val_${s.key}`];
              if (val == null) return null;
              const x = margins.left + getX(i);
              const y = margins.top + yScale(val);
              const isHovered = hoveredPointIndex === i;
              const isFocused = focusedIndex === i && focusedSeriesIndex === sIdx;
              const showPoint = pointVisibility === "always" || isHovered || isFocused || pointVisibility === "endpoints" && (i === 0 || i === processedData.length - 1);
              if (!showPoint) return null;
              return /* @__PURE__ */ import_react74.default.createElement("g", { key: i, transform: `translate(${x}, ${y})` }, s.symbol === "square" ? /* @__PURE__ */ import_react74.default.createElement(
                "rect",
                {
                  x: isHovered ? -5 : -3.5,
                  y: isHovered ? -5 : -3.5,
                  width: isHovered ? 10 : 7,
                  height: isHovered ? 10 : 7,
                  fill: "var(--surface-card)",
                  stroke: s.color,
                  strokeWidth: isHovered ? 2.5 : 2
                }
              ) : s.symbol === "diamond" ? /* @__PURE__ */ import_react74.default.createElement(
                "rect",
                {
                  x: isHovered ? -4.5 : -3,
                  y: isHovered ? -4.5 : -3,
                  width: isHovered ? 9 : 6,
                  height: isHovered ? 9 : 6,
                  transform: "rotate(45)",
                  fill: "var(--surface-card)",
                  stroke: s.color,
                  strokeWidth: isHovered ? 2.5 : 2
                }
              ) : /* @__PURE__ */ import_react74.default.createElement(
                "circle",
                {
                  r: isHovered ? 5 : 3.5,
                  fill: "var(--surface-card)",
                  stroke: s.color,
                  strokeWidth: isHovered ? 2.5 : 2
                }
              ));
            }));
          })),
          showCrosshair && hoveredPointIndex != null && /* @__PURE__ */ import_react74.default.createElement("g", { className: "layer-crosshair", pointerEvents: "none" }, /* @__PURE__ */ import_react74.default.createElement(
            "line",
            {
              x1: margins.left + getX(hoveredPointIndex),
              y1: margins.top,
              x2: margins.left + getX(hoveredPointIndex),
              y2: margins.top + plotRegion.plotHeight,
              stroke: "var(--border-strong, #64748b)",
              strokeWidth: "1.2",
              strokeDasharray: "3 3"
            }
          )),
          /* @__PURE__ */ import_react74.default.createElement("g", { className: "layer-interaction-slices" }, processedData.map((d, i) => {
            const x = margins.left + getX(i);
            const sliceW = plotRegion.plotWidth / Math.max(1, processedData.length);
            return /* @__PURE__ */ import_react74.default.createElement(
              "rect",
              {
                key: i,
                x: x - sliceW / 2,
                y: margins.top,
                width: sliceW,
                height: plotRegion.plotHeight,
                fill: "transparent",
                onMouseEnter: () => setHoveredPointIndex(i),
                onMouseLeave: () => setHoveredPointIndex(null),
                onClick: () => onSelect && onSelect(d._raw),
                style: { cursor: onSelect ? "pointer" : "default" }
              }
            );
          }))
        ), showTooltip && hoveredPointIndex != null && processedData[hoveredPointIndex] && /* @__PURE__ */ import_react74.default.createElement(
          "div",
          {
            className: "mer-linechart-tooltip",
            style: {
              position: "absolute",
              top: 8,
              right: 8,
              background: "var(--surface-card, #ffffff)",
              border: "var(--border-hairline, 1px solid rgba(0,0,0,0.12))",
              borderRadius: "var(--radius-sm, 4px)",
              boxShadow: "var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08))",
              padding: "8px 12px",
              fontSize: "var(--text-xs, 12px)",
              pointerEvents: "none",
              zIndex: LAYER_STACK.TOOLTIP_AND_OVERLAYS,
              minWidth: 150,
              lineHeight: 1.4
            }
          },
          /* @__PURE__ */ import_react74.default.createElement("div", { style: { fontWeight: "var(--weight-semibold)", color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 4, marginBottom: 4 } }, processedData[hoveredPointIndex]._x),
          normalizedSeries.map((s) => {
            const displayVal = processedData[hoveredPointIndex][`_display_${s.key}`];
            return /* @__PURE__ */ import_react74.default.createElement("div", { key: s.key, style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 2 } }, /* @__PURE__ */ import_react74.default.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" } }, /* @__PURE__ */ import_react74.default.createElement("span", { style: { width: 8, height: 8, borderRadius: "50%", background: s.color } }), s.label), /* @__PURE__ */ import_react74.default.createElement("span", { style: { fontFamily: "var(--font-mono)", fontWeight: "var(--weight-medium)", color: displayVal != null ? "var(--text-primary)" : "var(--text-critical)" } }, displayVal != null ? displayVal : "No Telemetry"));
          })
        ))
      ),
      showLegend && normalizedSeries.length > 1 && !isTableView && /* @__PURE__ */ import_react74.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginTop: 12, paddingTop: 8, borderTop: "var(--border-subtle)" } }, normalizedSeries.map((s, sIdx) => {
        const isDimmed = activeSeries && activeSeries !== s.key;
        return /* @__PURE__ */ import_react74.default.createElement(
          "button",
          {
            key: s.key,
            type: "button",
            onClick: () => setActiveSeries(activeSeries === s.key ? null : s.key),
            style: {
              background: "transparent",
              border: "none",
              padding: "2px 4px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              opacity: isDimmed ? 0.35 : 1,
              fontSize: "var(--text-xs)",
              color: "var(--text-secondary)"
            },
            title: `Click to isolate ${s.label}`
          },
          /* @__PURE__ */ import_react74.default.createElement("span", { style: { width: 14, height: 2, background: s.color, display: "inline-block", borderTop: s.strokeDash !== "none" ? "2px dashed currentColor" : "none" } }),
          /* @__PURE__ */ import_react74.default.createElement("span", null, s.label)
        );
      }))
    );
  }

  // components/data/AreaChart.jsx
  var import_react75 = __toESM(require_react(), 1);
  function AreaChart({
    data = [],
    series = [],
    xKey = "x",
    yKey = "y",
    variant = "single",
    // 'single' | 'stacked' | 'normalized' | 'diverging' | 'stream'
    curve = "monotone",
    // 'linear' | 'monotone' | 'step-after'
    baseline = 0,
    width = 640,
    height = 320,
    margins = { top: 20, right: 24, bottom: 40, left: 60 },
    xScaleType = "time",
    // 'time' | 'linear' | 'band'
    xUnit = "",
    yUnit = "",
    locale = "en-IN",
    title,
    subtitle,
    referenceLines = [],
    thresholdBands = [],
    showGridX = false,
    showGridY = true,
    showPoints = false,
    enableCrosshair = true,
    enablePatterns = true,
    patternPresets = ["pat-diagonal", "pat-dots", "pat-cross", "pat-horizontal", "pat-vertical", "pat-mesh"],
    density = "standard",
    emptyMessage = "No telemetry data available for the selected interval.",
    loading = false,
    onPointSelect,
    className = "",
    style = {}
  }) {
    const chartId = (0, import_react75.useId)();
    const containerRef = (0, import_react75.useRef)(null);
    const [activeXIndex, setActiveXIndex] = (0, import_react75.useState)(-1);
    const [activeSeriesIndex, setActiveSeriesIndex] = (0, import_react75.useState)(0);
    const [showTableModal, setShowTableModal] = (0, import_react75.useState)(false);
    const [isolatedSeries, setIsolatedSeries] = (0, import_react75.useState)(null);
    const seriesDefs = (0, import_react75.useMemo)(() => {
      if (series && series.length > 0) {
        return series.map((s, idx) => ({
          key: s.key || s.dataKey || `series_${idx}`,
          label: s.label || s.name || s.key || `Series ${idx + 1}`,
          color: s.color || VIZ_COLORS[idx % VIZ_COLORS.length],
          pattern: s.pattern || patternPresets[idx % patternPresets.length],
          strokeWidth: s.strokeWidth || 2
        }));
      }
      return [{
        key: yKey,
        label: title || "Telemetry Value",
        color: VIZ_COLORS[0],
        pattern: patternPresets[0],
        strokeWidth: 2
      }];
    }, [series, yKey, title, patternPresets]);
    const activeSeriesDefs = (0, import_react75.useMemo)(() => {
      if (isolatedSeries) {
        return seriesDefs.filter((s) => s.key === isolatedSeries);
      }
      return seriesDefs;
    }, [seriesDefs, isolatedSeries]);
    const activeKeys = (0, import_react75.useMemo)(() => activeSeriesDefs.map((s) => s.key), [activeSeriesDefs]);
    const plot = (0, import_react75.useMemo)(() => {
      return createPlotRegion({
        containerWidth: width,
        containerHeight: height,
        margins
      });
    }, [width, height, margins]);
    const stackedData = (0, import_react75.useMemo)(() => {
      if (!data || data.length === 0) return [];
      return stackSeriesData(data, activeKeys, {
        type: variant,
        baseline
      });
    }, [data, activeKeys, variant, baseline]);
    const scales = (0, import_react75.useMemo)(() => {
      if (!data || data.length === 0) return { xScale: null, yScale: null, xTicks: [], yTicks: [] };
      let xScale;
      const xValues = data.map((d) => d[xKey]);
      if (xScaleType === "time") {
        const minDate = new Date(xValues[0]);
        const maxDate = new Date(xValues[xValues.length - 1]);
        xScale = createTimeScale({
          domain: [minDate, maxDate],
          range: [0, plot.plotWidth]
        });
      } else if (xScaleType === "band") {
        xScale = createBandScale({
          domain: xValues,
          range: [0, plot.plotWidth],
          padding: 0
        });
      } else {
        const minX = Math.min(...xValues.map(Number));
        const maxX = Math.max(...xValues.map(Number));
        xScale = createLinearScale({
          domain: [minX, maxX],
          range: [0, plot.plotWidth]
        });
      }
      let minY = 0;
      let maxY = 100;
      if (variant === "normalized") {
        minY = 0;
        maxY = 100;
      } else if (stackedData.length > 0) {
        let minVal = Infinity;
        let maxVal = -Infinity;
        stackedData.forEach((seriesPoints) => {
          seriesPoints.forEach((p) => {
            if (p.y0 < minVal) minVal = p.y0;
            if (p.y1 < minVal) minVal = p.y1;
            if (p.y0 > maxVal) maxVal = p.y0;
            if (p.y1 > maxVal) maxVal = p.y1;
          });
        });
        referenceLines.forEach((r) => {
          if (r.y < minVal) minVal = r.y;
          if (r.y > maxVal) maxVal = r.y;
        });
        if (variant === "single" || variant === "stacked") {
          minVal = Math.min(baseline, minVal);
        }
        const span = maxVal - minVal || 1;
        minY = minVal < 0 ? minVal - span * 0.05 : 0;
        maxY = maxVal + span * 0.08;
      }
      const yScale = createLinearScale({
        domain: [minY, maxY],
        range: [plot.plotHeight, 0],
        clamp: false
      });
      const xTicks = generateTicks(xScale, Math.min(7, Math.floor(plot.plotWidth / 90)));
      const yTicks = generateTicks(yScale, Math.min(6, Math.floor(plot.plotHeight / 48)));
      return { xScale, yScale, xTicks, yTicks };
    }, [data, xKey, xScaleType, plot, variant, stackedData, baseline, referenceLines]);
    const areaLayers = (0, import_react75.useMemo)(() => {
      if (!scales.xScale || !scales.yScale || stackedData.length === 0) return [];
      return stackedData.map((seriesPoints, sIndex) => {
        const def = activeSeriesDefs[sIndex];
        const upperPoints = [];
        const lowerPoints = [];
        seriesPoints.forEach((p, idx) => {
          let px;
          const xVal = data[idx][xKey];
          if (xScaleType === "band") {
            px = scales.xScale(xVal) + scales.xScale.bandwidth() / 2;
          } else {
            px = scales.xScale(xVal);
          }
          const pyUpper = scales.yScale(p.y1);
          const pyLower = scales.yScale(p.y0);
          upperPoints.push({ x: px, y: pyUpper, datum: data[idx], p });
          lowerPoints.push({ x: px, y: pyLower, datum: data[idx], p });
        });
        const areaPathD = createAreaPath(upperPoints, lowerPoints, curve);
        const boundaryPathD = createLinePath(upperPoints, curve);
        return {
          def,
          sIndex,
          areaPathD,
          boundaryPathD,
          upperPoints,
          lowerPoints
        };
      });
    }, [scales, stackedData, activeSeriesDefs, data, xKey, xScaleType, curve]);
    const handlePointerMove = (e) => {
      if (!scales.xScale || data.length === 0 || !enableCrosshair) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseCanvasX = e.clientX - rect.left;
      const plotX = plot.toPlotX(mouseCanvasX);
      if (plotX < 0 || plotX > plot.plotWidth) {
        setActiveXIndex(-1);
        return;
      }
      let nearestIdx = 0;
      let minDist = Infinity;
      data.forEach((d, i) => {
        const xVal = d[xKey];
        const px = scales.xScale(xVal);
        const dist = Math.abs(px - plotX);
        if (dist < minDist) {
          minDist = dist;
          nearestIdx = i;
        }
      });
      setActiveXIndex(nearestIdx);
    };
    const handlePointerLeave = () => {
      setActiveXIndex(-1);
    };
    const handleKeyDown = createKeyboardRovingFocus({
      itemCount: data.length,
      currentIndex: activeXIndex,
      onIndexChange: (idx) => {
        setActiveXIndex(idx);
        if (onPointSelect && data[idx]) {
          onPointSelect(data[idx], idx);
        }
      },
      onSelect: (idx) => {
        if (onPointSelect && data[idx]) {
          onPointSelect(data[idx], idx);
        }
      },
      onDismiss: () => {
        setActiveXIndex(-1);
      },
      onToggleTable: () => {
        setShowTableModal((prev) => !prev);
      }
    });
    const activeXDatum = activeXIndex >= 0 ? data[activeXIndex] : null;
    const activeXPos = activeXDatum && scales.xScale ? scales.xScale(activeXDatum[xKey]) : 0;
    if (loading) {
      return /* @__PURE__ */ import_react75.default.createElement(
        "div",
        {
          className: `mds-area-chart mds-area-chart--loading ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Area Chart Loading",
          "aria-busy": "true"
        },
        /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__skeleton-header" }, /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__skeleton-title" }), /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__skeleton-sub" })),
        /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__skeleton-plot" })
      );
    }
    if (!data || data.length === 0) {
      return /* @__PURE__ */ import_react75.default.createElement(
        "div",
        {
          className: `mds-area-chart mds-area-chart--empty ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Area Chart Empty"
        },
        title && /* @__PURE__ */ import_react75.default.createElement("h3", { className: "mds-area-chart__title" }, title),
        /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__empty-msg" }, /* @__PURE__ */ import_react75.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }, /* @__PURE__ */ import_react75.default.createElement("path", { d: "M3 3v18h18M7 16l4-4 4 4 5-8" })), /* @__PURE__ */ import_react75.default.createElement("p", null, emptyMessage))
      );
    }
    return /* @__PURE__ */ import_react75.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `mds-area-chart mds-area-chart--${variant} mds-area-chart--density-${density} ${className}`,
        style: { width, ...style },
        role: "region",
        "aria-roledescription": "area chart",
        "aria-label": title || "Area chart visualization",
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        onPointerMove: handlePointerMove,
        onPointerLeave: handlePointerLeave
      },
      (title || subtitle) && /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__header" }, /* @__PURE__ */ import_react75.default.createElement("div", null, title && /* @__PURE__ */ import_react75.default.createElement("h3", { className: "mds-area-chart__title" }, title), subtitle && /* @__PURE__ */ import_react75.default.createElement("p", { className: "mds-area-chart__subtitle" }, subtitle)), /* @__PURE__ */ import_react75.default.createElement(
        "button",
        {
          type: "button",
          className: "mds-area-chart__table-btn",
          onClick: () => setShowTableModal(true),
          title: "View as Data Table (Alt+F11)",
          "aria-label": "Toggle accessible data table"
        },
        /* @__PURE__ */ import_react75.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ import_react75.default.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), /* @__PURE__ */ import_react75.default.createElement("path", { d: "M3 9h18M3 15h18M9 3v18" })),
        "Table"
      )),
      seriesDefs.length > 1 && /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__legend", role: "toolbar", "aria-label": "Series Filter" }, seriesDefs.map((s, idx) => {
        const isDimmed = isolatedSeries && isolatedSeries !== s.key;
        return /* @__PURE__ */ import_react75.default.createElement(
          "button",
          {
            key: s.key,
            type: "button",
            className: `mds-area-chart__legend-item ${isDimmed ? "mds-area-chart__legend-item--dimmed" : ""}`,
            onClick: () => setIsolatedSeries(isolatedSeries === s.key ? null : s.key),
            "aria-pressed": isolatedSeries === s.key,
            title: `Click to isolate ${s.label}`
          },
          /* @__PURE__ */ import_react75.default.createElement(
            "span",
            {
              className: "mds-area-chart__legend-swatch",
              style: {
                backgroundColor: s.color,
                backgroundImage: enablePatterns ? `url(#${chartId}-${s.pattern})` : "none"
              }
            }
          ),
          /* @__PURE__ */ import_react75.default.createElement("span", { className: "mds-area-chart__legend-label" }, s.label)
        );
      })),
      /* @__PURE__ */ import_react75.default.createElement(
        "svg",
        {
          width,
          height,
          className: "mds-area-chart__svg",
          "aria-hidden": "true"
        },
        /* @__PURE__ */ import_react75.default.createElement("defs", null, seriesDefs.map((s) => /* @__PURE__ */ import_react75.default.createElement("linearGradient", { key: `grad-${s.key}`, id: `${chartId}-grad-${s.key}`, x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ import_react75.default.createElement("stop", { offset: "0%", stopColor: s.color, stopOpacity: "0.45" }), /* @__PURE__ */ import_react75.default.createElement("stop", { offset: "100%", stopColor: s.color, stopOpacity: "0.03" }))), PATTERN_PRESETS.map((pat) => /* @__PURE__ */ import_react75.default.createElement(
          "pattern",
          {
            key: pat.id,
            id: `${chartId}-${pat.id}`,
            width: "10",
            height: "10",
            patternUnits: "userSpaceOnUse",
            patternTransform: pat.transform || ""
          },
          pat.type === "circle" ? /* @__PURE__ */ import_react75.default.createElement("circle", { cx: "5", cy: "5", r: pat.r || 1.2, fill: pat.fill || "rgba(255,255,255,0.45)" }) : /* @__PURE__ */ import_react75.default.createElement(
            "line",
            {
              x1: "0",
              y1: pat.id.includes("vertical") ? "0" : "5",
              x2: pat.id.includes("vertical") ? "0" : "10",
              y2: pat.id.includes("vertical") ? "10" : "5",
              stroke: pat.stroke || "rgba(255,255,255,0.35)",
              strokeWidth: pat.strokeWidth || 1.5
            }
          )
        )), /* @__PURE__ */ import_react75.default.createElement("clipPath", { id: `${chartId}-clip` }, /* @__PURE__ */ import_react75.default.createElement("rect", { x: "0", y: "0", width: plot.plotWidth, height: plot.plotHeight }))),
        /* @__PURE__ */ import_react75.default.createElement("g", { transform: `translate(${plot.margins.left}, ${plot.margins.top})` }, thresholdBands.map((band, idx) => {
          const y1 = scales.yScale(band.yMax || band.y2);
          const y2 = scales.yScale(band.yMin || band.y1);
          const h = Math.abs(y2 - y1);
          return /* @__PURE__ */ import_react75.default.createElement(
            "rect",
            {
              key: `band-${idx}`,
              x: "0",
              y: Math.min(y1, y2),
              width: plot.plotWidth,
              height: h,
              fill: band.color || "rgba(16,185,129,0.08)"
            }
          );
        }), showGridY && scales.yTicks.map((tickVal, idx) => {
          const yPos = scales.yScale(tickVal);
          return /* @__PURE__ */ import_react75.default.createElement("g", { key: `y-grid-${idx}`, className: "mds-area-chart__gridline" }, /* @__PURE__ */ import_react75.default.createElement("line", { x1: "0", y1: yPos, x2: plot.plotWidth, y2: yPos }));
        }), showGridX && scales.xTicks.map((tickVal, idx) => {
          const xPos = scales.xScale(tickVal);
          return /* @__PURE__ */ import_react75.default.createElement("g", { key: `x-grid-${idx}`, className: "mds-area-chart__gridline" }, /* @__PURE__ */ import_react75.default.createElement("line", { x1: xPos, y1: "0", x2: xPos, y2: plot.plotHeight }));
        }), /* @__PURE__ */ import_react75.default.createElement("g", { clipPath: `url(#${chartId}-clip)` }, areaLayers.map((layer) => {
          const { def, areaPathD, boundaryPathD, upperPoints } = layer;
          const isSingle = variant === "single";
          const fillSource = isSingle ? `url(#${chartId}-grad-${def.key})` : def.color;
          return /* @__PURE__ */ import_react75.default.createElement("g", { key: `layer-${def.key}`, className: "mds-area-chart__layer" }, /* @__PURE__ */ import_react75.default.createElement(
            "path",
            {
              d: areaPathD,
              fill: fillSource,
              opacity: variant === "single" ? 1 : 0.85
            }
          ), enablePatterns && /* @__PURE__ */ import_react75.default.createElement(
            "path",
            {
              d: areaPathD,
              fill: `url(#${chartId}-${def.pattern})`,
              opacity: 0.65
            }
          ), /* @__PURE__ */ import_react75.default.createElement(
            "path",
            {
              d: boundaryPathD,
              fill: "none",
              stroke: def.color,
              strokeWidth: def.strokeWidth,
              className: "mds-area-chart__boundary-line"
            }
          ), showPoints && upperPoints.map((pt, pIdx) => /* @__PURE__ */ import_react75.default.createElement(
            "circle",
            {
              key: `pt-${pIdx}`,
              cx: pt.x,
              cy: pt.y,
              r: "3.5",
              fill: "var(--surface-card, #ffffff)",
              stroke: def.color,
              strokeWidth: "2"
            }
          )));
        })), referenceLines.map((ref, idx) => {
          const yPos = scales.yScale(ref.y);
          return /* @__PURE__ */ import_react75.default.createElement("g", { key: `ref-${idx}`, className: "mds-area-chart__reference-line" }, /* @__PURE__ */ import_react75.default.createElement(
            "line",
            {
              x1: "0",
              y1: yPos,
              x2: plot.plotWidth,
              y2: yPos,
              stroke: ref.color || "var(--status-critical-solid, #ef4444)",
              strokeDasharray: "4 3",
              strokeWidth: "1.5"
            }
          ), ref.label && /* @__PURE__ */ import_react75.default.createElement(
            "text",
            {
              x: plot.plotWidth - 6,
              y: yPos - 5,
              textAnchor: "end",
              fill: ref.color || "var(--status-critical-solid, #ef4444)",
              className: "mds-area-chart__ref-label"
            },
            ref.label,
            " (",
            formatVizValue(ref.y, yUnit, locale),
            ")"
          ));
        }), activeXIndex >= 0 && enableCrosshair && /* @__PURE__ */ import_react75.default.createElement("g", { className: "mds-area-chart__crosshair" }, /* @__PURE__ */ import_react75.default.createElement(
          "line",
          {
            x1: activeXPos,
            y1: "0",
            x2: activeXPos,
            y2: plot.plotHeight,
            stroke: "var(--border-strong, #64748b)",
            strokeDasharray: "3 3",
            strokeWidth: "1.5"
          }
        ), areaLayers.map((layer) => {
          const upperPt = layer.upperPoints[activeXIndex];
          if (!upperPt) return null;
          return /* @__PURE__ */ import_react75.default.createElement(
            "circle",
            {
              key: `active-pt-${layer.def.key}`,
              cx: activeXPos,
              cy: upperPt.y,
              r: "5",
              fill: "var(--surface-card, #ffffff)",
              stroke: layer.def.color,
              strokeWidth: "2.5"
            }
          );
        })), /* @__PURE__ */ import_react75.default.createElement("g", { transform: `translate(0, ${plot.plotHeight})`, className: "mds-area-chart__axis mds-area-chart__axis--x" }, /* @__PURE__ */ import_react75.default.createElement("line", { x1: "0", y1: "0", x2: plot.plotWidth, y2: "0", stroke: "var(--border-subtle, #cbd5e1)" }), scales.xTicks.map((tickVal, idx) => {
          const xPos = scales.xScale(tickVal);
          const label = xScaleType === "time" ? new Date(tickVal).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) : formatVizValue(tickVal, xUnit, locale);
          return /* @__PURE__ */ import_react75.default.createElement("g", { key: `xtick-${idx}`, transform: `translate(${xPos}, 0)` }, /* @__PURE__ */ import_react75.default.createElement("line", { y2: "5", stroke: "var(--border-subtle, #cbd5e1)" }), /* @__PURE__ */ import_react75.default.createElement("text", { y: "18", textAnchor: "middle" }, label));
        })), /* @__PURE__ */ import_react75.default.createElement("g", { className: "mds-area-chart__axis mds-area-chart__axis--y" }, /* @__PURE__ */ import_react75.default.createElement("line", { x1: "0", y1: "0", x2: "0", y2: plot.plotHeight, stroke: "var(--border-subtle, #cbd5e1)" }), scales.yTicks.map((tickVal, idx) => {
          const yPos = scales.yScale(tickVal);
          const formatted = variant === "normalized" ? `${tickVal.toFixed(0)}%` : formatVizValue(tickVal, yUnit, locale);
          return /* @__PURE__ */ import_react75.default.createElement("g", { key: `ytick-${idx}`, transform: `translate(0, ${yPos})` }, /* @__PURE__ */ import_react75.default.createElement("line", { x2: "-5", stroke: "var(--border-subtle, #cbd5e1)" }), /* @__PURE__ */ import_react75.default.createElement("text", { x: "-9", dy: "0.32em", textAnchor: "end" }, formatted));
        })))
      ),
      activeXIndex >= 0 && activeXDatum && /* @__PURE__ */ import_react75.default.createElement(
        "div",
        {
          className: "mds-area-chart__tooltip",
          style: {
            left: Math.min(plot.toCanvasX(activeXPos) + 12, width - 220),
            top: plot.margins.top + 10
          },
          role: "tooltip"
        },
        /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__tooltip-header" }, /* @__PURE__ */ import_react75.default.createElement("strong", null, xScaleType === "time" ? new Date(activeXDatum[xKey]).toLocaleString(locale, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }) : formatVizValue(activeXDatum[xKey], xUnit, locale))),
        /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__tooltip-body" }, stackedData.map((seriesPoints, sIdx) => {
          const def = activeSeriesDefs[sIdx];
          const pt = seriesPoints[activeXIndex];
          if (!pt) return null;
          return /* @__PURE__ */ import_react75.default.createElement("div", { key: def.key, className: "mds-area-chart__tooltip-row" }, /* @__PURE__ */ import_react75.default.createElement("span", { className: "mds-area-chart__tooltip-swatch", style: { backgroundColor: def.color } }), /* @__PURE__ */ import_react75.default.createElement("span", { className: "mds-area-chart__tooltip-label" }, def.label, ":"), /* @__PURE__ */ import_react75.default.createElement("span", { className: "mds-area-chart__tooltip-val" }, formatVizValue(pt.rawVal, yUnit, locale), variant === "normalized" && ` (${pt.share.toFixed(1)}%)`));
        }), variant === "stacked" && activeSeriesDefs.length > 1 && /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__tooltip-row mds-area-chart__tooltip-row--total" }, /* @__PURE__ */ import_react75.default.createElement("span", null, "Total Accumulated:"), /* @__PURE__ */ import_react75.default.createElement("strong", null, formatVizValue(
          activeSeriesDefs.reduce((acc, def) => acc + Number(activeXDatum[def.key] || 0), 0),
          yUnit,
          locale
        ))))
      ),
      showTableModal && /* @__PURE__ */ import_react75.default.createElement(
        "div",
        {
          className: "mds-area-chart__modal-backdrop",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": `${chartId}-table-title`
        },
        /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__modal" }, /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__modal-header" }, /* @__PURE__ */ import_react75.default.createElement("h4", { id: `${chartId}-table-title` }, title || "Area Chart Telemetry Records"), /* @__PURE__ */ import_react75.default.createElement(
          "button",
          {
            type: "button",
            className: "mds-area-chart__modal-close",
            onClick: () => setShowTableModal(false),
            "aria-label": "Close data table"
          },
          "\u2715"
        )), /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__modal-body" }, /* @__PURE__ */ import_react75.default.createElement("table", { className: "mds-area-chart__data-table" }, /* @__PURE__ */ import_react75.default.createElement("thead", null, /* @__PURE__ */ import_react75.default.createElement("tr", null, /* @__PURE__ */ import_react75.default.createElement("th", null, "Domain (", xKey, ")"), activeSeriesDefs.map((s) => /* @__PURE__ */ import_react75.default.createElement("th", { key: s.key }, s.label, " (", yUnit || "Value", ")")), variant === "stacked" && /* @__PURE__ */ import_react75.default.createElement("th", null, "Total Sum"))), /* @__PURE__ */ import_react75.default.createElement("tbody", null, data.map((d, rowIdx) => {
          const totalSum = activeSeriesDefs.reduce((acc, s) => acc + Number(d[s.key] || 0), 0);
          return /* @__PURE__ */ import_react75.default.createElement("tr", { key: rowIdx }, /* @__PURE__ */ import_react75.default.createElement("td", null, xScaleType === "time" ? new Date(d[xKey]).toLocaleString(locale) : String(d[xKey])), activeSeriesDefs.map((s) => /* @__PURE__ */ import_react75.default.createElement("td", { key: s.key }, formatVizValue(d[s.key], yUnit, locale), variant === "normalized" && totalSum > 0 && /* @__PURE__ */ import_react75.default.createElement("span", { className: "mds-area-chart__table-share" }, " ", "(", (Number(d[s.key] || 0) / totalSum * 100).toFixed(1), "%)"))), variant === "stacked" && /* @__PURE__ */ import_react75.default.createElement("td", null, /* @__PURE__ */ import_react75.default.createElement("strong", null, formatVizValue(totalSum, yUnit, locale))));
        })))))
      ),
      /* @__PURE__ */ import_react75.default.createElement("div", { className: "mds-area-chart__sr-only", "aria-live": "polite" }, activeXIndex >= 0 && activeXDatum ? `Selected observation ${activeXIndex + 1} of ${data.length}, domain: ${activeXDatum[xKey]}. Values: ${activeSeriesDefs.map((s) => `${s.label} ${activeXDatum[s.key]}`).join(", ")}.` : "")
    );
  }

  // components/data/ScatterPlot.jsx
  var import_react76 = __toESM(require_react(), 1);
  function ScatterPlot({
    data = [],
    xKey = "x",
    yKey = "y",
    sizeKey = null,
    categoryKey = null,
    series = [],
    variant = "scatter",
    // 'scatter' | 'bubble' | 'connected' | 'jittered' | 'binned-density'
    width = 640,
    height = 360,
    margins = { top: 24, right: 28, bottom: 44, left: 64 },
    xScaleType = "linear",
    // 'linear' | 'log' | 'band'
    yScaleType = "linear",
    // 'linear' | 'log'
    xUnit = "",
    yUnit = "",
    sizeUnit = "",
    xLabel = "",
    yLabel = "",
    locale = "en-IN",
    title,
    subtitle,
    minRadius = 4,
    maxRadius = 22,
    pointOpacity = 0.75,
    showTrendline = false,
    quadrantLines = null,
    // { x: 2000, y: 3.0, labels: ['Q1', 'Q2', 'Q3', 'Q4'] }
    referenceLines = [],
    // [{ x?: 2500, y?: 4.5, label: 'UCL Limit', color: 'var(--status-critical-solid)' }]
    showGridX = true,
    showGridY = true,
    jitterAmount = 14,
    binSize = 24,
    densityColorRange = ["rgba(37, 99, 235, 0.15)", "rgba(37, 99, 235, 0.9)"],
    densityThreshold = 1,
    density = "standard",
    // 'compact' | 'standard' | 'expanded'
    emptyMessage = "No observation records found for the specified parameters.",
    loading = false,
    onPointSelect,
    className = "",
    style = {}
  }) {
    const chartId = (0, import_react76.useId)();
    const containerRef = (0, import_react76.useRef)(null);
    const [activePointIndex, setActivePointIndex] = (0, import_react76.useState)(-1);
    const [selectedPointIndex, setSelectedPointIndex] = (0, import_react76.useState)(-1);
    const [isolatedCategory, setIsolatedCategory] = (0, import_react76.useState)(null);
    const [showTableModal, setShowTableModal] = (0, import_react76.useState)(false);
    const categories = (0, import_react76.useMemo)(() => {
      if (series && series.length > 0) {
        return series.map((s, idx) => ({
          key: s.key || s.id || `cat_${idx}`,
          label: s.label || s.name || s.key || `Category ${idx + 1}`,
          color: s.color || VIZ_COLORS[idx % VIZ_COLORS.length],
          symbol: s.symbol || POINT_SYMBOLS[idx % POINT_SYMBOLS.length]
        }));
      }
      if (categoryKey && data && data.length > 0) {
        const distinct = Array.from(new Set(data.map((d) => d[categoryKey]).filter(Boolean)));
        return distinct.map((cat, idx) => ({
          key: String(cat),
          label: String(cat),
          color: VIZ_COLORS[idx % VIZ_COLORS.length],
          symbol: POINT_SYMBOLS[idx % POINT_SYMBOLS.length]
        }));
      }
      return [{
        key: "default",
        label: "Observations",
        color: VIZ_COLORS[0],
        symbol: "circle"
      }];
    }, [series, categoryKey, data]);
    const categoryMap = (0, import_react76.useMemo)(() => {
      const map = /* @__PURE__ */ new Map();
      categories.forEach((c) => map.set(c.key, c));
      return map;
    }, [categories]);
    const plot = (0, import_react76.useMemo)(() => {
      return createPlotRegion({
        containerWidth: width,
        containerHeight: height,
        margins
      });
    }, [width, height, margins]);
    const jitterOffsets = (0, import_react76.useMemo)(() => {
      if (variant !== "jittered" || !data) return [];
      return data.map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rnd = seed / 233280;
        return (rnd - 0.5) * 2 * jitterAmount;
      });
    }, [variant, data, jitterAmount]);
    const scales = (0, import_react76.useMemo)(() => {
      if (!data || data.length === 0) return { xScale: null, yScale: null, sizeScale: null, xTicks: [], yTicks: [] };
      let xScale;
      const xValues = data.map((d) => d[xKey]);
      if (xScaleType === "band") {
        const distinctX = Array.from(new Set(xValues));
        xScale = createBandScale({
          domain: distinctX,
          range: [0, plot.plotWidth],
          padding: 0.35
        });
      } else if (xScaleType === "log") {
        const minX = Math.min(...xValues.map((v) => Math.max(1e-4, Number(v))));
        const maxX = Math.max(...xValues.map(Number));
        xScale = createLogScale({
          domain: [minX, maxX],
          range: [0, plot.plotWidth]
        });
      } else {
        const minX = Math.min(...xValues.map(Number));
        const maxX = Math.max(...xValues.map(Number));
        const span = maxX - minX || 1;
        xScale = createLinearScale({
          domain: [minX - span * 0.05, maxX + span * 0.05],
          range: [0, plot.plotWidth]
        });
      }
      let yScale;
      const yValues = data.map((d) => Number(d[yKey]));
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
      const spanY = maxY - minY || 1;
      if (yScaleType === "log") {
        yScale = createLogScale({
          domain: [Math.max(1e-4, minY), maxY],
          range: [plot.plotHeight, 0]
        });
      } else {
        yScale = createLinearScale({
          domain: [minY < 0 ? minY - spanY * 0.06 : Math.max(0, minY - spanY * 0.08), maxY + spanY * 0.08],
          range: [plot.plotHeight, 0]
        });
      }
      let sizeScale = () => minRadius;
      if (sizeKey && (variant === "bubble" || variant === "scatter")) {
        const sizeValues = data.map((d) => Number(d[sizeKey] || 0));
        const minZ = Math.min(...sizeValues);
        const maxZ = Math.max(...sizeValues);
        sizeScale = createAreaScale({
          domain: [minZ, maxZ],
          minRadius,
          maxRadius
        });
      }
      const xTicks = generateTicks(xScale, Math.min(7, Math.floor(plot.plotWidth / 85)));
      const yTicks = generateTicks(yScale, Math.min(6, Math.floor(plot.plotHeight / 48)));
      return { xScale, yScale, sizeScale, xTicks, yTicks };
    }, [data, xKey, yKey, sizeKey, xScaleType, yScaleType, plot, minRadius, maxRadius, variant]);
    const regression = (0, import_react76.useMemo)(() => {
      if (!showTrendline || !scales.xScale || !scales.yScale || data.length < 2) return null;
      const numericPoints = data.map((d) => ({ x: Number(d[xKey]), y: Number(d[yKey]) })).filter((p) => !isNaN(p.x) && !isNaN(p.y));
      return calculateLinearRegression(numericPoints);
    }, [showTrendline, scales, data, xKey, yKey]);
    const densityBins = (0, import_react76.useMemo)(() => {
      if (variant !== "binned-density" || !scales.xScale || !scales.yScale || data.length === 0) return [];
      const cols = Math.ceil(plot.plotWidth / binSize);
      const rows = Math.ceil(plot.plotHeight / binSize);
      const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
      let maxCount = 0;
      data.forEach((d) => {
        const px = scales.xScale(d[xKey]);
        const py = scales.yScale(d[yKey]);
        const c = Math.floor(px / binSize);
        const r = Math.floor(py / binSize);
        if (c >= 0 && c < cols && r >= 0 && r < rows) {
          grid[r][c] += 1;
          if (grid[r][c] > maxCount) maxCount = grid[r][c];
        }
      });
      const bins = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const count = grid[r][c];
          if (count >= densityThreshold) {
            bins.push({
              x: c * binSize,
              y: r * binSize,
              size: binSize,
              count,
              intensity: count / (maxCount || 1)
            });
          }
        }
      }
      return bins;
    }, [variant, scales, data, xKey, yKey, plot, binSize, densityThreshold]);
    const projectedPoints = (0, import_react76.useMemo)(() => {
      if (!scales.xScale || !scales.yScale || data.length === 0) return [];
      return data.map((d, idx) => {
        let px;
        if (xScaleType === "band") {
          px = scales.xScale(d[xKey]) + scales.xScale.bandwidth() / 2;
          if (variant === "jittered") {
            px += jitterOffsets[idx] || 0;
          }
        } else {
          px = scales.xScale(d[xKey]);
        }
        const py = scales.yScale(d[yKey]);
        const radius = sizeKey ? scales.sizeScale(d[sizeKey]) : minRadius;
        const catKey = categoryKey ? String(d[categoryKey]) : "default";
        const catDef = categoryMap.get(catKey) || categories[0];
        return {
          idx,
          datum: d,
          x: px,
          y: py,
          radius,
          color: catDef.color,
          symbol: catDef.symbol,
          catKey,
          catLabel: catDef.label
        };
      });
    }, [scales, data, xKey, yKey, sizeKey, categoryKey, categoryMap, categories, xScaleType, variant, jitterOffsets, minRadius]);
    const sortedPointIndices = (0, import_react76.useMemo)(() => {
      return projectedPoints.map((p, originalIdx) => ({ originalIdx, x: p.x, y: p.y })).sort((a, b) => a.x - b.x);
    }, [projectedPoints]);
    const trajectoryPathD = (0, import_react76.useMemo)(() => {
      if (variant !== "connected" || projectedPoints.length < 2) return "";
      return createLinePath(projectedPoints, "linear");
    }, [variant, projectedPoints]);
    const handleKeyDown = createKeyboardRovingFocus({
      itemCount: sortedPointIndices.length,
      currentIndex: activePointIndex >= 0 ? sortedPointIndices.findIndex((s) => s.originalIdx === activePointIndex) : -1,
      onIndexChange: (sortedIdx) => {
        const originalIdx = sortedPointIndices[sortedIdx].originalIdx;
        setActivePointIndex(originalIdx);
        if (onPointSelect && data[originalIdx]) {
          onPointSelect(data[originalIdx], originalIdx);
        }
      },
      onSelect: (sortedIdx) => {
        const originalIdx = sortedPointIndices[sortedIdx].originalIdx;
        setSelectedPointIndex(originalIdx);
        if (onPointSelect && data[originalIdx]) {
          onPointSelect(data[originalIdx], originalIdx);
        }
      },
      onDismiss: () => {
        setActivePointIndex(-1);
      },
      onToggleTable: () => {
        setShowTableModal((prev) => !prev);
      }
    });
    const activePoint = activePointIndex >= 0 ? projectedPoints[activePointIndex] : null;
    if (loading) {
      return /* @__PURE__ */ import_react76.default.createElement(
        "div",
        {
          className: `mds-scatter-plot mds-scatter-plot--loading ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Scatter Plot Loading",
          "aria-busy": "true"
        },
        /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__skeleton-header" }, /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__skeleton-title" }), /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__skeleton-sub" })),
        /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__skeleton-plot" })
      );
    }
    if (!data || data.length === 0) {
      return /* @__PURE__ */ import_react76.default.createElement(
        "div",
        {
          className: `mds-scatter-plot mds-scatter-plot--empty ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Scatter Plot Empty"
        },
        title && /* @__PURE__ */ import_react76.default.createElement("h3", { className: "mds-scatter-plot__title" }, title),
        /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__empty-msg" }, /* @__PURE__ */ import_react76.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }, /* @__PURE__ */ import_react76.default.createElement("circle", { cx: "7.5", cy: "14.5", r: "2.5" }), /* @__PURE__ */ import_react76.default.createElement("circle", { cx: "16.5", cy: "7.5", r: "2.5" }), /* @__PURE__ */ import_react76.default.createElement("circle", { cx: "12", cy: "12", r: "2.5" })), /* @__PURE__ */ import_react76.default.createElement("p", null, emptyMessage))
      );
    }
    return /* @__PURE__ */ import_react76.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `mds-scatter-plot mds-scatter-plot--${variant} mds-scatter-plot--density-${density} ${className}`,
        style: { width, ...style },
        role: "region",
        "aria-roledescription": "scatter plot",
        "aria-label": title || "Scatter plot multivariate visualization",
        tabIndex: 0,
        onKeyDown: handleKeyDown
      },
      (title || subtitle) && /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__header" }, /* @__PURE__ */ import_react76.default.createElement("div", null, title && /* @__PURE__ */ import_react76.default.createElement("h3", { className: "mds-scatter-plot__title" }, title), subtitle && /* @__PURE__ */ import_react76.default.createElement("p", { className: "mds-scatter-plot__subtitle" }, subtitle)), /* @__PURE__ */ import_react76.default.createElement(
        "button",
        {
          type: "button",
          className: "mds-scatter-plot__table-btn",
          onClick: () => setShowTableModal(true),
          title: "View as Data Table (Alt+F11)",
          "aria-label": "Toggle accessible data table"
        },
        /* @__PURE__ */ import_react76.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ import_react76.default.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), /* @__PURE__ */ import_react76.default.createElement("path", { d: "M3 9h18M3 15h18M9 3v18" })),
        "Table"
      )),
      categories.length > 1 && /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__legend", role: "toolbar", "aria-label": "Category Filters" }, categories.map((c) => {
        const isDimmed = isolatedCategory && isolatedCategory !== c.key;
        return /* @__PURE__ */ import_react76.default.createElement(
          "button",
          {
            key: c.key,
            type: "button",
            className: `mds-scatter-plot__legend-item ${isDimmed ? "mds-scatter-plot__legend-item--dimmed" : ""}`,
            onClick: () => setIsolatedCategory(isolatedCategory === c.key ? null : c.key),
            "aria-pressed": isolatedCategory === c.key,
            title: `Click to isolate ${c.label}`
          },
          /* @__PURE__ */ import_react76.default.createElement("svg", { width: "16", height: "16", viewBox: "-8 -8 16 16", className: "mds-scatter-plot__legend-icon" }, /* @__PURE__ */ import_react76.default.createElement(
            "path",
            {
              d: renderPointSymbol(c.symbol, 0, 0, 5),
              fill: c.color,
              stroke: "var(--surface-card, #ffffff)",
              strokeWidth: "1.5"
            }
          )),
          /* @__PURE__ */ import_react76.default.createElement("span", { className: "mds-scatter-plot__legend-label" }, c.label)
        );
      })),
      /* @__PURE__ */ import_react76.default.createElement(
        "svg",
        {
          width,
          height,
          className: "mds-scatter-plot__svg",
          "aria-hidden": "true",
          onClick: () => setActivePointIndex(-1)
        },
        /* @__PURE__ */ import_react76.default.createElement("defs", null, /* @__PURE__ */ import_react76.default.createElement("clipPath", { id: `${chartId}-clip` }, /* @__PURE__ */ import_react76.default.createElement("rect", { x: "0", y: "0", width: plot.plotWidth, height: plot.plotHeight }))),
        /* @__PURE__ */ import_react76.default.createElement("g", { transform: `translate(${plot.margins.left}, ${plot.margins.top})` }, quadrantLines && /* @__PURE__ */ import_react76.default.createElement("g", { className: "mds-scatter-plot__quadrants" }, quadrantLines.x != null && /* @__PURE__ */ import_react76.default.createElement(
          "line",
          {
            x1: scales.xScale(quadrantLines.x),
            y1: "0",
            x2: scales.xScale(quadrantLines.x),
            y2: plot.plotHeight,
            stroke: "var(--border-strong, #64748b)",
            strokeDasharray: "4 4",
            strokeWidth: "1.5"
          }
        ), quadrantLines.y != null && /* @__PURE__ */ import_react76.default.createElement(
          "line",
          {
            x1: "0",
            y1: scales.yScale(quadrantLines.y),
            x2: plot.plotWidth,
            y2: scales.yScale(quadrantLines.y),
            stroke: "var(--border-strong, #64748b)",
            strokeDasharray: "4 4",
            strokeWidth: "1.5"
          }
        )), showGridY && scales.yTicks.map((tickVal, idx) => {
          const yPos = scales.yScale(tickVal);
          return /* @__PURE__ */ import_react76.default.createElement("g", { key: `y-grid-${idx}`, className: "mds-scatter-plot__gridline" }, /* @__PURE__ */ import_react76.default.createElement("line", { x1: "0", y1: yPos, x2: plot.plotWidth, y2: yPos }));
        }), showGridX && scales.xTicks.map((tickVal, idx) => {
          const xPos = scales.xScale(tickVal);
          return /* @__PURE__ */ import_react76.default.createElement("g", { key: `x-grid-${idx}`, className: "mds-scatter-plot__gridline" }, /* @__PURE__ */ import_react76.default.createElement("line", { x1: xPos, y1: "0", x2: xPos, y2: plot.plotHeight }));
        }), variant === "binned-density" && densityBins.map((bin, idx) => /* @__PURE__ */ import_react76.default.createElement(
          "rect",
          {
            key: `bin-${idx}`,
            x: bin.x,
            y: bin.y,
            width: bin.size,
            height: bin.size,
            fill: "var(--viz-1, #2563eb)",
            opacity: 0.12 + bin.intensity * 0.78,
            stroke: "var(--surface-card, #ffffff)",
            strokeWidth: "0.5"
          }
        )), variant === "connected" && trajectoryPathD && /* @__PURE__ */ import_react76.default.createElement("g", { clipPath: `url(#${chartId}-clip)` }, /* @__PURE__ */ import_react76.default.createElement(
          "path",
          {
            d: trajectoryPathD,
            fill: "none",
            stroke: "var(--viz-1, #2563eb)",
            strokeWidth: "2",
            strokeDasharray: "none",
            opacity: "0.8"
          }
        )), regression && scales.xScale && scales.yScale && /* @__PURE__ */ import_react76.default.createElement("g", { className: "mds-scatter-plot__trendline", clipPath: `url(#${chartId}-clip)` }, (() => {
          const [minX, maxX] = scales.xScale.domain();
          const x1 = scales.xScale(minX);
          const y1 = scales.yScale(regression.predict(minX));
          const x2 = scales.xScale(maxX);
          const y2 = scales.yScale(regression.predict(maxX));
          return /* @__PURE__ */ import_react76.default.createElement(import_react76.default.Fragment, null, /* @__PURE__ */ import_react76.default.createElement(
            "line",
            {
              x1,
              y1,
              x2,
              y2,
              stroke: "var(--status-critical-solid, #ef4444)",
              strokeWidth: "2",
              strokeDasharray: "6 4"
            }
          ), /* @__PURE__ */ import_react76.default.createElement(
            "text",
            {
              x: plot.plotWidth - 8,
              y: 20,
              textAnchor: "end",
              fill: "var(--status-critical-solid, #ef4444)",
              className: "mds-scatter-plot__trend-label"
            },
            "Linear Fit: R\xB2 = ",
            regression.rSquared.toFixed(3)
          ));
        })()), referenceLines.map((ref, idx) => {
          if (ref.y != null) {
            const yPos = scales.yScale(ref.y);
            return /* @__PURE__ */ import_react76.default.createElement("g", { key: `ref-y-${idx}`, className: "mds-scatter-plot__reference-line" }, /* @__PURE__ */ import_react76.default.createElement("line", { x1: "0", y1: yPos, x2: plot.plotWidth, y2: yPos, stroke: ref.color || "var(--status-critical-solid)", strokeDasharray: "4 3", strokeWidth: "1.5" }), ref.label && /* @__PURE__ */ import_react76.default.createElement("text", { x: plot.plotWidth - 6, y: yPos - 5, textAnchor: "end", fill: ref.color || "var(--status-critical-solid)", className: "mds-scatter-plot__ref-label" }, ref.label));
          }
          if (ref.x != null) {
            const xPos = scales.xScale(ref.x);
            return /* @__PURE__ */ import_react76.default.createElement("g", { key: `ref-x-${idx}`, className: "mds-scatter-plot__reference-line" }, /* @__PURE__ */ import_react76.default.createElement("line", { x1: xPos, y1: "0", x2: xPos, y2: plot.plotHeight, stroke: ref.color || "var(--status-critical-solid)", strokeDasharray: "4 3", strokeWidth: "1.5" }), ref.label && /* @__PURE__ */ import_react76.default.createElement("text", { x: xPos + 5, y: 15, fill: ref.color || "var(--status-critical-solid)", className: "mds-scatter-plot__ref-label" }, ref.label));
          }
          return null;
        }), /* @__PURE__ */ import_react76.default.createElement("g", { clipPath: `url(#${chartId}-clip)` }, projectedPoints.map((pt) => {
          const isDimmed = isolatedCategory && isolatedCategory !== pt.catKey;
          const isActive = activePointIndex === pt.idx;
          const isSelected = selectedPointIndex === pt.idx;
          return /* @__PURE__ */ import_react76.default.createElement(
            "path",
            {
              key: `pt-${pt.idx}`,
              d: renderPointSymbol(pt.symbol, pt.x, pt.y, isActive ? pt.radius + 3 : pt.radius),
              fill: pt.color,
              fillOpacity: isDimmed ? 0.15 : pointOpacity,
              stroke: isActive || isSelected ? "var(--text-primary, #0f172a)" : "var(--surface-card, #ffffff)",
              strokeWidth: isActive || isSelected ? 2.5 : 1.2,
              className: "mds-scatter-plot__point",
              style: { cursor: "pointer", transition: "transform 100ms ease" },
              onPointerEnter: (e) => {
                e.stopPropagation();
                setActivePointIndex(pt.idx);
              },
              onClick: (e) => {
                e.stopPropagation();
                setSelectedPointIndex(pt.idx);
                if (onPointSelect) onPointSelect(pt.datum, pt.idx);
              }
            }
          );
        })), activePoint && /* @__PURE__ */ import_react76.default.createElement("g", { className: "mds-scatter-plot__active-marker" }, /* @__PURE__ */ import_react76.default.createElement(
          "circle",
          {
            cx: activePoint.x,
            cy: activePoint.y,
            r: activePoint.radius + 6,
            fill: "none",
            stroke: "var(--action-solid, #2563eb)",
            strokeWidth: "1.5",
            strokeDasharray: "2 2"
          }
        )), /* @__PURE__ */ import_react76.default.createElement("g", { transform: `translate(0, ${plot.plotHeight})`, className: "mds-scatter-plot__axis mds-scatter-plot__axis--x" }, /* @__PURE__ */ import_react76.default.createElement("line", { x1: "0", y1: "0", x2: plot.plotWidth, y2: "0", stroke: "var(--border-subtle, #cbd5e1)" }), scales.xTicks.map((tickVal, idx) => {
          const xPos = scales.xScale(tickVal);
          return /* @__PURE__ */ import_react76.default.createElement("g", { key: `xtick-${idx}`, transform: `translate(${xPos}, 0)` }, /* @__PURE__ */ import_react76.default.createElement("line", { y2: "5", stroke: "var(--border-subtle, #cbd5e1)" }), /* @__PURE__ */ import_react76.default.createElement("text", { y: "18", textAnchor: "middle" }, formatVizValue(tickVal, xUnit, locale)));
        }), xLabel && /* @__PURE__ */ import_react76.default.createElement("text", { x: plot.plotWidth / 2, y: "34", textAnchor: "middle", className: "mds-scatter-plot__axis-title" }, xLabel, " ", xUnit ? `(${xUnit})` : "")), /* @__PURE__ */ import_react76.default.createElement("g", { className: "mds-scatter-plot__axis mds-scatter-plot__axis--y" }, /* @__PURE__ */ import_react76.default.createElement("line", { x1: "0", y1: "0", x2: "0", y2: plot.plotHeight, stroke: "var(--border-subtle, #cbd5e1)" }), scales.yTicks.map((tickVal, idx) => {
          const yPos = scales.yScale(tickVal);
          return /* @__PURE__ */ import_react76.default.createElement("g", { key: `ytick-${idx}`, transform: `translate(0, ${yPos})` }, /* @__PURE__ */ import_react76.default.createElement("line", { x2: "-5", stroke: "var(--border-subtle, #cbd5e1)" }), /* @__PURE__ */ import_react76.default.createElement("text", { x: "-9", dy: "0.32em", textAnchor: "end" }, formatVizValue(tickVal, yUnit, locale)));
        }), yLabel && /* @__PURE__ */ import_react76.default.createElement(
          "text",
          {
            transform: `rotate(-90)`,
            x: -plot.plotHeight / 2,
            y: "-46",
            textAnchor: "middle",
            className: "mds-scatter-plot__axis-title"
          },
          yLabel,
          " ",
          yUnit ? `(${yUnit})` : ""
        )))
      ),
      activePoint && /* @__PURE__ */ import_react76.default.createElement(
        "div",
        {
          className: "mds-scatter-plot__tooltip",
          style: {
            left: Math.min(plot.toCanvasX(activePoint.x) + 14, width - 220),
            top: Math.max(10, plot.toCanvasY(activePoint.y) - 30)
          },
          role: "tooltip"
        },
        /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__tooltip-header" }, /* @__PURE__ */ import_react76.default.createElement("strong", null, activePoint.catLabel, " \xB7 Obs #", activePoint.idx + 1)),
        /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__tooltip-body" }, /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__tooltip-row" }, /* @__PURE__ */ import_react76.default.createElement("span", null, xLabel || xKey, ":"), /* @__PURE__ */ import_react76.default.createElement("strong", null, formatVizValue(activePoint.datum[xKey], xUnit, locale))), /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__tooltip-row" }, /* @__PURE__ */ import_react76.default.createElement("span", null, yLabel || yKey, ":"), /* @__PURE__ */ import_react76.default.createElement("strong", null, formatVizValue(activePoint.datum[yKey], yUnit, locale))), sizeKey && /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__tooltip-row" }, /* @__PURE__ */ import_react76.default.createElement("span", null, sizeKey, ":"), /* @__PURE__ */ import_react76.default.createElement("strong", null, formatVizValue(activePoint.datum[sizeKey], sizeUnit, locale))))
      ),
      showTableModal && /* @__PURE__ */ import_react76.default.createElement(
        "div",
        {
          className: "mds-scatter-plot__modal-backdrop",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": `${chartId}-table-title`
        },
        /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__modal" }, /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__modal-header" }, /* @__PURE__ */ import_react76.default.createElement("h4", { id: `${chartId}-table-title` }, title || "Scatter Plot Observation Records"), /* @__PURE__ */ import_react76.default.createElement(
          "button",
          {
            type: "button",
            className: "mds-scatter-plot__modal-close",
            onClick: () => setShowTableModal(false),
            "aria-label": "Close data table"
          },
          "\u2715"
        )), /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__modal-body" }, /* @__PURE__ */ import_react76.default.createElement("table", { className: "mds-scatter-plot__data-table" }, /* @__PURE__ */ import_react76.default.createElement("thead", null, /* @__PURE__ */ import_react76.default.createElement("tr", null, /* @__PURE__ */ import_react76.default.createElement("th", null, "Obs #"), categoryKey && /* @__PURE__ */ import_react76.default.createElement("th", null, "Category"), /* @__PURE__ */ import_react76.default.createElement("th", null, xLabel || xKey, " (", xUnit || "Units", ")"), /* @__PURE__ */ import_react76.default.createElement("th", null, yLabel || yKey, " (", yUnit || "Units", ")"), sizeKey && /* @__PURE__ */ import_react76.default.createElement("th", null, sizeKey, " (", sizeUnit || "Magnitude", ")"))), /* @__PURE__ */ import_react76.default.createElement("tbody", null, data.map((d, rowIdx) => /* @__PURE__ */ import_react76.default.createElement("tr", { key: rowIdx }, /* @__PURE__ */ import_react76.default.createElement("td", null, "#", rowIdx + 1), categoryKey && /* @__PURE__ */ import_react76.default.createElement("td", null, String(d[categoryKey])), /* @__PURE__ */ import_react76.default.createElement("td", null, formatVizValue(d[xKey], xUnit, locale)), /* @__PURE__ */ import_react76.default.createElement("td", null, formatVizValue(d[yKey], yUnit, locale)), sizeKey && /* @__PURE__ */ import_react76.default.createElement("td", null, formatVizValue(d[sizeKey], sizeUnit, locale))))))))
      ),
      /* @__PURE__ */ import_react76.default.createElement("div", { className: "mds-scatter-plot__sr-only", "aria-live": "polite" }, activePoint ? `Observation ${activePoint.idx + 1} of ${data.length}: ${activePoint.catLabel}. ${xLabel || xKey}: ${activePoint.datum[xKey]} ${xUnit}, ${yLabel || yKey}: ${activePoint.datum[yKey]} ${yUnit}.` : "")
    );
  }

  // components/data/DistributionPlot.jsx
  var import_react77 = __toESM(require_react(), 1);
  function DistributionPlot({
    data = [],
    valueKey = "value",
    categoryKey = null,
    series = [],
    variant = "histogram",
    // 'histogram' | 'box' | 'violin' | 'strip' | 'dotplot' | 'density'
    orientation = "vertical",
    // 'vertical' (quantitative on X/Y as appropriate)
    binCount = null,
    binWidth = null,
    bandwidth = null,
    width = 640,
    height = 360,
    margins = { top: 24, right: 28, bottom: 44, left: 60 },
    unit = "",
    valueLabel = "Measured Value",
    categoryLabel = "Group",
    locale = "en-IN",
    title,
    subtitle,
    referenceLines = [],
    // [{ value: 2.0, label: 'Nominal Spec Target', color: 'var(--status-critical-solid)' }]
    toleranceBands = [],
    // [{ min: 1.95, max: 2.05, label: 'Acceptable Spec Window' }]
    showGrid = true,
    showOutliers = true,
    showMean = true,
    enablePatterns = true,
    density = "standard",
    // 'compact' | 'standard' | 'expanded'
    emptyMessage = "No distribution telemetry records found.",
    loading = false,
    onElementSelect,
    className = "",
    style = {}
  }) {
    const chartId = (0, import_react77.useId)();
    const containerRef = (0, import_react77.useRef)(null);
    const [activeElementIndex, setActiveElementIndex] = (0, import_react77.useState)(-1);
    const [selectedElementIndex, setSelectedElementIndex] = (0, import_react77.useState)(-1);
    const [isolatedCategory, setIsolatedCategory] = (0, import_react77.useState)(null);
    const [showTableModal, setShowTableModal] = (0, import_react77.useState)(false);
    const groupedData = (0, import_react77.useMemo)(() => {
      if (!data || data.length === 0) return [];
      if (!categoryKey) {
        const rawVals = data.map((d) => typeof d === "number" ? d : Number(d[valueKey])).filter((v) => !isNaN(v));
        return [{
          key: "all",
          label: title || "Distribution",
          color: VIZ_COLORS[0],
          pattern: PATTERN_PRESETS[0].id,
          values: rawVals,
          items: data
        }];
      }
      const map = /* @__PURE__ */ new Map();
      data.forEach((d) => {
        const cat = String(d[categoryKey] || "Other");
        if (!map.has(cat)) map.set(cat, []);
        const v = typeof d === "number" ? d : Number(d[valueKey]);
        if (!isNaN(v)) map.get(cat).push(v);
      });
      const categories = Array.from(map.keys());
      return categories.map((cat, idx) => ({
        key: cat,
        label: cat,
        color: VIZ_COLORS[idx % VIZ_COLORS.length],
        pattern: PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id,
        values: map.get(cat),
        items: data.filter((d) => String(d[categoryKey]) === cat)
      }));
    }, [data, valueKey, categoryKey, title]);
    const activeGroups = (0, import_react77.useMemo)(() => {
      if (isolatedCategory) {
        return groupedData.filter((g) => g.key === isolatedCategory);
      }
      return groupedData;
    }, [groupedData, isolatedCategory]);
    const plot = (0, import_react77.useMemo)(() => {
      return createPlotRegion({
        containerWidth: width,
        containerHeight: height,
        margins
      });
    }, [width, height, margins]);
    const { allValues, globalMin, globalMax } = (0, import_react77.useMemo)(() => {
      const vals = [];
      groupedData.forEach((g) => vals.push(...g.values));
      if (vals.length === 0) return { allValues: [], globalMin: 0, globalMax: 100 };
      const minV = Math.min(...vals);
      const maxV = Math.max(...vals);
      const span = maxV - minV || 1;
      return {
        allValues: vals,
        globalMin: minV - span * 0.05,
        globalMax: maxV + span * 0.05
      };
    }, [groupedData]);
    const transformedGroups = (0, import_react77.useMemo)(() => {
      return activeGroups.map((g) => {
        const bins = computeHistogramBins(g.values, {
          binCount,
          binWidth,
          min: globalMin,
          max: globalMax
        });
        const boxStats = computeBoxPlotQuantiles(g.values);
        const kde = computeKDE(g.values, {
          bandwidth,
          samplePoints: 60,
          min: globalMin,
          max: globalMax
        });
        return {
          ...g,
          bins,
          boxStats,
          kde
        };
      });
    }, [activeGroups, binCount, binWidth, bandwidth, globalMin, globalMax]);
    const scales = (0, import_react77.useMemo)(() => {
      if (allValues.length === 0) return { scaleVal: null, scaleCat: null, scaleFreq: null, valTicks: [], freqTicks: [] };
      const scaleVal = createLinearScale({
        domain: [globalMin, globalMax],
        range: [0, plot.plotWidth]
      });
      const catKeys = activeGroups.map((g) => g.key);
      const scaleCat = createBandScale({
        domain: catKeys,
        range: [0, plot.plotHeight],
        padding: 0.28
      });
      let maxFreqOrDensity = 0;
      if (variant === "histogram") {
        transformedGroups.forEach((g) => {
          g.bins.forEach((b) => {
            if (b.count > maxFreqOrDensity) maxFreqOrDensity = b.count;
          });
        });
      } else if (variant === "density" || variant === "violin") {
        transformedGroups.forEach((g) => {
          if (g.kde.maxDensity > maxFreqOrDensity) maxFreqOrDensity = g.kde.maxDensity;
        });
      }
      const scaleFreq = createLinearScale({
        domain: [0, (maxFreqOrDensity || 1) * 1.08],
        range: [plot.plotHeight, 0]
      });
      const valTicks = generateTicks(scaleVal, Math.min(7, Math.floor(plot.plotWidth / 90)));
      const freqTicks = generateTicks(scaleFreq, Math.min(5, Math.floor(plot.plotHeight / 50)));
      return { scaleVal, scaleCat, scaleFreq, valTicks, freqTicks };
    }, [allValues, globalMin, globalMax, activeGroups, variant, transformedGroups, plot]);
    const handleKeyDown = createKeyboardRovingFocus({
      itemCount: transformedGroups.length,
      currentIndex: activeElementIndex,
      onIndexChange: (idx) => {
        setActiveElementIndex(idx);
        if (onElementSelect && transformedGroups[idx]) {
          onElementSelect(transformedGroups[idx], idx);
        }
      },
      onSelect: (idx) => {
        setSelectedElementIndex(idx);
        if (onElementSelect && transformedGroups[idx]) {
          onElementSelect(transformedGroups[idx], idx);
        }
      },
      onDismiss: () => {
        setActiveElementIndex(-1);
      },
      onToggleTable: () => {
        setShowTableModal((prev) => !prev);
      }
    });
    const activeGroup = activeElementIndex >= 0 ? transformedGroups[activeElementIndex] : null;
    if (loading) {
      return /* @__PURE__ */ import_react77.default.createElement(
        "div",
        {
          className: `mds-dist-plot mds-dist-plot--loading ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Distribution Plot Loading",
          "aria-busy": "true"
        },
        /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__skeleton-header" }, /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__skeleton-title" }), /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__skeleton-sub" })),
        /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__skeleton-plot" })
      );
    }
    if (!data || data.length === 0 || allValues.length === 0) {
      return /* @__PURE__ */ import_react77.default.createElement(
        "div",
        {
          className: `mds-dist-plot mds-dist-plot--empty ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Distribution Plot Empty"
        },
        title && /* @__PURE__ */ import_react77.default.createElement("h3", { className: "mds-dist-plot__title" }, title),
        /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__empty-msg" }, /* @__PURE__ */ import_react77.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }, /* @__PURE__ */ import_react77.default.createElement("path", { d: "M3 20h18M6 20v-6M10 20v-12M14 20v-16M18 20v-8" })), /* @__PURE__ */ import_react77.default.createElement("p", null, emptyMessage))
      );
    }
    return /* @__PURE__ */ import_react77.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `mds-dist-plot mds-dist-plot--${variant} mds-dist-plot--density-${density} ${className}`,
        style: { width, ...style },
        role: "region",
        "aria-roledescription": "distribution plot",
        "aria-label": title || "Quantitative distribution visualization",
        tabIndex: 0,
        onKeyDown: handleKeyDown
      },
      (title || subtitle) && /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__header" }, /* @__PURE__ */ import_react77.default.createElement("div", null, title && /* @__PURE__ */ import_react77.default.createElement("h3", { className: "mds-dist-plot__title" }, title), subtitle && /* @__PURE__ */ import_react77.default.createElement("p", { className: "mds-dist-plot__subtitle" }, subtitle)), /* @__PURE__ */ import_react77.default.createElement(
        "button",
        {
          type: "button",
          className: "mds-dist-plot__table-btn",
          onClick: () => setShowTableModal(true),
          title: "View Summary Table (Alt+F11)",
          "aria-label": "Toggle statistical summary data table"
        },
        /* @__PURE__ */ import_react77.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ import_react77.default.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), /* @__PURE__ */ import_react77.default.createElement("path", { d: "M3 9h18M3 15h18M9 3v18" })),
        "Table"
      )),
      groupedData.length > 1 && /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__legend", role: "toolbar", "aria-label": "Group Filter" }, groupedData.map((g) => {
        const isDimmed = isolatedCategory && isolatedCategory !== g.key;
        return /* @__PURE__ */ import_react77.default.createElement(
          "button",
          {
            key: g.key,
            type: "button",
            className: `mds-dist-plot__legend-item ${isDimmed ? "mds-dist-plot__legend-item--dimmed" : ""}`,
            onClick: () => setIsolatedCategory(isolatedCategory === g.key ? null : g.key),
            "aria-pressed": isolatedCategory === g.key,
            title: `Click to isolate ${g.label}`
          },
          /* @__PURE__ */ import_react77.default.createElement("span", { className: "mds-dist-plot__legend-swatch", style: { backgroundColor: g.color } }),
          /* @__PURE__ */ import_react77.default.createElement("span", { className: "mds-dist-plot__legend-label" }, g.label, " (", g.values.length, ")")
        );
      })),
      /* @__PURE__ */ import_react77.default.createElement(
        "svg",
        {
          width,
          height,
          className: "mds-dist-plot__svg",
          "aria-hidden": "true"
        },
        /* @__PURE__ */ import_react77.default.createElement("defs", null, PATTERN_PRESETS.map((pat) => /* @__PURE__ */ import_react77.default.createElement(
          "pattern",
          {
            key: pat.id,
            id: `${chartId}-${pat.id}`,
            width: "8",
            height: "8",
            patternUnits: "userSpaceOnUse",
            patternTransform: pat.transform || ""
          },
          pat.type === "circle" ? /* @__PURE__ */ import_react77.default.createElement("circle", { cx: "4", cy: "4", r: 1.2, fill: "rgba(255,255,255,0.4)" }) : /* @__PURE__ */ import_react77.default.createElement("line", { x1: "0", y1: "4", x2: "8", y2: "4", stroke: "rgba(255,255,255,0.35)", strokeWidth: "1.2" })
        )), /* @__PURE__ */ import_react77.default.createElement("clipPath", { id: `${chartId}-clip` }, /* @__PURE__ */ import_react77.default.createElement("rect", { x: "0", y: "0", width: plot.plotWidth, height: plot.plotHeight }))),
        /* @__PURE__ */ import_react77.default.createElement("g", { transform: `translate(${plot.margins.left}, ${plot.margins.top})` }, toleranceBands.map((band, idx) => {
          const x1 = scales.scaleVal(band.min);
          const x2 = scales.scaleVal(band.max);
          const bandW = Math.abs(x2 - x1);
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: `tol-${idx}` }, /* @__PURE__ */ import_react77.default.createElement(
            "rect",
            {
              x: Math.min(x1, x2),
              y: "0",
              width: bandW,
              height: plot.plotHeight,
              fill: "rgba(16, 185, 129, 0.08)"
            }
          ), band.label && /* @__PURE__ */ import_react77.default.createElement(
            "text",
            {
              x: Math.min(x1, x2) + bandW / 2,
              y: "14",
              textAnchor: "middle",
              fill: "var(--status-success-solid, #10b981)",
              className: "mds-dist-plot__band-label"
            },
            band.label
          ));
        }), showGrid && scales.valTicks.map((tickVal, idx) => {
          const xPos = scales.scaleVal(tickVal);
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: `x-grid-${idx}`, className: "mds-dist-plot__gridline" }, /* @__PURE__ */ import_react77.default.createElement("line", { x1: xPos, y1: "0", x2: xPos, y2: plot.plotHeight }));
        }), variant === "histogram" && transformedGroups.map((g, gIdx) => /* @__PURE__ */ import_react77.default.createElement("g", { key: g.key, className: "mds-dist-plot__hist-group" }, g.bins.map((bin) => {
          const xPos = scales.scaleVal(bin.x0);
          const barW = Math.max(1, scales.scaleVal(bin.x1) - xPos - 1.5);
          const yPos = scales.scaleFreq(bin.count);
          const barH = plot.plotHeight - yPos;
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: `bin-${bin.binIndex}` }, /* @__PURE__ */ import_react77.default.createElement(
            "rect",
            {
              x: xPos,
              y: yPos,
              width: barW,
              height: barH,
              fill: g.color,
              opacity: "0.85",
              className: "mds-dist-plot__bar"
            }
          ), enablePatterns && /* @__PURE__ */ import_react77.default.createElement(
            "rect",
            {
              x: xPos,
              y: yPos,
              width: barW,
              height: barH,
              fill: `url(#${chartId}-${g.pattern})`,
              opacity: "0.6"
            }
          ));
        }))), variant === "box" && transformedGroups.map((g, gIdx) => {
          const stats = g.boxStats;
          const catY = scales.scaleCat(g.key);
          const boxH = Math.min(36, scales.scaleCat.bandwidth());
          const cy = catY + scales.scaleCat.bandwidth() / 2;
          const xMin = scales.scaleVal(stats.min);
          const xLWhisker = scales.scaleVal(stats.lowerWhisker);
          const xQ1 = scales.scaleVal(stats.q1);
          const xMedian = scales.scaleVal(stats.median);
          const xQ3 = scales.scaleVal(stats.q3);
          const xUWhisker = scales.scaleVal(stats.upperWhisker);
          const xMax = scales.scaleVal(stats.max);
          const xMean = stats.mean != null ? scales.scaleVal(stats.mean) : null;
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: g.key, className: "mds-dist-plot__box-group" }, /* @__PURE__ */ import_react77.default.createElement("line", { x1: xLWhisker, y1: cy, x2: xQ1, y2: cy, stroke: g.color, strokeWidth: "1.5" }), /* @__PURE__ */ import_react77.default.createElement("line", { x1: xQ3, y1: cy, x2: xUWhisker, y2: cy, stroke: g.color, strokeWidth: "1.5" }), /* @__PURE__ */ import_react77.default.createElement("line", { x1: xLWhisker, y1: cy - boxH / 4, x2: xLWhisker, y2: cy + boxH / 4, stroke: g.color, strokeWidth: "1.5" }), /* @__PURE__ */ import_react77.default.createElement("line", { x1: xUWhisker, y1: cy - boxH / 4, x2: xUWhisker, y2: cy + boxH / 4, stroke: g.color, strokeWidth: "1.5" }), /* @__PURE__ */ import_react77.default.createElement(
            "rect",
            {
              x: xQ1,
              y: cy - boxH / 2,
              width: Math.max(2, xQ3 - xQ1),
              height: boxH,
              fill: g.color,
              opacity: "0.75",
              stroke: g.color,
              strokeWidth: "1.5",
              rx: "2"
            }
          ), enablePatterns && /* @__PURE__ */ import_react77.default.createElement(
            "rect",
            {
              x: xQ1,
              y: cy - boxH / 2,
              width: Math.max(2, xQ3 - xQ1),
              height: boxH,
              fill: `url(#${chartId}-${g.pattern})`,
              opacity: "0.6",
              rx: "2"
            }
          ), /* @__PURE__ */ import_react77.default.createElement(
            "line",
            {
              x1: xMedian,
              y1: cy - boxH / 2,
              x2: xMedian,
              y2: cy + boxH / 2,
              stroke: "var(--surface-card, #ffffff)",
              strokeWidth: "3"
            }
          ), showMean && xMean != null && /* @__PURE__ */ import_react77.default.createElement(
            "path",
            {
              d: renderPointSymbol("diamond", xMean, cy, 4),
              fill: "var(--status-critical-solid, #ef4444)",
              stroke: "#ffffff",
              strokeWidth: "1"
            }
          ), showOutliers && stats.outliers.map((outVal, oIdx) => /* @__PURE__ */ import_react77.default.createElement(
            "circle",
            {
              key: `out-${oIdx}`,
              cx: scales.scaleVal(outVal),
              cy,
              r: "3.5",
              fill: "none",
              stroke: "var(--status-critical-solid, #ef4444)",
              strokeWidth: "1.5"
            }
          )), /* @__PURE__ */ import_react77.default.createElement(
            "text",
            {
              x: "-10",
              y: cy,
              dy: "0.32em",
              textAnchor: "end",
              className: "mds-dist-plot__cat-label"
            },
            g.label
          ));
        }), variant === "violin" && transformedGroups.map((g) => {
          const catY = scales.scaleCat(g.key);
          const maxW = scales.scaleCat.bandwidth() / 2;
          const cy = catY + scales.scaleCat.bandwidth() / 2;
          const stats = g.boxStats;
          const upperPoints = [];
          const lowerPoints = [];
          g.kde.points.forEach((pt) => {
            const px = scales.scaleVal(pt.x);
            const offset = pt.density / (g.kde.maxDensity || 1) * maxW;
            upperPoints.push({ x: px, y: cy - offset });
            lowerPoints.push({ x: px, y: cy + offset });
          });
          const violinPathD = createAreaPath(upperPoints, lowerPoints, "monotone");
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: g.key, className: "mds-dist-plot__violin-group" }, /* @__PURE__ */ import_react77.default.createElement("path", { d: violinPathD, fill: g.color, opacity: "0.65", stroke: g.color, strokeWidth: "1.5" }), /* @__PURE__ */ import_react77.default.createElement(
            "line",
            {
              x1: scales.scaleVal(stats.q1),
              y1: cy,
              x2: scales.scaleVal(stats.q3),
              y2: cy,
              stroke: "var(--text-primary, #0f172a)",
              strokeWidth: "5",
              strokeLinecap: "round"
            }
          ), /* @__PURE__ */ import_react77.default.createElement(
            "circle",
            {
              cx: scales.scaleVal(stats.median),
              cy,
              r: "3.5",
              fill: "var(--surface-card, #ffffff)"
            }
          ), /* @__PURE__ */ import_react77.default.createElement("text", { x: "-10", y: cy, dy: "0.32em", textAnchor: "end", className: "mds-dist-plot__cat-label" }, g.label));
        }), variant === "strip" && transformedGroups.map((g) => {
          const catY = scales.scaleCat(g.key);
          const cy = catY + scales.scaleCat.bandwidth() / 2;
          const spread = scales.scaleCat.bandwidth() * 0.35;
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: g.key, className: "mds-dist-plot__strip-group" }, /* @__PURE__ */ import_react77.default.createElement("line", { x1: "0", y1: cy, x2: plot.plotWidth, y2: cy, stroke: "var(--border-subtle, #e2e8f0)", strokeDasharray: "2 2" }), g.values.map((val, idx) => {
            const seed = (idx * 9301 + 49297) % 233280;
            const jitter = (seed / 233280 - 0.5) * 2 * spread;
            const px = scales.scaleVal(val);
            const py = cy + jitter;
            return /* @__PURE__ */ import_react77.default.createElement(
              "circle",
              {
                key: `strip-pt-${idx}`,
                cx: px,
                cy: py,
                r: "3.5",
                fill: g.color,
                opacity: "0.7",
                stroke: "var(--surface-card, #ffffff)",
                strokeWidth: "1"
              }
            );
          }), /* @__PURE__ */ import_react77.default.createElement("text", { x: "-10", y: cy, dy: "0.32em", textAnchor: "end", className: "mds-dist-plot__cat-label" }, g.label));
        }), variant === "density" && transformedGroups.map((g) => {
          const points = g.kde.points.map((pt) => ({
            x: scales.scaleVal(pt.x),
            y: scales.scaleFreq(pt.density)
          }));
          const baselinePoints = g.kde.points.map((pt) => ({
            x: scales.scaleVal(pt.x),
            y: plot.plotHeight
          }));
          const areaD = createAreaPath(points, baselinePoints, "monotone");
          const lineD = createLinePath(points, "monotone");
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: g.key, className: "mds-dist-plot__density-group" }, /* @__PURE__ */ import_react77.default.createElement("path", { d: areaD, fill: g.color, opacity: "0.35" }), /* @__PURE__ */ import_react77.default.createElement("path", { d: lineD, fill: "none", stroke: g.color, strokeWidth: "2" }));
        }), referenceLines.map((ref, idx) => {
          const xPos = scales.scaleVal(ref.value);
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: `ref-${idx}`, className: "mds-dist-plot__reference-line" }, /* @__PURE__ */ import_react77.default.createElement(
            "line",
            {
              x1: xPos,
              y1: "0",
              x2: xPos,
              y2: plot.plotHeight,
              stroke: ref.color || "var(--status-critical-solid, #ef4444)",
              strokeDasharray: "4 3",
              strokeWidth: "1.5"
            }
          ), ref.label && /* @__PURE__ */ import_react77.default.createElement(
            "text",
            {
              x: xPos + 5,
              y: "14",
              fill: ref.color || "var(--status-critical-solid, #ef4444)",
              className: "mds-dist-plot__ref-label"
            },
            ref.label,
            " (",
            formatVizValue(ref.value, unit, locale),
            ")"
          ));
        }), /* @__PURE__ */ import_react77.default.createElement("g", { transform: `translate(0, ${plot.plotHeight})`, className: "mds-dist-plot__axis mds-dist-plot__axis--x" }, /* @__PURE__ */ import_react77.default.createElement("line", { x1: "0", y1: "0", x2: plot.plotWidth, y2: "0", stroke: "var(--border-subtle, #cbd5e1)" }), scales.valTicks.map((tickVal, idx) => {
          const xPos = scales.scaleVal(tickVal);
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: `xtick-${idx}`, transform: `translate(${xPos}, 0)` }, /* @__PURE__ */ import_react77.default.createElement("line", { y2: "5", stroke: "var(--border-subtle, #cbd5e1)" }), /* @__PURE__ */ import_react77.default.createElement("text", { y: "18", textAnchor: "middle" }, formatVizValue(tickVal, unit, locale)));
        }), valueLabel && /* @__PURE__ */ import_react77.default.createElement("text", { x: plot.plotWidth / 2, y: "34", textAnchor: "middle", className: "mds-dist-plot__axis-title" }, valueLabel, " ", unit ? `(${unit})` : "")), (variant === "histogram" || variant === "density") && /* @__PURE__ */ import_react77.default.createElement("g", { className: "mds-dist-plot__axis mds-dist-plot__axis--y" }, /* @__PURE__ */ import_react77.default.createElement("line", { x1: "0", y1: "0", x2: "0", y2: plot.plotHeight, stroke: "var(--border-subtle, #cbd5e1)" }), scales.freqTicks.map((tickVal, idx) => {
          const yPos = scales.scaleFreq(tickVal);
          return /* @__PURE__ */ import_react77.default.createElement("g", { key: `ytick-${idx}`, transform: `translate(0, ${yPos})` }, /* @__PURE__ */ import_react77.default.createElement("line", { x2: "-5", stroke: "var(--border-subtle, #cbd5e1)" }), /* @__PURE__ */ import_react77.default.createElement("text", { x: "-9", dy: "0.32em", textAnchor: "end" }, tickVal));
        }), /* @__PURE__ */ import_react77.default.createElement("text", { transform: "rotate(-90)", x: -plot.plotHeight / 2, y: "-44", textAnchor: "middle", className: "mds-dist-plot__axis-title" }, variant === "histogram" ? "Frequency (Count)" : "Density")))
      ),
      showTableModal && /* @__PURE__ */ import_react77.default.createElement(
        "div",
        {
          className: "mds-dist-plot__modal-backdrop",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": `${chartId}-table-title`
        },
        /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__modal" }, /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__modal-header" }, /* @__PURE__ */ import_react77.default.createElement("h4", { id: `${chartId}-table-title` }, title || "Statistical Distribution Summary"), /* @__PURE__ */ import_react77.default.createElement(
          "button",
          {
            type: "button",
            className: "mds-dist-plot__modal-close",
            onClick: () => setShowTableModal(false),
            "aria-label": "Close summary table"
          },
          "\u2715"
        )), /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__modal-body" }, /* @__PURE__ */ import_react77.default.createElement("table", { className: "mds-dist-plot__data-table" }, /* @__PURE__ */ import_react77.default.createElement("thead", null, /* @__PURE__ */ import_react77.default.createElement("tr", null, /* @__PURE__ */ import_react77.default.createElement("th", null, "Group"), /* @__PURE__ */ import_react77.default.createElement("th", null, "Count"), /* @__PURE__ */ import_react77.default.createElement("th", null, "Min"), /* @__PURE__ */ import_react77.default.createElement("th", null, "Q1 (25%)"), /* @__PURE__ */ import_react77.default.createElement("th", null, "Median (50%)"), /* @__PURE__ */ import_react77.default.createElement("th", null, "Q3 (75%)"), /* @__PURE__ */ import_react77.default.createElement("th", null, "Max"), /* @__PURE__ */ import_react77.default.createElement("th", null, "IQR"), /* @__PURE__ */ import_react77.default.createElement("th", null, "Mean \xB1 SD"), /* @__PURE__ */ import_react77.default.createElement("th", null, "Outliers"))), /* @__PURE__ */ import_react77.default.createElement("tbody", null, transformedGroups.map((g) => {
          const s = g.boxStats;
          return /* @__PURE__ */ import_react77.default.createElement("tr", { key: g.key }, /* @__PURE__ */ import_react77.default.createElement("td", null, /* @__PURE__ */ import_react77.default.createElement("strong", null, g.label)), /* @__PURE__ */ import_react77.default.createElement("td", null, s.count), /* @__PURE__ */ import_react77.default.createElement("td", null, formatVizValue(s.min, unit, locale)), /* @__PURE__ */ import_react77.default.createElement("td", null, formatVizValue(s.q1, unit, locale)), /* @__PURE__ */ import_react77.default.createElement("td", null, /* @__PURE__ */ import_react77.default.createElement("strong", null, formatVizValue(s.median, unit, locale))), /* @__PURE__ */ import_react77.default.createElement("td", null, formatVizValue(s.q3, unit, locale)), /* @__PURE__ */ import_react77.default.createElement("td", null, formatVizValue(s.max, unit, locale)), /* @__PURE__ */ import_react77.default.createElement("td", null, formatVizValue(s.iqr, unit, locale)), /* @__PURE__ */ import_react77.default.createElement("td", null, formatVizValue(s.mean, unit, locale), " \xB1 ", s.stdDev.toFixed(2)), /* @__PURE__ */ import_react77.default.createElement("td", null, s.outliers.length > 0 ? /* @__PURE__ */ import_react77.default.createElement("span", { className: "mds-dist-plot__outlier-badge" }, s.outliers.length, " (", s.outliers.map((o) => formatVizValue(o, unit, locale)).join(", "), ")") : "0"));
        })))))
      ),
      /* @__PURE__ */ import_react77.default.createElement("div", { className: "mds-dist-plot__sr-only", "aria-live": "polite" }, activeGroup ? `Distribution ${activeGroup.label}: Count ${activeGroup.boxStats.count}, Median ${activeGroup.boxStats.median.toFixed(2)} ${unit}, IQR ${activeGroup.boxStats.iqr.toFixed(2)}, Min ${activeGroup.boxStats.min.toFixed(2)}, Max ${activeGroup.boxStats.max.toFixed(2)}.` : "")
    );
  }

  // components/data/Heatmap.jsx
  var import_react78 = __toESM(require_react(), 1);
  function Heatmap({
    data = [],
    // [{ row: 'CNC-01', col: '06:00', value: 42.5 }, ...] or 2D matrix
    rows = [],
    // Explicit row labels
    cols = [],
    // Explicit col labels
    rowKey = "row",
    colKey = "col",
    valueKey = "value",
    variant = "matrix",
    // 'matrix' | 'clustered' | 'calendar' | 'correlation'
    colorScaleType = "sequential",
    // 'sequential' | 'diverging'
    colorRange = ["#eff6ff", "#1d4ed8"],
    // [minColor, maxColor] or [neg, neutral, pos]
    domain = null,
    // [minVal, maxVal]
    neutralValue = 0,
    cellPadding = 2,
    cellRadius = 2,
    showCellValues = false,
    width = 640,
    height = 360,
    margins = { top: 32, right: 80, bottom: 48, left: 80 },
    unit = "",
    rowLabel = "Row Dimension",
    colLabel = "Column Dimension",
    valueLabel = "Intensity Value",
    locale = "en-IN",
    title,
    subtitle,
    missingCellLabel = "No Record / Down",
    showLegend = true,
    density = "standard",
    // 'compact' | 'standard' | 'expanded'
    emptyMessage = "No matrix observation records found.",
    loading = false,
    onCellSelect,
    className = "",
    style = {}
  }) {
    const chartId = (0, import_react78.useId)();
    const containerRef = (0, import_react78.useRef)(null);
    const [activeCellCoord, setActiveCellCoord] = (0, import_react78.useState)(null);
    const [selectedCellCoord, setSelectedCellCoord] = (0, import_react78.useState)(null);
    const [showTableModal, setShowTableModal] = (0, import_react78.useState)(false);
    const rowLabels = (0, import_react78.useMemo)(() => {
      if (rows && rows.length > 0) return rows;
      if (!data || data.length === 0) return [];
      return Array.from(new Set(data.map((d) => String(d[rowKey])))).filter(Boolean);
    }, [rows, data, rowKey]);
    const colLabels = (0, import_react78.useMemo)(() => {
      if (cols && cols.length > 0) return cols;
      if (!data || data.length === 0) return [];
      return Array.from(new Set(data.map((d) => String(d[colKey])))).filter(Boolean);
    }, [cols, data, colKey]);
    const { gridMatrix, allValues, minVal, maxVal } = (0, import_react78.useMemo)(() => {
      const map = /* @__PURE__ */ new Map();
      const vals = [];
      data.forEach((d) => {
        const r = String(d[rowKey]);
        const c = String(d[colKey]);
        const v = d[valueKey] != null ? Number(d[valueKey]) : null;
        map.set(`${r}:::${c}`, { datum: d, value: v });
        if (v != null && !isNaN(v)) vals.push(v);
      });
      const matrix = rowLabels.map((r) => {
        return colLabels.map((c) => {
          const item = map.get(`${r}:::${c}`);
          return item || { datum: { [rowKey]: r, [colKey]: c }, value: null };
        });
      });
      let minV = 0, maxV = 100;
      if (vals.length > 0) {
        minV = Math.min(...vals);
        maxV = Math.max(...vals);
      }
      if (domain) {
        minV = domain[0];
        maxV = domain[1];
      } else if (variant === "correlation") {
        minV = -1;
        maxV = 1;
      }
      return { gridMatrix: matrix, allValues: vals, minVal: minV, maxVal: maxV };
    }, [data, rowLabels, colLabels, rowKey, colKey, valueKey, domain, variant]);
    const plot = (0, import_react78.useMemo)(() => {
      return createPlotRegion({
        containerWidth: width,
        containerHeight: height,
        margins
      });
    }, [width, height, margins]);
    const scales = (0, import_react78.useMemo)(() => {
      if (rowLabels.length === 0 || colLabels.length === 0) {
        return { scaleX: null, scaleY: null, colorScale: null };
      }
      const scaleX = createBandScale({
        domain: colLabels,
        range: [0, plot.plotWidth],
        padding: 0
      });
      const scaleY = createBandScale({
        domain: rowLabels,
        range: [0, plot.plotHeight],
        padding: 0
      });
      let colorScale;
      if (colorScaleType === "diverging" || variant === "correlation") {
        colorScale = createDivergingColorScale({
          domain: [minVal, maxVal],
          colors: colorRange.length >= 3 ? colorRange : ["#ef4444", "#f8fafc", "#2563eb"],
          neutral: neutralValue
        });
      } else {
        colorScale = createSequentialColorScale({
          domain: [minVal, maxVal],
          colors: colorRange.length >= 2 ? colorRange : ["#eff6ff", "#1d4ed8"]
        });
      }
      return { scaleX, scaleY, colorScale };
    }, [rowLabels, colLabels, plot, colorScaleType, variant, minVal, maxVal, colorRange, neutralValue]);
    const totalCells = rowLabels.length * colLabels.length;
    const current1DIndex = activeCellCoord ? activeCellCoord.rIdx * colLabels.length + activeCellCoord.cIdx : -1;
    const handleKeyDown = (e) => {
      if (rowLabels.length === 0 || colLabels.length === 0) return;
      let r = activeCellCoord ? activeCellCoord.rIdx : 0;
      let c = activeCellCoord ? activeCellCoord.cIdx : 0;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          c = (c + 1) % colLabels.length;
          setActiveCellCoord({ rIdx: r, cIdx: c });
          break;
        case "ArrowLeft":
          e.preventDefault();
          c = (c - 1 + colLabels.length) % colLabels.length;
          setActiveCellCoord({ rIdx: r, cIdx: c });
          break;
        case "ArrowDown":
          e.preventDefault();
          r = (r + 1) % rowLabels.length;
          setActiveCellCoord({ rIdx: r, cIdx: c });
          break;
        case "ArrowUp":
          e.preventDefault();
          r = (r - 1 + rowLabels.length) % rowLabels.length;
          setActiveCellCoord({ rIdx: r, cIdx: c });
          break;
        case "Home":
          e.preventDefault();
          setActiveCellCoord({ rIdx: 0, cIdx: 0 });
          break;
        case "End":
          e.preventDefault();
          setActiveCellCoord({ rIdx: rowLabels.length - 1, cIdx: colLabels.length - 1 });
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (activeCellCoord) {
            setSelectedCellCoord(activeCellCoord);
            const cellItem = gridMatrix[activeCellCoord.rIdx][activeCellCoord.cIdx];
            if (onCellSelect) onCellSelect(cellItem.datum, activeCellCoord);
          }
          break;
        case "Escape":
          e.preventDefault();
          setActiveCellCoord(null);
          break;
        case "F11":
          if (e.altKey) {
            e.preventDefault();
            setShowTableModal((prev) => !prev);
          }
          break;
        default:
          break;
      }
    };
    const activeCell = activeCellCoord && gridMatrix[activeCellCoord.rIdx] ? gridMatrix[activeCellCoord.rIdx][activeCellCoord.cIdx] : null;
    if (loading) {
      return /* @__PURE__ */ import_react78.default.createElement(
        "div",
        {
          className: `mds-heatmap mds-heatmap--loading ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Heatmap Loading",
          "aria-busy": "true"
        },
        /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__skeleton-header" }, /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__skeleton-title" }), /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__skeleton-sub" })),
        /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__skeleton-plot" })
      );
    }
    if (!data || data.length === 0 || rowLabels.length === 0 || colLabels.length === 0) {
      return /* @__PURE__ */ import_react78.default.createElement(
        "div",
        {
          className: `mds-heatmap mds-heatmap--empty ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Heatmap Empty"
        },
        title && /* @__PURE__ */ import_react78.default.createElement("h3", { className: "mds-heatmap__title" }, title),
        /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__empty-msg" }, /* @__PURE__ */ import_react78.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }, /* @__PURE__ */ import_react78.default.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }), /* @__PURE__ */ import_react78.default.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }), /* @__PURE__ */ import_react78.default.createElement("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" }), /* @__PURE__ */ import_react78.default.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" })), /* @__PURE__ */ import_react78.default.createElement("p", null, emptyMessage))
      );
    }
    const cellWidth = scales.scaleX.bandwidth();
    const cellHeight = scales.scaleY.bandwidth();
    return /* @__PURE__ */ import_react78.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `mds-heatmap mds-heatmap--${variant} mds-heatmap--density-${density} ${className}`,
        style: { width, ...style },
        role: "region",
        "aria-roledescription": "heatmap",
        "aria-label": title || "2D Heatmap Matrix Visualization",
        tabIndex: 0,
        onKeyDown: handleKeyDown
      },
      (title || subtitle) && /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__header" }, /* @__PURE__ */ import_react78.default.createElement("div", null, title && /* @__PURE__ */ import_react78.default.createElement("h3", { className: "mds-heatmap__title" }, title), subtitle && /* @__PURE__ */ import_react78.default.createElement("p", { className: "mds-heatmap__subtitle" }, subtitle)), /* @__PURE__ */ import_react78.default.createElement(
        "button",
        {
          type: "button",
          className: "mds-heatmap__table-btn",
          onClick: () => setShowTableModal(true),
          title: "View as Data Table (Alt+F11)",
          "aria-label": "Toggle accessible tabular heatmap"
        },
        /* @__PURE__ */ import_react78.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ import_react78.default.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), /* @__PURE__ */ import_react78.default.createElement("path", { d: "M3 9h18M3 15h18M9 3v18" })),
        "Table"
      )),
      /* @__PURE__ */ import_react78.default.createElement(
        "svg",
        {
          width,
          height,
          className: "mds-heatmap__svg",
          "aria-hidden": "true",
          onClick: () => setActiveCellCoord(null)
        },
        /* @__PURE__ */ import_react78.default.createElement("defs", null, /* @__PURE__ */ import_react78.default.createElement("pattern", { id: `${chartId}-missing-hatch`, width: "6", height: "6", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45 0 0)" }, /* @__PURE__ */ import_react78.default.createElement("line", { x1: "0", y1: "0", x2: "0", y2: "6", stroke: "var(--border-strong, #94a3b8)", strokeWidth: "1.2", opacity: "0.4" })), /* @__PURE__ */ import_react78.default.createElement("linearGradient", { id: `${chartId}-legend-grad`, x1: "0", y1: "1", x2: "0", y2: "0" }, colorScaleType === "diverging" || variant === "correlation" ? /* @__PURE__ */ import_react78.default.createElement(import_react78.default.Fragment, null, /* @__PURE__ */ import_react78.default.createElement("stop", { offset: "0%", stopColor: colorRange[0] || "#ef4444" }), /* @__PURE__ */ import_react78.default.createElement("stop", { offset: "50%", stopColor: colorRange[1] || "#f8fafc" }), /* @__PURE__ */ import_react78.default.createElement("stop", { offset: "100%", stopColor: colorRange[2] || "#2563eb" })) : /* @__PURE__ */ import_react78.default.createElement(import_react78.default.Fragment, null, /* @__PURE__ */ import_react78.default.createElement("stop", { offset: "0%", stopColor: colorRange[0] || "#eff6ff" }), /* @__PURE__ */ import_react78.default.createElement("stop", { offset: "100%", stopColor: colorRange[1] || "#1d4ed8" })))),
        /* @__PURE__ */ import_react78.default.createElement("g", { transform: `translate(${plot.margins.left}, ${plot.margins.top})` }, gridMatrix.map((rowCells, rIdx) => {
          const rLabel = rowLabels[rIdx];
          const yPos = scales.scaleY(rLabel);
          return /* @__PURE__ */ import_react78.default.createElement("g", { key: `row-${rLabel}`, className: "mds-heatmap__row", role: "row" }, rowCells.map((cell, cIdx) => {
            const cLabel = colLabels[cIdx];
            const xPos = scales.scaleX(cLabel);
            const isNull = cell.value == null || isNaN(cell.value);
            const fill = isNull ? `url(#${chartId}-missing-hatch)` : scales.colorScale(cell.value);
            const isActive = activeCellCoord && activeCellCoord.rIdx === rIdx && activeCellCoord.cIdx === cIdx;
            const isSelected = selectedCellCoord && selectedCellCoord.rIdx === rIdx && selectedCellCoord.cIdx === cIdx;
            let textColor = "var(--text-primary, #0f172a)";
            if (!isNull) {
              const normalizedRatio = (cell.value - minVal) / (maxVal - minVal || 1);
              if (normalizedRatio > 0.55 || colorScaleType === "diverging" && Math.abs(cell.value) > 0.6) {
                textColor = "#ffffff";
              }
            }
            return /* @__PURE__ */ import_react78.default.createElement(
              "g",
              {
                key: `cell-${rLabel}-${cLabel}`,
                transform: `translate(${xPos + cellPadding / 2}, ${yPos + cellPadding / 2})`,
                className: "mds-heatmap__cell-group",
                onPointerEnter: (e) => {
                  e.stopPropagation();
                  setActiveCellCoord({ rIdx, cIdx });
                },
                onClick: (e) => {
                  e.stopPropagation();
                  setSelectedCellCoord({ rIdx, cIdx });
                  if (onCellSelect) onCellSelect(cell.datum, { rIdx, cIdx });
                },
                style: { cursor: "pointer" }
              },
              /* @__PURE__ */ import_react78.default.createElement(
                "rect",
                {
                  width: Math.max(2, cellWidth - cellPadding),
                  height: Math.max(2, cellHeight - cellPadding),
                  rx: cellRadius,
                  fill,
                  stroke: isActive || isSelected ? "var(--text-primary, #0f172a)" : "rgba(0,0,0,0.06)",
                  strokeWidth: isActive || isSelected ? 2 : 1,
                  className: "mds-heatmap__cell"
                }
              ),
              showCellValues && !isNull && cellWidth > 28 && cellHeight > 18 && /* @__PURE__ */ import_react78.default.createElement(
                "text",
                {
                  x: (cellWidth - cellPadding) / 2,
                  y: (cellHeight - cellPadding) / 2,
                  dy: "0.32em",
                  textAnchor: "middle",
                  fill: textColor,
                  className: "mds-heatmap__cell-text",
                  style: { fontSize: Math.min(11, Math.max(9, cellHeight * 0.45)), pointerEvents: "none" }
                },
                cell.value.toFixed(1)
              )
            );
          }));
        }), rowLabels.map((rLabel) => {
          const yPos = scales.scaleY(rLabel) + cellHeight / 2;
          return /* @__PURE__ */ import_react78.default.createElement(
            "text",
            {
              key: `ylabel-${rLabel}`,
              x: "-10",
              y: yPos,
              dy: "0.32em",
              textAnchor: "end",
              className: "mds-heatmap__row-label"
            },
            rLabel
          );
        }), colLabels.map((cLabel) => {
          const xPos = scales.scaleX(cLabel) + cellWidth / 2;
          return /* @__PURE__ */ import_react78.default.createElement(
            "text",
            {
              key: `xlabel-${cLabel}`,
              x: xPos,
              y: plot.plotHeight + 18,
              textAnchor: "middle",
              className: "mds-heatmap__col-label"
            },
            cLabel
          );
        }), showLegend && /* @__PURE__ */ import_react78.default.createElement("g", { transform: `translate(${plot.plotWidth + 24}, 10)`, className: "mds-heatmap__legend-group" }, /* @__PURE__ */ import_react78.default.createElement("text", { x: "0", y: "-6", className: "mds-heatmap__legend-title" }, unit || "Intensity"), /* @__PURE__ */ import_react78.default.createElement(
          "rect",
          {
            x: "0",
            y: "0",
            width: "12",
            height: plot.plotHeight - 20,
            fill: `url(#${chartId}-legend-grad)`,
            stroke: "var(--border-subtle, #cbd5e1)",
            rx: "2"
          }
        ), /* @__PURE__ */ import_react78.default.createElement("text", { x: "18", y: "8", dy: "0.32em", className: "mds-heatmap__legend-tick" }, formatVizValue(maxVal, unit, locale)), colorScaleType === "diverging" && /* @__PURE__ */ import_react78.default.createElement("text", { x: "18", y: (plot.plotHeight - 20) / 2, dy: "0.32em", className: "mds-heatmap__legend-tick" }, formatVizValue(neutralValue, unit, locale)), /* @__PURE__ */ import_react78.default.createElement("text", { x: "18", y: plot.plotHeight - 24, dy: "0.32em", className: "mds-heatmap__legend-tick" }, formatVizValue(minVal, unit, locale))))
      ),
      activeCell && activeCellCoord && /* @__PURE__ */ import_react78.default.createElement(
        "div",
        {
          className: "mds-heatmap__tooltip",
          style: {
            left: Math.min(plot.toCanvasX(scales.scaleX(colLabels[activeCellCoord.cIdx])) + cellWidth / 2 + 10, width - 200),
            top: Math.max(10, plot.toCanvasY(scales.scaleY(rowLabels[activeCellCoord.rIdx])) - 15)
          },
          role: "tooltip"
        },
        /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__tooltip-header" }, /* @__PURE__ */ import_react78.default.createElement("strong", null, rowLabels[activeCellCoord.rIdx], " \xD7 ", colLabels[activeCellCoord.cIdx])),
        /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__tooltip-body" }, /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__tooltip-row" }, /* @__PURE__ */ import_react78.default.createElement("span", null, valueLabel, ":"), /* @__PURE__ */ import_react78.default.createElement("strong", null, activeCell.value != null ? formatVizValue(activeCell.value, unit, locale) : missingCellLabel)), variant === "correlation" && activeCell.value != null && /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__tooltip-row mds-heatmap__tooltip-row--sub" }, /* @__PURE__ */ import_react78.default.createElement("span", null, "Correlation:"), /* @__PURE__ */ import_react78.default.createElement("em", null, activeCell.value > 0.7 ? "Strong Positive" : activeCell.value < -0.7 ? "Strong Negative" : "Weak / Neutral")))
      ),
      showTableModal && /* @__PURE__ */ import_react78.default.createElement(
        "div",
        {
          className: "mds-heatmap__modal-backdrop",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": `${chartId}-table-title`
        },
        /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__modal" }, /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__modal-header" }, /* @__PURE__ */ import_react78.default.createElement("h4", { id: `${chartId}-table-title` }, title || "Heatmap 2D Matrix Table"), /* @__PURE__ */ import_react78.default.createElement(
          "button",
          {
            type: "button",
            className: "mds-heatmap__modal-close",
            onClick: () => setShowTableModal(false),
            "aria-label": "Close matrix data table"
          },
          "\u2715"
        )), /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__modal-body" }, /* @__PURE__ */ import_react78.default.createElement("table", { className: "mds-heatmap__data-table" }, /* @__PURE__ */ import_react78.default.createElement("thead", null, /* @__PURE__ */ import_react78.default.createElement("tr", null, /* @__PURE__ */ import_react78.default.createElement("th", null, rowLabel), colLabels.map((col2) => /* @__PURE__ */ import_react78.default.createElement("th", { key: col2 }, col2)))), /* @__PURE__ */ import_react78.default.createElement("tbody", null, gridMatrix.map((rowCells, rIdx) => /* @__PURE__ */ import_react78.default.createElement("tr", { key: rowLabels[rIdx] }, /* @__PURE__ */ import_react78.default.createElement("td", null, /* @__PURE__ */ import_react78.default.createElement("strong", null, rowLabels[rIdx])), rowCells.map((cell, cIdx) => /* @__PURE__ */ import_react78.default.createElement("td", { key: colLabels[cIdx] }, cell.value != null ? formatVizValue(cell.value, unit, locale) : "\u2014"))))))))
      ),
      /* @__PURE__ */ import_react78.default.createElement("div", { className: "mds-heatmap__sr-only", "aria-live": "polite" }, activeCell && activeCellCoord ? `Selected matrix cell ${rowLabels[activeCellCoord.rIdx]}, ${colLabels[activeCellCoord.cIdx]}: ${activeCell.value != null ? `${activeCell.value} ${unit}` : missingCellLabel}.` : "")
    );
  }

  // components/data/PieChart.jsx
  var import_react79 = __toESM(require_react(), 1);
  function PieChart({
    data = [],
    // [{ name: 'Turnings', value: 450 }, ...]
    categoryKey = "name",
    valueKey = "value",
    variant = "pie",
    // 'pie' | 'donut'
    innerRadiusRatio = 0.62,
    // Ratio of inner radius for donut variant (0.5 to 0.75)
    padAngle = 0.02,
    // Radial padding between sectors in radians
    width = 440,
    height = 340,
    margins = { top: 20, right: 20, bottom: 24, left: 20 },
    unit = "",
    valueLabel = "Share",
    centerLabel = "Total",
    locale = "en-IN",
    title,
    subtitle,
    showLabels = true,
    showLegend = true,
    showCenterTotal = true,
    enablePatterns = true,
    density = "standard",
    // 'compact' | 'standard' | 'expanded'
    emptyMessage = "No part-to-whole records available.",
    loading = false,
    onSliceSelect,
    className = "",
    style = {}
  }) {
    const chartId = (0, import_react79.useId)();
    const containerRef = (0, import_react79.useRef)(null);
    const [activeSliceIndex, setActiveSliceIndex] = (0, import_react79.useState)(-1);
    const [selectedSliceIndex, setSelectedSliceIndex] = (0, import_react79.useState)(-1);
    const [isolatedCategory, setIsolatedCategory] = (0, import_react79.useState)(null);
    const [showTableModal, setShowTableModal] = (0, import_react79.useState)(false);
    const rawSlices = (0, import_react79.useMemo)(() => {
      if (!data || data.length === 0) return [];
      return computePieSlices(data, {
        valueKey,
        padAngle
      });
    }, [data, valueKey, padAngle]);
    const totalSum = (0, import_react79.useMemo)(() => {
      return rawSlices.length > 0 ? rawSlices[0].total : 0;
    }, [rawSlices]);
    const slices = (0, import_react79.useMemo)(() => {
      return rawSlices.map((s, idx) => {
        const catName = String(s.datum[categoryKey] || `Category ${idx + 1}`);
        const color = s.datum.color || VIZ_COLORS[idx % VIZ_COLORS.length];
        const pattern = PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id;
        return {
          ...s,
          catName,
          color,
          pattern
        };
      });
    }, [rawSlices, categoryKey]);
    const plotWidth = width - margins.left - margins.right;
    const plotHeight = height - margins.top - margins.bottom;
    const cx = margins.left + plotWidth / 2;
    const cy = margins.top + plotHeight / 2 - (showLegend ? 16 : 0);
    const maxRadius = Math.min(plotWidth, plotHeight) / 2 - (showLabels ? 28 : 10);
    const outerRadius = Math.max(20, maxRadius);
    const innerRadius = variant === "donut" ? outerRadius * innerRadiusRatio : 0;
    const handleKeyDown = createKeyboardRovingFocus({
      itemCount: slices.length,
      currentIndex: activeSliceIndex,
      onIndexChange: (idx) => {
        setActiveSliceIndex(idx);
        if (onSliceSelect && slices[idx]) {
          onSliceSelect(slices[idx].datum, idx);
        }
      },
      onSelect: (idx) => {
        setSelectedSliceIndex(idx);
        if (onSliceSelect && slices[idx]) {
          onSliceSelect(slices[idx].datum, idx);
        }
      },
      onDismiss: () => {
        setActiveSliceIndex(-1);
      },
      onToggleTable: () => {
        setShowTableModal((prev) => !prev);
      }
    });
    const activeSlice = activeSliceIndex >= 0 ? slices[activeSliceIndex] : null;
    if (loading) {
      return /* @__PURE__ */ import_react79.default.createElement(
        "div",
        {
          className: `mds-pie-chart mds-pie-chart--loading ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Pie Chart Loading",
          "aria-busy": "true"
        },
        /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__skeleton-header" }, /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__skeleton-title" }), /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__skeleton-sub" })),
        /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__skeleton-circle" })
      );
    }
    if (!data || data.length === 0 || totalSum === 0) {
      return /* @__PURE__ */ import_react79.default.createElement(
        "div",
        {
          className: `mds-pie-chart mds-pie-chart--empty ${className}`,
          style: { width, height, ...style },
          role: "region",
          "aria-label": title || "Pie Chart Empty"
        },
        title && /* @__PURE__ */ import_react79.default.createElement("h3", { className: "mds-pie-chart__title" }, title),
        /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__empty-msg" }, /* @__PURE__ */ import_react79.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }, /* @__PURE__ */ import_react79.default.createElement("path", { d: "M21.21 15.89A10 10 0 1 1 8 2.83" }), /* @__PURE__ */ import_react79.default.createElement("path", { d: "M22 12A10 10 0 0 0 12 2v10z" })), /* @__PURE__ */ import_react79.default.createElement("p", null, emptyMessage))
      );
    }
    return /* @__PURE__ */ import_react79.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `mds-pie-chart mds-pie-chart--${variant} mds-pie-chart--density-${density} ${className}`,
        style: { width, ...style },
        role: "region",
        "aria-roledescription": "pie chart",
        "aria-label": title || "Proportional Part-to-Whole Pie Chart",
        tabIndex: 0,
        onKeyDown: handleKeyDown
      },
      (title || subtitle) && /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__header" }, /* @__PURE__ */ import_react79.default.createElement("div", null, title && /* @__PURE__ */ import_react79.default.createElement("h3", { className: "mds-pie-chart__title" }, title), subtitle && /* @__PURE__ */ import_react79.default.createElement("p", { className: "mds-pie-chart__subtitle" }, subtitle)), /* @__PURE__ */ import_react79.default.createElement(
        "button",
        {
          type: "button",
          className: "mds-pie-chart__table-btn",
          onClick: () => setShowTableModal(true),
          title: "View as Data Table (Alt+F11)",
          "aria-label": "Toggle accessible tabular proportions"
        },
        /* @__PURE__ */ import_react79.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ import_react79.default.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), /* @__PURE__ */ import_react79.default.createElement("path", { d: "M3 9h18M3 15h18M9 3v18" })),
        "Table"
      )),
      /* @__PURE__ */ import_react79.default.createElement(
        "svg",
        {
          width,
          height,
          className: "mds-pie-chart__svg",
          "aria-hidden": "true",
          onClick: () => setActiveSliceIndex(-1)
        },
        /* @__PURE__ */ import_react79.default.createElement("defs", null, PATTERN_PRESETS.map((pat) => /* @__PURE__ */ import_react79.default.createElement(
          "pattern",
          {
            key: pat.id,
            id: `${chartId}-${pat.id}`,
            width: "8",
            height: "8",
            patternUnits: "userSpaceOnUse",
            patternTransform: pat.transform || ""
          },
          pat.type === "circle" ? /* @__PURE__ */ import_react79.default.createElement("circle", { cx: "4", cy: "4", r: 1.2, fill: "rgba(255,255,255,0.4)" }) : /* @__PURE__ */ import_react79.default.createElement("line", { x1: "0", y1: "4", x2: "8", y2: "4", stroke: "rgba(255,255,255,0.35)", strokeWidth: "1.2" })
        ))),
        /* @__PURE__ */ import_react79.default.createElement("g", { className: "mds-pie-chart__sectors" }, slices.map((slice, idx) => {
          const isActive = activeSliceIndex === idx;
          const isSelected = selectedSliceIndex === idx;
          const isDimmed = isolatedCategory && isolatedCategory !== slice.catName;
          const expandOffset = isActive || isSelected ? 6 : 0;
          const sliceCx = cx + expandOffset * Math.cos(slice.midAngle);
          const sliceCy = cy + expandOffset * Math.sin(slice.midAngle);
          const arcD = createArcPath({
            cx: sliceCx,
            cy: sliceCy,
            innerRadius,
            outerRadius: isActive || isSelected ? outerRadius + 2 : outerRadius,
            startAngle: slice.startAngle,
            endAngle: slice.endAngle
          });
          const labelRadius = outerRadius + 18;
          const lx = cx + labelRadius * Math.cos(slice.midAngle);
          const ly = cy + labelRadius * Math.sin(slice.midAngle);
          const textAnchor = Math.cos(slice.midAngle) > 0.1 ? "start" : Math.cos(slice.midAngle) < -0.1 ? "end" : "middle";
          return /* @__PURE__ */ import_react79.default.createElement(
            "g",
            {
              key: `slice-${idx}`,
              className: "mds-pie-chart__slice-group",
              onPointerEnter: (e) => {
                e.stopPropagation();
                setActiveSliceIndex(idx);
              },
              onClick: (e) => {
                e.stopPropagation();
                setSelectedSliceIndex(idx);
                if (onSliceSelect) onSliceSelect(slice.datum, idx);
              },
              style: { cursor: "pointer", transition: "transform 150ms ease" }
            },
            /* @__PURE__ */ import_react79.default.createElement(
              "path",
              {
                d: arcD,
                fill: slice.color,
                opacity: isDimmed ? 0.2 : 0.9,
                stroke: "var(--surface-card, #ffffff)",
                strokeWidth: "2",
                className: "mds-pie-chart__arc"
              }
            ),
            enablePatterns && /* @__PURE__ */ import_react79.default.createElement(
              "path",
              {
                d: arcD,
                fill: `url(#${chartId}-${slice.pattern})`,
                opacity: 0.6,
                stroke: "none",
                style: { pointerEvents: "none" }
              }
            ),
            showLabels && slice.percentage >= 5 && /* @__PURE__ */ import_react79.default.createElement(
              "text",
              {
                x: lx,
                y: ly,
                dy: "0.32em",
                textAnchor,
                className: "mds-pie-chart__label",
                style: {
                  fontSize: "11px",
                  fontWeight: isActive ? "bold" : "normal",
                  fill: isActive ? "var(--text-primary)" : "var(--text-secondary)"
                }
              },
              slice.catName,
              " (",
              slice.percentage.toFixed(1),
              "%)"
            )
          );
        }), variant === "donut" && showCenterTotal && /* @__PURE__ */ import_react79.default.createElement("g", { className: "mds-pie-chart__center", style: { pointerEvents: "none" } }, /* @__PURE__ */ import_react79.default.createElement("text", { x: cx, y: cy - 6, textAnchor: "middle", className: "mds-pie-chart__center-val" }, formatVizValue(activeSlice ? activeSlice.value : totalSum, unit, locale)), /* @__PURE__ */ import_react79.default.createElement("text", { x: cx, y: cy + 12, textAnchor: "middle", className: "mds-pie-chart__center-label" }, activeSlice ? `${activeSlice.catName} (${activeSlice.percentage.toFixed(1)}%)` : centerLabel)))
      ),
      showLegend && slices.length > 1 && /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__legend", role: "toolbar", "aria-label": "Proportions Legend" }, slices.map((slice) => {
        const isDimmed = isolatedCategory && isolatedCategory !== slice.catName;
        return /* @__PURE__ */ import_react79.default.createElement(
          "button",
          {
            key: slice.catName,
            type: "button",
            className: `mds-pie-chart__legend-item ${isDimmed ? "mds-pie-chart__legend-item--dimmed" : ""}`,
            onClick: () => setIsolatedCategory(isolatedCategory === slice.catName ? null : slice.catName),
            "aria-pressed": isolatedCategory === slice.catName,
            title: `Click to isolate ${slice.catName}`
          },
          /* @__PURE__ */ import_react79.default.createElement("span", { className: "mds-pie-chart__legend-swatch", style: { backgroundColor: slice.color } }),
          /* @__PURE__ */ import_react79.default.createElement("span", { className: "mds-pie-chart__legend-label" }, slice.catName),
          /* @__PURE__ */ import_react79.default.createElement("strong", { className: "mds-pie-chart__legend-pct" }, slice.percentage.toFixed(1), "%")
        );
      })),
      activeSlice && /* @__PURE__ */ import_react79.default.createElement(
        "div",
        {
          className: "mds-pie-chart__tooltip",
          style: {
            left: Math.min(cx + outerRadius * 0.7 * Math.cos(activeSlice.midAngle) + 20, width - 180),
            top: Math.max(10, cy + outerRadius * 0.7 * Math.sin(activeSlice.midAngle) - 20)
          },
          role: "tooltip"
        },
        /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__tooltip-header" }, /* @__PURE__ */ import_react79.default.createElement("strong", null, activeSlice.catName)),
        /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__tooltip-body" }, /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__tooltip-row" }, /* @__PURE__ */ import_react79.default.createElement("span", null, valueLabel, ":"), /* @__PURE__ */ import_react79.default.createElement("strong", null, formatVizValue(activeSlice.value, unit, locale))), /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__tooltip-row" }, /* @__PURE__ */ import_react79.default.createElement("span", null, "Proportion:"), /* @__PURE__ */ import_react79.default.createElement("strong", null, activeSlice.percentage.toFixed(1), "%")))
      ),
      showTableModal && /* @__PURE__ */ import_react79.default.createElement(
        "div",
        {
          className: "mds-pie-chart__modal-backdrop",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": `${chartId}-table-title`
        },
        /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__modal" }, /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__modal-header" }, /* @__PURE__ */ import_react79.default.createElement("h4", { id: `${chartId}-table-title` }, title || "Part-to-Whole Breakdown"), /* @__PURE__ */ import_react79.default.createElement(
          "button",
          {
            type: "button",
            className: "mds-pie-chart__modal-close",
            onClick: () => setShowTableModal(false),
            "aria-label": "Close proportions table"
          },
          "\u2715"
        )), /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__modal-body" }, /* @__PURE__ */ import_react79.default.createElement("table", { className: "mds-pie-chart__data-table" }, /* @__PURE__ */ import_react79.default.createElement("thead", null, /* @__PURE__ */ import_react79.default.createElement("tr", null, /* @__PURE__ */ import_react79.default.createElement("th", null, "Category"), /* @__PURE__ */ import_react79.default.createElement("th", null, "Value (", unit || "Units", ")"), /* @__PURE__ */ import_react79.default.createElement("th", null, "Percentage Share"))), /* @__PURE__ */ import_react79.default.createElement("tbody", null, slices.map((slice) => /* @__PURE__ */ import_react79.default.createElement("tr", { key: slice.catName }, /* @__PURE__ */ import_react79.default.createElement("td", null, /* @__PURE__ */ import_react79.default.createElement("strong", null, slice.catName)), /* @__PURE__ */ import_react79.default.createElement("td", null, formatVizValue(slice.value, unit, locale)), /* @__PURE__ */ import_react79.default.createElement("td", null, /* @__PURE__ */ import_react79.default.createElement("strong", null, slice.percentage.toFixed(1), "%")))), /* @__PURE__ */ import_react79.default.createElement("tr", { className: "mds-pie-chart__table-total" }, /* @__PURE__ */ import_react79.default.createElement("td", null, /* @__PURE__ */ import_react79.default.createElement("strong", null, "Total Aggregate (100.0%)")), /* @__PURE__ */ import_react79.default.createElement("td", null, /* @__PURE__ */ import_react79.default.createElement("strong", null, formatVizValue(totalSum, unit, locale))), /* @__PURE__ */ import_react79.default.createElement("td", null, /* @__PURE__ */ import_react79.default.createElement("strong", null, "100.0%")))))))
      ),
      /* @__PURE__ */ import_react79.default.createElement("div", { className: "mds-pie-chart__sr-only", "aria-live": "polite" }, activeSlice ? `Selected sector ${activeSlice.catName}: ${activeSlice.value} ${unit}, representing ${activeSlice.percentage.toFixed(1)}% of total.` : "")
    );
  }

  // components/data/Treemap.jsx
  var import_react80 = __toESM(require_react(), 1);
  function Treemap({
    data,
    valueKey = "value",
    labelKey = "label",
    categoryKey = "category",
    childrenKey = "children",
    width = 720,
    height = 460,
    algorithm = "squarified",
    // 'squarified' | 'slice-and-dice'
    maxDepth = Infinity,
    colorScale = VIZ_COLORS,
    patternFills = true,
    unit = "",
    locale = "en-IN",
    title = "",
    subtitle = "",
    enableDrilldown = true,
    selectedId: controlledSelectedId = null,
    onNodeClick = null,
    onNodeSelect = null,
    onDrill = null,
    className = ""
  }) {
    const [drillStack, setDrillStack] = (0, import_react80.useState)([]);
    const [internalSelectedId, setInternalSelectedId] = (0, import_react80.useState)(null);
    const [hoveredNode, setHoveredNode] = (0, import_react80.useState)(null);
    const [focusedIndex, setFocusedIndex] = (0, import_react80.useState)(-1);
    const [showTableModal, setShowTableModal] = (0, import_react80.useState)(false);
    const [announcement, setAnnouncement] = (0, import_react80.useState)("");
    const containerRef = (0, import_react80.useRef)(null);
    const selectedId = controlledSelectedId !== void 0 && controlledSelectedId !== null ? controlledSelectedId : internalSelectedId;
    const fullRoot = (0, import_react80.useMemo)(() => {
      return rollupHierarchy(data, {
        labelKey,
        valueKey,
        categoryKey,
        childrenKey
      });
    }, [data, labelKey, valueKey, categoryKey, childrenKey]);
    const currentRoot = (0, import_react80.useMemo)(() => {
      if (!fullRoot) return null;
      if (drillStack.length === 0) return fullRoot;
      let curr = fullRoot;
      for (const stepId of drillStack) {
        if (curr.children && curr.children.length > 0) {
          const next = curr.children.find((c) => c.id === stepId);
          if (next) {
            curr = next;
          } else {
            break;
          }
        }
      }
      return curr;
    }, [fullRoot, drillStack]);
    const categoryColorMap = (0, import_react80.useMemo)(() => {
      const map = /* @__PURE__ */ new Map();
      if (!fullRoot) return map;
      const topCategories = (fullRoot.children || [fullRoot]).map((c) => c.category || c.label);
      const unique = Array.from(new Set(topCategories));
      unique.forEach((cat, idx) => {
        map.set(cat, {
          color: colorScale[idx % colorScale.length],
          pattern: PATTERN_PRESETS[idx % PATTERN_PRESETS.length]
        });
      });
      return map;
    }, [fullRoot, colorScale]);
    const layoutNodes = (0, import_react80.useMemo)(() => {
      if (!currentRoot) return [];
      return computeTreemapLayout({
        rootNode: currentRoot,
        x: 0,
        y: 0,
        width,
        height,
        padding: 2,
        containerPadding: 6,
        headerHeight: 22,
        algorithm,
        maxDepth
      });
    }, [currentRoot, width, height, algorithm, maxDepth]);
    const { branchNodes, leafNodes } = (0, import_react80.useMemo)(() => {
      const branches = [];
      const leaves = [];
      layoutNodes.forEach((node) => {
        if (node.id === currentRoot?.id && node.depth === currentRoot?.depth) return;
        if (node.isLeaf || maxDepth !== Infinity && node.depth >= maxDepth) {
          leaves.push(node);
        } else {
          branches.push(node);
        }
      });
      return { branchNodes: branches, leafNodes: leaves };
    }, [layoutNodes, currentRoot, maxDepth]);
    const handleDrillDown = (0, import_react80.useCallback)((node) => {
      if (!enableDrilldown || node.isLeaf || !node.children || node.children.length === 0) return;
      const newStack = [...drillStack, node.id];
      setDrillStack(newStack);
      setFocusedIndex(0);
      setAnnouncement(`Drilled down into ${node.label}. Total value: ${formatVizValue(node.value, unit, locale)}.`);
      if (onDrill) onDrill(node, newStack);
    }, [drillStack, enableDrilldown, unit, locale, onDrill]);
    const handleDrillUp = (0, import_react80.useCallback)((targetDepth) => {
      const newStack = drillStack.slice(0, targetDepth);
      setDrillStack(newStack);
      setFocusedIndex(0);
      setAnnouncement(newStack.length === 0 ? "Returned to top-level plant view." : `Navigated up hierarchy level ${targetDepth}.`);
      if (onDrill) onDrill(currentRoot, newStack);
    }, [drillStack, currentRoot, onDrill]);
    const handleSelectNode = (0, import_react80.useCallback)((node) => {
      setInternalSelectedId(node.id);
      const parentVal = currentRoot?.value || 1;
      const share = (node.value / parentVal * 100).toFixed(1);
      setAnnouncement(`Selected ${node.label}. Value: ${formatVizValue(node.value, unit, locale)} (${share}% of ${currentRoot?.label || "Total"}).`);
      if (onNodeSelect) onNodeSelect(node);
      if (onNodeClick) onNodeClick(node);
    }, [currentRoot, unit, locale, onNodeSelect, onNodeClick]);
    const navigableNodes = (0, import_react80.useMemo)(() => [...leafNodes, ...branchNodes], [leafNodes, branchNodes]);
    const handleKeyDown = (0, import_react80.useCallback)((e) => {
      if (navigableNodes.length === 0) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev + 1) % navigableNodes.length;
          const target = navigableNodes[next];
          setAnnouncement(`Focused ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
          return next;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev - 1 + navigableNodes.length) % navigableNodes.length;
          const target = navigableNodes[next];
          setAnnouncement(`Focused ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
          return next;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < navigableNodes.length) {
          const node = navigableNodes[focusedIndex];
          if (!node.isLeaf && enableDrilldown) {
            handleDrillDown(node);
          } else {
            handleSelectNode(node);
          }
        }
      } else if (e.key === "Backspace" || e.key === "Escape") {
        if (drillStack.length > 0) {
          e.preventDefault();
          handleDrillUp(drillStack.length - 1);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        setFocusedIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setFocusedIndex(navigableNodes.length - 1);
      } else if (e.altKey && (e.key === "F11" || e.keyCode === 122)) {
        e.preventDefault();
        setShowTableModal((prev) => !prev);
      }
    }, [navigableNodes, focusedIndex, unit, locale, enableDrilldown, handleDrillDown, handleSelectNode, drillStack, handleDrillUp]);
    const breadcrumbTrail = (0, import_react80.useMemo)(() => {
      if (!fullRoot) return [];
      const trail = [{ id: fullRoot.id, label: fullRoot.label, depth: 0 }];
      let curr = fullRoot;
      for (let i = 0; i < drillStack.length; i++) {
        const stepId = drillStack[i];
        if (curr.children) {
          const next = curr.children.find((c) => c.id === stepId);
          if (next) {
            trail.push({ id: next.id, label: next.label, depth: i + 1 });
            curr = next;
          }
        }
      }
      return trail;
    }, [fullRoot, drillStack]);
    if (!fullRoot || fullRoot.value === 0) {
      return /* @__PURE__ */ import_react80.default.createElement("div", { className: `treemap-empty ${className}`, style: { width, height, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-sunken, #f8fafc)", border: "1px dashed var(--border-subtle, #cbd5e1)", borderRadius: "var(--radius-md, 8px)", color: "var(--text-muted, #64748b)", fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "13px" } }, "No hierarchical data available to display");
    }
    return /* @__PURE__ */ import_react80.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `treemap-container ${className}`,
        style: {
          position: "relative",
          width,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          userSelect: "none"
        },
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "region",
        "aria-label": `Treemap: ${title || "Hierarchical Part-to-Whole"}. Total: ${formatVizValue(fullRoot.value, unit, locale)}. Use arrow keys to navigate nodes, Enter to drill down or select, Backspace to navigate up.`
      },
      /* @__PURE__ */ import_react80.default.createElement("div", { "aria-live": "polite", className: "sr-only", style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 } }, announcement),
      /* @__PURE__ */ import_react80.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" } }, /* @__PURE__ */ import_react80.default.createElement("div", null, title && /* @__PURE__ */ import_react80.default.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)", letterSpacing: "-0.01em" } }, title), subtitle && /* @__PURE__ */ import_react80.default.createElement("div", { style: { fontSize: "12px", color: "var(--text-secondary, #64748b)", marginTop: "2px" } }, subtitle)), /* @__PURE__ */ import_react80.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px" } }, /* @__PURE__ */ import_react80.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => setShowTableModal(true),
          style: {
            fontSize: "11px",
            fontWeight: 500,
            padding: "3px 8px",
            borderRadius: "var(--radius-sm, 4px)",
            border: "1px solid var(--border-subtle, #cbd5e1)",
            background: "var(--surface-card, #ffffff)",
            color: "var(--text-secondary, #475569)",
            cursor: "pointer"
          },
          title: "Open Accessible Data Table (Alt+F11)",
          "aria-label": "Open accessible hierarchy data table"
        },
        "Accessible Table"
      ))),
      /* @__PURE__ */ import_react80.default.createElement("nav", { "aria-label": "Hierarchy Breadcrumbs", style: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", fontSize: "12px", marginBottom: "8px", padding: "4px 8px", background: "var(--surface-sunken, #f1f5f9)", borderRadius: "var(--radius-sm, 4px)" } }, /* @__PURE__ */ import_react80.default.createElement("span", { style: { fontSize: "11px", fontWeight: 600, color: "var(--text-muted, #64748b)", marginRight: "4px" } }, "HIERARCHY:"), breadcrumbTrail.map((crumb, idx) => {
        const isLast = idx === breadcrumbTrail.length - 1;
        return /* @__PURE__ */ import_react80.default.createElement(import_react80.default.Fragment, { key: crumb.id }, idx > 0 && /* @__PURE__ */ import_react80.default.createElement("span", { style: { color: "var(--text-muted, #94a3b8)", margin: "0 2px" } }, "\u203A"), /* @__PURE__ */ import_react80.default.createElement(
          "button",
          {
            type: "button",
            onClick: () => !isLast && handleDrillUp(crumb.depth),
            style: {
              border: "none",
              background: "transparent",
              padding: "2px 4px",
              borderRadius: "3px",
              fontSize: "12px",
              fontWeight: isLast ? 600 : 400,
              color: isLast ? "var(--text-primary, #0f172a)" : "var(--action-solid, #2563eb)",
              cursor: isLast ? "default" : "pointer",
              textDecoration: isLast ? "none" : "underline"
            },
            disabled: isLast,
            "aria-current": isLast ? "location" : void 0
          },
          crumb.label
        ));
      }), /* @__PURE__ */ import_react80.default.createElement("span", { style: { marginLeft: "auto", fontSize: "11px", fontWeight: 500, color: "var(--text-secondary, #475569)" } }, "Total: ", /* @__PURE__ */ import_react80.default.createElement("strong", null, formatVizValue(currentRoot?.value, unit, locale)))),
      /* @__PURE__ */ import_react80.default.createElement(
        "svg",
        {
          width,
          height,
          style: {
            display: "block",
            background: "var(--surface-card, #ffffff)",
            border: "1px solid var(--border-subtle, #e2e8f0)",
            borderRadius: "var(--radius-md, 6px)",
            overflow: "hidden"
          }
        },
        /* @__PURE__ */ import_react80.default.createElement("defs", null, patternFills && PATTERN_PRESETS.map((pat) => /* @__PURE__ */ import_react80.default.createElement(
          "pattern",
          {
            key: pat.id,
            id: pat.id,
            width: "8",
            height: "8",
            patternUnits: "userSpaceOnUse",
            patternTransform: pat.transform || void 0
          },
          pat.type === "circle" ? /* @__PURE__ */ import_react80.default.createElement("circle", { cx: "4", cy: "4", r: pat.r || 1.2, fill: pat.fill || "rgba(255,255,255,0.45)" }) : /* @__PURE__ */ import_react80.default.createElement(
            "line",
            {
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "8",
              stroke: pat.stroke || "rgba(255,255,255,0.35)",
              strokeWidth: pat.strokeWidth || 1.5
            }
          )
        )), /* @__PURE__ */ import_react80.default.createElement("filter", { id: "tm-active-shadow", x: "-10%", y: "-10%", width: "120%", height: "120%" }, /* @__PURE__ */ import_react80.default.createElement("feDropShadow", { dx: "0", dy: "2", stdDeviation: "3", floodOpacity: "0.2" }))),
        branchNodes.map((branch) => {
          const isCurrentActive = branch.id === selectedId;
          return /* @__PURE__ */ import_react80.default.createElement(
            "g",
            {
              key: `branch-${branch.id}`,
              className: "treemap-branch",
              onClick: () => handleDrillDown(branch),
              style: { cursor: enableDrilldown ? "zoom-in" : "default" }
            },
            /* @__PURE__ */ import_react80.default.createElement(
              "rect",
              {
                x: branch.x,
                y: branch.y,
                width: branch.width,
                height: branch.height,
                fill: "var(--surface-sunken, #f8fafc)",
                stroke: "var(--border-strong, #cbd5e1)",
                strokeWidth: isCurrentActive ? 2 : 1,
                rx: "4"
              }
            ),
            branch.height >= 24 && branch.width >= 40 && /* @__PURE__ */ import_react80.default.createElement("g", null, /* @__PURE__ */ import_react80.default.createElement(
              "rect",
              {
                x: branch.x,
                y: branch.y,
                width: branch.width,
                height: 20,
                fill: "var(--surface-subtle, #e2e8f0)",
                stroke: "var(--border-strong, #cbd5e1)",
                strokeWidth: 0.5,
                rx: "4"
              }
            ), /* @__PURE__ */ import_react80.default.createElement(
              "text",
              {
                x: branch.x + 6,
                y: branch.y + 14,
                fontSize: "11px",
                fontWeight: "600",
                fill: "var(--text-secondary, #334155)",
                style: { pointerEvents: "none" }
              },
              branch.label.length * 7 > branch.width - 20 ? branch.label.slice(0, Math.max(3, Math.floor((branch.width - 20) / 7))) + "\u2026" : branch.label
            ), enableDrilldown && branch.width >= 80 && /* @__PURE__ */ import_react80.default.createElement(
              "text",
              {
                x: branch.x + branch.width - 6,
                y: branch.y + 14,
                textAnchor: "end",
                fontSize: "9px",
                fill: "var(--action-solid, #2563eb)",
                fontWeight: "500",
                style: { pointerEvents: "none" }
              },
              "drill \u2192"
            ))
          );
        }),
        leafNodes.map((leaf, index) => {
          const categoryStyle = categoryColorMap.get(leaf.category || leaf.label) || {
            color: colorScale[index % colorScale.length],
            pattern: PATTERN_PRESETS[index % PATTERN_PRESETS.length]
          };
          const isSelected = leaf.id === selectedId;
          const isHovered = hoveredNode?.id === leaf.id;
          const isFocused = navigableNodes[focusedIndex]?.id === leaf.id;
          const parentTotal = currentRoot?.value || 1;
          const rootTotal = fullRoot?.value || 1;
          const pctParent = (leaf.value / parentTotal * 100).toFixed(1);
          const pctRoot = (leaf.value / rootTotal * 100).toFixed(1);
          const showLabel = leaf.width >= 40 && leaf.height >= 24;
          const showValue = leaf.width >= 60 && leaf.height >= 40;
          const showPercent = leaf.width >= 75 && leaf.height >= 56;
          return /* @__PURE__ */ import_react80.default.createElement(
            "g",
            {
              key: `leaf-${leaf.id}`,
              className: "treemap-leaf",
              transform: `translate(${leaf.x}, ${leaf.y})`,
              onClick: () => handleSelectNode(leaf),
              onMouseEnter: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredNode({
                  ...leaf,
                  pctParent,
                  pctRoot,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                });
              },
              onMouseMove: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredNode((prev) => prev ? {
                  ...prev,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                } : null);
              },
              onMouseLeave: () => setHoveredNode(null),
              style: { cursor: "pointer" },
              tabIndex: -1,
              role: "button",
              "aria-label": `${leaf.label}: ${formatVizValue(leaf.value, unit, locale)} (${pctParent}% of section)`
            },
            /* @__PURE__ */ import_react80.default.createElement(
              "rect",
              {
                x: 0,
                y: 0,
                width: Math.max(1, leaf.width),
                height: Math.max(1, leaf.height),
                fill: categoryStyle.color,
                stroke: isSelected || isFocused ? "var(--action-solid, #0f172a)" : "#ffffff",
                strokeWidth: isSelected || isFocused ? 2.5 : 1,
                rx: "3",
                filter: isSelected ? "url(#tm-active-shadow)" : void 0,
                style: {
                  transition: "opacity 0.15s ease, stroke-width 0.15s ease",
                  opacity: hoveredNode && !isHovered ? 0.75 : 1
                }
              }
            ),
            patternFills && categoryStyle.pattern && /* @__PURE__ */ import_react80.default.createElement(
              "rect",
              {
                x: 0,
                y: 0,
                width: Math.max(1, leaf.width),
                height: Math.max(1, leaf.height),
                fill: `url(#${categoryStyle.pattern.id})`,
                rx: "3",
                style: { pointerEvents: "none", opacity: 0.85 }
              }
            ),
            isFocused && /* @__PURE__ */ import_react80.default.createElement(
              "rect",
              {
                x: 1,
                y: 1,
                width: Math.max(1, leaf.width - 2),
                height: Math.max(1, leaf.height - 2),
                fill: "none",
                stroke: "#ffffff",
                strokeWidth: 1.5,
                strokeDasharray: "3 2",
                rx: "2",
                style: { pointerEvents: "none" }
              }
            ),
            showLabel && /* @__PURE__ */ import_react80.default.createElement(
              "text",
              {
                x: 6,
                y: 16,
                fontSize: "11px",
                fontWeight: "600",
                fill: "#ffffff",
                style: {
                  pointerEvents: "none",
                  textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                  overflow: "hidden"
                }
              },
              leaf.label.length * 6.5 > leaf.width - 12 ? leaf.label.slice(0, Math.max(2, Math.floor((leaf.width - 12) / 6.5))) + "\u2026" : leaf.label
            ),
            showValue && /* @__PURE__ */ import_react80.default.createElement(
              "text",
              {
                x: 6,
                y: 32,
                fontSize: "10px",
                fontWeight: "500",
                fill: "rgba(255,255,255,0.95)",
                style: {
                  pointerEvents: "none",
                  textShadow: "0 1px 2px rgba(0,0,0,0.7)"
                }
              },
              formatVizValue(leaf.value, unit, locale)
            ),
            showPercent && /* @__PURE__ */ import_react80.default.createElement(
              "text",
              {
                x: 6,
                y: 46,
                fontSize: "9px",
                fontWeight: "400",
                fill: "rgba(255,255,255,0.85)",
                style: {
                  pointerEvents: "none",
                  textShadow: "0 1px 2px rgba(0,0,0,0.7)"
                }
              },
              pctParent,
              "%"
            )
          );
        })
      ),
      hoveredNode && /* @__PURE__ */ import_react80.default.createElement(
        "div",
        {
          style: {
            position: "absolute",
            left: Math.min(hoveredNode.clientX + 14, width - 180),
            top: Math.max(10, Math.min(hoveredNode.clientY - 20, height - 100)),
            background: "var(--surface-floating, #0f172a)",
            color: "#f8fafc",
            padding: "8px 12px",
            borderRadius: "var(--radius-sm, 6px)",
            fontSize: "11px",
            lineHeight: 1.4,
            boxShadow: "var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.3))",
            pointerEvents: "none",
            zIndex: 60,
            maxWidth: "220px",
            border: "1px solid rgba(255,255,255,0.1)"
          }
        },
        /* @__PURE__ */ import_react80.default.createElement("div", { style: { fontWeight: 600, fontSize: "12px", color: "#ffffff", marginBottom: "2px" } }, hoveredNode.label),
        hoveredNode.parent && /* @__PURE__ */ import_react80.default.createElement("div", { style: { color: "#94a3b8", fontSize: "10px", marginBottom: "4px" } }, "Parent: ", hoveredNode.parent.label),
        /* @__PURE__ */ import_react80.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "4px" } }, /* @__PURE__ */ import_react80.default.createElement("span", { style: { color: "#94a3b8" } }, "Value:"), /* @__PURE__ */ import_react80.default.createElement("strong", { style: { color: "#38bdf8" } }, formatVizValue(hoveredNode.value, unit, locale))),
        /* @__PURE__ */ import_react80.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px" } }, /* @__PURE__ */ import_react80.default.createElement("span", { style: { color: "#94a3b8" } }, "Share of Section:"), /* @__PURE__ */ import_react80.default.createElement("span", null, hoveredNode.pctParent, "%")),
        /* @__PURE__ */ import_react80.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px" } }, /* @__PURE__ */ import_react80.default.createElement("span", { style: { color: "#94a3b8" } }, "Share of Plant Total:"), /* @__PURE__ */ import_react80.default.createElement("span", null, hoveredNode.pctRoot, "%"))
      ),
      showTableModal && /* @__PURE__ */ import_react80.default.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1e3,
            padding: "16px"
          },
          onClick: () => setShowTableModal(false)
        },
        /* @__PURE__ */ import_react80.default.createElement(
          "div",
          {
            style: {
              backgroundColor: "var(--surface-card, #ffffff)",
              borderRadius: "var(--radius-lg, 8px)",
              boxShadow: "var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.3))",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid var(--border-subtle, #cbd5e1)"
            },
            onClick: (e) => e.stopPropagation(),
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Accessible Hierarchy Data Table"
          },
          /* @__PURE__ */ import_react80.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react80.default.createElement("h3", { style: { margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)" } }, "Hierarchical Data Table: ", title || "Treemap Data"), /* @__PURE__ */ import_react80.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                border: "none",
                background: "transparent",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                color: "var(--text-muted, #64748b)"
              },
              "aria-label": "Close modal"
            },
            "\xD7"
          )),
          /* @__PURE__ */ import_react80.default.createElement("div", { style: { overflowY: "auto", padding: "16px" } }, /* @__PURE__ */ import_react80.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" } }, /* @__PURE__ */ import_react80.default.createElement("thead", null, /* @__PURE__ */ import_react80.default.createElement("tr", { style: { borderBottom: "2px solid var(--border-strong, #cbd5e1)", background: "var(--surface-sunken, #f8fafc)" } }, /* @__PURE__ */ import_react80.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Hierarchy / Node"), /* @__PURE__ */ import_react80.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Type"), /* @__PURE__ */ import_react80.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right", color: "var(--text-secondary, #475569)" } }, "Value (", unit || "qty", ")"), /* @__PURE__ */ import_react80.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right", color: "var(--text-secondary, #475569)" } }, "Share %"))), /* @__PURE__ */ import_react80.default.createElement("tbody", null, layoutNodes.map((node) => {
            const indent = (node.depth || 0) * 16;
            const isLeaf = node.isLeaf;
            const rootVal = fullRoot?.value || 1;
            const sharePct = (node.value / rootVal * 100).toFixed(1);
            return /* @__PURE__ */ import_react80.default.createElement(
              "tr",
              {
                key: node.id,
                style: {
                  borderBottom: "1px solid var(--border-subtle, #f1f5f9)",
                  fontWeight: isLeaf ? 400 : 600,
                  background: node.id === selectedId ? "var(--surface-active, #eff6ff)" : "transparent"
                }
              },
              /* @__PURE__ */ import_react80.default.createElement("td", { style: { padding: "6px 10px", paddingLeft: `${indent + 10}px` } }, !isLeaf ? "\u{1F4C1} " : "\u{1F4C4} ", node.label),
              /* @__PURE__ */ import_react80.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-muted, #64748b)", fontSize: "11px" } }, isLeaf ? "Leaf" : `Level ${node.depth}`),
              /* @__PURE__ */ import_react80.default.createElement("td", { style: { padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" } }, formatVizValue(node.value, unit, locale)),
              /* @__PURE__ */ import_react80.default.createElement("td", { style: { padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" } }, sharePct, "%")
            );
          })))),
          /* @__PURE__ */ import_react80.default.createElement("div", { style: { display: "flex", justifyContent: "flex-end", padding: "10px 16px", background: "var(--surface-sunken, #f8fafc)", borderTop: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react80.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                padding: "6px 14px",
                borderRadius: "var(--radius-sm, 4px)",
                background: "var(--action-solid, #2563eb)",
                color: "#ffffff",
                border: "none",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer"
              }
            },
            "Close Table"
          ))
        )
      )
    );
  }

  // components/data/TreeDiagram.jsx
  var import_react81 = __toESM(require_react(), 1);
  function TreeDiagram({
    data,
    orientation = "horizontal",
    // 'horizontal' | 'vertical'
    linkStyle = "smooth",
    // 'smooth' | 'step' | 'straight'
    nodeWidth = 160,
    nodeHeight = 56,
    levelSpacing = 75,
    siblingSpacing = 22,
    width = 800,
    height = 500,
    collapsible = true,
    initialCollapsedIds = [],
    selectedId: controlledSelectedId = null,
    onNodeClick = null,
    onNodeSelect = null,
    onNodeToggle = null,
    title = "",
    subtitle = "",
    zoomable = true,
    className = ""
  }) {
    const [collapsedIds, setCollapsedIds] = (0, import_react81.useState)(() => new Set(initialCollapsedIds));
    const [internalSelectedId, setInternalSelectedId] = (0, import_react81.useState)(null);
    const [hoveredNodeId, setHoveredNodeId] = (0, import_react81.useState)(null);
    const [focusedNodeId, setFocusedNodeId] = (0, import_react81.useState)(null);
    const [showTableModal, setShowTableModal] = (0, import_react81.useState)(false);
    const [announcement, setAnnouncement] = (0, import_react81.useState)("");
    const [zoom, setZoom] = (0, import_react81.useState)(1);
    const [pan, setPan] = (0, import_react81.useState)({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = (0, import_react81.useState)(false);
    const [startPan, setStartPan] = (0, import_react81.useState)({ x: 0, y: 0 });
    const containerRef = (0, import_react81.useRef)(null);
    const selectedId = controlledSelectedId !== void 0 && controlledSelectedId !== null ? controlledSelectedId : internalSelectedId;
    const { nodes, links, bounds } = (0, import_react81.useMemo)(() => {
      return computeTreeTopology({
        rootNode: data,
        orientation,
        nodeWidth,
        nodeHeight,
        levelSpacing,
        siblingSpacing,
        collapsedIds
      });
    }, [data, orientation, nodeWidth, nodeHeight, levelSpacing, siblingSpacing, collapsedIds]);
    (0, import_react81.useEffect)(() => {
      if (nodes.length > 0 && !focusedNodeId) {
        setFocusedNodeId(nodes[0].id);
      }
    }, [nodes, focusedNodeId]);
    const activePathIds = (0, import_react81.useMemo)(() => {
      const activeId = hoveredNodeId || selectedId;
      if (!activeId) return { nodeIds: /* @__PURE__ */ new Set(), linkIds: /* @__PURE__ */ new Set() };
      const nodeIds = /* @__PURE__ */ new Set([activeId]);
      const linkIds = /* @__PURE__ */ new Set();
      let curr = nodes.find((n) => n.id === activeId);
      while (curr && curr.parent) {
        nodeIds.add(curr.parent.id);
        linkIds.add(`link-${curr.parent.id}-${curr.id}`);
        curr = nodes.find((n) => n.id === curr.parent.id);
      }
      return { nodeIds, linkIds };
    }, [nodes, hoveredNodeId, selectedId]);
    const handleToggleCollapse = (0, import_react81.useCallback)((node, e) => {
      if (e) e.stopPropagation();
      if (!collapsible || node.isLeaf || node.childrenCount === 0) return;
      setCollapsedIds((prev) => {
        const next = new Set(prev);
        const isCurrentlyCollapsed = next.has(node.id);
        if (isCurrentlyCollapsed) {
          next.delete(node.id);
          setAnnouncement(`Expanded ${node.label}. ${node.childrenCount} child items visible.`);
        } else {
          next.add(node.id);
          setAnnouncement(`Collapsed ${node.label}. ${node.childrenCount} child items hidden.`);
        }
        return next;
      });
      if (onNodeToggle) onNodeToggle(node);
    }, [collapsible, onNodeToggle]);
    const handleSelectNode = (0, import_react81.useCallback)((node) => {
      setInternalSelectedId(node.id);
      setFocusedNodeId(node.id);
      setAnnouncement(`Selected ${node.label}${node.status ? `, status: ${node.status}` : ""}${node.role ? `, role: ${node.role}` : ""}.`);
      if (onNodeSelect) onNodeSelect(node);
      if (onNodeClick) onNodeClick(node);
    }, [onNodeSelect, onNodeClick]);
    const handleKeyDown = (0, import_react81.useCallback)((e) => {
      if (!nodes || nodes.length === 0) return;
      const currentIndex = nodes.findIndex((n) => n.id === focusedNodeId);
      const currNode = currentIndex >= 0 ? nodes[currentIndex] : nodes[0];
      const isHorizontal = orientation === "horizontal";
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (isHorizontal) {
          const children = nodes.filter((n) => n.parent?.id === currNode.id);
          if (children.length > 0) {
            setFocusedNodeId(children[0].id);
            setAnnouncement(`Focused child: ${children[0].label}`);
          }
        } else {
          const nextIdx = (currentIndex + 1) % nodes.length;
          setFocusedNodeId(nodes[nextIdx].id);
          setAnnouncement(`Focused: ${nodes[nextIdx].label}`);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isHorizontal) {
          if (currNode.parent) {
            setFocusedNodeId(currNode.parent.id);
            setAnnouncement(`Focused parent: ${currNode.parent.label}`);
          }
        } else {
          const prevIdx = (currentIndex - 1 + nodes.length) % nodes.length;
          setFocusedNodeId(nodes[prevIdx].id);
          setAnnouncement(`Focused: ${nodes[prevIdx].label}`);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (isHorizontal) {
          const nextIdx = (currentIndex + 1) % nodes.length;
          setFocusedNodeId(nodes[nextIdx].id);
          setAnnouncement(`Focused: ${nodes[nextIdx].label}`);
        } else {
          const children = nodes.filter((n) => n.parent?.id === currNode.id);
          if (children.length > 0) {
            setFocusedNodeId(children[0].id);
            setAnnouncement(`Focused child: ${children[0].label}`);
          }
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (isHorizontal) {
          const prevIdx = (currentIndex - 1 + nodes.length) % nodes.length;
          setFocusedNodeId(nodes[prevIdx].id);
          setAnnouncement(`Focused: ${nodes[prevIdx].label}`);
        } else {
          if (currNode.parent) {
            setFocusedNodeId(currNode.parent.id);
            setAnnouncement(`Focused parent: ${currNode.parent.label}`);
          }
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (currNode) {
          if (!currNode.isLeaf && collapsible) {
            handleToggleCollapse(currNode);
          } else {
            handleSelectNode(currNode);
          }
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        setFocusedNodeId(nodes[0].id);
      } else if (e.key === "End") {
        e.preventDefault();
        setFocusedNodeId(nodes[nodes.length - 1].id);
      } else if (e.altKey && (e.key === "F11" || e.keyCode === 122)) {
        e.preventDefault();
        setShowTableModal((prev) => !prev);
      }
    }, [nodes, focusedNodeId, orientation, collapsible, handleToggleCollapse, handleSelectNode]);
    const handleZoomIn = () => setZoom((z) => Math.min(2.5, z + 0.2));
    const handleZoomOut = () => setZoom((z) => Math.max(0.4, z - 0.2));
    const handleResetZoom = () => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    const handleMouseDown = (e) => {
      if (!zoomable) return;
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };
    const handleMouseMove = (e) => {
      if (!isPanning || !zoomable) return;
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    };
    const handleMouseUp = () => setIsPanning(false);
    const getStatusColor = (status) => {
      if (!status) return null;
      const s = status.toLowerCase();
      if (s === "operational" || s === "running" || s === "active" || s === "good") return VIZ_SEMANTIC_COLORS.success;
      if (s === "maintenance" || s === "warning" || s === "derated") return VIZ_SEMANTIC_COLORS.warning;
      if (s === "alarm" || s === "critical" || s === "stoppage" || s === "failed") return VIZ_SEMANTIC_COLORS.critical;
      if (s === "idle" || s === "standby") return VIZ_SEMANTIC_COLORS.neutral;
      return VIZ_SEMANTIC_COLORS.info;
    };
    if (!data) {
      return /* @__PURE__ */ import_react81.default.createElement("div", { className: `treediagram-empty ${className}`, style: { width, height, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-sunken, #f8fafc)", border: "1px dashed var(--border-subtle, #cbd5e1)", borderRadius: "var(--radius-md, 8px)", color: "var(--text-muted, #64748b)", fontSize: "13px" } }, "No hierarchy topology data available");
    }
    return /* @__PURE__ */ import_react81.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `treediagram-container ${className}`,
        style: {
          position: "relative",
          width,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          userSelect: "none"
        },
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "tree",
        "aria-label": `Hierarchy Tree Diagram: ${title || "Topology"}. Use arrow keys to traverse hierarchy nodes, Enter to toggle expand/collapse, Alt+F11 for accessible data table.`
      },
      /* @__PURE__ */ import_react81.default.createElement("div", { "aria-live": "polite", className: "sr-only", style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 } }, announcement),
      /* @__PURE__ */ import_react81.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" } }, /* @__PURE__ */ import_react81.default.createElement("div", null, title && /* @__PURE__ */ import_react81.default.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)", letterSpacing: "-0.01em" } }, title), subtitle && /* @__PURE__ */ import_react81.default.createElement("div", { style: { fontSize: "12px", color: "var(--text-secondary, #64748b)", marginTop: "2px" } }, subtitle)), /* @__PURE__ */ import_react81.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px" } }, zoomable && /* @__PURE__ */ import_react81.default.createElement("div", { style: { display: "inline-flex", background: "var(--surface-card, #ffffff)", border: "1px solid var(--border-subtle, #cbd5e1)", borderRadius: "var(--radius-sm, 4px)", overflow: "hidden" } }, /* @__PURE__ */ import_react81.default.createElement(
        "button",
        {
          type: "button",
          onClick: handleZoomIn,
          style: { padding: "3px 8px", background: "transparent", border: "none", borderRight: "1px solid var(--border-subtle, #cbd5e1)", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "var(--text-secondary, #475569)" },
          title: "Zoom In",
          "aria-label": "Zoom in tree viewport"
        },
        "+"
      ), /* @__PURE__ */ import_react81.default.createElement(
        "button",
        {
          type: "button",
          onClick: handleZoomOut,
          style: { padding: "3px 8px", background: "transparent", border: "none", borderRight: "1px solid var(--border-subtle, #cbd5e1)", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "var(--text-secondary, #475569)" },
          title: "Zoom Out",
          "aria-label": "Zoom out tree viewport"
        },
        "\u2212"
      ), /* @__PURE__ */ import_react81.default.createElement(
        "button",
        {
          type: "button",
          onClick: handleResetZoom,
          style: { padding: "3px 8px", background: "transparent", border: "none", fontSize: "11px", cursor: "pointer", color: "var(--text-secondary, #475569)" },
          title: "Reset View",
          "aria-label": "Reset zoom and center view"
        },
        "Reset"
      )), /* @__PURE__ */ import_react81.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => setShowTableModal(true),
          style: {
            fontSize: "11px",
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: "var(--radius-sm, 4px)",
            border: "1px solid var(--border-subtle, #cbd5e1)",
            background: "var(--surface-card, #ffffff)",
            color: "var(--text-secondary, #475569)",
            cursor: "pointer"
          },
          title: "Open Accessible Tree Table (Alt+F11)",
          "aria-label": "Open accessible hierarchy table"
        },
        "Accessible Table"
      ))),
      /* @__PURE__ */ import_react81.default.createElement(
        "svg",
        {
          width,
          height,
          onMouseDown: handleMouseDown,
          onMouseMove: handleMouseMove,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseUp,
          style: {
            display: "block",
            background: "var(--surface-card, #ffffff)",
            border: "1px solid var(--border-subtle, #e2e8f0)",
            borderRadius: "var(--radius-md, 6px)",
            overflow: "hidden",
            cursor: isPanning ? "grabbing" : zoomable ? "grab" : "default"
          }
        },
        /* @__PURE__ */ import_react81.default.createElement("defs", null, /* @__PURE__ */ import_react81.default.createElement("filter", { id: "td-node-shadow", x: "-10%", y: "-10%", width: "120%", height: "120%" }, /* @__PURE__ */ import_react81.default.createElement("feDropShadow", { dx: "0", dy: "1", stdDeviation: "2", floodOpacity: "0.08" })), /* @__PURE__ */ import_react81.default.createElement("filter", { id: "td-active-shadow", x: "-15%", y: "-15%", width: "130%", height: "130%" }, /* @__PURE__ */ import_react81.default.createElement("feDropShadow", { dx: "0", dy: "3", stdDeviation: "4", floodColor: "#2563eb", floodOpacity: "0.25" }))),
        /* @__PURE__ */ import_react81.default.createElement("g", { transform: `translate(${pan.x}, ${pan.y}) scale(${zoom})` }, /* @__PURE__ */ import_react81.default.createElement("g", { className: "tree-links" }, links.map((link) => {
          const pathD = createTreeLinkPath({
            source: link.source,
            target: link.target,
            orientation,
            linkStyle
          });
          const isPathActive = activePathIds.linkIds.has(link.id);
          return /* @__PURE__ */ import_react81.default.createElement(
            "path",
            {
              key: link.id,
              d: pathD,
              fill: "none",
              stroke: isPathActive ? "var(--action-solid, #2563eb)" : "var(--border-strong, #cbd5e1)",
              strokeWidth: isPathActive ? 2.5 : 1.5,
              strokeDasharray: isPathActive ? void 0 : void 0,
              style: {
                transition: "stroke 0.2s ease, stroke-width 0.2s ease"
              }
            }
          );
        })), /* @__PURE__ */ import_react81.default.createElement("g", { className: "tree-nodes" }, nodes.map((node) => {
          const isSelected = node.id === selectedId;
          const isHovered = node.id === hoveredNodeId;
          const isFocused = node.id === focusedNodeId;
          const isPathActive = activePathIds.nodeIds.has(node.id);
          const statusColor = getStatusColor(node.status);
          const hasExpandToggle = collapsible && !node.isLeaf && node.childrenCount > 0;
          return /* @__PURE__ */ import_react81.default.createElement(
            "g",
            {
              key: `node-${node.id}`,
              className: "tree-node",
              transform: `translate(${node.x}, ${node.y})`,
              onClick: () => handleSelectNode(node),
              onMouseEnter: () => setHoveredNodeId(node.id),
              onMouseLeave: () => setHoveredNodeId(null),
              style: { cursor: "pointer" },
              role: "treeitem",
              "aria-expanded": hasExpandToggle ? !node.isCollapsed : void 0,
              "aria-selected": isSelected,
              tabIndex: -1
            },
            /* @__PURE__ */ import_react81.default.createElement(
              "rect",
              {
                x: 0,
                y: 0,
                width: node.width,
                height: node.height,
                fill: isSelected ? "var(--surface-active, #eff6ff)" : "var(--surface-card, #ffffff)",
                stroke: isSelected ? "var(--action-solid, #2563eb)" : isPathActive ? "#64748b" : "var(--border-subtle, #cbd5e1)",
                strokeWidth: isSelected ? 2 : isPathActive ? 1.5 : 1,
                rx: "6",
                filter: isSelected ? "url(#td-active-shadow)" : "url(#td-node-shadow)",
                style: { transition: "all 0.15s ease" }
              }
            ),
            /* @__PURE__ */ import_react81.default.createElement(
              "rect",
              {
                x: 0,
                y: 0,
                width: 4,
                height: node.height,
                fill: isSelected ? "var(--action-solid, #2563eb)" : statusColor || "var(--border-strong, #94a3b8)",
                rx: "2"
              }
            ),
            isFocused && /* @__PURE__ */ import_react81.default.createElement(
              "rect",
              {
                x: -2,
                y: -2,
                width: node.width + 4,
                height: node.height + 4,
                fill: "none",
                stroke: "var(--action-solid, #2563eb)",
                strokeWidth: 1.5,
                strokeDasharray: "3 2",
                rx: "8",
                style: { pointerEvents: "none" }
              }
            ),
            /* @__PURE__ */ import_react81.default.createElement(
              "text",
              {
                x: 10,
                y: 20,
                fontSize: "12px",
                fontWeight: "600",
                fill: "var(--text-primary, #0f172a)",
                style: { pointerEvents: "none" }
              },
              node.label.length > 18 ? node.label.slice(0, 17) + "\u2026" : node.label
            ),
            /* @__PURE__ */ import_react81.default.createElement(
              "text",
              {
                x: 10,
                y: 36,
                fontSize: "10px",
                fill: "var(--text-secondary, #64748b)",
                style: { pointerEvents: "none" }
              },
              node.code || node.role || (node.isLeaf ? "Leaf Unit" : `${node.childrenCount} sub-units`)
            ),
            node.status && /* @__PURE__ */ import_react81.default.createElement("g", { transform: `translate(10, 42)` }, /* @__PURE__ */ import_react81.default.createElement("circle", { cx: 3, cy: 3, r: 3, fill: statusColor || "#64748b" }), /* @__PURE__ */ import_react81.default.createElement("text", { x: 9, y: 6, fontSize: "9px", fontWeight: "500", fill: statusColor || "#64748b" }, node.status)),
            hasExpandToggle && /* @__PURE__ */ import_react81.default.createElement(
              "g",
              {
                transform: orientation === "horizontal" ? `translate(${node.width + 4}, ${node.height / 2})` : `translate(${node.width / 2}, ${node.height + 4})`,
                onClick: (e) => handleToggleCollapse(node, e),
                style: { cursor: "pointer" },
                role: "button",
                "aria-label": node.isCollapsed ? `Expand ${node.label}` : `Collapse ${node.label}`
              },
              /* @__PURE__ */ import_react81.default.createElement(
                "circle",
                {
                  cx: 0,
                  cy: 0,
                  r: 8,
                  fill: "var(--surface-card, #ffffff)",
                  stroke: "var(--action-solid, #2563eb)",
                  strokeWidth: 1.5
                }
              ),
              /* @__PURE__ */ import_react81.default.createElement(
                "text",
                {
                  x: 0,
                  y: 3.5,
                  textAnchor: "middle",
                  fontSize: "10px",
                  fontWeight: "700",
                  fill: "var(--action-solid, #2563eb)",
                  style: { pointerEvents: "none" }
                },
                node.isCollapsed ? "+" : "\u2212"
              )
            )
          );
        })))
      ),
      showTableModal && /* @__PURE__ */ import_react81.default.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1e3,
            padding: "16px"
          },
          onClick: () => setShowTableModal(false)
        },
        /* @__PURE__ */ import_react81.default.createElement(
          "div",
          {
            style: {
              backgroundColor: "var(--surface-card, #ffffff)",
              borderRadius: "var(--radius-lg, 8px)",
              boxShadow: "var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.3))",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid var(--border-subtle, #cbd5e1)"
            },
            onClick: (e) => e.stopPropagation(),
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Accessible Hierarchy Tree Data Table"
          },
          /* @__PURE__ */ import_react81.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react81.default.createElement("h3", { style: { margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)" } }, "Hierarchy Topology Table: ", title || "Tree Data"), /* @__PURE__ */ import_react81.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                border: "none",
                background: "transparent",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                color: "var(--text-muted, #64748b)"
              },
              "aria-label": "Close modal"
            },
            "\xD7"
          )),
          /* @__PURE__ */ import_react81.default.createElement("div", { style: { overflowY: "auto", padding: "16px" } }, /* @__PURE__ */ import_react81.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" } }, /* @__PURE__ */ import_react81.default.createElement("thead", null, /* @__PURE__ */ import_react81.default.createElement("tr", { style: { borderBottom: "2px solid var(--border-strong, #cbd5e1)", background: "var(--surface-sunken, #f8fafc)" } }, /* @__PURE__ */ import_react81.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Hierarchy Node"), /* @__PURE__ */ import_react81.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Identifier / Code"), /* @__PURE__ */ import_react81.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Role / Type"), /* @__PURE__ */ import_react81.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Status"))), /* @__PURE__ */ import_react81.default.createElement("tbody", null, nodes.map((node) => {
            const indent = (node.depth || 0) * 16;
            const isLeaf = node.isLeaf;
            return /* @__PURE__ */ import_react81.default.createElement(
              "tr",
              {
                key: node.id,
                style: {
                  borderBottom: "1px solid var(--border-subtle, #f1f5f9)",
                  fontWeight: isLeaf ? 400 : 600,
                  background: node.id === selectedId ? "var(--surface-active, #eff6ff)" : "transparent"
                }
              },
              /* @__PURE__ */ import_react81.default.createElement("td", { style: { padding: "6px 10px", paddingLeft: `${indent + 10}px` } }, !isLeaf ? "\u{1F4C1} " : "\u{1F4C4} ", node.label),
              /* @__PURE__ */ import_react81.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-muted, #64748b)", fontSize: "11px", fontVariantNumeric: "tabular-nums" } }, node.code || node.id),
              /* @__PURE__ */ import_react81.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-secondary, #475569)" } }, node.role || (isLeaf ? "Leaf Component" : `Branch (${node.childrenCount})`)),
              /* @__PURE__ */ import_react81.default.createElement("td", { style: { padding: "6px 10px" } }, node.status ? /* @__PURE__ */ import_react81.default.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: getStatusColor(node.status) || "inherit" } }, "\u25CF ", node.status) : "\u2014")
            );
          })))),
          /* @__PURE__ */ import_react81.default.createElement("div", { style: { display: "flex", justifyContent: "flex-end", padding: "10px 16px", background: "var(--surface-sunken, #f8fafc)", borderTop: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react81.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                padding: "6px 14px",
                borderRadius: "var(--radius-sm, 4px)",
                background: "var(--action-solid, #2563eb)",
                color: "#ffffff",
                border: "none",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer"
              }
            },
            "Close Table"
          ))
        )
      )
    );
  }

  // components/data/SankeyDiagram.jsx
  var import_react82 = __toESM(require_react(), 1);
  function SankeyDiagram({
    nodes: inputNodes = [],
    links: inputLinks = [],
    width = 760,
    height = 440,
    nodeWidth = 18,
    nodePadding = 16,
    align = "justify",
    // 'justify' | 'left' | 'right' | 'center'
    colorScale = VIZ_COLORS,
    linkGradient = true,
    patternFills = true,
    unit = "",
    locale = "en-IN",
    title = "",
    subtitle = "",
    selectedId: controlledSelectedId = null,
    onNodeClick = null,
    onLinkClick = null,
    onSelectionChange = null,
    className = ""
  }) {
    const [internalSelectedId, setInternalSelectedId] = (0, import_react82.useState)(null);
    const [hoveredItem, setHoveredItem] = (0, import_react82.useState)(null);
    const [focusedIndex, setFocusedIndex] = (0, import_react82.useState)(0);
    const [showTableModal, setShowTableModal] = (0, import_react82.useState)(false);
    const [announcement, setAnnouncement] = (0, import_react82.useState)("");
    const containerRef = (0, import_react82.useRef)(null);
    const selectedId = controlledSelectedId !== void 0 && controlledSelectedId !== null ? controlledSelectedId : internalSelectedId;
    const { nodes, links, stages } = (0, import_react82.useMemo)(() => {
      return computeSankeyLayout({
        nodes: inputNodes,
        links: inputLinks,
        width,
        height,
        nodeWidth,
        nodePadding,
        align
      });
    }, [inputNodes, inputLinks, width, height, nodeWidth, nodePadding, align]);
    const categoryColorMap = (0, import_react82.useMemo)(() => {
      const map = /* @__PURE__ */ new Map();
      nodes.forEach((node, idx) => {
        const cat = node.category || node.label || node.id;
        if (!map.has(cat)) {
          map.set(cat, {
            color: colorScale[map.size % colorScale.length],
            pattern: PATTERN_PRESETS[map.size % PATTERN_PRESETS.length]
          });
        }
      });
      return map;
    }, [nodes, colorScale]);
    const activePathSets = (0, import_react82.useMemo)(() => {
      const activeNodeIds = /* @__PURE__ */ new Set();
      const activeLinkIds = /* @__PURE__ */ new Set();
      const activeTarget = hoveredItem?.item || (selectedId ? nodes.find((n) => n.id === selectedId) || links.find((l) => l.id === selectedId) : null);
      if (!activeTarget) return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: false };
      if (activeTarget.source && activeTarget.target) {
        activeLinkIds.add(activeTarget.id);
        activeNodeIds.add(activeTarget.source.id);
        activeNodeIds.add(activeTarget.target.id);
      } else {
        activeNodeIds.add(activeTarget.id);
        const downstreamQueue = [activeTarget];
        while (downstreamQueue.length > 0) {
          const curr = downstreamQueue.shift();
          curr.outLinks?.forEach((l) => {
            activeLinkIds.add(l.id);
            if (!activeNodeIds.has(l.target.id)) {
              activeNodeIds.add(l.target.id);
              downstreamQueue.push(l.target);
            }
          });
        }
        const upstreamQueue = [activeTarget];
        while (upstreamQueue.length > 0) {
          const curr = upstreamQueue.shift();
          curr.inLinks?.forEach((l) => {
            activeLinkIds.add(l.id);
            if (!activeNodeIds.has(l.source.id)) {
              activeNodeIds.add(l.source.id);
              upstreamQueue.push(l.source);
            }
          });
        }
      }
      return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
    }, [hoveredItem, selectedId, nodes, links]);
    const handleSelectNode = (0, import_react82.useCallback)((node) => {
      const nextId = selectedId === node.id ? null : node.id;
      setInternalSelectedId(nextId);
      setAnnouncement(`Selected node ${node.label}. Net flow: ${formatVizValue(node.value, unit, locale)}.`);
      if (onNodeClick) onNodeClick(node);
      if (onSelectionChange) onSelectionChange(nextId ? { type: "node", node } : null);
    }, [selectedId, unit, locale, onNodeClick, onSelectionChange]);
    const handleSelectLink = (0, import_react82.useCallback)((link) => {
      const nextId = selectedId === link.id ? null : link.id;
      setInternalSelectedId(nextId);
      setAnnouncement(`Selected flow from ${link.source.label} to ${link.target.label}. Quantity: ${formatVizValue(link.value, unit, locale)}.`);
      if (onLinkClick) onLinkClick(link);
      if (onSelectionChange) onSelectionChange(nextId ? { type: "link", link } : null);
    }, [selectedId, unit, locale, onLinkClick, onSelectionChange]);
    const handleKeyDown = (0, import_react82.useCallback)((e) => {
      if (nodes.length === 0) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev + 1) % nodes.length;
          const target = nodes[next];
          setAnnouncement(`Focused node ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
          return next;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev - 1 + nodes.length) % nodes.length;
          const target = nodes[next];
          setAnnouncement(`Focused node ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
          return next;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < nodes.length) {
          handleSelectNode(nodes[focusedIndex]);
        }
      } else if (e.altKey && (e.key === "F11" || e.keyCode === 122)) {
        e.preventDefault();
        setShowTableModal((prev) => !prev);
      }
    }, [nodes, focusedIndex, unit, locale, handleSelectNode]);
    if (!nodes || nodes.length === 0 || !links || links.length === 0) {
      return /* @__PURE__ */ import_react82.default.createElement("div", { className: `sankey-empty ${className}`, style: { width, height, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-sunken, #f8fafc)", border: "1px dashed var(--border-subtle, #cbd5e1)", borderRadius: "var(--radius-md, 8px)", color: "var(--text-muted, #64748b)", fontSize: "13px" } }, "No flow network data available to display");
    }
    return /* @__PURE__ */ import_react82.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `sankey-container ${className}`,
        style: {
          position: "relative",
          width,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          userSelect: "none"
        },
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "region",
        "aria-label": `Sankey Flow Diagram: ${title || "Transfer"}. Use arrow keys to navigate nodes, Enter to select path, Alt+F11 for accessible flow table.`
      },
      /* @__PURE__ */ import_react82.default.createElement("div", { "aria-live": "polite", className: "sr-only", style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 } }, announcement),
      /* @__PURE__ */ import_react82.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" } }, /* @__PURE__ */ import_react82.default.createElement("div", null, title && /* @__PURE__ */ import_react82.default.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)", letterSpacing: "-0.01em" } }, title), subtitle && /* @__PURE__ */ import_react82.default.createElement("div", { style: { fontSize: "12px", color: "var(--text-secondary, #64748b)", marginTop: "2px" } }, subtitle)), /* @__PURE__ */ import_react82.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => setShowTableModal(true),
          style: {
            fontSize: "11px",
            fontWeight: 500,
            padding: "3px 8px",
            borderRadius: "var(--radius-sm, 4px)",
            border: "1px solid var(--border-subtle, #cbd5e1)",
            background: "var(--surface-card, #ffffff)",
            color: "var(--text-secondary, #475569)",
            cursor: "pointer"
          },
          title: "Open Accessible Flow Data Table (Alt+F11)",
          "aria-label": "Open accessible flow data table"
        },
        "Accessible Table"
      )),
      /* @__PURE__ */ import_react82.default.createElement(
        "svg",
        {
          width,
          height,
          style: {
            display: "block",
            background: "var(--surface-card, #ffffff)",
            border: "1px solid var(--border-subtle, #e2e8f0)",
            borderRadius: "var(--radius-md, 6px)",
            overflow: "hidden"
          }
        },
        /* @__PURE__ */ import_react82.default.createElement("defs", null, patternFills && PATTERN_PRESETS.map((pat) => /* @__PURE__ */ import_react82.default.createElement(
          "pattern",
          {
            key: pat.id,
            id: `sankey-${pat.id}`,
            width: "8",
            height: "8",
            patternUnits: "userSpaceOnUse",
            patternTransform: pat.transform || void 0
          },
          pat.type === "circle" ? /* @__PURE__ */ import_react82.default.createElement("circle", { cx: "4", cy: "4", r: pat.r || 1.2, fill: pat.fill || "rgba(255,255,255,0.4)" }) : /* @__PURE__ */ import_react82.default.createElement(
            "line",
            {
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "8",
              stroke: pat.stroke || "rgba(255,255,255,0.35)",
              strokeWidth: pat.strokeWidth || 1.5
            }
          )
        )), linkGradient && links.map((link) => {
          const sStyle = categoryColorMap.get(link.source.category || link.source.label) || { color: "#2563eb" };
          const tStyle = categoryColorMap.get(link.target.category || link.target.label) || { color: "#0d9488" };
          return /* @__PURE__ */ import_react82.default.createElement(
            "linearGradient",
            {
              key: `grad-${link.id}`,
              id: `grad-${link.id}`,
              gradientUnits: "userSpaceOnUse",
              x1: link.source.x + link.source.width,
              y1: 0,
              x2: link.target.x,
              y2: 0
            },
            /* @__PURE__ */ import_react82.default.createElement("stop", { offset: "0%", stopColor: sStyle.color, stopOpacity: 0.65 }),
            /* @__PURE__ */ import_react82.default.createElement("stop", { offset: "100%", stopColor: tStyle.color, stopOpacity: 0.65 })
          );
        }), /* @__PURE__ */ import_react82.default.createElement("filter", { id: "sankey-glow", x: "-10%", y: "-10%", width: "120%", height: "120%" }, /* @__PURE__ */ import_react82.default.createElement("feDropShadow", { dx: "0", dy: "2", stdDeviation: "3", floodOpacity: "0.2" }))),
        /* @__PURE__ */ import_react82.default.createElement("g", { className: "sankey-links" }, links.map((link) => {
          const ribbonD = createSankeyRibbonPath({ link, curvature: 0.5 });
          const isPathActive = activePathSets.linkIds.has(link.id);
          const isDimmed = activePathSets.isActive && !isPathActive;
          const isSelected = link.id === selectedId;
          const sStyle = categoryColorMap.get(link.source.category || link.source.label) || { color: "#2563eb" };
          return /* @__PURE__ */ import_react82.default.createElement(
            "path",
            {
              key: link.id,
              d: ribbonD,
              fill: linkGradient ? `url(#grad-${link.id})` : sStyle.color,
              stroke: isSelected ? "#0f172a" : isPathActive ? "rgba(15,23,42,0.4)" : "rgba(255,255,255,0.2)",
              strokeWidth: isSelected ? 1.5 : 0.5,
              opacity: isDimmed ? 0.12 : isPathActive ? 0.9 : 0.55,
              onClick: () => handleSelectLink(link),
              onMouseEnter: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredItem({
                  type: "link",
                  item: link,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                });
              },
              onMouseMove: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredItem((prev) => prev ? {
                  ...prev,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                } : null);
              },
              onMouseLeave: () => setHoveredItem(null),
              style: {
                cursor: "pointer",
                transition: "opacity 0.2s ease, fill-opacity 0.2s ease"
              }
            }
          );
        })),
        /* @__PURE__ */ import_react82.default.createElement("g", { className: "sankey-nodes" }, nodes.map((node, index) => {
          const isSelected = node.id === selectedId;
          const isFocused = nodes[focusedIndex]?.id === node.id;
          const isPathActive = activePathSets.nodeIds.has(node.id);
          const isDimmed = activePathSets.isActive && !isPathActive;
          const catStyle = categoryColorMap.get(node.category || node.label) || {
            color: colorScale[index % colorScale.length],
            pattern: PATTERN_PRESETS[index % PATTERN_PRESETS.length]
          };
          const isLeftColumn = node.column === 0;
          const isRightColumn = node.column === stages.length - 1;
          return /* @__PURE__ */ import_react82.default.createElement(
            "g",
            {
              key: node.id,
              className: "sankey-node",
              transform: `translate(${node.x}, ${node.y})`,
              onClick: () => handleSelectNode(node),
              onMouseEnter: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredItem({
                  type: "node",
                  item: node,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                });
              },
              onMouseMove: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredItem((prev) => prev ? {
                  ...prev,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                } : null);
              },
              onMouseLeave: () => setHoveredItem(null),
              style: { cursor: "pointer" },
              role: "button",
              tabIndex: -1,
              "aria-label": `${node.label}: ${formatVizValue(node.value, unit, locale)}`
            },
            /* @__PURE__ */ import_react82.default.createElement(
              "rect",
              {
                x: 0,
                y: 0,
                width: node.width,
                height: node.height,
                fill: catStyle.color,
                stroke: isSelected || isFocused ? "#0f172a" : "#ffffff",
                strokeWidth: isSelected || isFocused ? 2.5 : 1,
                rx: "3",
                filter: isSelected ? "url(#sankey-glow)" : void 0,
                opacity: isDimmed ? 0.3 : 1,
                style: { transition: "opacity 0.2s ease" }
              }
            ),
            patternFills && catStyle.pattern && /* @__PURE__ */ import_react82.default.createElement(
              "rect",
              {
                x: 0,
                y: 0,
                width: node.width,
                height: node.height,
                fill: `url(#sankey-${catStyle.pattern.id})`,
                rx: "3",
                style: { pointerEvents: "none", opacity: isDimmed ? 0.1 : 0.8 }
              }
            ),
            /* @__PURE__ */ import_react82.default.createElement(
              "text",
              {
                x: isRightColumn ? -8 : isLeftColumn ? node.width + 8 : node.width / 2,
                y: node.height / 2 + 4,
                textAnchor: isRightColumn ? "end" : isLeftColumn ? "start" : "middle",
                fontSize: "11px",
                fontWeight: "600",
                fill: "var(--text-primary, #0f172a)",
                style: {
                  pointerEvents: "none",
                  paintOrder: "stroke",
                  stroke: "rgba(255,255,255,0.85)",
                  strokeWidth: 3,
                  strokeLinejoin: "round"
                }
              },
              node.label
            ),
            node.height >= 24 && /* @__PURE__ */ import_react82.default.createElement(
              "text",
              {
                x: isRightColumn ? -8 : isLeftColumn ? node.width + 8 : node.width / 2,
                y: node.height / 2 + 16,
                textAnchor: isRightColumn ? "end" : isLeftColumn ? "start" : "middle",
                fontSize: "9px",
                fontWeight: "500",
                fill: "var(--text-secondary, #64748b)",
                style: { pointerEvents: "none" }
              },
              formatVizValue(node.value, unit, locale)
            )
          );
        }))
      ),
      hoveredItem && /* @__PURE__ */ import_react82.default.createElement(
        "div",
        {
          style: {
            position: "absolute",
            left: Math.min(hoveredItem.clientX + 14, width - 210),
            top: Math.max(10, Math.min(hoveredItem.clientY - 20, height - 100)),
            background: "var(--surface-floating, #0f172a)",
            color: "#f8fafc",
            padding: "8px 12px",
            borderRadius: "var(--radius-sm, 6px)",
            fontSize: "11px",
            lineHeight: 1.4,
            boxShadow: "var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.3))",
            pointerEvents: "none",
            zIndex: 60,
            maxWidth: "230px",
            border: "1px solid rgba(255,255,255,0.1)"
          }
        },
        hoveredItem.type === "link" ? /* @__PURE__ */ import_react82.default.createElement(import_react82.default.Fragment, null, /* @__PURE__ */ import_react82.default.createElement("div", { style: { fontWeight: 600, fontSize: "12px", color: "#ffffff", marginBottom: "2px" } }, hoveredItem.item.source.label, " \u2192 ", hoveredItem.item.target.label), /* @__PURE__ */ import_react82.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "4px" } }, /* @__PURE__ */ import_react82.default.createElement("span", { style: { color: "#94a3b8" } }, "Flow Volume:"), /* @__PURE__ */ import_react82.default.createElement("strong", { style: { color: "#38bdf8" } }, formatVizValue(hoveredItem.item.value, unit, locale))), /* @__PURE__ */ import_react82.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px" } }, /* @__PURE__ */ import_react82.default.createElement("span", { style: { color: "#94a3b8" } }, "% of ", hoveredItem.item.source.label, ":"), /* @__PURE__ */ import_react82.default.createElement("span", null, (hoveredItem.item.value / hoveredItem.item.source.value * 100).toFixed(1), "%")), /* @__PURE__ */ import_react82.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px" } }, /* @__PURE__ */ import_react82.default.createElement("span", { style: { color: "#94a3b8" } }, "% of ", hoveredItem.item.target.label, ":"), /* @__PURE__ */ import_react82.default.createElement("span", null, (hoveredItem.item.value / hoveredItem.item.target.value * 100).toFixed(1), "%"))) : /* @__PURE__ */ import_react82.default.createElement(import_react82.default.Fragment, null, /* @__PURE__ */ import_react82.default.createElement("div", { style: { fontWeight: 600, fontSize: "12px", color: "#ffffff", marginBottom: "2px" } }, hoveredItem.item.label, " (Stage ", hoveredItem.item.column + 1, ")"), /* @__PURE__ */ import_react82.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "4px" } }, /* @__PURE__ */ import_react82.default.createElement("span", { style: { color: "#94a3b8" } }, "Net Flow Value:"), /* @__PURE__ */ import_react82.default.createElement("strong", { style: { color: "#38bdf8" } }, formatVizValue(hoveredItem.item.value, unit, locale))), hoveredItem.item.inValue > 0 && /* @__PURE__ */ import_react82.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px" } }, /* @__PURE__ */ import_react82.default.createElement("span", { style: { color: "#94a3b8" } }, "Total Inflow:"), /* @__PURE__ */ import_react82.default.createElement("span", null, formatVizValue(hoveredItem.item.inValue, unit, locale))), hoveredItem.item.outValue > 0 && /* @__PURE__ */ import_react82.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px" } }, /* @__PURE__ */ import_react82.default.createElement("span", { style: { color: "#94a3b8" } }, "Total Outflow:"), /* @__PURE__ */ import_react82.default.createElement("span", null, formatVizValue(hoveredItem.item.outValue, unit, locale))))
      ),
      showTableModal && /* @__PURE__ */ import_react82.default.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1e3,
            padding: "16px"
          },
          onClick: () => setShowTableModal(false)
        },
        /* @__PURE__ */ import_react82.default.createElement(
          "div",
          {
            style: {
              backgroundColor: "var(--surface-card, #ffffff)",
              borderRadius: "var(--radius-lg, 8px)",
              boxShadow: "var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.3))",
              maxWidth: "720px",
              width: "100%",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid var(--border-subtle, #cbd5e1)"
            },
            onClick: (e) => e.stopPropagation(),
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Accessible Flow Data Table"
          },
          /* @__PURE__ */ import_react82.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react82.default.createElement("h3", { style: { margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)" } }, "Flow Transfer Table: ", title || "Sankey Data"), /* @__PURE__ */ import_react82.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                border: "none",
                background: "transparent",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                color: "var(--text-muted, #64748b)"
              },
              "aria-label": "Close modal"
            },
            "\xD7"
          )),
          /* @__PURE__ */ import_react82.default.createElement("div", { style: { overflowY: "auto", padding: "16px" } }, /* @__PURE__ */ import_react82.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" } }, /* @__PURE__ */ import_react82.default.createElement("thead", null, /* @__PURE__ */ import_react82.default.createElement("tr", { style: { borderBottom: "2px solid var(--border-strong, #cbd5e1)", background: "var(--surface-sunken, #f8fafc)" } }, /* @__PURE__ */ import_react82.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Source Entity"), /* @__PURE__ */ import_react82.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Target Entity"), /* @__PURE__ */ import_react82.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right", color: "var(--text-secondary, #475569)" } }, "Transfer Quantity"), /* @__PURE__ */ import_react82.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right", color: "var(--text-secondary, #475569)" } }, "% of Source"), /* @__PURE__ */ import_react82.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right", color: "var(--text-secondary, #475569)" } }, "% of Target"))), /* @__PURE__ */ import_react82.default.createElement("tbody", null, links.map((link) => {
            const pctSource = (link.value / link.source.value * 100).toFixed(1);
            const pctTarget = (link.value / link.target.value * 100).toFixed(1);
            return /* @__PURE__ */ import_react82.default.createElement(
              "tr",
              {
                key: link.id,
                style: {
                  borderBottom: "1px solid var(--border-subtle, #f1f5f9)",
                  background: link.id === selectedId ? "var(--surface-active, #eff6ff)" : "transparent"
                }
              },
              /* @__PURE__ */ import_react82.default.createElement("td", { style: { padding: "6px 10px", fontWeight: 600 } }, link.source.label),
              /* @__PURE__ */ import_react82.default.createElement("td", { style: { padding: "6px 10px", fontWeight: 600 } }, link.target.label),
              /* @__PURE__ */ import_react82.default.createElement("td", { style: { padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" } }, formatVizValue(link.value, unit, locale)),
              /* @__PURE__ */ import_react82.default.createElement("td", { style: { padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" } }, pctSource, "%"),
              /* @__PURE__ */ import_react82.default.createElement("td", { style: { padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" } }, pctTarget, "%")
            );
          })))),
          /* @__PURE__ */ import_react82.default.createElement("div", { style: { display: "flex", justifyContent: "flex-end", padding: "10px 16px", background: "var(--surface-sunken, #f8fafc)", borderTop: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react82.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                padding: "6px 14px",
                borderRadius: "var(--radius-sm, 4px)",
                background: "var(--action-solid, #2563eb)",
                color: "#ffffff",
                border: "none",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer"
              }
            },
            "Close Table"
          ))
        )
      )
    );
  }

  // components/data/NetworkDiagram.jsx
  var import_react83 = __toESM(require_react(), 1);
  function NetworkDiagram({
    nodes: inputNodes = [],
    links: inputLinks = [],
    width = 760,
    height = 480,
    layout = "force",
    // 'force' | 'circular'
    directed = true,
    colorScale = VIZ_COLORS,
    title = "",
    subtitle = "",
    searchable = true,
    zoomable = true,
    draggableNodes = true,
    initialSpread = 1,
    // Initial multiplier
    minSpread = 0.4,
    // Configurable minimum stretch
    maxSpread = 4,
    // Configurable maximum stretch (supports dense 100+ node graphs)
    selectedId: controlledSelectedId = null,
    onNodeClick = null,
    onLinkClick = null,
    onSelectionChange = null,
    className = ""
  }) {
    const [internalSelectedId, setInternalSelectedId] = (0, import_react83.useState)(null);
    const [hoveredItem, setHoveredItem] = (0, import_react83.useState)(null);
    const [searchQuery, setSearchQuery] = (0, import_react83.useState)("");
    const [focusedIndex, setFocusedIndex] = (0, import_react83.useState)(0);
    const [showTableModal, setShowTableModal] = (0, import_react83.useState)(false);
    const [announcement, setAnnouncement] = (0, import_react83.useState)("");
    const [spreadMultiplier, setSpreadMultiplier] = (0, import_react83.useState)(initialSpread);
    const [zoom, setZoom] = (0, import_react83.useState)(1);
    const [pan, setPan] = (0, import_react83.useState)({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = (0, import_react83.useState)(false);
    const [startPan, setStartPan] = (0, import_react83.useState)({ x: 0, y: 0 });
    const [draggingNodeId, setDraggingNodeId] = (0, import_react83.useState)(null);
    const [dragOffset, setDragOffset] = (0, import_react83.useState)({ x: 0, y: 0 });
    const [nodePositions, setNodePositions] = (0, import_react83.useState)(/* @__PURE__ */ new Map());
    const containerRef = (0, import_react83.useRef)(null);
    const svgRef = (0, import_react83.useRef)(null);
    const selectedId = controlledSelectedId !== void 0 && controlledSelectedId !== null ? controlledSelectedId : internalSelectedId;
    const { nodes: baseNodes, links: baseLinks, adjacencyMap } = (0, import_react83.useMemo)(() => {
      return computeNetworkLayout({
        nodes: inputNodes,
        links: inputLinks,
        width,
        height,
        layout,
        linkDistance: 90 * spreadMultiplier,
        repulsion: 1800 * (spreadMultiplier * spreadMultiplier)
      });
    }, [inputNodes, inputLinks, width, height, layout, spreadMultiplier]);
    const nodes = (0, import_react83.useMemo)(() => {
      return baseNodes.map((n) => {
        const dragged = nodePositions.get(n.id);
        if (dragged) {
          return { ...n, x: dragged.x, y: dragged.y };
        }
        return n;
      });
    }, [baseNodes, nodePositions]);
    const links = (0, import_react83.useMemo)(() => {
      const nodeMap = new Map(nodes.map((n) => [n.id, n]));
      return baseLinks.map((l) => ({
        ...l,
        source: nodeMap.get(l.source.id) || l.source,
        target: nodeMap.get(l.target.id) || l.target
      }));
    }, [baseLinks, nodes]);
    (0, import_react83.useEffect)(() => {
      setNodePositions(/* @__PURE__ */ new Map());
    }, [inputNodes, inputLinks, layout]);
    const categoryStyleMap = (0, import_react83.useMemo)(() => {
      const map = /* @__PURE__ */ new Map();
      nodes.forEach((n) => {
        const cat = n.category || "default";
        if (!map.has(cat)) {
          map.set(cat, {
            color: colorScale[map.size % colorScale.length],
            symbol: POINT_SYMBOLS[map.size % POINT_SYMBOLS.length]
          });
        }
      });
      return map;
    }, [nodes, colorScale]);
    const searchMatchIds = (0, import_react83.useMemo)(() => {
      if (!searchQuery.trim()) return /* @__PURE__ */ new Set();
      const q = searchQuery.toLowerCase();
      const set = /* @__PURE__ */ new Set();
      nodes.forEach((n) => {
        if (n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q) || n.category?.toLowerCase().includes(q)) {
          set.add(n.id);
        }
      });
      return set;
    }, [searchQuery, nodes]);
    const activeNeighborhood = (0, import_react83.useMemo)(() => {
      const activeNodeIds = /* @__PURE__ */ new Set();
      const activeLinkIds = /* @__PURE__ */ new Set();
      const activeTargetId = hoveredItem?.id || selectedId;
      if (searchMatchIds.size > 0) {
        searchMatchIds.forEach((id) => activeNodeIds.add(id));
        links.forEach((l) => {
          if (searchMatchIds.has(l.source.id) && searchMatchIds.has(l.target.id)) {
            activeLinkIds.add(l.id);
          }
        });
        return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
      }
      if (!activeTargetId) return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: false };
      const targetNode = nodes.find((n) => n.id === activeTargetId);
      if (targetNode) {
        activeNodeIds.add(targetNode.id);
        const neighbors = adjacencyMap.get(targetNode.id) || /* @__PURE__ */ new Set();
        neighbors.forEach((nId) => activeNodeIds.add(nId));
        links.forEach((l) => {
          if (l.source.id === targetNode.id || l.target.id === targetNode.id) {
            activeLinkIds.add(l.id);
          }
        });
      } else {
        const targetLink = links.find((l) => l.id === activeTargetId);
        if (targetLink) {
          activeLinkIds.add(targetLink.id);
          activeNodeIds.add(targetLink.source.id);
          activeNodeIds.add(targetLink.target.id);
        }
      }
      return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
    }, [hoveredItem, selectedId, searchMatchIds, nodes, links, adjacencyMap]);
    const handleSelectNode = (0, import_react83.useCallback)((node) => {
      const nextId = selectedId === node.id ? null : node.id;
      setInternalSelectedId(nextId);
      const neighborsCount = (adjacencyMap.get(node.id) || /* @__PURE__ */ new Set()).size;
      setAnnouncement(`Selected node ${node.label}. Connected to ${neighborsCount} neighbor nodes.`);
      if (onNodeClick) onNodeClick(node);
      if (onSelectionChange) onSelectionChange(nextId ? { type: "node", node } : null);
    }, [selectedId, adjacencyMap, onNodeClick, onSelectionChange]);
    const getTransformedCoordinates = (0, import_react83.useCallback)((clientX, clientY) => {
      if (!svgRef.current) return { x: clientX, y: clientY };
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = clientX - rect.left;
      const rawY = clientY - rect.top;
      return {
        x: (rawX - pan.x) / zoom,
        y: (rawY - pan.y) / zoom
      };
    }, [pan, zoom]);
    const handleNodeMouseDown = (0, import_react83.useCallback)((node, e) => {
      if (!draggableNodes) return;
      e.stopPropagation();
      setDraggingNodeId(node.id);
      const coords = getTransformedCoordinates(e.clientX, e.clientY);
      setDragOffset({
        x: coords.x - node.x,
        y: coords.y - node.y
      });
    }, [draggableNodes, getTransformedCoordinates]);
    const handleMouseMove = (0, import_react83.useCallback)((e) => {
      if (draggingNodeId) {
        const coords = getTransformedCoordinates(e.clientX, e.clientY);
        const newX = coords.x - dragOffset.x;
        const newY = coords.y - dragOffset.y;
        setNodePositions((prev) => {
          const next = new Map(prev);
          next.set(draggingNodeId, { x: newX, y: newY });
          return next;
        });
      } else if (isPanning && zoomable) {
        setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
      }
    }, [draggingNodeId, dragOffset, getTransformedCoordinates, isPanning, zoomable, startPan]);
    const handleMouseUp = (0, import_react83.useCallback)(() => {
      if (draggingNodeId) {
        const node = nodes.find((n) => n.id === draggingNodeId);
        if (node) {
          setAnnouncement(`Repositioned node ${node.label}. Connected edges stretched.`);
        }
        setDraggingNodeId(null);
      }
      setIsPanning(false);
    }, [draggingNodeId, nodes]);
    const handleKeyDown = (0, import_react83.useCallback)((e) => {
      if (nodes.length === 0) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev + 1) % nodes.length;
          const target = nodes[next];
          setAnnouncement(`Focused ${target.label}, degree ${target.degree}`);
          return next;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev - 1 + nodes.length) % nodes.length;
          const target = nodes[next];
          setAnnouncement(`Focused ${target.label}, degree ${target.degree}`);
          return next;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < nodes.length) {
          handleSelectNode(nodes[focusedIndex]);
        }
      } else if (e.altKey && (e.key === "F11" || e.keyCode === 122)) {
        e.preventDefault();
        setShowTableModal((prev) => !prev);
      }
    }, [nodes, focusedIndex, handleSelectNode]);
    const handleZoomIn = () => setZoom((z) => Math.min(3.5, z + 0.25));
    const handleZoomOut = () => setZoom((z) => Math.max(0.3, z - 0.25));
    const handleResetZoom = () => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setNodePositions(/* @__PURE__ */ new Map());
      setSpreadMultiplier(initialSpread);
    };
    const handleCanvasMouseDown = (e) => {
      if (!zoomable) return;
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };
    if (!nodes || nodes.length === 0) {
      return /* @__PURE__ */ import_react83.default.createElement("div", { className: `network-empty ${className}`, style: { width, height, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-sunken, #f8fafc)", border: "1px dashed var(--border-subtle, #cbd5e1)", borderRadius: "var(--radius-md, 8px)", color: "var(--text-muted, #64748b)", fontSize: "13px" } }, "No relational network data available to display");
    }
    return /* @__PURE__ */ import_react83.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `network-container ${className}`,
        style: {
          position: "relative",
          width,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          userSelect: "none"
        },
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "region",
        "aria-label": `Network Diagram: ${title || "Relational Graph"}. ${nodes.length} nodes, ${links.length} edges. Drag nodes to stretch clusters. Spread slider (${minSpread}x to ${maxSpread}x) expands spacing. Use arrow keys to navigate nodes, Enter to isolate neighborhood, Alt+F11 for accessible relationship table.`
      },
      /* @__PURE__ */ import_react83.default.createElement("div", { "aria-live": "polite", className: "sr-only", style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 } }, announcement),
      /* @__PURE__ */ import_react83.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" } }, /* @__PURE__ */ import_react83.default.createElement("div", null, title && /* @__PURE__ */ import_react83.default.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)", letterSpacing: "-0.01em" } }, title), subtitle && /* @__PURE__ */ import_react83.default.createElement("div", { style: { fontSize: "12px", color: "var(--text-secondary, #64748b)", marginTop: "2px" } }, subtitle)), /* @__PURE__ */ import_react83.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" } }, /* @__PURE__ */ import_react83.default.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-secondary, #475569)", background: "var(--surface-sunken, #f1f5f9)", padding: "2px 8px", borderRadius: "var(--radius-sm, 4px)" } }, /* @__PURE__ */ import_react83.default.createElement("span", { style: { fontWeight: 600 } }, "Stretch:"), /* @__PURE__ */ import_react83.default.createElement(
        "input",
        {
          type: "range",
          min: minSpread,
          max: maxSpread,
          step: "0.1",
          value: spreadMultiplier,
          onChange: (e) => setSpreadMultiplier(parseFloat(e.target.value)),
          style: { width: "75px", cursor: "ew-resize" },
          title: `Expand / Stretch Network Spacing (${minSpread}x - ${maxSpread}x)`,
          "aria-label": `Stretch network edge spacing from ${minSpread}x to ${maxSpread}x`
        }
      ), /* @__PURE__ */ import_react83.default.createElement("span", { style: { fontSize: "10px", fontVariantNumeric: "tabular-nums", width: "28px" } }, spreadMultiplier.toFixed(1), "x")), searchable && /* @__PURE__ */ import_react83.default.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ import_react83.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Search node...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          style: {
            fontSize: "11px",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm, 4px)",
            border: "1px solid var(--border-subtle, #cbd5e1)",
            background: "var(--surface-card, #ffffff)",
            color: "var(--text-primary, #0f172a)",
            width: "115px"
          },
          "aria-label": "Filter network nodes"
        }
      ), searchQuery && /* @__PURE__ */ import_react83.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => setSearchQuery(""),
          style: { position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", fontSize: "12px", color: "#94a3b8" }
        },
        "\xD7"
      )), zoomable && /* @__PURE__ */ import_react83.default.createElement("div", { style: { display: "inline-flex", background: "var(--surface-card, #ffffff)", border: "1px solid var(--border-subtle, #cbd5e1)", borderRadius: "var(--radius-sm, 4px)", overflow: "hidden" } }, /* @__PURE__ */ import_react83.default.createElement(
        "button",
        {
          type: "button",
          onClick: handleZoomIn,
          style: { padding: "3px 8px", background: "transparent", border: "none", borderRight: "1px solid var(--border-subtle, #cbd5e1)", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "var(--text-secondary, #475569)" },
          title: "Zoom In"
        },
        "+"
      ), /* @__PURE__ */ import_react83.default.createElement(
        "button",
        {
          type: "button",
          onClick: handleZoomOut,
          style: { padding: "3px 8px", background: "transparent", border: "none", borderRight: "1px solid var(--border-subtle, #cbd5e1)", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "var(--text-secondary, #475569)" },
          title: "Zoom Out"
        },
        "\u2212"
      ), /* @__PURE__ */ import_react83.default.createElement(
        "button",
        {
          type: "button",
          onClick: handleResetZoom,
          style: { padding: "3px 8px", background: "transparent", border: "none", fontSize: "11px", cursor: "pointer", color: "var(--text-secondary, #475569)" },
          title: "Reset View and Node Positions"
        },
        "Reset"
      )), /* @__PURE__ */ import_react83.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => setShowTableModal(true),
          style: {
            fontSize: "11px",
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: "var(--radius-sm, 4px)",
            border: "1px solid var(--border-subtle, #cbd5e1)",
            background: "var(--surface-card, #ffffff)",
            color: "var(--text-secondary, #475569)",
            cursor: "pointer"
          },
          title: "Open Accessible Relationship Table (Alt+F11)",
          "aria-label": "Open accessible relationship table"
        },
        "Accessible Table"
      ))),
      /* @__PURE__ */ import_react83.default.createElement(
        "svg",
        {
          ref: svgRef,
          width,
          height,
          onMouseDown: handleCanvasMouseDown,
          onMouseMove: handleMouseMove,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseUp,
          style: {
            display: "block",
            background: "var(--surface-card, #ffffff)",
            border: "1px solid var(--border-subtle, #e2e8f0)",
            borderRadius: "var(--radius-md, 6px)",
            overflow: "hidden",
            cursor: draggingNodeId ? "grabbing" : isPanning ? "grabbing" : zoomable ? "grab" : "default"
          }
        },
        /* @__PURE__ */ import_react83.default.createElement("defs", null, directed && /* @__PURE__ */ import_react83.default.createElement(
          "marker",
          {
            id: "net-arrow",
            viewBox: "0 0 10 10",
            refX: "18",
            refY: "5",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto-start-reverse"
          },
          /* @__PURE__ */ import_react83.default.createElement("path", { d: "M 0 1.5 L 8 5 L 0 8.5 z", fill: "var(--border-strong, #94a3b8)" })
        ), directed && /* @__PURE__ */ import_react83.default.createElement(
          "marker",
          {
            id: "net-arrow-active",
            viewBox: "0 0 10 10",
            refX: "18",
            refY: "5",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto-start-reverse"
          },
          /* @__PURE__ */ import_react83.default.createElement("path", { d: "M 0 1.5 L 8 5 L 0 8.5 z", fill: "var(--action-solid, #2563eb)" })
        ), /* @__PURE__ */ import_react83.default.createElement("filter", { id: "net-glow", x: "-20%", y: "-20%", width: "140%", height: "140%" }, /* @__PURE__ */ import_react83.default.createElement("feDropShadow", { dx: "0", dy: "2", stdDeviation: "3", floodOpacity: "0.25", floodColor: "#2563eb" }))),
        /* @__PURE__ */ import_react83.default.createElement("g", { transform: `translate(${pan.x}, ${pan.y}) scale(${zoom})` }, /* @__PURE__ */ import_react83.default.createElement("g", { className: "network-edges" }, links.map((link) => {
          const isPathActive = activeNeighborhood.linkIds.has(link.id);
          const isDimmed = activeNeighborhood.isActive && !isPathActive;
          const isSelected = link.id === selectedId;
          const strokeWidth = Math.max(1, Math.min(6, Math.sqrt(link.weight || 1) * 1.5));
          return /* @__PURE__ */ import_react83.default.createElement(
            "line",
            {
              key: link.id,
              x1: link.source.x,
              y1: link.source.y,
              x2: link.target.x,
              y2: link.target.y,
              stroke: isPathActive || isSelected ? "var(--action-solid, #2563eb)" : "var(--border-strong, #cbd5e1)",
              strokeWidth: isPathActive || isSelected ? strokeWidth + 1.5 : strokeWidth,
              strokeOpacity: isDimmed ? 0.1 : isPathActive ? 0.9 : 0.45,
              markerEnd: directed ? isPathActive ? "url(#net-arrow-active)" : "url(#net-arrow)" : void 0,
              onClick: (e) => {
                e.stopPropagation();
                setInternalSelectedId(link.id);
                if (onLinkClick) onLinkClick(link);
              },
              onMouseEnter: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredItem({
                  type: "link",
                  item: link,
                  id: link.id,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                });
              },
              onMouseLeave: () => setHoveredItem(null),
              style: {
                cursor: "pointer",
                transition: draggingNodeId ? "none" : "stroke 0.15s ease, stroke-opacity 0.15s ease"
              }
            }
          );
        })), /* @__PURE__ */ import_react83.default.createElement("g", { className: "network-nodes" }, nodes.map((node, index) => {
          const isSelected = node.id === selectedId;
          const isFocused = nodes[focusedIndex]?.id === node.id;
          const isNeighborActive = activeNeighborhood.nodeIds.has(node.id);
          const isDimmed = activeNeighborhood.isActive && !isNeighborActive;
          const isBeingDragged = draggingNodeId === node.id;
          const style = categoryStyleMap.get(node.category || "default") || { color: colorScale[0], symbol: "circle" };
          return /* @__PURE__ */ import_react83.default.createElement(
            "g",
            {
              key: node.id,
              className: "network-node",
              transform: `translate(${node.x}, ${node.y})`,
              onMouseDown: (e) => handleNodeMouseDown(node, e),
              onClick: (e) => {
                e.stopPropagation();
                handleSelectNode(node);
              },
              onMouseEnter: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredItem({
                  type: "node",
                  item: node,
                  id: node.id,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                });
              },
              onMouseLeave: () => setHoveredItem(null),
              style: { cursor: isBeingDragged ? "grabbing" : draggableNodes ? "grab" : "pointer" },
              role: "button",
              tabIndex: -1,
              "aria-label": `${node.label} (${node.category}), degree: ${node.degree}. Draggable.`
            },
            (isSelected || isFocused || isBeingDragged) && /* @__PURE__ */ import_react83.default.createElement(
              "circle",
              {
                cx: 0,
                cy: 0,
                r: node.radius + 5,
                fill: "none",
                stroke: "var(--action-solid, #2563eb)",
                strokeWidth: 2,
                strokeDasharray: "3 2"
              }
            ),
            /* @__PURE__ */ import_react83.default.createElement(
              "circle",
              {
                cx: 0,
                cy: 0,
                r: node.radius,
                fill: style.color,
                stroke: "#ffffff",
                strokeWidth: isSelected || isBeingDragged ? 3 : 2,
                opacity: isDimmed ? 0.15 : 1,
                filter: isSelected || isBeingDragged ? "url(#net-glow)" : void 0,
                style: { transition: draggingNodeId ? "none" : "opacity 0.2s ease, r 0.15s ease" }
              }
            ),
            style.symbol === "square" && /* @__PURE__ */ import_react83.default.createElement(
              "rect",
              {
                x: -node.radius / 2.5,
                y: -node.radius / 2.5,
                width: node.radius * 0.8,
                height: node.radius * 0.8,
                fill: "#ffffff",
                opacity: isDimmed ? 0.2 : 0.8,
                style: { pointerEvents: "none" }
              }
            ),
            style.symbol === "diamond" && /* @__PURE__ */ import_react83.default.createElement(
              "polygon",
              {
                points: `0,${-node.radius * 0.5} ${node.radius * 0.5},0 0,${node.radius * 0.5} ${-node.radius * 0.5},0`,
                fill: "#ffffff",
                opacity: isDimmed ? 0.2 : 0.8,
                style: { pointerEvents: "none" }
              }
            ),
            /* @__PURE__ */ import_react83.default.createElement(
              "text",
              {
                x: 0,
                y: node.radius + 12,
                textAnchor: "middle",
                fontSize: "10px",
                fontWeight: "600",
                fill: "var(--text-primary, #0f172a)",
                opacity: isDimmed ? 0.2 : 1,
                style: {
                  pointerEvents: "none",
                  paintOrder: "stroke",
                  stroke: "rgba(255,255,255,0.9)",
                  strokeWidth: 3,
                  strokeLinejoin: "round"
                }
              },
              node.label
            )
          );
        })))
      ),
      hoveredItem && !draggingNodeId && /* @__PURE__ */ import_react83.default.createElement(
        "div",
        {
          style: {
            position: "absolute",
            left: Math.min(hoveredItem.clientX + 14, width - 210),
            top: Math.max(10, Math.min(hoveredItem.clientY - 20, height - 90)),
            background: "var(--surface-floating, #0f172a)",
            color: "#f8fafc",
            padding: "8px 12px",
            borderRadius: "var(--radius-sm, 6px)",
            fontSize: "11px",
            lineHeight: 1.4,
            boxShadow: "var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.3))",
            pointerEvents: "none",
            zIndex: 60,
            maxWidth: "230px",
            border: "1px solid rgba(255,255,255,0.1)"
          }
        },
        hoveredItem.type === "node" ? /* @__PURE__ */ import_react83.default.createElement(import_react83.default.Fragment, null, /* @__PURE__ */ import_react83.default.createElement("div", { style: { fontWeight: 600, fontSize: "12px", color: "#ffffff" } }, hoveredItem.item.label), /* @__PURE__ */ import_react83.default.createElement("div", { style: { color: "#94a3b8", fontSize: "10px" } }, "Category: ", hoveredItem.item.category), /* @__PURE__ */ import_react83.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "4px" } }, /* @__PURE__ */ import_react83.default.createElement("span", { style: { color: "#94a3b8" } }, "Network Degree:"), /* @__PURE__ */ import_react83.default.createElement("strong", { style: { color: "#38bdf8" } }, hoveredItem.item.degree, " connections")), /* @__PURE__ */ import_react83.default.createElement("div", { style: { color: "#64748b", fontSize: "9px", marginTop: "2px", fontStyle: "italic" } }, "(Click and drag to stretch / pin node)")) : /* @__PURE__ */ import_react83.default.createElement(import_react83.default.Fragment, null, /* @__PURE__ */ import_react83.default.createElement("div", { style: { fontWeight: 600, fontSize: "12px", color: "#ffffff" } }, hoveredItem.item.source.label, " \u2192 ", hoveredItem.item.target.label), /* @__PURE__ */ import_react83.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "4px" } }, /* @__PURE__ */ import_react83.default.createElement("span", { style: { color: "#94a3b8" } }, "Edge Weight:"), /* @__PURE__ */ import_react83.default.createElement("strong", { style: { color: "#38bdf8" } }, hoveredItem.item.weight)), hoveredItem.item.label && /* @__PURE__ */ import_react83.default.createElement("div", { style: { color: "#94a3b8", fontSize: "10px" } }, "Relation: ", hoveredItem.item.label))
      ),
      showTableModal && /* @__PURE__ */ import_react83.default.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1e3,
            padding: "16px"
          },
          onClick: () => setShowTableModal(false)
        },
        /* @__PURE__ */ import_react83.default.createElement(
          "div",
          {
            style: {
              backgroundColor: "var(--surface-card, #ffffff)",
              borderRadius: "var(--radius-lg, 8px)",
              boxShadow: "var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.3))",
              maxWidth: "720px",
              width: "100%",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid var(--border-subtle, #cbd5e1)"
            },
            onClick: (e) => e.stopPropagation(),
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Accessible Network Relationship Table"
          },
          /* @__PURE__ */ import_react83.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react83.default.createElement("h3", { style: { margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)" } }, "Network Adjacency Table: ", title || "Graph Data"), /* @__PURE__ */ import_react83.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                border: "none",
                background: "transparent",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                color: "var(--text-muted, #64748b)"
              },
              "aria-label": "Close modal"
            },
            "\xD7"
          )),
          /* @__PURE__ */ import_react83.default.createElement("div", { style: { overflowY: "auto", padding: "16px" } }, /* @__PURE__ */ import_react83.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" } }, /* @__PURE__ */ import_react83.default.createElement("thead", null, /* @__PURE__ */ import_react83.default.createElement("tr", { style: { borderBottom: "2px solid var(--border-strong, #cbd5e1)", background: "var(--surface-sunken, #f8fafc)" } }, /* @__PURE__ */ import_react83.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Entity Node"), /* @__PURE__ */ import_react83.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Category"), /* @__PURE__ */ import_react83.default.createElement("th", { style: { padding: "8px 10px", textAlign: "center", color: "var(--text-secondary, #475569)" } }, "Degree"), /* @__PURE__ */ import_react83.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Connected Neighbors"))), /* @__PURE__ */ import_react83.default.createElement("tbody", null, nodes.map((node) => {
            const neighbors = Array.from(adjacencyMap.get(node.id) || []).map((nId) => nodes.find((n) => n.id === nId)?.label || nId).join(", ");
            return /* @__PURE__ */ import_react83.default.createElement(
              "tr",
              {
                key: node.id,
                style: {
                  borderBottom: "1px solid var(--border-subtle, #f1f5f9)",
                  background: node.id === selectedId ? "var(--surface-active, #eff6ff)" : "transparent"
                }
              },
              /* @__PURE__ */ import_react83.default.createElement("td", { style: { padding: "6px 10px", fontWeight: 600 } }, node.label),
              /* @__PURE__ */ import_react83.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-secondary, #475569)" } }, node.category),
              /* @__PURE__ */ import_react83.default.createElement("td", { style: { padding: "6px 10px", textAlign: "center", fontVariantNumeric: "tabular-nums" } }, node.degree),
              /* @__PURE__ */ import_react83.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-muted, #64748b)", fontSize: "11px" } }, neighbors || "None")
            );
          })))),
          /* @__PURE__ */ import_react83.default.createElement("div", { style: { display: "flex", justifyContent: "flex-end", padding: "10px 16px", background: "var(--surface-sunken, #f8fafc)", borderTop: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react83.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                padding: "6px 14px",
                borderRadius: "var(--radius-sm, 4px)",
                background: "var(--action-solid, #2563eb)",
                color: "#ffffff",
                border: "none",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer"
              }
            },
            "Close Table"
          ))
        )
      )
    );
  }

  // components/data/GeoMap.jsx
  var import_react84 = __toESM(require_react(), 1);
  var DEFAULT_INDIA_REGIONS = [
    { id: "reg-mh", label: "Maharashtra (Auto Corridor)", path: "M 240 230 L 310 215 L 350 250 L 330 310 L 260 325 L 220 275 Z", value: 88, category: "Tier-1 Hub" },
    { id: "reg-gj", label: "Gujarat (Sanand & Hazira)", path: "M 190 180 L 240 170 L 250 220 L 205 240 L 175 210 Z", value: 74, category: "Assembly Zone" },
    { id: "reg-ka", label: "Karnataka (Raw Materials & Tech)", path: "M 255 320 L 305 310 L 315 375 L 275 410 L 245 350 Z", value: 65, category: "Steel / Mining" },
    { id: "reg-tn", label: "Tamil Nadu (Chennai Auto Belt)", path: "M 305 370 L 350 360 L 365 425 L 310 445 L 295 400 Z", value: 82, category: "Export Hub" },
    { id: "reg-hr-dl", label: "NCR / Haryana (Manesar Cluster)", path: "M 265 110 L 315 95 L 330 135 L 290 155 L 255 130 Z", value: 79, category: "Assembly Zone" },
    { id: "reg-jh-wb", label: "Eastern Belt (Jamshedpur / Steel)", path: "M 405 185 L 465 175 L 475 235 L 420 250 L 390 210 Z", value: 70, category: "Raw Materials" }
  ];
  var DEFAULT_INDIA_HUBS = [
    { id: "hub-chakan", label: "Chakan Plant PL-04 (Pune)", coordinates: [73.85, 18.75], role: "Primary Manufacturing Plant", status: "Operational", value: 4250, size: 18, category: "HQ Plant" },
    { id: "hub-mumbai", label: "Nhava Sheva Port (JNPT)", coordinates: [72.95, 18.95], role: "Sea Export Terminal", status: "Active", value: 2100, size: 14, category: "Logistics Port" },
    { id: "hub-sanand", label: "Sanand Assembly Hub (Tata)", coordinates: [72.38, 23], role: "OEM EV Assembly Client", status: "Active", value: 1850, size: 14, category: "OEM Client" },
    { id: "hub-manesar", label: "Manesar Auto Hub (NCR)", coordinates: [76.93, 28.35], role: "OEM Stamping Delivery", status: "Active", value: 1650, size: 13, category: "OEM Client" },
    { id: "hub-chennai", label: "Sriperumbudur Hub (Chennai)", coordinates: [79.95, 12.97], role: "OEM Assembly Client", status: "Active", value: 1950, size: 14, category: "OEM Client" },
    { id: "hub-jsw", label: "JSW Vijayanagar (Bellary)", coordinates: [76.65, 15.15], role: "Raw Steel Coil Supplier", status: "Active", value: 3100, size: 15, category: "Supplier" },
    { id: "hub-jamshedpur", label: "Tata Steel (Jamshedpur)", coordinates: [86.2, 22.8], role: "High-Tensile Sheet Supplier", status: "Active", value: 2400, size: 14, category: "Supplier" },
    { id: "hub-aurangabad", label: "Waluj Toolroom (Aurangabad)", coordinates: [75.32, 19.87], role: "Die Stamping Satellite", status: "Active", value: 1200, size: 12, category: "Satellite Plant" }
  ];
  var DEFAULT_SUPPLY_ROUTES = [
    { id: "route-jsw-chakan", sourceId: "hub-jsw", targetId: "hub-chakan", label: "CRCA Coil Freight (Daily)", value: 1850, status: "On-Time", curvature: 0.2 },
    { id: "route-jamshedpur-chakan", sourceId: "hub-jamshedpur", targetId: "hub-chakan", label: "High-Tensile Steel Rail (Weekly)", value: 1200, status: "On-Time", curvature: -0.22 },
    { id: "route-chakan-mumbai", sourceId: "hub-chakan", targetId: "hub-mumbai", label: "Export Body Panels (Expressway)", value: 1400, status: "On-Time", curvature: 0.15 },
    { id: "route-chakan-sanand", sourceId: "hub-chakan", targetId: "hub-sanand", label: "EV Chassis Sub-Assemblies", value: 1650, status: "In-Transit", curvature: -0.25 },
    { id: "route-chakan-chennai", sourceId: "hub-chakan", targetId: "hub-chennai", label: "Deep-Draw Stampings Corridor", value: 1100, status: "On-Time", curvature: 0.18 },
    { id: "route-chakan-manesar", sourceId: "hub-chakan", targetId: "hub-manesar", label: "North India Freight Trunk", value: 950, status: "Delayed", curvature: -0.18 },
    { id: "route-chakan-aurangabad", sourceId: "hub-chakan", targetId: "hub-aurangabad", label: "Inter-Plant Die Tooling Shuttles", value: 650, status: "On-Time", curvature: 0.1 }
  ];
  function GeoMap({
    regions = DEFAULT_INDIA_REGIONS,
    hubs = DEFAULT_INDIA_HUBS,
    routes = DEFAULT_SUPPLY_ROUTES,
    width = 760,
    height = 480,
    projection = "mercator",
    center = [78.5, 21],
    // Center of India
    scale = 920,
    variant = "hybrid",
    // 'hybrid' | 'choropleth' | 'bubble' | 'route'
    colorScale = VIZ_COLORS,
    patternFills = true,
    unit = "",
    locale = "en-IN",
    title = "",
    subtitle = "",
    searchable = true,
    zoomable = true,
    layerControls = true,
    selectedId: controlledSelectedId = null,
    onFeatureClick = null,
    onSelectionChange = null,
    className = ""
  }) {
    const [internalSelectedId, setInternalSelectedId] = (0, import_react84.useState)(null);
    const [hoveredFeature, setHoveredFeature] = (0, import_react84.useState)(null);
    const [searchQuery, setSearchQuery] = (0, import_react84.useState)("");
    const [focusedIndex, setFocusedIndex] = (0, import_react84.useState)(0);
    const [showTableModal, setShowTableModal] = (0, import_react84.useState)(false);
    const [announcement, setAnnouncement] = (0, import_react84.useState)("");
    const [showRegions, setShowRegions] = (0, import_react84.useState)(variant !== "bubble" && variant !== "route");
    const [showHubs, setShowHubs] = (0, import_react84.useState)(variant !== "choropleth");
    const [showRoutes, setShowRoutes] = (0, import_react84.useState)(variant === "hybrid" || variant === "route");
    const [zoom, setZoom] = (0, import_react84.useState)(1);
    const [pan, setPan] = (0, import_react84.useState)({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = (0, import_react84.useState)(false);
    const [startPan, setStartPan] = (0, import_react84.useState)({ x: 0, y: 0 });
    const containerRef = (0, import_react84.useRef)(null);
    const selectedId = controlledSelectedId !== void 0 && controlledSelectedId !== null ? controlledSelectedId : internalSelectedId;
    const geoProj = (0, import_react84.useMemo)(() => {
      return createGeoProjection({
        center,
        scale,
        width,
        height,
        projection
      });
    }, [center, scale, width, height, projection]);
    const projectedHubs = (0, import_react84.useMemo)(() => {
      return hubs.map((hub) => {
        const [x, y] = geoProj.project(hub.coordinates);
        return {
          ...hub,
          x,
          y
        };
      });
    }, [hubs, geoProj]);
    const projectedRoutes = (0, import_react84.useMemo)(() => {
      const hubMap = new Map(projectedHubs.map((h) => [h.id, h]));
      return routes.map((route) => {
        const s = hubMap.get(route.sourceId);
        const t = hubMap.get(route.targetId);
        if (!s || !t) return null;
        const pathD = createCurvedRoutePath({
          sourcePoint: [s.x, s.y],
          targetPoint: [t.x, t.y],
          curvature: route.curvature !== void 0 ? route.curvature : 0.2
        });
        return {
          ...route,
          source: s,
          target: t,
          pathD
        };
      }).filter(Boolean);
    }, [routes, projectedHubs]);
    const searchMatchIds = (0, import_react84.useMemo)(() => {
      if (!searchQuery.trim()) return /* @__PURE__ */ new Set();
      const q = searchQuery.toLowerCase();
      const set = /* @__PURE__ */ new Set();
      regions.forEach((r) => {
        if (r.label.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) set.add(r.id);
      });
      projectedHubs.forEach((h) => {
        if (h.label.toLowerCase().includes(q) || h.id.toLowerCase().includes(q) || h.role?.toLowerCase().includes(q)) set.add(h.id);
      });
      return set;
    }, [searchQuery, regions, projectedHubs]);
    const activeFeatures = (0, import_react84.useMemo)(() => {
      const activeIds = /* @__PURE__ */ new Set();
      const activeRouteIds = /* @__PURE__ */ new Set();
      if (searchMatchIds.size > 0) {
        searchMatchIds.forEach((id) => activeIds.add(id));
        projectedRoutes.forEach((r) => {
          if (searchMatchIds.has(r.sourceId) || searchMatchIds.has(r.targetId)) {
            activeRouteIds.add(r.id);
          }
        });
        return { ids: activeIds, routeIds: activeRouteIds, isActive: true };
      }
      const activeTarget = hoveredFeature || (selectedId ? projectedHubs.find((h) => h.id === selectedId) || regions.find((r) => r.id === selectedId) || projectedRoutes.find((r) => r.id === selectedId) : null);
      if (!activeTarget) return { ids: activeIds, routeIds: activeRouteIds, isActive: false };
      activeIds.add(activeTarget.id);
      projectedRoutes.forEach((r) => {
        if (r.sourceId === activeTarget.id || r.targetId === activeTarget.id) {
          activeRouteIds.add(r.id);
          activeIds.add(r.sourceId);
          activeIds.add(r.targetId);
        }
      });
      if (activeTarget.sourceId && activeTarget.targetId) {
        activeRouteIds.add(activeTarget.id);
        activeIds.add(activeTarget.sourceId);
        activeIds.add(activeTarget.targetId);
      }
      return { ids: activeIds, routeIds: activeRouteIds, isActive: true };
    }, [searchMatchIds, hoveredFeature, selectedId, projectedHubs, regions, projectedRoutes]);
    const handleSelectFeature = (0, import_react84.useCallback)((feat) => {
      const nextId = selectedId === feat.id ? null : feat.id;
      setInternalSelectedId(nextId);
      setAnnouncement(`Selected spatial feature ${feat.label || feat.id}${feat.value ? `: ${formatVizValue(feat.value, unit, locale)}` : ""}.`);
      if (onFeatureClick) onFeatureClick(feat);
      if (onSelectionChange) onSelectionChange(nextId ? feat : null);
    }, [selectedId, unit, locale, onFeatureClick, onSelectionChange]);
    const navigableList = (0, import_react84.useMemo)(() => [...projectedHubs, ...regions], [projectedHubs, regions]);
    const handleKeyDown = (0, import_react84.useCallback)((e) => {
      if (navigableList.length === 0) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev + 1) % navigableList.length;
          const target = navigableList[next];
          setAnnouncement(`Focused ${target.label}`);
          return next;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev - 1 + navigableList.length) % navigableList.length;
          const target = navigableList[next];
          setAnnouncement(`Focused ${target.label}`);
          return next;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < navigableList.length) {
          handleSelectFeature(navigableList[focusedIndex]);
        }
      } else if (e.altKey && (e.key === "F11" || e.keyCode === 122)) {
        e.preventDefault();
        setShowTableModal((prev) => !prev);
      }
    }, [navigableList, focusedIndex, handleSelectFeature]);
    const handleZoomIn = () => setZoom((z) => Math.min(3, z + 0.25));
    const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));
    const handleResetZoom = () => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    const handleMouseDown = (e) => {
      if (!zoomable) return;
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };
    const handleMouseMove = (e) => {
      if (!isPanning || !zoomable) return;
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    };
    const handleMouseUp = () => setIsPanning(false);
    return /* @__PURE__ */ import_react84.default.createElement(
      "div",
      {
        ref: containerRef,
        className: `geomap-container ${className}`,
        style: {
          position: "relative",
          width,
          fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          userSelect: "none"
        },
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "region",
        "aria-label": `Geographic Map: ${title || "Spatial Distribution"}. ${projectedHubs.length} logistics hubs, ${regions.length} industrial regions. Use arrow keys to navigate features, Enter to select, Alt+F11 for accessible tabular modal.`
      },
      /* @__PURE__ */ import_react84.default.createElement("div", { "aria-live": "polite", className: "sr-only", style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 } }, announcement),
      /* @__PURE__ */ import_react84.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" } }, /* @__PURE__ */ import_react84.default.createElement("div", null, title && /* @__PURE__ */ import_react84.default.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)", letterSpacing: "-0.01em" } }, title), subtitle && /* @__PURE__ */ import_react84.default.createElement("div", { style: { fontSize: "12px", color: "var(--text-secondary, #64748b)", marginTop: "2px" } }, subtitle)), /* @__PURE__ */ import_react84.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" } }, layerControls && /* @__PURE__ */ import_react84.default.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--text-secondary, #475569)", background: "var(--surface-sunken, #f1f5f9)", padding: "3px 8px", borderRadius: "var(--radius-sm, 4px)" } }, /* @__PURE__ */ import_react84.default.createElement("label", { style: { display: "flex", alignItems: "center", gap: "3px", cursor: "pointer" } }, /* @__PURE__ */ import_react84.default.createElement("input", { type: "checkbox", checked: showRegions, onChange: (e) => setShowRegions(e.target.checked), style: { margin: 0 } }), "Regions"), /* @__PURE__ */ import_react84.default.createElement("label", { style: { display: "flex", alignItems: "center", gap: "3px", cursor: "pointer" } }, /* @__PURE__ */ import_react84.default.createElement("input", { type: "checkbox", checked: showHubs, onChange: (e) => setShowHubs(e.target.checked), style: { margin: 0 } }), "Hubs"), /* @__PURE__ */ import_react84.default.createElement("label", { style: { display: "flex", alignItems: "center", gap: "3px", cursor: "pointer" } }, /* @__PURE__ */ import_react84.default.createElement("input", { type: "checkbox", checked: showRoutes, onChange: (e) => setShowRoutes(e.target.checked), style: { margin: 0 } }), "Corridors")), searchable && /* @__PURE__ */ import_react84.default.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ import_react84.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Search city/hub...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          style: {
            fontSize: "11px",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm, 4px)",
            border: "1px solid var(--border-subtle, #cbd5e1)",
            background: "var(--surface-card, #ffffff)",
            color: "var(--text-primary, #0f172a)",
            width: "115px"
          },
          "aria-label": "Search map location"
        }
      ), searchQuery && /* @__PURE__ */ import_react84.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => setSearchQuery(""),
          style: { position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", fontSize: "12px", color: "#94a3b8" }
        },
        "\xD7"
      )), zoomable && /* @__PURE__ */ import_react84.default.createElement("div", { style: { display: "inline-flex", background: "var(--surface-card, #ffffff)", border: "1px solid var(--border-subtle, #cbd5e1)", borderRadius: "var(--radius-sm, 4px)", overflow: "hidden" } }, /* @__PURE__ */ import_react84.default.createElement(
        "button",
        {
          type: "button",
          onClick: handleZoomIn,
          style: { padding: "3px 8px", background: "transparent", border: "none", borderRight: "1px solid var(--border-subtle, #cbd5e1)", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "var(--text-secondary, #475569)" },
          title: "Zoom In"
        },
        "+"
      ), /* @__PURE__ */ import_react84.default.createElement(
        "button",
        {
          type: "button",
          onClick: handleZoomOut,
          style: { padding: "3px 8px", background: "transparent", border: "none", borderRight: "1px solid var(--border-subtle, #cbd5e1)", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "var(--text-secondary, #475569)" },
          title: "Zoom Out"
        },
        "\u2212"
      ), /* @__PURE__ */ import_react84.default.createElement(
        "button",
        {
          type: "button",
          onClick: handleResetZoom,
          style: { padding: "3px 8px", background: "transparent", border: "none", fontSize: "11px", cursor: "pointer", color: "var(--text-secondary, #475569)" },
          title: "Reset View"
        },
        "Reset"
      )), /* @__PURE__ */ import_react84.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => setShowTableModal(true),
          style: {
            fontSize: "11px",
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: "var(--radius-sm, 4px)",
            border: "1px solid var(--border-subtle, #cbd5e1)",
            background: "var(--surface-card, #ffffff)",
            color: "var(--text-secondary, #475569)",
            cursor: "pointer"
          },
          title: "Open Accessible Spatial Data Table (Alt+F11)",
          "aria-label": "Open accessible geographic data table"
        },
        "Accessible Table"
      ))),
      /* @__PURE__ */ import_react84.default.createElement(
        "svg",
        {
          width,
          height,
          onMouseDown: handleMouseDown,
          onMouseMove: handleMouseMove,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseUp,
          style: {
            display: "block",
            background: "var(--surface-sunken, #f8fafc)",
            border: "1px solid var(--border-subtle, #e2e8f0)",
            borderRadius: "var(--radius-md, 6px)",
            overflow: "hidden",
            cursor: isPanning ? "grabbing" : zoomable ? "grab" : "default"
          }
        },
        /* @__PURE__ */ import_react84.default.createElement("defs", null, patternFills && PATTERN_PRESETS.map((pat) => /* @__PURE__ */ import_react84.default.createElement(
          "pattern",
          {
            key: pat.id,
            id: `geo-${pat.id}`,
            width: "8",
            height: "8",
            patternUnits: "userSpaceOnUse",
            patternTransform: pat.transform || void 0
          },
          pat.type === "circle" ? /* @__PURE__ */ import_react84.default.createElement("circle", { cx: "4", cy: "4", r: pat.r || 1.2, fill: pat.fill || "rgba(255,255,255,0.45)" }) : /* @__PURE__ */ import_react84.default.createElement(
            "line",
            {
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "8",
              stroke: pat.stroke || "rgba(255,255,255,0.35)",
              strokeWidth: pat.strokeWidth || 1.5
            }
          )
        )), /* @__PURE__ */ import_react84.default.createElement(
          "marker",
          {
            id: "geo-route-arrow",
            viewBox: "0 0 10 10",
            refX: "6",
            refY: "5",
            markerWidth: "5",
            markerHeight: "5",
            orient: "auto-start-reverse"
          },
          /* @__PURE__ */ import_react84.default.createElement("path", { d: "M 0 1.5 L 8 5 L 0 8.5 z", fill: "var(--action-solid, #2563eb)" })
        ), /* @__PURE__ */ import_react84.default.createElement("filter", { id: "geo-hub-glow", x: "-20%", y: "-20%", width: "140%", height: "140%" }, /* @__PURE__ */ import_react84.default.createElement("feDropShadow", { dx: "0", dy: "2", stdDeviation: "3", floodOpacity: "0.3", floodColor: "#2563eb" }))),
        /* @__PURE__ */ import_react84.default.createElement("g", { transform: `translate(${pan.x}, ${pan.y}) scale(${zoom})` }, showRegions && /* @__PURE__ */ import_react84.default.createElement("g", { className: "geo-regions" }, regions.map((reg, idx) => {
          const isSelected = reg.id === selectedId;
          const isHovered = hoveredFeature?.id === reg.id;
          const isPathActive = activeFeatures.ids.has(reg.id);
          const isDimmed = activeFeatures.isActive && !isPathActive;
          const baseColor = reg.color || colorScale[idx % colorScale.length];
          return /* @__PURE__ */ import_react84.default.createElement(
            "path",
            {
              key: reg.id,
              d: reg.path,
              fill: baseColor,
              fillOpacity: isDimmed ? 0.15 : isSelected || isHovered ? 0.85 : 0.45,
              stroke: isSelected ? "#0f172a" : "#ffffff",
              strokeWidth: isSelected ? 2 : 1,
              onClick: () => handleSelectFeature(reg),
              onMouseEnter: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredFeature({
                  ...reg,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                });
              },
              onMouseLeave: () => setHoveredFeature(null),
              style: { cursor: "pointer", transition: "fill-opacity 0.2s ease" }
            }
          );
        })), showRoutes && /* @__PURE__ */ import_react84.default.createElement("g", { className: "geo-routes" }, projectedRoutes.map((route) => {
          const isPathActive = activeFeatures.routeIds.has(route.id);
          const isDimmed = activeFeatures.isActive && !isPathActive;
          const isSelected = route.id === selectedId;
          return /* @__PURE__ */ import_react84.default.createElement(
            "path",
            {
              key: route.id,
              d: route.pathD,
              fill: "none",
              stroke: isPathActive || isSelected ? "var(--action-solid, #2563eb)" : "#94a3b8",
              strokeWidth: isPathActive || isSelected ? 2.5 : 1.5,
              strokeDasharray: route.status === "In-Transit" ? "4 3" : route.status === "Delayed" ? "2 2" : void 0,
              strokeOpacity: isDimmed ? 0.1 : isPathActive ? 0.95 : 0.55,
              onClick: () => handleSelectFeature(route),
              onMouseEnter: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredFeature({
                  ...route,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                });
              },
              onMouseLeave: () => setHoveredFeature(null),
              style: { cursor: "pointer", transition: "stroke-opacity 0.2s ease" }
            }
          );
        })), showHubs && /* @__PURE__ */ import_react84.default.createElement("g", { className: "geo-hubs" }, projectedHubs.map((hub, index) => {
          const isSelected = hub.id === selectedId;
          const isFocused = navigableList[focusedIndex]?.id === hub.id;
          const isPathActive = activeFeatures.ids.has(hub.id);
          const isDimmed = activeFeatures.isActive && !isPathActive;
          const isHQ = hub.category === "HQ Plant";
          const r = hub.size || 12;
          return /* @__PURE__ */ import_react84.default.createElement(
            "g",
            {
              key: hub.id,
              className: "geo-hub-mark",
              transform: `translate(${hub.x}, ${hub.y})`,
              onClick: () => handleSelectFeature(hub),
              onMouseEnter: (e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredFeature({
                  ...hub,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                });
              },
              onMouseLeave: () => setHoveredFeature(null),
              style: { cursor: "pointer" },
              role: "button",
              tabIndex: -1,
              "aria-label": `${hub.label}: ${formatVizValue(hub.value, unit, locale)}`
            },
            isHQ && /* @__PURE__ */ import_react84.default.createElement(
              "circle",
              {
                cx: 0,
                cy: 0,
                r: r + 6,
                fill: "none",
                stroke: "var(--action-solid, #2563eb)",
                strokeWidth: 1.5,
                opacity: 0.6
              }
            ),
            (isSelected || isFocused) && /* @__PURE__ */ import_react84.default.createElement(
              "circle",
              {
                cx: 0,
                cy: 0,
                r: r + 4,
                fill: "none",
                stroke: "var(--action-solid, #2563eb)",
                strokeWidth: 2,
                strokeDasharray: "3 2"
              }
            ),
            /* @__PURE__ */ import_react84.default.createElement(
              "circle",
              {
                cx: 0,
                cy: 0,
                r,
                fill: isHQ ? "var(--action-solid, #2563eb)" : "#0d9488",
                stroke: "#ffffff",
                strokeWidth: isSelected ? 3 : 2,
                opacity: isDimmed ? 0.2 : 1,
                filter: isSelected ? "url(#geo-hub-glow)" : void 0,
                style: { transition: "opacity 0.2s ease, r 0.15s ease" }
              }
            ),
            /* @__PURE__ */ import_react84.default.createElement("circle", { cx: 0, cy: 0, r: 3, fill: "#ffffff", opacity: isDimmed ? 0.3 : 0.9 }),
            /* @__PURE__ */ import_react84.default.createElement(
              "text",
              {
                x: 0,
                y: r + 11,
                textAnchor: "middle",
                fontSize: "10px",
                fontWeight: "600",
                fill: "var(--text-primary, #0f172a)",
                opacity: isDimmed ? 0.2 : 1,
                style: {
                  pointerEvents: "none",
                  paintOrder: "stroke",
                  stroke: "rgba(255,255,255,0.95)",
                  strokeWidth: 3,
                  strokeLinejoin: "round"
                }
              },
              hub.label
            )
          );
        })))
      ),
      hoveredFeature && /* @__PURE__ */ import_react84.default.createElement(
        "div",
        {
          style: {
            position: "absolute",
            left: Math.min(hoveredFeature.clientX + 14, width - 210),
            top: Math.max(10, Math.min(hoveredFeature.clientY - 20, height - 90)),
            background: "var(--surface-floating, #0f172a)",
            color: "#f8fafc",
            padding: "8px 12px",
            borderRadius: "var(--radius-sm, 6px)",
            fontSize: "11px",
            lineHeight: 1.4,
            boxShadow: "var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.3))",
            pointerEvents: "none",
            zIndex: 60,
            maxWidth: "230px",
            border: "1px solid rgba(255,255,255,0.1)"
          }
        },
        /* @__PURE__ */ import_react84.default.createElement("div", { style: { fontWeight: 600, fontSize: "12px", color: "#ffffff" } }, hoveredFeature.label || hoveredFeature.id),
        hoveredFeature.role && /* @__PURE__ */ import_react84.default.createElement("div", { style: { color: "#94a3b8", fontSize: "10px" } }, hoveredFeature.role),
        hoveredFeature.value !== void 0 && /* @__PURE__ */ import_react84.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "4px" } }, /* @__PURE__ */ import_react84.default.createElement("span", { style: { color: "#94a3b8" } }, "Throughput / Volume:"), /* @__PURE__ */ import_react84.default.createElement("strong", { style: { color: "#38bdf8" } }, formatVizValue(hoveredFeature.value, unit, locale))),
        hoveredFeature.status && /* @__PURE__ */ import_react84.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: "12px" } }, /* @__PURE__ */ import_react84.default.createElement("span", { style: { color: "#94a3b8" } }, "Status:"), /* @__PURE__ */ import_react84.default.createElement("span", null, hoveredFeature.status))
      ),
      showTableModal && /* @__PURE__ */ import_react84.default.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1e3,
            padding: "16px"
          },
          onClick: () => setShowTableModal(false)
        },
        /* @__PURE__ */ import_react84.default.createElement(
          "div",
          {
            style: {
              backgroundColor: "var(--surface-card, #ffffff)",
              borderRadius: "var(--radius-lg, 8px)",
              boxShadow: "var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.3))",
              maxWidth: "740px",
              width: "100%",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid var(--border-subtle, #cbd5e1)"
            },
            onClick: (e) => e.stopPropagation(),
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Accessible Geographic Spatial Data Table"
          },
          /* @__PURE__ */ import_react84.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react84.default.createElement("h3", { style: { margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary, #0f172a)" } }, "Geographic Spatial Table: ", title || "Map Data"), /* @__PURE__ */ import_react84.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                border: "none",
                background: "transparent",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                color: "var(--text-muted, #64748b)"
              },
              "aria-label": "Close modal"
            },
            "\xD7"
          )),
          /* @__PURE__ */ import_react84.default.createElement("div", { style: { overflowY: "auto", padding: "16px" } }, /* @__PURE__ */ import_react84.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" } }, /* @__PURE__ */ import_react84.default.createElement("thead", null, /* @__PURE__ */ import_react84.default.createElement("tr", { style: { borderBottom: "2px solid var(--border-strong, #cbd5e1)", background: "var(--surface-sunken, #f8fafc)" } }, /* @__PURE__ */ import_react84.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Spatial Feature / Hub"), /* @__PURE__ */ import_react84.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Category"), /* @__PURE__ */ import_react84.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Coordinates"), /* @__PURE__ */ import_react84.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right", color: "var(--text-secondary, #475569)" } }, "Volume (", unit || "qty", ")"), /* @__PURE__ */ import_react84.default.createElement("th", { style: { padding: "8px 10px", color: "var(--text-secondary, #475569)" } }, "Status"))), /* @__PURE__ */ import_react84.default.createElement("tbody", null, projectedHubs.map((hub) => /* @__PURE__ */ import_react84.default.createElement(
            "tr",
            {
              key: hub.id,
              style: {
                borderBottom: "1px solid var(--border-subtle, #f1f5f9)",
                background: hub.id === selectedId ? "var(--surface-active, #eff6ff)" : "transparent"
              }
            },
            /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px", fontWeight: 600 } }, "\u{1F4CD} ", hub.label),
            /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-secondary, #475569)" } }, hub.category || hub.role),
            /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-muted, #64748b)", fontSize: "11px", fontVariantNumeric: "tabular-nums" } }, hub.coordinates ? `${hub.coordinates[1]}\xB0N, ${hub.coordinates[0]}\xB0E` : "\u2014"),
            /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" } }, formatVizValue(hub.value, unit, locale)),
            /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px" } }, /* @__PURE__ */ import_react84.default.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: VIZ_SEMANTIC_COLORS.success } }, "\u25CF ", hub.status || "Active"))
          )), regions.map((reg) => /* @__PURE__ */ import_react84.default.createElement("tr", { key: reg.id, style: { borderBottom: "1px solid var(--border-subtle, #f1f5f9)" } }, /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px", fontWeight: 600 } }, "\u{1F5FA}\uFE0F ", reg.label), /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-secondary, #475569)" } }, reg.category || "Region"), /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-muted, #64748b)", fontSize: "11px" } }, "Region Polygon"), /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" } }, formatVizValue(reg.value, "%", locale)), /* @__PURE__ */ import_react84.default.createElement("td", { style: { padding: "6px 10px", color: "var(--text-muted, #64748b)" } }, "Industrial Cluster")))))),
          /* @__PURE__ */ import_react84.default.createElement("div", { style: { display: "flex", justifyContent: "flex-end", padding: "10px 16px", background: "var(--surface-sunken, #f8fafc)", borderTop: "1px solid var(--border-subtle, #e2e8f0)" } }, /* @__PURE__ */ import_react84.default.createElement(
            "button",
            {
              type: "button",
              onClick: () => setShowTableModal(false),
              style: {
                padding: "6px 14px",
                borderRadius: "var(--radius-sm, 4px)",
                background: "var(--action-solid, #2563eb)",
                color: "#ffffff",
                border: "none",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer"
              }
            },
            "Close Table"
          ))
        )
      )
    );
  }

  // components/data/RangeChart.jsx
  var import_react85 = __toESM(require_react(), 1);
  var STATUS_COLORS = {
    nominal: "#16a34a",
    warning: "#d97706",
    critical: "#dc2626",
    info: "#2563eb",
    neutral: "#64748b"
  };
  var DUMBBELL_ENDPOINT_COLORS = {
    before: "#64748b",
    // Start / Baseline
    afterImproved: "#16a34a",
    // Target reached / Faster / Improved
    afterRegressed: "#dc2626"
    // Regressed / Slower
  };
  function RangeChart({
    data = [],
    variant = "interval-bar",
    // 'interval-bar' | 'dumbbell' | 'error-bar' | 'range-area'
    orientation = "horizontal",
    // 'horizontal' | 'vertical'
    width = 760,
    height = 420,
    title = "Bounded Interval Range Chart",
    subtitle = "Suryodaya Autocomp Ltd \xB7 Chakan Plant (PL-04)",
    lowerKey = "lower",
    upperKey = "upper",
    centerKey = "center",
    targetKey = "target",
    categoryKey = "label",
    unit = "",
    targetLine = null,
    // e.g. 500 or { value: 500, label: 'Nominal Target' }
    showCenterEstimate = true,
    showDirectLabels = true,
    showControls = true,
    showSearch = true,
    interactive = true,
    className = "",
    onItemClick = null
  }) {
    const [selectedId, setSelectedId] = (0, import_react85.useState)(null);
    const [hoveredItem, setHoveredItem] = (0, import_react85.useState)(null);
    const [tooltipPos, setTooltipPos] = (0, import_react85.useState)({ x: 0, y: 0 });
    const [sortBy, setSortBy] = (0, import_react85.useState)("default");
    const [searchQuery, setSearchQuery] = (0, import_react85.useState)("");
    const [isTableModalOpen, setIsTableModalOpen] = (0, import_react85.useState)(false);
    const svgRef = (0, import_react85.useRef)(null);
    (0, import_react85.useEffect)(() => {
      const handleKeyDown = (e) => {
        if (e.altKey && (e.key === "F11" || e.keyCode === 122)) {
          e.preventDefault();
          setIsTableModalOpen((prev) => !prev);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    const filteredData = (0, import_react85.useMemo)(() => {
      if (!searchQuery.trim()) return data;
      const q = searchQuery.toLowerCase().trim();
      return data.filter((d) => {
        const label = String(d[categoryKey] || d.id || "").toLowerCase();
        const semantics = String(d.intervalSemantics || d.category || "").toLowerCase();
        return label.includes(q) || semantics.includes(q);
      });
    }, [data, searchQuery, categoryKey]);
    const sortedData = (0, import_react85.useMemo)(() => {
      if (variant === "range-area" || sortBy === "default") return filteredData;
      const list = [...filteredData];
      return list.sort((a, b) => {
        const lowA = Number(a[lowerKey] ?? 0);
        const lowB = Number(b[lowerKey] ?? 0);
        const upA = Number(a[upperKey] ?? 0);
        const upB = Number(b[upperKey] ?? 0);
        const spreadA = Math.abs(upA - lowA);
        const spreadB = Math.abs(upB - lowB);
        if (sortBy === "spread-desc") return spreadB - spreadA;
        if (sortBy === "spread-asc") return spreadA - spreadB;
        if (sortBy === "lower-asc") return lowA - lowB;
        if (sortBy === "upper-desc") return upB - upA;
        if (sortBy === "label-asc") return String(a[categoryKey] || "").localeCompare(String(b[categoryKey] || ""));
        return 0;
      });
    }, [filteredData, sortBy, lowerKey, upperKey, categoryKey, variant]);
    const margin = (0, import_react85.useMemo)(() => {
      if (orientation === "horizontal") {
        return { top: 28, right: 48, bottom: 44, left: 160 };
      }
      return { top: 28, right: 32, bottom: 64, left: 60 };
    }, [orientation]);
    const innerWidth = Math.max(100, width - margin.left - margin.right);
    const innerHeight = Math.max(100, height - margin.top - margin.bottom);
    const { domainMin, domainMax, domainSpan } = (0, import_react85.useMemo)(() => {
      if (!sortedData || sortedData.length === 0) {
        return { domainMin: 0, domainMax: 100, domainSpan: 100 };
      }
      let min = Infinity;
      let max = -Infinity;
      sortedData.forEach((d) => {
        const l = d[lowerKey] != null ? Number(d[lowerKey]) : null;
        const u = d[upperKey] != null ? Number(d[upperKey]) : null;
        const c = d[centerKey] != null ? Number(d[centerKey]) : null;
        const t = d[targetKey] != null ? Number(d[targetKey]) : null;
        if (l != null && !isNaN(l) && l < min) min = l;
        if (u != null && !isNaN(u) && u > max) max = u;
        if (c != null && !isNaN(c)) {
          if (c < min) min = c;
          if (c > max) max = c;
        }
        if (t != null && !isNaN(t)) {
          if (t < min) min = t;
          if (t > max) max = t;
        }
      });
      if (targetLine != null) {
        const tVal = typeof targetLine === "number" ? targetLine : targetLine.value;
        if (tVal != null && !isNaN(tVal)) {
          if (tVal < min) min = tVal;
          if (tVal > max) max = tVal;
        }
      }
      if (min === Infinity || max === -Infinity) {
        return { domainMin: 0, domainMax: 100, domainSpan: 100 };
      }
      const span = max - min || 1;
      const pad2 = span * 0.08;
      return {
        domainMin: min - pad2,
        domainMax: max + pad2,
        domainSpan: max + pad2 - (min - pad2)
      };
    }, [sortedData, lowerKey, upperKey, centerKey, targetKey, targetLine]);
    const valToX = (0, import_react85.useCallback)((val) => {
      if (val == null || isNaN(val)) return 0;
      return (val - domainMin) / domainSpan * innerWidth;
    }, [domainMin, domainSpan, innerWidth]);
    const valToY = (0, import_react85.useCallback)((val) => {
      if (val == null || isNaN(val)) return innerHeight;
      return innerHeight - (val - domainMin) / domainSpan * innerHeight;
    }, [domainMin, domainSpan, innerHeight]);
    const quantTicks = (0, import_react85.useMemo)(() => {
      const count = 5;
      const ticks = [];
      for (let i = 0; i <= count; i++) {
        const val = domainMin + domainSpan * (i / count);
        ticks.push(val);
      }
      return ticks;
    }, [domainMin, domainSpan]);
    const rangeAreaPaths = (0, import_react85.useMemo)(() => {
      if (variant !== "range-area" || sortedData.length === 0) return null;
      const n = sortedData.length;
      const stepX = n > 1 ? innerWidth / (n - 1) : innerWidth / 2;
      const upperCoords = [];
      const lowerCoords = [];
      const centerCoords = [];
      sortedData.forEach((d, i) => {
        const x = i * stepX;
        const up = Number(d[upperKey] ?? 0);
        const low = Number(d[lowerKey] ?? 0);
        const cent = d[centerKey] != null ? Number(d[centerKey]) : (low + up) / 2;
        const yUp = valToY(up);
        const yLow = valToY(low);
        const yCent = valToY(cent);
        upperCoords.push([x, yUp]);
        lowerCoords.unshift([x, yLow]);
        centerCoords.push([x, yCent]);
      });
      let bandPath = `M ${upperCoords[0][0]} ${upperCoords[0][1]}`;
      for (let i = 1; i < upperCoords.length; i++) {
        bandPath += ` L ${upperCoords[i][0]} ${upperCoords[i][1]}`;
      }
      for (let i = 0; i < lowerCoords.length; i++) {
        bandPath += ` L ${lowerCoords[i][0]} ${lowerCoords[i][1]}`;
      }
      bandPath += " Z";
      let centerLinePath = `M ${centerCoords[0][0]} ${centerCoords[0][1]}`;
      for (let i = 1; i < centerCoords.length; i++) {
        centerLinePath += ` L ${centerCoords[i][0]} ${centerCoords[i][1]}`;
      }
      return { bandPath, centerLinePath, centerCoords };
    }, [variant, sortedData, upperKey, lowerKey, centerKey, innerWidth, valToY]);
    const rowCount = Math.max(1, sortedData.length);
    const rowHeight = innerHeight / rowCount;
    const barThickness = Math.max(6, Math.min(24, rowHeight * 0.45));
    return /* @__PURE__ */ import_react85.default.createElement(
      "div",
      {
        className: `range-chart-container ${className}`,
        style: {
          position: "relative",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "16px 20px",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }
      },
      /* @__PURE__ */ import_react85.default.createElement("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 12
      } }, /* @__PURE__ */ import_react85.default.createElement("div", null, /* @__PURE__ */ import_react85.default.createElement("div", { style: { fontWeight: 700, fontSize: 15, color: "#0f172a" } }, title), /* @__PURE__ */ import_react85.default.createElement("div", { style: { fontSize: 12, color: "#64748b", marginTop: 2 } }, subtitle)), showControls && /* @__PURE__ */ import_react85.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } }, showSearch && /* @__PURE__ */ import_react85.default.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ import_react85.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Filter category...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          style: {
            padding: "4px 10px",
            fontSize: 12,
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            outline: "none",
            width: 150
          }
        }
      ), searchQuery && /* @__PURE__ */ import_react85.default.createElement(
        "button",
        {
          onClick: () => setSearchQuery(""),
          style: {
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: 11
          }
        },
        "\u2715"
      )), variant !== "range-area" && /* @__PURE__ */ import_react85.default.createElement(
        "select",
        {
          value: sortBy,
          onChange: (e) => setSortBy(e.target.value),
          style: {
            padding: "4px 8px",
            fontSize: 12,
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            background: "#ffffff",
            color: "#334155",
            cursor: "pointer"
          }
        },
        /* @__PURE__ */ import_react85.default.createElement("option", { value: "default" }, "Default Order"),
        /* @__PURE__ */ import_react85.default.createElement("option", { value: "spread-desc" }, "Spread (High \u2192 Low)"),
        /* @__PURE__ */ import_react85.default.createElement("option", { value: "spread-asc" }, "Spread (Low \u2192 High)"),
        /* @__PURE__ */ import_react85.default.createElement("option", { value: "lower-asc" }, "Lower Bound (Ascending)"),
        /* @__PURE__ */ import_react85.default.createElement("option", { value: "upper-desc" }, "Upper Bound (Descending)"),
        /* @__PURE__ */ import_react85.default.createElement("option", { value: "label-asc" }, "Category Name (A \u2192 Z)")
      ), /* @__PURE__ */ import_react85.default.createElement(
        "button",
        {
          onClick: () => setIsTableModalOpen(true),
          title: "Accessible Table Modal (Alt + F11)",
          style: {
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            background: "#f8fafc",
            color: "#0284c7",
            cursor: "pointer"
          }
        },
        "\u{1F4CA} Table View"
      ))),
      /* @__PURE__ */ import_react85.default.createElement("div", { style: { position: "relative", width: "100%", overflowX: "auto" } }, /* @__PURE__ */ import_react85.default.createElement(
        "svg",
        {
          ref: svgRef,
          width,
          height,
          viewBox: `0 0 ${width} ${height}`,
          style: { display: "block", margin: "0 auto" }
        },
        /* @__PURE__ */ import_react85.default.createElement("defs", null, /* @__PURE__ */ import_react85.default.createElement("pattern", { id: "rc-hatch-warning", width: "8", height: "8", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, /* @__PURE__ */ import_react85.default.createElement("line", { x1: "0", y1: "0", x2: "0", y2: "8", stroke: "#d97706", strokeWidth: "2", opacity: "0.35" })), /* @__PURE__ */ import_react85.default.createElement("pattern", { id: "rc-hatch-critical", width: "8", height: "8", patternUnits: "userSpaceOnUse", patternTransform: "rotate(-45)" }, /* @__PURE__ */ import_react85.default.createElement("line", { x1: "0", y1: "0", x2: "0", y2: "8", stroke: "#dc2626", strokeWidth: "2", opacity: "0.4" })), /* @__PURE__ */ import_react85.default.createElement("filter", { id: "rc-glow", x: "-20%", y: "-20%", width: "140%", height: "140%" }, /* @__PURE__ */ import_react85.default.createElement("feDropShadow", { dx: "0", dy: "1", stdDeviation: "2", floodOpacity: "0.15" }))),
        /* @__PURE__ */ import_react85.default.createElement("g", { transform: `translate(${margin.left}, ${margin.top})` }, orientation === "horizontal" ? /* @__PURE__ */ import_react85.default.createElement("g", { className: "grid-quantitative-x" }, quantTicks.map((val, idx) => {
          const x = valToX(val);
          return /* @__PURE__ */ import_react85.default.createElement("g", { key: idx, transform: `translate(${x}, 0)` }, /* @__PURE__ */ import_react85.default.createElement("line", { y1: "0", y2: innerHeight, stroke: "#f1f5f9", strokeWidth: "1" }), /* @__PURE__ */ import_react85.default.createElement("line", { y1: innerHeight, y2: innerHeight + 5, stroke: "#cbd5e1", strokeWidth: "1" }), /* @__PURE__ */ import_react85.default.createElement(
            "text",
            {
              y: innerHeight + 18,
              fontSize: "11",
              fill: "#64748b",
              textAnchor: "middle"
            },
            val.toLocaleString("en-IN", { maximumFractionDigits: 1 }),
            " ",
            unit
          ));
        })) : /* @__PURE__ */ import_react85.default.createElement("g", { className: "grid-quantitative-y" }, quantTicks.map((val, idx) => {
          const y = valToY(val);
          return /* @__PURE__ */ import_react85.default.createElement("g", { key: idx, transform: `translate(0, ${y})` }, /* @__PURE__ */ import_react85.default.createElement("line", { x1: "0", x2: innerWidth, stroke: "#f1f5f9", strokeWidth: "1" }), /* @__PURE__ */ import_react85.default.createElement("line", { x1: "-5", x2: "0", stroke: "#cbd5e1", strokeWidth: "1" }), /* @__PURE__ */ import_react85.default.createElement(
            "text",
            {
              x: "-10",
              y: "4",
              fontSize: "11",
              fill: "#64748b",
              textAnchor: "end"
            },
            val.toLocaleString("en-IN", { maximumFractionDigits: 1 }),
            " ",
            unit
          ));
        })), targetLine != null && (() => {
          const tVal = typeof targetLine === "number" ? targetLine : targetLine.value;
          const tLabel = typeof targetLine === "number" ? `Target: ${tVal} ${unit}` : targetLine.label || `Target: ${tVal} ${unit}`;
          if (tVal == null || isNaN(tVal)) return null;
          if (orientation === "horizontal") {
            const tx = valToX(tVal);
            return /* @__PURE__ */ import_react85.default.createElement("g", { className: "target-baseline", transform: `translate(${tx}, 0)` }, /* @__PURE__ */ import_react85.default.createElement("line", { y1: "-8", y2: innerHeight, stroke: "#dc2626", strokeWidth: "1.5", strokeDasharray: "4,3" }), /* @__PURE__ */ import_react85.default.createElement("text", { y: "-12", fontSize: "10", fontWeight: "600", fill: "#dc2626", textAnchor: "middle" }, tLabel));
          } else {
            const ty = valToY(tVal);
            return /* @__PURE__ */ import_react85.default.createElement("g", { className: "target-baseline", transform: `translate(0, ${ty})` }, /* @__PURE__ */ import_react85.default.createElement("line", { x1: "0", x2: innerWidth + 8, stroke: "#dc2626", strokeWidth: "1.5", strokeDasharray: "4,3" }), /* @__PURE__ */ import_react85.default.createElement("text", { x: innerWidth + 12, y: "3", fontSize: "10", fontWeight: "600", fill: "#dc2626", textAnchor: "start" }, tLabel));
          }
        })(), variant === "range-area" && rangeAreaPaths && /* @__PURE__ */ import_react85.default.createElement("g", { className: "range-area-layer" }, /* @__PURE__ */ import_react85.default.createElement(
          "path",
          {
            d: rangeAreaPaths.bandPath,
            fill: "#e0f2fe",
            opacity: "0.8",
            stroke: "#38bdf8",
            strokeWidth: "1"
          }
        ), /* @__PURE__ */ import_react85.default.createElement(
          "path",
          {
            d: rangeAreaPaths.centerLinePath,
            fill: "none",
            stroke: "#0284c7",
            strokeWidth: "2.5"
          }
        ), rangeAreaPaths.centerCoords.map((pt, i) => {
          const item = sortedData[i];
          const isHovered = hoveredItem?.index === i;
          return /* @__PURE__ */ import_react85.default.createElement(
            "circle",
            {
              key: i,
              cx: pt[0],
              cy: pt[1],
              r: isHovered ? 6 : 4,
              fill: "#0284c7",
              stroke: "#ffffff",
              strokeWidth: "2",
              style: { cursor: "pointer", transition: "all 0.15s ease" },
              onMouseEnter: (e) => {
                setHoveredItem({ ...item, index: i });
                setTooltipPos({ x: e.clientX, y: e.clientY });
              },
              onMouseLeave: () => setHoveredItem(null)
            }
          );
        })), variant !== "range-area" && orientation === "horizontal" && /* @__PURE__ */ import_react85.default.createElement("g", { className: "discrete-horizontal-layer" }, sortedData.map((d, idx) => {
          const itemId = d.id || `item-${idx}`;
          const isSelected = selectedId === itemId;
          const isHovered = hoveredItem?.id === itemId;
          const low = Number(d[lowerKey] ?? 0);
          const up = Number(d[upperKey] ?? 0);
          const cent = d[centerKey] != null ? Number(d[centerKey]) : null;
          const xLow = valToX(low);
          const xUp = valToX(up);
          const xStart = Math.min(xLow, xUp);
          const barWidth = Math.max(2, Math.abs(xUp - xLow));
          const yCenter = idx * rowHeight + rowHeight / 2;
          const status = d.status || "nominal";
          const statusColor = STATUS_COLORS[status];
          return /* @__PURE__ */ import_react85.default.createElement(
            "g",
            {
              key: itemId,
              className: "range-row-horizontal",
              style: { cursor: "pointer" },
              onMouseEnter: (e) => {
                setHoveredItem(d);
                setTooltipPos({ x: e.clientX, y: e.clientY });
              },
              onMouseLeave: () => setHoveredItem(null),
              onClick: (e) => {
                setSelectedId(itemId);
                if (onItemClick) onItemClick(d, e);
              }
            },
            /* @__PURE__ */ import_react85.default.createElement(
              "rect",
              {
                x: -margin.left + 8,
                y: idx * rowHeight + 2,
                width: width - 24,
                height: rowHeight - 4,
                fill: isSelected ? "#eff6ff" : isHovered ? "#f8fafc" : "transparent",
                rx: "4"
              }
            ),
            /* @__PURE__ */ import_react85.default.createElement(
              "text",
              {
                x: "-12",
                y: yCenter + 4,
                fontSize: "12",
                fontWeight: isSelected || isHovered ? 600 : 400,
                fill: isSelected ? "#0284c7" : "#1e293b",
                textAnchor: "end"
              },
              d[categoryKey] || `Item ${idx + 1}`
            ),
            variant === "interval-bar" && /* @__PURE__ */ import_react85.default.createElement("g", null, /* @__PURE__ */ import_react85.default.createElement(
              "rect",
              {
                x: xStart,
                y: yCenter - barThickness / 2,
                width: barWidth,
                height: barThickness,
                rx: barThickness / 3,
                fill: status === "critical" ? "url(#rc-hatch-critical)" : status === "warning" ? "url(#rc-hatch-warning)" : statusColor,
                stroke: statusColor,
                strokeWidth: isSelected ? 2 : 1,
                opacity: isHovered ? 1 : 0.85,
                filter: "url(#rc-glow)"
              }
            ), showCenterEstimate && cent != null && /* @__PURE__ */ import_react85.default.createElement(
              "line",
              {
                x1: valToX(cent),
                x2: valToX(cent),
                y1: yCenter - barThickness / 2 - 2,
                y2: yCenter + barThickness / 2 + 2,
                stroke: "#0f172a",
                strokeWidth: "2.5"
              }
            ), showDirectLabels && /* @__PURE__ */ import_react85.default.createElement("g", { fontSize: "10", fill: "#64748b" }, /* @__PURE__ */ import_react85.default.createElement("text", { x: xStart - 5, y: yCenter + 3, textAnchor: "end" }, low), /* @__PURE__ */ import_react85.default.createElement("text", { x: xStart + barWidth + 5, y: yCenter + 3, textAnchor: "start" }, up))),
            variant === "dumbbell" && (() => {
              const isImproved = d.isImproved ?? up <= low;
              const endpointEndColor = isImproved ? DUMBBELL_ENDPOINT_COLORS.afterImproved : DUMBBELL_ENDPOINT_COLORS.afterRegressed;
              return /* @__PURE__ */ import_react85.default.createElement("g", null, /* @__PURE__ */ import_react85.default.createElement(
                "line",
                {
                  x1: xLow,
                  x2: xUp,
                  y1: yCenter,
                  y2: yCenter,
                  stroke: "#94a3b8",
                  strokeWidth: isSelected ? 3 : 2,
                  strokeDasharray: d.dashed ? "3,2" : void 0
                }
              ), /* @__PURE__ */ import_react85.default.createElement(
                "circle",
                {
                  cx: xLow,
                  cy: yCenter,
                  r: "6",
                  fill: DUMBBELL_ENDPOINT_COLORS.before,
                  stroke: "#ffffff",
                  strokeWidth: "1.5"
                }
              ), /* @__PURE__ */ import_react85.default.createElement(
                "circle",
                {
                  cx: xUp,
                  cy: yCenter,
                  r: "7",
                  fill: endpointEndColor,
                  stroke: "#ffffff",
                  strokeWidth: "2",
                  filter: "url(#rc-glow)"
                }
              ), showDirectLabels && /* @__PURE__ */ import_react85.default.createElement("g", { fontSize: "10", fontWeight: "600" }, /* @__PURE__ */ import_react85.default.createElement("text", { x: xLow, y: yCenter - 9, textAnchor: "middle", fill: "#64748b" }, low), /* @__PURE__ */ import_react85.default.createElement("text", { x: xUp, y: yCenter - 9, textAnchor: "middle", fill: endpointEndColor }, up)));
            })(),
            variant === "error-bar" && (() => {
              const cVal = cent != null ? cent : (low + up) / 2;
              const xCent = valToX(cVal);
              return /* @__PURE__ */ import_react85.default.createElement("g", null, /* @__PURE__ */ import_react85.default.createElement(
                "line",
                {
                  x1: xLow,
                  x2: xUp,
                  y1: yCenter,
                  y2: yCenter,
                  stroke: "#334155",
                  strokeWidth: "1.5"
                }
              ), /* @__PURE__ */ import_react85.default.createElement(
                "line",
                {
                  x1: xLow,
                  x2: xLow,
                  y1: yCenter - 5,
                  y2: yCenter + 5,
                  stroke: "#334155",
                  strokeWidth: "1.5"
                }
              ), /* @__PURE__ */ import_react85.default.createElement(
                "line",
                {
                  x1: xUp,
                  x2: xUp,
                  y1: yCenter - 5,
                  y2: yCenter + 5,
                  stroke: "#334155",
                  strokeWidth: "1.5"
                }
              ), /* @__PURE__ */ import_react85.default.createElement(
                "circle",
                {
                  cx: xCent,
                  cy: yCenter,
                  r: "5",
                  fill: statusColor,
                  stroke: "#ffffff",
                  strokeWidth: "1.5"
                }
              ));
            })()
          );
        })))
      ), hoveredItem && /* @__PURE__ */ import_react85.default.createElement("div", { style: {
        position: "fixed",
        left: tooltipPos.x + 14,
        top: tooltipPos.y + 14,
        background: "#0f172a",
        color: "#ffffff",
        padding: "10px 14px",
        borderRadius: 6,
        fontSize: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        pointerEvents: "none",
        zIndex: 100,
        maxWidth: 260
      } }, /* @__PURE__ */ import_react85.default.createElement("div", { style: { fontWeight: 700, fontSize: 13, marginBottom: 4 } }, hoveredItem[categoryKey] || hoveredItem.label || hoveredItem.id), hoveredItem.intervalSemantics && /* @__PURE__ */ import_react85.default.createElement("div", { style: { color: "#94a3b8", fontSize: 11, marginBottom: 6 } }, "Construct: ", /* @__PURE__ */ import_react85.default.createElement("strong", null, hoveredItem.intervalSemantics)), /* @__PURE__ */ import_react85.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "auto auto", gap: "4px 12px", fontSize: 11 } }, /* @__PURE__ */ import_react85.default.createElement("span", { style: { color: "#cbd5e1" } }, "Lower Bound:"), /* @__PURE__ */ import_react85.default.createElement("span", { style: { fontWeight: 600, textAlign: "right" } }, hoveredItem[lowerKey], " ", unit), /* @__PURE__ */ import_react85.default.createElement("span", { style: { color: "#cbd5e1" } }, "Upper Bound:"), /* @__PURE__ */ import_react85.default.createElement("span", { style: { fontWeight: 600, textAlign: "right" } }, hoveredItem[upperKey], " ", unit), hoveredItem[centerKey] != null && /* @__PURE__ */ import_react85.default.createElement(import_react85.default.Fragment, null, /* @__PURE__ */ import_react85.default.createElement("span", { style: { color: "#38bdf8" } }, "Center Estimate:"), /* @__PURE__ */ import_react85.default.createElement("span", { style: { fontWeight: 600, textAlign: "right", color: "#38bdf8" } }, hoveredItem[centerKey], " ", unit)), /* @__PURE__ */ import_react85.default.createElement("span", { style: { color: "#cbd5e1" } }, "Spread (Span):"), /* @__PURE__ */ import_react85.default.createElement("span", { style: { fontWeight: 600, textAlign: "right" } }, Math.abs(Number(hoveredItem[upperKey]) - Number(hoveredItem[lowerKey])).toLocaleString("en-IN", { maximumFractionDigits: 2 }), " ", unit), variant === "dumbbell" && /* @__PURE__ */ import_react85.default.createElement(import_react85.default.Fragment, null, /* @__PURE__ */ import_react85.default.createElement("span", { style: { color: "#fcd34d" } }, "Delta (Change):"), /* @__PURE__ */ import_react85.default.createElement("span", { style: { fontWeight: 600, textAlign: "right", color: "#fcd34d" } }, (Number(hoveredItem[upperKey]) - Number(hoveredItem[lowerKey])).toFixed(1), " ", unit))), hoveredItem.status && /* @__PURE__ */ import_react85.default.createElement("div", { style: { marginTop: 6, fontSize: 11, color: STATUS_COLORS[hoveredItem.status] } }, "\u25CF Status: ", hoveredItem.status.toUpperCase()))),
      isTableModalOpen && /* @__PURE__ */ import_react85.default.createElement("div", { style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999
      } }, /* @__PURE__ */ import_react85.default.createElement("div", { style: {
        background: "#ffffff",
        borderRadius: 8,
        width: "90%",
        maxWidth: 720,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25)"
      } }, /* @__PURE__ */ import_react85.default.createElement("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid #e2e8f0"
      } }, /* @__PURE__ */ import_react85.default.createElement("h3", { style: { margin: 0, fontSize: 16, color: "#0f172a" } }, "Accessible Range & Interval Data Table"), /* @__PURE__ */ import_react85.default.createElement(
        "button",
        {
          onClick: () => setIsTableModalOpen(false),
          style: { border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#64748b" }
        },
        "\u2715"
      )), /* @__PURE__ */ import_react85.default.createElement("div", { style: { padding: 20, overflowY: "auto", flex: 1 } }, /* @__PURE__ */ import_react85.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ import_react85.default.createElement("thead", null, /* @__PURE__ */ import_react85.default.createElement("tr", { style: { background: "#f8fafc", borderBottom: "1px solid #cbd5e1", textAlign: "left" } }, /* @__PURE__ */ import_react85.default.createElement("th", { style: { padding: "8px 10px" } }, "Category / Item"), /* @__PURE__ */ import_react85.default.createElement("th", { style: { padding: "8px 10px" } }, "Interval Semantics"), /* @__PURE__ */ import_react85.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right" } }, "Lower Limit"), /* @__PURE__ */ import_react85.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right" } }, "Center Estimate"), /* @__PURE__ */ import_react85.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right" } }, "Upper Limit"), /* @__PURE__ */ import_react85.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right" } }, "Spread (Interval)"), /* @__PURE__ */ import_react85.default.createElement("th", { style: { padding: "8px 10px" } }, "Status"))), /* @__PURE__ */ import_react85.default.createElement("tbody", null, sortedData.map((d, i) => {
        const low = Number(d[lowerKey] ?? 0);
        const up = Number(d[upperKey] ?? 0);
        const cent = d[centerKey] != null ? Number(d[centerKey]) : null;
        const spread = Math.abs(up - low);
        return /* @__PURE__ */ import_react85.default.createElement("tr", { key: i, style: { borderBottom: "1px solid #f1f5f9" } }, /* @__PURE__ */ import_react85.default.createElement("td", { style: { padding: "8px 10px", fontWeight: 600 } }, d[categoryKey] || `Item ${i + 1}`), /* @__PURE__ */ import_react85.default.createElement("td", { style: { padding: "8px 10px", color: "#64748b" } }, d.intervalSemantics || "Bounded Range"), /* @__PURE__ */ import_react85.default.createElement("td", { style: { padding: "8px 10px", textAlign: "right" } }, low.toLocaleString("en-IN"), " ", unit), /* @__PURE__ */ import_react85.default.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "#0284c7" } }, cent != null ? `${cent.toLocaleString("en-IN")} ${unit}` : "\u2014"), /* @__PURE__ */ import_react85.default.createElement("td", { style: { padding: "8px 10px", textAlign: "right" } }, up.toLocaleString("en-IN"), " ", unit), /* @__PURE__ */ import_react85.default.createElement("td", { style: { padding: "8px 10px", textAlign: "right", fontWeight: 600 } }, spread.toLocaleString("en-IN", { maximumFractionDigits: 2 }), " ", unit), /* @__PURE__ */ import_react85.default.createElement("td", { style: { padding: "8px 10px", color: STATUS_COLORS[d.status || "nominal"], fontWeight: 600 } }, (d.status || "nominal").toUpperCase()));
      }))))))
    );
  }

  // components/data/GanttChart.jsx
  var import_react86 = __toESM(require_react(), 1);
  var STATUS_COLORS2 = {
    nominal: "#16a34a",
    completed: "#16a34a",
    "in-progress": "#2563eb",
    warning: "#d97706",
    critical: "#dc2626",
    overdue: "#dc2626",
    scheduled: "#64748b"
  };
  function GanttChart({
    tasks = [],
    variant = "dependency",
    // 'basic' | 'progress' | 'dependency' | 'milestone' | 'grouped'
    width = 900,
    height = 460,
    title = "Project & Maintenance Schedule Gantt Chart",
    subtitle = "Suryodaya Autocomp Ltd \xB7 Chakan Plant (PL-04)",
    startKey = "startDate",
    endKey = "endDate",
    progressKey = "progress",
    dependenciesKey = "dependencies",
    groupKey = "group",
    showDependencies = true,
    showProgress = true,
    showTodayLine = true,
    todayDate = /* @__PURE__ */ new Date("2026-09-09"),
    showControls = true,
    showSearch = true,
    defaultZoom = "day",
    // 'day' | 'week' | 'month'
    className = "",
    onTaskClick = null
  }) {
    const [zoomLevel, setZoomLevel] = (0, import_react86.useState)(defaultZoom);
    const [searchQuery, setSearchQuery] = (0, import_react86.useState)("");
    const [selectedTaskId, setSelectedTaskId] = (0, import_react86.useState)(null);
    const [hoveredTask, setHoveredTask] = (0, import_react86.useState)(null);
    const [tooltipPos, setTooltipPos] = (0, import_react86.useState)({ x: 0, y: 0 });
    const [collapsedGroups, setCollapsedGroups] = (0, import_react86.useState)({});
    const [isTableModalOpen, setIsTableModalOpen] = (0, import_react86.useState)(false);
    const tableRef = (0, import_react86.useRef)(null);
    const timelineRef = (0, import_react86.useRef)(null);
    (0, import_react86.useEffect)(() => {
      const handleKeyDown = (e) => {
        if (e.altKey && (e.key === "F11" || e.keyCode === 122)) {
          e.preventDefault();
          setIsTableModalOpen((prev) => !prev);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    const filteredTasks = (0, import_react86.useMemo)(() => {
      if (!searchQuery.trim()) return tasks;
      const q = searchQuery.toLowerCase().trim();
      return tasks.filter(
        (t) => t.name && t.name.toLowerCase().includes(q) || t.id && t.id.toLowerCase().includes(q) || t.owner && t.owner.toLowerCase().includes(q) || t[groupKey] && t[groupKey].toLowerCase().includes(q)
      );
    }, [tasks, searchQuery, groupKey]);
    const visibleTasks = (0, import_react86.useMemo)(() => {
      const list = [];
      filteredTasks.forEach((t) => {
        const grp = t[groupKey];
        if (grp && collapsedGroups[grp]) {
          return;
        }
        list.push(t);
      });
      return list;
    }, [filteredTasks, groupKey, collapsedGroups]);
    const { minDate, maxDate, durationMs, totalDays } = (0, import_react86.useMemo)(() => {
      if (!tasks || tasks.length === 0) {
        const now = (/* @__PURE__ */ new Date("2026-09-01")).getTime();
        return {
          minDate: new Date(now),
          maxDate: new Date(now + 30 * 864e5),
          durationMs: 30 * 864e5,
          totalDays: 30
        };
      }
      let minTime = Infinity;
      let maxTime = -Infinity;
      tasks.forEach((t) => {
        const s = t[startKey] ? new Date(t[startKey]).getTime() : null;
        const e = t[endKey] ? new Date(t[endKey]).getTime() : t.milestoneDate ? new Date(t.milestoneDate).getTime() : s;
        if (s != null && !isNaN(s) && s < minTime) minTime = s;
        if (e != null && !isNaN(e) && e > maxTime) maxTime = e;
      });
      if (minTime === Infinity || maxTime === -Infinity) {
        const now = (/* @__PURE__ */ new Date("2026-09-01")).getTime();
        return { minDate: new Date(now), maxDate: new Date(now + 30 * 864e5), durationMs: 30 * 864e5, totalDays: 30 };
      }
      const padMs = 2 * 864e5;
      const pMin = new Date(minTime - padMs);
      const pMax = new Date(maxTime + padMs);
      const dur = pMax.getTime() - pMin.getTime() || 864e5;
      return {
        minDate: pMin,
        maxDate: pMax,
        durationMs: dur,
        totalDays: Math.ceil(dur / 864e5)
      };
    }, [tasks, startKey, endKey]);
    const dayColumnWidth = zoomLevel === "day" ? 36 : zoomLevel === "week" ? 14 : 4;
    const timelineContentWidth = Math.max(width - 280, totalDays * dayColumnWidth);
    const timeToX = (0, import_react86.useCallback)((dateStrOrTime) => {
      if (!dateStrOrTime) return 0;
      const t = typeof dateStrOrTime === "number" ? dateStrOrTime : new Date(dateStrOrTime).getTime();
      const ratio = (t - minDate.getTime()) / durationMs;
      return Math.max(0, ratio * timelineContentWidth);
    }, [minDate, durationMs, timelineContentWidth]);
    const timeTicks = (0, import_react86.useMemo)(() => {
      const startMs = minDate.getTime();
      const endMs = maxDate.getTime();
      const ticks = [];
      const curr = new Date(startMs);
      curr.setHours(0, 0, 0, 0);
      while (curr.getTime() <= endMs) {
        const time = curr.getTime();
        if (zoomLevel === "day") {
          const label = curr.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
          const weekday = curr.toLocaleDateString("en-IN", { weekday: "narrow" });
          const isWeekend = curr.getDay() === 0 || curr.getDay() === 6;
          ticks.push({ time, label, secondary: weekday, isWeekend });
          curr.setDate(curr.getDate() + 1);
        } else if (zoomLevel === "week") {
          const label = `Wk ${Math.ceil(curr.getDate() / 7)} (${curr.toLocaleDateString("en-IN", { month: "short" })})`;
          const secondary = curr.toLocaleDateString("en-IN", { day: "2-digit" });
          ticks.push({ time, label, secondary, isWeekend: false });
          curr.setDate(curr.getDate() + 7);
        } else {
          const label = curr.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
          ticks.push({ time, label, secondary: "", isWeekend: false });
          curr.setMonth(curr.getMonth() + 1);
        }
      }
      return ticks;
    }, [minDate, maxDate, zoomLevel]);
    const rowHeight = 36;
    const headerHeight = 44;
    const taskBarHeight = 20;
    const taskIndexMap = (0, import_react86.useMemo)(() => {
      const map = {};
      visibleTasks.forEach((t, i) => {
        map[t.id] = i;
      });
      return map;
    }, [visibleTasks]);
    const dependencyLinks = (0, import_react86.useMemo)(() => {
      if (!showDependencies && variant !== "dependency") return [];
      const links = [];
      visibleTasks.forEach((targetTask, targetIdx) => {
        const predecessors = targetTask[dependenciesKey] || [];
        predecessors.forEach((predId) => {
          const sourceIdx = taskIndexMap[predId];
          if (sourceIdx !== void 0) {
            const sourceTask = visibleTasks[sourceIdx];
            const sEnd = sourceTask[endKey] || sourceTask.milestoneDate || sourceTask[startKey];
            const tStart = targetTask[startKey] || targetTask.milestoneDate;
            const sourceX = timeToX(sEnd);
            const sourceY = sourceIdx * rowHeight + rowHeight / 2;
            const targetX = timeToX(tStart);
            const targetY = targetIdx * rowHeight + rowHeight / 2;
            const isTargetRight = targetX >= sourceX + 16;
            let path = "";
            if (isTargetRight) {
              const midX = sourceX + 12;
              path = `M ${sourceX} ${sourceY} L ${midX} ${sourceY} L ${midX} ${targetY} L ${targetX} ${targetY}`;
            } else {
              const midY = (sourceY + targetY) / 2;
              const rightX = sourceX + 12;
              const leftX = targetX - 12;
              path = `M ${sourceX} ${sourceY} L ${rightX} ${sourceY} L ${rightX} ${midY} L ${leftX} ${midY} L ${leftX} ${targetY} L ${targetX} ${targetY}`;
            }
            links.push({
              id: `${predId}->${targetTask.id}`,
              sourceId: predId,
              targetId: targetTask.id,
              path,
              isCritical: targetTask.isCritical || sourceTask.isCritical
            });
          }
        });
      });
      return links;
    }, [visibleTasks, taskIndexMap, dependenciesKey, showDependencies, variant, endKey, startKey, timeToX]);
    const handleTableScroll = (e) => {
      if (timelineRef.current && e.target === tableRef.current) {
        timelineRef.current.scrollTop = e.target.scrollTop;
      }
    };
    const handleTimelineScroll = (e) => {
      if (tableRef.current && e.target === timelineRef.current) {
        tableRef.current.scrollTop = e.target.scrollTop;
      }
    };
    const toggleGroup = (grp) => {
      setCollapsedGroups((prev) => ({ ...prev, [grp]: !prev[grp] }));
    };
    const todayX = timeToX(todayDate);
    return /* @__PURE__ */ import_react86.default.createElement(
      "div",
      {
        className: `gantt-chart-container ${className}`,
        style: {
          position: "relative",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "16px 20px",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }
      },
      /* @__PURE__ */ import_react86.default.createElement("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 12
      } }, /* @__PURE__ */ import_react86.default.createElement("div", null, /* @__PURE__ */ import_react86.default.createElement("div", { style: { fontWeight: 700, fontSize: 15, color: "#0f172a" } }, title), /* @__PURE__ */ import_react86.default.createElement("div", { style: { fontSize: 12, color: "#64748b", marginTop: 2 } }, subtitle)), showControls && /* @__PURE__ */ import_react86.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } }, showSearch && /* @__PURE__ */ import_react86.default.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ import_react86.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Filter task, owner, group...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          style: {
            padding: "4px 10px",
            fontSize: 12,
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            outline: "none",
            width: 170
          }
        }
      ), searchQuery && /* @__PURE__ */ import_react86.default.createElement(
        "button",
        {
          onClick: () => setSearchQuery(""),
          style: {
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: 11
          }
        },
        "\u2715"
      )), /* @__PURE__ */ import_react86.default.createElement("div", { style: { display: "flex", border: "1px solid #cbd5e1", borderRadius: 4, overflow: "hidden" } }, ["day", "week", "month"].map((z) => /* @__PURE__ */ import_react86.default.createElement(
        "button",
        {
          key: z,
          onClick: () => setZoomLevel(z),
          style: {
            padding: "4px 10px",
            fontSize: 11,
            border: "none",
            background: zoomLevel === z ? "#0284c7" : "#ffffff",
            color: zoomLevel === z ? "#ffffff" : "#334155",
            cursor: "pointer",
            textTransform: "capitalize"
          }
        },
        z
      ))), /* @__PURE__ */ import_react86.default.createElement(
        "button",
        {
          onClick: () => setIsTableModalOpen(true),
          title: "Accessible Table Modal (Alt + F11)",
          style: {
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            background: "#f8fafc",
            color: "#0284c7",
            cursor: "pointer"
          }
        },
        "\u{1F4CA} Table View"
      ))),
      /* @__PURE__ */ import_react86.default.createElement("div", { style: {
        display: "flex",
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        overflow: "hidden",
        height: height - 80
      } }, /* @__PURE__ */ import_react86.default.createElement(
        "div",
        {
          ref: tableRef,
          onScroll: handleTableScroll,
          style: {
            width: 280,
            minWidth: 280,
            borderRight: "1px solid #e2e8f0",
            background: "#ffffff",
            overflowY: "auto",
            overflowX: "hidden"
          }
        },
        /* @__PURE__ */ import_react86.default.createElement("div", { style: {
          height: headerHeight,
          display: "flex",
          alignItems: "center",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 12px",
          fontSize: 11,
          fontWeight: 700,
          color: "#475569",
          position: "sticky",
          top: 0,
          zIndex: 10
        } }, /* @__PURE__ */ import_react86.default.createElement("div", { style: { flex: 1 } }, "Task / Work Order"), /* @__PURE__ */ import_react86.default.createElement("div", { style: { width: 45, textAlign: "right" } }, "Prog.")),
        visibleTasks.map((t, idx) => {
          const isSelected = selectedTaskId === t.id;
          const isHovered = hoveredTask?.id === t.id;
          const progress = t[progressKey] ?? 0;
          const status = t.status || (progress === 100 ? "completed" : "in-progress");
          return /* @__PURE__ */ import_react86.default.createElement(
            "div",
            {
              key: t.id,
              onClick: (e) => {
                setSelectedTaskId(t.id);
                if (onTaskClick) onTaskClick(t, e);
              },
              onMouseEnter: (e) => {
                setHoveredTask(t);
                setTooltipPos({ x: e.clientX, y: e.clientY });
              },
              onMouseLeave: () => setHoveredTask(null),
              style: {
                height: rowHeight,
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                fontSize: 12,
                borderBottom: "1px solid #f1f5f9",
                background: isSelected ? "#eff6ff" : isHovered ? "#f8fafc" : "#ffffff",
                cursor: "pointer",
                transition: "background 0.1s ease"
              }
            },
            /* @__PURE__ */ import_react86.default.createElement("div", { style: { flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, /* @__PURE__ */ import_react86.default.createElement("span", { style: { fontWeight: isSelected ? 600 : 400, color: isSelected ? "#0284c7" : "#0f172a" } }, t.isMilestone ? "\u25C6 " : "", t.name), t.owner && /* @__PURE__ */ import_react86.default.createElement("span", { style: { fontSize: 10, color: "#94a3b8", marginLeft: 6 } }, "(", t.owner, ")")),
            /* @__PURE__ */ import_react86.default.createElement("div", { style: { width: 45, textAlign: "right", fontSize: 11, fontWeight: 600, color: STATUS_COLORS2[status] } }, t.isMilestone ? "\u2014" : `${progress}%`)
          );
        })
      ), /* @__PURE__ */ import_react86.default.createElement(
        "div",
        {
          ref: timelineRef,
          onScroll: handleTimelineScroll,
          style: {
            flex: 1,
            overflowX: "auto",
            overflowY: "auto",
            background: "#ffffff",
            position: "relative"
          }
        },
        /* @__PURE__ */ import_react86.default.createElement("div", { style: {
          display: "flex",
          height: headerHeight,
          position: "sticky",
          top: 0,
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          zIndex: 10,
          width: timelineContentWidth
        } }, timeTicks.map((tick, idx) => {
          const x = timeToX(tick.time);
          return /* @__PURE__ */ import_react86.default.createElement(
            "div",
            {
              key: idx,
              style: {
                position: "absolute",
                left: x,
                width: dayColumnWidth * (zoomLevel === "week" ? 7 : zoomLevel === "month" ? 30 : 1),
                padding: "4px 6px",
                fontSize: 10,
                fontWeight: 600,
                color: tick.isWeekend ? "#94a3b8" : "#334155",
                borderLeft: "1px solid #e2e8f0",
                background: tick.isWeekend ? "#f1f5f9" : "transparent",
                height: "100%",
                boxSizing: "border-box"
              }
            },
            /* @__PURE__ */ import_react86.default.createElement("div", null, tick.label),
            /* @__PURE__ */ import_react86.default.createElement("div", { style: { fontSize: 9, color: "#94a3b8" } }, tick.secondary)
          );
        })),
        /* @__PURE__ */ import_react86.default.createElement("div", { style: { position: "relative", width: timelineContentWidth, height: visibleTasks.length * rowHeight } }, /* @__PURE__ */ import_react86.default.createElement(
          "svg",
          {
            width: timelineContentWidth,
            height: visibleTasks.length * rowHeight,
            style: { display: "block", position: "absolute", top: 0, left: 0 }
          },
          /* @__PURE__ */ import_react86.default.createElement("defs", null, /* @__PURE__ */ import_react86.default.createElement("marker", { id: "gantt-arrow-crit", viewBox: "0 0 10 10", refX: "6", refY: "5", markerWidth: "5", markerHeight: "5", orient: "auto-start-reverse" }, /* @__PURE__ */ import_react86.default.createElement("path", { d: "M 0 1 L 10 5 L 0 9 z", fill: "#dc2626" })), /* @__PURE__ */ import_react86.default.createElement("marker", { id: "gantt-arrow-norm", viewBox: "0 0 10 10", refX: "6", refY: "5", markerWidth: "5", markerHeight: "5", orient: "auto-start-reverse" }, /* @__PURE__ */ import_react86.default.createElement("path", { d: "M 0 1 L 10 5 L 0 9 z", fill: "#64748b" })), /* @__PURE__ */ import_react86.default.createElement("pattern", { id: "gantt-hatch-overdue", width: "8", height: "8", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, /* @__PURE__ */ import_react86.default.createElement("line", { x1: "0", y1: "0", x2: "0", y2: "8", stroke: "#dc2626", strokeWidth: "2", opacity: "0.35" })), /* @__PURE__ */ import_react86.default.createElement("pattern", { id: "gantt-hatch-warn", width: "8", height: "8", patternUnits: "userSpaceOnUse", patternTransform: "rotate(-45)" }, /* @__PURE__ */ import_react86.default.createElement("line", { x1: "0", y1: "0", x2: "0", y2: "8", stroke: "#d97706", strokeWidth: "2", opacity: "0.35" }))),
          timeTicks.map((tick, idx) => {
            const x = timeToX(tick.time);
            return /* @__PURE__ */ import_react86.default.createElement(
              "line",
              {
                key: idx,
                x1: x,
                x2: x,
                y1: 0,
                y2: visibleTasks.length * rowHeight,
                stroke: tick.isWeekend ? "#f1f5f9" : "#f8fafc",
                strokeWidth: "1"
              }
            );
          }),
          showTodayLine && todayX > 0 && todayX < timelineContentWidth && /* @__PURE__ */ import_react86.default.createElement("g", { className: "today-marker", transform: `translate(${todayX}, 0)` }, /* @__PURE__ */ import_react86.default.createElement("line", { y1: "0", y2: visibleTasks.length * rowHeight, stroke: "#0284c7", strokeWidth: "2", strokeDasharray: "4,2" }), /* @__PURE__ */ import_react86.default.createElement("polygon", { points: "-4,0 4,0 0,6", fill: "#0284c7" })),
          dependencyLinks.map((link) => /* @__PURE__ */ import_react86.default.createElement(
            "path",
            {
              key: link.id,
              d: link.path,
              fill: "none",
              stroke: link.isCritical ? "#dc2626" : "#94a3b8",
              strokeWidth: link.isCritical ? 2 : 1.5,
              markerEnd: link.isCritical ? "url(#gantt-arrow-crit)" : "url(#gantt-arrow-norm)"
            }
          )),
          visibleTasks.map((t, idx) => {
            const isSelected = selectedTaskId === t.id;
            const isHovered = hoveredTask?.id === t.id;
            const y = idx * rowHeight + (rowHeight - taskBarHeight) / 2;
            if (t.isMilestone) {
              const mDate = t.milestoneDate || t[startKey];
              const mx = timeToX(mDate);
              const status2 = t.status || "completed";
              const color = STATUS_COLORS2[status2];
              return /* @__PURE__ */ import_react86.default.createElement(
                "g",
                {
                  key: t.id,
                  transform: `translate(${mx}, ${idx * rowHeight + rowHeight / 2})`,
                  style: { cursor: "pointer" },
                  onMouseEnter: (e) => {
                    setHoveredTask(t);
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  },
                  onMouseLeave: () => setHoveredTask(null),
                  onClick: (e) => {
                    setSelectedTaskId(t.id);
                    if (onTaskClick) onTaskClick(t, e);
                  }
                },
                /* @__PURE__ */ import_react86.default.createElement(
                  "polygon",
                  {
                    points: "0,-8 8,0 0,8 -8,0",
                    fill: color,
                    stroke: "#ffffff",
                    strokeWidth: "2",
                    filter: isSelected ? "drop-shadow(0 0 4px #0284c7)" : void 0
                  }
                ),
                /* @__PURE__ */ import_react86.default.createElement("text", { x: "12", y: "3", fontSize: "10", fontWeight: "600", fill: "#1e293b" }, t.name)
              );
            }
            const sDate = t[startKey];
            const eDate = t[endKey];
            const xStart = timeToX(sDate);
            const xEnd = timeToX(eDate);
            const barWidth = Math.max(4, xEnd - xStart);
            const progress = t[progressKey] ?? 0;
            const progressWidth = progress / 100 * barWidth;
            const status = t.status || (progress === 100 ? "completed" : "in-progress");
            const baseColor = STATUS_COLORS2[status];
            return /* @__PURE__ */ import_react86.default.createElement(
              "g",
              {
                key: t.id,
                className: "gantt-task-bar",
                style: { cursor: "pointer" },
                onMouseEnter: (e) => {
                  setHoveredTask(t);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                },
                onMouseLeave: () => setHoveredTask(null),
                onClick: (e) => {
                  setSelectedTaskId(t.id);
                  if (onTaskClick) onTaskClick(t, e);
                }
              },
              /* @__PURE__ */ import_react86.default.createElement(
                "rect",
                {
                  x: "0",
                  y: idx * rowHeight,
                  width: timelineContentWidth,
                  height: rowHeight,
                  fill: isSelected ? "#eff6ff" : isHovered ? "#f8fafc" : "transparent",
                  opacity: "0.6"
                }
              ),
              /* @__PURE__ */ import_react86.default.createElement(
                "rect",
                {
                  x: xStart,
                  y,
                  width: barWidth,
                  height: taskBarHeight,
                  rx: "3",
                  fill: status === "overdue" ? "url(#gantt-hatch-overdue)" : status === "warning" ? "url(#gantt-hatch-warn)" : "#e2e8f0",
                  stroke: isSelected ? "#0284c7" : baseColor,
                  strokeWidth: isSelected ? 2 : 1
                }
              ),
              showProgress && progress > 0 && /* @__PURE__ */ import_react86.default.createElement(
                "rect",
                {
                  x: xStart,
                  y,
                  width: progressWidth,
                  height: taskBarHeight,
                  rx: "3",
                  fill: baseColor,
                  opacity: "0.85"
                }
              ),
              /* @__PURE__ */ import_react86.default.createElement(
                "text",
                {
                  x: xStart + 6,
                  y: y + taskBarHeight / 2 + 4,
                  fontSize: "10",
                  fontWeight: "600",
                  fill: progress > 50 ? "#ffffff" : "#1e293b",
                  pointerEvents: "none"
                },
                barWidth > 60 ? `${t.name}` : ""
              )
            );
          })
        ))
      )),
      hoveredTask && /* @__PURE__ */ import_react86.default.createElement("div", { style: {
        position: "fixed",
        left: tooltipPos.x + 14,
        top: tooltipPos.y + 14,
        background: "#0f172a",
        color: "#ffffff",
        padding: "10px 14px",
        borderRadius: 6,
        fontSize: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        pointerEvents: "none",
        zIndex: 100,
        maxWidth: 280
      } }, /* @__PURE__ */ import_react86.default.createElement("div", { style: { fontWeight: 700, fontSize: 13, marginBottom: 4 } }, hoveredTask.name), /* @__PURE__ */ import_react86.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "auto auto", gap: "4px 12px", fontSize: 11 } }, hoveredTask[groupKey] && /* @__PURE__ */ import_react86.default.createElement(import_react86.default.Fragment, null, /* @__PURE__ */ import_react86.default.createElement("span", { style: { color: "#94a3b8" } }, "Group / Phase:"), /* @__PURE__ */ import_react86.default.createElement("span", { style: { fontWeight: 600, textAlign: "right" } }, hoveredTask[groupKey])), hoveredTask.owner && /* @__PURE__ */ import_react86.default.createElement(import_react86.default.Fragment, null, /* @__PURE__ */ import_react86.default.createElement("span", { style: { color: "#94a3b8" } }, "Assignee:"), /* @__PURE__ */ import_react86.default.createElement("span", { style: { fontWeight: 600, textAlign: "right" } }, hoveredTask.owner)), hoveredTask.isMilestone ? /* @__PURE__ */ import_react86.default.createElement(import_react86.default.Fragment, null, /* @__PURE__ */ import_react86.default.createElement("span", { style: { color: "#38bdf8" } }, "Milestone Date:"), /* @__PURE__ */ import_react86.default.createElement("span", { style: { fontWeight: 600, textAlign: "right", color: "#38bdf8" } }, new Date(hoveredTask.milestoneDate || hoveredTask[startKey]).toLocaleDateString("en-IN"))) : /* @__PURE__ */ import_react86.default.createElement(import_react86.default.Fragment, null, /* @__PURE__ */ import_react86.default.createElement("span", { style: { color: "#cbd5e1" } }, "Start:"), /* @__PURE__ */ import_react86.default.createElement("span", { style: { fontWeight: 600, textAlign: "right" } }, new Date(hoveredTask[startKey]).toLocaleDateString("en-IN")), /* @__PURE__ */ import_react86.default.createElement("span", { style: { color: "#cbd5e1" } }, "End:"), /* @__PURE__ */ import_react86.default.createElement("span", { style: { fontWeight: 600, textAlign: "right" } }, new Date(hoveredTask[endKey]).toLocaleDateString("en-IN")), /* @__PURE__ */ import_react86.default.createElement("span", { style: { color: "#cbd5e1" } }, "Progress:"), /* @__PURE__ */ import_react86.default.createElement("span", { style: { fontWeight: 600, textAlign: "right", color: "#38bdf8" } }, hoveredTask[progressKey] ?? 0, "%")), hoveredTask[dependenciesKey] && hoveredTask[dependenciesKey].length > 0 && /* @__PURE__ */ import_react86.default.createElement(import_react86.default.Fragment, null, /* @__PURE__ */ import_react86.default.createElement("span", { style: { color: "#cbd5e1" } }, "Predecessors:"), /* @__PURE__ */ import_react86.default.createElement("span", { style: { fontWeight: 600, textAlign: "right" } }, hoveredTask[dependenciesKey].join(", ")))), hoveredTask.status && /* @__PURE__ */ import_react86.default.createElement("div", { style: { marginTop: 6, fontSize: 11, color: STATUS_COLORS2[hoveredTask.status] } }, "\u25CF Status: ", hoveredTask.status.toUpperCase())),
      isTableModalOpen && /* @__PURE__ */ import_react86.default.createElement("div", { style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999
      } }, /* @__PURE__ */ import_react86.default.createElement("div", { style: {
        background: "#ffffff",
        borderRadius: 8,
        width: "90%",
        maxWidth: 780,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25)"
      } }, /* @__PURE__ */ import_react86.default.createElement("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid #e2e8f0"
      } }, /* @__PURE__ */ import_react86.default.createElement("h3", { style: { margin: 0, fontSize: 16, color: "#0f172a" } }, "Accessible Schedule & Task Data Table"), /* @__PURE__ */ import_react86.default.createElement(
        "button",
        {
          onClick: () => setIsTableModalOpen(false),
          style: { border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#64748b" }
        },
        "\u2715"
      )), /* @__PURE__ */ import_react86.default.createElement("div", { style: { padding: 20, overflowY: "auto", flex: 1 } }, /* @__PURE__ */ import_react86.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ import_react86.default.createElement("thead", null, /* @__PURE__ */ import_react86.default.createElement("tr", { style: { background: "#f8fafc", borderBottom: "1px solid #cbd5e1", textAlign: "left" } }, /* @__PURE__ */ import_react86.default.createElement("th", { style: { padding: "8px 10px" } }, "Task Name"), /* @__PURE__ */ import_react86.default.createElement("th", { style: { padding: "8px 10px" } }, "Phase / Group"), /* @__PURE__ */ import_react86.default.createElement("th", { style: { padding: "8px 10px" } }, "Start Date"), /* @__PURE__ */ import_react86.default.createElement("th", { style: { padding: "8px 10px" } }, "End Date"), /* @__PURE__ */ import_react86.default.createElement("th", { style: { padding: "8px 10px", textAlign: "right" } }, "Progress"), /* @__PURE__ */ import_react86.default.createElement("th", { style: { padding: "8px 10px" } }, "Predecessors"), /* @__PURE__ */ import_react86.default.createElement("th", { style: { padding: "8px 10px" } }, "Status"))), /* @__PURE__ */ import_react86.default.createElement("tbody", null, visibleTasks.map((t, i) => /* @__PURE__ */ import_react86.default.createElement("tr", { key: i, style: { borderBottom: "1px solid #f1f5f9" } }, /* @__PURE__ */ import_react86.default.createElement("td", { style: { padding: "8px 10px", fontWeight: 600 } }, t.name), /* @__PURE__ */ import_react86.default.createElement("td", { style: { padding: "8px 10px", color: "#64748b" } }, t[groupKey] || "General"), /* @__PURE__ */ import_react86.default.createElement("td", { style: { padding: "8px 10px" } }, t.isMilestone ? "\u2014" : new Date(t[startKey]).toLocaleDateString("en-IN")), /* @__PURE__ */ import_react86.default.createElement("td", { style: { padding: "8px 10px" } }, t.isMilestone ? new Date(t.milestoneDate || t[startKey]).toLocaleDateString("en-IN") : new Date(t[endKey]).toLocaleDateString("en-IN")), /* @__PURE__ */ import_react86.default.createElement("td", { style: { padding: "8px 10px", textAlign: "right", fontWeight: 600 } }, t.isMilestone ? "Milestone" : `${t[progressKey] ?? 0}%`), /* @__PURE__ */ import_react86.default.createElement("td", { style: { padding: "8px 10px", color: "#64748b" } }, (t[dependenciesKey] || []).join(", ") || "\u2014"), /* @__PURE__ */ import_react86.default.createElement("td", { style: { padding: "8px 10px", color: STATUS_COLORS2[t.status || "scheduled"], fontWeight: 600 } }, (t.status || "scheduled").toUpperCase()))))))))
    );
  }

  // components/data/ParallelCoordinates.jsx
  var import_react87 = __toESM(require_react(), 1);
  var CLUSTER_COLORS = [
    "#0284c7",
    // Sky blue (Cluster A / Class 1)
    "#16a34a",
    // Emerald green (Cluster B / Class 2)
    "#d97706",
    // Amber warning (Cluster C / Outliers)
    "#7c3aed",
    // Purple (Cluster D)
    "#dc2626",
    // Ruby critical
    "#0d9488"
    // Teal
  ];
  function ParallelCoordinates({
    data = [],
    dimensions = [],
    variant = "standard",
    // 'standard' | 'normalized' | 'spline' | 'brushed'
    width = 860,
    height = 420,
    title = "Multivariate Process & Quality Telemetry",
    subtitle = "Suryodaya Autocomp Ltd \xB7 Chakan Plant (PL-04)",
    colorKey = "cluster",
    // Key used to color-code polylines
    idKey = "id",
    labelKey = "label",
    smooth = false,
    normalized = false,
    showBrushControls = true,
    showControls = true,
    showSearch = true,
    className = "",
    onRecordClick = null
  }) {
    const [activeDimensions, setActiveDimensions] = (0, import_react87.useState)(dimensions);
    const [isNormalized, setIsNormalized] = (0, import_react87.useState)(normalized || variant === "normalized");
    const [isSmooth, setIsSmooth] = (0, import_react87.useState)(smooth || variant === "spline");
    const [activeBrushes, setActiveBrushes] = (0, import_react87.useState)({});
    const [selectedRecordId, setSelectedRecordId] = (0, import_react87.useState)(null);
    const [hoveredRecord, setHoveredRecord] = (0, import_react87.useState)(null);
    const [tooltipPos, setTooltipPos] = (0, import_react87.useState)({ x: 0, y: 0 });
    const [searchQuery, setSearchQuery] = (0, import_react87.useState)("");
    const [isTableModalOpen, setIsTableModalOpen] = (0, import_react87.useState)(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = (0, import_react87.useState)(false);
    (0, import_react87.useEffect)(() => {
      setActiveDimensions(dimensions);
    }, [dimensions]);
    (0, import_react87.useEffect)(() => {
      const handleKeyDown = (e) => {
        if (e.altKey && (e.key === "F11" || e.keyCode === 122)) {
          e.preventDefault();
          setIsTableModalOpen((prev) => !prev);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    const filteredData = (0, import_react87.useMemo)(() => {
      const q = searchQuery.toLowerCase().trim();
      return data.filter((d) => {
        if (q) {
          const idVal = String(d[idKey] || "").toLowerCase();
          const lblVal = String(d[labelKey] || "").toLowerCase();
          const clusterVal = String(d[colorKey] || "").toLowerCase();
          if (!idVal.includes(q) && !lblVal.includes(q) && !clusterVal.includes(q)) {
            return false;
          }
        }
        const brushKeys = Object.keys(activeBrushes);
        for (let i = 0; i < brushKeys.length; i++) {
          const k = brushKeys[i];
          const brush = activeBrushes[k];
          if (brush && (brush.min != null || brush.max != null)) {
            const val = Number(d[k]);
            if (isNaN(val)) return false;
            if (brush.min != null && val < brush.min) return false;
            if (brush.max != null && val > brush.max) return false;
          }
        }
        return true;
      });
    }, [data, searchQuery, activeBrushes, idKey, labelKey, colorKey]);
    const margin = (0, import_react87.useMemo)(() => ({
      top: 36,
      right: 48,
      bottom: 40,
      left: 48
    }), []);
    const innerWidth = Math.max(100, width - margin.left - margin.right);
    const innerHeight = Math.max(100, height - margin.top - margin.bottom);
    const dimensionDomains = (0, import_react87.useMemo)(() => {
      const domains = {};
      activeDimensions.forEach((dim) => {
        const key = typeof dim === "string" ? dim : dim.key;
        let min = dim.min != null ? Number(dim.min) : Infinity;
        let max = dim.max != null ? Number(dim.max) : -Infinity;
        data.forEach((d) => {
          const v = d[key] != null ? Number(d[key]) : null;
          if (v != null && !isNaN(v)) {
            if (v < min) min = v;
            if (v > max) max = v;
          }
        });
        if (min === Infinity || max === -Infinity) {
          min = 0;
          max = 100;
        }
        const span = max - min || 1;
        const pad2 = span * 0.05;
        const paddedMin = dim.min != null ? dim.min : min - pad2;
        const paddedMax = dim.max != null ? dim.max : max + pad2;
        domains[key] = {
          key,
          min: paddedMin,
          max: paddedMax,
          rawMin: min,
          rawMax: max,
          span: paddedMax - paddedMin,
          unit: dim.unit || "",
          label: dim.label || key,
          inverted: !!dim.inverted
        };
      });
      return domains;
    }, [activeDimensions, data]);
    const axisCount = activeDimensions.length;
    const axisSpacing = axisCount > 1 ? innerWidth / (axisCount - 1) : innerWidth / 2;
    const axisXCoords = (0, import_react87.useMemo)(() => {
      return activeDimensions.map((_, i) => i * axisSpacing);
    }, [activeDimensions, axisSpacing]);
    const valToY = (0, import_react87.useCallback)((val, dimKey) => {
      const domain = dimensionDomains[dimKey];
      if (!domain || val == null || isNaN(Number(val))) return innerHeight / 2;
      if (isNormalized) {
        let norm8 = (Number(val) - domain.rawMin) / (domain.rawMax - domain.rawMin || 1);
        norm8 = Math.max(0, Math.min(1, norm8));
        if (domain.inverted) norm8 = 1 - norm8;
        return innerHeight - norm8 * innerHeight;
      }
      let norm7 = (Number(val) - domain.min) / domain.span;
      norm7 = Math.max(0, Math.min(1, norm7));
      if (domain.inverted) norm7 = 1 - norm7;
      return innerHeight - norm7 * innerHeight;
    }, [dimensionDomains, innerHeight, isNormalized]);
    const buildPolylinePath = (0, import_react87.useCallback)((record) => {
      const points = [];
      activeDimensions.forEach((dim, i) => {
        const key = typeof dim === "string" ? dim : dim.key;
        const x = axisXCoords[i];
        const y = valToY(record[key], key);
        points.push([x, y]);
      });
      if (points.length === 0) return "";
      if (!isSmooth) {
        let p2 = `M ${points[0][0]} ${points[0][1]}`;
        for (let i = 1; i < points.length; i++) {
          p2 += ` L ${points[i][0]} ${points[i][1]}`;
        }
        return p2;
      }
      let p = `M ${points[0][0]} ${points[0][1]}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const dx = p1[0] - p0[0];
        const cx1 = p0[0] + dx * 0.4;
        const cy1 = p0[1];
        const cx2 = p1[0] - dx * 0.4;
        const cy2 = p1[1];
        p += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1[0]} ${p1[1]}`;
      }
      return p;
    }, [activeDimensions, axisXCoords, valToY, isSmooth]);
    const getRecordColor = (0, import_react87.useCallback)((record) => {
      if (record.color) return record.color;
      const cVal = record[colorKey];
      if (typeof cVal === "number") {
        return CLUSTER_COLORS[cVal % CLUSTER_COLORS.length];
      }
      if (typeof cVal === "string") {
        let hash = 0;
        for (let i = 0; i < cVal.length; i++) hash = cVal.charCodeAt(i) + ((hash << 5) - hash);
        const idx = Math.abs(hash) % CLUSTER_COLORS.length;
        return CLUSTER_COLORS[idx];
      }
      return CLUSTER_COLORS[0];
    }, [colorKey]);
    const moveAxis = (idx, direction) => {
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= activeDimensions.length) return;
      const next = [...activeDimensions];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      setActiveDimensions(next);
    };
    const updateBrush = (key, field, val) => {
      setActiveBrushes((prev) => {
        const current = prev[key] || { min: dimensionDomains[key].rawMin, max: dimensionDomains[key].rawMax };
        const num = val === "" ? null : Number(val);
        const nextBrush = { ...current, [field]: num };
        return { ...prev, [key]: nextBrush };
      });
    };
    const clearAllBrushes = () => {
      setActiveBrushes({});
      setSearchQuery("");
    };
    const activeBrushCount = Object.keys(activeBrushes).filter((k) => activeBrushes[k].min != null || activeBrushes[k].max != null).length;
    return /* @__PURE__ */ import_react87.default.createElement(
      "div",
      {
        className: `parallel-coordinates-container ${className}`,
        style: {
          position: "relative",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "16px 20px",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }
      },
      /* @__PURE__ */ import_react87.default.createElement("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 12
      } }, /* @__PURE__ */ import_react87.default.createElement("div", null, /* @__PURE__ */ import_react87.default.createElement("div", { style: { fontWeight: 700, fontSize: 15, color: "#0f172a" } }, title), /* @__PURE__ */ import_react87.default.createElement("div", { style: { fontSize: 12, color: "#64748b", marginTop: 2 } }, subtitle, " \xB7 Showing ", /* @__PURE__ */ import_react87.default.createElement("strong", null, filteredData.length), " of ", data.length, " records")), showControls && /* @__PURE__ */ import_react87.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } }, showSearch && /* @__PURE__ */ import_react87.default.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ import_react87.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Filter record/batch...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          style: {
            padding: "4px 10px",
            fontSize: 12,
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            outline: "none",
            width: 150
          }
        }
      ), searchQuery && /* @__PURE__ */ import_react87.default.createElement(
        "button",
        {
          onClick: () => setSearchQuery(""),
          style: {
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: 11
          }
        },
        "\u2715"
      )), /* @__PURE__ */ import_react87.default.createElement("label", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#334155", cursor: "pointer" } }, /* @__PURE__ */ import_react87.default.createElement(
        "input",
        {
          type: "checkbox",
          checked: isNormalized,
          onChange: (e) => setIsNormalized(e.target.checked)
        }
      ), "Normalize 0\u2013100%"), /* @__PURE__ */ import_react87.default.createElement("label", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#334155", cursor: "pointer" } }, /* @__PURE__ */ import_react87.default.createElement(
        "input",
        {
          type: "checkbox",
          checked: isSmooth,
          onChange: (e) => setIsSmooth(e.target.checked)
        }
      ), "Smooth Spline"), /* @__PURE__ */ import_react87.default.createElement(
        "button",
        {
          onClick: () => setIsFilterPanelOpen((prev) => !prev),
          style: {
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            background: activeBrushCount > 0 ? "#eff6ff" : "#ffffff",
            color: activeBrushCount > 0 ? "#0284c7" : "#334155",
            cursor: "pointer"
          }
        },
        "\u{1F3AF} Brush Filters ",
        activeBrushCount > 0 ? `(${activeBrushCount})` : ""
      ), /* @__PURE__ */ import_react87.default.createElement(
        "button",
        {
          onClick: () => setIsTableModalOpen(true),
          title: "Accessible Table Modal (Alt + F11)",
          style: {
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            background: "#f8fafc",
            color: "#0284c7",
            cursor: "pointer"
          }
        },
        "\u{1F4CA} Table View"
      ))),
      isFilterPanelOpen && /* @__PURE__ */ import_react87.default.createElement("div", { style: {
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "12px 16px",
        marginBottom: 16,
        fontSize: 12
      } }, /* @__PURE__ */ import_react87.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ import_react87.default.createElement("span", { style: { fontWeight: 600, color: "#0f172a" } }, "Accessible 1D Axis Range Filters (Keyboard Alternative to Drag Brushes)"), activeBrushCount > 0 && /* @__PURE__ */ import_react87.default.createElement(
        "button",
        {
          onClick: clearAllBrushes,
          style: { border: "none", background: "none", color: "#dc2626", fontSize: 11, cursor: "pointer", fontWeight: 600 }
        },
        "Reset All Filters"
      )), /* @__PURE__ */ import_react87.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 } }, activeDimensions.map((dim) => {
        const key = typeof dim === "string" ? dim : dim.key;
        const d = dimensionDomains[key];
        const brush = activeBrushes[key] || {};
        return /* @__PURE__ */ import_react87.default.createElement("div", { key, style: { background: "#ffffff", padding: "8px 10px", borderRadius: 4, border: "1px solid #cbd5e1" } }, /* @__PURE__ */ import_react87.default.createElement("div", { style: { fontWeight: 600, fontSize: 11, color: "#334155", marginBottom: 4 } }, d.label, " ", d.unit ? `(${d.unit})` : ""), /* @__PURE__ */ import_react87.default.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, /* @__PURE__ */ import_react87.default.createElement(
          "input",
          {
            type: "number",
            placeholder: `Min (${d.rawMin.toFixed(0)})`,
            value: brush.min ?? "",
            onChange: (e) => updateBrush(key, "min", e.target.value),
            style: { width: "48%", padding: "3px 6px", fontSize: 11, border: "1px solid #cbd5e1", borderRadius: 3 }
          }
        ), /* @__PURE__ */ import_react87.default.createElement("span", { style: { color: "#94a3b8" } }, "\u2013"), /* @__PURE__ */ import_react87.default.createElement(
          "input",
          {
            type: "number",
            placeholder: `Max (${d.rawMax.toFixed(0)})`,
            value: brush.max ?? "",
            onChange: (e) => updateBrush(key, "max", e.target.value),
            style: { width: "48%", padding: "3px 6px", fontSize: 11, border: "1px solid #cbd5e1", borderRadius: 3 }
          }
        )));
      }))),
      /* @__PURE__ */ import_react87.default.createElement("div", { style: { position: "relative", width: "100%", overflowX: "auto" } }, /* @__PURE__ */ import_react87.default.createElement(
        "svg",
        {
          width,
          height,
          viewBox: `0 0 ${width} ${height}`,
          style: { display: "block", margin: "0 auto" }
        },
        /* @__PURE__ */ import_react87.default.createElement("g", { transform: `translate(${margin.left}, ${margin.top})` }, data.map((record, idx) => {
          const isPassing = filteredData.includes(record);
          if (isPassing) return null;
          const p = buildPolylinePath(record);
          return /* @__PURE__ */ import_react87.default.createElement(
            "path",
            {
              key: record[idKey] || idx,
              d: p,
              fill: "none",
              stroke: "#e2e8f0",
              strokeWidth: "1",
              opacity: "0.4"
            }
          );
        }), filteredData.map((record, idx) => {
          const itemId = record[idKey] || `rec-${idx}`;
          const isSelected = selectedRecordId === itemId;
          const isHovered = hoveredRecord?.id === itemId;
          const color = getRecordColor(record);
          const p = buildPolylinePath(record);
          return /* @__PURE__ */ import_react87.default.createElement(
            "path",
            {
              key: itemId,
              d: p,
              fill: "none",
              stroke: isSelected ? "#0284c7" : color,
              strokeWidth: isSelected ? 3.5 : isHovered ? 3 : 1.5,
              opacity: hoveredRecord && !isHovered && !isSelected ? 0.2 : isSelected || isHovered ? 1 : 0.7,
              style: { cursor: "pointer", transition: "stroke-width 0.15s ease, opacity 0.15s ease" },
              onMouseEnter: (e) => {
                setHoveredRecord({ ...record, id: itemId });
                setTooltipPos({ x: e.clientX, y: e.clientY });
              },
              onMouseLeave: () => setHoveredRecord(null),
              onClick: (e) => {
                setSelectedRecordId(itemId);
                if (onRecordClick) onRecordClick(record, e);
              }
            }
          );
        }), activeDimensions.map((dim, i) => {
          const key = typeof dim === "string" ? dim : dim.key;
          const d = dimensionDomains[key];
          const x = axisXCoords[i];
          const ticks = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = innerHeight - pct * innerHeight;
            let valLabel = "";
            if (isNormalized) {
              valLabel = `${(pct * 100).toFixed(0)}%`;
            } else {
              const rawVal = d.rawMin + pct * (d.rawMax - d.rawMin);
              valLabel = rawVal.toLocaleString("en-IN", { maximumFractionDigits: 1 });
            }
            return { y, label: valLabel };
          });
          return /* @__PURE__ */ import_react87.default.createElement("g", { key, transform: `translate(${x}, 0)` }, /* @__PURE__ */ import_react87.default.createElement(
            "line",
            {
              y1: "0",
              y2: innerHeight,
              stroke: "#475569",
              strokeWidth: "1.5"
            }
          ), /* @__PURE__ */ import_react87.default.createElement("g", { transform: "translate(0, -22)" }, i > 0 && /* @__PURE__ */ import_react87.default.createElement(
            "text",
            {
              x: "-10",
              y: "0",
              fontSize: "10",
              fill: "#0284c7",
              textAnchor: "end",
              style: { cursor: "pointer", userSelect: "none" },
              onClick: () => moveAxis(i, -1),
              title: "Move Axis Left"
            },
            "\u25C0"
          ), i < activeDimensions.length - 1 && /* @__PURE__ */ import_react87.default.createElement(
            "text",
            {
              x: "10",
              y: "0",
              fontSize: "10",
              fill: "#0284c7",
              textAnchor: "start",
              style: { cursor: "pointer", userSelect: "none" },
              onClick: () => moveAxis(i, 1),
              title: "Move Axis Right"
            },
            "\u25B6"
          )), /* @__PURE__ */ import_react87.default.createElement(
            "text",
            {
              x: "0",
              y: "-8",
              fontSize: "11",
              fontWeight: "700",
              fill: "#0f172a",
              textAnchor: "middle"
            },
            d.label
          ), d.unit && /* @__PURE__ */ import_react87.default.createElement(
            "text",
            {
              x: "0",
              y: innerHeight + 16,
              fontSize: "10",
              fill: "#64748b",
              textAnchor: "middle"
            },
            d.unit
          ), ticks.map((t, tIdx) => /* @__PURE__ */ import_react87.default.createElement("g", { key: tIdx, transform: `translate(0, ${t.y})` }, /* @__PURE__ */ import_react87.default.createElement("line", { x1: "-4", x2: "4", stroke: "#94a3b8", strokeWidth: "1" }), /* @__PURE__ */ import_react87.default.createElement(
            "text",
            {
              x: "-7",
              y: "3",
              fontSize: "9",
              fill: "#64748b",
              textAnchor: "end"
            },
            t.label
          ))), hoveredRecord && hoveredRecord[key] != null && /* @__PURE__ */ import_react87.default.createElement("g", { transform: `translate(0, ${valToY(hoveredRecord[key], key)})` }, /* @__PURE__ */ import_react87.default.createElement("circle", { r: "4.5", fill: "#0284c7", stroke: "#ffffff", strokeWidth: "2" }), /* @__PURE__ */ import_react87.default.createElement("rect", { x: "8", y: "-9", width: "45", height: "16", rx: "3", fill: "#0f172a", opacity: "0.85" }), /* @__PURE__ */ import_react87.default.createElement("text", { x: "12", y: "3", fontSize: "9", fontWeight: "600", fill: "#ffffff" }, Number(hoveredRecord[key]).toLocaleString("en-IN", { maximumFractionDigits: 1 }))));
        }))
      ), hoveredRecord && /* @__PURE__ */ import_react87.default.createElement("div", { style: {
        position: "fixed",
        left: tooltipPos.x + 14,
        top: tooltipPos.y + 14,
        background: "#0f172a",
        color: "#ffffff",
        padding: "10px 14px",
        borderRadius: 6,
        fontSize: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        pointerEvents: "none",
        zIndex: 100,
        maxWidth: 280
      } }, /* @__PURE__ */ import_react87.default.createElement("div", { style: { fontWeight: 700, fontSize: 13, marginBottom: 4 } }, hoveredRecord[labelKey] || hoveredRecord[idKey]), hoveredRecord[colorKey] && /* @__PURE__ */ import_react87.default.createElement("div", { style: { color: "#38bdf8", fontSize: 11, marginBottom: 6 } }, "Classification: ", /* @__PURE__ */ import_react87.default.createElement("strong", null, hoveredRecord[colorKey])), /* @__PURE__ */ import_react87.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "auto auto", gap: "3px 12px", fontSize: 11 } }, activeDimensions.map((dim) => {
        const key = typeof dim === "string" ? dim : dim.key;
        const d = dimensionDomains[key];
        return /* @__PURE__ */ import_react87.default.createElement(import_react87.default.Fragment, { key }, /* @__PURE__ */ import_react87.default.createElement("span", { style: { color: "#cbd5e1" } }, d.label, ":"), /* @__PURE__ */ import_react87.default.createElement("span", { style: { fontWeight: 600, textAlign: "right" } }, Number(hoveredRecord[key]).toLocaleString("en-IN", { maximumFractionDigits: 2 }), " ", d.unit));
      })))),
      isTableModalOpen && /* @__PURE__ */ import_react87.default.createElement("div", { style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999
      } }, /* @__PURE__ */ import_react87.default.createElement("div", { style: {
        background: "#ffffff",
        borderRadius: 8,
        width: "92%",
        maxWidth: 880,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25)"
      } }, /* @__PURE__ */ import_react87.default.createElement("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid #e2e8f0"
      } }, /* @__PURE__ */ import_react87.default.createElement("h3", { style: { margin: 0, fontSize: 16, color: "#0f172a" } }, "Accessible Multivariate Observations Table"), /* @__PURE__ */ import_react87.default.createElement(
        "button",
        {
          onClick: () => setIsTableModalOpen(false),
          style: { border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#64748b" }
        },
        "\u2715"
      )), /* @__PURE__ */ import_react87.default.createElement("div", { style: { padding: 20, overflowY: "auto", flex: 1 } }, /* @__PURE__ */ import_react87.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ import_react87.default.createElement("thead", null, /* @__PURE__ */ import_react87.default.createElement("tr", { style: { background: "#f8fafc", borderBottom: "1px solid #cbd5e1", textAlign: "left" } }, /* @__PURE__ */ import_react87.default.createElement("th", { style: { padding: "8px 10px" } }, "Record / Batch"), /* @__PURE__ */ import_react87.default.createElement("th", { style: { padding: "8px 10px" } }, "Cluster / Grade"), activeDimensions.map((dim) => {
        const key = typeof dim === "string" ? dim : dim.key;
        const d = dimensionDomains[key];
        return /* @__PURE__ */ import_react87.default.createElement("th", { key, style: { padding: "8px 10px", textAlign: "right" } }, d.label, " ", d.unit ? `(${d.unit})` : "");
      }))), /* @__PURE__ */ import_react87.default.createElement("tbody", null, filteredData.map((r, i) => /* @__PURE__ */ import_react87.default.createElement("tr", { key: i, style: { borderBottom: "1px solid #f1f5f9" } }, /* @__PURE__ */ import_react87.default.createElement("td", { style: { padding: "8px 10px", fontWeight: 600 } }, r[labelKey] || r[idKey] || `Record ${i + 1}`), /* @__PURE__ */ import_react87.default.createElement("td", { style: { padding: "8px 10px", color: "#0284c7", fontWeight: 600 } }, r[colorKey] || "\u2014"), activeDimensions.map((dim) => {
        const key = typeof dim === "string" ? dim : dim.key;
        const v = Number(r[key]);
        return /* @__PURE__ */ import_react87.default.createElement("td", { key, style: { padding: "8px 10px", textAlign: "right" } }, !isNaN(v) ? v.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "\u2014");
      }))))))))
    );
  }
  return __toCommonJS(browser_entry_exports);
})();

  const namespace = window["MeridianDesignSystem_962c43"] || (window["MeridianDesignSystem_962c43"] = {});
  Object.assign(namespace, __meridianBrowserBundle);
})();