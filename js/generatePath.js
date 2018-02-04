//Implementation of Hamiltonian Path algorithm due to
//Nathan Clisby, July 2012.

//Comments about the Markov chain used to generate paths
//* using backbiting move described in Secondary structures in long
//compact polymers, PHYSICAL REVIEW E 74, 051801 ͑2006, by Richard
//Oberdorf, Allison Ferguson, Jesper L. Jacobsen and Jan\'e Kondev
//* algorithm is believed to be ergodic, but this has not been proved.
//* current implementation is not the most efficient possible, O(N) for N
//step walks, which could be improved with more sophisticated data
//structure
//* heuristic used for decision that equilibrium distribution is being
//sampled from. This heuristic is quite conservative, but not certain.
//* currently using default random number generator. This should be `good
//enough' for generating typical walks, but shouldn't be replied upon for
//serious numerical work.

//Adapted to arbitrarily shaped sublattices - just have an 'accept' function
//Simplified reversal profcedure - just go through each step (O(N) to reverse, anyway)
//Different initialisation - start from a single point, incrementally add.
//Simplified checking of neighbours.

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function rgbColour(s, c1, c2) {
  const r = Math.floor(s * c1[0] + (1 - s) * c2[0])
  const g = Math.floor(s * c1[1] + (1 - s) * c2[1])
  const b = Math.floor(s * c1[2] + (1 - s) * c2[2])
  return `rgb(${r}, ${g}, ${b})`
}

function pickRandomXYMax() {
  const xYs = [
    [38, 18],
    [28, 13],
    [14,  6] 
  ]
  
  return xYs[getRandomInt(xYs.length)]
}

const quality = 1.0
var path = []

const [ xmax, ymax ] = pickRandomXYMax()

var n = (xmax + 1) * (ymax + 1)

var left_end = true

function inSublattice (x, y) {
  if (x < 0) return false
  if (x > xmax) return false
  if (y < 0) return false
  if (y > ymax) return false
  return true
}

function reversePath (i1, i2, path) {
  var jlim = (i2 - i1 + 1) / 2;
  var temp;
  for (var j = 0; j < jlim; j++) {
    temp = path[i1 + j]
    path[i1 + j] = path[i2 - j]
    path[i2 - j] = temp
  }
}

function backbiteLeft (step, n, path) {
  //choose left hand end
  var neighbour = [path[0][0] + step[0], path[0][1] + step[1]];
  //check to see if neighbour is in sublattice
  if (inSublattice(neighbour[0], neighbour[1])) {
    //Now check to see if it's already in path
    var inPath = false;
    for (var j = 1; j < n; j += 2) {
      if (neighbour[0] == path[j][0] && neighbour[1] == path[j][1]) {
        inPath = true;
        break;
      }
    }
    if (inPath) {
      reversePath(0, j - 1, path);
    } else {
      left_end = !left_end;
      reversePath(0, n - 1, path);
      n++;
      path[n - 1] = neighbour;
    }
  }
  
  return n;
}

function backbiteRight (step, n, path) {
  //choose right hand end
  var neighbour = [path[n - 1][0] + step[0], path[n - 1][1] + step[1]];
  //check to see if neighbour is in sublattice
  if (inSublattice(neighbour[0], neighbour[1])) {
    //Now check to see if it's already in path
    var inPath = false;
    //for (j=n-2; j>=0; j--)
    for (var j = n - 2; j >= 0; j -= 2) {
      //if (neighbour == path[j])
      if (neighbour[0] == path[j][0] && neighbour[1] == path[j][1]) {
        inPath = true;
        break;
      }
    }
    if (inPath) {
      reversePath(j + 1, n - 1, path);
    } else {
      n++;
      path[n - 1] = neighbour;
    }
  }
  
  return n;
}

//Slightly more sophisticated, only reversing if new site found
function backbite (n, path) {

  //choose a random end
  //choose a random neighbour
  //check if its in the sublattice
  //check if its in the path
  //if it is - then reverse loop
  //if it is not - add it to the end
  //the right hand end is always chosen
  //Choose a random step direction
  var step;
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      step = [1, 0];
      break;
    case 1:
      step = [-1, 0];
      break;
    case 2:
      step = [0, 1];
      break;
    case 3:
      step = [0, -1];
      break;
  }
  if (Math.floor(Math.random() * 2) == 0) {
    n = backbiteLeft(step, n, path);
  } else {
    n = backbiteRight(step, n, path);
  }
  return n;
}

function generateHamiltonianCircuit(quality) {
  const path = generateHamiltonianPath(quality)

  const minDist = 1 + (n % 2)
  while (
    Math.abs(path[n-1][0] - path[0][0]) +
    Math.abs(path[n-1][1] - path[0][1]) != minDist
  ) {
    n = backbite(n,path);
  }
  
  return path
}

function generateHamiltonianPath(quality) {
  // initialize path
  path[0] = [
    Math.floor(Math.random() * (xmax + 1)),
    Math.floor(Math.random() * (ymax + 1))
  ]
  
  n = 1

  var nattempts =
    1 +
    quality *
      10.0 *
      (xmax + 1) *
      (ymax + 1) *
      Math.pow(Math.log(2 + (xmax + 1) * (ymax + 1)), 2);
  
  while (n < (xmax + 1) * (ymax + 1)) {
    for (var i = 0; i < nattempts; i++) {
       n = backbite(n, path);
    }
  }
  
  return path
}

function generatePath () {
  const path = generateHamiltonianCircuit(quality)
  return [n, xmax, ymax, path]
}

module.exports = generatePath