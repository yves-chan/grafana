import { NewThemeOptions } from '../createTheme';

/**
 * Azure Portal light theme
 */
const azureLight: NewThemeOptions = {
  name: 'azureLight',
  colors: {
    mode: 'azureLight',
    background: {
      canvas: '#f3f2f1', // Light gray background
      primary: '#ffffff', // White primary background
      secondary: '#e1dfdd', // Light gray secondary background
    },
    text: {
      primary: '#323130', // Dark gray text
      secondary: '#605e5c', // Medium gray text
      disabled: '#a19f9d', // Light gray text
      link: '#0078d4', // Azure blue link
      maxContrast: '#000000', // Black for maximum contrast
    },
    border: {
      weak: '#d6d6d6', // Light gray border
      medium: '#8a8886', // Medium gray border
      strong: '#0078d4', // Azure blue border
    },
    primary: {
      border: '#0078d4', // Azure blue border
      text: '#ffffff', // White text
      contrastText: '#ffffff', // White contrast text
      shade: '#005a9e', // Darker Azure blue shade
    },
    secondary: {
      border: '#e1dfdd', // Light gray border
      text: '#323130', // Dark gray text
      contrastText: '#ffffff', // White contrast text
      shade: '#605e5c', // Medium gray shade
    },
    info: {
      shade: '#0078d4', // Azure blue shade
    },
    warning: {
      shade: '#ffb900', // Yellow warning shade
    },
    success: {
      shade: '#107c10', // Green success shade
    },
    error: {
      shade: '#d83b01', // Red error shade
    },
    action: {
      hover: '#b3d6f2', 
      focus: '#004578', 
      selected: '#b3d7f2', 
    },
  },
  shape: {
    borderRadius: 4, // Slightly rounded corners
  },
  spacing: {
    gridSize: 8, // Consistent spacing with Azure Portal
  },
  typography: {
    fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif',
    fontFamilyMonospace: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
    fontSize: 14,
    fontWeightLight: 300, // Light font weight
    fontWeightRegular: 400, // Regular font weight
    fontWeightMedium: 500, // Medium font weight
    fontWeightBold: 700, // Bold font weight
    htmlFontSize: 12, 
  },
};

export default azureLight;
