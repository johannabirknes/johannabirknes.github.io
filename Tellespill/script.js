//Henter elementer fra DOM
let numberBox = document.querySelector(".number-box")
let reglerP = document.createElement("p")
let timeElement = document.getElementById("timer")

//Oppretter regel of nytt-spill knapp og gir de ID og tekst
let reglerBtn = document.createElement("button")
reglerBtn.id = "regler"
reglerBtn.textContent = "Regler"
numberBox.appendChild(reglerBtn)

let nyttSpillBtn = document.createElement("button")
nyttSpillBtn.id = "nyttSpill"
nyttSpillBtn.textContent = "Start spill"
numberBox.appendChild(nyttSpillBtn)

//Funksjon for å lagre high-scores i local storage
function lagreTid(tid) {
  //Henter high-scores fra local storage, eller lager et tomt array dersom det ikke finnes noen
  let highScores = JSON.parse(localStorage.getItem("highScores")) || []
  highScores.push(tid)
  //Sorterer high-score listen i stigende rekkefølge, og dersom det er mer enn 5 tider fjernes den tregeste
  highScores.sort((a, b) => a - b)
  if (highScores.length > 5) {
    highScores.pop()
  }
  //Lagrer arrayet i local storage
  localStorage.setItem("highScores", JSON.stringify(highScores))
}

//Henter high-scores, eller lager tomt array
let highScores = JSON.parse(localStorage.getItem("highScores")) || []
//Velger t-body elementene i high-score tabellen og fjerner alle verdiene
let tableBody = document.querySelector("#highscore-table tbody")
tableBody.innerHTML = ""

//Går gjennom high-score arrayet og legger til tidene i tabellen
highScores.forEach((tid, index) => {
  if (index >= 5) {
    return
  }
  let row = document.createElement("tr")
  let rankingCell = document.createElement("td")
  rankingCell.textContent = index + 1
  let tidCell = document.createElement("td")
  tidCell.textContent = tid + " sek"
  row.appendChild(rankingCell)
  row.appendChild(tidCell)
  tableBody.appendChild(row)
})

//Legger til en eventlistner på regel-knappen slik at reglene vises når den blir trykket å
reglerBtn.addEventListener("click", () => {
  reglerBtn.style.display = "none"
  reglerP.id = "reglerP";
  reglerP.textContent = "Spillet starter ved å trykke på Start spill- knappen. Trykk på tallene 1-10 så raskt som mulig.";
  numberBox.appendChild(reglerP);
})

//Funksjon som starter spillet når "nytt spill" knappen trykkes på
nyttSpillBtn.addEventListener("click", () => {
  //Skuler knappene og viser "numberBox"
  numberBox.style.display = "block"
  nyttSpillBtn.style.display = "none"
  reglerBtn.style.display="none"
  reglerP.classList.add("hide")
  //Kaller på startTimer funksjonen som starter klokken
  startTimer()

  //Oppretter en tom liste og et todimensjonalt rutenett med alle verdier til false
  let numberList = []
  let grid = new Array(380).fill(0).map(() => new Array(380).fill(false)) 

  // Lager 10 posisjoner for tallene og setter posisjonen til true
  while (numberList.length < 10) {
    let x = Math.floor(Math.random() * 320) + 40
    let y = Math.floor(Math.random() * 320) + 40
    let isPositionValid = true
    
    // Sjekker om posisjonen er opptatt eller er for nære en annen posisjon ved å iterere gjennm alle cellene i en firkant rundt posisjonen
    for (let i = x - 20; i <= x + 20; i++) {
      for (let j = y - 20; j <= y + 20; j++) {
        if (grid[i][j]) {
          //Dersom posisjonen er for nære en celle som har verdi "true" blir "isPositionValid" satt til "false" og løkken går på nytt
          isPositionValid = false
          break
        }
      }
      if (!isPositionValid) {
        break
      }
    }
    
    // Dersom posisjonen er gyldig, legges den til i listen og alle cellene i det firkantede området rundt posisjonen blir satt til "true"
    if (isPositionValid) { 
      for (let i = x - 20; i <= x + 20; i++) {
        for (let j = y - 20; j <= y + 20; j++) {
          grid[i][j] = true
        }
      }
      //Posisjonen konverteres til en string og legges til i number-list
      let position = x + "," + y
      numberList.push(position)
    }
  }
  
  // Går gjennom alle tallene og sjekker at riktig tall er trykket på
  let listElement = document.getElementById("number-list")
  //Setter variabelen til å være lik 0
  let currentNumberIndex = 0

  // En løkke som går gjennom alle 10 tallene og lager en HTML-listeelement (li) for hvert tall.
  for (let i = 0; i < 10; i++) {
    // Henter posisjonen til tallet fra numberList-arrayet 
    let position = numberList[i].split(",")
    let listItem = document.createElement("li")

    // Setter posisjonen til listeelementet til å være den hentede posisjonen
    listItem.style.top = position[0] + "px"
    listItem.style.left = position[1] + "px"

    //Legger til teksten(tallet) i listen, først 1 så 2 osv...
    listItem.textContent = i+1

    //Alle listeelementene får en clickevent 
    listItem.addEventListener("click", () => {
      //Sjekker om riktig tall blir trykket på
      if (parseInt(listItem.textContent) === currentNumberIndex + 1) {
        //Er tallet (currentNumberIndex + 1) skjules det og øker den med 1
        listItem.style.display = "none"
        currentNumberIndex++
      }
      //Når currentNumberIndex er lik med 10 stoppes tiden, den kan bli lagret i local storage og "Nytt Spill" knappen dukker opp
      if (currentNumberIndex === 10) {
        clearInterval(intervalId)
        
        lagreTid((timeElapsed / 1000).toFixed(1))

        nyttSpillBtn.style.display = "block"
        nyttSpillBtn.textContent = "Nytt spill"
      }
    })
    listElement.appendChild(listItem)
  }
  
})

//Lager en tidtaker som forteller hvor lang tid man har brukt, den starter på 0
let timeElapsed = 0
function startTimer() {
  //Setter starttiden til nåværende tidspunkt
  startTime = Date.now()
  //Oppretter en interval-funksjon som kjøres hvert 100 millisekund
  intervalId = setInterval(() => {
    //Regner ut hvor lang tid det har gått 
    timeElapsed = Date.now() - startTime

    //Regner om tiden til antall sekunder med én desimal
    let secondsElapsed = (timeElapsed / 1000).toFixed(1)
    timeElement.textContent = secondsElapsed + " sek"
  }, 100)
}


