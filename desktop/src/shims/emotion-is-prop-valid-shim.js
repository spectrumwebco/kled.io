module.exports = function isPropValid(prop) {
  if (prop.startsWith('data-') || prop.startsWith('aria-')) {
    return true;
  }
  
  const validProps = [
    'id', 'className', 'style', 'href', 'src', 'alt', 'title',
    'width', 'height', 'viewBox', 'fill', 'stroke', 'x', 'y',
    'cx', 'cy', 'r', 'd', 'transform', 'onClick', 'onMouseEnter',
    'onMouseLeave', 'onFocus', 'onBlur', 'onChange', 'value',
    'checked', 'disabled', 'placeholder', 'type', 'name', 'required'
  ];
  
  return validProps.includes(prop);
};
