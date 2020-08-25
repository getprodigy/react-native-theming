import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';

import createThemedComponent from './createThemedComponent';
import Theme, { createStyle, getCurrentTheme } from './Theme';

import Container from './Container';

export default {
  View: createThemedComponent(View, [], 'View'),
  ScrollView: createThemedComponent(ScrollView, [], 'ScrollView'),
  Image: createThemedComponent(Image, ['source'], 'Image'),
  Text: createThemedComponent(Text, [], 'Text'),
  ImageBackground: createThemedComponent(
    ImageBackground,
    ['source'],
    'ImageBackground'
  ),
  TouchableOpacity: createThemedComponent(
    TouchableOpacity,
    [],
    'TouchableOpacity'
  ),

  AnimatedView: createThemedComponent(Animated.View, [], 'AnimatedView'),
  AnimatedImage: createThemedComponent(
    Animated.Image,
    ['source'],
    'AnimatedImage'
  ),
  AnimatedText: createThemedComponent(Animated.Text, [], 'AnimatedText'),

  Container,
};

export { createStyle, createThemedComponent, getCurrentTheme, Container };

export function createTheme(definition, componentOverrides, name) {
  return new Theme(definition, componentOverrides, name);
}
