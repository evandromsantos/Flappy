function novoElemento(tagName, className) { // Função construtora que cria novos elementos
    const elemento = document.createElement(tagName) // Cria novo elemento indicando o tagName
    elemento.className = className // Indica que o elemento recebe uma class
    return elemento // Retorna o elemento criado
}

function Barreira(reversa = false) { // Função para criar as barreiras
    // Cria uma nova barreira
    this.elemento = novoElemento('div', 'barreira') // Indica que o novo elemento vai ser uma 'div' e recebe a class 'barreira' 

    const borda = novoElemento('div', 'borda') // Cria um novo elemento de 'div' que será a borda -> Entrada do cano
    const corpo = novoElemento('div', 'corpo') // Cria um novo elemento de 'div' que será o corpo -> corpo do cano
    this.elemento.appendChild(reversa ? corpo : borda) // Se for reversa for verdadeiro = Primeiro corpo, depois borda -> topo
    this.elemento.appendChild(reversa ? borda : corpo) // Se for reversa for falso = Primeiro borda, depois corpo -> fim

    this.setAltura = altura => corpo.style.height = `${altura}px` // Para setar a altura da barreira
}

/* const barreira1 = new Barreira(false)
barreira1.setAltura(200)
document.querySelector('[wm-flappy]').appendChild(barreira1.elemento) */

function ParDeBarreiras(altura, abertura, x) { // Função construtora que cria o par de barreiras
    this.elemento = novoElemento('div', 'par-de-barreiras') // Cria um novo elemento 'div' com a class 'par-de-barreiras'

    this.superior = new Barreira(true) // Cria uma barreira no topo
    this.inferior = new Barreira(false) // Cria uma barreira em baixo

    this.elemento.appendChild(this.superior.elemento) // Adiciona o elemento na parte superior
    this.elemento.appendChild(this.inferior.elemento) // Adiciona o elemento na parte inferior

    this.sortearAbertura = () => { // Função para passar a altura e a abertura das barreiras
        const alturaSuperior = Math.random() * (altura - abertura) // Irá gerar um número random para a altura superior = vai subtrair altura e abertura
        const alturaInferior = altura - abertura - alturaSuperior // Para altura inferior ira subtrair a altura, abertura e a altura superior
        this.superior.setAltura(alturaSuperior) // Para setar a altura superior
        this.inferior.setAltura(alturaInferior) // Para setar a altura inferior
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]) // Função para retornar o valor X da barreira
    this.setX = x => this.elemento.style.left = `${x}px` // Função para setar o valor em px para o left que está no style (X = left 0)
    this.getLargura = () => this.elemento.clientWidth // Função para pegar a largura do elemento

    this.sortearAbertura() // Chama a função que sorteia a abertura
    this.setX(x) // chama a função para setar o valor de 'x', passando 'x' como parâmetro
}

/* const barreira1 = new ParDeBarreiras(700, 200, 400) // Cria um novo par de barreiras, indicado as alturas requeridas 
document.querySelector('[wm-flappy]').appendChild(barreira1.elemento) */ // Seleciona a 'div' que irá adicionar as barreiras e adiciona a 'barreira1' que foi criada

function Barreiras(altura, largura, abertura, espaco, notificarPonto) { // Função para criar todas as barreiras
    this.pares = [ // Array com os pares de barreiras
        new ParDeBarreiras(altura, abertura, largura), // 1 
        new ParDeBarreiras(altura, abertura, largura + espaco), // 2 
        new ParDeBarreiras(altura, abertura, largura + espaco * 2), // 3
        new ParDeBarreiras(altura, abertura, largura + espaco * 3) // 4
    ]

    const deslocamento = 3 // Deslocamento inicial
    this.animar = () => { // Função para criar a animação
        this.pares.forEach(par => { // forEach no array de barreiras
            par.setX(par.getX() - deslocamento) // Setando novo valor para o eixo X - o deslocamento, para as barreiras começarem a se deslocar

            // Quando o elemento sair da área do jogo
            if (par.getX() < -par.getLargura()) { // Se o valor do eixo X (X = left 0) for menos que a largura do jogo
                par.setX(par.getX() + espaco * this.pares.length) // Irá setar um novo valor para o eixo X, calculando o valor de 'X' + o 'espaço' entre as barreiras * o array de barreiras(que contém 4 pares de barreiras) -> Que irá fazer as barreiras resetarem(ou criar um loop)
                par.sortearAbertura() // Para sortear novamente os valores de altura e abertura
            }

            // Para a soma dos pontos
            const meio = largura / 2 // Cria uma constante para salvar o meio da tela do jogo
            const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio // Cria uma constante cruzouOMeio, indicando que X + deslocamento >= meio e X < meio, é ponto

            if (cruzouOMeio) notificarPonto() // Se cruzouOMeio for verdade, irá somar ponto
        })
    }
}

function Passaro(alturaJogo) { // Função para criar e animar o pássaro
    let voando = false // Variável que vai controlar o voo do pássaro

    this.elemento = novoElemento('img', 'passaro') // Cria um novo elemento (no caso o pássaro)
    this.elemento.src = 'imgs/passaro.png' // Passa o diretório da imagem

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0]) // Função para retornar o valor Y do pássaro
    this.setY = y => this.elemento.style.bottom = `${y}px` // Função para setar o valor em px para o Y do pássaro

    window.onkeydown = evento => voando = true // Cria um evento de tecla precionada e muda a variável 'voando' para true
    window.onkeyup = evento => voando = false // Cria um evento de soltar a tecla e muda a variável 'voando' para false

    this.animar = () => { // Função que vai animar o pássaro
        const novoY = this.getY() + (voando ? 8 : -5) // constante que irá salvar os valores de 'down' e 'up' = Se voando for true calc +8, se for false calc -5
        const alturaMaxima = alturaJogo - this.elemento.clientHeight // Cria uma altura maxima para o pássaro voar no jogo -> Passando a altura do jogo - a altura do pássaro

        // Cria uma restrição para o pássaro não ir para abaixo do chão e nem acima do topo
        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2) // Para definir a posição inicial do pássaro -> altura do jogo / por 2
}

function Progresso() { // Função para criar a pontuação do jogo
    this.elemento = novoElemento('span', 'progresso') // Cria um novo elemento 'span'
    this.atualizarPontos = pontos => { // Função para atualizar os pontos 
        this.elemento.innerHTML = pontos // Indicando para o elemento 'span' receber os pontos
    }
    this.atualizarPontos(0) // Iniciando os pontos em 0
}

function estaoSobrepostos(elementoA, elementoB) {
    const elemA = elementoA.getBoundingClientRect() // Retangulo associado ao elemento A
    const elemB = elementoB.getBoundingClientRect() // Retangulo associado ao elemento B

    const horizontal = elemA.left + elemA.width >= elemB.left && elemB.left + elemB.width >= elemA.left
    const vertical = elemA.top + elemA.height >= elemB.top && elemB.top + elemB.height >= elemA.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras) { // Função para checar se teve colisão
    let colidiu = false // Variável que vai controlar a colisão -> Inicia no false
    barreiras.pares.forEach(parDeBarreiras => { // ForEach para checar cada barreira
        if (!colidiu) { // Se não teve colisão 
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior) || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}

function FlappyBird() { // Função que irá representar o jogo
    let pontos = 0 // Variável que irá receber os pontos (inicia com 0)

    const areaDoJogo = document.querySelector('[wm-flappy]') // Seleciona a área do jogo
    const altura = areaDoJogo.clientHeight // Salva a altura do jogo
    const largura = areaDoJogo.clientWidth // Salva a largura do jogo

    const progresso = new Progresso() // Cria o progresso (pontos)
    const barreiras = new Barreiras(altura, largura, 200, 400, // Cria as barreiras 
        () => progresso.atualizarPontos(++pontos)) // Cria uma função para incrementar os pontos
    const passaro = new Passaro(altura) // Cria o passaro

    areaDoJogo.appendChild(progresso.elemento) // Adiciona o 'span' que mostra os pontos
    areaDoJogo.appendChild(passaro.elemento) // Adiciona o passaro na área do jogo 
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento)) // Cria um forEach para adicionar todas as barreiras na área do jogo

    this.start = () => {
        // loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animar() // Inicia a animação das barreiras
            passaro.animar() // Inicia a animação do pássaro

            if (colidiu(passaro, barreiras)) { // Se acontecer a colisão
                clearInterval(temporizador) // Irá parar o jogo
            }
        }, 20)
    }
}
new FlappyBird().start()