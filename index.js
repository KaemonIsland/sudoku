// Returns a new shuffled array
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5)

// console.log(shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]))

const buildEmptyBoard = () => {
  const newBoard = []

  for (let i = 0; i < 9; i++) {
    const row = []
    for (let i = 0; i < 9; i++) {
      row.push({ value: 0 })
    }
    newBoard.push(row)
  }

  return newBoard
}

const emptyBoard = buildEmptyBoard()

const displayBoard = (board) => {
  for (let i = 0; i < 9; i++) {
    console.log('+---+---+---+---+---+---+---+---+---+')
    console.log(`| ${board[i].map((square) => square.value).join(' | ')} |`)
  }
  console.log('+---+---+---+---+---+---+---+---+---+')
}

// displayBoard(emptyBoard)

// Checks for duplicates within array
const hasNoDups = (arr = []) => {
  const entries = {}

  // Removes 0 values and check entered values
  return arr.filter(Boolean).every((entry) => {
    // If the value exists, it's a duplicate
    if (entries[entry]) {
      return false
    } else {
      entries[entry] = 1
      return true
    }
  })
}

/**
 * Checks all 3X3 sub matrices for valid entries
 *
 * @param {array} board - The current game board
 */
const evalSubMatrices = (board) => {
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      const subMatrix = []

      ;[0, 1, 2].forEach((row) => {
        ;[0, 1, 2].forEach((col) => {
          subMatrix.push(board[i + row][j + col].value)
        })
      })

      console.log(subMatrix)
    }
  }
}

/**
 * Checks the 3X3 sub matrix for valid entries
 *
 * @param {array} board - The current game board
 * @param {number} rowStart - The starting matrix row, can be 0, 3, 6
 * @param {number} colStart - The starting matrix col, can be 0, 3, 6
 */
const evalSubMatrix = (board, rowStart, colStart) => {
  const subMatrix = []

  ;[0, 1, 2].forEach((row) => {
    ;[0, 1, 2].forEach((col) => {
      subMatrix.push(board[rowStart + row][colStart + col].value)
    })
  })

  return hasNoDups(subMatrix)
}

/**
 * Checks all rows for valid entries
 *
 * @param {array} board - The current game board
 */
const evalRows = (board) => {
  for (let i = 0; i < 9; i++) {
    console.log(board[i].map((square) => square.value))
  }
}

/**
 * Checks row for valid entries
 *
 * @param {array} board - The current game board
 * @param {number} row - The row index
 */
const evalRow = (board, row) => {
  return hasNoDups(board[row].map((square) => square.value))
}

/**
 * Checks all columns for valid entries
 *
 * @param {array} board - The current game board
 */
const evalColumns = (board) => {
  for (let i = 0; i < 9; i++) {
    const column = []
    for (let j = 0; j < 9; j++) {
      column.push(board[j][i].value)
    }
    console.log(column)
  }
}

/**
 * Checks column for valid entries
 *
 * @param {array} board - The current game board
 * @param {number} col - The column index
 */
const evalColumn = (board, col) => {
  const column = []

  for (let i = 0; i < 9; i++) {
    column.push(board[i][col].value)
  }

  return hasNoDups(column)
}

const safeInRow = (board, row, num) => {
  return board[row].every((val) => val.value !== num)
}

const safeInCol = (board, col, num) => {
  const column = []

  for (let i = 0; i < 9; i++) {
    column.push(board[i][col].value)
  }

  return column.every((val) => val !== num)
}

const safeInSubMatrix = (board, curRow, curCol, num) => {
  const subMatrix = []
  let rowStart = curRow

  if (rowStart >= 6) {
    rowStart = 6
  } else if (rowStart >= 3) {
    rowStart = 3
  } else {
    rowStart = 0
  }

  let colStart = curCol

  if (colStart >= 6) {
    colStart = 6
  } else if (colStart >= 3) {
    colStart = 3
  } else {
    colStart = 0
  }

  ;[0, 1, 2].forEach((row) => {
    ;[0, 1, 2].forEach((col) => {
      subMatrix.push(board[rowStart + row][colStart + col].value)
    })
  })

  return subMatrix.every((val) => val !== num)
}

const isSafeMove = (board, row, col, num) => {
  return (
    safeInRow(board, row, num) &&
    safeInCol(board, col, num) &&
    safeInSubMatrix(board, row, col, num)
  )
}

const buildFullBoard = () => {
  const newBoard = buildEmptyBoard()
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  // Builds the diagonal 3X3 Matrices
  ;[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ].forEach((range) => {
    const shuffled = shuffleArray(nums)
    range.forEach((index) => {
      range.forEach((secondaryIndex) => {
        newBoard[index][secondaryIndex].value = shuffled.pop()
      })
    })
  })

  // A recursive function to fill remaining
  // matrix
  const fillRemaining = (first, second) => {
    let i = first
    let j = second

    if (j >= 9 && i < 9 - 1) {
      i = i + 1
      j = 0
    }

    if (i >= 9 && j >= 9) {
      return true
    }

    if (i < 3) {
      if (j < 3) j = 3
    } else if (i < 9 - 3) {
      if (j === (i / 3) * 3) j += 3
    } else {
      if (j === 9 - 3) {
        i = i + 1
        j = 0
        if (i >= 9) return true
      }
    }

    for (let num = 1; num <= 9; num++) {
      if (isSafeMove(newBoard, i, j, num)) {
        newBoard[i][j].value = num

        if (fillRemaining(i, j + 1)) {
          return true
        }

        newBoard[i][j].value = 0
      }
    }
    return false
  }

  fillRemaining(0, 3)

  displayBoard(newBoard)
}

buildFullBoard()
