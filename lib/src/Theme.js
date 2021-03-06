import { StyleSheet } from 'react-native';
import ThemedStyle from './ThemedStyle';
import detectTheming from './detectTheming';

const allStyles = [];
const allThemes = [];

const allComponents = [];
export function registerComponent(component) {
  allComponents.push(component);
  return () => {
    const idx = allComponents.indexOf(component);
    allComponents.splice(idx, 1);
  };
}

let currentTheme = null;
export function getCurrentTheme() {
  return currentTheme;
}

export function createStyle(stylesObject) {
  const themedStyles = {};
  const nonThemedStyles = {};

  Object.keys(stylesObject).forEach(key => {
    const style = stylesObject[key];

    // See if there is anykind of theming applied on this style
    const themed = Object.keys(style).find(styleName =>
      detectTheming(style[styleName])
    );

    if (themed) {
      const id = allStyles.push(style);
      // also map this theme to all the existing themes
      allThemes.forEach(theme => theme.addStyle(style));
      themedStyles[key] = new ThemedStyle(id);
    } else {
      nonThemedStyles[key] = style;
    }
  });

  return Object.assign(themedStyles, StyleSheet.create(nonThemedStyles));
}

class Theme {
  constructor(def, componentOverrides, name) {
    this.def = def;
    this.name = name;
    this.componentOverrides = componentOverrides || {};

    // All the styles registered for the application that are dependent
    // on the theme
    this.styles = allStyles.map(style => this.parseStyle(style));
    allThemes.push(this);

    if (currentTheme === null) {
      currentTheme = this;
    }
  }

  addStyle(style) {
    this.styles.push(this.parseStyle(style));
  }

  mapStyle(style) {
    const mapped = {};
    Object.keys(style).forEach(styleName => {
      const styleValue = style[styleName];
      const parsed = this.parse(styleValue);
      if (parsed) {
        mapped[styleName] = parsed;
      }
    });
    return mapped;
  }

  parseStyle(style) {
    const mapped = this.mapStyle(style);
    return StyleSheet.create({ mapped }).mapped;
  }

  parse(value) {
    if (detectTheming(value)) {
      // Handle the basic use case
      const v = this.def[value.substr(1)];
      if (v) {
        return v;
      }

      // Handle the more complicated case where the variables may
      // appear anywhere in the string
      return (
        value.replace(/@([\w_-]+)/gm, (match, key) => this.def[key] || '') ||
        undefined
      );
    }

    return value;
  }

  apply() {
    if (currentTheme !== this) {
      currentTheme = this;

      // Re-render all the themed components
      allComponents.forEach(component => component.setTheme(currentTheme));
    }
  }

  getStyle(style) {
    if (style) {
      if (style.map) {
        return style.map(s => this.getStyle(s));
      } else if (style instanceof ThemedStyle) {
        return this.styles[style.id - 1];
      } else if (typeof style === 'object') {
        return this.mapStyle(style);
      } else if (typeof style === 'string') {
        return this.parse(style);
      }
    }

    return style;
  }

  getProp(value) {
    return this.parse(value);
  }

  getComponentOverride(componentName) {
    if (this.componentOverrides[componentName]) {
      return this.componentOverrides[componentName];
    }
    return null;
  }
}

export default Theme;
