module.exports = {
	ethValidation : function ethValidation(ethAddr)
	{

		if (ethAddr.length != 42) {
			return false;
		}

		if (ethAddr.substring(0,2) != '0x' && ethAddr.substring(0,2) != '0X') {
			return false;
		}
		
		return true;
	},

	mailValidation : function mailValidation(mailAddr)
	{
		var mailRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/ ;
		if (mailRegex.test(mailAddr)) {
			return true;
		}else{
			return false;
		}
	}

}