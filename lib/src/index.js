import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  Animated
} from 'react-native';

import createThemedComponent from './createThemedComponent';
import Theme, { createStyle, getCurrentTheme } from './Theme';

import Container from './Container';

export default {
  View: createThemedComponent(View),
  ScrollView: createThemedComponent(ScrollView),
  Image: createThemedComponent(Image, ['source']),
  Text: createThemedComponent(Text),
  ImageBackground: createThemedComponent(ImageBackground, ['source']),
  TouchableOpacity: createThemedComponent(TouchableOpacity),

  AnimatedView: createThemedComponent(Animated.View),
  AnimatedImage: createThemedComponent(Animated.Image, ['source']),
  AnimatedText: createThemedComponent(Animated.Text),

  Container
};

export { createStyle, createThemedComponent, getCurrentTheme, Container };

export function createTheme(definition, componentOverrides, name) {
  return new Theme(definition, componentOverrides, name);
}
