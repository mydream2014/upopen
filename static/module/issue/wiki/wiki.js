
require.config({
	map: {
		'*': {
			'css': './core/css.min'
		}
	},
	baseUrl: basePath,
	paths: {
		base: 'core/base',
		dialog: 'widget/dialog/dialog',
		all: 'public/all',
		doc: 'public/zhdoc'
	}
})

define( ['base', 'dialog', 'doc', 'all'],function( base, Dialog, DOC ){
   var data = [
			{
				title: '关于仟金顶',
				items: [
						{
							title:'如何注册成为仟金顶会员？',
							content: '在仟金顶官网www.qjdchina.com上注册成功以后，只填写简单的企业信息便可成为仟金顶会员。'
						},
						{
							title:'成为仟金顶会员需要符合哪些要求？',
							content: '仟金顶目标客户为特定行业具有一定规模的企业客户。'
						},
						{
							title:'如何申请供应链金融服务？',
							content: '我们的线上贷款申请平台正在加紧建设中，目前需贷款服务可以咨询0571-86539195我们的工作人员将会线下与您沟通，期待与您的合作。'
						},
						{
							title:'加入仟金顶平台以后资金安全吗？',
							content: '仟金顶将与第三方银行合作监管资金安全，经销商自有资金直接打款至指定的上游厂家，所以资金绝对安全。'
						},
						{
							title:'加入仟金顶有什么好处？',
							content: '获得仟金顶供应链金融服务无需担保抵押，同样的自有资金可以做原来三倍以上的业务量，获得利润和市场份额的快速提升。'
						}
				]
			},
			{
				title: '关于仟金宝',
				items: [
							{
								title:'什么是仟金宝？',
								content: '仟金宝是仟金顶公司推出的第一款专业面向广大经销商的供应链金融产品，目的是解决市场上客户融资难，成本高，自有资金紧张的问题。'
							},
							{
								title:'申请使用仟金宝需要哪些条件？',
								content: '未来不同金融产品对企业要求不同。请参考相关产品介绍。'
							},
							{
								title:'仟金宝金融服务是否需要抵押或担保?',
								content: '申请仟金宝供应链金融服务不需要抵押或者担保，提供抵押将会获得更高的贷款额度。'
							}
					]
			},
			{
				title: '关于供应链金融服务',
				items: [
							{
								title:'仟金宝融资到账时间？',
								content: '自签收到您的贷款资料始，若符合仟金宝放款要求将在15个工作日左右将全款打到指定上游厂家，确保您订单的发货时间。'
							},
							{
								title:'融资成功以后如何提取现金？',
								content: '全款自动打款至指定的上游厂家，贷款资金专款专用。'
							},
							{
								title:'如何还款？',
								content: '通过仟金顶指定的银行账户还款'
							}
					]
			},
			{
				title: '注册与登陆',
				items: [
							{
								title:'如何更改登陆的手机号码?',
								content: '为了保障我们所有注册用户的信息安全，在完成注册之后，用户名是不能修改的。如需更改登陆手机号请联系我们的工作人员并提供相关有效证明，验真无误才可修改该企业登陆的手机号码。'
							},
							{
								title:'如何修改密码？',
								content: '若忘记登录密码，可在首页点击忘记密码，通过注册手机接收的验证码来修改登录密码。'
							},
							{
								title:'手机号码遗失无法接收验证码怎么办？',
								content: '需更改登陆手机号请联系我们的工作人员并提供相关有效证明，验真无误才可修改该企业登陆的手机号码。'
							},
							{
								title:'注册以后企业信息能更改吗？',
								content: '为确保供应链贸易的真实性，防止洗钱或者任何骗贷的行为，除了企业常用联系人相关信息审核通过的用户企业资料无法自行修改。需更改更改企业资料请联系我们的工作人员并提供相关有效证明。'
							},
							{
								title:'手机收不到验证码怎么办?',
								content: '1.可能被手机APP屏蔽了，请进行相关设置。 2.运营商信息平台不稳定，请稍后再次尝试。'
							}
					]
			}
		];


	init( data );

	function init( data ){
		renderAll( data );
	}

	function renderAll( data ){
		var items = [];
		$.each( data, function( k,  v ){
			items = items.concat( createAll( v ));
		});
		$( '#wiki_part' ).append( items );
	}

	function createAll( data ){
		var el = $( '<div>' ).addClass( 'wiki_item' );
		el.append( $('<h3>').html( data.title ).addClass( 'wiki_item_h3') )	;
		el.append( render( data.items ) );
		return el;
	}

	function render( data ){
		var items = [];
		$.each( data, function( k,  v ){
			items = items.concat( create( k+1, v ));
		});
		return items;
	}

	function create( k, v ){
		var t = $( '<h4>'  ).addClass( 'wiki_item_h4' ).html( k + '、' + v.title + '<tt></tt>' ),
			c = $( '<p>' ).html( '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + v.content ).addClass( 'wiki_item_p' ),
			n = true;
		t.on( 'click', function(){
			c.toggle();
			n ? t.addClass( 'wiki_item_h4_open' ) : t.removeClass( 'wiki_item_h4_open' );
			n = !n;
			
		});
		return [t,c];
	}

});

