
require.config({
	baseUrl: basePath,
	paths: {
		base: 'core/base'
	}
})

define([ 'base' ], function( base ){

	function cardId( text ){
		var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子;
		var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值，10代表X;
	
		if (text.length == 15) {   
			return isValidityBrithBy15IdCard(text);   
		}else if (text.length == 18){   
			var a_idCard = text.split("");// 得到身份证数组   
			if (isValidityBrithBy18IdCard(text)&&isTrueValidateCodeBy18IdCard(a_idCard)) {   
				return true;   
			}   
			return false;
		}
		return false;
		
		function isTrueValidateCodeBy18IdCard(a_idCard) {   
			var sum = 0; // 声明加权求和变量   
			if (a_idCard[17].toLowerCase() == 'x') {   
				a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作   
			}   
			for ( var i = 0; i < 17; i++) {   
				sum += Wi[i] * a_idCard[i];// 加权求和   
			}   
			valCodePosition = sum % 11;// 得到验证码所位置   
			if (a_idCard[17] == ValideCode[valCodePosition]) {   
				return true;   
			}
			return false;   
		}
		
		function isValidityBrithBy18IdCard(idCard18){   
			var year = idCard18.substring(6,10);   
			var month = idCard18.substring(10,12);   
			var day = idCard18.substring(12,14);   
			var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
			// 这里用getFullYear()获取年份，避免千年虫问题   
			if(temp_date.getFullYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){   
				return false;   
			}
			return true;   
		}
		
		function isValidityBrithBy15IdCard(idCard15){   
			var year =  idCard15.substring(6,8);   
			var month = idCard15.substring(8,10);   
			var day = idCard15.substring(10,12);
			var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
			// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
			if(temp_date.getYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){   
				return false;   
			}
			return true;
		}   
		 
	}

	var Regular = {
	
		noBlank: function( value ){
			return !!value;
		},

		min: function( value, rule ){
			return value.length >= rule;
		},

		max: function( value, rule ){
			return value.length <= rule;
		},

		typeZh: function( value ){
			return /^[\u4E00-\u9FA5\uf900-\ufa2d\uFE30-\uFFA0]+$/.test( value );
		},

		typeZEI: function( value ){
			return /^[\u4E00-\u9FA5\uf900-\ufa2d\uFE30-\uFFA0a-zA-Z\(\)\-\_]+$/.test( value );
		},
		
		typeZE: function( value ){
			return /^[\u4E00-\u9FA5\uf900-\ufa2d\uFE30-\uFFA0a-zA-Z]+$/.test( value );
		},

		typeEN: function( value ){
			return /^[0-9|a-z|A-Z]+$/.test( value );
		},

		typeNum: function( value ){
			return /^[0-9]+$/.test( value );
		},

		typePhone: function( value ){
			return /^1[0-9]{10}$/.test( value );
		},

		typeEmail: function( value ){
			return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)
		},

		typeIdCard: function( value ){
			return cardId( value );
		}

	}

	function check( rules, cb ){
	
		var rule,
			prompt,
			codex,
			value = this.value;
		for ( rule in rules ){

			prompt = rules[ rule ];
			base.isArray( prompt ) && ( codex = prompt[0] ) && ( prompt = prompt[1] );

			if( rule == 'self' ){
				if( rules[ rule ].call( this, cb ) !== true ){
					return false;
				};
			} else if( !Regular[ rule ]( value, codex ) ){
				cb( prompt )
				return false;
			}
			cb( '' );
		}
		return true;

	}

	function validate( el, events, rules, cb ){
		
		if( rules ){

			cb = rules[1];
			rules = rules[0];
			$.each( events, function( k, event ){
				el.on( event, function(){
					check.call( this, rules, cb );
				});

			});
		
		} else {
			
			cb = events[1];
			rules = events[0];
			return check.call( el.get( 0 ), rules, cb );
		
		}

	}
	
	return validate

})
