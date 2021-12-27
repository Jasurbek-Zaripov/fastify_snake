//schema user =============================================================================================
let geteway = {
  [MY_ID_TO_SNAKE]: {
    username: name_promp,
    snake_len: 1,
    kill: false,
    snake_cor: [15, 25],
  },
}
//end schema ==============================================================================================

window.onbeforeunload = async function (event) {
  let message = '\n\n\nchiqmoqchimisiz?'
  if (typeof event == 'undefined') {
    event = window.event
  }
  if (event) {
    await kill_snake()
    event.returnValue = message
  }
  return message
}

//HTML ELEMENTS ===========================================================================================
const body = document.querySelector('body')
const users_list = document.querySelector('#users')
const menu = document.querySelector('.hamburger')
const li_group = document.querySelector('.container')

menu.onclick = () => {
  users_list.classList.toggle('block')
}
//end HTML ELEMENTS =======================================================================================

//any variable ========================================================================
let gen_ = [],
  MOVE_SPEED = 150,
  x = 0,
  y = 0,
  LEFT = false,
  RIGHT = false,
  UP = true,
  DOWN = false,
  ilon_yurdimi = false
//end any variable ====================================================================

//create a playground =====================================================================================
let playground_li = 34,
  playground_span = 69

for (let i = 0; i <= playground_li; i++) {
  let li = document.createElement('li')
  for (let j = 0; j <= playground_span; j++) {
    let span = document.createElement('span')
    li.append(span)
  }
  li_group.append(li)
}
//end playground ==========================================================================================
id_eat()

//interaval for move ==================================================================
let id = setInterval(() => {
  ilon_yurdimi = true
  if (LEFT) {
    y--
  } else if (RIGHT) {
    y++
  } else if (UP) {
    x--
  } else if (DOWN) {
    x++
    ilon_yurdimi = true
  }
  move_snake()
}, MOVE_SPEED)
//end interval ========================================================================

//event for keyboard ======================================================================================
body.onkeyup = eve => {
  TRUE_FALSE(eve.keyCode)
}
//end event keyboard ======================================================================================

//event for mobile ====================================================================
let clientX, clientY

body.addEventListener(
  'touchstart',
  function (e) {
    // Cache the client X/Y coordinates
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  },
  false
)

body.addEventListener(
  'touchend',
  function (e) {
    let deltaX, deltaY

    deltaX = clientX - e.changedTouches[0].clientX
    deltaY = clientY - e.changedTouches[0].clientY

    if (deltaX > 50 && deltaX > deltaY && (deltaY >= -20 || deltaY <= 20)) {
      TRUE_FALSE(37) //left
    } else if (
      deltaX < -50 &&
      deltaX < deltaY &&
      (deltaY >= -20 || deltaY <= 20)
    ) {
      TRUE_FALSE(39) //right
    } else if (
      deltaY > 50 &&
      deltaX < deltaY &&
      (deltaX >= -20 || deltaX <= 20)
    ) {
      TRUE_FALSE(38) //up
    } else if (
      deltaY < -50 &&
      deltaX > deltaY &&
      (deltaX >= -20 || deltaX <= 20)
    ) {
      TRUE_FALSE(40) //down
    }
  },
  false
)
//end event mobile ====================================================================

async function move_snake() {
  if (y > playground_span) y = 0
  if (y < 0) y = playground_span
  if (x > playground_li) x = 0
  if (x < 0) x = playground_li

  //TO FINISH =====================================================
  if (
    li_group.children[x].children[y].style.backgroundColor &&
    !geteway[MY_ID_TO_SNAKE]['kill']
  ) {
    await kill_snake()
    let madal = document.querySelector('#madal')
    let ha = document.querySelector('#madal > div > div > b:nth-child(1)')
    let yoq = document.querySelector('#madal > div > div > b:nth-child(2)')
    madal.className = 'block'
    ha.onclick = () => {
      madal.className = ''
      geteway[MY_ID_TO_SNAKE]['kill'] = false
      geteway[MY_ID_TO_SNAKE]['snake_cor'] = [0, 0]
      geteway[MY_ID_TO_SNAKE]['snake_len'] = 1
    }
    yoq.onclick = () => {
      madal.className = ''
      geteway[MY_ID_TO_SNAKE]['kill'] = true
      geteway[MY_ID_TO_SNAKE]['snake_cor'] = []
      localStorage.removeItem('object_for_snake_game')
    }
  }
  //end to finish =================================================

  // ATE
  if (x == gen_[0] && y == gen_[1]) {
    geteway[MY_ID_TO_SNAKE]['snake_len']++
    li_group.children[gen_[0]].children[gen_[1]].id = ''
    id_eat()
  }

  //new cordinate
  geteway[MY_ID_TO_SNAKE]['snake_cor'] = [x, y]

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++
  let data = await fetch(`/${MY_ID_TO_SNAKE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(geteway[MY_ID_TO_SNAKE]),
  })
  data = await data.json()

  if (data['ERROR']) return alert(data['ERROR'])

  geteway = data

  users_list.innerHTML = null
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++

  //all user cordinates
  for (const key_user_id in geteway) {
    const obj_cordinate = geteway[key_user_id]

    if (!obj_cordinate['snake_len'] || !obj_cordinate['snake_cor'].length)
      continue
    let [o, n] = obj_cordinate['snake_cor']

    if (users_list.classList.contains('block')) {
      let p = document.createElement('p')
      p.style.backgroundColor = '#' + key_user_id
      p.innerHTML =
        '<i>' +
        obj_cordinate['username'] +
        ':</i><b>' +
        obj_cordinate['snake_len'] +
        '</b> ' +
        (obj_cordinate['kill'] ? ' Killed' : '')

      users_list.append(p)
    }

    if (obj_cordinate['kill']) continue

    li_group.children[+o].children[+n].className = 'snake_head'
    if (obj_cordinate['snake_len'] < 5) {
      li_group.children[+o].children[+n].textContent =
        '  ' + obj_cordinate['username']
    }
    //unique color
    li_group.children[+o].children[+n].style.backgroundColor = '#' + key_user_id

    setTimeout(() => {
      if (obj_cordinate['snake_len'] < 6) {
        li_group.children[+o].children[+n].textContent = null
      }
      li_group.children[+o].children[+n].className = 'snake_body'
    }, MOVE_SPEED + 0.2)
    //cleaning after walking
    setTimeout(() => {
      li_group.children[+o].children[+n].className = ''
      li_group.children[+o].children[+n].style.backgroundColor = ''
    }, (MOVE_SPEED + 0.5) * obj_cordinate['snake_len'])
  }
}

//generator eat
function id_eat() {
  try {
    gen_ = gen_fun()
    li_group.children[gen_[0]].children[gen_[1]].id = 'eat'
  } catch (err) {
    console.log(err)
  }
}

//random cordinate for eat
function gen_fun() {
  while (true) {
    let random_x = parseInt(Math.random() * (playground_li + 1))
    let random_y = parseInt(Math.random() * (playground_span + 1))
    if (
      geteway[MY_ID_TO_SNAKE]['snake_cor'][0] != random_x &&
      geteway[MY_ID_TO_SNAKE]['snake_cor'][1] != random_y
    ) {
      return [random_x, random_y]
    }
  }
}

function TRUE_FALSE(key_code) {
  if (!ilon_yurdimi) return
  ilon_yurdimi = false
  if (key_code == 37) {
    if (RIGHT) return

    LEFT = true
    UP = false
    DOWN = false
  } else if (key_code == 39) {
    if (LEFT) return

    RIGHT = true
    UP = false
    DOWN = false
  } else if (key_code == 38) {
    if (DOWN) return

    UP = true
    LEFT = false
    RIGHT = false
  } else if (key_code == 40) {
    if (UP) return

    DOWN = true
    LEFT = false
    RIGHT = false
  }
}
async function kill_snake(bool = true, cor = []) {
  geteway[MY_ID_TO_SNAKE]['kill'] = bool
  geteway[MY_ID_TO_SNAKE]['snake_cor'] = cor
  await fetch(`/${MY_ID_TO_SNAKE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(geteway[MY_ID_TO_SNAKE]),
  })
}
