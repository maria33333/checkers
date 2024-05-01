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

    spanElements.forEach(function (span, index) {
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

            //console.log(isWhiteTurn);

            if (this.classList.contains(emptyWhiteClass)) {
                //console.log(emptyWhiteClass);
                return;
            }
            if (this.classList.contains(emptyBlackClass)) {
                var [emptyRow, emptyCol] = getPosition(this.dataset.index); // рядок і стовпець порожньої клітинки
                var selected = currentRow >= 0 && currentCol >= 0; // чи була вибрана яка-небудь фігура на дошці
                var sel = document.querySelector(".selected"); // рядок вказує на вибрану фігуру

                if (selected && Math.abs(currentCol - emptyCol) == 2 && Math.abs(currentRow - emptyRow) == 2) {
                    var centerRow = Math.floor((currentRow + emptyRow) / 2);//Обчислення середньго рядка між поточним і порожнім рядком
                    var centerCol = Math.floor((currentCol + emptyCol) / 2);//Обчислення середньго стовпця між поточним и порожнім стовпцем
                    var centerCell = board[centerRow][centerCol];//Отримання значення клітинки яка по середині

                    if (centerCell === boardBlack || centerCell === boardWhite) {
                        console.log("шашка стоїть на діагоналі посередині");

                        if (sel.classList.contains(whiteClass)) {
                            makeMove(whiteClass, this, sel, emptyRow, emptyCol);
                            indexSpan(centerRow, centerCol, whiteClass);
                        }

                        // Винести у функцію і видалити фігуру яку побили

                        if (sel.classList.contains(blackClass)) {
                            makeMove(blackClass, this, sel, emptyRow, emptyCol);
                            indexSpan(centerRow, centerCol, blackClass);
                        }

                    } else {
                        console.log("шашка не стоїть на діагоналі посередині");
                    }
                }
                if (selected && Math.abs(currentCol - emptyCol) == 1) {
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
    function indexSpan(centerRow, centerCol, blackOrWhite) {
        var index = centerRow * 8 + centerCol;// обчислення індекса елемента span
        var spanToRemove = document.querySelector(`span[data-index = '${index}']`);//шукається span за допомогою data-index який = обчисленню значення у попередньому рядку. Це треба щоб знайти той самий елемент span де знаходится шашка яку треба видалити
        spanToRemove.classList.remove(blackClass, whiteClass);//видалення класу шашки, яку вбили
        spanToRemove.classList.add(emptyBlackClass);
        board[centerRow][centerCol] = boardEmptyBlack;//видалення шашки, оновлення дошки
        //оновлення гравця, якщо треба
        if (blackOrWhite === whiteClass) {
            board[centerRow][centerCol] = boardWhite;
        } else if (blackOrWhite === blackClass) {
            board[centerRow][centerCol] = boardBlack;
        }
        //оновлення інформації про гравця
        if (blackOrWhite === blackClass) {
            isWhiteTurn = true;
        } else if (blackOrWhite === whiteClass) {
            isWhiteTurn = false;
        } else {
            console.log("wrong css class");
        }
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
    }
});
