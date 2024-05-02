// Javascript to update loss counter statement on index.html
var localStorageCounter = localStorage.getItem("lossCounter");
var homeLossMessage = document.getElementById("homePageLoss");

// if(localStorageCounter == null){
//     homeLossMessage.textContent = "";
//     } else if (localStorageCounter == 1) {
//         console.log("loss is one");
//     homeLossMessage.textContent = "Nope! You've lost to StockFish " + localStorageCounter + " time. "
//     } else {
//         homeLossMessage.textContent = "Nope! You've lost to StockFish " + localStorageCounter + " times. "
//     }