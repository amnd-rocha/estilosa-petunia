var screen = document.getElementById('screen'); // elemento da tela do nivel 1
screenLeft = screen.getBoundingClientRect().left;
screenRight = screen.getBoundingClientRect().right;
screenWidth = screen.getBoundingClientRect().width;
screenCenter = screenRight - screenWidth/2;

var itemsWearing = document.querySelectorAll('.outfit'); // lista com elementos vestidos pela boneca
var doll = itemsWearing[0]; // corpo da boneca


var dollWidth = doll.width; // largura da boneca
var dollX = 0; // pox x do canto superior esquerdo da boneca
//var dollCenter = dollX+doll.getBoundingClientRect().width/2; // pos x do centro do boneca

var vel = 25; // velocidade em que a boneca se desloca

var home = document.getElementById('home');
var level1 = document.getElementById('level1');
var level1Intro = document.getElementById('level1Intro');
var ending = document.getElementById('ending');

var page = 1; // define a pagina inicial
var loop = [];

var LEFT = false; 
var RIGHT = false;

///////////////////////////////////////////////////////////////////////////////////////////////////////

var itemsTotal = [];
for (let i=0; i<5; i++) {
  itemsTotal.push('acc'+i);
  itemsTotal.push('shoes'+i);
  itemsTotal.push('bottom'+i);
  itemsTotal.push('top'+i);
}


//Listas de looks
var outfit = ['acc0', 'shoes0', 'bottom0', 'top0'];

var outfitNum = 1;
var idealOutfit = [];

function generateOutfit() {
  idealOutfit = [];
  idealOutfit.push('acc'+outfitNum);
  idealOutfit.push('shoes'+outfitNum);
  idealOutfit.push('bottom'+outfitNum);
  idealOutfit.push('top'+outfitNum);
  return;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////
// Faz os objectos cairem

var slots = document.querySelectorAll('.slot'); // lista com elementos que ficam caindo

var objArray = [];
var objInitialY = 20;

var levelArray = [];;

function generateLevelArray() {
  levelArray = itemsTotal;
  for (let i=0; i<3; i++) { // determina as chances dos items do look ideal serem gerados
    for (let j=0; j<idealOutfit.length; j++) {
      levelArray.push(idealOutfit[j]);
    }
  }
  return;
}

function generateObject() {
  let vel = (Math.floor(Math.random() * 5) + 2)*5;
  let i = Math.floor(Math.random() * levelArray.length);
  let objId = levelArray[i];
  let obj = [objId, vel, objInitialY];
  for (let i=0; i<objArray.length; i++) {
    if (objArray[i][0] == objId) {
      obj = generateObject();
    }
  }
  return obj;
}

function generateObjArray() {
  objArray = [];
  for (let i=0; i<slots.length; i++) {
    objArray.push(generateObject());
  }
  return;
}

function moveObjects() {
  for (let i=0; i<objArray.length; i++) {
    if (objArray[i][2] > 500) {
      objArray[i] = generateObject();
    }
    objArray[i][2] += objArray[i][1];
  }
  return;
}



///////////////////////////////////////////////////////////////////////////////////////////////////////

//Veste um item específico
//Parametro: nome do item (ex: 'acc2', 'bottom3', etc)
function wear (item) {
  switch (true) {
    case item.includes('acc'): {
      outfit[0] = item;
      break;
    }
    case item.includes('shoes'): {
      outfit[1] = item;
      break;
    }
    case item.includes('bottom'): {
      outfit[2] = item;
      break;
    }
    case item.includes('top'): {
      outfit[3] = item;
      break;
    }
  }
  return;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

//Funcao que checa se o look vestido eh igual ao objetivo

function match() {
  for (let i=0; i<itemsWearing.length; i++) {
    if (outfit[i] != idealOutfit[i]) {
      return false;
    }
  }
  return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function moveDoll() {
  for (let i=0; i<itemsWearing.length; i++) {
    itemsWearing[i].style.left = dollX +'px';
  }
}

function gameLoop() {
  if (match()) { // o que fazer quando a boneca vestir o look desejado
    page = 4;
    refresh();
  }

  moveObjects();

  if (LEFT) {
    if (doll.getBoundingClientRect().left > level1.getBoundingClientRect().left+5) {
      dollX -= vel;
      moveDoll();
    }
  }
  if(RIGHT) {
    if (doll.getBoundingClientRect().right < level1.getBoundingClientRect().right-10) {
      dollX += vel;
      moveDoll();
    }
  }


  for (let i=0; i<outfit.length; i++) {
    itemsWearing[i+1].src = 'img/'+outfit[i]+'.png';
  }

  for (let i=0; i<slots.length; i++) {
    let obj = slots[i];
    obj.src = 'img/z'+objArray[i][0]+'.png';
    obj.style.top = objArray[i][2]+'px';
    let objY = obj.offsetTop + obj.height;
    let objCenter = obj.offsetLeft + obj.width/2;
    let dollCenter = doll.offsetLeft + dollWidth/2;
    if (objY > 370 && objY < 450 && objCenter < dollCenter+30 && objCenter > dollCenter-30) {
      wear(objArray[i][0]);
      objArray[i] = generateObject();
    }
  }
}

var finalMsg = document.getElementById('finalMsg');
var nextButton = document.getElementById('next');
var levelDescription = document.getElementById('levelDescription');
var levelNum = document.getElementById('levelNum');
var loading = document.getElementById('loading');
var loadingText = document.getElementById('loadingText');

var preview = document.querySelectorAll('.imgL1');
var bye = document.getElementById('bye');
var look = document.getElementById('look');

function refresh() {
  switch (true) {
    case page == 1: {
      loading.style.display = "flex";
      let images = [];
      let i = -1;
      while (i<itemsTotal.length) {
        i++;
        let img = new Image();
        img.src = "img/"+itemsTotal[1]+"png";
        images.push(img);
      }
      if (images.length >= itemsTotal.length) {
        loading.style.display = "none";
        home.style.display = 'flex';
        level1Intro.style.display = 'none';
        level1.style.display = 'none';
        ending.style.display = 'none';
      }
      break;
    }
    case page == 2: {
      
      preview[0].src = 'img/zacc'+outfitNum+'.png';
      preview[1].src = 'img/zbottom'+outfitNum+'.png';
      preview[2].src = 'img/ztop'+outfitNum+'.png';
      preview[3].src = 'img/zshoes'+outfitNum+'.png';
      

      home.style.display = 'none';
      level1Intro.style.display = 'flex';
      level1.style.display = 'none';
      ending.style.display = 'none';
      levelNum.textContent = outfitNum;
      if (outfitNum == 2) {
        levelDescription.textContent = 'Vista Petúnia para ir à feira medieval';
      }
      if (outfitNum == 3) {
        levelDescription.textContent = 'Vista Petúnia para ir ao show de rock.';
      }
      break;
    }
    case page == 3: {
      

      home.style.display = 'none';
      level1Intro.style.display = 'none';
      level1.style.display = 'flex';
      ending.style.display = 'none';
      dollX = 0;
      generateOutfit();
      generateLevelArray();
      generateObjArray();
      for (let i=0; i<slots.length; i++) {
        slots[i].src = 'img/z'+objArray[i][0]+'.png';
        slots[i].style.top = objArray[i][2]+'px';
      }
      loop = setInterval(gameLoop, 60);
      break;
    }
    case page == 4: {
      clearInterval(loop);
      home.style.display = 'none';
      level1Intro.style.display = 'none';
      level1.style.display = 'none';
      ending.style.display = 'flex';
      look.src = 'img/look'+outfitNum+'.png';
      if (outfitNum == 1) {
        finalMsg.innerHTML = 'Da cabeça até as pontas dos pés, <br/> esse look valeu nota dez!';
      }
      if (outfitNum == 2) {
        finalMsg.innerHTML = 'Quem negar cometerá calúnia: <br/> não há elfa mais estilosa que Petúnia!';
      }
      if (outfitNum == 3) {
        finalMsg.innerHTML = 'Até mais que o próprio show, <br/>Petúnia foi puro rock & roll!';
        nextButton.style.display = 'none';
        bye.style.display = 'flex';
        look.style.margin = 80+'px';
      }
      break;
    }
  }
  return;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////
// Configuracao dos botoes

var startButton = document.getElementById('start');
startButton.addEventListener('click', function handleStartClick() {
  page += 1;
  refresh();
});

var goButton = document.getElementById('go');
goButton.addEventListener('click', function handleGoClick() {
  page += 1;
  refresh();
});

var devButton = document.getElementById('dev');
devButton.addEventListener('click', function handleDevClick() {
  page += 1;
  refresh();
  playButton.style.display = 'none';
  pauseButton.style.display = 'inline-block';
});

var playButton = document.getElementById('play');
playButton.addEventListener('click', function handlePlayClick() {
  playButton.style.display = 'none';
  pauseButton.style.display = 'inline-block';
  loop = setInterval(gameLoop, 60);
});

var pauseButton = document.getElementById('pause');
pauseButton.addEventListener('click', function handlePauseClick() {
  pauseButton.style.display = 'none';
  playButton.style.display = 'inline-block';
  clearInterval(loop);
});

nextButton.addEventListener('click', function handlNextClick() {
  if (outfit == 3) {
    return;
  }
  page = 2;
  outfitNum += 1;
  refresh();
});




///////////////////////////////////////////////////////////////////////////////////////////////////////
// Atualiza a posicao da boneca

document.onkeydown = function(e) {
	if(e.code == 'ArrowLeft') LEFT = true;
	if(e.code == 'ArrowRight') RIGHT = true;
}

document.onkeyup = function(e) {
	if(e.code == 'ArrowLeft') LEFT = false;
	if(e.code == 'ArrowRight') RIGHT = false;
}


refresh();