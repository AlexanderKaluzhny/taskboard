import $ from 'jquery';

// --------------------------------------------------------------------
//    Helpers
// --------------------------------------------------------------------
// CSRF helper functions taken directly from Django docs
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/i.test(method);
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = $.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function ajaxCsrfSetup(xhr, settings) {
  if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
    // Send the token to same-origin, relative URLs only.
    // Send the token only if the method warrants CSRF protection
    // Using the CSRFToken value acquired earlier
    const csrftoken = getCookie("csrftoken");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
  }
}