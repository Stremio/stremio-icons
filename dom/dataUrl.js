import icons from './icons';

const dataUrl = ({ icon, width, height, fill = 'white' } = {}) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icons[icon].viewBox}" width="${width}" height="${height}" fill="${fill}">${icons[icon].paths.map(path => `<path d="${path}" />`).join('')}</svg>`;

export default dataUrl;
