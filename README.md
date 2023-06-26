# Stremio Icons

Icon set for all Stremio clients

## Preview

Icons preview can be found [here](http://stremio.github.io/stremio-icons/)

## Adding more icons
The icons should have this exact same layer struture:
```
└───name
    └───group
    │   └───path
    │   └───path
    └───outer
```
The icon will be named the same as the root group name. (use kebab-case)  
The outer shape represent the bounds of the icon.  
The colors and positions have no effects on the generated icons.  
Export the `stremio-icons` layer. (not the artboard)  

### Supported SVG softwares
- Illustrator  
- Adobe XD  
- Figma (*Export with option `Include 'id' attribute` checked*)