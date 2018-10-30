// all this code is shamelessly stolen from Nathan Clisby: http://clisby.net/projects/hamiltonian_path/

function rgbColour (s, c1, c2) {
  const r = Math.floor(s * c1[0] + (1 - s) * c2[0])
  const g = Math.floor(s * c1[1] + (1 - s) * c2[1])
  const b = Math.floor(s * c1[2] + (1 - s) * c2[2])
  return `rgb(${r}, ${g}, ${b})`
}

function pickRandomXYMax () {
  const xYs = [
    [34,  18],
    [30,  16],
    [26,  14],
    [23,  12],
    [19,  10],
    [16,  8],
    [12,  6],
    [9,  4],
    [5,  2]
  ]
  
  const randomIndex = Math.floor(Math.random() * Math.floor(xYs.length))
  
  return xYs[randomIndex]
}

const quality = 1.0
let path = []
let xmax
let ymax
let n
let leftEnd

function inSublattice (x, y) {
  if (x < 0) return false
  if (x > xmax) return false
  if (y < 0) return false
  if (y > ymax) return false
  return true
}

function reversePath (i1, i2, path) {
  const jlim = (i2 - i1 + 1) / 2;
  let temp
  for (var j = 0; j < jlim; j++) {
    temp = path[i1 + j]
    path[i1 + j] = path[i2 - j]
    path[i2 - j] = temp
  }
}

function backbiteLeft (step, n, path) {
  // choose left hand end
  const neighbour = [path[0][0] + step[0], path[0][1] + step[1]]
  // check to see if neighbour is in sublattice
  if (inSublattice(neighbour[0], neighbour[1])) {
    // now check to see if it's already in path
    let inPath = false
    for (var j = 1; j < n; j += 2) {
      if (neighbour[0] == path[j][0] && neighbour[1] == path[j][1]) {
        inPath = true
        break
      }
    }
    if (inPath) {
      reversePath(0, j - 1, path)
    } else {
      leftEnd = !leftEnd;
      reversePath(0, n - 1, path)
      n++;
      path[n - 1] = neighbour
    }
  }
  
  return n
}

function backbiteRight (step, n, path) {
  // choose right hand end
  const neighbour = [path[n - 1][0] + step[0], path[n - 1][1] + step[1]]
  // check to see if neighbour is in sublattice
  if (inSublattice(neighbour[0], neighbour[1])) {
    // now check to see if it's already in path
    let inPath = false
    for (var j = n - 2; j >= 0; j -= 2) {
      if (neighbour[0] == path[j][0] && neighbour[1] == path[j][1]) {
        inPath = true
        break
      }
    }
    if (inPath) {
      reversePath(j + 1, n - 1, path)
    } else {
      n++
      path[n - 1] = neighbour
    }
  }
  
  return n;
}

function backbite (n, path) {
  // choose a random end
  // choose a random neighbour
  // check if its in the sublattice
  // check if its in the path
  // if it is - then reverse loop
  // if it is not - add it to the end
  // the right hand end is always chosen
  // choose a random step direction
  
  let step
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      step = [1, 0]
      break
    case 1:
      step = [-1, 0]
      break
    case 2:
      step = [0, 1]
      break
    case 3:
      step = [0, -1]
      break
  }
  
  if (Math.floor(Math.random() * 2) == 0) {
    n = backbiteLeft(step, n, path)
  } else {
    n = backbiteRight(step, n, path)
  }
  
  return n
}

function generateHamiltonianCircuit(quality) {
  const path = generateHamiltonianPath(quality)

  const minDist = 1 + (n % 2)
  while (
    Math.abs(path[n-1][0] - path[0][0]) +
    Math.abs(path[n-1][1] - path[0][1]) != minDist
  ) {
    n = backbite(n,path)
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

  var nattempts = (
    1 +
    quality *
      10.0 *
      (xmax + 1) *
      (ymax + 1) *
      Math.pow(Math.log(2 + (xmax + 1) * (ymax + 1)), 2)
  )
  
  while (n < (xmax + 1) * (ymax + 1)) {
    for (var i = 0; i < nattempts; i++) {
       n = backbite(n, path)
    }
  }
  
  return path
}

function generatePath () {
  [ xmax, ymax ] = pickRandomXYMax()
  n = (xmax + 1) * (ymax + 1)
  leftEnd = true
  path = []
  path = generateHamiltonianCircuit(quality)
  return [n, xmax, ymax, path]
}

module.exports = generatePath