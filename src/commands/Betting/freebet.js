const { SlashCommandBuilder } = require('discord.js');
const {getFreeBet} = require('../../models/betting.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('freebet')
		.setDescription('Gives the best FreeBet conversion')
		.addStringOption(option => 
			option.setName('amount')
			.setDescription('Free Bet Amount')
			.setRequired(true))
        .addStringOption(option => 
            option.setName('sportsbook')
            .setDescription('The Sportsbook your free bet is on')
            .setRequired(true)
            .addChoices(
                { name: 'BETMGM', value: '75' },
                { name: 'FanDuel', value: '69' },
                { name: 'DraftKing', value: '68' },
                { name: 'Bet365', value: '79'},
                { name: 'Caesars', value: '123'},
                { name: 'PointsBet', value: '76'},
                { name: 'BetRivers', value: '71'}
            )),
				async execute(interaction) {
					message = await getFreeBet(parseInt(interaction.options.getString('amount')), parseInt(interaction.options.getString('sportsbook')));
                    interaction.reply("Best Free Bet\n" + message);
				},
	};

