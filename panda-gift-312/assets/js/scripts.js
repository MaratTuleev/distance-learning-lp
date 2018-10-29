(function ($, window, document, undefined) {

  'use strict';

  var invalidator = function (options) {
    var opts = $.extend({
          minLength: 4,
          maxLength: 10,
          chars: ['engLetters', 'rusLetters', 'numbers', 'symbols'],
          input: undefined
        }, options);

    var regExpParts = {
      leftPart: '^([ ',
      rightPart: ']+|\d+)$',
      engLetters: 'a-zA-Z',
      rusLetters: 'а-яёА-ЯЁ',
      numbers: '0-9',
      symbols: '( )+-'
    }

    this.setState = function (el, state) {
      el.dataset.validation = state
    }

    this.regExpConstructor = function (el) {
      var chars = JSON.parse(el.dataset.chars),
          parts = regExpParts,
          leftP = regExpParts.leftPart,
          rightP = regExpParts.rightPart,
          res = '';

      res += leftP;

      chars.forEach(function (char, c) {
        res += parts[char]
      })

      res += rightP;

      return res;
    }

    this.regExpValid = function (value, el) {
      var exp = new RegExp(this.regExpConstructor(el), 'i')

      return exp.test(value)
    }

    this.lengthValid = function (value, el) {
      var l = value.length,
          maxL = el.getAttribute('maxlength') ? el.getAttribute('maxlength') : Number.POSITIVE_INFINITY

      if (l >= el.getAttribute('minlength') && l <= maxL) {
        return true
      } else {
        return false
      }
    }

    this.validate = function () {
      var el = opts.input,
          it = this,
          flag;

      opts.store[el.getAttribute("id")] = false;

      el.setAttribute('data-validation', 'undefined')

      el.addEventListener('keyup', function () {
        var v = this.value,
            id = this.getAttribute('id'),
            lFlag = it.lengthValid(v, this),
            rEFlag = it.regExpValid(v, this)

        if (lFlag && rEFlag) {
          it.setState(this, 'valid')
          opts.store[id] = true

        } else {
          it.setState(this, 'invalid')
          opts.store[id] = false

        }

        for (var s in opts.store) {
          if (opts.store[s] === false) {
            flag = false
            break;
          } else {
            flag = true
          }
        }

        if (flag) {
          opts.submit.classList.remove('disabled')
          // opts.submit.removeAttribute('disabled')
        } else {
          opts.submit.classList.add('disabled')
          // opts.submit.setAttribute('disabled', 'disabled')
        }
      })
    }
  }

  $(function () {
    var form = document.querySelector('#dicount_form'),
        nameInput = document.querySelector('#form_name'),
        phoneInput = document.querySelector('#form_phone'),
        submit = document.querySelector('#form_submit'),
        validateStore = window.validStore = {},
        name = new invalidator ({
          input: nameInput,
          maxLength: 0,
          store: validateStore,
          submit: submit
        }),
        phone = new invalidator ({
          input: phoneInput,
          minLength: 18,
          maxLength: 18,
          store: validateStore,
          submit: submit
        }),
        im = new Inputmask("+7 (999) 999-99-99", {showMaskOnHover: false});

    name.validate()
    phone.validate()

    submit.addEventListener('click', function (e) {
      var fields = document.querySelectorAll('[data-validation]'),
          res = true;

      fields.forEach(function (field, f) {
        var state = field.dataset.validation

        if (state === 'invalid' || state === 'undefined') {
          res = false
        }
      })

      if (res) {
        form.submit()
      }

      return false
    })

    form.addEventListener('keydown', function () {
      var keyName = event.key,
          fields = document.querySelectorAll('[data-validation]'),
          res = true;

      if (keyName === 'Enter') {
        fields.forEach(function (field, f) {
          var state = field.dataset.validation

          if (state === 'invalid' || state === 'undefined') {
            res = false
          }
        })

        if (res) {
          form.submit()
        }
      }

      return false
    })

    im.mask(phoneInput)
  });

})(jQuery, window, document);
