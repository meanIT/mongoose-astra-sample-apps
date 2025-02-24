'use strict';

const { SlashCommandBuilder } = require('discord.js');
const Bot = require('../models/bot');

module.exports = {
  data: new SlashCommandBuilder().setName('count').setDescription('counts documents in the database'),
  async execute(interaction) {
    const num = await Bot.find({}).then(res => res.length);
    console.log(new Date(), 'count', num);
    await interaction.reply(num.toString());
  }
};
