document.addEventListener("DOMContentLoaded", function () {
    var board = [
        [0,"@",0,"@",0,"@",0,"@"],
        ["@",0,"@",0,"@",0,"@",0],
        [0,"@",0,"@",0,"@",0,"@"],
        [1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1],
        ["*",0,"*",0,"*",0,"*",0],
        [0,"*",0,"*",0,"*",0,"*"],
        ["*",0,"*",0,"*",0,"*",0],
    ];
    // var board = [
    //     [0,1,0,1,0,1,0,1],
    //     [1,0,"@",0,"*",0,1,0],
    //     [0,1,0,1,0,1,0,1],
    //     [1,0,1,0,1,0,1,0],
    //     [0,1,0,1,0,1,0,1],
    //     ["*",0,"*",0,"*",0,"*",0],
    //     [0,"*",0,"*",0,"*",0,"*"],
    //     ["*",0,"*",0,"*",0,"*",0],
    // ];
    const emptyWhiteClass = "emptyWhite";
    const emptyBlackClass = "emptyBlack";
    const blackClass = "black";
    const whiteClass = "white";

    var spanElements = document.querySelectorAll('span');
    var currentRow = -1;
    var currentCol = -1;
    var boardBlack = "@";
    var boardWhite = "*";
    var boardEmptyBlack = 1;
    //var currentPlayer = "white";
    var isWhiteTurn = true;
    // var checkColPosition = 0;
    // var checkRowPosition = 0;
    // var beatCheck = 0;
    var canBeat = false;
    var oppositeColor;
    var allowedRowAndCol = [];
    // var takeChecker = false;
    spanElements.forEach(function(span, index) {
        span.dataset.index = index;
        span.addEventListener('click', function() {
            //перевіряємо чи клітинка містить білу шашку
            if (this.classList.contains(whiteClass) && !isWhiteTurn) {
                return;//блокуємо хід якщо це клітинка яка містить білу шашку, а зараз чегра чорних шашок
            }
            //перевіряємо чи клітинка мiстить чорну шашку
            else if (this.classList.contains(blackClass) && isWhiteTurn) {
                return;// блокуємо хід якщо це клітинка яка містить чорну шашку, а зараз черга білих
            }

            if (this.classList.contains(emptyWhiteClass)) {
                //console.log(emptyWhiteClass);
                return;
            }
            var position = getPosition(this.dataset.index);
            canBeat = checkForBeating();
            if (canBeat && !this.classList.contains(emptyBlackClass)) {
                var isAllowed = false;
                for (var i = 0; i < allowedRowAndCol.length; i++) {
                    if (allowedRowAndCol[i][0] === position[0] && allowedRowAndCol[i][1] === position[1]) {
                        isAllowed = true;
                        break;
                    }
                }
                if (!isAllowed) {
                    return;
                }
            }

            if (this.classList.contains(emptyBlackClass)) {
                var [emptyRow, emptyCol] = getPosition(this.dataset.index); // рядок і стовпець порожньої клітинки
                var selected = currentRow >= 0 && currentCol >= 0; // чи була вибрана яка-небудь фігура на дошці
                var sel = document.querySelector(".selected"); // рядок вказує на вибрану фігуру

                if (selected && isBeatingMove(currentRow, currentCol, emptyRow, emptyCol)) {
                // if (selected && Math.abs(currentCol - emptyCol) == 2 && Math.abs(currentRow - emptyRow) == 2) {
                    var centerRow = Math.floor((currentRow + emptyRow) / 2);//Обчислення середньго рядка між поточним і порожнім рядком
                    var centerCol = Math.floor((currentCol + emptyCol) / 2);//Обчислення середньго стовпця між поточним и порожнім стовпцем
                    var centerCell = board[centerRow][centerCol];//Отримання значення клітинки яка по середині

                    if (centerCell === boardBlack || centerCell === boardWhite) {
                        console.log("шашка стоїть на діагоналі посередині");

                        beatCheckers(centerRow, centerCol);
                        if (sel.classList.contains(whiteClass)) {
                            makeMove(whiteClass, this, sel, emptyRow, emptyCol);
                        }
                        // Винести у функцію і видалити фігуру яку побили
                        if (sel.classList.contains(blackClass)) {
                            makeMove(blackClass, this, sel, emptyRow, emptyCol);
                        }
                    } else {
                        console.log("шашка не стоїть на діагоналі посередині");
                    }
                }
                if (selected && !canBeat && Math.abs(currentCol - emptyCol) == 1) {
                    if (sel.classList.contains(whiteClass) && (currentRow - emptyRow) == 1) {
                        makeMove(whiteClass, this, sel, emptyRow, emptyCol);
                    }
                    if (sel.classList.contains(blackClass) && (emptyRow - currentRow) == 1) {
                        makeMove(blackClass, this, sel, emptyRow, emptyCol);
                    }
                }
                return;
            }

            if (this.classList.contains(whiteClass) || this.classList.contains(blackClass)) {
                var sel = document.querySelector(".selected");
                if (sel) {
                    sel.classList.remove("selected");
                }
                this.classList.add('selected');
                [currentRow, currentCol] = getPosition(this.dataset.index);
                return;
            }
        });

        var [row, col] = getPosition(index);

        switch (board[row][col]) {
            case 0:
                span.classList.add(emptyWhiteClass);
                break;
            case boardEmptyBlack:
                span.classList.add(emptyBlackClass);
                break;
            case boardBlack:
                span.classList.add(blackClass);
                break;
            case boardWhite:
                span.classList.add(whiteClass);
                break;
        }
    });
    function getPosition(position) {
        var indexData = Number(position);
        var positionRow = Math.floor(indexData / 8);
        var positionCol = indexData % 8;
        return [positionRow, positionCol];
    }
    function beatCheckers(centerRow, centerCol) {
        var index = centerRow * 8 + centerCol;// обчислення індекса елемента span
        var spanToRemove = document.querySelector(`span[data-index = '${index}']`);//шукається span за допомогою data-index який = обчисленню значення у попередньому рядку. Це треба щоб знайти той самий елемент span де знаходится шашка яку треба видалити
        spanToRemove.classList.remove(blackClass, whiteClass);//видалення класу шашки, яку вбили
        spanToRemove.classList.add(emptyBlackClass);
        board[centerRow][centerCol] = boardEmptyBlack;//видалення шашки, оновлення дошки
    }
    function makeMove(blackOrWhiteClass, selCell, prevCell, emptyRowIndex, emptyColIndex) {
        selCell.classList.remove(emptyBlackClass);
        selCell.classList.add(blackOrWhiteClass);

        prevCell.classList.add(emptyBlackClass);
        // видаляє клас селектед з попереднього вибранного елемента, оскільки він вже не вибранний
        prevCell.classList.remove(blackOrWhiteClass, "selected");
        board[currentRow][currentCol] = boardEmptyBlack;

        if (blackOrWhiteClass == blackClass) {
            board[emptyRowIndex][emptyColIndex] = boardBlack;
            isWhiteTurn = true;
        } else if (blackOrWhiteClass == whiteClass) {
            board[emptyRowIndex][emptyColIndex] = boardWhite;
            isWhiteTurn = false;
        } else {
            console.log("wrong css class");
        }

        currentRow = -1;
        currentCol = -1;

        checkColPosition = emptyColIndex + 1;
        checkRowPosition = emptyRowIndex - 1;
        // var index = checkRowPosition * 8 + checkColPosition;
        // var spanToCheck = document.querySelector(`span[data-index = '${index}']`);
        if (blackOrWhiteClass === whiteClass) {
            oppositeColor = boardBlack;
        } else {
            oppositeColor = boardWhite;
        }
        // if (spanToCheck.classList.contains(whiteClass)) {

        // } else if (spanToCheck.classList.contains(blackClass)) {
        //     beatCheck = 1;
        // }
        canBeat = false;

        var boundaryCheck = emptyRowIndex != 0 && emptyRowIndex != 7 && emptyColIndex != 0 && emptyColIndex != 7;
        if (boundaryCheck) {
            if (board[emptyRowIndex + 1][emptyColIndex + 1] === oppositeColor && board[emptyRowIndex - 1][emptyColIndex - 1] === boardEmptyBlack) {
                canBeat = true;
                console.log("test 1");
            }
            if (board[emptyRowIndex - 1][emptyColIndex + 1] === oppositeColor && board[emptyRowIndex + 1][emptyColIndex - 1] === boardEmptyBlack) {
                canBeat = true;
                console.log("test 2");
            }
            if (board[emptyRowIndex + 1][emptyColIndex - 1] === oppositeColor && board[emptyRowIndex - 1][emptyColIndex + 1] === boardEmptyBlack) {
                canBeat = true;
                console.log("test 3");
            }
            if (board[emptyRowIndex - 1][emptyColIndex - 1] === oppositeColor && board[emptyRowIndex + 1][emptyColIndex + 1] === boardEmptyBlack) {
                canBeat = true;
                console.log("test 4");
            }
            // console.log(canBeat);
        }
    }

    function checkForBeating() {
        var forBoardBlack = boardWhite;
        var blackBoardWhite = boardBlack;
        if (isWhiteTurn) {
            blackBoardWhite = boardWhite;
            forBoardBlack = boardBlack;
        }
        allowedRowAndCol = [];
        for (var row = 0; row < board.length; row++) {
            for (var col = 0; col < board.length; col++) {
                if (board[row][col] === blackBoardWhite && canWhiteOrBlackBeat(row, col, forBoardBlack)) { //чи може ця шашка бити. Якщо хоч одна шашка може бити функція повертає true
                    allowedRowAndCol.push([row, col]);
                }
            }
        }
        return allowedRowAndCol.length > 0;
    }

    function canWhiteOrBlackBeat(row, col, forBoardBlack) {
        var directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ];
        for (var i = 0; i < directions.length; i++) {
            var rowOffset = directions[i][0];
            var colOffset = directions[i][1];
            var newRow = row + 2 * rowOffset;
            var newCol = col + 2 * colOffset;
            if (isValidMove(row + rowOffset, col + colOffset, newRow, newCol) && board[row + rowOffset][col + colOffset] === forBoardBlack && board[newRow][newCol] === boardEmptyBlack) {
                return true;
            }
        }
    }

    function isValidMove(midRow, midCol, endRow, endCol) {
        return (
            endRow >= 0 && endRow < 8 &&
            endCol >= 0 && endCol < 8 &&
            board[midRow][midCol] !== boardEmptyBlack
        );
    }
    function isBeatingMove(startRow, startCol, endRow, endCol) {
        return Math.abs(startRow - endRow) === 2 && Math.abs(startCol - endCol) === 2;
    }
});
