//Parses options and creations link
function getLink_Base(type) {
    let link = "";
    if(type == "NBA_ML" || type == "NBA_OU") {
        link = "https://api.actionnetwork.com/web/v1/scoreboard/nba?period=game&bookIds=15,30,76,75,123,69,68,71,79&date=";
    } else if(type == "MLB_ML" || type == "MLB_OU") {
        link = "https://api.actionnetwork.com/web/v1/scoreboard/mlb?period=game&bookIds=15,30,76,75,123,69,68,71,79&date=";
    } else if (type == "SOCCER_ML" || type == "SOCCER_OU") {
        link = "https://api.actionnetwork.com/web/v1/scoreboard/soccer?period=game&bookIds=15,30,76,75,123,69,68,71,79&date=";
    } else if(type == "NHL_ML" || type == "NHL_OU") {
        link = "https://api.actionnetwork.com/web/v1/scoreboard/nhl?period=game&bookIds=15,30,76,75,123,69,68,71,79&date=";
    }
    else if(type == "NCAAF_ML" || type == "NCAAF_OU") {
        link = "https://api.actionnetwork.com/web/v1/scoreboard/ncaaf?period=game&bookIds=15,30,76,75,123,69,68,71,79&date=";
    }
    return link;
}

//Converts american odds to Decimal
function convertAToD(num) {
    if(num > 0) {
        return (num/100) + 1;
    }
    else {
        return ((100/num) - 1) * -1;
    }
}

//Converts bookie Ids to name
function bookie(num) {
    if(num == 75) {
        return "BetMGM";
    } else if(num == 69) {
        return "FanDuel";
    } else if(num == 315) {
        return "TheScore";
    } else if(num == 68) {
        return "DraftKing";
    } else if(num == 79) {
        return "Bet365";
    } else if(num == 123) {
        return "CAESARS";
    } else if(num == 76) {
        return "PointsBet";
    } else if(num == 71) {
        return "BetRivers"
    }
    else {
        return "N/A";
    }
}

function generateStringTable(data) {
    // Calculate the maximum length for each column
    const columnLengths = data.reduce((lengths, row) => {
      row.forEach((cell, index) => {
        lengths[index] = Math.max(lengths[index] || 0, cell.length);
      });
      return lengths;
    }, []);
    // Generate the table as a string
    const table = data.map(row =>
      row.map((cell, index) => cell.padEnd(columnLengths[index])).join(" | ")
    ).join("\n");
    return table;
  }

module.exports = {
    getLink_Base,
    convertAToD,
    bookie,
    generateStringTable
  };