'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

// eslint-disable-next-line @typescript-eslint/no-var-requires
var _react = _interopRequireDefault(require('react'));

// eslint-disable-next-line @typescript-eslint/no-var-requires
var _propTypes = _interopRequireDefault(require('prop-types'));

// eslint-disable-next-line @typescript-eslint/no-var-requires
var _core = require('@material-ui/core');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

var useStyles = (0, _core.makeStyles)(function (theme) {
  return {
    container: {
      margin: '.5rem 0 .5rem',
      textAlign: 'center',
    },
    chipsDiv: {
      marginTop: '.0rem',
    },
    chip: {
      margin: '.5rem',
      padding: '0.5rem',
      borderRadius: '6px',
    },
    formHelperText: {
      textAlign: 'center',
    },
  };
}); // 1.0.5

var MultipleSelectChips = function MultipleSelectChips(_ref) {
  var value = _ref.value,
    setValue = _ref.setValue,
    options = _ref.options,
    label = _ref.label,
    error = _ref.error,
    setError = _ref.setError;
  var classes = useStyles();

  var handleClick = function handleClick(clickedValue) {
    if (setError) {
      setError('');
    }

    if (
      value.find(function (e) {
        return e === clickedValue;
      })
    ) {
      var index = value.findIndex(function (e) {
        return e === clickedValue;
      });

      var arr = _toConsumableArray(value);

      arr.splice(index, 1);
      setValue(arr);
    } else {
      setValue([].concat(_toConsumableArray(value), [clickedValue]));
    }
  };

  return /*#__PURE__*/ _react['default'].createElement(
    _react['default'].Fragment,
    null,
    /*#__PURE__*/ _react['default'].createElement(
      'div',
      {
        className: classes.container,
      },
      label &&
        /*#__PURE__*/ _react['default'].createElement(
          _core.FormLabel,
          {
            error: Boolean(error),
          },
          /*#__PURE__*/ _react['default'].createElement(
            _core.Typography,
            {
              variant: 'body2',
            },
            ''
              .concat(label)
              .concat(value.length ? ':' : '', ' ')
              .concat(
                options
                  .filter(function (option) {
                    return value.indexOf(option.value) !== -1;
                  })
                  .map(function (option) {
                    return option.label;
                  })
                  .join(', '),
              ),
          ),
        ),
      Boolean(error) &&
        /*#__PURE__*/ _react['default'].createElement(
          _core.FormHelperText,
          {
            className: classes.formHelperText,
            error: Boolean(error),
          },
          error,
        ),
      /*#__PURE__*/ _react['default'].createElement(
        'div',
        {
          className: classes.chipsDiv,
        },
        options && options.length
          ? options.map(function (option, i) {
              return /*#__PURE__*/ _react['default'].createElement(_core.Chip, {
                icon: option.icon,
                className: classes.chip,
                key: i,
                color: 'primary',
                variant: value.find(function (e) {
                  return e === option.value;
                })
                  ? 'outlined'
                  : 'default',
                label: /*#__PURE__*/ _react['default'].createElement(
                  _core.Typography,
                  {
                    variant: 'body2',
                  },
                  ''.concat(option.label),
                ),
                clickable: true,
                onClick: function onClick() {
                  return handleClick(option.value);
                },
              });
            })
          : null,
      ),
    ),
  );
};

MultipleSelectChips.propTypes = {
  label: _propTypes['default'].string,
  value: _propTypes['default'].array.isRequired,
  setValue: _propTypes['default'].func.isRequired,
  options: _propTypes['default'].arrayOf(
    _propTypes['default'].shape({
      label: _propTypes['default'].string.isRequired,
      value: _propTypes['default'].oneOfType([_propTypes['default'].string, _propTypes['default'].number]).isRequired,
      icon: _propTypes['default'].node,
    }),
  ).isRequired,
  error: _propTypes['default'].string,
  setError: _propTypes['default'].func,
};
var _default = MultipleSelectChips;
exports['default'] = _default;

//# sourceMappingURL=MultipleSelectChips.js.map
