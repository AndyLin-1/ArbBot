const arb = require('../commands/Betting/arb.js');
const {getLink, getJson} = require('./jsonParser.js');
const {getLink_Base, convertAToD, bookie, generateStringTable} = require('./Util.js');


//Odds for soccer (since 3 way)
async function getOddsSoccer(type, arb) {
    let link = getLink_Base(type);
    const data = await getJson(getLink(link));
    const arbs = [
        ["Away Team", "SB", "Odds", "Bet", 
         "Home Team", "SB", "Odds", "Bet", 
         "Draw SB", "Odds", "Bet",
         "Arb %", "Profit"]
    ];
        //For Each Game
        for(games of data.games) {
            //Only calculate if game has not started
            if(games.status == "scheduled") {
                //Get Team Informations
                const awayTeamId = games.away_team_id;
                const homeTeamId = games.home_team_id;
                let awayTeamName = "N/A";
                let homeTeamName = "N/A";
                let awayML = 0;
                let awaySB = "N/A";
                let homeML = 0;
                let homeSB =  "N/A";
                let drawML = 0;
                let drawSB = "N/A";
                if(games.teams[0].id == awayTeamId) {
                    awayTeamName = games.teams[0].abbr;
                    homeTeamName = games.teams[1].abbr;
                } 
                else {
                    awayTeamName = games.teams[1].abbr;
                    homeTeamName = games.teams[0].abbr;
                }
                //Calculate Best Odds
                for(odds of games.odds) {
                    //If not Id 15, 30 (fillers)
                    if(odds.book_id != 15 && odds.book_id != 30) {
                        //Get Max Odds between away and home
                        if(awayML < convertAToD(odds.ml_away)) {
                            awayML = convertAToD(odds.ml_away);
                            awaySB = bookie(odds.book_id);
                        }
                        if(homeML < convertAToD(odds.ml_home)) {
                            homeML = convertAToD(odds.ml_home);
                            homeSB = bookie(odds.book_id);
                        }
                        if(drawML < convertAToD(odds.draw)) {
                            drawML = convertAToD(odds.draw);
                            drawSB = bookie(odds.book_id);
                        }
                    }
                }
                //Calculate if there is arb or give odds if arb is false
                percentage = ((1/awayML) * 100) + ((1/homeML) * 100) + ((1/drawML) * 100);
                if(percentage <= 100 || !arb) {
                    let awayBet = 0;
                    let homeBet = 0; 
                    let drawBet = 0;
                    let profit = 0;
                    if(awayML <= homeML && awayML <= drawML) {
                        awayBet = 10;
                        homeBet = (awayML * 10)/homeML;
                        drawBet = (awayML * 10)/drawML;
                        profit = (10 * awayML) - (awayBet + homeBet + drawBet);
                    } 
                    else if (homeML <= awayML && homeML <= drawML){
                        homeBet = 10;
                        awayBet = (homeML * 10)/awayML;
                        drawBet = (homeML * 10)/drawML;
                        profit = (10 * homeML) - (awayBet + homeBet + drawBet);
                    }
                    else {
                        drawBet = 10;
                        homeBet = (drawML * 10)/homeML;
                        awayBet = (drawML * 10)/awayML;
                        profit = (10 * drawML) - (awayBet + homeBet + drawBet);
                    }
                    //Pushes the Data in
                    arbs.push(
                        [awayTeamName, awaySB, awayML.toFixed(2), awayBet.toFixed(2), 
                        homeTeamName, homeSB, homeML.toFixed(2), homeBet.toFixed(2),
                        drawSB, drawML.toFixed(2), drawBet.toFixed(2),
                        (100-percentage).toFixed(2), profit.toFixed(2)]
                    );
                }
            }
        }

    if(arbs.length == 1) {
        return "No Bets At this time";
    }
    const stringTable = generateStringTable(arbs);
    return stringTable;
}

//Regular Sports Odds
async function getOdds(type, arb) {
    let link = getLink_Base(type);
    const data = await getJson(getLink(link));
    //Creates Empty Array with Headers for the table
    const arbs = [
        ["Away Team", "SB", "Odds", "Bet", 
         "Home Team", "SB", "Odds", "Bet", 
         "Arb %", "Profit"]
    ];

    //For Each Game
    for(games of data.games) {
        //Only calculate if game has not started
        if(games.status == "scheduled") {
            //Get Team Informations
            const awayTeamId = games.away_team_id;
            const homeTeamId = games.home_team_id;
            let awayTeamName = "N/A";
            let homeTeamName = "N/A";
            let awayML = 0;
            let awaySB = "N/A";
            let homeML = 0;
            let homeSB =  "N/A";
            if(games.teams[0].id == awayTeamId) {
                awayTeamName = games.teams[0].abbr;
                homeTeamName = games.teams[1].abbr;
            } 
            else {
                awayTeamName = games.teams[1].abbr;
                homeTeamName = games.teams[0].abbr;
            }
            //Calculate Best Odds
            for(odds of games.odds) {
                //If not Id 15, 30 (fillers)
                if(odds.book_id != 15 && odds.book_id != 30) {
                    //Get Max Odds between away and home
                    if(awayML < convertAToD(odds.ml_away)) {
                        awayML = convertAToD(odds.ml_away);
                        awaySB = bookie(odds.book_id);
                    }
                    if(homeML < convertAToD(odds.ml_home)) {
                        homeML = convertAToD(odds.ml_home);
                        homeSB = bookie(odds.book_id);
                    }
                }
            }
            //Calculate if there is arb or give odds if arb is false
            percentage = ((1/awayML) * 100) + ((1/homeML) * 100);
            if(percentage <= 100 || !arb) {
                let awayBet = 0;
                let homeBet = 0; 
                let profit = 0;
                if(awayML < homeML) {
                    awayBet = 10;
                    homeBet = (awayML * 10)/homeML;
                    profit = (awayBet * awayML) - (awayBet + homeBet);
                } 
                else {
                    homeBet = 10;
                    awayBet = (homeML * 10)/awayML;
                    profit = (homeBet * homeML) - (awayBet + homeBet);
                }
                //Pushes the Data in
                arbs.push(
                    [awayTeamName, awaySB, awayML.toFixed(2), awayBet.toFixed(2), 
                    homeTeamName, homeSB, homeML.toFixed(2), homeBet.toFixed(2),
                    (100-percentage).toFixed(2), profit.toFixed(2)]
                );
            }
        }
    }
    if(arbs.length == 1) {
        return "No Bets At this time";
    }
    const stringTable = generateStringTable(arbs);
    return stringTable;
}

//Over Under Odds
async function getOddsOU(type, arb) {
    let link = getLink_Base(type);
    const data = await getJson(getLink(link));
    //Creates Empty Array with Headers for the table
    const arbs = [
        ["Game", "O/U Total", 
         "Over SB", "Odds", "Bet", 
         "Under SB", "Odds", "Bet", 
         "Arb %", "Profit"]
    ];

    //For Each Game
    for(games of data.games) {
        //Only calculate if game has not started
        if(games.status == "scheduled") {
            //Get Over Under Informations
            let total = games.odds[0].total;
            let over = 0;
            let overSB = "N/A";
            let under = 0;
            let underSB =  "N/A";
            let teams = games.teams[0].abbr + " VS. " + games.teams[1].abbr;
            //Calculate Best Odds
            for(odds of games.odds) {
                //If not Id 15, 30 (fillers)
                if(odds.book_id != 15 && odds.book_id != 30) {
                    //Get Max Odds between away and home
                    if(over < convertAToD(odds.over) && total == odds.total) {
                        over = convertAToD(odds.over);
                        overSB = bookie(odds.book_id);
                    }
                    if(under < convertAToD(odds.under) && total == odds.total) {
                        under = convertAToD(odds.under);
                        underSB = bookie(odds.book_id);
                    }
                }
            }
            //Calculate if there is arb or give odds if arb is false
            percentage = ((1/over) * 100) + ((1/under) * 100);
            if(percentage <= 100 || !arb) {
                let overBet = 0;
                let underBet = 0; 
                let profit = 0;
                if(over < under) {
                    overBet = 10;
                    underBet = (over * 10)/under;
                    profit = (overBet * over) - (overBet + underBet);
                } 
                else {
                    underBet = 10;
                    overBet = (under * 10)/over;
                    profit = (underBet * under) - (overBet + underBet);
                }
                //Pushes the Data in
                if(total != null) {
                    arbs.push(
                        [teams, total.toString(), 
                        overSB, over.toFixed(2), overBet.toFixed(2),
                        underSB, under.toFixed(2), underBet.toFixed(2),
                        (100-percentage).toFixed(2), profit.toFixed(2)]
                    );
                }
            }
        }
    }
    if(arbs.length == 1) {
        return "No Bets for At this time";
    }
    let stringTable = generateStringTable(arbs);
    return stringTable;
}

async function getFreeBet(amount, sportsbook) {
    let freeBet = [];
    let hold = [];
    //NBA
    freeBet = await scanFreeBet("NBA_ML", amount, sportsbook);
    //MLB
    hold = await scanFreeBet("MLB_ML", amount, sportsbook);
    if(hold.length > 1 && (freeBet.length == 1 || hold[1][hold[1].length-2] > freeBet[1][freeBet[1].length-2])) {
        freeBet = hold;
    }
    //Soccer
    hold = await scanFreeBet("SOCCER_ML", amount, sportsbook);
    if(hold.length > 1 && (freeBet.length == 1 || hold[1][hold[1].length-2] > freeBet[1][freeBet[1].length-2])) {
        freeBet = hold;
    }
    //If Empty
    if(freeBet.length == 1) {
        return "No FreeBets for " + bookie(sportsbook) +  " At this time";
    }
    let stringTable = generateStringTable(freeBet);
    return "```" + stringTable + "```";
}

async function scanFreeBet(type, amount, sportsbook) {
    let link = getLink_Base(type);
    const data = await getJson(getLink(link));
    let conversion = 0;
    let payout = 0;
    let awayML1 = 0;
    let homeML1 = 0;
    //Go Through Moneyline First
    const freeBetML = [
        ["Away Team", "SB", "Odds", "Bet", 
         "Home Team", "SB", "Odds", "Bet", 
         "Profit", "Conversion"]
    ];
    for(games of data.games) {
        //Only calculate if game has not started
        if(games.status == "scheduled") {
            //Get Team Informations
            const awayTeamId = games.away_team_id;
            const homeTeamId = games.home_team_id;
            let awayTeamName = "N/A";
            let homeTeamName = "N/A";
            let awayML = 0;
            let awaySB = "N/A";
            let homeML = 0;
            let homeSB =  "N/A";
            if(games.teams[0].id == awayTeamId) {
                awayTeamName = games.teams[0].abbr;
                homeTeamName = games.teams[1].abbr;
            } 
            else {
                awayTeamName = games.teams[1].abbr;
                homeTeamName = games.teams[0].abbr;
            }
            for(odds of games.odds) {
                //If not Id 15, 30 (fillers)
                if(odds.book_id != 15 && odds.book_id != 30) {
                    //Get Max Odds between away and home
                    if(awayML < convertAToD(odds.ml_away)) {
                        awayML = convertAToD(odds.ml_away);
                        awaySB = bookie(odds.book_id);
                    }
                    if(homeML < convertAToD(odds.ml_home)) {
                        homeML = convertAToD(odds.ml_home);
                        homeSB = bookie(odds.book_id);
                    }
                    //Get Current Freebet Sportsbook Odds
                    if(odds.book_id == sportsbook) {
                        awayML1 = convertAToD(odds.ml_away);
                        homeML1= convertAToD(odds.ml_home);
                    }
                }
            }
            //Calculate Conversions
            //For Away
            payout = (amount * awayML1) - amount;
            let wager = (payout/homeML);
            let profit = payout - wager;
            conversion = profit/amount * 100;
            if(freeBetML.length == 1 || conversion > freeBetML[1][9]) {
                freeBetML.splice(1,1);
                freeBetML.push([awayTeamName, bookie(sportsbook), awayML1.toFixed(2), amount.toString(),
                    homeTeamName, homeSB, homeML.toFixed(2), wager.toFixed(2),
                    profit.toFixed(2), conversion.toFixed(3)]);
            }
            //For Home
            payout = (amount * homeML1) - amount;
            wager = (payout/awayML);
            profit = payout - wager;
            conversion = profit/amount * 100;
            //Cut Lower
            if(freeBetML.length == 1 || conversion > freeBetML[1][9]) {
                freeBetML.splice(1,1);
                freeBetML.push([awayTeamName, awayML.toFixed(2), awayML.toFixed(2), wager.toFixed(2),
                    homeTeamName, bookie(sportsbook), homeML1.toFixed(2), amount.toString(),
                    profit.toFixed(2), conversion.toFixed(3)]);
            }
        }
    }
    //Calculate For O/Us
    let over1 = 0;
    let under1 = 0;
    const freeBetOU = [
        ["Game", "O/U Total", 
         "Over SB", "Odds", "Bet", 
         "Under SB", "Odds", "Bet", 
         "Profit", "Conversion"]
    ];
    for(games of data.games) {
        //Only calculate if game has not started
        if(games.status == "scheduled") {
            //Get Over Under Informations
            let total = games.odds[0].total;
            let over = 0;
            let overSB = "N/A";
            let under = 0;
            let underSB =  "N/A";
            let teams = games.teams[0].abbr + " VS. " + games.teams[1].abbr;
            //Calculate Best Odds
            for(odds of games.odds) {
                //If not Id 15, 30 (fillers)
                if(odds.book_id != 15 && odds.book_id != 30) {
                    //Get Max Odds between away and home
                    if(over < convertAToD(odds.over) && total == odds.total) {
                        over = convertAToD(odds.over);
                        overSB = bookie(odds.book_id);
                    }
                    if(under < convertAToD(odds.under) && total == odds.total) {
                        under = convertAToD(odds.under);
                        underSB = bookie(odds.book_id);
                    }
                    //Get Current Freebet Sportsbook Odds
                    if(odds.book_id == sportsbook && total == odds.total) {
                        over1 = convertAToD(odds.over);
                        under1 = convertAToD(odds.under);
                    }
                }
            }
            //Calculate Conversions
            //For Over
            if(over1 != null) {
                payout = (amount * over1) - amount;
                let wager = (payout/under);
                let profit = payout - wager;
                conversion = profit/amount * 100;
                if(freeBetOU.length == 1 || conversion > freeBetOU[1][9]) {
                    freeBetOU.splice(1,1);
                    freeBetOU.push([teams, total.toFixed(2), 
                                bookie(sportsbook), over1.toFixed(2), amount.toString(),
                                underSB, under.toFixed(2), wager.toFixed(2),
                                profit.toFixed(2), conversion.toFixed(3)]);
                }
            }
            //For under
            if(under1 != null) {
                payout = (amount * under1) - amount;
                wager = (payout/over);
                profit = payout - wager;
                conversion = profit/amount * 100;
                //Cut Lower
                if(freeBetOU.length == 1 || conversion > freeBetOU[1][9]) {
                    freeBetOU.splice(1,1);
                    freeBetOU.push([teams, total.toFixed(2),
                        overSB, over.toFixed(2), wager.toFixed(2),
                        bookie(sportsbook), under1.toFixed(2), amount.toString(),
                        profit.toFixed(2), conversion.toFixed(3)]);
                }
            }
        }
    }
    if(freeBetML.length == 1 || freeBetOU.length == 1 || freeBetML[1][9] < freeBetOU[1][9]){
        return freeBetOU;
    }
    return freeBetML;
}


module.exports = {
    getOdds,
    getOddsOU,
    getOddsSoccer,
    getFreeBet
  };