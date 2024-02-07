module.exports = (interaction, commandObj) => {
  if (commandObj.devOnly) {
    if (interaction.member.id == "454505144068079616" || interaction.member.id == "793991682310799360") {
      return false;  
    }else{
      interaction.reply('Command ini hanya bisa digunakan developer atau admin');
      return true;
    }
  }
};