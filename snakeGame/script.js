const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const currentScore = document.querySelector('.current-value')
const finalScore = document.querySelector('.finalCurrent-score > span')
const highScore = document.querySelector('.high-value')
const finalHighScore = document.querySelector('.finalHigh-score > span')
const menu = document.querySelector('.game-over')
const buttonPlay = document.querySelector('.tryAgain_button')

const size = 20;

const inicialPosition = { x: 200, y: 200 }

let snake = [inicialPosition]

let savedHighScore = localStorage.getItem('high-value') || 0
highScore.innerText = savedHighScore

const incrementScore = () => {
    currentScore.innerText = +currentScore.innerText + 1
}

const uptadeHighScore = () => {
    let current = parseInt(currentScore.innerText);
        let high = parseInt(savedHighScore); 
    
        if (current > high) {
            savedHighScore = current; 
            localStorage.setItem('high-score', savedHighScore); 
    
            highScore.innerText = savedHighScore;
            finalHighScore.innerText = savedHighScore;
        }
   
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 20) * 20
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: "#F63643"
}

let direction, loopId

const drawFood = () => {
    const { x, y, color} = food

    ctx.fillStyle = food.color
    ctx.fillRect(food.x, food.y, size, size)
}

const drawSnake = () => {
    ctx.fillStyle = "#9ec027";
    
    snake.forEach((position, index) => {
        if (index == snake.length - 1){
            ctx.fillStyle = "#92b712"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if(!direction) return

    const head = snake[snake.length - 1];

    if(direction == "right") {
        snake.push({x: head.x + size, y: head.y})
    }

    if(direction == "left") {
        snake.push({x: head.x - size, y: head.y})
    }

    if(direction == "down") {
        snake.push({x: head.x, y: head.y + size})
    }

    if(direction == "up") {
        snake.push({x: head.x, y: head.y - size})
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#d5ea84";

    for (let i = 20; i < canvas.width; i += 20) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 400)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(400, i)
        ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size 
    const neckIndex = snake.length - 2

    const wallCollision = 
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })
    

    if (wallCollision || selfCollision) {
       gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = currentScore.innerText
    uptadeHighScore()
    canvas.style.filter = "blur(2px)"
}

const gameLoop = ()=> {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 400, 400)
    drawGrid()
    drawFood()
    drawSnake()
    moveSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    currentScore.innerText = "0"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [inicialPosition]
})