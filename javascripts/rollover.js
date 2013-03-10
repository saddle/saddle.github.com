Rollimage = new Array()

Rollimage[0] = new Image()
Rollimage[0].src = "images/map.png"

Rollimage[1] = new Image()
Rollimage[1].src = "images/userguide_over.png"

Rollimage[2] = new Image()
Rollimage[2].src = "images/documentation_over.png"

Rollimage[3] = new Image()
Rollimage[3].src = "images/github_over.png"

function AllOff(){
  document.Buttons.src = Rollimage[0].src;
  return true;
}

function OneOn(){
  document.Buttons.src = Rollimage[1].src;
  return true;
}

function TwoOn(){
  document.Buttons.src = Rollimage[2].src;
  return true;
}

function ThreeOn(){
  document.Buttons.src = Rollimage[3].src;
  return true;
}
