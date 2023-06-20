const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const {getOdds, getOddsOU, getOddsSoccer} = require('../../models/betting.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('odds')
		.setDescription('Gives a list of todays plays with best odds!')
		.addStringOption(option => 
			option.setName('type')
			.setDescription('Which odds type to search')
			.setRequired(true)
				.addChoices(
					{ name: 'NBA Moneyline', value: 'NBA_ML' },
					{ name: 'MLB Moneyline', value: 'MLB_ML' },
					{ name: 'NHL Moneyline', value: 'NHL_ML'},
					{ name: 'SOCCER Moneyline', value: 'SOCCER_ML'},
					{ name: 'NBA O/U', value: 'NBA_OU' },
					{ name: 'MLB O/U', value: 'MLB_OU'},
					{ name: 'NHL O/U', value: 'NHL_OU'},
					{ name: 'SOCCER O/U', value: 'SOCCER_OU'},
					{ name: 'ALL', value: 'ALL'}
				)),
	async execute(interaction) {
		type = interaction.options.getString('type');
		if (type == "SOCCER_ML") {
			const message = await getOddsSoccer(type, false);
			stringToTxt(type, message, interaction);
		}
		else if(type.slice(-2) == "ML") {
			const message = await getOdds(type, false);
			stringToTxt(type, message, interaction);
		}
		else if(type.slice(-2) == "OU") {
			const message = await getOddsOU(type, false);
			stringToTxt(type, message, interaction);
		}
		else {
			let message = "NBA MoneyLine\n" + await getOdds("NBA_ML", false) + "\n\n";
			message += "MLB MoneyLine\n" + await getOdds("MLB_ML", false) + "\n\n";
			message += "NHL MoneyLine\n" + await getOdds("NHL_ML", false) + "\n\n";
			message += "SOCCER MoneyLine\n" + await getOddsSoccer("SOCCER_ML", false) + "\n\n";
			message += "NBA Over/Under\n" + await getOddsOU("NBA_OU", false) + "\n\n";
			message += "MLB Over/Under\n" + await getOddsOU("MLB_OU", false) + "\n\n";
			message += "NHL Over/Under\n" + await getOdds("NHL_OU", false) + "\n\n";
			message += "SOCCER Over/Under\n" + await getOddsOU("SOCCER_OU", false) + "\n\n";
			stringToTxt("All Sports", message, interaction);
		}
	},
};

//If Message is too long convert to txt
async function stringToTxt (type, message, interaction) {
	if(message.length < 2000 && type != "SOCCER_ML" && type != "All Sports") {
		await interaction.reply(type + "\n```" + message + "```");
		return;
	}
	message = type + "\n\n" + message;
    fs.writeFile('message.txt', message, async (err) => {
        if (err) {
          console.error(err);
          return;
        }
		await interaction.reply({
			files: [{
			  attachment: './message.txt',
			  name: type + '.txt'
			}]
		  });
		  fs.unlink('message.txt', (err) => {
			if (err) {
			  console.error(err);
			  return;
			}
		  });
		});
}

