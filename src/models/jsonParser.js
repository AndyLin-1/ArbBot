const fetch = require('cross-fetch');

//Gets Link
function getLink(link) {
    const date = new Date();
    const year = date.getFullYear();
    const month= date.getMonth()+1;
    const day= date.getDate(); 

    link += year;
    if(month < 10) {
        link += "0" + month;
    }
    else {
        link += month;
    }

    if(day < 10) {
        link += "0" + day;
    }
    else {
        link += day;
    }
    return link;
}

//Gets Json Object from link
async function getJson(link) {
    try {
        const response = await fetch(link);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
}

module.exports = {
    getLink,
    getJson
  };