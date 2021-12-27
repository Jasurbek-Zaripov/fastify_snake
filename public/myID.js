let localOBJECT = JSON.parse(
  localStorage.getItem('object_for_snake_game') || '{}'
)
let name_promp
let MY_ID_TO_SNAKE

if (!localOBJECT['name_promp']) {
  name_promp = prompt('Please\n--> Enter your name! <--', '')
  MY_ID_TO_SNAKE = ('' + Date.now()).slice(-6)

  localStorage.setItem(
    'object_for_snake_game',
    JSON.stringify({
      name_promp,
      MY_ID_TO_SNAKE,
    })
  )
} else {
  name_promp = localOBJECT['name_promp']
  MY_ID_TO_SNAKE = localOBJECT['MY_ID_TO_SNAKE']
}
