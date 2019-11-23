const app = document.getElementById('root');

const container = document.createElement('div');


// Create a request variable and assign a new XMLHttpRequest object to it
// I went with an old method of getting the data
// Request for Community information
var cRequest = new XMLHttpRequest();
// Request for Homes information
var hRequest = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
cRequest.open('GET', 'https://a18fda49-215e-47d1-9dc6-c6136a04a33a.mock.pstmn.io/communities', true);

cRequest.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    // Create communities array
    var communities = new Array();
    // Continue if response code is between 200 and 399
    if (cRequest.status >= 200 && cRequest.status < 400) {
        data.forEach(community => {
            //console.log(community.name);
            // Array will be multi-D
            // [name, id, imgURL]
            communities.push([community.name, community.id, community.imgUrl]);
        })
    }
    else {
        console.log('error');
    }
    // Sort the communities in alphabetical order
    communities.sort(sortFunction);
    
    // Open a new connection, using the GET request on the URL endpoint
    hRequest.open('GET', 'https://a18fda49-215e-47d1-9dc6-c6136a04a33a.mock.pstmn.io/homes', true);

    hRequest.onload = function() {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        var homes = new Array();

        if (hRequest.status >= 200 && hRequest.status < 400) {
            data.forEach(home => {
                //console.log(home.price);
                // [communityID, price]
                homes.push([home.communityId, home.price]);
            })
        }
        else {
            console.log('error');
        }
        // For each community, get the average housing prices and image URL
        for (var i = 0; i < communities.length; i++){
            // Get the community name
            const h1 = document.createElement('h1');
            h1.textContent = communities[i][0];
            // Get the community image
            const img = document.createElement('img');
            // If image is empty, use placeholder
            if ((communities[i][2] == "")) {
                img.src = './sorry-no-image-available.jpg';
            }
            // Otherwise, use provided image
            else{
                img.src = communities[i][2];
            }
            // If the image doesn't exist, replace with placeholder
            checkImageExists(img.src, function(existsImage) {
                if(existsImage == false) {
                    img.src = './sorry-no-image-available.jpg';
                }
            });
            // Get average housing price
            const p = document.createElement('p');
            // Init variables
            var average = 0;
            var num = 0;
            // For each home, find homes in community and get the average price
            for (var j = 0; j < homes.length; j++){
                // If home is in community, add home value
                if (homes[j][0] == communities[i][1]){
                    // Add home price to total
                    average += homes[j][1];
                    // Increment number of homes in community
                    num++;
                }
            }
            // Get the average home price by dividing the total by the number of homes in the community
            average = average/num;
            // If the average isn't NaN, then display the value to two decimal places
            if (!Number.isNaN(average)) {
                p.textContent = "Average housing price: $" + average.toFixed(2);
            }
            // Otherwise, display that no average price is available
            else {
                p.textContent = "No average housing price available";
            }
            // Add the HTML components to root
            root.appendChild(h1);
            root.appendChild(img);
            root.appendChild(p);
        }
    }
    
    hRequest.send();
}

// Send request
cRequest.send();

// Sort function for communities
function sortFunction(a, b){
    if (a[0] === b[0]) {
        return 0;
    }
    else{
        return (a[0] < b[0]) ? -1 : 1;
    }
}
// Function to determine if image exists
// Credit to Bharat Chodvadiya
// How to check if an image exists using javascript
// https://bharatchodvadiya.wordpress.com/2015/04/08/how-to-check-if-an-image-exists-using-javascript/
function checkImageExists(imageUrl, callBack) {
    var imageData = new Image();
    imageData.onload = function() {
        callBack(true);
    };
    imageData.onerror = function() {
        callBack(false);
    };
    imageData.src = imageUrl;
}