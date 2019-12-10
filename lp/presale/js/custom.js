const apiRoots = {
  dev: 'https://fd57ad27.ngrok.io',
  // dev: 'https://app.stage-onlineschool.ru',
  prod: 'https://app.onlineschool.ru',
}
const cpPublicIds = {
  dev: 'pk_d0835e4370a25f35e6ec0e7c311d9',
  prod: 'pk_cefe80d04f9affe9d0cd80beba637',
}

const environment = 'prod'
const apiRoot = apiRoots[environment]
const cpPublicId = cpPublicIds[environment]
const redirectURL = `/presale/details`

const setupAnalytics = async () => {
  if (typeof window.analytics === 'undefined') {
    return console.error('Segment is not installed')
  }

  if (typeof window.yaCounter54799495 === 'undefined') {
    console.error('Yandex Metrika is not installed, not critical')
  }

  const open_video_button = $('#rec126985037 a[href="#popup:vimeovideo"]')

  // 2) кнопки Выбрать план в блоках с ценами (сделать разными целями)
  const choose_plan_16_button = $($('#rec126304055 a[href="#popup:register"]').get(0))
  const choose_plan_48_button = $($('#rec126304055 a[href="#popup:register"]').get(1))
  // 3) кнопки Выбрать план и Подробнее в первом блоке сайта
  const pricing_button = $('#rec126985037 a[href="#pricing"]')
  const how_it_works_button = $('#rec126985037 a[href="#howitworks"]')
  // 4) блок захвата в центре сайта Выбрать план
  const reviews_to_pricing_button = $('#rec126870912 a[href="#pricing"]')

  open_video_button         .click(() => sendEvent('presale-main-open-video'))
  pricing_button            .click(() => sendEvent('presale-main-open-pricing'))
  how_it_works_button       .click(() => sendEvent('presale-main-open-how-it-works'))
  reviews_to_pricing_button .click(() => sendEvent('presale-reviews-open-pricing'))
  choose_plan_16_button     .click(() => sendEvent('presale-choose-plan-16'))
  choose_plan_48_button     .click(() => sendEvent('presale-choose-plan-48'))

  const signup_rec_id = '126478317';
  const scope_signup = $(`#rec${signup_rec_id}`);

  const signup_form = $(scope_signup).find('form');

  signup_form               .submit(() => sendEvent('presale-submit-sign-up'))
}

const sendEvent = (eventName, payload = {}) => {
  if (typeof window.yaCounter54799495 !== 'undefined') {
    window.yaCounter54799495.reachGoal(eventName, payload)
  }
  analytics.track(eventName, payload)
}

const showError = (form, messages) => {
  // alert(JSON.stringify(messages))

  const errorFields = {
    name: form.find('.t-input-group.t-input-group_nm .t-input-error'),
    email: form.find('.t-input-group.t-input-group_em .t-input-error'),
    phone: form.find('.t-input-group.t-input-group_ph .t-input-error'),
  }

  const errorMessages = {
    error_has_orders: 'Акция действует на первую покупку',
    wrong_payment_type: 'Неизвестный пакет уроков',
    wrong_phone: 'Неправильный формат номера телефона',
    already_exists: 'Этот номер уже зарегистрирован',
  }

  Object.keys(messages).forEach(key => {
    const error = messages[key]

    if (errorFields[key]) {
      errorFields[key].text(error).show()
    } else {
      const message = errorMessages[error] || error

      form.find('.js-errorbox-all').show()
      form.find(`.js-rule-error.js-rule-error-all`).show().text(message)
    }
  })

}

const extractData = form => {
  const first_name = form.find('input[name="first_name"]').val()
  const email = form.find('input[name="email"]').val()
  const phone = form.find('input[name="phone"]').val()
  const payment_type = form.find('input[name="payment_type"]').val()

  return {
    phone,
    first_name,
    email,
    payment_type,
  }
}

const getUTM = (type) => {
  if (type === 'pay') {
    // Для кнопки Выбрать план
    return {
      utm_source: 'landing',
      utm_medium: 'landing-presale-20190913',
      utm_campaign: '20190913_select_plan_button',
    }
  }

  // throw new Error('Unknown type')
  return {}
}

const getQueryParams = function () {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  const qparams = {}

  try {
    for (var key of params.keys()) {
      qparams[key] = params.get(key)
    }
  } catch (err) {
    console.warn(err)
  }

  return qparams
}

const pay = function (form, data) {
  const url = `${apiRoot}/api/v1/parent/orders`

  console.log('body', data)

  const _data = {
    ...data,
    utm_data: getUTM('pay'),
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const body = JSON.stringify(_data)

  return fetch(url, { method: 'POST', headers, body })
    .then(res => res.json())
}

const payViaCloudPayments = ({ accountId, amount, currency, email, description, data }) => {
  const widget = new window.cp.CloudPayments()

  return new Promise((resolve, reject) => {
    widget.charge({ // options
      publicId: cpPublicId,  //id из личного кабинета
      description, //назначение
      amount, //сумма
      currency, //валюта
      //invoiceId, //номер заказа  (необязательно)
      accountId, //идентификатор плательщика (необязательно)
      email,
      // skin: 'modern',
      requireEmail: true, //требовать указания e-mail адреса пользователя в виджете (необязательно)
      data, //произвольный набор параметров
    }, (options) => { // success
      // действие при успешной оплате
      resolve(options)
    }, (reason, options) => { // fail
      // действие при неуспешной оплате
      console.warn('Оплата не завершена', reason)
      reject({ message: reason, ...options })
    })
  })
}

$(document).ready(function () {
  setupAnalytics()

  const signup_rec_id = '126478317';
  const scope_signup = $(`#rec${signup_rec_id}`);
  const closePopup = () => (window.t702_closePopup && window.t702_closePopup());
  const onSuccess = (form) => (window.t702_onSuccess && window.t702_onSuccess(form));

  const signup_form = $(scope_signup).find('form');

  const choose_plan_16_button = $($('#rec126304055 a[href="#popup:register"]').get(0))
  const choose_plan_48_button = $($('#rec126304055 a[href="#popup:register"]').get(1))

  choose_plan_16_button.click(() => signup_form.find('input[name="payment_type"]').val('english_direct_count_16'))
  choose_plan_48_button.click(() => signup_form.find('input[name="payment_type"]').val('english_direct_count_48'))

  $('form').each(function () {
    $(this).removeClass('js-form-proccess')
  })

  signup_form.submit(async function (event) {
    event.preventDefault();

    // showLoader()

    try {
      const data = extractData(signup_form)
      const res = await pay(signup_form, data)

      if (res.status !== 'ok') {
        let errors = null

        if (res.status === 'error') {
          errors = res.messages
        } else if (res.status === 'already_exists') {
          errors = { all: 'already_exists', phone: 'Пользователь с таким номером телефона уже зарегистрирован' }
        } else {
          errors = { all: res.status }
        }

        showError(signup_form, errors)
        return
      }

      console.log('res', res)
      const { account_id, order } = res

      setTimeout(() => closePopup(), 0)

      payViaCloudPayments({
        accountId: account_id,
        amount: parseFloat(order.amount),
        currency: order.currency,
        email: data.email,
        description: order.data.description_text,
        data: {
          orderId: order.id,
        },
      })
      .then(options => {
        window.location = redirectURL
      })

    } catch (err) {
      console.log('err', err)
      showError(signup_form, { all: err.message })

    } finally {
      // hideLoader()
    }

  })
})
