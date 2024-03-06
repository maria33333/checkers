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

    var spanElements = document.querySelectorAll('span');
    spanElements.forEach(function (span, index) {
        var row = Math.floor(index / 8);
        var col = index % 8;

        switch (board[row][col]) {
            case 0:
                span.classList.add('emptyWhite');
                break;
            case 1:
                span.classList.add('emptyBlack');
                break;
            case '@':
                span.classList.add('black');
                break;
            case '*':
                span.classList.add('white');
                break;
        }
    });
});