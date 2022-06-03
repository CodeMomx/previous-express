document.querySelector('.flip').addEventListener('click', flipCoin)
let wins = 0
function flipCoin(){
    console.log('flip')
    const prediction = document.querySelector('#headsTails').value
    const name = document.querySelector('.name').value
    let flip = Math.floor(Math.random() * 2)
    console.log(prediction,flip)
    if (prediction == 'heads' && flip === 1 ){
        wins-- 
    }
    else if (prediction == 'heads' && flip === 0 ){
        wins++ 
    }
    else if (prediction == 'tails' && flip === 1 ){
        wins++ 
    }
    else if (prediction == 'tails' && flip === 0 ){
        wins-- 
    }
    console.log(wins)
    fetch('showResults', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'name': name,
          'prediction': prediction,
          'wins': wins
        })
      })
    .then(res => {
        if(res.ok) return res.json()
    })
    .then((data) => {
        console.log(data)
        // window.location.reload(true)
        document.querySelector('h3').innerText = data.value.name+', '+'your score is '+data.value.wins
        
    }) 
} 
document.querySelector('.reset').addEventListener('click', newPlayer)
function newPlayer() {
    console.log('reset')
    const name = document.querySelector('.name').value
      fetch('flip', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'name': name
        })
      }).then(function (response) {
        window.location.reload()
      })
    };
