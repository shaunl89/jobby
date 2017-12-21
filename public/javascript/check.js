$(document).ready(function () {
  let socket = io()
  let messages = []
  let chatForm = $('#chatForm')
  let message = $('#chatInput')
  let chatWindow = $('#chatWindow')
  let userForm = $('#userForm')
  let username = $('#username')
  let users = $('#users')
  let error = $('#error')
  let isTyping = $('#isTyping')

  // submit user form
  userForm.on('submit', (e) => {
    socket.emit('set user', username.val(), function (data) {
      if (data) {
        $('#userFormWrap').hide()
        // $('#mainWrap').show()
        error.html('')
      } else {
        error.html('<strong>Username is taken</strong>')
      }
    })
    e.preventDefault()
  })

  // is typing....
  chatForm.on('keyup', (e) => {
    if (e.keyCode !== 13) {
      socket.emit('typing', () => {})
    }
  })

  socket.on('isTyping', (data) => {
    isTyping.empty()
    isTyping.append('<strong>' + data.user + '</strong> ' + data.msg + '<br>')
  })

  // submit chat form
  chatForm.on('submit', (e) => {
    let msg = message.val()
    if (!msg.trim().length) {
      alert('dei! type something!')
      // chatWindow.append('<strong>' + data.user + ':</strong> ' + 'didn\'t type jackshit' + '<br>')
    } else {
      socket.emit('send message', message.val())
      message.val('')
      e.preventDefault()
    }
  })

  socket.on('show message', (data) => {
    chatWindow.append('<strong>' + data.user + ':</strong> ' + data.msg + '<br>')
    isTyping.empty()
  })

  // display usernames
  socket.on('users', function (data) {
    let html = ''
    for (let i = 0; i < data.length; i++) {
      html += '<li class="list-group-item">' + data[i] + '</li>'
    }
    users.html(html)
  })
})
